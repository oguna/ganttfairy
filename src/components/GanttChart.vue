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
      v-if="activeRect"
      :x="activeRect.x"
      :y="activeRect.y"
      :width="activeRect.w"
      :height="activeRect.h"
      fill="whitesmoke"
    />
    <rect
      v-for="(rect,index) in weekendRects"
      :key="'weekend'+index"
      :x="rect.x"
      :y="rect.y"
      :width="rect.w"
      :height="rect.h"
      class="weekend"
    />
    <g class="foldedRect">
      <rect
        v-for="(span,index) in siblingRects"
        :key="index"
        :x="span.x"
        :y="span.y"
        :width="span.w"
        :height="span.h"
        />
    </g>
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
import { Task, DependencyType } from "@/types";
import { addDays, differenceInCalendarDays } from "date-fns";
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

import { defineComponent, PropType } from "@vue/composition-api";
export default defineComponent({
  props: {
    title: String,
    tasks: Array as PropType<Task[]>,
    start: Date,
    end: Date,
    dates: Array as PropType<Date[]>,
    dateWidth: {
      type: Number,
      default: 24,
    },
    lineHeight: {
      type: Number,
      default: 24
    },
    value: Number,
  },
  emits: ['input'],
  data() {
    return {
      selectedRect: null as number | null,
      selectedPos:  null as Pos | null,
      selectedDelta: null as number | null,
      selectedType: null as "task" | "start" | "end" | null,
    }
  },
  computed: {
    activeRect(): Rect|null {
      const index = this.tasks!.findIndex(v => v.id === this.value);
      if (index === -1) {
        return null;
      }
      return {
        x: 0,
        y: this.lineHeight * index,
        w: this.width,
        h: 24,
      };
    },
    height(): number {
      return this.tasks!.length * this.lineHeight;
    },
    width(): number {
      return this.dates!.length * this.dateWidth;
    },
    boxes(): Rect[] {
      const result: Rect[] = [];
      for (let i = 0; i < this.tasks!.length; i++) {
        let task = this.tasks![i];
        let x = differenceInCalendarDays(task.start, this.start!) * this.dateWidth;
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
    },
    siblingRects(): Rect[] {
      const result = new Array<Rect>();
      for (let i = 0; i < this.tasks!.length; i++) {
        const task = this.tasks![i];
        const spans: {s:Date,e:Date}[] = this.$store.getters.getDeduplicatedSpansOfSiblingTask(task.id);
        for (let span of spans) {
          const x = differenceInCalendarDays(span.s, this.start!) * this.dateWidth;
          const y = this.lineHeight * i + 4;
          const w = (Math.abs(differenceInCalendarDays(span.s, span.e)) + 1) * this.dateWidth;
          const h = 16;
          result.push({
            x, y, w, h
          });
        }
      }
      return result;
    },
    weekendRects(): Rect[] {
      const result: Rect[] = [];
      for (let i = 0; i < this.dates!.length; i++) {
        if (this.dates![i].getDay() === 6 || this.dates![i].getDay() === 0) {
          result.push({
            x: i * this.dateWidth,
            y: 0,
            w: this.dateWidth,
            h: this.lineHeight * this.tasks!.length
          });
        }
      }
      return result;
    },
    accumulatedPeriods(): Line[] {
      const periods = new Array<Line>();
      for (let i = 0; i < this.tasks!.length; i++) {
        const task = this.tasks![i];
        const fastDateLastDate = this.$store.getters.getFastDateLastDateOfTasks(
        task.id
        );
        if (fastDateLastDate !== null) {
          const fastDate = fastDateLastDate.fast;
          const lastDate = fastDateLastDate.last;
          const x1 =
            differenceInCalendarDays(fastDate, this.start!) * this.dateWidth;
          const x2 =
            (differenceInCalendarDays(lastDate, this.start!) + 1) * this.dateWidth;
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
    },
    dependencyGraphs(): Line[] {
      const periods = new Array<Line>();
        for (let dependency of this.$store.state.dependencies) {
            const fromTask = this.$store.getters.getTaskById(dependency.from);
            const toTask = this.$store.getters.getTaskById(dependency.to);
            const fromTaskIndex = this.tasks!.findIndex(v => v.id === dependency.from);
            const toTaskIndex = this.tasks!.findIndex(v => v.id === dependency.to);
            if (fromTaskIndex === -1 || toTaskIndex === -1) {
              continue;
            }
            let x1 = 0;
            if (dependency.type === DependencyType.StartToStart || dependency.type === DependencyType.StartToFinish) {
              x1 = differenceInCalendarDays(fromTask.start, this.start!) * this.dateWidth;
            } else {
              x1 = (differenceInCalendarDays(fromTask.end, this.start!) + 1) * this.dateWidth;
            }
            let x2 = 0;
            if (dependency.type === DependencyType.FinishToStart || dependency.type === DependencyType.StartToStart) {
              x2 = differenceInCalendarDays(toTask.start, this.start!) * this.dateWidth;
            } else {
              x2 = (differenceInCalendarDays(toTask.end, this.start!) + 1) * this.dateWidth;
            }
            const y1 = fromTaskIndex * this.lineHeight + this.lineHeight / 2;
            const y2 = toTaskIndex * this.lineHeight + this.lineHeight / 2;
          periods.push({
            x1,
            y1,
            x2,
            y2,
          });
        }
        return periods;
    },
    taskLabels(): Pos[] {
      const result: Pos[] = [];
      for (let i = 0; i < this.tasks!.length; i++) {
        const task = this.tasks![i];
        let x = differenceInCalendarDays(task.start, this.start!) * this.dateWidth;
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
  },
  methods: {
    taskMousedown(index: number, event: MouseEvent) {
      if (event.button === 0) {
        this.$emit('input', this.tasks![index].id);
        this.selectedRect = index;
        this.selectedPos = { x: event.clientX, y: event.clientY };
        event.preventDefault();
        this.selectedType = "task";
      }
    },
    taskStartMousedown(index: number, event: MouseEvent) {
      if (event.button === 0) {
        this.selectedRect = index;
        this.selectedPos = { x: event.clientX, y: event.clientY };
        event.preventDefault();
        this.selectedType = "start";
      }
    },
    taskEndMousedown(index: number, event: MouseEvent) {
      if (event.button === 0) {
        this.selectedRect = index;
        this.selectedPos = { x: event.clientX, y: event.clientY };
        event.preventDefault();
        this.selectedType = "end";
      }
    },
    taskMousemove(event: MouseEvent) {
      if (this.selectedRect === null) {
        return;
      }
      const deltaX = event.clientX - this.selectedPos!.x;
      this.selectedDelta = Math.round(deltaX / this.dateWidth);
    },
    taskMouseup(event: MouseEvent) {
      if (this.selectedDelta !== null) {
        if (this.selectedType === "start") {
          this.tasks![this.selectedRect!].start = addDays(
            this.tasks![this.selectedRect!].start,
            this.selectedDelta!
          );
        }
        if (this.selectedType === "end") {
          this.tasks![this.selectedRect!].end = addDays(
            this.tasks![this.selectedRect!].end,
            this.selectedDelta!
          );
        }
        if (this.selectedType === "task") {
          this.tasks![this.selectedRect!].start = addDays(
            this.tasks![this.selectedRect!].start,
            this.selectedDelta!
          );
          this.tasks![this.selectedRect!].end = addDays(
            this.tasks![this.selectedRect!].end,
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
})
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
g.foldedRect {
  fill: lightsteelblue;
  stroke-width: 0.5px;
  stroke: blue;
}
</style>