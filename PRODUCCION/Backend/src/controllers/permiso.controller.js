import {
  obtenerPermisos,
  obtenerPermisoPorId,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
} from "../services/permiso.service.js";

import { db } from "../config/database.js"; // 📌 Base de datos principal
import { registrarLogPermiso } from "../services/logsPermisos.service.js";

/**
* Controlador para obtener todos los permisos.
*/
export const getPermisos = async (req, res, next) => {
  try {
      const permisos = await obtenerPermisos();
      res.json(permisos);
  } catch (error) {
      console.error("❌ Error al obtener permisos:", error.message);
      next(error);
  }
};

/**
* Controlador para obtener un permiso por ID.
*/
export const getPermisoById = async (req, res, next) => {
  try {
      const { id } = req.params;
      const permiso = await obtenerPermisoPorId(id);

      if (!permiso) {
          return res.status(404).json({ error: "Permiso no encontrado." });
      }

      res.json(permiso);
  } catch (error) {
      console.error("❌ Error al obtener permiso:", error.message);
      next(error);
  }
};

/**
* Controlador para crear un nuevo permiso.
*/
export const createPermiso = async (req, res, next) => {
    try {
        const { idModulo, idUsuarioRol, Crear, Actualizar, Eliminar, Leer, Reportes } = req.body;
        const idAdministrador_mod = req.userId || req.user?.userId; // 🔥 Obtiene el ID del administrador
  
        if (!idAdministrador_mod || !idModulo || !idUsuarioRol) {
            return res.status(400).json({ error: "❌ Faltan datos obligatorios." });
        }
  
        console.log("📥 Datos recibidos para creación de permiso:", req.body);
  
        // 📌 Verificar si el usuario administrador existe en la BD
        const adminUsuario = await db.Usuario.findUnique({
            where: { idUsuario: idAdministrador_mod },
            select: { Nombre_usuario: true },
        });
  
        if (!adminUsuario) {
            console.error("❌ Error: Administrador no encontrado o no autorizado.");
            return res.status(403).json({ error: "Administrador no autorizado." });
        }
  
        // 📌 Verificar si el usuarioRol existe en la BD
        const usuarioRol = await db.UsuarioRol.findUnique({
            where: { idUsuarioRol },
            select: {
                Usuario: { select: { Nombre_usuario: true } },
            },
        });
  
        if (!usuarioRol || !usuarioRol.Usuario) {
            console.error("❌ Error: Usuario no encontrado para idUsuarioRol:", idUsuarioRol);
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
  
        // 📌 Obtener el nombre del módulo
        const modulo = await db.modulo.findUnique({
          where: { idModulo },
          select: { Nombre: true },
        });
  
        if (!modulo) {
          console.error("❌ Error: Módulo no encontrado para idModulo:", idModulo);
          return res.status(404).json({ error: "Módulo no encontrado." });
        }
  
        const nombreModulo = modulo.Nombre; // 🔥 Obtener el nombre del módulo
  
        // 📌 Verificar si el permiso ya existe para este usuario y módulo
        const permisoExistente = await db.permisos.findFirst({
            where: {
                idModulo,
                idUsuarioRol,
            },
        });
  
        if (permisoExistente) {
            console.warn("⚠️ Este usuario ya tiene un permiso asignado en este módulo.");
            return res.status(400).json({ error: "El usuario ya tiene permisos asignados en este módulo." });
        }
  
        // 📌 Crear el nuevo permiso en la BD
        const nuevoPermiso = await db.permisos.create({
            data: {
                idModulo,
                idUsuarioRol,
                Crear,
                Actualizar,
                Eliminar,
                Leer,
                Reportes,
            },
        });
  
        // 📌 Registrar en Logs_Permisos
        await registrarLogPermiso({
            idAdministrador_mod: adminUsuario.Nombre_usuario, // 🔥 Nombre del admin
            idUsuario: usuarioRol.Usuario.Nombre_usuario, // 🔥 Nombre del usuario afectado
            idModulo: nombreModulo, // ✅ Se almacena el nombre del módulo en logs
            Descripcion: "Creación de permiso", // ✅ Se agrega descripción de la acción
            Permiso: `C:${Crear ? "✔" : "✖"} A:${Actualizar ? "✔" : "✖"} E:${Eliminar ? "✔" : "✖"} L:${Leer ? "✔" : "✖"} R:${Reportes ? "✔" : "✖"}`,
        });
  
        console.log(`✅ Permiso creado en módulo ${nombreModulo} para usuario ${usuarioRol.Usuario.Nombre_usuario}`);
        res.status(201).json(nuevoPermiso);
  
    } catch (error) {
        console.error("❌ Error en createPermiso:", error.message);
        next(error);
    }
  };
  
  

/**
* Controlador para actualizar un permiso.
*/
export const updatePermiso = async (req, res, next) => {
    try {
        const { permisos } = req.body;
        const idAdministrador_mod = req.userId || req.user?.userId;
  
        if (!idAdministrador_mod) {
            return res.status(400).json({ error: "Administrador no autorizado." });
        }
  
        if (!permisos || !Array.isArray(permisos)) {
            return res.status(400).json({ error: "El campo 'permisos' debe ser un array." });
        }
  
        // 📌 Obtener el nombre del administrador
        const adminUsuario = await db.Usuario.findUnique({
            where: { idUsuario: idAdministrador_mod },
            select: { Nombre_usuario: true },
        });
  
        if (!adminUsuario) {
            return res.status(403).json({ error: "Administrador no autorizado." });
        }
  
        for (const permiso of permisos) {
            const { idModulo, idUsuarioRol, Crear, Actualizar, Eliminar, Leer, Reportes } = permiso;
  
            if (!idModulo || !idUsuarioRol) {
                console.warn(`⚠️ Datos incompletos en permiso de módulo ${idModulo} para usuario ${idUsuarioRol}`);
                continue;
            }
  
            // 📌 Obtener nombre del usuario afectado
            const usuarioRol = await db.UsuarioRol.findUnique({
                where: { idUsuarioRol },
                select: { Usuario: { select: { Nombre_usuario: true } } },
            });
  
            if (!usuarioRol || !usuarioRol.Usuario) {
                console.warn(`⚠️ No se encontró el usuario para el rol ID ${idUsuarioRol}`);
                continue;
            }
  
            // 📌 Actualizar el permiso
            await actualizarPermiso(idModulo, idUsuarioRol, { Crear, Actualizar, Eliminar, Leer, Reportes }, adminUsuario.Nombre_usuario);
  
            console.log(`✅ Permiso actualizado en módulo ${idModulo} para usuario ${usuarioRol.Usuario.Nombre_usuario}`);
        }
  
        res.json({ message: "Permisos actualizados correctamente" });
    } catch (error) {
        console.error("❌ Error en updatePermiso:", error.message);
        next(error);
    }
  };
  
  

/**
* Controlador para eliminar un permiso.
*/
export const deletePermiso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idAdministrador_mod = req.userId || req.user?.userId;

        if (!idAdministrador_mod) {
            return res.status(400).json({ error: "❌ Administrador no autorizado." });
        }

        // 📌 Obtener el nombre del administrador (🔥 Misma lógica que en createPermiso)
        const adminUsuario = await db.Usuario.findUnique({
            where: { idUsuario: idAdministrador_mod },
            select: { Nombre_usuario: true },
        });

        if (!adminUsuario) {
            return res.status(403).json({ error: "❌ Administrador no autorizado." });
        }

        const nombreAdmin = adminUsuario.Nombre_usuario; // 🔥 Nombre del administrador

        const permisoExistente = await db.permisos.findUnique({
            where: { idPermiso: parseInt(id) },
            include: {
                UsuarioRol: {
                    include: { Usuario: { select: { Nombre_usuario: true } } },
                },
                Modulo: { select: { Nombre: true } }, // 🔥 Obtener el nombre del módulo
            },
        });

        if (!permisoExistente) {
            return res.status(404).json({ error: "❌ Permiso no encontrado." });
        }

        // 📌 Obtener nombres en lugar de IDs
        const nombreUsuarioRol = permisoExistente.UsuarioRol?.Usuario?.Nombre_usuario || "Usuario Desconocido";
        const nombreModulo = permisoExistente.Modulo?.Nombre || "Módulo Desconocido";

        // 📌 Eliminar el permiso
        await eliminarPermiso(id, nombreAdmin); // ✅ Se pasa `nombreAdmin`, no el ID

        // 📌 Registrar eliminación en Logs_Permisos
        await registrarLogPermiso({
            idAdministrador_mod: nombreAdmin, // ✅ Ahora se almacena el nombre en logs
            idUsuario: nombreUsuarioRol,
            idModulo: nombreModulo, // ✅ Se almacena el nombre del módulo en logs
            Descripcion: "Eliminación de permiso", // ✅ Se agrega descripción de la acción
            Permiso: "ELIMINACIÓN_PERMISO",
        });

        console.log(`✅ Permiso eliminado en módulo ${nombreModulo} para usuario ${nombreUsuarioRol}`);
        res.json({ message: "Permiso eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error en deletePermiso:", error.message);
        next(error);
    }
};

  