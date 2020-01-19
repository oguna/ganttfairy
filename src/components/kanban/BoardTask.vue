<template>
    <div class="boardTask">
        <task-list :dragging.sync="dragging" :tasks="naTasks" title="N/A" :status="null"/>
        <task-list :dragging.sync="dragging" :tasks="todoTasks" title="TODO" :status="0"/>
        <task-list :dragging.sync="dragging" :tasks="wipTasks" title="WIP" :status="1"/>
        <task-list :dragging.sync="dragging" :tasks="doneTasks" title="DONE" :status="2"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import TaskList from '@/components/kanban/TaskList.vue'
@Component({
    components: {
        TaskList
    }
})
export default class BoardTask extends Vue {
    @Prop()
    public tasks!: Task[];
    public dragging: number|null = null;
    public get naTasks() {
        return this.tasks.filter((task: Task) => task.status === null);
    }
    public get todoTasks() {
        return this.tasks.filter((task: Task) => task.status === 0);
    }
    public get wipTasks() {
        return this.tasks.filter((task: Task) => task.status === 1);
    }
    public get doneTasks() {
        return this.tasks.filter((task: Task) => task.status === 2);
    }
}
</script>

<style scoped>
div.boardTask {
  text-align: center;
  white-space: nowrap;
  overflow-x: scroll;
}
</style>