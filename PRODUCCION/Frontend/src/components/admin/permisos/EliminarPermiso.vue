<template>
  <div class="admin-dashboard">
    <h1 class="welcome-message">🗑️ Eliminar Permiso</h1>

    <div class="admin-info">
      <h2>🔍 Buscar Permiso</h2>

      <!-- 🔍 Barra de búsqueda -->
      <input
        type="text"
        v-model="filtroBusqueda"
        placeholder="Escribe un usuario o módulo..."
        class="search-bar"
      />

      <h2>📋 Lista de Permisos</h2>

      <table class="admin-info-table" v-if="permisos.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Módulo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- 🔍 Filtrar permisos en tiempo real -->
          <tr v-for="permiso in permisosFiltrados" :key="permiso.idPermiso">
            <td>{{ permiso.idPermiso }}</td>
            <td>{{ permiso.UsuarioRol?.Usuario?.Nombre_usuario || "Desconocido" }}</td>
            <td>{{ permiso.Modulo?.Nombre || "Desconocido" }}</td>
            <td>
              <button class="delete-button" @click="confirmarEliminar(permiso)">
                🗑️ Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="no-data">❌ No hay permisos registrados.</p>

      <!-- ✅ Mensaje de Éxito -->
      <div v-if="mensajeExito" class="success-message">
        ✅ {{ mensajeExito }}
      </div>

      <!-- ❌ Mensaje de Error -->
      <div v-if="mensajeError" class="error-message">
        ❌ {{ mensajeError }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      permisos: [], // Lista de permisos
      filtroBusqueda: "", // Filtro de búsqueda
      mensajeExito: "",
      mensajeError: ""
    };
  },
  computed: {
    // 🔍 Filtra permisos en tiempo real
    permisosFiltrados() {
      return this.permisos.filter((permiso) =>
        `${permiso.UsuarioRol?.Usuario?.Nombre_usuario || ""} ${permiso.Modulo?.Nombre || ""}`
          .toLowerCase()
          .includes(this.filtroBusqueda.toLowerCase())
      );
    }
  },
  methods: {
    // 🔄 Cargar permisos desde el backend
    async cargarPermisos() {
      try {
        const response = await axios.get("http://localhost:3001/api/permiso/all", { withCredentials: true });

        console.log("📩 Permisos recibidos:", response.data);
        this.permisos = response.data;
      } catch (error) {
        console.error("❌ Error obteniendo permisos:", error);
      }
    },

    // ⚠️ Confirmar eliminación antes de proceder
    confirmarEliminar(permiso) {
      if (confirm(`⚠️ ¿Seguro que quieres eliminar el permiso asignado a "${permiso.UsuarioRol?.Usuario?.Nombre_usuario}" en "${permiso.Modulo?.Nombre}"?`)) {
        this.eliminarPermiso(permiso.idPermiso);
      }
    },

    // 🗑️ Eliminar permiso
    async eliminarPermiso(idPermiso) {
      try {
        console.log(`📤 Eliminando permiso con ID: ${idPermiso}`);

        await axios.delete(`http://localhost:3001/api/permiso/${idPermiso}`, { withCredentials: true });

        console.log("✅ Permiso eliminado correctamente.");
        this.mensajeExito = "Permiso eliminado correctamente.";
        this.mensajeError = "";

        // 🔄 Refrescar lista de permisos
        await this.cargarPermisos();
      } catch (error) {
        console.error("❌ Error al eliminar permiso:", error);
        this.mensajeError = error.response?.data?.error || "⚠️ Error al eliminar el permiso.";
      }
    }
  },
  mounted() {
    this.cargarPermisos();
  }
};
</script>

<style scoped>
@import "@/assets/adminStyles.css";

/* 🔍 Estilo de la barra de búsqueda */
.search-bar {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}

/* 🗑️ Estilo del botón eliminar */
.delete-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

.delete-button:hover {
  background-color: #cc0000;
}

/* ❌ Estilo cuando no hay datos */
.no-data {
  text-align: center;
  color: gray;
  font-size: 1.2em;
  margin-top: 20px;
}

/* ✅ Mensaje de éxito */
.success-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
}

/* ❌ Mensaje de error */
.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
}
</style>
