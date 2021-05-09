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
import { Task } from "@/types";
import { format } from 'date-fns'
import BoardTask from '@/components/kanban/BoardTask.vue';
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  computed: {
    tasks(): Task[] {
      return this.$store.state.tasks
    }
  },
  methods: {
    dateLocalize(date: Date) {
      return format(date, "yyyy-MM-dd")
    }
  },
  components: {
    'board-task': BoardTask
  }
})
</script>

<style scoped>
.board-task {
  width: 100vw;
  height: calc(100vh - 124px);
}
</style>