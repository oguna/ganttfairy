<template>
  <div class="kanban">
    <v-toolbar dense flat>
      <v-toolbar-title>Kanban</v-toolbar-title>
      <v-divider vertical inset class="mx-4"></v-divider>
      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>
    <board-task class="board-task" :tasks="tasks" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import { format } from 'date-fns'
import BoardTask from '@/components/kanban/BoardTask.vue';
@Component({
  filters: {
  dateLocalize(date: Date) {
    return format(date, "yyyy-MM-dd")
  }
  },
  components: {
      BoardTask
  }
})
export default class Kanban extends Vue {
  public get tasks() {
    return this.$store.state.tasks;
  }
}
</script>

<style scoped>
.board-task {
  width: 100vw;
  height: calc(100vh - 124px);
}
</style>