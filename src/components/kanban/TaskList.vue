<template>
    <div class="tasklist" draggable="true"
    @dragover="dragover"
    @dragenter="dragenter($event)">
        <h2 class="title">{{title}} ({{tasks.length}})</h2>
        <div class="scrollble">
            <task-card
                :dragging.sync="_dragging"
                class="card" v-for="task in tasks" :key="task.id" :task="task">
            </task-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import { format } from 'date-fns'
import TaskCard from '@/components/kanban/TaskCard.vue'
@Component({
  components: {
      TaskCard
  }
})
export default class TaskList extends Vue {
    @Prop()
    public status!: number|null;
    @Prop()
    public title!: string;
    @Prop()
    public tasks!: Task[];
    @Prop({default: null})
    public dragging!: number|null;
    public set _dragging(value: number|null) {
        this.$emit('update:dragging', value);
    }
    public get _dragging() {
        return this.dragging;
    }
    public dragenter(event: DragEvent) {
        if (this.dragging !== null) {
            const task: Task = this.$store.getters.getTaskById(this.dragging);
            task.status = this.status;
            this.$store.commit('updateTask', task);
            this._dragging = null;
        }
    }
    public dragover(event: DragEvent) {
        if (this.dragging !== null) {
            event.preventDefault();
        }
    }
}
</script>

<style scoped>
div.tasklist {
    display: inline-block;
    background-color: whitesmoke;
    border-radius: 0.5rem;
    border: 0.5px gray solid;
    height: 100%;
    margin-left: 4px;
    margin-right: 4px;
}
div.scrollble {
    overflow-y: auto;
    width: 20rem;
    height: calc(100vh - 180px);
}
.title {
    font-size: 1rem;
    text-align: center;
}
</style>