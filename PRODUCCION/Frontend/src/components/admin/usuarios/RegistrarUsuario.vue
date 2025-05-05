<template>
  <div class="admin-dashboard">
    <h1 class="welcome-message">📝 Registrar Usuario</h1>

    <div class="admin-info">
      <h2>📋 Datos del Usuario</h2>

      <form @submit.prevent="registrarUsuario" class="edit-form">
        <!-- 🔎 Selección de Persona -->
        <div class="form-group">
          <label>Seleccionar Persona (Correo)</label>
          <select v-model="usuario.idPersona" required>
            <option :value="null" disabled>Selecciona un correo...</option>
            <option v-for="persona in personasDisponibles" :key="persona.idPersona" :value="persona.idPersona">
              {{ persona.Correo }} ({{ persona.Nombre }} {{ persona.Apellido_Paterno }})
            </option>
          </select>
        </div>

        <!-- 📛 Nombre de Usuario -->
        <div class="form-group">
          <label>Nombre de Usuario</label>
          <input v-model="usuario.Nombre_usuario" type="text" required />
        </div>

        <!-- 🔒 Contraseña -->
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="usuario.Contrasenia" type="password" required @input="validarContrasena" />
          <small :class="{ 'error-message': !validaLongitud }">🔢 Mínimo 12 caracteres</small>
          <small :class="{ 'error-message': !validaMayuscula }">🔠 Al menos una letra mayúscula</small>
          <small :class="{ 'error-message': !validaNumero }">🔢 Al menos un número</small>
          <small :class="{ 'error-message': !validaEspecial }">🔣 Al menos un carácter especial</small>
        </div>

        <!-- 🔑 Confirmar Contraseña -->
        <div class="form-group">
          <label>Confirmar Contraseña</label>
          <input v-model="confirmarContrasena" type="password" required />
          <small v-if="confirmarContrasena && usuario.Contrasenia !== confirmarContrasena" class="error-message">
            ❌ Las contraseñas no coinciden
          </small>
        </div>

        <!-- Botón de Registro -->
        <button class="save-button" type="submit" :disabled="!validacionCompleta || usuario.Contrasenia !== confirmarContrasena">
          Registrar Usuario
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
      personasDisponibles: [],
      usuario: {
        idPersona: null,
        Nombre_usuario: "",
        Contrasenia: ""
      },
      confirmarContrasena: "",
      validaLongitud: false,
      validaMayuscula: false,
      validaNumero: false,
      validaEspecial: false,
      mensajeExito: "",
      mensajeError: ""
    };
  },
  computed: {
    validacionCompleta() {
      return this.validaLongitud && this.validaMayuscula && this.validaNumero && this.validaEspecial;
    }
  },
  methods: {
    async obtenerPersonasDisponibles() {
      try {
        const response = await axios.get("http://localhost:3001/api/persona/all", { withCredentials: true });

        console.log("📩 Personas recibidas:", response.data);

        // Verificar si response.data contiene un array de personas
        if (Array.isArray(response.data)) {
          this.personasDisponibles = response.data;
        } else if (response.data.personas && Array.isArray(response.data.personas)) {
          this.personasDisponibles = response.data.personas;
        } else {
          console.error("⚠️ Estructura inesperada de respuesta:", response.data);
        }
      } catch (error) {
        console.error("❌ Error obteniendo personas disponibles:", error);
      }
    },

    validarContrasena() {
      const password = this.usuario.Contrasenia;
      this.validaLongitud = password.length >= 12;
      this.validaMayuscula = /[A-Z]/.test(password);
      this.validaNumero = /[0-9]/.test(password);
      this.validaEspecial = /[\W_]/.test(password);
    },

    async registrarUsuario() {
      if (!this.validacionCompleta || this.usuario.Contrasenia !== this.confirmarContrasena) {
        this.mensajeError = "⚠️ Corrige los errores antes de registrar.";
        setTimeout(() => (this.mensajeError = ""), 5000);
        return;
      }

      try {
        const response = await axios.post("http://localhost:3001/api/usuario/register", this.usuario, { withCredentials: true });

        console.log("✅ Usuario registrado:", response.data);
        this.mensajeExito = "Usuario registrado correctamente.";
        this.mensajeError = "";

        // Limpiar formulario
        this.usuario = { idPersona: null, Nombre_usuario: "", Contrasenia: "" };
        this.confirmarContrasena = "";

        setTimeout(() => (this.mensajeExito = ""), 3000);
        this.obtenerPersonasDisponibles(); // Actualizar lista
      } catch (error) {
        console.error("❌ Error al registrar usuario:", error);
        this.mensajeError = error.response?.data?.error || "⚠️ Error al registrar el usuario.";
        setTimeout(() => (this.mensajeError = ""), 5000);
      }
    }
  },
  mounted() {
    this.obtenerPersonasDisponibles();
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
