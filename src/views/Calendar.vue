<template>
    <div class="calendar">
        <h1>Calendar</h1>
         <v-calendar
        ref="calendar"
        v-model="value"
        type="month"
        :events="tasks"
      ></v-calendar>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import { format } from 'date-fns'
@Component
export default class Calendar extends Vue {
  public get tasks() {
    return this.$store.state.tasks.map((task:Task)=> {
        return {
            name: task.title,
            start: format(task.start, "yyyy-MM-dd"),
            end: format(task.end, "yyyy-MM-dd"),
        }
    });
  }
  public value: string = format(new Date(), 'yyyy-MM-dd');
}
</script>