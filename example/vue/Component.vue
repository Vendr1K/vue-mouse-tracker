<template>
  <div
    class="area-block"
    v-track-coords="{
      checkInterval: 30,
      sendInterval: 3000,
      url: '/api/track',
    }"
  ></div>
</template>

<style scoped>
.area-block {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
