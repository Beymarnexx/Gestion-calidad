<template>
  <div class="contenedor-fondo">
    <!-- Filtro oscuro sobre la imagen de fondo -->
    <div class="filtro-oscuro"></div>

    <div class="contenido">
      <h1>Bienvenido al Panel de Administración de la UAC Pucarani</h1>
      <p>Gestiona tu información de manera segura y eficiente.</p>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor del fondo */
.contenedor-fondo {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: url('../../assets/Pucarani/INFRAESTRUCTURA/PANO_20241010_113630.jpg') no-repeat center center;
  background-size: cover;
  z-index: -1; /* Se mantiene detrás del navbar */
}

/* Filtro de oscurecimiento para que el navbar y contenido sean legibles */
.filtro-oscuro {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Oscurece el fondo sin afectar el navbar */
}

/* Estilo del contenido en el centro */
.contenido {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7); /* Fondo más oscuro para el texto */
  padding: 30px 50px;
  border-radius: 12px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.4);
  text-align: center;
  color: white;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 15px;
}

p {
  font-size: 1.3rem;
}
</style>
