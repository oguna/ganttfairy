<template>
    <div class="tasklist"
    :class="{dragover: dragover}"
    @dragover="dragover"
    @dragleave="dragleave"
    @dragenter="dragenter($event)"
    @drop="drop($event)">
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
    public nowDragover = false;
    @Prop({default: null})
    public dragging!: number|null;
    public selectedList: string|null = null;
    public set _dragging(value: number|null) {
        this.$emit('update:dragging', value);
    }
    public get _dragging() {
        return this.dragging;
    }
    public dragenter(event: DragEvent) {
        if (this.dragging !== null) {
            this.nowDragover = true;
        }
    }
    public dragleave(event: DragEvent) {
        if (this.dragging !== null) {
            this.nowDragover = false;
        }
    }
    public dragover(event: DragEvent) {
        if (this.dragging !== null && this.dragging !== this.status) {
            event.preventDefault();
        }
    }
    public drop(event: DragEvent) {
        event.preventDefault();
        if (this.dragging !== null) {
            const task = Object.assign(this.$store.getters.getTaskById(this.dragging), {});
            task.status = this.status;
            this.$store.commit('updateTask', task);
            this.$emit('update:dragging', null);
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
.dragover {
    background-color: pink;
}
</style>