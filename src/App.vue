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
        href="https://github.com"
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
}
</script>
