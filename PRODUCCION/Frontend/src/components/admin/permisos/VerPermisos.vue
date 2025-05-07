<template>
    <div class="admin-dashboard">
      <h1 class="welcome-message">🔐 Lista de Permisos</h1>
  
      <div class="admin-info">
        <!-- Selección de Usuario -->
        <h2>👤 Seleccionar Usuario</h2>
        <div class="form-group">
          <select v-model="usuarioSeleccionado" @change="aplicarFiltro">
            <option disabled value="">Seleccione un usuario...</option>
            <option v-for="usuario in usuarios" :key="usuario.idUsuario" :value="usuario.Nombre_usuario">
              {{ usuario.Nombre_usuario }}
            </option>
          </select>
        </div>
  
ar ? '✅' : '❌' }}</td>
              <td>{{ permiso.Eliminar ? '✅' : '❌' }}</td>
              <td>{{ permiso.Reportes ? '✅' : '❌' }}</td>
            </tr>
            <tr v-if="permisosFiltrados.length === 0">
              <td colspan="8" class="no-data">❌ No hay permisos asignados para este usuario y módulo.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        usuarios: [],
        modulos: [],
        permisosTodos: [],
        usuarioRoles: [],
        usuarioSeleccionado: "",
        moduloSeleccionado: "",
        permisosFiltrados: [],
      };
    },
    methods: {
      // Cargar todos los datos necesarios
      async cargarDatos() {
        try {
          const [usuariosResponse, modulosResponse, permisosResponse, usuarioRolResponse] = await Promise.all([
            axios.get("http://localhost:3001/api/usuario/all", { withCredentials: true }),
            axios.get("http://localhost:3001/api/modulo/all", { withCredentials: true }),
            axios.get("http://localhost:3001/api/permiso/all", { withCredentials: true }),
            axios.get("http://localhost:3001/api/usuariorol/all", { withCredentials: true })
          ]);
  
          this.usuarios = usuariosResponse.data;
          this.modulos = modulosResponse.data;
          this.permisosTodos = permisosResponse.data;
          this.usuarioRoles = usuarioRolResponse.data;
  
          this.permisosFiltrados = this.permisosTodos; // Mostrar todos los permisos al inicio
  
          console.log("✅ Datos cargados correctamente");
        } catch (error) {
          console.error("❌ Error cargando datos:", error);
        }
      },
  
      // Obtener el nombre del módulo basado en su ID
      obtenerNombreModulo(idModulo) {
        const modulo = this.modulos.find((m) => m.idModulo === idModulo);
        return modulo ? modulo.Nombre : "Desconocido";
      },
  
      // Obtener el nombre de usuario a partir del idUsuarioRol
      obtenerNombreUsuario(idUsuarioRol) {
        const usuarioRol = this.usuarioRoles.find((ur) => ur.idUsuarioRol === idUsuarioRol);
        if (!usuarioRol) return "Desconocido";
  
        const usuario = this.usuarios.find((u) => u.idUsuario === usuarioRol.idUsuario);
        return usuario ? usuario.Nombre_usuario : "Desconocido";
      },
  
      // Aplicar filtro cuando se selecciona usuario y/o módulo
      aplicarFiltro() {
        this.permisosFiltrados = this.permisosTodos.filter((permiso) => {
          const usuarioNombre = this.obtenerNombreUsuario(permiso.idUsuarioRol);
          const usuarioCoincide = !this.usuarioSeleccionado || usuarioNombre === this.usuarioSeleccionado;
          const moduloCoincide = !this.moduloSeleccionado || this.obtenerNombreModulo(permiso.idModulo) === this.moduloSeleccionado;
          return usuarioCoincide && moduloCoincide;
        });
      }
    },
    mounted() {
      this.cargarDatos();
    }
  };
  </script>
  
  <style scoped>
  @import "@/assets/adminStyles.css";
  
  .permissions-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .permissions-table th,
  .permissions-table td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }
  
  .permissions-table th {
    background: #002f5b;
    color: white;
  }
  
  .no-data {
    text-align: center;
    color: gray;
    font-size: 1.2em;
    margin-top: 20px;
  }
  </style>
  
