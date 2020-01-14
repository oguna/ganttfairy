<template>
  <span
    :contenteditable="editable"
    v-text="text"
    @input="update"
    @focus="focus"
    @blur="blur"
    v-on:paste="handlePaste"
    ref="textfield"
  ></span>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
@Component
export default class EditableText extends Vue {
  @Prop()
  public value!: string;

  @Prop()
  public editable!: boolean;

  private text: string = "";
  private focusIn: boolean = false;

  @Emit()
  private input(str: string): void {
    /* */
  }

  @Watch("value")
  private valueChanged(n: string): void {
    if (this.focusIn) return;
    this.text = this.value;
  }

  private update(e: Event): void {
    const target: HTMLElement = e.target as HTMLElement;
    this.input(target.innerText);
  }

  private focus(): void {
    this.focusIn = true;
  }

  private blur(): void {
    this.focusIn = false;
  }

  private mounted() {
    this.text = this.value;
  }

  private handlePaste(event: ClipboardEvent) {
    const text = event.clipboardData!.getData("text/plain");
    const selection = window.getSelection();
    if (selection === null || !selection.rangeCount) {
      return false;
    }
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    this.text = (this.$refs.textfield as HTMLElement).innerText;
    this.input(this.text);
    event.preventDefault();
  }
}
</script>

<style scoped>
span {
display: inline-block;
width: auto;
height: auto;
}
</style>