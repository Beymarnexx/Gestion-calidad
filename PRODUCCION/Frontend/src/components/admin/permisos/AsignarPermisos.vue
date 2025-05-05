<template>
  <div class="admin-dashboard">
    <h1 class="welcome-message">➕ Asignar Permisos</h1>

    <div class="admin-info">
      <h2>👤 Seleccionar Usuario</h2>
      <div class="form-group">
        <select v-model="idUsuarioRolSeleccionado">
          <option disabled value="">Seleccione un usuario...</option>
          <option v-for="usuarioRol in listaUsuarioRoles" :key="usuarioRol.idUsuarioRol" :value="usuarioRol.idUsuarioRol">
            {{ usuarioRol.idUsuarioRol }} - {{ usuarioRol.nombreUsuario }} ({{ usuarioRol.rolNombre }})
          </option>
        </select>
      </div>

      <h2>📂 Seleccionar Módulo</h2>
      <div class="form-group">
        <select v-model="moduloSeleccionado">
          <option disabled value="">Seleccione un módulo...</option>
          <option v-for="modulo in modulos" :key="modulo.idModulo" :value="modulo.idModulo">
            {{ modulo.Nombre }}
          </option>
        </select>
      </div>

      <h2>✅ Configurar Permisos</h2>
      <table class="permissions-table">
        <thead>
          <tr>
            <th>Crear</th>
            <th>Leer</th>
            <th>Actualizar</th>
            <th>Eliminar</th>
            <th>Reportes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" v-model="nuevoPermiso.Crear" /></td>
            <td><input type="checkbox" v-model="nuevoPermiso.Leer" /></td>
            <td><input type="checkbox" v-model="nuevoPermiso.Actualizar" /></td>
            <td><input type="checkbox" v-model="nuevoPermiso.Eliminar" /></td>
            <td><input type="checkbox" v-model="nuevoPermiso.Reportes" /></td>
          </tr>
        </tbody>
      </table>

      <button @click="asignarPermisos" class="save-button" :disabled="!idUsuarioRolSeleccionado || !moduloSeleccionado">
        ✅ Asignar Permisos
      </button>

      <transition name="fade">
        <p v-if="mensajeError" class="error-message">{{ mensajeError }}</p>
      </transition>
      <transition name="fade">
        <p v-if="mensajeExito" class="success-message">{{ mensajeExito }}</p>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      modulos: [],
      listaUsuarioRoles: [], // ✅ Ahora contiene idUsuarioRol, nombreUsuario y rolNombre
      idUsuarioRolSeleccionado: "",
      moduloSeleccionado: "",
      nuevoPermiso: {
        Crear: false,
        Leer: false,
        Actualizar: false,
        Eliminar: false,
        Reportes: false,
      },
      mensajeError: "",
      mensajeExito: "",
    };
  },
  methods: {
    async cargarDatos() {
      try {
        const [modulosResponse, usuarioRolesResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/modulo/all", { withCredentials: true }),
          axios.get("http://localhost:3001/api/usuariorol/all", { withCredentials: true }),
        ]);

        this.modulos = modulosResponse.data;

        // ✅ Transformamos los datos para mostrar `idUsuarioRol - Usuario - Rol`
        this.listaUsuarioRoles = usuarioRolesResponse.data.map((ur) => ({
          idUsuarioRol: ur.idUsuarioRol,
          nombreUsuario: ur.Usuario.Nombre_usuario,
          rolNombre: ur.Rol.Nombre,
        }));
      } catch (error) {
        console.error("❌ Error cargando datos:", error);
      }
    },

    async asignarPermisos() {
      if (!this.idUsuarioRolSeleccionado || !this.moduloSeleccionado) {
        this.mostrarMensaje("⚠ Debes seleccionar un usuario y un módulo.", false);
        return;
      }

      const permisoNuevo = {
        idUsuarioRol: this.idUsuarioRolSeleccionado, // ✅ Se usa `idUsuarioRol`
        idModulo: this.moduloSeleccionado,
        Crear: this.nuevoPermiso.Crear,
        Leer: this.nuevoPermiso.Leer,
        Actualizar: this.nuevoPermiso.Actualizar,
        Eliminar: this.nuevoPermiso.Eliminar,
        Reportes: this.nuevoPermiso.Reportes
      };

      console.log("📤 Enviando datos corregidos:", JSON.stringify(permisoNuevo, null, 2));

      try {
        await axios.post("http://localhost:3001/api/permiso/register", permisoNuevo, { withCredentials: true });

        this.mostrarMensaje("✅ Permisos asignados correctamente.", true);
        this.limpiarCampos();
        this.cargarDatos();
      } catch (error) {
        console.error("❌ Error al asignar permisos:", error);
        this.mostrarMensaje("⚠ No se pudo asignar los permisos. Intenta de nuevo.", false);
      }
    },

    limpiarCampos() {
      this.idUsuarioRolSeleccionado = "";
      this.moduloSeleccionado = "";
      this.nuevoPermiso = {
        Crear: false,
        Leer: false,
        Actualizar: false,
        Eliminar: false,
        Reportes: false,
      };
    },

    mostrarMensaje(mensaje, esExito) {
      if (esExito) {
        this.mensajeExito = mensaje;
      } else {
        this.mensajeError = mensaje;
      }

      setTimeout(() => {
        this.mensajeExito = "";
        this.mensajeError = "";
      }, 3000);
    }
  },
  mounted() {
    this.cargarDatos();
  }
};
</script>


<style scoped>
@import "@/assets/adminStyles.css";

/* 📌 Estilos de la Tabla */
.permissions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.permissions-table th,
.permissions-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.permissions-table th {
  background: #002f5b;
  color: white;
}

/* 📌 Estilos de Mensajes */
.error-message {
  color: red;
  font-size: 0.9em;
}

.success-message {
  color: green;
  font-size: 0.9em;
}
</style>
