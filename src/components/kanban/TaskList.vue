<template>
    <div class="tasklist">
        <h2>{{title}}</h2>
        <div class="card" v-for="task in tasks" :key="task.id">
            <h3>{{task.title}}</h3>
            {{task.start|dateLocalize}} ～ {{task.end|dateLocalize}}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task } from "@/types";
import { format } from 'date-fns'
@Component({
  filters: {
  dateLocalize(date: Date) {
    return format(date, "yyyy-MM-dd")
  }
  }
})
export default class TaskList extends Vue {
    @Prop()
    public title!: string;
    @Prop()
    public tasks!: Task[];
}
</script>

<style scoped>
div.tasklist {
    display: inline-block;
    width: 20rem;
    height: calc(100vh - 130px);
    border: 1px gray solid;
    overflow-y: auto;
}
</style>