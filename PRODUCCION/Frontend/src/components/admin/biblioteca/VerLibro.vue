<template>
    <div class="contenedor">
      <div class="tabla-card">
        <h1>📚 Recursos Académicos Disponibles</h1>
  
        <table class="tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="recurso in recursos" :key="recurso.idRecurso">
              <td>{{ recurso.titulo }}</td>
              <td>{{ recurso.autor }}</td>
              <td>{{ recurso.tipo }}</td>
              <td>{{ recurso.categoria }}</td>
              <td>
                <button @click="verDetalles(recurso)" class="boton-ver">👁️ Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal de detalles -->
      <div v-if="recursoSeleccionado" class="modal">
        <div class="modal-contenido">
          <h2>📖 Detalles del Recurso</h2>
          <p><strong>Título:</strong> {{ recursoSeleccionado.titulo }}</p>
          <p><strong>Autor:</strong> {{ recursoSeleccionado.autor }}</p>
          <p><strong>Tipo:</strong> {{ recursoSeleccionado.tipo }}</p>
          <p><strong>Categoría:</strong> {{ recursoSeleccionado.categoria }}</p>
  
          <div v-if="recursoSeleccionado.portada" class="portada">
            <img :src="recursoSeleccionado.portada" alt="Portada del Recurso" />
          </div>
  
          <button @click="cerrarDetalles" class="boton-cerrar">❌ Cerrar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        recursos: [
          {
            idRecurso: 1,
            titulo: "Cálculo Avanzado",
            autor: "John Doe",
            tipo: "Libro",
            categoria: "Matemáticas",
            portada: "https://via.placeholder.com/150",
          },
          {
            idRecurso: 2,
            titulo: "Historia Moderna",
            autor: "Jane Smith",
            tipo: "Artículo",
            categoria: "Historia",
            portada: "https://via.placeholder.com/150",
          },
        ],
        recursoSeleccionado: null,
      };
    },
    methods: {
      verDetalles(recurso) {
        this.recursoSeleccionado = recurso;
      },
      cerrarDetalles() {
        this.recursoSeleccionado = null;
      },
    },
  };
  </script>
  
  <style scoped>
  /* 🔹 Contenedor general */
  .contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
    background: url('../../assets/fondo-biblioteca.jpg') no-repeat center center/cover;
    padding: 20px;
  }
  
  /* 🔹 Tarjeta que contiene la tabla */
  .tabla-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 800px;
    width: 100%;
    text-align: center;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  /* 🔹 Tabla de recursos */
  .tabla {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  
  th, td {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  th {
    background: #2c3e50;
    color: white;
  }
  
  /* 🔹 Botón de ver detalles */
  .boton-ver {
    background: #3498db;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .boton-ver:hover {
    background: #2980b9;
  }
  
  /* 🔹 Modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .modal-contenido {
    background: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  /* 🔹 Portada del libro */
  .portada img {
    max-width: 100%;
    border-radius: 8px;
    margin-top: 10px;
  }
  
  /* 🔹 Botón de cerrar */
  .boton-cerrar {
    background: #e74c3c;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.3s;
  }
  
  .boton-cerrar:hover {
    background: #c0392b;
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
  </style>
  