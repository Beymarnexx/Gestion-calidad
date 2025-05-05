<template>
    <div class="contenedor">
      <div class="form-card">
        <h1>✏️ Editar Noticia</h1>
        <form @submit.prevent="actualizarNoticia">
          <div class="campo">
            <label>Seleccionar Noticia:</label>
            <select v-model="noticiaSeleccionada" @change="cargarDatosNoticia">
              <option disabled value="">Seleccione una noticia...</option>
              <option v-for="noticia in noticias" :key="noticia.idNoticia" :value="noticia.idNoticia">
                {{ noticia.titulo }}
              </option>
            </select>
          </div>
  
          <div v-if="noticia.titulo">
            <div class="campo">
              <label>Título:</label>
              <input type="text" v-model="noticia.titulo" required />
            </div>
  
            <div class="campo">
              <label>Contenido:</label>
              <textarea v-model="noticia.contenido" required></textarea>
            </div>
  
            <div class="campo">
              <label>Categoría:</label>
              <select v-model="noticia.categoria" required>
                <option>Eventos</option>
                <option>Académico</option>
                <option>Deportes</option>
                <option>Comunicados</option>
              </select>
            </div>
  
            <div class="campo">
              <label>Fecha de Publicación:</label>
              <input type="date" v-model="noticia.fecha_publicacion" required />
            </div>
  
            <div class="campo">
              <label>Actualizar Imagen:</label>
              <input type="file" @change="procesarImagen" accept="image/*" />
            </div>
  
            <button type="submit">💾 Guardar Cambios</button>
  
            <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        noticias: [
          { idNoticia: 1, titulo: "Evento de Bienvenida", contenido: "Detalles del evento...", categoria: "Eventos", fecha_publicacion: "2024-02-01" },
          { idNoticia: 2, titulo: "Nuevas Becas", contenido: "Requisitos y plazos...", categoria: "Académico", fecha_publicacion: "2024-02-02" },
        ],
        noticiaSeleccionada: "",
        noticia: {
          titulo: "",
          contenido: "",
          categoria: "",
          fecha_publicacion: "",
          imagen: null,
        },
        mensaje: "",
      };
    },
    methods: {
      procesarImagen(event) {
        this.noticia.imagen = event.target.files[0];
      },
      cargarDatosNoticia() {
        const noticiaEncontrada = this.noticias.find(n => n.idNoticia === this.noticiaSeleccionada);
        if (noticiaEncontrada) {
          this.noticia = { ...noticiaEncontrada };
        }
      },
      actualizarNoticia() {
        console.log("✏️ Noticia actualizada:", this.noticia);
        this.mensaje = "✅ Noticia actualizada exitosamente.";
        setTimeout(() => (this.mensaje = ""), 3000);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Contenedor principal centrado */
  .contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url('../../assets/fondo.jpg') no-repeat center center/cover;
    padding: 20px;
  }
  
  /* Tarjeta de formulario */
  .form-card {
    background: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 100%;
    text-align: center;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  /* Animación de entrada */
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
  
  /* Títulos */
  h1 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  /* Campos del formulario */
  .campo {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .campo label {
    display: block;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 5px;
  }
  
  input,
  textarea,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #bdc3c7;
    border-radius: 6px;
    font-size: 1rem;
    transition: 0.3s ease-in-out;
  }
  
  input:focus,
  textarea:focus,
  select:focus {
    border-color: #2980b9;
    outline: none;
  }
  
  /* Botón */
  button {
    width: 100%;
    padding: 12px;
    background: #3498db;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;
  }
  
  button:hover {
    background: #2980b9;
  }
  
  /* Mensaje de confirmación */
  .mensaje {
    margin-top: 15px;
    font-size: 1rem;
    font-weight: bold;
    color: #27ae60;
  }
  </style>
  