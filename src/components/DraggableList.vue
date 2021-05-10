<template>
  <div>
    <div
      v-for="(task,index) in tasks"
      :key="index"
      class="taskStack text-truncate"
      draggable="true"
      @dragstart="dragstart(task, index, $event)"
      @dragend="dragend"
      @dragenter="dragenter(index, $event)"
      :class="{dragging: draggingIndex===index}"
      @click="openDialog(index+1, task)"
    >#{{task.id}}: {{task.title}}
    <v-chip v-if="task.parent" x-small outlined>Parent:#{{task.parent}}</v-chip>
    <v-chip v-for="dependency of dependencies(task.id)" :key="dependency.id" x-small outlined>{{dependency.text}}</v-chip>
    </div>
  </div>
</template>
<script lang="ts">
import { Task, Dependency } from "@/types";
import { defineComponent, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    tasks: Array as PropType<Array<Task>>,
  },
  data() {
    return {
      draggingTask: null as Task | null,
      draggingIndex: null as number | null,
    };
  },
  emits: ['open-dialog'],
  methods: {
    dragstart(task: Task, taskIndex: number, event: DragEvent) {
      this.draggingTask = task;
      this.draggingIndex = taskIndex;
    },
    dragend(event: DragEvent) {
      if (this.draggingIndex === null) {
        return;
      }
      this.draggingTask = null;
      this.draggingIndex = null;
    },
    dragenter(taskIndex: number, event: DragEvent) {
      if (this.draggingIndex === null) {
        return;
      }
      event.preventDefault();
      this.tasks!.splice(this.draggingIndex!, 1);
      this.tasks!.splice(taskIndex, 0, this.draggingTask!);
      this.draggingIndex = taskIndex;
    },
    openDialog(index: number, task: Task) {
      this.$emit("open-dialog", task);
    },
    dependencies(id: number) {
      const types = ["FS", "SS", "FF", "SF"];
      return this.$store.state.dependencies
        .filter((v: Dependency) => v.to === id)
        .map((v: Dependency) => {
          return {
            text: `${types[v.type]}#${v.id}`,
            value: v.id,
          };
        });
    },
  },
});
</script>

<style scoped>
div.taskStack {
  height: 1.5rem;
}
div.taskStack:hover {
  background-color: whitesmoke;
}
div.dragging {
  background: aquamarine;
}
</style>