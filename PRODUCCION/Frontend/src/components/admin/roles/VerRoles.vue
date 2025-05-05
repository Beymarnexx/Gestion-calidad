<template>
    <div class="admin-dashboard">
      <h1 class="welcome-message">🎭 Lista de Roles</h1>
  
      <div class="admin-info">
        <h2>📋 Roles Registrados</h2>
  
        <!-- 🔍 Barra de búsqueda -->
        <input
          type="text"
          v-model="filtroNombre"
          placeholder="Escribe un nombre de rol para buscar..."
          class="search-bar"
        />
  
        <table class="admin-info-table" v-if="rolesFiltrados.length > 0">
          <thead>
            <tr>
              <th>ID Rol</th>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <!-- 🏷️ Filtrar roles en tiempo real -->
            <tr v-for="rol in rolesFiltrados" :key="rol.idRol">
              <td>{{ rol.idRol }}</td>
              <td>{{ rol.Nombre }}</td>
              <td>{{ rol.descripcionRol ? rol.descripcionRol : "📌 Sin descripción" }}</td>
            </tr>
          </tbody>
        </table>
  
        <p v-else class="no-data">❌ No hay roles registrados.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        roles: [], // Lista de roles registrados
        filtroNombre: "" // Valor del filtro de búsqueda
      };
    },
    computed: {
      // 🔎 Filtrar roles en tiempo real por Nombre del Rol
      rolesFiltrados() {
        return this.roles.filter((rol) =>
          rol.Nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        );
      }
    },
    methods: {
      async cargarRoles() {
        try {
          const response = await axios.get("http://localhost:3001/api/rol/all", { withCredentials: true });
  
          console.log("📩 Datos de roles recibidos:", response.data);
  
          if (Array.isArray(response.data)) {
            this.roles = response.data;
          } else if (response.data.roles && Array.isArray(response.data.roles)) {
            this.roles = response.data.roles;
          } else {
            console.error("⚠️ Estructura inesperada de respuesta:", response.data);
          }
  
          console.log("✅ Roles cargados:", this.roles);
        } catch (error) {
          console.error("❌ Error al cargar roles:", error);
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
  
  /* ❌ Estilo para cuando no hay datos */
  .no-data {
    text-align: center;
    color: gray;
    font-size: 1.2em;
    margin-top: 20px;
  }
  </style>
  