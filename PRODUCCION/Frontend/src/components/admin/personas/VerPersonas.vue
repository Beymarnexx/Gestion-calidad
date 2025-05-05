<template>
    <div class="admin-dashboard">
      <h1 class="welcome-message">👥 Lista de Personas</h1>
  
      <div class="admin-info">
        <h2>📋 Personas Registradas</h2>
  
        <!-- 🔍 Barra de búsqueda -->
        <input
          type="text"
          v-model="filtroNombre"
          placeholder="Escribe un nombre o apellido para buscar..."
          class="search-bar"
        />
  
        <table class="admin-info-table" v-if="personasFiltradas.length > 0">
          <thead>
            <tr>
              <th>ID Persona</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            <!-- 🏷️ Filtrar personas en tiempo real -->
            <tr v-for="persona in personasFiltradas" :key="persona.idPersona">
              <td>{{ persona.idPersona }}</td>
              <td>{{ persona.Nombre }}</td>
              <td>{{ persona.Apellido_Paterno }}</td>
              <td>{{ persona.Apellido_Materno }}</td>
              <td>{{ persona.Correo }}</td>
              <td>{{ persona.Telefono ? persona.Telefono : "📵 No disponible" }}</td>
              <td>{{ persona.Direccion ? persona.Direccion : "🏠 No registrada" }}</td>
            </tr>
          </tbody>
        </table>
  
        <p v-else class="no-data">❌ No hay personas registradas.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        personas: [], // Lista de personas registradas
        filtroNombre: "" // Valor del filtro de búsqueda
      };
    },
    computed: {
      // 🔎 Filtrar personas en tiempo real por Nombre, Apellido Paterno o Materno
      personasFiltradas() {
        return this.personas.filter((persona) => {
          const termino = this.filtroNombre.toLowerCase();
          return (
            persona.Nombre.toLowerCase().includes(termino) ||
            persona.Apellido_Paterno.toLowerCase().includes(termino) ||
            persona.Apellido_Materno.toLowerCase().includes(termino)
          );
        });
      }
    },
    methods: {
      async cargarPersonas() {
        try {
          const response = await axios.get("http://localhost:3001/api/persona/all", { withCredentials: true });
  
          console.log("📩 Datos de personas recibidos:", response.data);
  
          if (Array.isArray(response.data)) {
            this.personas = response.data;
          } else if (response.data.personas && Array.isArray(response.data.personas)) {
            this.personas = response.data.personas;
          } else {
            console.error("⚠️ Estructura inesperada de respuesta:", response.data);
          }
  
          console.log("✅ Personas cargadas:", this.personas);
        } catch (error) {
          console.error("❌ Error al cargar personas:", error);
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
  
  /* ❌ Estilo para cuando no hay datos */
  .no-data {
    text-align: center;
    color: gray;
    font-size: 1.2em;
    margin-top: 20px;
  }
  </style>
  