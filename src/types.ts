export interface Task {
  id: number;
  parent: number | null;
  title: string;
  start: Date;
  end: Date;
  status: TaskStatusType | null;
}

export enum DependencyType {
  FinishToStart,
  StartToStart,
  FinishToFinish,
  StartToFinish,
}

export enum TaskStatusType {
  TODO,
  WIP,
  DONE,
}

export interface Dependency {
  id: number;
  type: DependencyType;
  to: number;
  from: number;
}

export interface TaskTreeNode {
  id: number;
  open: boolean;
  children: TaskTreeNode[];
}

export interface RootState {
  tasks: Task[];
  nextTaskId: number;
  title: string;
  magnify: number;
  dependencies: Dependency[];
  nextDependencyId: number;
  taskTreeNodes: TaskTreeNode[];
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
}