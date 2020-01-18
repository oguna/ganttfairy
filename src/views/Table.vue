<template>
  <div class="table">
    <v-toolbar dense>
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
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Start</th>
          <th>End</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{task.id}}</td>
          <td>{{task.title}}</td>
          <td>{{task.start | dateLocalize}}</td>
          <td>{{task.end | dateLocalize }}</td>
        </tr>
      </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
@Component({
  filters: {
  dateLocalize(date: Date) {
    return format(date, "yyyy-MM-dd", {locale: ja})
  }
  }
})
export default class Table extends Vue {
  public get tasks() {
    return this.$store.state.tasks;
  }
}
</script>