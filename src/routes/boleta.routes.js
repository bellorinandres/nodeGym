import { Router } from "express";
import {
  addBoletas,
  detalleBoleta,
  listarBoletas,
  listarClientes,
  newBoleta,
} from "../controllers/userControllers.js";

const router = Router();

// Rutas de Boletas
// Rutas Get
router.get("/boletas", listarBoletas);
router.get("/add", addBoletas);
router.get("/detalleBoleta/:id", detalleBoleta)
// Rutas con POST
router.post("/addBoletas", newBoleta);
// Rutas Clientes
router.get("/viewClientes", listarClientes);

export default router;
