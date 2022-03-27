<script setup lang="ts">
import TaskTable from '@/components/TaskTable.vue'
import GanttFigure from '@/components/GanttFigure.vue';
import { computed, ref } from 'vue';

</script>

<template>
  <main class="gantt-wrapper" style="display: flex;">
    <div class="left">
      <div class="left_header"></div>
      <TaskTable />
    </div>
    <div class="right">
      <GanttFigure />
    </div>
  </main>
</template>

<style scoped>
.gantt-wrapper {
  width: 100%;
  height: calc(100vh - 3em);
  overflow-x: scroll;
  overflow-y: scroll;
}
div.left {
  display: inline-block;
  background-color: white;
  width: 600px;
  white-space: nowrap;
  vertical-align: top;
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
}
div.left_header {
  height: 4rem;
  background-color: gainsboro;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  z-index: 2;
}
div.right {
  display: inline-block;
  background-color: white;
  white-space: nowrap;
  vertical-align: top;
}

.disable-select {
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>
