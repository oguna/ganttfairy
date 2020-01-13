<template>
  <div>
    <draggable-tree-view-node
      v-for="node in taskTree"
      :key="node.id"
      v-bind:value="value"
      v-on:input="input"
      v-on:open-dialog="openDialog"
      :node="node"
      :indent="0"
    ></draggable-tree-view-node>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { Task, Dependency, TaskTreeNode } from "@/types";
import DraggableTreeViewNode from "./Node.vue";
@Component({
  components: {
    DraggableTreeViewNode
  }
})
export default class DraggableList extends Vue {
  public selectedTaskId = 0;
  @Prop()
  public taskTree!: TaskTreeNode[];
  @Emit()
  public openDialog(task: Task) {}
  @Prop()
  public value!: number;
  @Emit()
  public input(value: number) {}
}
</script>

<style scoped>
</style>