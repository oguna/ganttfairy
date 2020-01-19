<template>
  <div class="table">
    <v-toolbar dense flat>
      <v-toolbar-title>
        Table
      </v-toolbar-title>
       <v-divider
      class="mx-4"
      vertical
    ></v-divider>
    </v-toolbar>
    <v-simple-table>
      <template v-slot:default>
      <thead class="blue-grey lighten-5">
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td @click="openTaskDialog(task)">
            <v-btn text small>{{task.id}}</v-btn>
          </td>
          <td>{{task.title}}</td>
          <td>{{task.start | dateLocalize}}</td>
          <td>{{task.end | dateLocalize }}</td>
          <td>{{task.status | getStatusLabel }}</td>
        </tr>
      </tbody>
      </template>
    </v-simple-table>
    <v-dialog v-model="dialog" max-width="290">
      <task-card
        :task="edittingTask"
        v-on:close="closeTaskDialog"
        v-on:submit="saveTaskDialog"
      ></task-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task, TaskStatusType } from "@/types";
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import TaskCard from '@/components/TaskCard.vue';
@Component({
  components: {
    TaskCard,
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
</script>