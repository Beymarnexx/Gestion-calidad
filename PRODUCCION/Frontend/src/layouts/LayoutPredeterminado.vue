<template>
    <div>
        <Navbar />
        <router-view />
        <Footer />
    </div>
</template>

<script>
    import Navbar from '@/components/common/Navbar.vue';
    import Footer from '@/components/common/Footer.vue';

    export default{
        components :{
            Navbar,
            Footer,
        }
    }
</script>

<style scoped>
    /*Estilos para este*/
</style>