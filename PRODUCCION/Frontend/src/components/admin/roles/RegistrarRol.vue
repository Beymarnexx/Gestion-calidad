<template>
  <div class="admin-dashboard">
    <h1 class="welcome-message">⚖️ Registrar Rol</h1>

    <div class="admin-info">
      <h2>📋 Datos del Rol</h2>

      <form @submit.prevent="registrarRol" class="edit-form">
        <!-- 🏷 Datos del Rol -->
        <h3>📄 Información del Rol</h3>
        <div class="form-group">
          <label>Nombre del Rol</label>
          <input v-model="rol.Nombre" type="text" required />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="rol.descripcionRol" rows="3" required></textarea>
        </div>

        <button class="save-button" type="submit">
          Registrar Rol
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
      rol: {
        Nombre: "",
        descripcionRol: "",
      },
      mensajeExito: "",
      mensajeError: "",
    };
  },
  methods: {
    async registrarRol() {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/rol/register",
          this.rol,
          { withCredentials: true }
        );

        if (response.status === 201 || response.status === 200) {
          console.log("✅ Rol registrado. ID:", response.data.rol?.idRol || "Desconocido");

          // Mostrar mensaje de éxito
          this.mensajeExito = "✅ Rol registrado correctamente.";
          this.mensajeError = "";

          // Limpiar formulario
          this.rol = {
            Nombre: "",
            descripcionRol: "",
          };

          // Ocultar mensaje después de 3 segundos
          setTimeout(() => {
            this.mensajeExito = "";
          }, 3000);
        } else {
          throw new Error("⚠️ Respuesta inesperada del servidor.");
        }
      } catch (error) {
        console.error("❌ Error al registrar rol:", error);

        // Si ya se creó el rol, evitar mostrar error innecesario
        if (error.response?.status === 409) {
          this.mensajeError = "⚠️ El rol ya existe.";
        } else {
          this.mensajeError = error.response?.data?.error || "⚠️ Error al registrar el rol.";
        }

        this.mensajeExito = "";

        // Ocultar mensaje de error después de 5 segundos
        setTimeout(() => {
          this.mensajeError = "";
        }, 5000);
      }
    },
  },
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
