// Variable que almacena el índice de la diapositiva actualmente visible
let currentSlide = 0;

// Selecciona todos los elementos con la clase 'slide' y los guarda en una lista
const slides = document.querySelectorAll('.slide');

/**
 * Muestra la diapositiva correspondiente al índice dado
 * @param {number} index - Índice de la diapositiva que se desea mostrar
 */
function showSlide(index) {
  // Recorre todas las diapositivas
  slides.forEach((slide, i) => {
    // Elimina la clase 'active' de todas las diapositivas para ocultarlas
    slide.classList.remove('active');

    // Si el índice actual del bucle coincide con el índice deseado,
    // se le agrega la clase 'active' para mostrarla
    if (i === index) slide.classList.add('active');
  });
}

/**
 * Avanza a la siguiente diapositiva y la muestra
 */
function nextSlide() {
  // Incrementa el índice de la diapositiva actual en 1
  // y usa el operador módulo (%) para reiniciar a 0 cuando llega al final
  currentSlide = (currentSlide + 1) % slides.length;

  // Muestra la nueva diapositiva correspondiente al índice actualizado
  showSlide(currentSlide);
}

// Ejecuta la función nextSlide automáticamente cada 5000 milisegundos (5 segundos)
setInterval(nextSlide, 5000);
