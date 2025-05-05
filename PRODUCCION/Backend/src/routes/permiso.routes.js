import express from "express";
import {
  getPermisos,
  getPermisoById,
  createPermiso,
  updatePermiso,
  deletePermiso,
} from "../controllers/permiso.controller.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();
const ID_MODULO_GESTION_USUARIOS = 4; // 📌 ID del módulo para autorización de gestión de permisos

// 📌 Middleware para registrar peticiones con logs de usuario
const logRequest = (req, res, next) => {
  console.log(`📥 [${req.method}] ${req.originalUrl} - Usuario ${req.userId || "No autenticado"}`);
  next();
};

// 📌 Obtener todos los permisos
router.get(
  "/all",
  authenticateUser,
  authorize(ID_MODULO_GESTION_USUARIOS, "Leer"),
  logRequest,
  (req, res, next) => getPermisos(req, res, next)
);

// 📌 Obtener un permiso por ID
router.get(
  "/:id",
  authenticateUser,
  authorize(ID_MODULO_GESTION_USUARIOS, "Leer"),
  logRequest,
  (req, res, next) => getPermisoById(req, res, next)
);

// 📌 Crear un nuevo permiso
router.post(
  "/register",
  authenticateUser,
  authorize(ID_MODULO_GESTION_USUARIOS, "Crear"),
  logRequest,
  (req, res, next) => createPermiso(req, res, next)
);

// 📌 Actualizar permisos
router.put(
  "/:id",
  authenticateUser,
  authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"),
  logRequest,
  (req, res, next) => updatePermiso(req, res, next)
);

// 📌 Eliminar un permiso
router.delete(
  "/:id",
  authenticateUser,
  authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"),
  logRequest,
  (req, res, next) => deletePermiso(req, res, next)
);

export default router;
