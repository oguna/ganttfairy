<template>
  <v-card>
    <v-card-title>#{{task.id||"new"}}</v-card-title>
    <v-card-text>
      <v-text-field v-model="task.title" label="Title"></v-text-field>
      <v-text-field v-model="task.group" label="Group"></v-text-field>
      <v-menu
        :ref="startMenu"
        v-model="startMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="startDateISOString"
            label="Start"
            prepend-icon="mdi-calendar"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="startDateISOString" no-title scrollable>
        </v-date-picker>
      </v-menu>
      <v-menu
        :ref="endMenu"
        v-model="endMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="endDateISOString"
            label="End"
            prepend-icon="mdi-calendar"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="endDateISOString" no-title scrollable>
        </v-date-picker>
      </v-menu>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="task.id===null" text @click="this.delete" color="red" outlined>Delete</v-btn>
      <v-spacer></v-spacer>
      <v-btn text @click="close">Cancel</v-btn>
      <v-btn text color="primary" @click="submit">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import {format, parse} from 'date-fns';
@Component
export default class TaskCard extends Vue {
  public get startDateISOString():string {
    return format(this.task!.start, 'yyyy-MM-dd');
  }
  public set startDateISOString(value: string) {
    this.task!.start = parse(value, 'yyyy-MM-dd', new Date());
  }
  public get endDateISOString():string {
    return format(this.task!.end, 'yyyy-MM-dd');
  }
  public set endDateISOString(value: string) {
    this.task!.end = parse(value, 'yyyy-MM-dd', new Date());
  }
  @Prop()
  public task?: Task;
  public startMenu = false;
  public endMenu = false;
  public close() {
    this.$emit("close");
  }
  public submit() {
    this.$emit("submit");
  }
  public delete() {
    this.$store.commit('deleteTask', this.task!.id);
    this.$emit('close');
  }
}
</script>