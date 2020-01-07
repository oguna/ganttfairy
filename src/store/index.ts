import Vue from 'vue'
import Vuex from 'vuex'
import {Task, RootState} from '@/types';
import { parseVariousDateString } from '@/utils';
import {addDays, format} from 'date-fns';

Vue.use(Vuex)

const tasks: Task[] = [
  {
    group: '見積もり',
    title: '見積もり',
    start: new Date('2019-11-11T00:00:00'),
    end: new Date('2019-11-20T00:00:00'),
  },
  {
    group: '見積もり',
    title: '見積もりレビュー',
    start: new Date('2019-11-21T00:00:00'),
    end: new Date('2019-11-22T00:00:00'),
  },
  {
    group: '設計',
    title: '設計',
    start: new Date('2019-11-30T00:00:00'),
    end: new Date('2019-12-10T00:00:00'),
  },
  {
    group: '設計',
    title: '設計レビュー',
    start: new Date('2019-12-11T00:00:00'),
    end: new Date('2019-12-12T00:00:00'),
  },
];
for (let i = 1; i < 50; i++) {
  tasks.push({
    group: '実装',
    title: 'モジュール'+i,
    start: addDays(new Date('2019-12-20T00:00:00'), i * 2),
    end: addDays(new Date('2019-12-24T00:00:00'), i*3),
  });
}

export default new Vuex.Store({
  state: {
    tasks,
    title: 'Unnamed',
    magnify: 100,
  } as RootState,
  mutations: {
    setTitle(state, title) {
      state.title = title;
    },
    updateTask(state, payload: {task: Task, index: number}) {
      state.tasks.splice(payload.index-1, 1, payload.task);
    },
    addTask(state, task: Task) {
      state.tasks.push(Object.assign({}, task));
    },
    setTasks(state, tasks: Task[]) {
      state.tasks = tasks;
    },
    deleteTask(state, index: number) {
      state.tasks.splice(index-1, 1);
    },
    setMagnify(state, zoom: number) {
      state.magnify = zoom;
    }
  },
  actions: {
    async exportCSV({state}, payload: {seprator: string}) {
      const header = ['#','title','start','end'].join(payload.seprator);
      const rows = [header];
      const tasks = state.tasks;
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const start = format(task.start, 'yyyy-MM-dd');
        const end = format(task.end, 'yyyy-MM-dd');
        rows.push([(i+1).toString(), task.title, start, end].join(payload.seprator))
      }
      return rows.join('\n');
    },
    async importCSV({commit, state}, csv: string) {
      const lines = csv.split('\n');
      if (lines.length <= 1) {
        throw new Error("Not enough lines. Need 2+ lines.");
      }
      const tabSeparator = lines[0].includes('\t');
      const firstLineColumns = lines[0].split(tabSeparator ?'\t' : ',');
      if (firstLineColumns.length <= 3) {
        throw new Error("Not enough columns. Need 4+ columns.");
      }
      let firstLineIsHeader = true;
      for (const c of firstLineColumns) {
        if (parseVariousDateString(c) !== null) {
          firstLineIsHeader = true;
          break;
        }
      }
      const rows = firstLineIsHeader ? lines.slice(1) : lines;
      const tasks = new Array<Task>();
      for (const row of rows) {
        if (row === "") {
          continue;
        }
        const columns = row.split(tabSeparator ?'\t' : ',').map(v => v.trim());
        const group = columns[0];
        const title = columns[1];
        const start = parseVariousDateString(columns[2])!;
        const end = parseVariousDateString(columns[3])!;
        const task = {
          group,
          title,
          start,
          end
        } as Task;
        tasks.push(task);
      }
      commit('setTasks', tasks);
    },
  },
  modules: {
  }
})
