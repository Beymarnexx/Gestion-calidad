import LayoutAdmin from '@/components/admin/LayoutAdmin.vue';
import InicioAdmin from '@/components/admin/Inicio.vue';
import NoticiasAdmin from '@/components/noticias/NoticiasAdmin.vue';
import EdicionNoticias from '@/components/noticias/EdicionNoticias.vue';
import AniadirRecurso from '@/components/biblioteca/AniadirRecurso.vue';
import ListaRecursos from '@/components/biblioteca/ListaRecursos.vue';

// Importar Personas
import RegistrarPersona from '@/components/admin/personas/RegistrarPersona.vue';
import VerPersonas from '../components/admin/personas/VerPersonas.vue';
import EditarPersona from '@/components/admin/personas/EditarPersona.vue';
import EliminarPersona from '@/components/admin/personas/EliminarPersona.vue';
// Importar Usuarios
import VerUsuario from '@/components/admin/usuarios/VerUsuario.vue';
import EditarUsuario from '@/components/admin/usuarios/EditarUsuario.vue';
import EliminarUsuario from '@/components/admin/usuarios/EliminarUsuario.vue';
import RegistrarUsuario from '../components/admin/usuarios/RegistrarUsuario.vue';
// Importar Roles
import RegistrarRol from '@/components/admin/roles/RegistrarRol.vue';
import VerRoles from '../components/admin/roles/VerRoles.vue';
import EditarRol from '@/components/admin/roles/EditarRol.vue';
import EliminarRol from '@/components/admin/roles/EliminarRol.vue';
//Importar Asignacion-Roles
import AsignarRol from '@/components/admin/asignacionroles/AsignarRoles.vue';
import VerRolesAsignados from '@/components/admin/asignacionroles/VerRolesAsignados.vue';
import EditarRolesAsignados from '@/components/admin/asignacionroles/EditarRolesAsignados.vue';
import EliminarRolesAsignados from '@/components/admin/asignacionroles/EliminarRolesAsignados.vue';
// Importar Permisos
import AsignarPermisos from '@/components/admin/permisos/AsignarPermisos.vue';
import VerPermisos from '../components/admin/permisos/VerPermisos.vue';
import EditarPermiso from '@/components/admin/permisos/EditarPermiso.vue';
import EliminarPermiso from '@/components/admin/permisos/EliminarPermiso.vue';
//Importar seguridad
import codigo_cesar from '../components/admin/seguridad/codigo_cesar.vue';
import ClasificacionInfo from '../components/admin/seguridad/ClasificacionInfo.vue';
//importar cambio de contraseña
import CambiarContra from '../components/admin/CambiarContra.vue';
//importar noticias
import VerNoticia from '../components/admin/noticias/VerNoticia.vue';
import RegistrarNoticia from '../components/admin/noticias/RegistrarNoticia.vue';
import EliminarNoticia from '../components/admin/noticias/EliminarNoticia.vue';
import EditarNoticia from '../components/admin/noticias/EditarNoticia.vue';
//importar en Biblioteca
import VerLibro from '../components/admin/biblioteca/VerLibro.vue';
import EliminarLibro from '../components/admin/biblioteca/EliminarLibro.vue';
import EditarLibro from '../components/admin/biblioteca/EditarLibro.vue';
import AgregarLibro from '../components/admin/biblioteca/AgregarLibro.vue';

export default [
  {
    path: '/admin',
    component: LayoutAdmin,
    children: [
      { path: '', component: InicioAdmin },
      { path: 'noticias', component: NoticiasAdmin },
      { path: 'edicion-noticias', component: EdicionNoticias },
      { path: 'aniadir-biblio', component: AniadirRecurso },
      { path: 'edicion-biblio', component: ListaRecursos },

      // 🔥 Nuevas rutas para gestión de personas
      { path: 'persona/registrar', component: RegistrarPersona },
      { path: 'persona/visualizar', component: VerPersonas },
      { path: 'persona/editar', component: EditarPersona },
      { path: 'persona/eliminar', component: EliminarPersona },

      // 🔥 Nuevas rutas para gestión de usuarios
      { path: 'usuario/registrar', component: RegistrarUsuario },
      { path: 'usuario/visualizar', component: VerUsuario },
      { path: 'usuario/editar', component: EditarUsuario },
      { path: 'usuario/eliminar', component: EliminarUsuario },
      
      // 🔥 Nuevas rutas para gestión de roles
      { path: 'rol/registrar', component: RegistrarRol },
      { path: 'rol/visualizar', component: VerRoles },
      { path: 'rol/editar', component: EditarRol },
      { path: 'rol/eliminar', component: EliminarRol },

      // 🔥 Nuevas rutas para asignación de roles
      { path: 'asignacionrol/registrar', component: AsignarRol },
      { path: 'asignacionrol/visualizar', component: VerRolesAsignados},
      { path: 'asignacionrol/editar', component: EditarRolesAsignados },
      { path: 'asignacionrol/eliminar', component: EliminarRolesAsignados },

      // 🔥 Nuevas rutas para asignación de permisos
      { path: 'permiso/registrar', component: AsignarPermisos },
      { path: 'permiso/visualizar', component: VerPermisos},
      { path: 'permiso/editar', component: EditarPermiso },
      { path: 'permiso/eliminar', component: EliminarPermiso },


      // 🔥 Nuevas rutas para asignación de noticias
      { path: 'noticia/registrar', component: RegistrarNoticia },
      { path: 'noticia/visualizar', component: VerNoticia},
      { path: 'noticia/editar', component: EditarNoticia },
      { path: 'noticia/eliminar', component: EliminarNoticia },

      // 🔥 Nuevas rutas para asignación de bilbitoeca
      { path: 'biblioteca/registrar', component: AgregarLibro },
      { path: 'biblioteca/visualizar', component: VerLibro},
      { path: 'biblioteca/editar', component: EditarLibro },
      { path: 'biblioteca/eliminar', component: EliminarLibro },

      // 🔥 Nuevas rutas para asignación de permisos
      { path: 'seguridad/codigoc', component: codigo_cesar },
      { path: 'seguridad/clasificacion', component: ClasificacionInfo},


      //cambiar contraseña
      { path: 'cambio/contra', component: CambiarContra}

    ],
  },
];
