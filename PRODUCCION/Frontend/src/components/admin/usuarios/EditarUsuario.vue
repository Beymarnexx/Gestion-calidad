<template>
  <div class="admin-dashboard">
    <h1 class="welcome-message">✏️ Editar Usuario</h1>

    <div class="admin-info">
      <h2>🔎 Seleccionar Usuario</h2>

      <!-- Selección de Usuario -->
      <div class="form-group">
        <label>Seleccionar Usuario</label>
        <select v-model="usuarioSeleccionado" @change="cargarDatosUsuario" required>
          <option :value="null" disabled>Selecciona un usuario...</option>
          <option v-for="usuario in usuarios" :key="usuario.idUsuario" :value="usuario.idUsuario">
            {{ usuario.Nombre_usuario }}
            ({{ usuario.Persona ? usuario.Persona.Nombre + " " + usuario.Persona.Apellido_Paterno : "Sin persona asignada" }})
          </option>
        </select>
      </div>

      <h2>📋 Datos del Usuario</h2>

      <form @submit.prevent="actualizarUsuario" class="edit-form">
        <!-- Nombre de Usuario (No editable) -->
        <div class="form-group">
          <label>Nombre de Usuario</label>
          <input v-model="usuario.Nombre_usuario" type="text" readonly class="input-bloqueado" />
        </div>

        <!-- Estado Bloqueado -->
        <div class="form-group">
          <label>Estado</label>
          <select v-model="usuario.Bloqueado" required>
            <option :value="false">✅ Activo</option>
            <option :value="true">⛔ Bloqueado</option>
          </select>
        </div>

        <!-- Botón de Actualizar -->
        <button class="save-button" type="submit">
          Actualizar Usuario
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
      usuarios: [], // Lista de usuarios registrados
      usuarioSeleccionado: null, // ID del usuario seleccionado
      usuario: {
        idUsuario: null,
        Nombre_usuario: "",
        Bloqueado: false
      },
      mensajeExito: "",
      mensajeError: ""
    };
  },
  methods: {
    // 🔄 Obtener lista de usuarios
    async cargarUsuarios() {
      try {
        const response = await axios.get("http://localhost:3001/api/usuario/all", { withCredentials: true });

        console.log("📩 Usuarios recibidos:", response.data);

        // ✅ Adaptar la respuesta a la estructura del backend
        if (Array.isArray(response.data)) {
          this.usuarios = response.data; // La API devuelve un array directo
        } else {
          console.error("⚠️ Estructura inesperada de respuesta:", response.data);
        }
      } catch (error) {
        console.error("❌ Error obteniendo usuarios:", error);
      }
    },

    // 📌 Cargar datos del usuario seleccionado
    async cargarDatosUsuario() {
      if (!this.usuarioSeleccionado) {
        console.warn("⚠️ No se ha seleccionado ningún usuario.");
        return;
      }

      console.log(`📥 Cargando datos para usuario con ID: ${this.usuarioSeleccionado}`);

      try {
        const response = await axios.get(`http://localhost:3001/api/usuario/${this.usuarioSeleccionado}`, { withCredentials: true });

        console.log("📥 Datos del usuario seleccionado:", response.data);

        if (response.data) {
          this.usuario = { ...response.data };
          this.usuario.idUsuario = this.usuarioSeleccionado;
          console.log("✅ Usuario cargado correctamente:", this.usuario);
        } else {
          console.error("⚠️ No se encontraron datos para el usuario seleccionado.");
        }
      } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
        this.mensajeError = "❌ No se encontró el usuario seleccionado.";
      }
    },

    // 📤 Actualizar Usuario
    async actualizarUsuario() {
      if (!this.usuario.idUsuario) {
        console.error("❌ No se ha asignado correctamente el ID del usuario.");
        this.mensajeError = "⚠️ No se ha seleccionado un usuario válido.";
        return;
      }

      try {
        console.log(`📤 Enviando actualización para ID: ${this.usuario.idUsuario}`);

        // ✅ Enviar solo los campos que pueden ser editados
        const datosActualizados = {
          Nombre_usuario: this.usuario.Nombre_usuario,
          Bloqueado: this.usuario.Bloqueado
        };

        await axios.put(`http://localhost:3001/api/usuario/${this.usuario.idUsuario}`, datosActualizados, { withCredentials: true });

        console.log("✅ Usuario actualizado:", this.usuario);
        this.mensajeExito = "Usuario actualizado correctamente.";
        this.mensajeError = "";

        setTimeout(() => (this.mensajeExito = ""), 3000);
        this.cargarUsuarios(); // Refrescar la lista de usuarios
      } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        this.mensajeError = error.response?.data?.error || "⚠️ Error al actualizar el usuario.";
      }
    }
  },
  mounted() {
    this.cargarUsuarios();
  }
};
</script>

<style scoped>
@import "@/assets/adminStyles.css";

/* 🔹 Estilo para hacer que el campo de usuario sea no editable y gris */
.input-bloqueado {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  pointer-events: none;
  border: 1px solid #aaa;
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
