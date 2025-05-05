<template>
    <div class="admin-dashboard">
      <h1 class="welcome-message">🗑️ Eliminar Rol</h1>
  
      <div class="admin-info">
        <h2>🔍 Buscar Rol</h2>
        
        <!-- 🔍 Barra de búsqueda -->
        <input
          type="text"
          v-model="filtroNombre"
          placeholder="Escribe un nombre de rol para buscar..."
          class="search-bar"
        />
  
        <h2>📋 Lista de Roles</h2>
  
        <table class="admin-info-table" v-if="roles.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- 🏷️ Filtrar roles en tiempo real -->
            <tr v-for="rol in rolesFiltrados" :key="rol.idRol">
              <td>{{ rol.idRol }}</td>
              <td>{{ rol.Nombre }}</td>
              <td>{{ rol.descripcionRol || "Sin descripción" }}</td>
              <td>
                <button class="delete-button" @click="confirmarEliminar(rol)">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <p v-else class="no-data">❌ No hay roles registrados.</p>

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
            roles: [], // Lista de roles
            filtroNombre: "", // Filtro de búsqueda en tiempo real
            mensajeExito: "",
            mensajeError: ""
        };
    },
    computed: {
        // 🔎 Filtra roles en tiempo real según el nombre
        rolesFiltrados() {
            return this.roles.filter((rol) =>
                rol.Nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
            );
        }
    },
    methods: {
        // 🔄 Obtener lista de roles
        async cargarRoles() {
            try {
                const response = await axios.get("http://localhost:3001/api/rol/all", { withCredentials: true });

                console.log("📩 Roles recibidos:", response.data);

                // Ajustar si la API devuelve un array directo o un objeto con la clave "roles"
                if (Array.isArray(response.data)) {
                    this.roles = response.data; // Caso 1: array directo
                } else if (response.data.roles && Array.isArray(response.data.roles)) {
                    this.roles = response.data.roles; // Caso 2: estructura con "roles"
                } else {
                    console.error("⚠️ Estructura inesperada de respuesta:", response.data);
                }
            } catch (error) {
                console.error("❌ Error obteniendo roles:", error);
            }
        },

        // ⚠️ Confirmación antes de eliminar
        confirmarEliminar(rol) {
            if (confirm(`⚠️ ¿Seguro que quieres eliminar el rol "${rol.Nombre}"?`)) {
                this.eliminarRol(rol.idRol);
            }
        },

        // 🗑️ Eliminar rol
        async eliminarRol(idRol) {
            try {
                console.log(`📤 Eliminando rol con ID: ${idRol}`);

                await axios.delete(`http://localhost:3001/api/rol/${idRol}`, { withCredentials: true });

                console.log("✅ Rol eliminado correctamente.");
                this.mensajeExito = "Rol eliminado correctamente.";
                this.mensajeError = "";

                // 🔄 Refrescar lista de roles
                await this.cargarRoles();
            } catch (error) {
                console.error("❌ Error al eliminar rol:", error);
                this.mensajeError = error.response?.data?.error || "⚠️ Error al eliminar el rol.";
            }
        }
    },
    mounted() {
        this.cargarRoles();
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

/* ❌ Estilo para cuando no hay datos */
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
