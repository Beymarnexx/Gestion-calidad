<template>
    <div class="admin-dashboard">
      <h1 class="welcome-message">✏️ Editar Rol</h1>
  
      <div class="admin-info">
        <h2>🔎 Seleccionar Rol</h2>
  
        <!-- Selección de Rol -->
        <div class="form-group">
          <label>Seleccionar Rol</label>
          <select v-model="rolSeleccionado" @change="cargarDatosRol" required>
            <option :value="null" disabled>Selecciona un rol...</option>
            <option v-for="rol in roles" :key="rol.idRol" :value="rol.idRol">
              {{ rol.Nombre }} ({{ rol.descripcionRol }})
            </option>
          </select>
        </div>
  
        <h2>📋 Datos del Rol</h2>
  
        <form @submit.prevent="actualizarRol" class="edit-form">
          <!-- Nombre del Rol -->
          <div class="form-group">
            <label>Nombre del Rol</label>
            <input v-model="rol.Nombre" type="text" required />
          </div>
  
          <!-- Descripción del Rol -->
          <div class="form-group">
            <label>Descripción</label>
            <input v-model="rol.descripcionRol" type="text" required />
          </div>
  
          <!-- Botón de Actualizar -->
          <button class="save-button" type="submit">
            Actualizar Rol
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
        roles: [],
        rolSeleccionado: null,
        rol: {
          idRol: null,
          Nombre: "",
          descripcionRol: ""
        },
        mensajeExito: "",
        mensajeError: ""
      };
    },
    methods: {
      async cargarRoles() {
        try {
          const response = await axios.get("http://localhost:3001/api/rol/all", { withCredentials: true });
  
          console.log("📩 Roles recibidos:", response.data);
  
          if (Array.isArray(response.data)) {
            this.roles = response.data;
          } else {
            console.error("⚠️ Estructura inesperada de respuesta:", response.data);
          }
        } catch (error) {
          console.error("❌ Error obteniendo roles:", error);
        }
      },
  
      async cargarDatosRol() {
        if (!this.rolSeleccionado) {
          console.warn("⚠️ No se ha seleccionado ningún rol.");
          return;
        }
  
        console.log(`📥 Cargando datos para rol con ID: ${this.rolSeleccionado}`);
  
        try {
          const response = await axios.get(`http://localhost:3001/api/rol/${this.rolSeleccionado}`, { withCredentials: true });
  
          console.log("📥 Datos del rol seleccionado:", response.data);
  
          if (response.data) {
            this.rol = { ...response.data };
            this.rol.idRol = this.rolSeleccionado;
            console.log("✅ Rol cargado correctamente:", this.rol);
          } else {
            console.error("⚠️ No se encontraron datos para el rol seleccionado.");
          }
        } catch (error) {
          console.error("❌ Error al cargar datos del rol:", error);
          this.mensajeError = "❌ No se encontró el rol seleccionado.";
        }
      },
  
      async actualizarRol() {
        if (!this.rol.idRol) {
          console.error("❌ No se ha asignado correctamente el ID del rol.");
          this.mensajeError = "⚠️ No se ha seleccionado un rol válido.";
          return;
        }
  
        try {
          console.log(`📤 Enviando actualización para ID: ${this.rol.idRol}`);
  
          await axios.put(`http://localhost:3001/api/rol/${this.rol.idRol}`, this.rol, { withCredentials: true });
  
          console.log("✅ Rol actualizado:", this.rol);
          this.mensajeExito = "Rol actualizado correctamente.";
          this.mensajeError = "";
  
          setTimeout(() => (this.mensajeExito = ""), 3000);
          this.cargarRoles(); // Refrescar la lista de roles
        } catch (error) {
          console.error("❌ Error al actualizar rol:", error);
          this.mensajeError = error.response?.data?.error || "⚠️ Error al actualizar el rol.";
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
