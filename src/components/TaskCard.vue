<template>
  <v-card>
    <v-card-title>#{{task.id||"new"}}</v-card-title>
    <v-card-text>
      <v-text-field v-model="task.title" label="Title"></v-text-field>
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
      <v-divider></v-divider>
      <v-label>Parent &amp; Children</v-label>
      <v-select
        v-model="task.parent"
        clearable
        :items="tasksOtherThanThisAndSiblingTasks"
        item-text="text"
        item-value="value"
        label="Parent">
      </v-select>
      <v-list dense>
        <v-subheader>Children</v-subheader>
        <v-list-item-group>
          <v-list-item v-for="child in children" :key="child.id">
            <v-list-item-content>
              <v-list-item-title>
                #{{child.id}}: {{child.title}}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-btn icon small @click="deleteChild(child)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn v-if="task.id!==null" text @click="this.delete" color="red" outlined>Delete</v-btn>
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
  public get tasksOtherThanThisAndSiblingTasks() {
    const siblings = this.$store.getters.getSiblingTasksById(this.task!.id);
    const siblingIds = siblings.map((task:Task) => task.id);
    return this.$store.state.tasks
    .filter((v:Task)=>v.id!==this.task!.id && !siblingIds.includes(v.id))
    .map((v:Task)=>{return{'text':`#${v.id} ${v.title}`, 'value': v.id}});
  }
  public get children() {
    return this.$store.getters.getChildrenTasksById(this.task!.id);
  }
  public deleteChild(task: Task) {
    task.parent = null;
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