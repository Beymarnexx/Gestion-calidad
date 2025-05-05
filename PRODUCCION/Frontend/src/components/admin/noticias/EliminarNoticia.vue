<template>
    <div class="contenedor">
      <div class="eliminar-card">
        <h1>🗑 Eliminar Noticia</h1>
        <p class="alerta">⚠️ Esta acción es irreversible. ¿Estás seguro de eliminar la noticia seleccionada?</p>
  
        <div class="campo">
          <label>Seleccione una Noticia:</label>
          <select v-model="noticiaSeleccionada">
            <option disabled value="">Seleccione una noticia...</option>
            <option v-for="noticia in noticias" :key="noticia.idNoticia" :value="noticia.idNoticia">
              {{ noticia.titulo }}
            </option>
          </select>
        </div>
  
        <button @click="eliminarNoticia" class="boton-eliminar" :disabled="!noticiaSeleccionada">
          🗑 Eliminar
        </button>
  
        <p v-if="mensaje" :class="['mensaje', mensajeTipo]">{{ mensaje }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        noticias: [
          { idNoticia: 1, titulo: "Evento de bienvenida" },
          { idNoticia: 2, titulo: "Nuevas becas disponibles" },
        ],
        noticiaSeleccionada: "",
        mensaje: "",
        mensajeTipo: "",
      };
    },
    methods: {
      eliminarNoticia() {
        if (!this.noticiaSeleccionada) {
          this.mostrarMensaje("⚠️ Debes seleccionar una noticia.", "error");
          return;
        }
  
        console.log("🗑 Noticia eliminada:", this.noticiaSeleccionada);
        this.mostrarMensaje("✅ Noticia eliminada exitosamente.", "exito");
  
        // 🔥 Simulación de eliminación en la lista local
        this.noticias = this.noticias.filter(n => n.idNoticia !== this.noticiaSeleccionada);
        this.noticiaSeleccionada = "";
      },
  
      mostrarMensaje(mensaje, tipo) {
        this.mensaje = mensaje;
        this.mensajeTipo = tipo;
        setTimeout(() => (this.mensaje = ""), 3000);
      }
    }
  };
  </script>
  
  <style scoped>
  /* 🔹 Estilos del contenedor */
  .contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url('../../assets/fondo.jpg') no-repeat center center/cover;
    padding: 20px;
  }
  
  /* 🔹 Card estilizado */
  .eliminar-card {
    background: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 100%;
    text-align: center;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  /* 🔹 Animación */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 🔹 Alerta de advertencia */
  .alerta {
    font-size: 1rem;
    color: #c0392b;
    font-weight: bold;
  }
  
  /* 🔹 Campos de selección */
  .campo {
    margin: 15px 0;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #2c3e50;
  }
  
  select {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #bdc3c7;
    font-size: 1rem;
  }
  
  /* 🔹 Botón de eliminar */
  .boton-eliminar {
    background: #c0392b;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    transition: background 0.3s ease-in-out;
  }
  
  .boton-eliminar:hover {
    background: #a93226;
  }
  
  .boton-eliminar:disabled {
    background: #7f8c8d;
    cursor: not-allowed;
  }
  
  /* 🔹 Mensajes de éxito/error */
  .mensaje {
    margin-top: 15px;
    font-weight: bold;
  }
  
  .exito {
    color: #27ae60;
  }
  
  .error {
    color: #e74c3c;
  }
  </style>
  