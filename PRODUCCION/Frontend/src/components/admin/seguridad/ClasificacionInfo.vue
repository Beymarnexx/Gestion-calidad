<template>
  <div class="page-container">
    <nav class="navbar">Matriz de Clasificación de Información</nav>
    <div class="background-overlay">
      <div class="form-container">
        <h1>Formulario de Clasificación</h1>
        <form @submit.prevent="addRecord" class="classification-form">
          <div class="form-group">
            <label>Activo de Información</label>
            <input type="text" v-model="newRecord.activo" required />
          </div>
          <div class="form-group">
            <label>Fecha de Evaluación</label>
            <input type="date" v-model="newRecord.fecha" required />
          </div>
          <div class="form-group">
            <label>Responsable</label>
            <input type="text" v-model="newRecord.responsable" required />
          </div>
          <div class="form-group">
            <label>Propietario/Autorizador</label>
            <input type="text" v-model="newRecord.propietario" required />
          </div>

          <!-- Clasificación -->
          <div class="form-group">
            <label>Confidencialidad</label>
            <select v-model="newRecord.confidencialidad" required>
              <option value="1">1 - 10%</option>
              <option value="2">2 - 20%</option>
              <option value="3">3 - 40%</option>
            </select>
            <p class="description">
              Si esta información llegara a ser conocida por individuos no autorizados o incluso hecha pública. Afectación de procesos críticos, afectación legal, financiera, organizacional.
            </p>
          </div>

          <div class="form-group">
            <label>Integridad</label>
            <select v-model="newRecord.integridad" required>
              <option value="1">1 - 10%</option>
              <option value="2">2 - 20%</option>
              <option value="3">3 - 30%</option>
            </select>
            <p class="description">
              Si esta información llegara a ser indebida o inadecuadamente alterada, actualizada o modificada, ya sea intencionalmente o por accidente. Afectación de procesos críticos, afectación legal, financiera, organizacional.
            </p>
          </div>

          <div class="form-group">
            <label>Disponibilidad</label>
            <select v-model="newRecord.disponibilidad" required>
              <option value="1">1 - 10%</option>
              <option value="2">2 - 20%</option>
              <option value="3">3 - 30%</option>
            </select>
            <p class="description">
              Si esta información llegara a no estar disponible permanentemente o por un periodo considerable de tiempo. Afectación de procesos críticos, afectación legal, financiera, organizacional.
            </p>
          </div>

          <button type="submit" class="btn-submit">{{ editIndex === null ? 'Añadir Registro' : 'Actualizar Registro' }}</button>
        </form>
      </div>

      <!-- Tabla de registros -->
      <div class="table-container">
        <h2>Registros Guardados</h2>
        <table>
          <thead>
            <tr>
              <th>Activo</th>
              <th>Fecha</th>
              <th>Responsable</th>
              <th>Propietario</th>
              <th>Confidencialidad</th>
              <th>Integridad</th>
              <th>Disponibilidad</th>
              <th>Puntaje</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in records" :key="index">
              <td>{{ record.activo }}</td>
              <td>{{ record.fecha }}</td>
              <td>{{ record.responsable }}</td>
              <td>{{ record.propietario }}</td>
              <td>{{ record.confidencialidad * 10 }}%</td>
              <td>{{ record.integridad * 10 }}%</td>
              <td>{{ record.disponibilidad * 10 }}%</td>
              <td>{{ getScore(record) }}</td>
              <td :class="getCategoryClass(getScore(record))">{{ getCategory(getScore(record)) }}</td>
              <td>
                <button @click="editRecord(index)" class="btn-edit">Editar</button>
                <button @click="deleteRecord(index)" class="btn-delete">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      records: [],
      newRecord: {
        activo: '',
        fecha: '',
        responsable: '',
        propietario: '',
        confidencialidad: '1',
        integridad: '1',
        disponibilidad: '1'
      },
      editIndex: null
    };
  },
  methods: {
    addRecord() {
      const record = { ...this.newRecord };
      if (this.editIndex === null) {
        this.records.push(record);
      } else {
        this.records[this.editIndex] = record;
        this.editIndex = null;
      }
      this.resetForm();
    },
    editRecord(index) {
      this.newRecord = { ...this.records[index] };
      this.editIndex = index;
    },
    deleteRecord(index) {
      this.records.splice(index, 1);
    },
    resetForm() {
      this.newRecord = {
        activo: '',
        fecha: '',
        responsable: '',
        propietario: '',
        confidencialidad: '1',
        integridad: '1',
        disponibilidad: '1'
      };
    },
    getScore(record) {
      return record.confidencialidad * 10 + record.integridad * 10 + record.disponibilidad * 10;
    },
    getCategory(score) {
      if (score <= 40) return 'USO PÚBLICO O GENERAL';
      if (score > 40 && score <= 60) return 'USO INTERNO O PRIVADO';
      return 'CRÍTICO O CONFIDENCIAL';
    },
    getCategoryClass(score) {
      if (score <= 40) return 'category-public';
      if (score > 40 && score <= 60) return 'category-internal';
      return 'category-critical';
    }
  }
};
</script>

<style scoped>
.page-container {
  font-family: Arial, sans-serif;
}
.navbar {
  background-color: #082447;
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 1.5rem;
}
.background-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f0f0;
  padding: 20px;
}
.form-container {
  max-width: 600px;
  width: 90%;
  padding: 50px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
h1, h2 {
  color: #004080;
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
}
label {
  font-weight: bold;
}
input, select {
  width: 100%;
  padding: 10px;
}
.description {
  font-size: 0.9rem;
  color: #555;
}
.btn-submit, .btn-edit, .btn-delete {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-submit {
  background-color: #004080;
  color: white;
}

.btn-submit:hover {
  background-color: #003366;
}

.btn-edit {
  background-color: #004080; /* Azul */
  color: white;
  border: 1px solid #003366;
}

.btn-edit:hover {
  background-color: #003366;
  transform: scale(1.05);
}

.btn-delete {
  background-color: #ff4444;
  color: white;
  border: 1px solid #cc0000;
  box-shadow: 2px 2px 5px rgba(255, 68, 68, 0.3);
}

.btn-delete:hover {
  background-color: #cc0000;
  transform: scale(1.05);
  box-shadow: 3px 3px 8px rgba(255, 0, 0, 0.4);
}

table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
th {
  background-color: #004080;
  color: white;
}

/* Nuevas clases para las categorías */
.category-public {
  background-color: #ffeb3b; /* Amarillo */
  color: black;
  padding: 5px;
  border-radius: 5px;
}

.category-internal {
  background-color: #ff9800; /* Naranja */
  color: white;
  padding: 5px;
  border-radius: 5px;
}

.category-critical {
  background-color: #f44336; /* Rojo */
  color: white;
  padding: 5px;
  border-radius: 5px;
}
</style>
