<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.card {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
</script>



