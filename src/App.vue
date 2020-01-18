<template>
  <v-app>
    <side-bar
    v-model="drawer">
    </side-bar>
    <v-app-bar
      app
      color="primary"
      dark
      dense
      elevation=0
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title> 
      {{title}}
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-btn text icon small v-on="on">
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-text-field v-model="title"></v-text-field>
          </v-card-text>
        </v-card>
      </v-menu>
        </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn-toggle group tile borderless dense>
      <v-btn text to="/">
        <v-icon>mdi-home</v-icon>
        Overview</v-btn>
      <v-btn text to="/table">
        <v-icon>mdi-table</v-icon>
        Table</v-btn>
      <v-btn text to="/kanban">
        <v-icon>mdi-bulletin-board</v-icon>
        Kanban</v-btn>
      <v-btn text to="/ganttchart">
        <v-icon>mdi-chart-timeline</v-icon>
        Ganttchart</v-btn>
      <v-btn text to="/calendar">
        <v-icon>mdi-calendar</v-icon>
        Calendar</v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <v-btn text icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  <v-footer
    app
      color="primary"
      dark
      dense
      class="py-0"
  >
    <div class="px-2 body-2">{{numOfTasks}} Tasks</div>
    <v-menu offset-y top>
      <template v-slot:activator="{on}">
        <v-btn small text tile class="px-2" dark v-on="on">
          <v-icon small>mdi-magnify</v-icon>
          {{magnify}}%
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item-group>
        <v-list-item @click="setMagnify(100)">
          <v-list-item-title>100%</v-list-item-title>
        </v-list-item>
        <v-list-item @click="setMagnify(50)">
          <v-list-item-title>50%</v-list-item-title>
        </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
        <v-btn small text tile class="px-2 text-none" dark
        href="https://oguna.github.io/ganttfairy/"
        target="_blank"
        >
          <v-icon class="mr-1" small>mdi-github-circle</v-icon>
          Gantt Fairy by oguna
        </v-btn>
  </v-footer>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import SideBar from '@/components/SideBar.vue';

@Component({
  components: {
    SideBar
  }
})
export default class App extends Vue {
  public drawer = false;
  public menu = false;
  public get title() {
    return this.$store.state.title;
  }
  public set title(value: string) {
    this.$store.commit('setTitle', value);
  }
  public get numOfTasks():number {
    return this.$store.state.tasks.length;
  }
  public get magnify(): number {
    return this.$store.state.magnify;
  }
  public setMagnify(value: number) {
    this.$store.commit('setMagnify', value);
  }
}
</script>
