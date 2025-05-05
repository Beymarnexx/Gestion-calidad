<template>
    <div class="contenedor">
      <div class="eliminar-card">
        <h1>🗑️ Eliminar Recurso Académico</h1>
        <p class="alerta">⚠️ Esta acción no se puede deshacer. Procede con precaución.</p>
  
        <form @submit.prevent="eliminarRecurso">
          <div class="campo">
            <label>Seleccionar Recurso:</label>
            <select v-model="recursoSeleccionado">
              <option disabled value="">Seleccione un recurso...</option>
              <option v-for="recurso in recursos" :key="recurso.idRecurso" :value="recurso.idRecurso">
                {{ recurso.titulo }} - {{ recurso.autor }}
              </option>
            </select>
          </div>
  
          <button type="submit" class="boton-eliminar" :disabled="!recursoSeleccionado">🗑️ Eliminar Recurso</button>
  
          <p v-if="mensaje" :class="['mensaje', mensajeTipo]">{{ mensaje }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        recursos: [
          { idRecurso: 1, titulo: "Cálculo Avanzado", autor: "John Doe" },
          { idRecurso: 2, titulo: "Historia Moderna", autor: "Jane Smith" },
        ],
        recursoSeleccionado: "",
        mensaje: "",
        mensajeTipo: "",
      };
    },
    methods: {
      eliminarRecurso() {
        if (!this.recursoSeleccionado) return;
  
        this.recursos = this.recursos.filter(r => r.idRecurso !== this.recursoSeleccionado);
        this.mostrarMensaje("✅ Recurso eliminado correctamente.", "exito");
        this.recursoSeleccionado = "";
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
  
  /* 🔹 Card para eliminar recurso */
  .eliminar-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 450px;
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
  
  select {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #bdc3c7;
    font-size: 1rem;
  }
  
  /* 🔹 Mensaje de advertencia */
  .alerta {
    background: #f9c74f;
    color: #5f4b00;
    padding: 10px;
    border-radius: 6px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  /* 🔹 Botón de eliminación */
  .boton-eliminar {
    background: #e74c3c;
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
    background: #c0392b;
  }
  
  .boton-eliminar:disabled {
    background: gray;
    cursor: not-allowed;
  }
  
  /* 🔹 Mensajes de éxito y error */
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
  