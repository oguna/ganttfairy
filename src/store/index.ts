import Vue from 'vue'
import Vuex, { mapActions } from 'vuex'
import {Task, RootState} from '@/types';
import { parseVariousDateString } from '@/utils';
import {addDays, format} from 'date-fns';

Vue.use(Vuex)

const tasks: Task[] = [
  {
    id: 1,
    parent: null,
    title: '見積もり',
    start: new Date('2019-11-11T00:00:00'),
    end: new Date('2019-11-20T00:00:00'),
  },
  {
    id: 2,
    parent: 1,
    title: '見積もりレビュー',
    start: new Date('2019-11-21T00:00:00'),
    end: new Date('2019-11-22T00:00:00'),
  },
  {
    id: 3,
    parent: null,
    title: '設計',
    start: new Date('2019-11-30T00:00:00'),
    end: new Date('2019-12-10T00:00:00'),
  },
  {
    id: 4,
    parent: 3,
    title: '設計レビュー',
    start: new Date('2019-12-11T00:00:00'),
    end: new Date('2019-12-12T00:00:00'),
  },
];
for (let i = 1; i < 50; i++) {
  tasks.push({
    id: 4+i,
    parent: null,
    title: 'モジュール'+i,
    start: addDays(new Date('2019-12-20T00:00:00'), i * 2),
    end: addDays(new Date('2019-12-24T00:00:00'), i*3),
  });
}

export default new Vuex.Store({
  state: {
    tasks,
    nextTaskId: 54,
    title: 'Unnamed',
    magnify: 100,
  } as RootState,
  getters: {
    getTaskById: (state) => (id: number) => {
      return state.tasks.find(task => task.id === id);
    },
    getChildrenTasksById: (state) => (id: number) => {
      return state.tasks.filter(task => task.parent === id);
    },
    getAncestorTasksById: (state, getters) => (id: number) => {
      let task = getters.getTaskById(id);
      const result = new Array<number>();
      while (task.parent) {
        result.push(task.parent);
      }
      return result;
    },
    getSiblingTasksById: (state, getters) => (id: number) => {
      const children = getters.getChildrenTasksById(id);
      const others = children.flatMap((task: Task) => getters.getChildrenTasksById(id));
      return children.concat(others);
    },
    getFastDateLastDateOfTasks: (state, getters) => (id: number) => {
      const siblingTask = getters.getSiblingTasksById(id).map((id: number) => getters.getTaskById(id));
      if (siblingTask.length === 0) {
        return null;
      }
      let fast = siblingTask[0].start;
      let last = siblingTask[0].end;
      for (let i = 1; i < siblingTask.length; i++) {
        if (siblingTask[i].start < fast) {
          fast = siblingTask[i].start;
        }
        if (last < siblingTask[i].end) {
          last = siblingTask[i].end;
        }
      }
      return {fast, last};
    },
  },
  mutations: {
    setTitle(state, title) {
      state.title = title;
    },
    updateTask(state, task: Task) {
      const index = state.tasks.findIndex(v=>v.id===task.id);
      if (index === -1) {
        throw new RangeError();
      }
      state.tasks.splice(index, 1, task);
    },
    addTask(state, task: Task) {
      task.id = state.nextTaskId++;
      state.tasks.push(Object.assign({}, task));
    },
    setTasks(state, tasks: Task[]) {
      state.tasks = tasks;
    },
    deleteTask(state, id: number) {
      const index = state.tasks.findIndex(v=>v.id===id);
      if (index === -1) {
        throw new RangeError();
      }
      state.tasks.splice(index, 1);
      const children = state.tasks.filter(task => task.parent === id);
      for (let child of children) {
        child.parent = null;
      }
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
        rows.push([task.id, task.title, start, end].join(payload.seprator))
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
        const id = Number.parseInt(columns[0]);
        const title = columns[1];
        const start = parseVariousDateString(columns[2])!;
        const end = parseVariousDateString(columns[3])!;
        const task = {
          id,
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
