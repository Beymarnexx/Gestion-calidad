<template>
    <div class="admin-dashboard">
      <h1 class="welcome-message">✏️ Editar Persona</h1>
  
      <div class="admin-info">
        <h2>🔎 Seleccionar Persona</h2>
  
        <!-- Selección de Persona -->
        <div class="form-group">
          <label>Seleccionar Persona (Correo)</label>
          <select v-model="personaSeleccionada" @change="cargarDatosPersona" required>
            <option :value="null" disabled>Selecciona una persona...</option>
            <option v-for="persona in personas" :key="persona.idPersona" :value="persona.idPersona">
              {{ persona.Correo }} ({{ persona.Nombre }} {{ persona.Apellido_Paterno }})
            </option>
          </select>
        </div>
  
        <h2>📋 Datos de la Persona</h2>
  
        <form @submit.prevent="actualizarPersona" class="edit-form">
          <!-- Nombre -->
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="persona.Nombre" type="text" required />
          </div>
  
          <!-- Apellidos -->
          <div class="form-group">
            <label>Apellido Paterno</label>
            <input v-model="persona.Apellido_Paterno" type="text" required />
          </div>
          <div class="form-group">
            <label>Apellido Materno</label>
            <input v-model="persona.Apellido_Materno" type="text" required />
          </div>
  
          <!-- Correo -->
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input v-model="persona.Correo" type="email" required />
          </div>
  
          <!-- Teléfono -->
          <div class="form-group">
            <label>Teléfono (Opcional)</label>
            <input v-model="persona.Telefono" type="text" />
          </div>
  
          <!-- Dirección -->
          <div class="form-group">
            <label>Dirección (Opcional)</label>
            <input v-model="persona.Direccion" type="text" />
          </div>
  
          <!-- Botón de Actualizar -->
          <button class="save-button" type="submit">
            Actualizar Persona
          </button>
        </form>
  
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
        personas: [],
        personaSeleccionada: null,
        persona: {
          idPersona: null,
          Nombre: "",
          Apellido_Paterno: "",
          Apellido_Materno: "",
          Correo: "",
          Telefono: "",
          Direccion: ""
        },
        mensajeExito: "",
        mensajeError: ""
      };
    },
    methods: {
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
  
      async cargarDatosPersona() {
        if (!this.personaSeleccionada) {
          console.warn("⚠️ No se ha seleccionado ninguna persona.");
          return;
        }
  
        console.log(`📥 Cargando datos para persona con ID: ${this.personaSeleccionada}`);
  
        try {
          const response = await axios.get(`http://localhost:3001/api/persona/${this.personaSeleccionada}`, { withCredentials: true });
  
          console.log("📥 Datos de la persona seleccionada:", response.data);
  
          if (response.data) {
            this.persona = { ...response.data };
            this.persona.idPersona = this.personaSeleccionada;
            console.log("✅ Persona cargada correctamente:", this.persona);
          } else {
            console.error("⚠️ No se encontraron datos para la persona seleccionada.");
          }
        } catch (error) {
          console.error("❌ Error al cargar datos de la persona:", error);
          this.mensajeError = "❌ No se encontró la persona seleccionada.";
        }
      },
  
      async actualizarPersona() {
        if (!this.persona.idPersona) {
          console.error("❌ No se ha asignado correctamente el ID de la persona.");
          this.mensajeError = "⚠️ No se ha seleccionado una persona válida.";
          return;
        }
  
        try {
          console.log(`📤 Enviando actualización para ID: ${this.persona.idPersona}`);
  
          await axios.put(`http://localhost:3001/api/persona/${this.persona.idPersona}`, this.persona, { withCredentials: true });
  
          console.log("✅ Persona actualizada:", this.persona);
          this.mensajeExito = "Persona actualizada correctamente.";
          this.mensajeError = "";
  
          setTimeout(() => (this.mensajeExito = ""), 3000);
          this.cargarPersonas(); // Refrescar la lista de personas
        } catch (error) {
          console.error("❌ Error al actualizar persona:", error);
          this.mensajeError = error.response?.data?.error || "⚠️ Error al actualizar la persona.";
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
  
  .success-message {
    margin-top: 15px;
    padding: 10px;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 5px;
  }
  
  .error-message {
    margin-top: 15px;
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
  }
  </style>
  