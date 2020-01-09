export interface Task {
  id: number;
  parent: number | null;
  title: string;
  start: Date;
  end: Date;
}

export enum DependencyType {
  FinishToStart,
  StartToStart,
  FinishToFinish,
  StartToFinish,
}

export interface Dependency {
  id: number;
  type: DependencyType;
  to: number;
  from: number;
}

export interface RootState {
  tasks: Task[];
  nextTaskId: number;
  title: string;
  magnify: number;
  dependencies: Dependency[];
  nextDependencyId: number;
}