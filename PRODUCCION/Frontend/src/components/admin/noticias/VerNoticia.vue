<template>
    <div class="contenedor">
      <div class="noticias-card">
        <h1>📰 Noticias Recientes</h1>
        <ul>
          <li v-for="noticia in noticias" :key="noticia.idNoticia" class="noticia">
            <div class="noticia-content">
              <h3>{{ noticia.titulo }}</h3>
              <p>{{ noticia.contenido }}</p>
              <small>📅 {{ noticia.fecha_publicacion }} - ✍️ {{ noticia.autor }}</small>
            </div>
            <img v-if="noticia.imagen" :src="noticia.imagen" alt="Imagen de la noticia" class="noticia-imagen"/>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        noticias: [
          {
            idNoticia: 1,
            titulo: "Evento de Bienvenida",
            contenido: "Te invitamos al evento de bienvenida para los nuevos estudiantes.",
            fecha_publicacion: "2024-02-01",
            autor: "Dirección Académica",
            imagen: "/img/evento.jpg",
          },
          {
            idNoticia: 2,
            titulo: "Becas Disponibles",
            contenido: "Consulta los requisitos para acceder a las nuevas becas.",
            fecha_publicacion: "2024-02-02",
            autor: "Administración",
            imagen: "/img/becas.jpg",
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* Contenedor principal */
  .contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url('../../assets/fondo.jpg') no-repeat center center/cover;
    padding: 20px;
  }
  
  /* Tarjeta principal */
  .noticias-card {
    background: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 600px;
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
  
  /* Encabezado */
  h1 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  /* Lista de noticias */
  ul {
    list-style: none;
    padding: 0;
  }
  
  /* Cada noticia */
  .noticia {
    display: flex;
    flex-direction: column;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
    text-align: left;
    transition: transform 0.3s ease-in-out;
  }
  
  .noticia:hover {
    transform: scale(1.02);
  }
  
  /* Contenido de la noticia */
  .noticia-content {
    margin-bottom: 10px;
  }
  
  .noticia h3 {
    font-size: 1.4rem;
    color: #34495e;
    margin-bottom: 5px;
  }
  
  .noticia p {
    font-size: 1rem;
    color: #2c3e50;
  }
  
  .noticia small {
    font-size: 0.9rem;
    color: #7f8c8d;
  }
  
  /* Imagen */
  .noticia-imagen {
    width: 100%;
    height: auto;
    border-radius: 6px;
    margin-top: 10px;
  }
  </style>
  