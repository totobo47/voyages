<template>
  <div class="accueil" >
    <!-- <div class="image1"></div>
    <div class="image2"></div> -->
    <section>
      <PremiereSection />
    </section>
    </div>

</template>

<script setup>
import PremiereSection from "@/views/accueil/premiereSection.vue";

</script>

<style scoped>
section {
  height: var(--height);
  position: relative;
}
.accueil {
  position: relative;
}

/* .image1{ 
    position: relative;
    height: 100vh;
    width: 100vw;
    background-image: url("@/assets/IMG_3467.JPEG");
    background-size: cover;
}

.image2{
    mix-blend-mode: screen;
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0px;
    left: 0px;
    background-image: url("@/assets/splash.jpg");
    background-position: center;
    background-size: cover;
} */
</style>
