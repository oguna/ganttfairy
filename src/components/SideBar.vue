<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> Application </v-list-item-title>
        <v-list-item-subtitle> subtext </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" :to="item.link" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense nav>
      <v-subheader>Projects</v-subheader>
      <v-list-item v-for="project in projects" :key="project" link>
        <v-list-item-content>
          <v-list-item-title>{{ project }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense nav>
      <v-subheader>Administration</v-subheader>
      <v-list-item link to="/users">
        <v-list-item-content>
          <v-list-item-title> Users </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  computed: {
    drawer: {
      set(value: boolean) {
        this.$emit("input", value);
      },
      get(): boolean {
        return this.value;
      },
    },
    items() {
      return [
        {
          icon: "mdi-home",
          title: "Overview",
          link: "/",
        },
        {
          icon: "mdi-table",
          title: "Table",
          link: "/table",
        },
        {
          icon: "mdi-bulletin-board",
          title: "Kanban",
          link: "/kanban",
        },
        {
          icon: "mdi-chart-timeline",
          title: "Ganttchart",
          link: "/ganttchart",
        },
        {
          icon: "mdi-calendar",
          title: "Calendar",
          link: "/calendar",
        },
      ];
    },
    projects() {
      return ["Unnamed"];
    },
  },
  props: {
    value: Boolean,
  },
  emits: {
    input: (v: boolean) => true,
  },
});
</script>