<template>
  <div class="table">
    <v-toolbar dense flat>
      <v-toolbar-title> Table </v-toolbar-title>
      <v-divider class="mx-4" vertical></v-divider>
    </v-toolbar>
    <v-simple-table dense>
      <template v-slot:default>
        <thead class="blue-grey lighten-5">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Start</th>
            <th>End</th>
            <th>Days</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>
              <v-btn text small @click="openTaskDialog(task)">{{
                task.id
              }}</v-btn>
            </td>
            <td>
              <editable-text :v="task.title" @update:v="task.title=$event" editable />
            </td>
            <td>{{ dateLocalize(task.start) }}</td>
            <td>{{ dateLocalize(task.end) }}</td>
            <td>{{ Math.abs(differenceInDays(task.end, task.start) + 1) }}</td>
            <td>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" text small>
                    {{ getStatusLabel(task.status) }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item-group v-model="task.status">
                    <v-list-item value="0" dense> TODO </v-list-item>
                    <v-list-item value="1" dense> WIP </v-list-item>
                    <v-list-item value="2" dense> DONE </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-dialog v-model="dialog" max-width="290">
      <task-card
        :task="edittingTask"
        v-on:close="closeTaskDialog"
        v-on:submit="saveTaskDialog"
        @setParent="edittingTask.parent = $event"
        @setTitle="edittingTask.title = $event"
      ></task-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Task, TaskStatusType } from "@/types";
import { format, differenceInDays } from "date-fns";
import { ja } from "date-fns/locale";
import TaskCard from "@/components/TaskCard.vue";
import EditableText from "@/components/DraggableTreeView/EditableText.vue";

import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: {
    TaskCard,
    EditableText,
  },
  data() {
    return {
      edittingTask: null as Task | null,
      dialog: false,
    };
  },
  methods: {
    dateLocalize(date: Date): string {
      return format(date, "yyyy-MM-dd", { locale: ja });
    },
    getStatusLabel(status: number) {
      return Object.entries(TaskStatusType).map(([_, value]) => value)[status];
    },
    openTaskDialog(task: Task): void {
      this.edittingTask = Object.assign({}, task);
      this.dialog = true;
    },
    closeTaskDialog(): void {
      this.dialog = false;
    },
    saveTaskDialog(): void {
      this.$store.commit("updateTask", this.edittingTask);
      this.closeTaskDialog();
    },
    differenceInDays,
  },
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
  },
});
/*
@Component({
  components: {
    TaskCard,
    EditableText,
  },
  filters: {
  dateLocalize(date: Date) {
    return format(date, "yyyy-MM-dd", {locale: ja})
  },
  getStatusLabel(status: number) {
    return Object.entries(TaskStatusType).map(([_, value]) => value)[status];
  }
  }
})
export default class Table extends Vue {
  public edittingTask: Task|null = null;
  public get tasks() {
    return this.$store.state.tasks;
  }

  public differenceInDays = differenceInDays;

  public dialog = false;

  public openTaskDialog(task: Task) {
    this.edittingTask = Object.assign({}, task);
    this.dialog = true;
  }

  public closeTaskDialog() {
    this.dialog = false;
  }

  public saveTaskDialog() {
    this.$store.commit('updateTask', this.edittingTask);
    this.closeTaskDialog();
  }
}
*/
</script>