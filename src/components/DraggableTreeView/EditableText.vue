<template>
  <div
    :contenteditable="editable"
    v-text="text"
    @input="update"
    @focus="focus"
    @blur="blur"
    v-on:paste="handlePaste"
    ref="textfield"
  ></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
  props: {
    v: String,
    editable: Boolean,
  },
  data() {
    return {
      text: "",
      focusIn: false,
    };
  },
  emits: ['update:v'],
  mounted(): void {
    this.text = this.v!;
  },
  methods: {
    input(str: string): void {
      this.$emit("update:v", str);
    },
    update(e: Event): void {
      const target: HTMLElement = e.target as HTMLElement;
      this.input(target.innerText);
    },
    focus(): void {
      this.focusIn = true;
    },
    blur(): void {
      this.focusIn = false;
    },
    handlePaste(event: ClipboardEvent): void {
      const text = event.clipboardData!.getData("text/plain");
      const selection = window.getSelection();
      if (selection === null || !selection.rangeCount) {
        return;
      }
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
      this.text = (this.$refs.textfield as HTMLElement).innerText;
      this.input(this.text);
      event.preventDefault();
    },
  },
  watch: {
    v(newValue: string, oldValue: string): void {
      if (this.focusIn) {
        return;
      }
      this.text = this.v!;
    },
  },
});
</script>

<style scoped>
div {
  display: inline-block;
  width: 100%;
}
</style>