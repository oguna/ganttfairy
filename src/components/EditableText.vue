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
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: String,
    editable: Boolean,
  },
  data() {
    return {
      text: "",
      focusIn: false,
    };
  },
  emits: ['update:modelValue'],
  mounted(): void {
    this.text = this.modelValue!;
  },
  methods: {
    input(str: string): void {
      this.$emit("update:modelValue", str);
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
      this.text = this.modelValue!;
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