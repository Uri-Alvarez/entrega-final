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

    // Botones de acción
    const btnEditar = document.createElement('button');
    btnEditar.textContent = '✏️ Editar';
    btnEditar.className = 'btn-editar';

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '🗑️ Eliminar';
    btnEliminar.className = 'btn-eliminar';

// Evento editar
      btnEditar.addEventListener('click', async () => {
        const nuevoTitulo = prompt("Nuevo título:", rutina.titulo);
        const nuevaDescripcion = prompt("Nueva descripción:", rutina.descripcion);

        if (nuevoTitulo !== null && nuevaDescripcion !== null) {
          const { error } = await supabase
            .from('rutinas')
            .update({ titulo: nuevoTitulo, descripcion: nuevaDescripcion })
            .eq('id', rutina.id);

          if (error) {
            alert("❌ Error al actualizar rutina.");
            console.error(error);
          } else {
            alert("✅ Rutina actualizada.");
            cargarRutinas();
          }
        }
      });

      // Evento eliminar
      btnEliminar.addEventListener('click', async () => {
        const confirmar = confirm(`¿Seguro que deseas eliminar "${rutina.titulo}"?`);
        if (!confirmar) return;

        const { error } = await supabase
          .from('rutinas')
          .delete()
          .eq('id', rutina.id);

        if (error) {
          alert("❌ Error al eliminar rutina.");
          console.error(error);
        } else {
          alert("✅ Rutina eliminada.");
          cargarRutinas();
        }
      });

    // Agregar elementos al card
    card.appendChild(titulo);
    card.appendChild(descripcion);
    card.appendChild(btnEditar);
    card.appendChild(btnEliminar);
    contenedor.appendChild(card);
  });

    // Cargar rutinas al iniciar
  cargarRutinas();

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
