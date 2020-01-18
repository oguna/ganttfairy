<template>
    <div class="boardTask">
        <task-list :tasks="[]" title="TODO"/>
        <task-list :tasks="tasks" title="WIP"/>
        <task-list :tasks="[]" title="DONE"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import TaskList from '@/components/kanban/TaskList.vue'
@Component({
    components: {
        TaskList
    }
})
export default class BoardTask extends Vue {
    @Prop()
    public tasks!: Task[];
}
</script>