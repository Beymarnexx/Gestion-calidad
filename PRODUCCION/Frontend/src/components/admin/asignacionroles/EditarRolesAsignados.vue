<template>
    <div class="admin-dashboard">
        <h1 class="welcome-message">✏️ Editar Roles Asignados</h1>

        <div class="admin-info">
            <h2>🔎 Seleccionar Usuario</h2>
            <div class="form-group">
                <label>Seleccionar Usuario</label>
                <select v-model="usuarioSeleccionado" @change="filtrarRolesAsignados" required>
                    <option :value="null" disabled>Selecciona un usuario...</option>
                    <option v-for="usuario in usuarios" :key="usuario.idUsuario" :value="usuario.idUsuario">
                        {{ usuario.Nombre_usuario }} ({{ usuario.Persona?.Correo }})
                    </option>
                </select>
            </div>

            <h2>🎭 Roles Asignados</h2>
            <div class="form-group">
                <label>Seleccionar Rol Asignado</label>
                <select v-model="rolAsignadoSeleccionado" required>
                    <option :value="null" disabled>Selecciona un rol asignado...</option>
                    <option v-for="asignacion in rolesAsignadosFiltrados" :key="asignacion.idUsuarioRol" :value="asignacion.idUsuarioRol">
                        {{ asignacion.nombreRol }}
                    </option>
                </select>
            </div>

            <h2>🎭 Seleccionar Nuevo Rol</h2>
            <div class="form-group">
                <label>Seleccionar Nuevo Rol</label>
                <select v-model="nuevoRol" required>
                    <option :value="null" disabled>Selecciona un nuevo rol...</option>
                    <option v-for="rol in rolesDisponiblesParaAsignar" :key="rol.idRol" :value="rol.idRol">
                        {{ rol.Nombre }}
                    </option>
                </select>
            </div>

            <button class="save-button" @click="confirmarActualizacion" :disabled="!rolAsignadoSeleccionado || !nuevoRol">
                🔄 Actualizar Rol Asignado
            </button>

            <div v-if="mensajeExito" class="success-message">
                ✅ {{ mensajeExito }}
            </div>

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
            usuarios: [],
            roles: [],
            rolesAsignados: [],
            usuarioSeleccionado: null,
            rolAsignadoSeleccionado: null,
            nuevoRol: null,
            mensajeExito: "",
            mensajeError: ""
        };
    },
    computed: {
        // 🔄 Filtra los roles asignados del usuario seleccionado
        rolesAsignadosFiltrados() {
            if (!this.usuarioSeleccionado) return [];
            return this.rolesAsignados
                .filter(asignacion => asignacion.idUsuario === this.usuarioSeleccionado)
                .map(asignacion => {
                    const rolEncontrado = this.roles.find(rol => rol.idRol === asignacion.idRol);
                    return { 
                        idUsuarioRol: asignacion.idUsuarioRol, 
                        nombreRol: rolEncontrado ? rolEncontrado.Nombre : "Desconocido"
                    };
                });
        },

        // 🔄 Excluir roles ya asignados para mostrar solo los disponibles
        rolesDisponiblesParaAsignar() {
            if (!this.usuarioSeleccionado) return this.roles;

            const rolesAsignadosIds = this.rolesAsignados
                .filter(asignacion => asignacion.idUsuario === this.usuarioSeleccionado)
                .map(asignacion => asignacion.idRol);

            return this.roles.filter(rol => !rolesAsignadosIds.includes(rol.idRol));
        }
    },
    methods: {
        async cargarDatos() {
            try {
                const [usuariosResponse, rolesResponse, rolesAsignadosResponse] = await Promise.all([
                    axios.get("http://localhost:3001/api/usuario/all", { withCredentials: true }),
                    axios.get("http://localhost:3001/api/rol/all", { withCredentials: true }),
                    axios.get("http://localhost:3001/api/usuariorol/all", { withCredentials: true }),
                ]);

                this.usuarios = usuariosResponse.data;
                this.roles = rolesResponse.data;
                this.rolesAsignados = rolesAsignadosResponse.data;

            } catch (error) {
                console.error("❌ Error cargando datos:", error);
            }
        },

        confirmarActualizacion() {
            const rolActual = this.rolesAsignadosFiltrados.find(r => r.idUsuarioRol === this.rolAsignadoSeleccionado)?.nombreRol;
            const nuevoRolNombre = this.roles.find(rol => rol.idRol === this.nuevoRol)?.Nombre;

            const confirmacion = confirm(
                `⚠️ ¿Estás seguro de cambiar el rol "${rolActual}" por "${nuevoRolNombre}"?`
            );

            if (confirmacion) {
                this.actualizarRolAsignado();
            }
        },

        async actualizarRolAsignado() {
            if (!this.rolAsignadoSeleccionado || !this.nuevoRol) {
                this.mensajeError = "⚠️ Debes seleccionar un rol asignado y un nuevo rol.";
                return;
            }

            try {
                await axios.put(
                    `http://localhost:3001/api/usuariorol/${this.rolAsignadoSeleccionado}`,
                    { idRol: this.nuevoRol },
                    { withCredentials: true }
                );
                this.mensajeExito = "✅ Rol asignado actualizado correctamente.";
                this.mensajeError = "";
                this.cargarDatos(); // 🔄 Refrescar lista
            } catch (error) {
                console.error("❌ Error al actualizar rol asignado:", error);
                this.mensajeError = "⚠️ No se pudo actualizar el rol. Intenta de nuevo.";
                this.mensajeExito = "";
            }
        }
    },
    mounted() {
        this.cargarDatos();
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
