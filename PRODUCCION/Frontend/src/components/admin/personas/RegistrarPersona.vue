<template>
    <div class="admin-dashboard">
      <h1 class="welcome-message">📝 Registrar Persona</h1>
  
      <div class="admin-info">
        <h2>📋 Datos de la Persona</h2>
  
        <form @submit.prevent="registrarPersona" class="edit-form">
          <!-- 🏷 Datos de Persona -->
          <h3>📄 Datos Personales</h3>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="persona.Nombre" type="text" required />
          </div>
          <div class="form-group">
            <label>Segundo Nombre (Opcional)</label>
            <input v-model="persona.Seg_Nombre" type="text" />
          </div>
          <div class="form-group">
            <label>Tercer Nombre (Opcional)</label>
            <input v-model="persona.Tercer_Nombre" type="text" />
          </div>
          <div class="form-group">
            <label>Apellido Paterno</label>
            <input v-model="persona.Apellido_Paterno" type="text" required />
          </div>
          <div class="form-group">
            <label>Apellido Materno</label>
            <input v-model="persona.Apellido_Materno" type="text" required />
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input v-model="persona.Correo" type="email" required />
          </div>
          <div class="form-group">
            <label>Teléfono (Opcional)</label>
            <input v-model="persona.Telefono" type="text" />
          </div>
          <div class="form-group">
            <label>Dirección (Opcional)</label>
            <input v-model="persona.Direccion" type="text" />
          </div>
  
          <!-- 🎓 Selección de Carrera -->
          <h3>🎓 Selección de Carrera</h3>
          <div class="form-group">
            <label>Carrera</label>
            <select v-model="persona.idCarrera" required>
              <option :value="null">Ninguna</option>
              <option v-for="carrera in carreras" :key="carrera.idCarrera" :value="carrera.idCarrera">
                {{ carrera.Nombre }}
              </option>
            </select>
          </div>
  
          <button class="save-button" type="submit">
            Registrar Persona
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
        persona: {
          Nombre: "",
          Seg_Nombre: "",
          Tercer_Nombre: "",
          Apellido_Paterno: "",
          Apellido_Materno: "",
          Correo: "",
          Telefono: "",
          Direccion: "",
          idCarrera: null,
        },
        carreras: [],
        mensajeExito: "",
        mensajeError: ""
      };
    },
    methods: {
      async obtenerCarreras() {
        try {
          const response = await axios.get("http://localhost:3001/api/carrera/all", { withCredentials: true });
          this.carreras = response.data;
        } catch (error) {
          console.error("❌ Error obteniendo carreras:", error);
        }
      },
  
      async registrarPersona() {
        try {
          const responsePersona = await axios.post("http://localhost:3001/api/persona/register", this.persona, { withCredentials: true });
  
          console.log("✅ Persona registrada. ID:", responsePersona.data.persona.idPersona);
          
          // Mostrar mensaje de éxito
          this.mensajeExito = "Persona registrada correctamente.";
          this.mensajeError = "";
  
          // Limpiar formulario
          this.persona = {
            Nombre: "",
            Seg_Nombre: "",
            Tercer_Nombre: "",
            Apellido_Paterno: "",
            Apellido_Materno: "",
            Correo: "",
            Telefono: "",
            Direccion: "",
            idCarrera: null,
          };
  
          // Ocultar mensaje después de 3 segundos
          setTimeout(() => {
            this.mensajeExito = "";
          }, 3000);
        } catch (error) {
          console.error("❌ Error al registrar persona:", error);
          
          this.mensajeExito = "";
          this.mensajeError = error.response?.data?.error || "⚠️ Error al registrar la persona.";
  
          // Ocultar mensaje de error después de 5 segundos
          setTimeout(() => {
            this.mensajeError = "";
          }, 5000);
        }
      }
    },
    mounted() {
      this.obtenerCarreras();
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
    
    .error-message {
      color: red;
      font-size: 0.9em;
    }
    
    .password-container {
      display: flex;
      align-items: center;
      position: relative;
    }
    
    .toggle-password {
      position: absolute;
      right: 10px;
      cursor: pointer;
      font-size: 1.2em;
    }
    </style>
    