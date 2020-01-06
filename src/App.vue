<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
      elevation=0
    >
      <v-spacer></v-spacer>
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
        - Gantt Fairy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        href="https://oguna.github.io/ganttfairy/"
        target="_blank"
        text
        icon
      >
        <v-icon>mdi-github-circle</v-icon>
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
    <div class="px-2">{{numOfTasks}} Tasks</div>
    <div class="px-2" v-ripple style="user-select: none">
      <v-icon>mdi-magnify</v-icon>
      100%
    </div>
    <v-spacer></v-spacer>
    <div>Gantt Fairy by oguna</div>
  </v-footer>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class App extends Vue{
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
}
</script>
