<template>
  <div class="calendar">
    <v-toolbar dense flat>
      <v-toolbar-title>Calendar</v-toolbar-title>
      <v-divider vertical inset class="mx-4"></v-divider>
      <v-btn outlined @click="setToday">Today</v-btn>
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-menu
      v-model="menu"
      :close-on-content-click="false"
      offset-y
      >
      <template v-slot:activator="{ on }">
        <v-btn text color="indigo" dark v-on="on">
          {{picker}}
        </v-btn>
      </template>
      <v-card>
        <v-date-picker v-model="picker" type="month">
        </v-date-picker>
      </v-card>
      </v-menu>
    </v-toolbar>
    <v-calendar ref="calendar" v-model="value" type="month" :events="tasks"
      event-color="blue lighten-4"
      event-text-color="black"
      >
    </v-calendar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import { format } from "date-fns";
@Component
export default class Calendar extends Vue {
  public set picker(value: string) {
    this.value = value + '-01';
  }
  public get picker() {
    return this.value.substr(0, 7);
  }
  public menu = false;
  public get tasks() {
    return this.$store.state.tasks.map((task: Task) => {
      return {
        name: task.title,
        start: format(task.start, "yyyy-MM-dd"),
        end: format(task.end, "yyyy-MM-dd"),
      };
    });
  }
  public value: string = format(new Date(), "yyyy-MMd");
  public setToday() {
    this.value = format(new Date(), "yyyy-MM-dd");
  }
}
</script>