<template>
    <div class="admin-dashboard">
        <h1 class="welcome-message">🎭 Roles Asignados</h1>

        <div class="admin-info">
            <h2>📋 Lista de Usuarios con Roles</h2>

            <!-- 🔍 Barra de búsqueda -->
            <input
                type="text"
                v-model="filtroNombre"
                placeholder="Escribe un nombre de usuario para buscar..."
                class="search-bar"
            />

            <table class="admin-info-table" v-if="rolesAsignadosFiltrados.length > 0">
                <thead>
                    <tr>
                        <th>ID Asignación</th>
                        <th>Usuario</th>
                        <th>Rol Asignado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="asignacion in rolesAsignadosFiltrados" :key="asignacion.idUsuarioRol">
                        <td>{{ asignacion.idUsuarioRol }}</td>
                        <td>{{ asignacion.Usuario.Nombre_usuario }}</td>
                        <td>{{ asignacion.Rol.Nombre }}</td>
                    </tr>
                </tbody>
            </table>

            <p v-else class="no-data">❌ No hay roles asignados.</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            rolesAsignados: [], // Lista de roles asignados
            filtroNombre: "" // Filtro de búsqueda
        };
    },
    computed: {
        // 🔎 Filtrar asignaciones en tiempo real por nombre de usuario o rol
        rolesAsignadosFiltrados() {
            return this.rolesAsignados.filter((asignacion) => {
                const termino = this.filtroNombre.toLowerCase();
                return (
                    asignacion.Usuario.Nombre_usuario.toLowerCase().includes(termino) ||
                    asignacion.Rol.Nombre.toLowerCase().includes(termino)
                );
            });
        }
    },
    methods: {
        async cargarRolesAsignados() {
            try {
                const response = await axios.get("http://localhost:3001/api/usuariorol/all", { withCredentials: true });

                if (Array.isArray(response.data)) {
                    this.rolesAsignados = response.data;
                } else if (response.data.rolesAsignados && Array.isArray(response.data.rolesAsignados)) {
                    this.rolesAsignados = response.data.rolesAsignados;
                } else {
                    console.error("⚠️ Estructura inesperada de respuesta:", response.data);
                }

                console.log("✅ Roles asignados cargados:", this.rolesAsignados);
            } catch (error) {
                console.error("❌ Error obteniendo roles asignados:", error);
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

/* ❌ Estilo para cuando no hay datos */
.no-data {
    text-align: center;
    color: gray;
    font-size: 1.2em;
    margin-top: 20px;
}
</style>
