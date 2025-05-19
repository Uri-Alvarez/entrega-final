const rutinas = [
  {
    id: 1,
    titulo: "Mañanas Productivas",
    imagen: "img/manana.jpg",
    Habitos: ["Despertar 6:00 am", "Leer 30 min", "Estiramientos"],
    diasCompletados: 15,
    diasTotales: 30,
  },
  {
    id: 2,
    titulo: "Noche Relajada",
    imagen: "img/noche.jpg",
    Habitos: ["No usar pantalla 1h antes", "Leer ficción", "Meditar 10 min"],
    diasCompletados: 10,
    diasTotales: 21,
  },
  {
    id: 3,
    titulo: "Rutina Fitness",
    imagen: "img/fitness.jpg",
    Habitos: ["Ejercicio 30 min", "Beber 2L de agua", "Comida balanceada"],
    diasCompletados: 7,
    diasTotales: 30,
  }
];

function generarTarjeta(rutina) {
  const card = document.createElement('div');
  card.className = 'rutina-card';
  card.setAttribute('data-rutina-id', rutina.id);

  // Contenido textual
  const contenido = document.createElement('div');
  contenido.className = 'rutina-contenido';

  const titulo = document.createElement('h3');
  titulo.textContent = rutina.titulo;

  const lista = document.createElement('ul');
  lista.className = 'Habitos';
  rutina.Habitos.forEach(habito => {
    const li = document.createElement('li');
    li.textContent = habito;
    lista.appendChild(li);
  });

  const progreso = document.createElement('div');
  progreso.className = 'progreso';

  const textoProgreso = document.createElement('span');
  textoProgreso.textContent = `${rutina.diasCompletados}/${rutina.diasTotales} días`;

  const barra = document.createElement('div');
  barra.className = 'cuadros-progreso';

  for (let i = 0; i < rutina.diasTotales; i++) {
    const cuadro = document.createElement('div');
    cuadro.className = 'cuadro';
    if (i < rutina.diasCompletados) {
      cuadro.classList.add('activo');
    }
    barra.appendChild(cuadro);
  }

  progreso.appendChild(textoProgreso);
  progreso.appendChild(barra);

  const boton = document.createElement('button');
  boton.className = 'btn-unirse';
  boton.textContent = 'Unirme a la rutina';
  boton.onclick = () => {
    alert(`Te has unido a: ${rutina.titulo}`);
    // Aquí podrías hacer una llamada a Supabase más adelante
  };

  contenido.appendChild(titulo);
  contenido.appendChild(lista);
  contenido.appendChild(progreso);
  contenido.appendChild(boton);

  // Imagen lateral
  const imagen = document.createElement('img');
  imagen.src = rutina.imagen;
  imagen.alt = rutina.titulo;
  imagen.className = 'rutina-img-lateral';

  card.appendChild(contenido);
  card.appendChild(imagen);

  return card;
}

function cargarRutinas() {
  const contenedor = document.getElementById('rutinas-container');
  rutinas.forEach(rutina => {
    const tarjeta = generarTarjeta(rutina);
    contenedor.appendChild(tarjeta);
  });
}

// Espera a que cargue el DOM
document.addEventListener('DOMContentLoaded', cargarRutinas);
