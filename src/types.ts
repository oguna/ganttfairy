export interface Task {
  id: number;
  parent: number|null;
  title: string;
  start: Date;
  end: Date;
}

export interface RootState {
    tasks: Task[];
    nextTaskId: number;
    title: string;
    magnify: number;
}