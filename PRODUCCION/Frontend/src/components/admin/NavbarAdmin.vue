<template>
  <nav :class="['admin-navbar', { 'navbar-oculto': navbarOculto }]">
    <!-- Botón para ocultar/mostrar la barra -->
    <button class="toggle-navbar" @click="alternarNavbar">
      {{ navbarOculto ? '➡️' : '⬅️' }}
    </button>

    <div v-if="!navbarOculto">
      <!-- Logo y mensaje de bienvenida -->
      <div class="navbar-logo">
        <img src="/UAC Pucarani 1.1.png" alt="Logo UAC Pucarani" class="logo-image" />
      </div>
      <h2 class="mensaje-bienvenida">
        Bienvenido, {{ authStore.user || "Usuario" }}
      </h2>

      <!-- Lista de navegación -->
      <ul class="navbar-lista" style="max-height: calc(100vh - 250px); overflow-y: auto;">
        <!-- Inicio -->
        <li class="navbar-item">
          <router-link to="/admin" class="navbar-enlace">🏠 Inicio</router-link>
        </li>

        <li class="navbar-item">
          <router-link to="/admin/cambio/contra" class="navbar-enlace">🗝️ Cambiar contraseña</router-link>
        </li>


        <!-- Modulo de seguridad -->
        <li class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="alternarMenuSeguridad">
            🔐 Seguridad
            <span :class="['flecha',{ 'flecha-arriba': seguridadAbierto, 'flecha-abajo': !seguridadAbierto}]"></span>
          </a>
          <ul v-show="seguridadAbierto" class="sub-menu">
            <li>
              <router-Link to="/admin/seguridad/codigoc" class="navbar-enlace"> 📝 Codigo Cesar</router-Link>
            </li>
            <li>
              <router-Link to="/admin/seguridad/clasificacion" class="navbar-enlace"> 📝 Clasificación de información</router-Link>
            </li>
          </ul>         
        </li>
        

        <!-- Gestión de Personas -->
        <li v-if="tieneAccesoModulo('Personas')" class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="alternarMenuPersonas">
            🏷️ Gestión de Personas
            <span :class="['flecha', { 'flecha-arriba': personasAbierto, 'flecha-abajo': !personasAbierto }]"></span>
          </a>
          <ul v-show="personasAbierto" class="sub-menu">
            <li v-if="tienePermiso('Personas', 'crear')">
              <router-link to="/admin/persona/registrar" class="navbar-enlace">📝 Registrar Persona</router-link>
            </li>
            <li v-if="tienePermiso('Personas', 'leer')">
              <router-link to="/admin/persona/visualizar" class="navbar-enlace">👀 Ver Personas</router-link>
            </li>
            <li v-if="tienePermiso('Personas', 'actualizar')">
              <router-link to="/admin/persona/editar" class="navbar-enlace">✏️ Editar Persona</router-link>
            </li>
            <li v-if="tienePermiso('Personas', 'eliminar')">
              <router-link to="/admin/persona/eliminar" class="navbar-enlace">🗑️ Eliminar Persona</router-link>
            </li>
          </ul>
        </li>

        <!-- Gestión de Usuarios -->
        <li v-if="tieneAccesoModulo('Usuarios')" class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="alternarMenuUsuarios">
            👥 Gestión de Usuarios
            <span :class="['flecha', { 'flecha-arriba': usuariosAbierto, 'flecha-abajo': !usuariosAbierto }]"></span>
          </a>
          <ul v-show="usuariosAbierto" class="sub-menu">
            <li v-if="tienePermiso('Usuarios', 'crear')">
              <router-link to="/admin/usuario/registrar" class="navbar-enlace">📝 Registrar Usuario</router-link>
            </li>
            <li v-if="tienePermiso('Usuarios', 'leer')">
              <router-link to="/admin/usuario/visualizar" class="navbar-enlace">👀 Ver Usuarios</router-link>
            </li>
            <li v-if="tienePermiso('Usuarios', 'actualizar')">
              <router-link to="/admin/usuario/editar" class="navbar-enlace">✏️ Editar Usuario</router-link>
            </li>
            <li v-if="tienePermiso('Usuarios', 'eliminar')">
              <router-link to="/admin/usuario/eliminar" class="navbar-enlace">🗑️ Eliminar Usuario</router-link>
            </li>
          </ul>
        </li>

        <!-- Gestión de Roles -->
        <li v-if="tienePermisosEnModulo('Roles')" class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="alternarMenuRoles">
            ⚖️ Gestión de Roles
            <span :class="['flecha', { 'flecha-arriba': rolesAbierto, 'flecha-abajo': !rolesAbierto }]"></span>
          </a>
          <ul v-show="rolesAbierto" class="sub-menu">
            <li v-if="tienePermiso('Roles', 'crear')">
              <router-link to="/admin/rol/registrar" class="navbar-enlace">📝 Registrar Rol</router-link>
            </li>
            <li v-if="tienePermiso('Roles', 'leer')">
              <router-link to="/admin/rol/visualizar" class="navbar-enlace">👀 Ver Roles</router-link>
            </li>
            <li v-if="tienePermiso('Roles', 'actualizar')">
              <router-link to="/admin/rol/editar" class="navbar-enlace">✏️ Editar Rol</router-link>
            </li>
            <li v-if="tienePermiso('Roles', 'eliminar')">
              <router-link to="/admin/rol/eliminar" class="navbar-enlace">🗑️ Eliminar Rol</router-link>
            </li>
          </ul>
        </li>

        <!-- Asignación de Roles -->
        <li v-if="tieneAccesoModulo('Usuario rol')" class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="alternarMenuAsignacionRoles">
            ⚖️ Asignación de Roles
            <span :class="['flecha', { 'flecha-arriba': rolesAsignacionAbierto, 'flecha-abajo': !rolesAsignacionAbierto }]"></span>
          </a>
          <ul v-show="rolesAsignacionAbierto" class="sub-menu">
            <li v-if="tienePermiso('Usuario rol', 'crear')">
              <router-link to="/admin/asignacionrol/registrar" class="navbar-enlace">📝 Asignar Rol</router-link>
            </li>
            <li v-if="tienePermiso('Usuario rol', 'leer')">
              <router-link to="/admin/asignacionrol/visualizar" class="navbar-enlace">👀 Ver Roles Asignados</router-link>
            </li>
            <li v-if="tienePermiso('Usuario rol', 'actualizar')">
              <router-link to="/admin/asignacionrol/editar" class="navbar-enlace">✏️ Editar Rol Asignado</router-link>
            </li>
            <li v-if="tienePermiso('Usuario rol', 'eliminar')">
              <router-link to="/admin/asignacionrol/eliminar" class="navbar-enlace">🗑️ Eliminar Rol Asignado</router-link>
            </li>
          </ul>
        </li>

        <!-- Gestión de Permisos -->
        <li v-if="tieneAccesoModulo('Permisos')" class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="alternarMenuPermisos">
            🔐 Administración de Permisos
            <span :class="['flecha', { 'flecha-arriba': permisosAbierto, 'flecha-abajo': !permisosAbierto }]"></span>
          </a>
          <ul v-show="permisosAbierto" class="sub-menu">
            <li v-if="tienePermiso('Permisos', 'crear')">
              <router-link to="/admin/permiso/registrar" class="navbar-enlace">📝 Asignar Permiso</router-link>
            </li>
            <li v-if="tienePermiso('Permisos', 'leer')">
              <router-link to="/admin/permiso/visualizar" class="navbar-enlace">👀 Ver Permisos</router-link>
            </li>
            <li v-if="tienePermiso('Permisos', 'actualizar')">
              <router-link to="/admin/permiso/editar" class="navbar-enlace">✏️ Editar Permisos</router-link>
            </li>
            <li v-if="tienePermiso('Permisos', 'eliminar')">
              <router-link to="/admin/permiso/eliminar" class="navbar-enlace">🗑️ Eliminar Permiso</router-link>
            </li>
          </ul>
        </li>

        <!-- Gestión de Noticias -->
        <li v-if="tieneAccesoModulo('Noticias')" class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="alternarMenuNoticias">
            📰 Gestión de Noticias
            <span :class="['flecha', { 'flecha-arriba': noticiasAbiertas, 'flecha-abajo': !noticiasAbiertas }]"></span>
          </a>
          <ul v-show="noticiasAbiertas" class="sub-menu">
            <li v-if="tienePermiso('Noticias', 'crear')">
              <router-link to="/admin/noticia/registrar" class="navbar-enlace">➕ Añadir Noticia</router-link>
            </li>
            <li v-if="tienePermiso('Noticias', 'actualizar')">
              <router-link to="/admin/noticia/editar" class="navbar-enlace">✏️ Editar Noticia</router-link>
            </li>
            <li v-if="tienePermiso('Noticias', 'leer')">
              <router-link to="/admin/noticia/visualizar" class="navbar-enlace">📝 Ver Noticia</router-link>
            </li>
            <li v-if="tienePermiso('Noticias', 'eliminar')">
              <router-link to="/admin/noticia/eliminar" class="navbar-enlace">🗑️ Eliminar Noticia</router-link>
            </li>
            
          </ul>
        </li>


        <!-- Gestión de Biblioteca -->
        <li v-if="tieneAccesoModulo('Biblioteca')" class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="alternarMenuBiblitoeca">
            📚 Gestión de Biblioteca
            <span :class="['flecha', { 'flecha-arriba': bibliotecaAbierta, 'flecha-abajo': !bibliotecaAbierta }]"></span>
          </a>
          <ul v-show="bibliotecaAbierta" class="sub-menu">
            <li v-if="tienePermiso('Biblioteca', 'crear')">
              <router-link to="/admin/biblioteca/registrar" class="navbar-enlace">➕ Añadir Libro</router-link>
            </li>
            <li v-if="tienePermiso('Biblioteca', 'actualizar')">
              <router-link to="/admin/biblioteca/editar" class="navbar-enlace">✏️ Editar Libro</router-link>
            </li>
            <li v-if="tienePermiso('Biblioteca', 'leer')">
              <router-link to="/admin/biblioteca/visualizar" class="navbar-enlace">📝 Ver Libro</router-link>
            </li>
            <li v-if="tienePermiso('Biblioteca', 'eliminar')">
              <router-link to="/admin/biblioteca/eliminar" class="navbar-enlace">🗑️ Eliminar Libro</router-link>
            </li>
            
          </ul>
        </li>

        <!-- Vista previa y cerrar sesión -->
        <li class="navbar-item">
          <router-link to="/" class="navbar-enlace">👀 Vista sitio</router-link>
        </li>
        <li class="navbar-item">
          <a href="#" class="navbar-enlace" @click.prevent="cerrarSesion">🔒 Cerrar sesión</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { ref, nextTick, onMounted } from "vue";
import { RouterLink } from "vue-router";

export default {
  name: "NavbarAdmin",
  setup() {
    const authStore = useAuthStore();
    const navbarOculto = ref(false);
    const seguridadAbierto = ref(false);
    const usuariosAbierto = ref(false);
    const rolesAbierto = ref(false);
    const personasAbierto = ref(false);
    const rolesAsignacionAbierto = ref(false);
    const permisosAbierto = ref(false);
    const noticiasAbiertas = ref(false);
    const bibliotecaAbierta = ref(false);

    // Depuración para verificar permisos cargados correctamente
    onMounted(() => {
      console.log("Permisos cargados en authStore:", authStore.permisos);
    });

    const alternarNavbar = () => {
      navbarOculto.value = !navbarOculto.value;
    };

    const alternarMenuSeguridad = async () => {
      seguridadAbierto.value = !seguridadAbierto.value;
      await nextTick();
    };

    const alternarMenuUsuarios = async () => {
      usuariosAbierto.value = !usuariosAbierto.value;
      await nextTick(); // Forzar actualización en Vue
    };

    const alternarMenuRoles = async () => {
      rolesAbierto.value = !rolesAbierto.value;
      await nextTick();
    };

    const alternarMenuPersonas = async () => {
      personasAbierto.value = !personasAbierto.value;
      await nextTick();
    };

    const alternarMenuAsignacionRoles = async () => {
      rolesAsignacionAbierto.value = !rolesAsignacionAbierto.value;
      await nextTick();
    };

    const alternarMenuPermisos = async () => {
      permisosAbierto.value = !permisosAbierto.value;
      await nextTick();
    };

    const alternarMenuNoticias = async () => {
      noticiasAbiertas.value = !noticiasAbiertas.value;
      await nextTick();
    };

    const alternarMenuBiblitoeca = async () => {
      bibliotecaAbierta.value = !bibliotecaAbierta.value;
      await nextTick();
    };

    const cerrarSesion = async () => {
      try {
        await authStore.logout();
        console.log("✅ Sesión cerrada exitosamente.");

        // Redirigir a la página principal después de cerrar sesión
        window.location.href = "/";
      } catch (error) {
        console.error("❌ Error al cerrar sesión:", error);
      }
    };

    const tienePermiso = (modulo, accion) => {
      console.log(`Verificando permiso: ${modulo} - ${accion}`);
      return authStore.tienePermiso(modulo, accion);
    };

    const tieneAccesoModulo = (modulo) => {
      console.log(`Verificando acceso al módulo: ${modulo}`);
      return authStore.permisos.some((p) => p.modulo === modulo);
    };

    const tienePermisosEnModulo = (modulo) => {
      console.log(`Verificando si hay permisos en el módulo: ${modulo}`);
      return authStore.permisos.some((p) => p.modulo === modulo && Object.values(p.permisos).some(Boolean));
    };

    return {
      authStore,
      navbarOculto,
      seguridadAbierto,
      usuariosAbierto,
      rolesAbierto,
      personasAbierto,
      rolesAsignacionAbierto,
      permisosAbierto,
      noticiasAbiertas,
      bibliotecaAbierta,
      alternarNavbar,
      alternarMenuUsuarios,
      alternarMenuRoles,
      alternarMenuPersonas,
      alternarMenuSeguridad,
      alternarMenuAsignacionRoles,
      alternarMenuPermisos,
      alternarMenuNoticias,
      alternarMenuBiblitoeca,
      cerrarSesion,
      tienePermiso,
      tieneAccesoModulo,
      tienePermisosEnModulo,
    };
  },
};
</script>



<style scoped>
@import "@/assets/adminStyles.css";

/* Estilo general */
.admin-navbar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 290px;
  background: #002f5b;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: all 0.3s ease;
}

.navbar-oculto {
  width: 60px;
  background: #002f5b;
  overflow: hidden;
}

.toggle-navbar {
  background: #ffcc00;
  border: none;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-bottom: 10px;
}

.navbar-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.logo-image {
  max-width: 150px;
}

.mensaje-bienvenida {
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #f3f4f6;
  text-align: center;
}

.navbar-lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-item {
  margin: 10px 0;
}

.navbar-enlace {
  display: block;
  padding: 10px;
  font-size: 1em;
  color: #f3f4f6;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;
  padding-left: 15px;
}

.navbar-enlace:hover {
  background-color: #ffcc00;
  color: #002f5b;
}

.sub-menu {
  list-style: none;
  padding-left: 15px;
  margin: 0;
}

.flecha {
  display: inline-block;
  margin-left: 10px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
  transition: transform 0.3s ease;
}

.flecha-abajo {
  transform: rotate(0deg);
}

.flecha-arriba {
  transform: rotate(180deg);
}

/* Habilitar scroll en la lista del navbar */
.navbar-lista {
  max-height: calc(100vh - 250px); /* Limita la altura */
  overflow-y: auto; /* Activa desplazamiento */
  scrollbar-width: thin; /* Barra de desplazamiento delgada (Firefox) */
  scrollbar-color: #ffcc00 transparent; /* Color para Firefox */
}

/* Estilo para scrollbar en Chrome, Edge y Safari */
.navbar-lista::-webkit-scrollbar {
  width: 6px; /* Ancho de la barra */
}

.navbar-lista::-webkit-scrollbar-thumb {
  background-color: #ffcc00; /* Color de la barra */
  border-radius: 3px; /* Bordes redondeados */
}

.navbar-lista::-webkit-scrollbar-thumb:hover {
  background-color: #ffc700; /* Cambio de color al pasar el mouse */
}
</style>
