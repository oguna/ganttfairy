<template>
  <v-card>
    <v-card-title>Export</v-card-title>
    <v-card-text>
        <v-select
        v-model="separator"
        label="Column Separator"
        :items="items"
        >
        </v-select>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="close">Cancel</v-btn>
      <v-btn text color="primary" @click="submit">Export</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  data() {
    return {
      separator: ",",
    };
  },
  computed: {
    items(): any {
      return [
        { text: "Comma", value: "," },
        { text: "Tab", value: "\t" },
      ];
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submit() {
      this.$store
        .dispatch("exportCSV", {
          separator: this.separator,
        })
        .then((v) => {
          let bom = new Uint8Array([0xef, 0xbb, 0xbf]);
          const blob = new Blob([bom, v], { type: "text/csv" });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = this.$store.state.title + ".csv";
          link.click();
        })
        .then((v) => {
          this.$emit("close");
        });
    },
  },
});
</script>