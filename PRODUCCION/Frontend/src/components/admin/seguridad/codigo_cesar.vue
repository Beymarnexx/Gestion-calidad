<template>
  <div class="page-container">
    <nav class="navbar">Cifrado César</nav>
    <div class="background-overlay">
      <div class="cipher-container">
        <h1>Cifrado César</h1>
        <form @submit.prevent="processText" class="cipher-form">
          <div class="form-group">
            <label>Acción</label>
            <select v-model="action" required>
              <option value="encrypt">Cifrar</option>
              <option value="decrypt">Descifrar</option>
            </select>
          </div>
          <div class="form-group">
            <label for="plainText">Texto</label>
            <input type="text" id="plainText" v-model="plainText" placeholder="Ingresa el texto" required />
          </div>
          <div class="form-group">
            <label for="shift">Desplazamiento</label>
            <input type="number" id="shift" v-model.number="shift" placeholder="Ingresa el desplazamiento" required />
          </div>
          <button type="submit" class="btn-submit">{{ action === 'encrypt' ? 'Cifrar' : 'Descifrar' }}</button>
        </form>
      </div>
      <div class="result-box">
        <div class="result">
          <h2>Texto {{ action === 'encrypt' ? 'Cifrado' : 'Descifrado' }}</h2>
          <p>{{ resultText }}</p>
        </div>
        <div class="alphabet-container">
          <h3>Alfabeto</h3>
          <p>Normal: 
            <span v-for="(letter, index) in alphabet" :key="'normal-' + index">{{ letter }}</span>
          </p>
          <p class="arrow">{{ action === 'encrypt' ? '↓' : '↑' }}</p>
          <p>Cifrado: 
            <span v-for="(letter, index) in shiftedAlphabet" :key="'shifted-' + index">{{ letter }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      plainText: '',
      shift: 0,
      action: 'encrypt', // Acción por defecto es 'encrypt'
      resultText: '',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      shiftedAlphabet: []
    };
  },
  methods: {
    processText() {
      // Generamos el alfabeto cifrado
      this.shiftedAlphabet = [...this.alphabet];
      // Desplazar el alfabeto normal hacia adelante según el desplazamiento
      if (this.action === 'encrypt') {
        this.shiftedAlphabet = [...this.alphabet.slice(this.shift), ...this.alphabet.slice(0, this.shift)];
      } else {
        // Para descifrar, desplazamos el alfabeto normal hacia atrás (en este caso hacia adelante en el alfabeto)
        this.shiftedAlphabet = [...this.alphabet.slice(this.shift), ...this.alphabet.slice(0, this.shift)];
      }

      // Cifrar o descifrar el texto dependiendo de la acción
      if (this.action === 'encrypt') {
        this.resultText = this.plainText.toUpperCase().split('').map(letter => {
          const index = this.alphabet.indexOf(letter);
          return index !== -1 ? this.shiftedAlphabet[index] : letter;
        }).join('');
      } else {
        this.resultText = this.plainText.toUpperCase().split('').map(letter => {
          const index = this.shiftedAlphabet.indexOf(letter);
          return index !== -1 ? this.alphabet[index] : letter;
        }).join('');
      }
    }
  }
};
</script>
<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f0f0;
  padding: 20px 0;
}
.cipher-container {
  max-width: 500px;
  width: 90%;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
}
h1, h2, h3 {
  color: #004080;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 20px;
}
.cipher-form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 15px;
}
label {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  display: block;
}
input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}
.btn-submit {
  background-color: #004080;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
.btn-submit:hover {
  background-color: #003366;
}
.result-box {
  margin-top: 30px;
  width: 90%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.result {
  font-size: 1.2rem;
}
.alphabet-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}
.alphabet-container p {
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  gap: 5px;
}
.alphabet-container span {
  display: inline-block;
  padding: 3px 5px;
  background-color: #e0e0e0;
  border-radius: 5px;
  min-width: 20px;
  text-align: center;
  font-weight: bold;
  border: 1px solid #ccc;
  font-size: 0.8rem;
}
.arrow {
  font-size: 1.5rem;
  text-align: center;
  font-weight: bold;
}
</style>
