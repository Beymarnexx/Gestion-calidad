import { db } from "../config/database.js";
import { logsDb } from "../config/database.js"; // 📌 Base de datos de logs
import { registrarLogPermiso } from "./logsPermisos.service.js"; // 📌 Función para registrar logs

/**
 * Obtiene todos los permisos.
 */
export const obtenerPermisos = async () => {
  try {
    return await db.permisos.findMany({
      include: {
        Modulo: true,
        UsuarioRol: {
          include: {
            Usuario: true,
            Rol: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Error al obtener los permisos: " + error.message);
  }
};

/**
 * Obtiene un permiso por ID.
 */
export const obtenerPermisoPorId = async (idPermiso) => {
  try {
    const permiso = await db.permisos.findUnique({
      where: { idPermiso: parseInt(idPermiso) },
      include: {
        Modulo: true,
        UsuarioRol: {
          include: {
            Usuario: true,
            Rol: true,
          },
        },
      },
    });

    if (!permiso) {
      throw new Error("Permiso no encontrado.");
    }

    return permiso;
  } catch (error) {
    throw new Error("Error al obtener el permiso: " + error.message);
  }
};

/**
 * Crea un nuevo permiso y lo registra en logs.
 */
export const crearPermiso = async (data, idAdministrador_mod) => {
  try {
    console.log("📌 Iniciando creación de permisos...");

    // 📌 Verificar si el módulo y el usuario-rol existen
    const modulo = await db.modulo.findUnique({
      where: { idModulo: data.idModulo },
      select: { Nombre: true },
    });

    const usuarioRol = await db.usuarioRol.findUnique({
      where: { idUsuarioRol: data.idUsuarioRol },
      include: { Usuario: { select: { Nombre_usuario: true } } }, // 🔥 Se obtiene el nombre del usuario
    });

    if (!modulo) {
      throw new Error("❌ El módulo especificado no existe.");
    }

    if (!usuarioRol || !usuarioRol.Usuario) {
      throw new Error("❌ El usuario-rol especificado no existe.");
    }

    // 📌 Obtener el nombre del usuario administrador
    const adminUsuario = await db.usuario.findUnique({
      where: { idUsuario: idAdministrador_mod },
      select: { Nombre_usuario: true },
    });

    if (!adminUsuario) {
      throw new Error("❌ Administrador no encontrado o no autorizado.");
    }

    const nombreAdmin = adminUsuario.Nombre_usuario; // 🔥 Nombre del administrador
    const nombreUsuarioRol = usuarioRol.Usuario.Nombre_usuario; // 🔥 Nombre del usuario afectado
    const nombreModulo = modulo.Nombre; // 🔥 Nombre del módulo obtenido correctamente

    // 📌 Verificar si el permiso ya existe antes de crearlo
    const permisoExistente = await db.permisos.findFirst({
      where: {
        idModulo: data.idModulo,
        idUsuarioRol: data.idUsuarioRol,
      },
    });

    if (permisoExistente) {
      throw new Error("⚠️ El usuario ya tiene permisos en este módulo.");
    }

    // 📌 Crear el permiso en la base de datos
    const nuevoPermiso = await db.permisos.create({ data });

    // 📌 Registrar la creación del permiso en Logs_Permisos con nombres en lugar de IDs
    await registrarLogPermiso({
      idAdministrador_mod: nombreAdmin, // 🔥 Nombre del usuario administrador
      idUsuario: nombreUsuarioRol, // 🔥 Nombre del usuario que recibe el permiso
      idModulo: nombreModulo, // ✅ Se almacena el nombre del módulo en logs
      Descripcion: "Creación de permiso", // ✅ Se agrega descripción de la acción
      Permiso: `C:${data.Crear ? "✔" : "✖"} A:${data.Actualizar ? "✔" : "✖"} E:${data.Eliminar ? "✔" : "✖"} L:${data.Leer ? "✔" : "✖"} R:${data.Reportes ? "✔" : "✖"}`,
    });

    console.log(`✅ Permiso creado en módulo ${nombreModulo} para usuario ${nombreUsuarioRol}`);
    return nuevoPermiso;
  } catch (error) {
    console.error("❌ Error al asignar permiso:", error.message);
    throw new Error("Error al asignar permiso: " + error.message);
  }
};



/**
 * Actualiza un permiso existente o lo crea si no existe.
 */
export const actualizarPermiso = async (idModulo, idUsuarioRol, data, nombreAdmin) => {
  try {
    console.log("📌 Iniciando actualización de permisos para módulo:", idModulo, "y usuario rol:", idUsuarioRol);

    // 📌 Buscar el permiso en la base de datos principal (`db`)
    const permisoExistente = await db.permisos.findFirst({
      where: {
        idModulo: idModulo,
        idUsuarioRol: idUsuarioRol,
      },
    });

    // 📌 Obtener el nombre del módulo
    const modulo = await db.modulo.findUnique({
      where: { idModulo },
      select: { Nombre: true },
    });

    const nombreModulo = modulo ? modulo.Nombre : "Módulo Desconocido"; // 🔥 Guardamos el nombre del módulo en logs

    // 📌 Obtener el nombre del usuario afectado
    const usuarioRol = await db.usuarioRol.findUnique({
      where: { idUsuarioRol },
      select: {
        Usuario: {
          select: { Nombre_usuario: true },
        },
      },
    });

    if (!usuarioRol || !usuarioRol.Usuario || !usuarioRol.Usuario.Nombre_usuario) {
      throw new Error(`❌ No se encontró el usuario para el rol ID ${idUsuarioRol}`);
    }

    const nombreUsuarioRol = usuarioRol.Usuario.Nombre_usuario; // 🔥 Nombre del usuario afectado
    console.log(`📌 Nombre del usuario afectado: ${nombreUsuarioRol}`);

    if (permisoExistente) {
      console.log(`✅ Permiso encontrado con ID ${permisoExistente.idPermiso}. Procediendo a actualizar...`);

      // 🔥 Si el permiso ya existe, actualizarlo en `db`
      const permisoActualizado = await db.permisos.update({
        where: { idPermiso: permisoExistente.idPermiso },
        data: {
          Crear: data.Crear,
          Actualizar: data.Actualizar,
          Eliminar: data.Eliminar,
          Leer: data.Leer,
          Reportes: data.Reportes,
        },
      });

      // 📌 Registrar en logs
      await registrarLogPermiso({
        idAdministrador_mod: nombreAdmin,
        idUsuario: nombreUsuarioRol,
        idModulo: nombreModulo, // 🔥 Se almacena el nombre del módulo
        Descripcion: "Actualización de permisos",
        Permiso: `C:${data.Crear ? "✔" : "✖"} A:${data.Actualizar ? "✔" : "✖"} E:${data.Eliminar ? "✔" : "✖"} L:${data.Leer ? "✔" : "✖"} R:${data.Reportes ? "✔" : "✖"}`,
      });

      console.log(`✅ Permiso actualizado en módulo ${nombreModulo} para usuario ${nombreUsuarioRol}`);
      return permisoActualizado;
    } else {
      console.warn(`⚠️ No se encontró un permiso existente. Creando nuevo permiso para módulo ${nombreModulo} y usuario ${nombreUsuarioRol}.`);

      // 🔥 Crear un nuevo permiso en `db`
      const nuevoPermiso = await db.permisos.create({
        data: {
          idModulo,
          idUsuarioRol,
          Crear: data.Crear,
          Actualizar: data.Actualizar,
          Eliminar: data.Eliminar,
          Leer: data.Leer,
          Reportes: data.Reportes,
        },
      });

      // 📌 Registrar en logs
      await registrarLogPermiso({
        idAdministrador_mod: nombreAdmin,
        idUsuario: nombreUsuarioRol,
        idModulo: nombreModulo, // 🔥 Se almacena el nombre del módulo
        Descripcion: "Creación de nuevo permiso",
        Permiso: `Nuevo permiso creado - Crear:${data.Crear}, Leer:${data.Leer}, Actualizar:${data.Actualizar}, Eliminar:${data.Eliminar}, Reportes:${data.Reportes}`,
      });

      console.log(`✅ Nuevo permiso creado en módulo ${nombreModulo} para usuario ${nombreUsuarioRol}`);
      return nuevoPermiso;
    }
  } catch (error) {
    console.error("❌ Error al actualizar/crear el permiso:", error.message);
    throw new Error(error.message);
  }
};



/**
 * Elimina un permiso por ID.
 */
export const eliminarPermiso = async (idPermiso, nombreAdmin) => {
  try {
    // 📌 Verificar si el permiso existe
    const permisoExistente = await db.permisos.findUnique({
      where: { idPermiso: parseInt(idPermiso) },
      include: {
        UsuarioRol: {
          include: { Usuario: { select: { Nombre_usuario: true } } },
        },
        Modulo: { select: { Nombre: true } }, // 🔥 Obtener el nombre del módulo
      },
    });

    if (!permisoExistente) {
      throw new Error("❌ Permiso no encontrado.");
    }

    // 📌 Obtener nombres en lugar de IDs
    const nombreUsuarioRol = permisoExistente.UsuarioRol?.Usuario?.Nombre_usuario || "Usuario Desconocido";
    const nombreModulo = permisoExistente.Modulo?.Nombre || "Módulo Desconocido";

    // 📌 Eliminar el permiso
    await db.permisos.delete({
      where: { idPermiso: parseInt(idPermiso) },
    });

    // 📌 Registrar en logs
    await registrarLogPermiso({
      idAdministrador_mod: nombreAdmin,
      idUsuario: nombreUsuarioRol,
      idModulo: nombreModulo, // ✅ Se almacena el nombre del módulo en logs
      Descripcion: "Eliminación de permiso", // ✅ Se agrega descripción de la acción
      Permiso: "ELIMINACIÓN_PERMISO",
    });

    console.log(`✅ Permiso eliminado en módulo ${nombreModulo} para usuario ${nombreUsuarioRol}`);
    return { message: "Permiso eliminado correctamente." };
  } catch (error) {
    throw new Error("❌ Error al eliminar el permiso: " + error.message);
  }
};

