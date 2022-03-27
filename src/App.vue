<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="nav">
      <h1>Gantt Fairy</h1>&nbsp;
      <RouterLink to="/">Home</RouterLink>&nbsp;
      <RouterLink to="/about">About</RouterLink>&nbsp;
      <a href="https://github.com/oguna/ganttfairy" target="_blank">GitHub</a>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
.nav {
  background-color: #2B77CC;
  padding: 0.5em;
}
.nav ::v-deep(h1) {
  font-size: 1em;
  color: white;
  display: inline;
}

.nav ::v-deep(a) {
  font-size: 1em;
  color: white;
}

.nav ::v-deep(a:hover) {
  background-color: darkblue;
}
</style>
