<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :aria-labelledby="title"
    box
    @mousemove="taskMousemove"
    @mouseup="taskMouseup"
    role="presentation"
  >
    <title id="ganttchart" lang="en">{{title}}</title>
    <rect
      v-for="(rect,index) in weekendRects"
      :key="'weekend'+index"
      :x="rect.x"
      :y="rect.y"
      :width="rect.w"
      :height="rect.h"
      class="weekend"
    />
    <template v-for="(rect,index) in boxes">
      <rect
        @mousedown="taskStartMousedown(index,$event)"
        class="grip"
        :key="'leftgrip'+index"
        :x="rect.x-8"
        :y="rect.y"
        width="8px"
        :height="rect.h"
      />
      <rect
        @mousedown="taskMousedown(index,$event)"
        :key="index"
        :x="rect.x"
        :y="rect.y"
        :width="rect.w"
        :height="rect.h"
        class="box"
        :class="{selected:(selectedRect === index)}"
      />
      <rect
        @mousedown="taskEndMousedown(index,$event)"
        class="grip"
        :key="'rightgrip'+index"
        :x="rect.x+rect.w"
        :y="rect.y"
        width="8px"
        :height="rect.h"
      />
    </template>
    <g stroke="black" stroke-width="3">
      <marker
        id="m_e"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerUnits="strokeWidth"
        preserveAspectRatio="none"
        markerWidth="3"
        markerHeight="3"
        orient="auto"
      >
        <polygon points="5,10 5,5 0,5" fill="black" id="ms" />
      </marker>
      <marker
        id="m_s"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerUnits="strokeWidth"
        preserveAspectRatio="none"
        markerWidth="3"
        markerHeight="3"
        orient="auto"
      >
        <use xlink:href="#ms" transform="rotate(270,5,5)" />
      </marker>
      <template v-for="(line,index) in accumulatedPeriods">
        <line
          :key="'span'+index"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          marker-start="url(#m_s)"
          marker-end="url(#m_e)"
        />
      </template>
    </g>
    <g stroke="black" stroke-width="1">
      <marker id="arrow" viewBox="-5 -5 10 10" orient="auto" markerWidth="10" markerHeight="10">
        <polygon points="-5,-5 5,0 -5,5" fill="black" stroke="none" />
      </marker>
      <line v-for="(dependency,index) in dependencyGraphs"
      :key="'dependency'+index"
        :x1="dependency.x1"
        :y1="dependency.y1"
        :x2="dependency.x2"
        :y2="dependency.y2"
        marker-end="url(#arrow)"
      />
    </g>
    <g font-family="sans-serif" font-size="12" dominant-baseline="middle">
      <text
        v-for="(task,index) in tasks"
        :key="index"
        :x="taskLabels[index].x + 12"
        :y="taskLabels[index].y"
        fill="blue"
      >{{task.title}}</text>
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Task, DependencyType } from "@/types";
import { addDays, subDays, parse, differenceInCalendarDays } from "date-fns";
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Pos {
  x: number;
  y: number;
}
interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
@Component
export default class GanttChart extends Vue {
  @Prop({ default: "" })
  public title!: string;
  @Prop()
  public tasks!: Task[];
  @Prop()
  public start!: Date;
  @Prop()
  public end!: Date;
  @Prop()
  public dates!: Date[];
  @Prop({ default: 24 })
  public dateWidth!: number;
  @Prop({ default: 24 })
  public lineHeight!: number;

  public get height() {
    return this.tasks.length * this.lineHeight;
  }
  public get width() {
    return this.dates.length * this.dateWidth;
  }
  public get boxes(): Rect[] {
    const result: Rect[] = [];
    for (let i = 0; i < this.tasks.length; i++) {
      let task = this.tasks[i];
      let x = differenceInCalendarDays(task.start, this.start) * this.dateWidth;
      let y = this.lineHeight * i + 4;
      let w =
        (differenceInCalendarDays(task.end, task.start) + 1) * this.dateWidth;
      if (w < 0) {
        w = -w;
      }
      if (x < 0) {
        x = 0;
        w = w + x;
      }
      if (this.selectedRect === i && this.selectedType === "task") {
        x += this.selectedDelta! * this.dateWidth;
      }
      if (this.selectedRect === i && this.selectedType === "start") {
        x += this.selectedDelta! * this.dateWidth!;
        w -= this.selectedDelta! * this.dateWidth;
      }
      if (this.selectedRect === i && this.selectedType === "end") {
        w += this.selectedDelta! * this.dateWidth;
      }
      result.push({ x, y, w, h: 16 });
    }
    return result;
  }
  public get weekendRects(): Rect[] {
    const result: Rect[] = [];
    for (let i = 0; i < this.dates.length; i++) {
      if (this.dates[i].getDay() === 6 || this.dates[i].getDay() === 0) {
        result.push({
          x: i * this.dateWidth,
          y: 0,
          w: this.dateWidth,
          h: this.lineHeight * this.tasks.length
        });
      }
    }
    return result;
  }
  public get accumulatedPeriods(): Array<Line> {
    const periods = new Array<Line>();
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];
      const fastDateLastDate = this.$store.getters.getFastDateLastDateOfTasks(
       task.id
      );
      if (fastDateLastDate !== null) {
        const fastDate = fastDateLastDate.fast;
        const lastDate = fastDateLastDate.last;
        const x1 =
          differenceInCalendarDays(fastDate, this.start) * this.dateWidth;
        const x2 =
          (differenceInCalendarDays(lastDate, this.start) + 1) * this.dateWidth;
        let y = this.lineHeight * i + 2;
        periods.push({
          x1,
          x2,
          y1: y,
          y2: y
        });
      }
    }
    return periods;
  }
  public get dependencyGraphs(): Line[] {
    const periods = new Array<Line>();
      for (let dependency of this.$store.state.dependencies) {
          const fromTask = this.$store.getters.getTaskById(dependency.from);
          const toTask = this.$store.getters.getTaskById(dependency.to);
          let x1 = 0;
          if (dependency.type === DependencyType.StartToStart || dependency.type === DependencyType.StartToFinish) {
            x1 = differenceInCalendarDays(fromTask.start, this.start) * this.dateWidth;
          } else {
            x1 = (differenceInCalendarDays(fromTask.end, this.start) + 1) * this.dateWidth;
          }
          let x2 = 0;
          if (dependency.type === DependencyType.FinishToStart || dependency.type === DependencyType.FinishToFinish) {
            x2 = differenceInCalendarDays(toTask.start, this.start) * this.dateWidth;
          } else {
            x2 = (differenceInCalendarDays(toTask.end, this.start) + 1) * this.dateWidth;
          }
          const y1 = this.tasks.indexOf(fromTask) * this.lineHeight + this.lineHeight / 2;
          const y2 = this.tasks.indexOf(toTask) * this.lineHeight + this.lineHeight / 2;
        periods.push({
          x1,
          y1,
          x2,
          y2,
        });
      }
      return periods;
  }
  public selectedRect: number | null = null;
  public selectedPos: Pos | null = null;
  public selectedDelta: number | null = null;
  public selectedType: "task" | "start" | "end" | null = null;
  public get taskLabels(): Pos[] {
    const result: Pos[] = [];
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];
      let x = differenceInCalendarDays(task.start, this.start) * this.dateWidth;
      let y = this.lineHeight * i + this.lineHeight / 2;
      let w =
        (differenceInCalendarDays(task.end, task.start) + 1) * this.dateWidth;
      if (w < 0) {
        w = -w;
      }
      x = w + x;
      if (x < 0) {
        x = 0;
      }
      if (this.selectedRect === i && this.selectedType === "task") {
        x += this.selectedDelta! * this.dateWidth;
      }
      if (this.selectedRect === i && this.selectedType === "end") {
        x += this.selectedDelta! * this.dateWidth;
      }
      result.push({ x, y });
    }
    return result;
  }
  public taskMousedown(index: number, event: MouseEvent) {
    if (event.button === 0) {
      this.selectedRect = index;
      this.selectedPos = { x: event.clientX, y: event.clientY };
      event.preventDefault();
      this.selectedType = "task";
    }
  }
  public taskStartMousedown(index: number, event: MouseEvent) {
    if (event.button === 0) {
      this.selectedRect = index;
      this.selectedPos = { x: event.clientX, y: event.clientY };
      event.preventDefault();
      this.selectedType = "start";
    }
  }
  public taskEndMousedown(index: number, event: MouseEvent) {
    if (event.button === 0) {
      this.selectedRect = index;
      this.selectedPos = { x: event.clientX, y: event.clientY };
      event.preventDefault();
      this.selectedType = "end";
    }
  }
  public taskMousemove(event: MouseEvent) {
    if (this.selectedRect === null) {
      return;
    }
    const deltaX = event.clientX - this.selectedPos!.x;
    this.selectedDelta = Math.round(deltaX / this.dateWidth);
  }
  public taskMouseup(event: MouseEvent) {
    if (this.selectedDelta !== null) {
      if (this.selectedType === "start") {
        this.tasks[this.selectedRect!].start = addDays(
          this.tasks[this.selectedRect!].start,
          this.selectedDelta!
        );
      }
      if (this.selectedType === "end") {
        this.tasks[this.selectedRect!].end = addDays(
          this.tasks[this.selectedRect!].end,
          this.selectedDelta!
        );
      }
      if (this.selectedType === "task") {
        this.tasks[this.selectedRect!].start = addDays(
          this.tasks[this.selectedRect!].start,
          this.selectedDelta!
        );
        this.tasks[this.selectedRect!].end = addDays(
          this.tasks[this.selectedRect!].end,
          this.selectedDelta!
        );
      }
    }
    this.selectedRect = null;
    this.selectedPos = null;
    this.selectedDelta = null;
    this.selectedType = null;
  }
}
</script>

<style scoped>
rect.box {
  fill: aqua;
  stroke-width: 0.5px;
  stroke: blue;
  cursor: move;
}
rect.selected {
  fill: aquamarine;
}
rect.weekend {
  fill: gainsboro;
}
svg {
  padding: 0;
  margin: 0;
  vertical-align: top;
}
rect.grip {
  fill: transparent;
}
rect.grip:hover {
  fill: transparent;
  stroke-width: 0.5px;
  stroke: blue;
  cursor: w-resize;
}
</style>