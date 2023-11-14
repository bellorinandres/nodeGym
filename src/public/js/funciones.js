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

// Funcion Para calcular edad

$(document).ready(function () {
  $("#searchForm").submit(function (event) {
    event.preventDefault();
    const searchTerm = $("#searchInput").val();

    $.ajax({
      type: "GET",
      url: `/buscar?query=${query}`, // Ruta de búsqueda en el servidor
      success: function (data) {
        // Procesa los resultados recibidos del servidor y muéstralos en #searchResults
        $("#searchResults").html(JSON.stringify(data));
      },
      error: function (error) {
        console.error("Error en la solicitud AJAX: " + error);
      },
    });
  });
});
// Cambio de Color
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light")) {
      body.classList.remove("light");
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
      body.classList.add("light");
    }
  });
});
