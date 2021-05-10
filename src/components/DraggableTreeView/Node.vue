<template>
  <div>
    <div class="this" @click="input(task.id)" :class="{active: (task.id === value)}">
      <v-icon small class="grip">mdi-drag-vertical</v-icon>
      <span :style="`padding-left:${indent*12}px`">
        <v-btn v-if="children.length>0" @click="$emit('openClose')" text icon x-small>
          <v-icon v-if="node.open">mdi-menu-down</v-icon>
          <v-icon v-else>mdi-menu-right</v-icon>
        </v-btn>
        <span v-else style="padding-left:24px" />
        <span @click="openDialog(task)" style="border: #dddddd solid 1px; cursor: pointer">#{{this.task.id}}</span>
        <editable-text class="mx-1" :v="task.title" @update:v="task.title=$event" :editable="task.id === value"></editable-text>
        <v-chip v-if="task.parent" x-small outlined>Parent:#{{task.parent}}</v-chip>
        <v-chip
          v-for="dependency of dependencies(task.id)"
          :key="dependency.id"
          x-small
          outlined
        >{{dependency.text}}</v-chip>
      </span>
    </div>
    <div class="children" v-if="node.open && node.children.length > 0">
      <draggable-tree-view-node
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :indent="indent + 1"
        v-bind:value="value"
        v-on:input="input"
        v-on:open-dialog="openDialog"
        @openClose="child.open=!child.open"
      ></draggable-tree-view-node>
    </div>
  </div>
</template>

<script lang="ts">
import { Task, Dependency, TaskTreeNode } from "@/types";
import EditableText from "./EditableText.vue";
import { defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
  name: 'draggable-tree-view-node',
  props: {
    node: Object as PropType<TaskTreeNode>,
    indent: Number,
    value: Number,
  },
  data() {
    return {
      dragging: false,
    };
  },
  emitds: ['open-dialog', 'input', 'openClose'],
  computed: {
    task(): Task {
      return this.$store.getters.getTaskById(this.node!.id);
    },
    children(): Task[] {
      return this.$store.getters.getChildrenTasksById(this.node!.id);
    },
  },
  methods: {
    openDialog(task: Task) {
      this.$emit("open-dialog", task);
    },
    input(value: number) {
      this.$emit("input", value);
    },
    dependencies(id: number) {
      const types = ["FS", "SS", "FF", "SF"];
      return this.$store.state.dependencies
        .filter((v: Dependency) => v.to === id)
        .map((v: Dependency) => {
          return {
            text: `${types[v.type]}#${v.id}`,
            value: v.id,
          };
        });
    },
  },
  components: {
    "editable-text": EditableText,
  },
});
/*
@Component({
  name: 'draggable-tree-view-node',
  components: {
    EditableText
  }
})
export default class DraggableTreeViewNode extends Vue {
  public dragging = false;
  public get task() {
    return this.$store.getters.getTaskById(this.node.id);
  }
  @Prop()
  public node!: TaskTreeNode;
  @Prop()
  public indent!: number;
  public get children(): Task[] {
    return this.$store.getters.getChildrenTasksById(this.node.id);
  }
  @Emit()
  public openDialog(task: Task) {}
  @Prop()
  public value!: number;
  @Emit()
  public input(value: number){}
  public dependencies(id: number) {
    const types = ["FS", "SS", "FF", "SF"];
    return this.$store.state.dependencies
      .filter((v: Dependency) => v.to === id)
      .map((v: Dependency) => {
        return {
          text: `${types[v.type]}#${v.id}`,
          value: v.id
        };
      });
  }
}
*/
</script>

<style scoped>
div.active {
  background-color: whitesmoke;
}
</style>