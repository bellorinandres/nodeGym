// Obtener el elemento del campo de fecha de inicio
const fechaInicioInput = document.getElementById("fechaInicio");

// Calcular la fecha mínima y máxima permitida (hoy y 7 días en el futuro)
const fechaActual = new Date();
const fechaMaxima = new Date(fechaActual);
fechaMaxima.setDate(fechaMaxima.getDate() + 7);

// Formatear la fecha mínima en el formato "YYYY-MM-DD"
const fechaMinima = fechaActual.toISOString().split("T")[0];

// Configurar los atributos "min" y "max" en el campo de fecha
fechaInicioInput.setAttribute("min", fechaMinima);
fechaInicioInput.setAttribute("max", fechaMaxima.toISOString().split("T")[0]);

// Event listener para bloquear los domingos
fechaInicioInput.addEventListener("change", function () {
  const fechaSeleccionada = new Date(fechaInicioInput.value);
  if (fechaSeleccionada < fechaActual) {
    fechaInicioInput.value = fechaMinima;
  } else if (fechaSeleccionada.getDay() === 0) {
    // Si se selecciona un domingo, avanzar un día para evitarlo
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);
    fechaInicioInput.value = fechaSeleccionada.toISOString().split("T")[0];
  }
});

// Funcion Para calcular edad
 
