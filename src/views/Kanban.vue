<template>
  <div class="kanban">
    <h1>Kanban</h1>
    <board-task :tasks="tasks" />
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