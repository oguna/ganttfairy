<template>
    <div class="boardTask">
        <task-list :dragging.sync="dragging" :tasks="naTasks" title="N/A" :status="null"/>
        <task-list :dragging.sync="dragging" :tasks="todoTasks" title="TODO" :status="0"/>
        <task-list :dragging.sync="dragging" :tasks="wipTasks" title="WIP" :status="1"/>
        <task-list :dragging.sync="dragging" :tasks="doneTasks" title="DONE" :status="2"/>
    </div>
</template>

<script lang="ts">
import { Task } from "@/types";
import TaskList from '@/components/kanban/TaskList.vue'
import { defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
  props: {
    tasks: Array as PropType<Array<Task>>,
  },
  data() {
    return {
      dragging: null as number | null,
    };
  },
  computed: {
    naTasks(): Task[] {
      return this.tasks!.filter((task: Task) => task.status === null);
    },
    todoTasks(): Task[] {
      return this.tasks!.filter((task: Task) => task.status === 0);
    },
    wipTasks(): Task[] {
      return this.tasks!.filter((task: Task) => task.status === 1);
    },
    doneTasks(): Task[] {
      return this.tasks!.filter((task: Task) => task.status === 2);
    },
  },
  components: {
    "task-list": TaskList,
  },
});
</script>

<style scoped>
div.boardTask {
  text-align: center;
  white-space: nowrap;
  overflow-x: scroll;
}
</style>