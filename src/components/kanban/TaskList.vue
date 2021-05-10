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
import { Task } from "@/types";
import { format } from 'date-fns'
import TaskCard from '@/components/kanban/TaskCard.vue'
import { defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
    components: {
        'task-card': TaskCard,
    },
  props: {
    status: Number as () => number|null,
    title: String,
    tasks: Array as PropType<Array<Task>>,
    dragging: Number as () => number|null,
  },
  data() {
    return {
        nowDragover: false,
        selectedList: null as string|null 
    }
  },
  computed: {
      _dragging: {
          get(): number|null {
            return this.dragging!
          },
          set(value: number|null) {
            this.$emit('update:dragging', value);
          }
      }
  },
  methods: {
     dragenter(event: DragEvent) {
        if (this.dragging !== null) {
            this.nowDragover = true;
        }
    },
    dragleave(event: DragEvent) {
        if (this.dragging !== null) {
            this.nowDragover = false;
        }
    },
    dragover(event: DragEvent) {
        if (this.dragging !== null && this.dragging !== this.status) {
            event.preventDefault();
        }
    },
    drop(event: DragEvent) {
        event.preventDefault();
        if (this.dragging !== null) {
            const task = Object.assign(this.$store.getters.getTaskById(this.dragging), {});
            task.status = this.status;
            this.$store.commit('updateTask', task);
            this.$emit('update:dragging', null);
        }
    }
  },
});
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