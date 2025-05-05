<template>
  <div class="admin-dashboard">
    <h1 class="welcome-message">✏️ Editar Permisos</h1>

    <div class="admin-info">
      <!-- Selección de Permiso -->
      <h2>📜 Seleccionar Permiso</h2>
      <div class="form-group">
        <select v-model="permisoSeleccionado" @change="cargarDatosDePermiso">
          <option disabled value="">Seleccione un permiso...</option>
          <option v-for="permiso in permisosTodos" :key="permiso.idPermiso" :value="permiso.idPermiso">
            {{ obtenerDescripcionPermiso(permiso) }}
          </option>
        </select>
      </div>

      <!-- Información del Usuario -->
      <h2>👤 Usuario Involucrado</h2>
      <div class="form-group">
        <input type="text" v-model="usuarioNombre" disabled />
      </div>

      <!-- Información del Módulo -->
      <h2>📂 Módulo Asignado</h2>
      <div class="form-group">
        <input type="text" v-model="moduloNombre" disabled />
      </div>

      <!-- Configuración de Permisos -->
      <h2>✅ Modificar Permisos</h2>
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
          <tr v-if="permisoActual">
            <td><input type="checkbox" v-model="permisoActual.Crear" /></td>
            <td><input type="checkbox" v-model="permisoActual.Leer" /></td>
            <td><input type="checkbox" v-model="permisoActual.Actualizar" /></td>
            <td><input type="checkbox" v-model="permisoActual.Eliminar" /></td>
            <td><input type="checkbox" v-model="permisoActual.Reportes" /></td>
          </tr>
          <tr v-else>
            <td colspan="5" class="no-data">❌ No hay permisos cargados.</td>
          </tr>
        </tbody>
      </table>

      <!-- Botón para Guardar Cambios -->
      <button @click="confirmarEdicion" class="save-button" :disabled="!permisoActual">
        ✅ Guardar Cambios
      </button>

      <!-- Mensajes de Notificación -->
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
      permisosTodos: [], // Todos los permisos disponibles
      permisoSeleccionado: "",
      permisoActual: null, // Permiso cargado
      usuarioNombre: "",
      moduloNombre: "",
      mensajeError: "",
      mensajeExito: "",
    };
  },
  methods: {
    async cargarDatos() {
      try {
        const permisosResponse = await axios.get("http://localhost:3001/api/permiso/all", { withCredentials: true });
        this.permisosTodos = permisosResponse.data;
        console.log("✅ Permisos cargados:", this.permisosTodos);
      } catch (error) {
        console.error("❌ Error cargando permisos:", error);
      }
    },

    obtenerDescripcionPermiso(permiso) {
      return `${permiso.UsuarioRol?.Usuario?.Nombre_usuario} - ${permiso.Modulo?.Nombre}`;
    },

    cargarDatosDePermiso() {
      if (!this.permisoSeleccionado) {
        this.permisoActual = null;
        return;
      }

      const permiso = this.permisosTodos.find(p => p.idPermiso === this.permisoSeleccionado);

      if (permiso) {
        this.permisoActual = {
          idPermiso: Number(permiso.idPermiso),
          idModulo: Number(permiso.idModulo),
          idUsuarioRol: Number(permiso.idUsuarioRol),
          Crear: Boolean(permiso.Crear),
          Leer: Boolean(permiso.Leer),
          Actualizar: Boolean(permiso.Actualizar),
          Eliminar: Boolean(permiso.Eliminar),
          Reportes: Boolean(permiso.Reportes),
        };

        this.usuarioNombre = permiso.UsuarioRol?.Usuario?.Nombre_usuario || "Desconocido";
        this.moduloNombre = permiso.Modulo?.Nombre || "Desconocido";
      } else {
        this.permisoActual = null;
        this.usuarioNombre = "";
        this.moduloNombre = "";
      }
    },

    async confirmarEdicion() {
      if (confirm("⚠ ¿Estás seguro de que deseas modificar estos permisos?")) {
        this.editarPermiso();
      }
    },

    async editarPermiso() {
      if (!this.permisoActual || !this.permisoActual.idPermiso) {
        this.mostrarMensaje("⚠ No hay permisos para editar o falta el ID.", false);
        return;
      }

      try {
        // Enviar en formato de array para que coincida con la API
        const permisosArray = {
          permisos: [this.permisoActual]
        };

        console.log("📤 Enviando datos corregidos:", JSON.stringify(permisosArray, null, 2));

        await axios.put(
          `http://localhost:3001/api/permiso/${this.permisoActual.idPermiso}`,
          permisosArray, // Enviar como array
          { withCredentials: true }
        );

        this.mostrarMensaje("✅ Permisos editados correctamente.", true);
        this.cargarDatos(); // Recargar la lista de permisos actualizados
      } catch (error) {
        console.error("❌ Error al editar permisos:", error);
        this.mostrarMensaje("⚠ No se pudo editar los permisos. Intenta de nuevo.", false);
      }
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
  margin-top: 10px;
  transition: opacity 0.5s ease-out;
}

.success-message {
  color: green;
  font-size: 0.9em;
  margin-top: 10px;
  transition: opacity 0.5s ease-out;
}
</style>
