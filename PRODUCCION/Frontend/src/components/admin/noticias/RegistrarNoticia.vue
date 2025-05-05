<template>
    <div class="contenedor">
      <div class="form-card">
        <h1>📝 Añadir Nueva Noticia</h1>
        <form @submit.prevent="enviarNoticia">
          <div class="campo">
            <label>Título:</label>
            <input type="text" v-model="noticia.titulo" placeholder="Ingrese el título de la noticia" required />
          </div>
  
          <div class="campo">
            <label>Contenido:</label>
            <textarea v-model="noticia.contenido" placeholder="Escriba el contenido aquí..." required></textarea>
          </div>
  
          <div class="campo">
            <label>Categoría:</label>
            <select v-model="noticia.categoria" required>
              <option disabled value="">Seleccione una categoría</option>
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
            <label>Imagen:</label>
            <input type="file" @change="procesarImagen" accept="image/*" />
          </div>
  
          <button type="submit">📤 Publicar Noticia</button>
  
          <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
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
      enviarNoticia() {
        console.log("📢 Nueva Noticia Publicada:", this.noticia);
        this.mensaje = "✅ Noticia publicada exitosamente.";
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
  