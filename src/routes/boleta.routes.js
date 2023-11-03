import { Router } from "express";
import {
  addBoletaCliente,
  addBoletas,
  buscador,
  detalleBoleta,
  detalleCliente,
  editCliente,
  insertBoletaCliente,
  listarBoletas,
  listarClientes,
  newBoleta,
  updateCliente,
} from "../controllers/userControllers.js";

const router = Router();

// Rutas de Boletas
// Rutas Get
router.get("/boletas", listarBoletas);
router.get("/add", addBoletas);
router.get("/detalleBoleta/:id", detalleBoleta);
// Rutas con POST
router.post("/addBoletas", newBoleta);
router.post("/addBoletaCliente/:id", addBoletaCliente);
// Rutas Clientes
router.get("/viewClientes", listarClientes);
router.get("/detalleCliente/:id", detalleCliente);
router.get("/addBoletaCliente/:id", insertBoletaCliente);
router.get("/editCliente/:id", editCliente);
router.post("/editCliente/:id", updateCliente)
// Buscador
router.get("/buscar", buscador);
export default router;
