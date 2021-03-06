<template>
  <v-card>
    <v-card-title>#{{task.id||"new"}}</v-card-title>
    <v-card-text>
      <v-text-field :value="task.title" @input="$emit('setTitle', $event)" label="Title"></v-text-field>
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
        :value="task.parent"
        @input="$emit('setParent', $event)"
        clearable
        :items="tasksOtherThanThisAndSiblingTasks"
        item-text="text"
        item-value="value"
        label="Parent">
      </v-select>
      <v-list dense>
        <v-subheader>{{childPluralization}}</v-subheader>
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
      <v-divider></v-divider>
      <v-label>Dependency</v-label>
      <v-list dense>
        <v-list-item-group>
          <v-list-item v-for="dependency in dependenciesToThis" :key="dependency.id">
            <v-list-item-content>
              <v-list-item-title>
                {{dependency.text}}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-btn icon small @click="deleteDependency(dependency.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-select
        v-model="dependencyType"
        :items="dependencyTypes"
        label="New dependency type">
      </v-select>
      <v-select
        v-model="dependencyTask"
        :items="tasksForNewDependency"
        item-text="text"
        item-value="value"
        label="New dependency from">
      </v-select>
      <v-btn :disabled="!dependencyTask" block @click="addNewDependency">New Dependency</v-btn>
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
import { Task, Dependency } from "@/types";
import {format, parse} from 'date-fns';
import { defineComponent, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    task: Object as PropType<Task>,
  },
  data() {
    return {
      dependencyType: 0 as number,
      dependencyTask: null as number|null,
      startMenu: false,
      endMenu: false,
    }
  },
  emits: ['setTitle', 'setParent'],
  computed: {
    dependencyTypes() {
      return [
        {text: 'FS: FinishToStart', value: 0},
        {text: 'SS: StartToStart', value: 1},
        {text: 'FF: FinishToFinish', value: 2},
        {text: 'SF: StartToFinish', value: 3},
      ]
    },
    tasks(): Task[] {
      return this.$store.state.tasks;
    },
    tasksForNewDependency(): any[] {
      return this.$store.state.tasks
      .filter((v: Task) => v.id !== this.task!.id)
      .map((v:Task) => {return {
        'text': `#${v.id}: ${v.title}`,
        'value': v.id
      }})
    },
    dependenciesToThis(): any[] {
      const types = ['FS', 'SS', 'FF', 'SF'];
      return this.$store.state.dependencies
      .filter((v:Dependency)=>v.to===this.task!.id)
      .map((v:Dependency) => {return {
        'text': `${types[v.type]} - # ${v.id}: ${this.$store.getters.getTaskById(v.id).title}`,
        'id': v.id,
      }});
    },
    startDateISOString: {
      get(): string {
        return format(this.task!.start, 'yyyy-MM-dd');
      },
      set(value: string) {
      this.task!.start = parse(value, 'yyyy-MM-dd', new Date());
      }
    },
    endDateISOString: {
      get():string {
        return format(this.task!.end, 'yyyy-MM-dd');
      },
      set(value: string) {
        this.task!.end = parse(value, 'yyyy-MM-dd', new Date());
      },
    },
    tasksOtherThanThisAndSiblingTasks(): any[] {
      const siblings = this.$store.getters.getSiblingTasksById(this.task!.id);
      const siblingIds = siblings.map((task:Task) => task.id);
      return this.$store.state.tasks
      .filter((v:Task)=>v.id!==this.task!.id && !siblingIds.includes(v.id))
      .map((v:Task)=>{return{'text':`#${v.id} ${v.title}`, 'value': v.id}});
    },
    children(): any[] {
      return this.$store.getters.getChildrenTasksById(this.task!.id);
    },
    childPluralization() {
      const num = this.children.length;
      if (num === 0) {
        return "No children"
      } else if (num === 1) {
        return "1 child"
      } else {
        return num + " children";
      }
    }
  },
  methods: {
  addNewDependency() {
    if (this.dependencyTask === undefined || this.dependencyTask === null) {
      return;
    }
    this.$store.commit('addDependency', {
      'from': this.dependencyTask,
      'to': this.task!.id,
      'type': this.dependencyType,
    });
    this.dependencyTask = null;
    this.dependencyType = 0;
  },
  deleteChild(task: Task) {
    task.parent = null;
  },
  close() {
    this.$emit("close");
  },
  submit() {
    this.$emit("submit");
  },
  delete() {
    this.$store.commit('deleteTask', this.task!.id);
    this.$emit('close');
  },
  deleteDependency(id: number) {
    this.$store.commit('deleteDependency', id)
  },
  }
})
</script>