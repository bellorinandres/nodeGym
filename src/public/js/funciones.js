// Obtener el elemento del campo de fecha de inicio
const fechaInicioInput = document.getElementById("fechaInicio");

// Calcular la fecha mínima y máxima permitida (hoy y 7 días en el futuro)
const fechaActual = new Date();
const fechaMaxima = new Date(fechaActual);
fechaMaxima.setDate(fechaMaxima.getDate() + 30);

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

$(document).ready(function () {
  // Configura Datepicker
  $("#datepicker").datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    todayHighlight: true,
    autoclose: true,
  });

  // Maneja el evento de selección de fecha
  $("#datepicker").on("changeDate", function (e) {
    const fechaSeleccionada = e.format();

    // Realiza una solicitud al servidor para obtener los datos por la fecha seleccionada
    $.ajax({
      method: "POST",
      url: "/control/:fecha",
      data: { fecha: fechaSeleccionada },
      success: function (response) {
        const datos = response.datos;
        // Actualiza la vista con los datos obtenidos
        $(
          "#datos-por-fecha"
        ).html(/* Formatea y muestra los datos como prefieras */);
      },
      error: function (error) {
        console.error("Error al obtener datos por fecha:", error);
      },
    });
  });
});
