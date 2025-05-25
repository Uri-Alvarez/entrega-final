// Inicializa Supabase
const supabaseUrl = 'https://uyandldhylkhzqcpoygt.supabase.co'; // <-- reemplaza con tu URL real
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5YW5kbGRoeWxraHpxY3BveWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjY4OTIsImV4cCI6MjA2MjA0Mjg5Mn0.TFodK54rV4B8hgLyh0oAu9wwZWWCv5dBRC793E4DHlo';           // <-- reemplaza con tu clave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Obtener el usuario autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    alert("Debes iniciar sesión para ver el dashboard.");
    window.location.href = '/login.html'; // redirige si no está logueado
    return;
  }

  // 2. Mostrar nombre del usuario
  document.getElementById('usuario-nombre').textContent =
    user.user_metadata?.nombre || user.email;

  const contenedor = document.getElementById('mis-rutinas');

  // 3. Obtener rutinas + mini_rutinas asociadas
  const { data: rutinas, error } = await supabase
    .from('rutinas')
    .select(`
      id,
      titulo,
      descripcion,
      imagen_url,
      mini_rutinas (
        id,
        titulo,
        orden
      )
    `);

  if (error) {
    console.error("Error al cargar rutinas:", error.message);
    contenedor.innerHTML = "<p>Ocurrió un error al cargar las rutinas.</p>";
    return;
  }

  // 4. Generar tarjetas por rutina
  for (const rutina of rutinas) {
    const card = document.createElement('div');
    card.className = 'rutina-card';

    const contenido = document.createElement('div');
    contenido.className = 'rutina-contenido';

    const titulo = document.createElement('h3');
    titulo.textContent = rutina.titulo;

    const descripcion = document.createElement('p');
    descripcion.textContent = rutina.descripcion;

    const lista = document.createElement('ul');
    lista.className = 'mini-rutinas';

    // Ordenar y mostrar mini-rutinas
    rutina.mini_rutinas
      .sort((a, b) => a.orden - b.orden)
      .forEach(mini => {
        const li = document.createElement('li');
        li.textContent = mini.titulo;
        lista.appendChild(li);
      });

    // Simulación de progreso
    const dias_completados = 0;
    const total_dias = 30;

    const progreso = document.createElement('div');
    progreso.className = 'progreso';

    const span = document.createElement('span');
    span.textContent = `${dias_completados}/${total_dias} días`;

    const barra = document.createElement('div');
    barra.className = 'cuadros-progreso';
    for (let i = 0; i < total_dias; i++) {
      const cuadro = document.createElement('div');
      cuadro.className = 'cuadro';
      if (i < dias_completados) cuadro.classList.add('activo');
      barra.appendChild(cuadro);
    }

    const botonUnirse = document.createElement('button');
    botonUnirse.textContent = 'Unirme a esta rutina';
    botonUnirse.className = 'boton-unirse';

    // Acción al hacer clic en "unirse"
    botonUnirse.addEventListener('click', async () => {
      const { error: insertError } = await supabase
        .from('usuarios_rutinas')
        .insert({
          usuario_id: user.id,
          rutina_id: rutina.id,
          progreso_dias: 0
        });

      if (insertError) {
        console.error("Error al unirse a la rutina:", insertError.message);
        alert("Error al unirte a la rutina.");
      } else {
        alert(`¡Te uniste a la rutina: ${rutina.titulo}!`);
      }
    });

    progreso.appendChild(span);
    progreso.appendChild(barra);

    contenido.appendChild(titulo);
    contenido.appendChild(descripcion);
    contenido.appendChild(lista);
    contenido.appendChild(progreso);
    contenido.appendChild(botonUnirse);

    const img = document.createElement('img');
    img.src = rutina.imagen_url || 'https://via.placeholder.com/150';
    img.alt = rutina.titulo;
    img.className = 'rutina-img-lateral';

    card.appendChild(contenido);
    card.appendChild(img);

    contenedor.appendChild(card);
  }

  document.getElementById('cerrar-sesion').addEventListener('click', async (e) => {
        e.preventDefault(); // Previene navegación por el <a>
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Error al cerrar sesión: " + error.message);
        } else {
            window.location.href = "login.html"; // Redirige tras cerrar sesión
        }
    });

});

