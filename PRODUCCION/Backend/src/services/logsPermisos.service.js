import { logsDb } from "../config/database.js";

/**
 * Registra un evento en la tabla Logs_Permisos.
 * @param {Object} data - Información del evento.
 * @param {string} data.idAdministrador_mod - Nombre del administrador que realizó la acción.
 * @param {string} data.idUsuario - Nombre del usuario afectado.
 * @param {string} data.idModulo - Nombre del módulo afectado. 🔥 Ahora es un String.
 * @param {string} data.Descripcion - Acción realizada (Ejemplo: "Creación", "Actualización", "Eliminación").
 * @param {string} data.Permiso - Permiso asignado o removido (Ejemplo: "C:✔ A:✖ E:✔ L:✔ R:✖").
 */
export const registrarLogPermiso = async ({ idAdministrador_mod, idUsuario, idModulo, Descripcion, Permiso }) => {
    try {
        // 📌 Si `idModulo` es undefined o null, se usa "Módulo Desconocido"
        const nombreModulo = idModulo ? idModulo.substring(0, 255) : "Módulo Desconocido";

        // 📌 Se obtiene la fecha en UTC y se convierte a formato ISO
        const fechaActualLocal = new Date();
        const fechaUTC = new Date(fechaActualLocal.getTime() - fechaActualLocal.getTimezoneOffset() * 60000).toISOString();

        // 📌 Registrar en logs de permisos con los nombres de usuario y módulo
        await logsDb.logs_Permissions.create({
            data: {
                idAdministrador_mod: idAdministrador_mod ? idAdministrador_mod.substring(0, 255) : "Desconocido", // 🔥 Limitar a 255 caracteres
                idUsuario: idUsuario ? idUsuario.substring(0, 255) : "Desconocido", // 🔥 Limitar a 255 caracteres
                idModulo: nombreModulo, // ✅ Ya no se hace consulta, se usa directamente el nombre del módulo
                Descripcion: Descripcion.substring(0, 255), // 🔥 Nueva descripción con la acción realizada
                Permiso: Permiso.substring(0, 100), // 🔥 Limitar a 100 caracteres
                Fecha: fechaUTC, // 📌 Se registra la fecha en formato ISO
            },
        });

        console.log(`✅ Log de permiso registrado: [${Permiso}] en módulo ${nombreModulo} para usuario ${idUsuario} - Acción: ${Descripcion} - Fecha: ${fechaUTC}`);
    } catch (error) {
        console.error("❌ Error registrando log en Logs_Permissions:", error.message);
    }
};
