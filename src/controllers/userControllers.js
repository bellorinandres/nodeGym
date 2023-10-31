import pool from "../database.js";

function cacularEdad(fechaNacimiento) {
  const fechaNacimientoDate = new Date(fechaNacimiento);
  const hoy = new Date();

  // Calcula la diferencia en milisegundos entre la fecha actual y la fecha de nacimiento
  const diferenciaMilisegundos = hoy - fechaNacimientoDate;

  // Convierte la diferencia de milisegundos a años
  const edad = Math.floor(
    diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 365.25)
  );

  return edad;
}

// Lista todas las Boletas con los Datos de Nombre y Apellido del cliente
export const listarBoletas = async (req, res) => {
  try {
    const sql = `
    SELECT
      b.idboleta,
      DATE_FORMAT(b.fechaEnd, '%d/%m/%Y') AS fecha_formateada,
      m.tipoPago,
      (SELECT CONCAT(c.nombreCliente, ' ', c.apellidoCliente) FROM cliente AS c WHERE c.idCliente = b.idCliente) AS nombreCompleto
    FROM boleta AS b
    INNER JOIN metodopago AS m ON b.metodoPago = m.idmetodopago
    ORDER BY b.fechaEnd ASC;
  `;
    const [result] = await pool.execute(sql);
    res.render("boletas/boletasViews", { boletas: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Trae el Metodo de Pago y la Menbresia
export const addBoletas = async (req, res) => {
  try {
    // Consulta para obtener métodos de pago
    const sqlMetodoPago = "SELECT * FROM metodopago;";
    const [consultaMetodoPago] = await pool.execute(sqlMetodoPago);

    // Consulta para obtener membresías
    const sqlMembresia = "SELECT * FROM menbresia;";
    const [consultaMembresia] = await pool.execute(sqlMembresia);

    // Renderizar la vista con datos de métodos de pago y membresías
    res.render("boletas/addBoletas", {
      metodoPago: consultaMetodoPago,
      membresia: consultaMembresia,
    });
  } catch (error) {
    // Manejo de errores: Puedes registrar el error o enviar una respuesta de error al cliente
    console.error("Error en addBoletas:", error);
    res.status(500).json({ error: "Error en la consulta" });
  }
};
// En esta Funcion agregamos una nueva boleta con una persona nueva
// --  Por Hacer, Verificaciones
export const newBoleta = async (req, res) => {
  const {
    numeroIdentidad,
    nombre,
    apellido,
    telefono,
    correo,
    fechaNac,
    fechaInicio,
    tipoMembresia,
    metodoPago,
    totalPago,
  } = req.body;
  const conn = await pool.getConnection();
  try {
    // Iniciar la transacción
    await conn.beginTransaction();
    // Aqui Insertamos los datos de la persona
    const [clientResult] = await conn.execute(
      "INSERT INTO cliente(dniCliente, nombreCliente, apellidoCliente,emailCliente, telefono, fechaNacimiento) VALUES (?,?,?,?,?,?)",
      [numeroIdentidad, nombre, apellido, correo, telefono, fechaNac]
    );
    // Recoge el ultimo id Insertado
    const lastId = clientResult.insertId;

    await conn.execute(
      "INSERT INTO boleta(idCliente, fechaBoleta, fechaStart, fechaEnd, idMenbresiaBoleta, metodoPago, totalBoleta) VALUES(?, NOW(), ?, (SELECT calcularFechaFinal(?, ?)),?, ?, ?)",
      [
        lastId,
        fechaInicio,
        fechaInicio,
        tipoMembresia,
        tipoMembresia,
        metodoPago,
        totalPago,
      ]
    );

    res.render("boletas/boletasViews");
    // Confirmar la transacción
    await conn.commit();

    res.status(200).json({ message: "Datos insertados correctamente" });
  } catch (error) {
    // Deshacer la transacción en caso de error
    await conn.rollback();

    console.error(error);
    res.status(500).json({ error: "Error al insertar datos" });
  }
};
// Lista todos los Clientes
export const listarClientes = async (req, res) => {
  try {
    const sql = `
    SELECT idCliente, dniCliente,telefono,CONCAT(nombreCliente, ' ', apellidoCliente) AS nombreCompleto FROM cliente;
    `;
    const [result] = await pool.execute(sql);
    res.render("clientes/clientesViews", { clientes: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const detalleBoleta = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const [detalleDeBoleta] = await pool.execute(
      "SELECT * FROM boleta WHERE idboleta = ?",
      [id]
    );

    res.json(detalleDeBoleta);
  } catch (error) {}
};
