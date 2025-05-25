document.addEventListener('DOMContentLoaded', async () => {
  // Verificar usuario autenticado
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("Debes iniciar sesión para acceder al dashboard.");
    window.location.href = "login.html";
    return;
  }

  // Mostrar nombre del usuario
  document.getElementById('usuario-nombre').textContent =
    user.user_metadata?.nombre || user.email;

  // Obtener rutinas desde la base de datos
  const { data: rutinas, error } = await supabase
    .from('rutinas')
    .select('id, titulo, descripcion');

  const contenedor = document.getElementById('mis-rutinas');

  if (error || !rutinas) {
    contenedor.innerHTML = '<p>No se pudieron cargar las rutinas.</p>';
    console.error(error);
    return;
  }

  // Crear tarjetas para cada rutina
  rutinas.forEach(rutina => {
    const card = document.createElement('div');
    card.className = 'rutina-card';

    const titulo = document.createElement('h3');
    titulo.textContent = rutina.titulo;

    const descripcion = document.createElement('p');
    descripcion.textContent = rutina.descripcion;

    card.appendChild(titulo);
    card.appendChild(descripcion);
    contenedor.appendChild(card);
  });

  // Cerrar sesión
  document.getElementById('cerrar-sesion').addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error al cerrar sesión.");
    } else {
      window.location.href = "login.html";
    }
  });
});
