export interface Task {
  group: string;
  title: string;
  start: Date;
  end: Date;
}

export interface TaskGroup {
  name: string;
  itemIndecies: number[];
}

export interface RootState {
    tasks: Task[];
    title: string;
    magnify: number;
}