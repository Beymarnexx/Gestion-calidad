<template>
    <div class="contenedor-principal">
        <div class="contenedor-inicio-sesion">
            <img src="/UAC Pucarani 1.2 OFICIAL 1.png" alt="Logo" class="logo" />
            <form @submit.prevent="cambiarContrasenia">
                <legend>🔑 Cambiar Contraseña</legend>

                <!-- ✅ Mensajes de notificación (ÉXITO o ERROR) -->
                <div v-if="mensaje" :class="['notificacion', mensajeTipo]">
                    {{ mensaje }}
                </div>

                <!-- Contraseña Actual -->
                <div class="campo">
                    <label>Contraseña Actual</label>
                    <div class="campo-contrasena">
                        <input 
                            :type="mostrarActual ? 'text' : 'password'" 
                            v-model="contrasenaActual"
                            placeholder="Tu Contraseña Actual"
                            required
                        />
                        <button type="button" @click="mostrarActual = !mostrarActual" class="btn-ojo">
                            <span v-if="mostrarActual">👁️</span>
                            <span v-else>🔒</span>
                        </button>
                    </div>
                </div>

                <!-- Nueva Contraseña -->
                <div class="campo">
                    <label>Nueva Contraseña</label>
                    <div class="campo-contrasena">
                        <input 
                            :type="mostrarNueva ? 'text' : 'password'" 
                            v-model="nuevaContrasenia"
                            placeholder="Nueva Contraseña"
                            required
                            @input="validarFortaleza"
                        />
                        <button type="button" @click="mostrarNueva = !mostrarNueva" class="btn-ojo">
                            <span v-if="mostrarNueva">👁️</span>
                            <span v-else>🔒</span>
                        </button>
                    </div>
                    <small class="indicador-fortaleza" :class="fortalezaClase">{{ fortalezaTexto }}</small>
                </div>

                <!-- Confirmar Nueva Contraseña -->
                <div class="campo">
                    <label>Confirmar Nueva Contraseña</label>
                    <div class="campo-contrasena">
                        <input 
                            :type="mostrarRepetir ? 'text' : 'password'" 
                            v-model="repetirContrasenia"
                            placeholder="Repite la Nueva Contraseña"
                            required
                        />
                        <button type="button" @click="mostrarRepetir = !mostrarRepetir" class="btn-ojo">
                            <span v-if="mostrarRepetir">👁️</span>
                            <span v-else>🔒</span>
                        </button>
                    </div>
                </div>

                <!-- ✅ Requisitos de la contraseña -->
                <ul class="requisitos">
                    <li :class="{ cumplido: nuevaContrasenia.length >= 12 }">✅ Mínimo 12 caracteres</li>
                    <li :class="{ cumplido: /[A-Z]/.test(nuevaContrasenia) }">✅ Al menos una mayúscula</li>
                    <li :class="{ cumplido: /[a-z]/.test(nuevaContrasenia) }">✅ Al menos una minúscula</li>
                    <li :class="{ cumplido: /\d/.test(nuevaContrasenia) }">✅ Al menos un número</li>
                    <li :class="{ cumplido: /[@$!%*?&]/.test(nuevaContrasenia) }">✅ Al menos un carácter especial</li>
                </ul>

                <!-- 🚨 Mensajes de error específicos -->
                <div v-if="errorMensaje" class="mensaje-error">
                    ❌ {{ errorMensaje }}
                </div>

                <div class="campo-boton">
                    <button type="submit" :disabled="!cumpleRequisitos || nuevaContrasenia !== repetirContrasenia">
                        Cambiar Contraseña
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { ref, computed, watch } from 'vue';

export default {
    setup() {
        const authStore = useAuthStore();
        const idUsuario = authStore.user.id;

        const contrasenaActual = ref('');
        const nuevaContrasenia = ref('');
        const repetirContrasenia = ref('');
        const mostrarActual = ref(false);
        const mostrarNueva = ref(false);
        const mostrarRepetir = ref(false);
        const mensaje = ref('');
        const mensajeTipo = ref('');
        const fortalezaTexto = ref('');
        const fortalezaClase = ref('');
        const errorMensaje = ref('');

        const validarFortaleza = () => {
            const pass = nuevaContrasenia.value;
            let score = 0;

            if (pass.length >= 12) score++;
            if (/[A-Z]/.test(pass)) score++;
            if (/[a-z]/.test(pass)) score++;
            if (/\d/.test(pass)) score++;
            if (/[@$!%*?&]/.test(pass)) score++;

            if (score === 5) {
                fortalezaTexto.value = "🔒 Muy Segura";
                fortalezaClase.value = "muy-segura";
            } else if (score >= 3) {
                fortalezaTexto.value = "🟡 Segura";
                fortalezaClase.value = "segura";
            } else {
                fortalezaTexto.value = "⚠️ Débil";
                fortalezaClase.value = "debil";
            }
        };

        const cumpleRequisitos = computed(() => {
            const pass = nuevaContrasenia.value;
            return (
                pass.length >= 12 &&
                /[A-Z]/.test(pass) &&
                /[a-z]/.test(pass) &&
                /\d/.test(pass) &&
                /[@$!%*?&]/.test(pass)
            );
        });

        const cambiarContrasenia = async () => {
            if (!cumpleRequisitos.value || nuevaContrasenia.value !== repetirContrasenia.value) {
                errorMensaje.value = '⚠️ La nueva contraseña no cumple los requisitos o no coincide';
                return;
            }

            try {
                const response = await axios.put(`http://localhost:3001/api/usuario/${idUsuario}/password`, {
                    contrasenaActual: contrasenaActual.value,
                    nuevaContrasenia: nuevaContrasenia.value,
                }, {
                    withCredentials: true,
                });

                mensaje.value = '✅ ' + response.data.message;
                mensajeTipo.value = 'exito';
                errorMensaje.value = '';

                contrasenaActual.value = '';
                nuevaContrasenia.value = '';
                repetirContrasenia.value = '';
                fortalezaTexto.value = '';
                fortalezaClase.value = '';
            } catch (error) {
                const errorResponse = error.response?.data?.error || '❌ Error al cambiar la contraseña';
                
                // 📌 Capturamos el mensaje exacto del backend y lo mostramos correctamente
                if (errorResponse.includes("No puedes usar una de tus últimas 2 contraseñas")) {
                    errorMensaje.value = '⚠️ No puedes reutilizar tus últimas dos contraseñas.';
                } else if (errorResponse.includes("La contraseña actual es incorrecta")) {
                    errorMensaje.value = '⚠️ La contraseña actual ingresada es incorrecta.';
                } else if (errorResponse.includes("Usuario no encontrado")) {
                    errorMensaje.value = '⚠️ Error: Usuario no encontrado.';
                } else {
                    errorMensaje.value = errorResponse;
                }
            }
        };

        // 🔍 Monitorear cambios en `errorMensaje` para asegurar que se actualice en la interfaz
        watch(errorMensaje, (nuevoValor) => {
            if (nuevoValor) console.error(nuevoValor);
        });

        return {
            contrasenaActual,
            nuevaContrasenia,
            repetirContrasenia,
            mostrarActual,
            mostrarNueva,
            mostrarRepetir,
            mensaje,
            mensajeTipo,
            fortalezaTexto,
            fortalezaClase,
            errorMensaje,
            validarFortaleza,
            cambiarContrasenia,
            cumpleRequisitos
        };
    }
};
</script>



<style scoped>
/* 🔹 Notificaciones de éxito y error */
.notificacion {
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    text-align: center;
}
.exito {
    background-color: #d4edda;
    color: #155724;
}
.error {
    background-color: #f8d7da;
    color: #721c24;
}

/* 🔹 Contenedor principal */
.contenedor-principal {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: #001f3f;
    padding-right: 5rem;
}

/* 🔹 Estilos del contenedor del formulario */
.contenedor-inicio-sesion {
    background-color: #00274a;
    color: white;
    padding: 30px;
    border-radius: 10px;
    width: 100%;
    max-width: 400px;
    animation: aparecer 1s ease-in-out;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
    margin: auto;
    text-align: center;
}

/* 🔹 Estilos del logo */
.logo {
    max-width: 100%;
    height: auto;
    margin-bottom: 20px;
}

/* 🔹 Campos de entrada */
.campo {
    margin-top: 20px;
}
.campo input {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-top: 10px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}
.campo input:focus {
    outline: 2px solid #f7c600;
    transform: scale(1.02);
}

/* 🔹 Botón de mostrar contraseña */
.campo-contrasena {
    position: relative;
}
.btn-ojo {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
}

/* 🔹 Botón de envío */
.campo-boton {
    margin-top: 20px;
}
.campo-boton button {
    background-color: #f7c600;
    color: #00274a;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s ease, transform 0.3s ease;
}
.campo-boton button:hover {
    background-color: #d1a700;
    transform: scale(1.05);
}

/* 🔹 Animación de entrada */
@keyframes aparecer {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Indicador de seguridad */
.indicador-fortaleza {
    display: block;
    font-size: 14px;
    margin-top: 5px;
}
.debil {
    color: red;
}
.segura {
    color: orange;
}
.muy-segura {
    color: green;
}

/* Lista de requisitos de contraseña */
.requisitos {
    margin-top: 15px;
    font-size: 14px;
    color: #bbb;
    list-style: none;
    padding: 0;
}
.requisitos li {
    margin-bottom: 5px;
}
.requisitos .cumplido {
    color: #f7c600;
}

/* Otras mejoras de estilo */
.campo-contrasena {
    position: relative;
}
.btn-ojo {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
}

.campo-boton button {
    background-color: #f7c600;
    color: #00274a;
    font-size: 18px;
    padding: 12px 20px;
    border-radius: 5px;
}

.notificacion {
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin-bottom: 15px;
}

.mensaje-error {
    color: red;
    font-weight: bold;
    margin-top: 10px;
}

.campo {
    margin-top: 20px;
}

.campo-contrasena {
    position: relative;
}

.campo-contrasena input {
    width: 100%;
    padding-right: 40px;
}

.btn-ojo {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    cursor: pointer;
    font-size: 18px;
}

.requisitos li {
    color: gray;
}

.requisitos .cumplido {
    color: green;
}

.campo-boton button:disabled {
    background-color: gray;
    cursor: not-allowed;
}
</style>
