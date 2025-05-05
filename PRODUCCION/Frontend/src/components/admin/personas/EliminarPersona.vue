<template>
    <div class="admin-dashboard">
      <h1 class="welcome-message">🗑️ Eliminar Persona</h1>
  
      <div class="admin-info">
        <h2>🔍 Buscar Persona</h2>
        
        <!-- 🔍 Barra de búsqueda -->
        <input
          type="text"
          v-model="filtroNombre"
          placeholder="Escribe un nombre para buscar..."
          class="search-bar"
        />
  
        <h2>📋 Lista de Personas</h2>
  
        <table class="admin-info-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- 🏷️ Filtrar personas en tiempo real -->
            <tr v-for="persona in personasFiltradas" :key="persona.idPersona">
              <td>{{ persona.idPersona }}</td>
              <td>{{ persona.Nombre }} {{ persona.Apellido_Paterno }}</td>
              <td>{{ persona.Correo }}</td>
              <td>
                <button class="delete-button" @click="confirmarEliminar(persona)">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
  
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
        personas: [], // Lista de personas
        filtroNombre: "", // Filtro de búsqueda en tiempo real
        mensajeExito: "",
        mensajeError: ""
      };
    },
    computed: {
      // 🔎 Filtra personas en tiempo real según el nombre
      personasFiltradas() {
        return this.personas.filter((persona) =>
          persona.Nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        );
      }
    },
    methods: {
      // 🔄 Obtener lista de personas
      async cargarPersonas() {
        try {
          const response = await axios.get("http://localhost:3001/api/persona/all", { withCredentials: true });
  
          console.log("📩 Personas recibidas:", response.data);
  
          if (Array.isArray(response.data.personas)) {
            this.personas = response.data.personas;
          } else {
            console.error("⚠️ Estructura inesperada de respuesta:", response.data);
          }
        } catch (error) {
          console.error("❌ Error obteniendo personas:", error);
        }
      },
  
      // ⚠️ Confirmación antes de eliminar
      confirmarEliminar(persona) {
        if (confirm(`⚠️ ¿Seguro que quieres eliminar a ${persona.Nombre} ${persona.Apellido_Paterno}?`)) {
          this.eliminarPersona(persona.idPersona);
        }
      },
  
      // 🗑️ Eliminar persona
      async eliminarPersona(idPersona) {
        try {
          console.log(`📤 Eliminando persona con ID: ${idPersona}`);
  
          await axios.delete(`http://localhost:3001/api/persona/${idPersona}`, { withCredentials: true });
  
          console.log("✅ Persona eliminada correctamente.");
          this.mensajeExito = "Persona eliminada correctamente.";
          this.mensajeError = "";
  
          // 🔄 Refrescar lista de personas
          this.cargarPersonas();
        } catch (error) {
          console.error("❌ Error al eliminar persona:", error);
          this.mensajeError = error.response?.data?.error || "⚠️ Error al eliminar la persona.";
        }
      }
    },
    mounted() {
      this.cargarPersonas();
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
  