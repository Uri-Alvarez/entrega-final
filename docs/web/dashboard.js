// Inicializa Supabase
const supabaseUrl = 'https://uyandldhylkhzqcpoygt.supabase.co'; // <-- reemplaza con tu URL real
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YW5kbGRoeWxraHpxY3BveWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjY4OTIsImV4cCI6MjA2MjA0Mjg5Mn0.TFodK54rV4B8hgLyh0oAu9wwZWWCv5dBRC793E4DHlo';           // <-- reemplaza con tu clave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función para cargar las rutinas desde Supabase 
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    alert("Debes iniciar sesión para ver el dashboard.");
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('usuario-nombre').textContent = user.user_metadata?.nombre || user.email;

  const contenedor = document.getElementById('mis-rutinas');

  // Consulta rutinas creadas por este usuario con sus mini-rutinas
  const { data: rutinas, error } = await supabase
    .from('rutinas')
    .select(`
      id, titulo, descripcion,
      mini_rutinas (id, titulo, orden)
    `)
    .eq('creador_id', user.id);

  if (error) {
    console.error("Error al cargar rutinas:", error.message);
    contenedor.innerHTML = "<p>Ocurrió un error al cargar las rutinas.</p>";
    return;
  }

  if (!rutinas || rutinas.length === 0) {
    contenedor.innerHTML = "<p>No tienes rutinas creadas.</p>";
    return;
  }

  contenedor.innerHTML = ''; // Limpiar contenedor

  rutinas.forEach(rutina => {
    const card = document.createElement('div');
    card.className = 'rutina-card';

    const titulo = document.createElement('h3');
    titulo.textContent = rutina.titulo;

    const descripcion = document.createElement('p');
    descripcion.textContent = rutina.descripcion;

    const lista = document.createElement('ul');
    rutina.mini_rutinas
      .sort((a,b) => a.orden - b.orden)
      .forEach(mini => {
        const li = document.createElement('li');
        li.textContent = mini.titulo;
        lista.appendChild(li);
      });

    card.appendChild(titulo);
    card.appendChild(descripcion);
    card.appendChild(lista);

    contenedor.appendChild(card);
  });

  // Cerrar sesión
  document.getElementById('cerrar-sesion').addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error al cerrar sesión: " + error.message);
    } else {
      window.location.href = "login.html";
    }
  });
});