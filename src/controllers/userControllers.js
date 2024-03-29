import pool from "../database.js";
import { calcularFechaFinal } from "./moduloFunciones.js";

/*
 * Lista todas las Boletas con
 * Datos de Nombre y Apellido del cliente
 */
export const listarBoletas = async (req, res) => {
  try {
    const sql = `
    SELECT
      b.idCliente,
      b.idboleta,
      DATE_FORMAT(b.fechaEnd, '%d/%m/%Y') AS fecha_formateada,
      m.tipoPago,
      (SELECT CONCAT(c.nombreCliente, ' ', c.apellidoCliente) FROM cliente AS c WHERE c.idCliente = b.idCliente) AS nombreCompleto
    FROM boleta AS b
    INNER JOIN metodoPago AS m ON b.metodoPago = m.idmetodoPago
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
    const sqlMetodoPago = "SELECT * FROM metodoPago;";
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
      "INSERT INTO cliente(dniCliente, nombreCliente, apellidoCliente, telefono ) VALUES (?,?,?,?)",
      [numeroIdentidad, nombre, apellido, telefono]
    );
    // Recoge el ultimo id Insertado
    const lastId = clientResult.insertId;

    const fechaFinal = calcularFechaFinal(fechaInicio, tipoMembresia);
    console.log(fechaFinal);
    await conn.execute(
      "INSERT INTO boleta(idCliente, fechaBoleta, fechaStart, fechaEnd, idMenbresiaBoleta, metodoPago, totalBoleta) VALUES(?, NOW(), ?, ?,?, ?, ?)",
      [lastId, fechaInicio, fechaFinal, tipoMembresia, metodoPago, totalPago]
    );

    // res.render("boletas/boletasViews");
    // Confirmar la transacción
    await conn.commit();

    res.status(200).render("boletas/boletasViews");
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

export const detalleCliente = async (req, res) => {
  const { id } = req.params;
  const queryCliente =
    "SELECT *, DATE_FORMAT(fechaNacimiento, '%d/%m/%Y') AS fNac FROM cliente WHERE idCliente = ?";
  const [clienteData] = await pool.query(queryCliente, id);
  const queryBoleta = `SELECT
      b.totalBoleta,
      b.idboleta,
      DATE_FORMAT(b.fechaBoleta, '%d/%m/%Y') AS fBoleta,
      DATE_FORMAT(b.fechaStart, '%d/%m/%Y') AS fStart,
      DATE_FORMAT(b.fechaEnd, '%d/%m/%Y') AS fEnd,
      es.nombreEstatus,
      mp.tipoPago,
      m.descripcion
    FROM
      boleta AS b
    INNER JOIN metodoPago AS mp ON b.metodoPago = mp.idmetodoPago
    INNER JOIN Estatus AS es ON b.statusBoleta = es.idstatus
    INNER JOIN menbresia AS m ON b.idMenbresiaBoleta = m.idmenbresia
    WHERE
    b.idcliente = ?`;
  const [clienteBoleta] = await pool.query(queryBoleta, id);
  res.render("clientes/detalleCliente", {
    clienteData: clienteData,
    clienteBoleta: clienteBoleta,
  });
};

export const detalleBoleta = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT
        b.totalBoleta,
        b.idboleta,
        DATE_FORMAT(b.fechaBoleta, '%d/%m/%Y') AS fBoleta,
        DATE_FORMAT(b.fechaStart, '%d/%m/%Y') AS fStart,
        DATE_FORMAT(b.fechaEnd, '%d/%m/%Y') AS fEnd,
        (SELECT CONCAT(c.nombreCliente, ' ', c.apellidoCliente) FROM cliente AS c WHERE c.idCliente = b.idCliente) AS nombreCompleto,
        es.nombreEstatus,
        mp.tipoPago,
        m.descripcion
      FROM
        boleta AS b
      INNER JOIN metodoPago AS mp ON b.metodoPago = mp.idmetodoPago
      INNER JOIN Estatus AS es ON b.statusBoleta = es.idstatus
      INNER JOIN menbresia AS m ON b.idMenbresiaBoleta = m.idmenbresia
      WHERE
      b.idboleta = ?`;

    const [dataBoleta] = await pool.execute(sql, [id]);

    res.render("boletas/detalleBoleta", { boleta: dataBoleta });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buscador = async (req, res) => {
  const { query } = req.params;

  try {
    const consulta = `SELECT * FROM cliente WHERE nombreCliente LIKE ? OR apellidoCliente LIKE ? OR dniCliente LIKE ? `;
    const [results, filas] = await pool.query(consulta, [query, query, query]);
    console.log(query);
    // Procesa los resultados y envíalos de vuelta al cliente
    res.json(results);
  } catch (error) {
    console.error("Error en la consulta: " + error);
    res.status(500).json({ error: "Error en la consulta" });
  }
};

export const insertBoletaCliente = async (req, res) => {
  const { id } = req.params;
  const consulta = `SELECT
    idCliente,
    CONCAT(nombreCliente, ' ', apellidoCliente) AS nombreCompleto,
    dniCliente
  FROM
    cliente
  WHERE
    idCliente = ?`;

  const sqlMetodoPago = "SELECT * FROM metodoPago;";
  const [consultaMetodoPago] = await pool.execute(sqlMetodoPago);

  // Consulta para obtener membresías
  const sqlMembresia = "SELECT * FROM menbresia;";
  const [consultaMembresia] = await pool.execute(sqlMembresia);

  const [result] = await pool.query(consulta, id);
  console.log(result);
  res.render("clientes/addBoletaCliente", {
    metodoPago: consultaMetodoPago,
    membresia: consultaMembresia,
    dataCliente: result,
  });
};

export const addBoletaCliente = async (req, res) => {
  const { id } = req.params;
  const { tipoMembresia, fechaInicio, metodoPago, totalPago, montoAbonado } =
    req.body;
  console.log(req.body);
  console.log(req.params);
  try {
    const fechaFinal = calcularFechaFinal(fechaInicio, tipoMembresia);
    await pool.execute(
      `INSERT INTO
    boleta(idCliente, fechaBoleta ,fechaStart, fechaEnd, totalBoleta, metodoPago, idMenbresiaBoleta)
    VALUES(?, NOW(), ?, ? ,? ,? ,?)`,
      [id, fechaInicio, fechaFinal, totalPago, metodoPago, tipoMembresia]
    );
    res.json({ message: "Datos Insertados" });
  } catch (error) {
    // await pool.rollback();

    console.error(error);
    res.status(500).json({ error: "Error al insertar datos" });
  }
};

export const editCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const queryEdit = "SELECT * FROM cliente WHERE idCliente = ?";
    const [result] = await pool.query(queryEdit, id);
    res.render("clientes/editCliente", { clienteData: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const formData = req.body;
  const datosAgregados = {};
  for (const campo in formData) {
    if (formData[campo] !== "") {
      datosAgregados[campo] = formData[campo];
    }
  }
  try {
    const query = "UPDATE cliente SET ? WHERE idCliente = ?"; // Utiliza ? como marcadores de posición
    const [results, fields] = await pool.query(query, [datosAgregados, id]);
    console.log("Registro actualizado con éxito");
    res.redirect(`/detalleCliente/${id}`);
  } catch (error) {
    console.error("Error al actualizar el registro: " + error);
  }
};

export const controlDiario = async (req, res) => {
  const queryControl = `SELECT 
  DATE_FORMAT(b.fechaBoleta, '%d/%m/%Y') AS fecha_formateada,
  c.dniCliente,
  CONCAT(c.nombreCliente, ' ', c.apellidoCliente) AS nombreCompleto,
  b.idBoleta,
  b.fechaEnd,
  b.totalBoleta,
  e.nombreEstatus,
  m.tipoPago
FROM
  cliente AS c
      JOIN
  boleta AS b ON c.idCliente = b.idCliente
      JOIN
  estatus AS e ON b.statusBoleta = e.idstatus
      JOIN
  metodoPago AS m ON b.metodoPago = m.idmetodoPago
WHERE
  DATE(b.fechaBoleta) = CURDATE()
ORDER BY
  b.fechaBoleta DESC;
`;
  const total = `SELECT 
SUM(b.totalBoleta) AS totalDelDia
FROM
boleta AS b
WHERE
DATE(b.fechaBoleta) = CURDATE();`;
  const queryTotal = `SELECT 
DATE_FORMAT(b.fechaBoleta, '%d/%m/%Y') AS fecha_formateada,
m.tipoPago,
SUM(b.totalBoleta) AS totalPorTipoPago
FROM
cliente AS c
    JOIN
boleta AS b ON c.idCliente = b.idCliente
    JOIN
estatus AS e ON b.statusBoleta = e.idstatus
    JOIN
metodoPago AS m ON b.metodoPago = m.idmetodoPago
WHERE
DATE(b.fechaBoleta) = CURDATE()
GROUP BY
DATE(b.fechaBoleta), m.tipoPago
ORDER BY
b.fechaBoleta DESC;`;
  try {
    const [result] = await pool.query(queryControl);
    const [resultTotal] = await pool.query(queryTotal);
    const [consultaTotal] = await pool.query(total);
    res.render("control/viewsControl", {
      boletaResult: result,
      totalResult: resultTotal,
      totalDia: consultaTotal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
