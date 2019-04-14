<template>
  <div class="app" :class="mobileClass">
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return /(iPhone|iPad|iPod|iOS|Android|SymbianOS)/i.test(navigator.userAgent);
    },
    mobileClass() {
      return this.isMobile ? 'is-mobile' : '';
    }
  },
}
</script>
<style scoped>
.app {
  padding-top: 40px;
}
.app.is-mobile {
  padding-top: 0;
}
</style>
