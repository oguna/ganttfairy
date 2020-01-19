<template>
    <div class="taskcard" draggable="true"
    @dragstart="dragstart(task, $event)"
    @dragend="dragend($event)"
    :class="{dragging:(dragging===task.id)}">
            <h3 class="tasktitle">#{{task.id}}: {{task.title}}</h3>
            {{task.start|dateLocalize}} ～ {{task.end|dateLocalize}}
        </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import { format } from 'date-fns'
@Component({
  filters: {
  dateLocalize(date: Date) {
    return format(date, "yyyy-MM-dd")
  }
  }
})
export default class TaskList extends Vue {
    @Prop()
    public task!: Task;
    @Prop()
    public dragging?: number|null;
    public dragstart(task: Task, event: DragEvent) {
        event.dataTransfer!.setData('text/plain', "");
        this.$emit('update:dragging', task.id);
    }
    public dragend(event: DragEvent) {
        this.$emit('update:dragging', null);
    }
}
</script>

<style scoped>
div.taskcard {
    filter: drop-shadow(1px 1px 1px rgba(128,128,128,0.6));
    background-color: white;
    border-radius: 0.5rem;
    display: block;
    width: calc(100% - 16px);
    border: 1px gray solid;
    overflow-y: auto;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 8px;
    text-align: left;
    cursor: move;
}
div.dragging {
    background: gray;
    opacity: 50%;
}
</style>