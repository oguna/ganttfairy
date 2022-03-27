<template>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Start</th>
                <th>End</th>
                <th>%</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in tasks" :key="item.id">
                <td>{{ item.id }}</td>
                <td><editable-text v-model="item.name" :editable="true"></editable-text></td>
                <td>{{ dateLocalize(item.start) }}</td>
                <td>{{ dateLocalize(item.end) }}</td>
                <td>{{ item.progress }}</td>
                <td>
                    <button @click="openEditTaskDialog(item)">
                        <img src="@/assets/pencil.svg" style="width: 1em; height: 1em;" />
                    </button>
                    <button @click="deleteTask(item.id)">
                        <img src="@/assets/delete.svg" style="width: 1em; height: 1em;" />
                    </button>
                </td>
            </tr>
            <tr>
                <td colspan="6">
                    <button @click="openNewTaskDialog">Add</button>
                </td>
            </tr>
        </tbody>
    </table>
    <teleport to="body">
      <div v-if="modalOpen" class="modal" @click="modalOpen = false">
        <div class="modal-content" @click.stop>
            <task-form v-model="tempTask" @submit="submitEdit" @cancel="modalOpen = false"></task-form>
        </div>
      </div>
    </teleport>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { useTaskStore } from '../stores/task'
import { addDays, format } from 'date-fns'
import TaskForm from "./TaskForm.vue";
import type { Task } from "@/types";
import EditableText from "./EditableText.vue";

const initialTask = {
                id: 0,
                name: "",
                start: new Date(),
                end: new Date(),
                progress: 0
} as Task

export default defineComponent({
    components: {
    TaskForm,
    EditableText
},
    data() {
        return {
            modalOpen: false,
            tempTask: initialTask,
            gripOffset: 100,
        }
    },
    computed: {
        ...mapState(useTaskStore, ['tasks']),
    },
    methods: {
        ...mapActions(useTaskStore, ["deleteTask", "addTask"]),
        dateLocalize(date: Date): string {
            return format(date, "yyyy-MM-dd")
        },
        openNewTaskDialog() {
            this.tempTask = {
                id: 0,
                name: "New Task",
                start: new Date(),
                end: addDays(new Date(), 1),
                progress: 0,
            }
            this.modalOpen = true
        },
        openEditTaskDialog(task: Task) {
            this.tempTask = Object.assign({}, task)
            this.modalOpen = true
        },
        submitEdit() {
            if (this.tempTask.id === 0) {
                this.addTask(this.tempTask)
            } else {
                const task = this.tasks.find(e => e.id === this.tempTask.id)
                if (task) {
                    Object.assign(task, this.tempTask)
                }
            }
            this.modalOpen = false
        }
    }
})
</script>

<style scoped>
th,
td {
    border: solid 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

tr {
    height: 2em;
    max-width: 600px;
}

table {
    border-collapse: collapse;
    width: 100%;
    max-width: 600px;
}

.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  background-color: white;
  width: 600px;
  height: auto;
  border-radius: 20px;
  padding: 20px;

  z-index: 10;
}
</style>