<template>
  <v-card>
    <v-card-title>#{{index||"new"}}</v-card-title>
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
            v-model="task.start"
            label="Start"
            prepend-icon="mdi-calendar"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="task.start" no-title scrollable>
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
            v-model="task.end"
            label="End"
            prepend-icon="mdi-calendar"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="task.end" no-title scrollable>
        </v-date-picker>
      </v-menu>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="close">Cancel</v-btn>
      <v-btn text color="primary" @click="submit">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
@Component
export default class TaskCard extends Vue {
  @Prop()
  public index?: number;
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
}
</script>