export interface Task {
  group: string;
  title: string;
  start: string;
  end: string;
}

export interface TaskGroup {
  name: string;
  itemIndecies: number[];
}

export interface RootState {
    tasks: Task[];
    title: string;
}