<template>
    <div class="contenedor">
      <div class="recurso-card">
        <h1>✏️ Editar Recurso Académico</h1>
        <form @submit.prevent="actualizarRecurso">
          <div class="campo">
            <label>Seleccionar Recurso:</label>
            <select v-model="recursoSeleccionado" @change="cargarDatosRecurso">
              <option disabled value="">Seleccione un recurso...</option>
              <option v-for="recurso in recursos" :key="recurso.idRecurso" :value="recurso.idRecurso">
                {{ recurso.titulo }}
              </option>
            </select>
          </div>
          <div v-if="recurso.titulo">
            <div class="campo">
              <label>Título:</label>
              <input type="text" v-model="recurso.titulo" required />
            </div>
            <div class="campo">
              <label>Autor:</label>
              <input type="text" v-model="recurso.autor" required />
            </div>
            <div class="campo">
              <label>Tipo:</label>
              <select v-model="recurso.tipo" required>
                <option>Libro</option>
                <option>Artículo</option>
                <option>Tesis</option>
                <option>Otro</option>
              </select>
            </div>
            <div class="campo">
              <label>Categoría:</label>
              <select v-model="recurso.categoria" required>
                <option>Ciencia</option>
                <option>Historia</option>
                <option>Tecnología</option>
                <option>Matemáticas</option>
              </select>
            </div>
            <div class="campo">
              <label>Actualizar Portada:</label>
              <input type="file" @change="procesarPortada" accept="image/*" />
            </div>
            <div class="campo">
              <label>Actualizar Archivo:</label>
              <input type="file" @change="procesarArchivo" accept=".pdf,.doc,.docx" />
            </div>
            <button type="submit" class="boton-guardar">💾 Guardar Cambios</button>
            <p v-if="mensaje" :class="['mensaje', mensajeTipo]">{{ mensaje }}</p>
          </div>
        </form>
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        recursos: [
          { idRecurso: 1, titulo: "Cálculo Avanzado", autor: "John Doe", tipo: "Libro", categoria: "Matemáticas" },
          { idRecurso: 2, titulo: "Historia Moderna", autor: "Jane Smith", tipo: "Artículo", categoria: "Historia" },
        ],
        recursoSeleccionado: "",
        recurso: {
          titulo: "",
          autor: "",
          tipo: "",
          categoria: "",
          portada: null,
          archivo: null,
        },
        mensaje: "",
        mensajeTipo: "",
      };
    },
    methods: {
      procesarPortada(event) {
        this.recurso.portada = event.target.files[0];
      },
      procesarArchivo(event) {
        this.recurso.archivo = event.target.files[0];
      },
      cargarDatosRecurso() {
        const recursoEncontrado = this.recursos.find(r => r.idRecurso === this.recursoSeleccionado);
        if (recursoEncontrado) {
          this.recurso = { ...recursoEncontrado };
        }
      },
      actualizarRecurso() {
        console.log("✏️ Recurso actualizado:", this.recurso);
        this.mostrarMensaje("✅ Recurso actualizado exitosamente.", "exito");
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
  /* 🔹 Contenedor */
  .contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url('../../assets/fondo-biblioteca.jpg') no-repeat center center/cover;
    padding: 20px;
  }
  /* 🔹 Card estilizada */
  .recurso-card {
    background: rgba(255, 255, 255, 0.95);
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
  /* 🔹 Campos del formulario */
  .campo {
    margin: 15px 0;
  }
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #2c3e50;
  }
  input, select {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #bdc3c7;
    font-size: 1rem;
  }
  /* 🔹 Botón de guardar cambios */
  .boton-guardar {
    background: #27ae60;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    transition: background 0.3s ease-in-out;
  }
  .boton-guardar:hover {
    background: #219150;
  }
  /* 🔹 Mensajes */
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
  
