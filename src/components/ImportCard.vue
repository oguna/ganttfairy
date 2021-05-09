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
import { Task } from "@/types";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  data() {
    return {
      csv: "",
      message: "",
      separator: ",",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submit() {
      this.$store
        .dispatch("importCSV", this.csv)
        .then((v) => {
          this.csv = "";
          this.message = "";
          this.$emit("close");
        })
        .catch((error) => {
          this.message = error;
        });
    },
  },
});
</script>