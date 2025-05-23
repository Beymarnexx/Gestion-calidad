<template>
    <div class="admin-dashboard">
        <h1 class="welcome-message">🗑️ Eliminar Rol Asignado</h1>
        <div class="admin-info">
            <h2>🔍 Buscar Usuario</h2>
            <!-- 🔍 Barra de búsqueda -->
            <input
                type="text"
                v-model="filtroNombre"
                placeholder="Escribe un nombre de usuario para buscar..."
                class="search-bar"
            />
            <h2>📋 Lista de Roles Asignados</h2>
            <table class="admin-info-table" v-if="rolesAsignados.length > 0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Rol Asignado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 🏷️ Filtrar roles asignados en tiempo real -->
                    <tr v-for="asignacion in rolesFiltrados" :key="asignacion.idUsuarioRol">
                        <td>{{ asignacion.idUsuarioRol }}</td>
                        <td>{{ asignacion.Usuario.Nombre_usuario }}</td>
                        <td>{{ asignacion.Rol.Nombre }}</td>
                        <td>
                            <button class="delete-button" @click="confirmarEliminar(asignacion)">
                                🗑️ Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else class="no-data">❌ No hay roles asignados registrados.</p>
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
            rolesAsignados: [], // Lista de roles asignados a usuarios
            filtroNombre: "", // Filtro de búsqueda en tiempo real
            mensajeExito: "",
            mensajeError: ""
        };
    },
    computed: {
        // 🔎 Filtra roles asignados en tiempo real por usuario
        rolesFiltrados() {
            return this.rolesAsignados.filter((asignacion) =>
                asignacion.Usuario.Nombre_usuario.toLowerCase().includes(this.filtroNombre.toLowerCase())
            );
        }
    },
    methods: {
        // 🔄 Obtener lista de roles asignados
        async cargarRolesAsignados() {
            try {
                const response = await axios.get("http://localhost:3001/api/usuariorol/all", { withCredentials: true });
                console.log("📩 Roles asignados recibidos:", response.data);
                if (Array.isArray(response.data)) {
                    this.rolesAsignados = response.data; 
                } else if (response.data.rolesAsignados && Array.isArray(response.data.rolesAsignados)) {
                    this.rolesAsignados = response.data.rolesAsignados;
                } else {
                    console.error("⚠️ Estructura inesperada de respuesta:", response.data);
                }
            } catch (error) {
                console.error("❌ Error obteniendo roles asignados:", error);
            }
        },
        // ⚠️ Confirmación antes de eliminar
        confirmarEliminar(asignacion) {
            if (confirm(`⚠️ ¿Seguro que quieres eliminar el rol "${asignacion.Rol.Nombre}" del usuario "${asignacion.Usuario.Nombre_usuario}"?`)) {
                this.eliminarRolAsignado(asignacion.idUsuarioRol);
            }
        },
        // 🗑️ Eliminar rol asignado
        async eliminarRolAsignado(idUsuarioRol) {
            try {
                console.log(`📤 Eliminando rol asignado con ID: ${idUsuarioRol}`);

                await axios.delete(`http://localhost:3001/api/usuariorol/${idUsuarioRol}`, { withCredentials: true });

                console.log("✅ Rol asignado eliminado correctamente.");
                this.mensajeExito = "Rol asignado eliminado correctamente.";
                this.mensajeError = "";
                // 🔄 Refrescar lista de roles asignados
                await this.cargarRolesAsignados();
            } catch (error) {
                console.error("❌ Error al eliminar rol asignado:", error);
                this.mensajeError = error.response?.data?.error || "⚠️ Error al eliminar el rol asignado.";
            }
        }
    },
    mounted() {
        this.cargarRolesAsignados();
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
/* ❌ Estilo para cuando no hay datos */
.no-data {
    text-align: center;
    color: gray;
    font-size: 1.2em;
    margin-top: 20px;
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
