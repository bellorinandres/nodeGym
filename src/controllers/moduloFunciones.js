import moment from "moment";

export const calcularFechaFinal = (fechaInicio, tipoMembresia) => {
  // 'fechaInicio' debe ser una cadena en el formato 'YYYY-MM-DD'
  // Puedes convertirla a un objeto de fecha con moment.js
  const fechaInicioObj = moment(fechaInicio, "YYYY-MM-DD");

  // Realiza el cálculo de la fecha final según el 'tipoMembresia'
  let fechaFinalObj;

  if (tipoMembresia === "1") {
    fechaFinalObj = fechaInicioObj.clone().add(7, "days");
  } else if (tipoMembresia === "2") {
    fechaFinalObj = fechaInicioObj.clone().add(1, "month");
  } else if (tipoMembresia === "3") {
    fechaFinalObj = fechaInicioObj.clone().add(3, "months");
  } else {
    // Tipo de membresía no válido
    throw new Error("Tipo de membresía no válido");
  }

  // Devuelve la fecha final en el formato 'YYYY-MM-DD'
  return fechaFinalObj.format("YYYY-MM-DD");
};

export const cacularEdad = (fechaNacimiento) => {
  const fechaNacimientoDate = new Date(fechaNacimiento);
  const hoy = new Date();

  // Calcula la diferencia en milisegundos entre la fecha actual y la fecha de nacimiento
  const diferenciaMilisegundos = hoy - fechaNacimientoDate;

  // Convierte la diferencia de milisegundos a años
  const edad = Math.floor(
    diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 365.25)
  );

  return edad;
};
