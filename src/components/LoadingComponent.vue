<script lang="ts">
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<template>
  <div>
    <div v-if="loading" class="overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 2px solid #666666;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1000deg);
  }
}
</style>
