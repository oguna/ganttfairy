<template>
  <div class="ganttchart">
    <v-toolbar dense elevation="1">
      <v-toolbar-items>
        <v-icon>mdi-calendar</v-icon>
        <v-menu
          ref="startDateMenu"
          v-model="startDateMenu"
          :close-on-content-click="false"
          :return-value.sync="startDateISOString"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">{{startDateISOString}}</v-btn>
          </template>
          <v-date-picker v-model="startDateISOString" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="startDateMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.startDateMenu.save(startDateISOString)">OK</v-btn>
          </v-date-picker>
        </v-menu>
        <span class="my-auto">～</span>
        <v-menu
          ref="endDateMenu"
          v-model="endDateMenu"
          :close-on-content-click="false"
          :return-value.sync="endDateISOString"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">{{endDateISOString}}</v-btn>
          </template>
          <v-date-picker v-model="endDateISOString" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="endDateMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.endDateMenu.save(endDateISOString)">OK</v-btn>
          </v-date-picker>
        </v-menu>
        <v-btn text @click="adjustTimespan">
          <v-icon>mdi-arrow-expand-horizontal</v-icon>
        </v-btn>
        <v-divider vertical inset></v-divider>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" class="text-none">
              <v-icon>mdi-page-layout-header</v-icon>Header
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-title>Not Implemented</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" class="text-none">
              <v-icon>mdi-filter</v-icon>Filter
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-title>Not Implemented</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" class="text-none">
              <v-icon>mdi-format-color-fill</v-icon>Color
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-title>Not Implemented</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
            <v-btn text @click="openTaskDialog(null)" class="text-none">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-dialog v-model="importDialog" width="500">
          <template v-slot:activator="{on}">
            <v-btn text v-on="on" class="text-none">
              <v-icon>mdi-import</v-icon>Import
            </v-btn>
          </template>
          <import-card v-on:close="importDialog=false"></import-card>
        </v-dialog>
        <v-dialog v-model="exportDialog" width="500">
          <template v-slot:activator="{on}">
            <v-btn text v-on="on" class="text-none">
              <v-icon>mdi-export</v-icon>Export
            </v-btn>
          </template>
          <export-card v-on:close="exportDialog=false"></export-card>
        </v-dialog>
      </v-toolbar-items>
    </v-toolbar>
    <div class="gantt" :style="styles" style="white-space: nowrap;">
    <div class="left">
      <div class="left_header"></div>
      <draggable-tree-view
      style="overflow-x:hidden"
      v-on:open-dialog="openTaskDialog"
      :taskTree="taskTree"
      v-model="selectedTaskId"
      ></draggable-tree-view>
    </div>
    <div class="grip disable-select"
    @dragstart="dragstart"
    @dragend="dragend"
    draggable="true"
    ></div>
    <div class="right">
      <div class="right_header">
          <div class="month_header">
              <div class="date" v-for="(month,index) in sameMonthLength" :key="index"
              :style="'width:'+(month.length * dateWidth)+'px'">
                  {{format(dates[month.start], "yyyy-MM")}}
                </div>
          </div>
          <div class="date_header">
            <div class="date" v-for="date in dates" :key="date.getTime()">{{date.getDate()}}</div>
          </div>
          <div class="week_header">
            <div class="date" v-for="date in dates" :key="date.getTime()">{{"SMTWTFS"[date.getDay()]}}</div>
          </div>
      </div>
      <gantt-chart
      :start="startDate"
      :end="endDate"
      :tasks="flatTreeTasks"
      :dates="dates"
      :dateWidth="dateWidth"
      v-model="selectedTaskId"
      ></gantt-chart>
    </div>
    </div>
    <v-dialog v-model="taskDialog" max-width="290">
      <task-card
        :task="edittingTask"
        v-on:close="closeTaskDialog"
        v-on:submit="saveTaskDialog"
        @setParent="edittingTask.parent = $event"
        @setTitle="edittingTask.title = $event"
      ></task-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Task } from "@/types";
import {
  format,
  addDays,
  isSaturday,
  isSunday,
  isToday,
  subDays,
  parseISO,
  isSameMonth,
  parse
} from "date-fns";
import ja from "date-fns/locale/ja";
import TaskCard from "@/components/TaskCard.vue";
import ExportCard from "@/components/ExportCard.vue";
import ImportCard from "@/components/ImportCard.vue";
import GanttChart from "@/components/GanttChart.vue";
import DraggableTreeView from "@/components/DraggableTreeView/index.vue";
import { defineComponent, PropType } from "@vue/composition-api";
import { TaskTreeNode } from "../types";

export default defineComponent({
  components: {
    TaskCard,
    ExportCard,
    ImportCard,
    GanttChart,
    DraggableTreeView,
  },
  props: {
    taskId: String,
  },
  data() {
    return {
      startDateMenu: false,
      endDateMenu: false,
      startDate: new Date(2019, 10, 1),
      endDate: new Date(2020, 1, 10),
      format: format,
      isToday: isToday,
      taskDialog: false,
      edittingTask: null as Task | null,
      exportDialog: false,
      importDialog: false,
      selectedTaskId: 0,
      gripOffset: 200,
    };
  },
  computed: {
    startDateISOString: {
      get(): string {
        return format(this.startDate, "yyyy-MM-dd");
      },
      set(value: string) {
        this.startDate = parse(value, "yyyy-MM-dd", new Date());
      },
    },
    endDateISOString: {
      get(): string {
        return format(this.endDate, "yyyy-MM-dd");
      },
      set(value: string) {
        this.endDate = parse(value, "yyyy-MM-dd", new Date());
      },
    },
    taskTree(): TaskTreeNode[] {
      return this.$store.state.taskTreeNodes;
    },
    items(): Task[] {
      return this.$store.state.tasks;
    },
    flatTreeTasks(): Task[] {
      return this.$store.getters.getFlatTreeTasks;
    },
    dates(): Date[] {
      const dates = [];
      let date = new Date(this.startDate);
      const end = new Date(this.endDate);
      while (date <= end) {
        dates.push(date);
        date = addDays(date, 1);
      }
      return dates;
    },
    sameMonthLength(): { start: number; length: number }[] {
      // [1,1,1,1,2,2,3,3,3] => [4,2,3]
      const dates = this.dates;
      let month = this.dates[0];
      let result = [{ start: 0, length: 1 }];
      for (let i = 1; i < dates.length; i++) {
        if (isSameMonth(month, dates[i])) {
          result[result.length - 1].length++;
        } else {
          month = dates[i];
          result.push({ start: i, length: 1 });
        }
      }
      return result;
    },
    dateWidth(): number {
      return Math.round((this.$store.state.magnify * 24) / 100);
    },
    tasks(): Task[] {
      return this.$store.state.tasks;
    },
    styles(): any {
      return {
        "--gripOffset": `${this.gripOffset}px`,
        "--numOfTasks": this.tasks.length,
        "--dateWidth": this.dateWidth + "px",
        "--ganttWidth": this.dateWidth * this.dates.length + "px",
        "--screenWidth":
          this.dateWidth * this.dates.length + this.gripOffset! + "px",
      };
    },
  },
  methods: {
    getWeekOfDays(date: Date) {
      return format(date, "EEEEEE", { locale: ja });
    },
    isHoriday(date: Date) {
      return isSunday(date) || isSaturday(date);
    },
    isActiveTask(start: Date, end: Date, day: Date) {
      return start <= day && day <= end;
    },
    openTaskDialog(task: Task | null) {
      if (task === null) {
        this.edittingTask = {
          id: 0,
          parent: null,
          title: "",
          start: new Date(),
          end: new Date(),
          status: null,
        };
      } else {
        this.edittingTask = Object.assign({}, task);
      }
      this.taskDialog = true;
    },
    closeTaskDialog() {
      this.taskDialog = false;
    },
    saveTaskDialog() {
      if (this.edittingTask!.id === 0) {
        this.$store.commit("addTask", this.edittingTask);
      } else {
        this.$store.dispatch("updateTaskWithTree", this.edittingTask);
        //this.$store.commit("updateTask", this.edittingTask);
      }
      this.closeTaskDialog();
    },
    deleteTask(index: number) {
      this.$store.commit("deleteTask", index);
    },
    adjustTimespan() {
      const firstDate = this.items
        .map((v) => v.start)
        .reduce((a, b) => (a < b ? a : b));
      const lastDate = this.items
        .map((v) => v.end)
        .reduce((a, b) => (a > b ? a : b));
      this.startDate = subDays(firstDate, 1);
      this.endDate = addDays(lastDate, 1);
    },
    dragstart(e: DragEvent) {
      e.dataTransfer!.dropEffect = "none";
    },
    dragend(e: DragEvent) {
      this.gripOffset = e.clientX;
    },
  },
});
</script>

<style scoped>
div.home {
  width: var(--gripOffset)
}
.container {
  margin: 0;
  padding: 0;
}
.gantt {
  width: 100%;
  height: calc(100vh - 96px - 28px);
  overflow-x: scroll;
  overflow-y: scroll;
}
.today {
  background-color: aqua;
}
div.left {
  display: inline-block;
  background-color: white;
  width: var(--gripOffset);
  white-space: nowrap;
  vertical-align: top;
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
}
div.left_header {
  height: 4.5rem;
  background-color: gainsboro;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  z-index: 2;
}
div.right {
  display: inline-block;
  background-color: white;
  white-space: nowrap;
  vertical-align: top;
}
div.right_header {
  height: 4.5rem;
  background-color: gainsboro;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: var(--ganttWidth);
}
div.grip {
  display: inline-block;
  background-color: grey;
  width: 0.5rem;
  white-space: nowrap;
  vertical-align: top;
  height: calc(1.5rem * var(--numOfTasks) + 4.5rem);
  cursor: w-resize;
  position: -webkit-sticky;
  position: sticky;
  left: var(--gripOffset);
  z-index: 1;
}
div.date {
  display: inline-block;
  width: var(--dateWidth);
  height: 1.5rem;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
  font-size: 1rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
}
div.month_header {
    border-top: 1px solid gray;
    height: 1.5rem;
}
div.date_header {
    height: 1.5rem;
}
div.week_header {
    height: 1.5rem;
}
.disable-select {
        -ms-user-select: none;
        -webkit-user-select: none;
        user-select: none;
      }
</style>