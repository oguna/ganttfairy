<template>
  <v-card>
    <v-card-title>Import</v-card-title>
    <v-card-text>
      <v-textarea outlined v-model="csv" label="CSV"></v-textarea>
      <span class="red">{{message}}</span>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="close">Cancel</v-btn>
      <v-btn text color="primary" @click="submit">Import</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
@Component
export default class ImportCard extends Vue {
  public csv = "";
  public message = "";
  public separator = ",";
  public close() {
    this.$emit("close");
  }
  public submit() {
    this.$store.dispatch('importCSV', this.csv)
    .then((v) => {
      this.csv = "";
      this.message = "";
      this.$emit("close");
    })
    .catch(error => {
      this.message = error;
    }) ;
  }
}
</script>