<template>
  <div class="home">
    <v-toolbar dense elevation="1">
      <v-toolbar-items>
        <v-icon>mdi-calendar</v-icon>
        <v-menu
          ref="startDateMenu"
          v-model="startDateMenu"
          :close-on-content-click="false"
          :return-value.sync="startDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">{{startDate}}</v-btn>
          </template>
          <v-date-picker v-model="startDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="startDateMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.startDateMenu.save(startDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
        <span class="my-auto">～</span>
        <v-menu
          ref="endDateMenu"
          v-model="endDateMenu"
          :close-on-content-click="false"
          :return-value.sync="endDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">{{endDate}}</v-btn>
          </template>
          <v-date-picker v-model="endDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="endDateMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.endDateMenu.save(endDate)">OK</v-btn>
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
              <v-list-item @click="hideDayOfWeek = !hideDayOfWeek">
                <v-list-item-action>
                  <v-checkbox v-model="hideDayOfWeek" @click.prevent></v-checkbox>
                </v-list-item-action>
                <v-list-item-title>Hide Day Of Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="hideWeekend = !hideWeekend">
                <v-list-item-action>
                  <v-checkbox v-model="hideWeekend" @click.prevent></v-checkbox>
                </v-list-item-action>
                <v-list-item-title>Hide Weekend</v-list-item-title>
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
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" class="text-none">
              <v-icon>mdi-select-group</v-icon>Group
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item @click="grouping = !grouping">
                <v-list-item-action>
                  <v-checkbox v-model="grouping" @click.prevent></v-checkbox>
                </v-list-item-action>
                <v-list-item-title>Grouping</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
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
    <div class="gantt">
      <table class="sticky_table">
        <thead>
          <tr>
            <th :rowspan="hideDayOfWeek?2:3" class="th-first-child">#</th>
            <th :rowspan="hideDayOfWeek?2:3" v-if="!grouping">Group</th>
            <th :rowspan="hideDayOfWeek?2:3">Title</th>
            <th :rowspan="hideDayOfWeek?2:3">Start</th>
            <th :rowspan="hideDayOfWeek?2:3">End</th>
            <th
              v-for="({start, length},index) in sameMonthLength"
              :key="index"
              :colspan="length"
            >{{format(dates[start], "y-M")}}</th>
          </tr>
          <tr>
            <th v-for="date in dates" :key="date.valueOf()">{{format(date, "d")}}</th>
          </tr>
          <tr v-if="!hideDayOfWeek">
            <th
              v-for="date in dates"
              :class="{holiday: isHoriday(date)}"
              :key="date.valueOf()"
            >{{getWeekOfDays(date)}}</th>
          </tr>
        </thead>
        <tbody v-if="!grouping">
          <tr v-for="(item, index) in items" :key="item.title">
            <th nowrap class="th-first-child">
              {{index+1}}
              <v-btn text icon x-small @click.stop="openTaskDialog(item, index+1)">
                <v-icon>mdi-arrow-expand</v-icon>
              </v-btn>
              <v-btn text icon x-small @click.stop="deleteTask(index+1)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </th>
            <td nowrap>{{item.group}}</td>
            <td nowrap>{{item.title}}</td>
            <td nowrap>{{item.start}}</td>
            <td nowrap>{{item.end}}</td>
            <td v-for="date in dates" :key="date.valueOf()" :class="{today: isToday(date)}">
              <div
                :class="{active_task: isActiveTask(item.start, item.end, date)}"
                class="expand_to_parent"
              ></div>
            </td>
          </tr>
          <tr>
            <td>
              <v-btn text tile small block @click.stop="openTaskDialog(null, null)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <template v-for="group in groups">
            <tr :key="group.name">
              <th>
                <v-btn text tile small block @click="foldingGroups.push(group.name)" v-if="!foldingGroups.includes(group.name)">
                  <v-icon>mdi-unfold-more-horizontal</v-icon>
                </v-btn>
                <v-btn text tile small block @click="foldingGroups = foldingGroups.filter(v=>v!==group.name)" v-if="foldingGroups.includes(group.name)">
                  <v-icon>mdi-unfold-less-horizontal</v-icon>
                </v-btn>
              </th>
              <td colspan="3">{{group.name}}</td>
            </tr>
            <template v-if="!foldingGroups.includes(group.name)">
            <tr v-for="itemIndex in group.itemIndecies" :key="itemIndex">
              <th nowrap class="th-first-child">
                {{itemIndex}}
                <v-btn text icon x-small @click.stop="openTaskDialog(items[itemIndex-1], itemIndex)">
                  <v-icon>mdi-arrow-expand</v-icon>
                </v-btn>
                <v-btn text icon x-small @click.stop="deleteTask(items[itemIndex-1])">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </th>
              <td nowrap class="pl-3">{{items[itemIndex-1].title}}</td>
              <td nowrap>{{items[itemIndex-1].start}}</td>
              <td nowrap>{{items[itemIndex-1].end}}</td>
              <td v-for="date in dates" :key="date.valueOf()" :class="{today: isToday(date)}">
                <div
                  :class="{active_task: isActiveTask(items[itemIndex-1].start, items[itemIndex-1].end, date)}"
                  class="expand_to_parent"
                ></div>
              </td>
            </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <v-dialog v-model="taskDialog" max-width="290">
      <task-card
        :task="edittingTask"
        :index="edittingTaskIndex"
        v-on:close="closeTaskDialog"
        v-on:submit="saveTaskDialog"
      ></task-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Task, TaskGroup } from "@/types";
import {
  format,
  addDays,
  isSaturday,
  isSunday,
  isToday,
  subDays,
  parseISO,
  isSameMonth
} from "date-fns";
import ja from "date-fns/locale/ja";
import TaskCard from "@/components/TaskCard.vue";
import ExportCard from "@/components/ExportCard.vue";
import ImportCard from "@/components/ImportCard.vue";
@Component({
  components: {
    TaskCard,
    ExportCard,
    ImportCard
  }
})
export default class Home extends Vue {
  public startDateMenu = false;
  public endDateMenu = false;
  public startDate = "2019-11-01";
  public endDate = "2020-01-10";
  public hideDayOfWeek = false;
  public hideWeekend = false;
  public format = format;
  public isToday = isToday;
  public taskDialog = false;
  public edittingTask: Task | null = null;
  public edittingTaskIndex: number | null = null;
  public exportDialog = false;
  public importDialog = false;
  public grouping = true;
  public get items(): Task[] {
    return this.$store.state.tasks;
  }
  public get dates(): Date[] {
    const startDay = new Date(2019, 10, 1);
    const dates = [];
    let date = new Date(this.startDate);
    const end = new Date(this.endDate);
    while (date <= end) {
      if (this.hideWeekend) {
        if (!this.isHoriday(date)) {
          dates.push(date);
        }
      } else {
        dates.push(date);
      }
      date = addDays(date, 1);
    }
    return dates;
  }
  public get sameMonthLength(): { start: number; length: number }[] {
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
  }
  public getWeekOfDays(date: Date) {
    return format(date, "EEEEEE", { locale: ja });
  }
  public isHoriday(date: Date) {
    return isSunday(date) || isSaturday(date);
  }
  public isActiveTask(start: string, end: string, day: Date) {
    const today = format(day, "yyyy-MM-dd");
    return start <= today && today <= end;
  }
  public openTaskDialog(task: Task, index: number | null) {
    if (task === null) {
      this.edittingTask = {
        group: "",
        title: "",
        start: new Date().toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10)
      };
    } else {
      this.edittingTask = Object.assign({}, task);
    }
    this.edittingTaskIndex = index;
    this.taskDialog = true;
  }
  public closeTaskDialog() {
    this.taskDialog = false;
  }
  public saveTaskDialog() {
    if (this.edittingTaskIndex === null) {
      this.$store.commit("addTask", this.edittingTask);
    } else {
      this.$store.commit("updateTask", {
        index: this.edittingTaskIndex,
        task: this.edittingTask
      });
    }
    this.closeTaskDialog();
  }
  public deleteTask(index: number) {
    this.$store.commit("deleteTask", index);
  }
  public adjustTimespan() {
    const firstDate = this.items
      .map(v => v.start)
      .reduce((a, b) => (a < b ? a : b));
    const lastDate = this.items
      .map(v => v.end)
      .reduce((a, b) => (a > b ? a : b));
    this.startDate = subDays(parseISO(firstDate), 0)
      .toISOString()
      .substr(0, 10);
    this.endDate = addDays(parseISO(lastDate), 2)
      .toISOString()
      .substr(0, 10);
  }
  public get groups(): TaskGroup[] {
    const groups:TaskGroup[] = [];
    for (let index = 0; index < this.items.length; index++) {
      const task = this.items[index];
      const group = groups.find((v:TaskGroup) => v.name === task.group);
      if (group === undefined) {
        groups.push({
          name: task.group,
          itemIndecies: [index+1],
        });
      } else {
        group.itemIndecies.push(index+1);
      }
    }
    return groups;
  }
  public foldingGroups: string[] = [];
}
</script>

<style scoped>
td {
  border: solid 1px gray;
  padding: 0;
  margin: 0;
}
th {
  border: solid 1px gray;
  padding: 0;
  margin: 0;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
.sticky_table thead th {
  position: -webkit-sticky;
  position: sticky;
  z-index: 0;
  white-space: nowrap;
}
.sticky_table .th-first-child {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 0;
  background-color: white;
}
.sticky_table thead .th-first-child {
  z-index: 1;
}
.sticky_table tbody tr:nth-child(even) {
  background-color: lightcyan;
}
.sticky_table tbody th:nth-child(even) {
  background-color: lightcyan;
}
.sticky_table thead th {
  background-color: white;
}
.sticky_table thead th {
  background-color: ghostwhite;
}
.sticky_table thead tr:nth-child(1) th {
  top: 0;
}
.sticky_table thead tr:nth-child(2) th {
  top: 1.5rem;
}
.sticky_table thead tr:nth-child(3) th {
  top: 3rem;
}
.sticky_table .holiday {
  background-color: pink;
}
.container {
  margin: 0;
  padding: 0;
}
.gantt {
  width: 100%;
  height: calc(100vh - 96px);
  overflow-x: scroll;
  overflow-y: scroll;
}
.active_task {
  background-color: red;
}
.expand_to_parent {
  height: 1em;
  width: 1.2em;
}
.today {
  background-color: aqua;
}
</style>