<template>
  <div class="admin-dashboard">
    <h1 class="welcome-message">👥 Lista de Usuarios</h1>

    <div class="admin-info">
      <h2>Usuarios Registrados</h2>

      <table class="admin-info-table" v-if="usuarios.length > 0">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>ID Persona</th>
            <th>Nombre de Usuario</th>
            <th>Contraseña</th>
            <th>Estado</th>
            <th>Intentos Fallidos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.idUsuario">
            <td>{{ usuario.idUsuario }}</td>
            <td>{{ usuario.idPersona }}</td>
            <td>{{ usuario.Nombre_usuario }}</td>
            <td>🔒 Oculta por seguridad</td>
            <td>
              <span :class="usuario.Bloqueado ? 'blocked' : 'active'">
                {{ usuario.Bloqueado ? "Bloqueado" : "Activo" }}
              </span>
            </td>
            <td>{{ usuario.intentos_fallidos }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="no-data">❌ No hay usuarios registrados.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return { 
      usuarios: [] 
    };
  },
  methods: {
    async cargarUsuarios() {
      try {
        const response = await axios.get("http://localhost:3001/api/usuario/all", { withCredentials: true });

        console.log("📥 Respuesta de la API:", response.data);

        // 🔍 Verificar si los datos vienen en `response.data.usuarios` o directamente en `response.data`
        if (Array.isArray(response.data)) {
          this.usuarios = response.data; // Si es un array, se asigna directamente
        } else if (response.data.usuarios && Array.isArray(response.data.usuarios)) {
          this.usuarios = response.data.usuarios; // Si está dentro de un objeto, se accede a la propiedad `usuarios`
        } else {
          console.error("⚠️ Formato inesperado de respuesta de la API:", response.data);
        }

        console.log("✅ Usuarios cargados:", this.usuarios);
      } catch (error) {
        console.error("❌ Error al cargar usuarios:", error);
      }
    },
  },
  mounted() {
    this.cargarUsuarios();
  },
};
</script>

<style scoped>
@import "@/assets/adminStyles.css";

/* Estilo para cuando no hay datos */
.no-data {
  text-align: center;
  color: gray;
  font-size: 1.2em;
  margin-top: 20px;
}

/* Estilo para el estado de usuario */
.blocked {
  color: red;
  font-weight: bold;
}
.active {
  color: green;
  font-weight: bold;
}
</style>
