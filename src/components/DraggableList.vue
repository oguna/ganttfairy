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
    >
    #{{index+1}}: {{task.title}}</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
@Component
export default class DraggableList extends Vue {
  @Prop()
  public tasks!: Task[];
  public dragstart(task: Task, taskIndex: number, event: DragEvent) {
    this.draggingTask = task;
    this.draggingIndex = taskIndex;
  }
  public dragend(event: DragEvent) {
      if (this.draggingIndex === null) {
          return;
      }
    this.draggingTask = null;
    this.draggingIndex = null;
  }
  public dragenter(taskIndex: number, event: DragEvent) {
      if (this.draggingIndex === null) {
          return;
      }
      event.preventDefault();
    this.tasks.splice(this.draggingIndex!, 1);
    this.tasks.splice(taskIndex, 0, this.draggingTask!);
    this.draggingIndex = taskIndex;
  }
  public draggingTask: Task | null = null;
  public draggingIndex: number | null = null;
  public openDialog(index: number, task: Task) {
    this.$emit('open-dialog', task, index);
  }
}
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