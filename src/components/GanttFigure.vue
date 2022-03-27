<template>
    <div class="wrapper" @mousemove="taskMousemove" @mouseup="taskMouseup" :style="`width:${width}px; height:${height}px`">
        <div class="header">
            <div class="monthHeader">
                <div class="monthHeaderCell" v-for="m of monthHeaders" :style="{width:(m.count*16-2)+'px'}">{{ m.name }}</div>
            </div>
            <div class="dateHeader">
                <div class="dateHeaderCell" v-for="d of dayHeader">{{ d }}</div>
            </div>
            <div class="weekHeader">
                <div class="weekHeaderCell" v-for="d of dayOfTheWeekHeader">{{ d }}</div>
            </div>
        </div>
        <div class="weekend">
            <div class="weekendBox"
            v-for="item in weekendBoxes" :key="item.id"
            :style="`left: ${item.x}px; top: ${item.y}px; width: ${item.w}px; height: ${item.h}px;`"
            ></div>
        </div>
        <div
            class="box"
            v-for="item in items"
            :key="item.id"
            :style="`left: ${item.x}px; top: ${item.y}px; width: ${item.w}px; height: 24px;`"
            @mousedown="taskMousedown(item.id, $event)"
            :class="{'active': item.id===selectedTask && selectedType==='task'}"
        >{{ item.name }}</div>
        <div
            class="grip"
            v-for="item in items"
            :key="item.id"
            :style="`left: ${item.x - 6}px; top: ${item.y + 6}px; width: 12px; height: 12px;`"
            @mousedown="taskStartMousedown(item.id, $event)"
            :class="{'active': item.id===selectedTask && selectedType==='start'}"
        ></div>
        <div
            class="grip"
            v-for="item in items"
            :key="item.id"
            :style="`left: ${item.x + item.w - 6}px; top: ${item.y + 6}px; width: 12px; height: 12px;`"
            @mousedown="taskEndMousedown(item.id, $event)"
            :class="{'active': item.id===selectedTask && selectedType==='end'}"
        ></div>
    </div>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { useTaskStore } from '../stores/task'
import { differenceInCalendarDays, addDays } from 'date-fns'
import type { Task } from "@/types";

interface ItemType {
    id: number
    name: string
    x: number
    y: number
    w: number
    h: number
}

interface MonthHeaderType {
    name: string
    count: number
}

export default defineComponent({
    data() {
        return {
            dateWidth: 16,
            selectedTask: null as number | null,
            selectedPos: null as { x: number, y: number } | null,
            selectedType: null as "start" | "end" | "task" | null,
            selectedDelta: null as number | null,
        }
    },
    computed: {
        ...mapState(useTaskStore, ['tasks']),
        items(): ItemType[] {
            const items = [] as ItemType[]
            for (let i = 0; i<this.tasks.length; i++) {
                const e = this.tasks[i]
                items.push({
                    name: e.name,
                    id: e.id,
                    x: -differenceInCalendarDays(this.startDate!, e.start) * this.dateWidth!,
                    w: (-differenceInCalendarDays(e.start, e.end)+1) * this.dateWidth!,
                    h: 32,
                    y: i * 32 + 32 * 3 + 4,
                })
            }
            return items
        },
        startDate(): Date {
            let day = this.tasks[0].start
            for (const task of this.tasks.slice(1)) {
                if (day > task.start) {
                    day = task.start
                }
            }
            return day
        },
        endDate(): Date {
            let day = this.tasks[0].end
            for (const task of this.tasks.slice(1)) {
                if (day < task.end) {
                    day = task.end
                }
            }
            return day
        },
        monthHeaders(): MonthHeaderType[] {
            let d = this.startDate
            const header = [] as string[]
            while ((d < this.endDate)) {
                if (d.getMonth() < 10) {
                    header.push(d.getFullYear() + "-0" + (d.getMonth()+1))
                } else {
                    header.push(d.getFullYear() + "-" + (d.getMonth()+1))
                }
                d = addDays(d, 1)
            }
            let a = header[0]
            let b = 1
            const result = [] as MonthHeaderType[]
            for (let i = 1; i < header.length; i++) {
                if (a !== header[i]) {
                    result.push({name: a, count: b})
                    a = header[i]
                    b = 1
                } else {
                    b++
                }
            }
            result.push({name: a.toString(), count: b})
            return result
        },
        dayHeader(): number[] {
            let d = this.startDate
            const header = []
            while ((d < this.endDate)) {
                header.push(d.getDate())
                d = addDays(d, 1)
            }
            return header
        },
        dayOfTheWeekHeader(): string[] {
            const days = "月火水木金土日"
            let d = this.startDate
            const header = []
            while ((d < this.endDate)) {
                header.push(days.substring(d.getDay(), d.getDay() + 1))
                d = addDays(d, 1)
            }
            return header
        },
        width(): number {
            return this.dayHeader.length * this.dateWidth
        },
        height(): number {
            return this.tasks.length * 32 + 32 * 4 + 4
        },
        weekendBoxes(): ItemType[] {
            const boxes = [] as ItemType[]
            for (let i = 0; i < this.dayOfTheWeekHeader.length; i++) {
                if (this.dayOfTheWeekHeader[i] === '日' || this.dayOfTheWeekHeader[i] === '土') {
                    boxes.push({
                        id: i,
                        name: this.dayOfTheWeekHeader[i],
                        x: i * 16,
                        y: 32 * 3 + 2,
                        h: this.items.length*32 + 32,
                        w: 16,
                    })
                }
            }
            return boxes
        }
    },
    methods: {
        taskMousedown(id: number, event: MouseEvent) {
            const task = this.tasks.find(e => e.id === id)
            if (event.button === 0 && task) {
                this.$emit('input', task.id);
                this.selectedTask = id;
                this.selectedPos = { x: event.clientX, y: event.clientY };
                event.preventDefault();
                this.selectedType = "task";
            }
        },
        taskStartMousedown(index: number, event: MouseEvent) {
            if (event.button === 0) {
                this.selectedTask = index;
                this.selectedPos = { x: event.clientX, y: event.clientY };
                event.preventDefault();
                this.selectedType = "start";
            }
        },
        taskEndMousedown(index: number, event: MouseEvent) {
            if (event.button === 0) {
                this.selectedTask = index;
                this.selectedPos = { x: event.clientX, y: event.clientY };
                event.preventDefault();
                this.selectedType = "end";
            }
        },
        taskMousemove(event: MouseEvent) {
            if (this.selectedTask === null) {
                return;
            }
            const deltaX = event.clientX - this.selectedPos!.x;
            this.selectedDelta = Math.round(deltaX / this.dateWidth);
        },
        taskMouseup(event: MouseEvent) {
            const task = this.tasks.find(e => e.id === this.selectedTask)
            if (this.selectedDelta !== null && task) {
                if (this.selectedType === "start") {
                    task.start = addDays(
                        task.start,
                        this.selectedDelta!
                    );
                }
                if (this.selectedType === "end") {
                    task.end = addDays(
                        task.end,
                        this.selectedDelta!
                    );
                }
                if (this.selectedType === "task") {
                    task.start = addDays(
                        task.start,
                        this.selectedDelta!
                    );
                    task.end = addDays(
                        task.end,
                        this.selectedDelta!
                    );
                }
            }
            this.selectedTask = null;
            this.selectedPos = null;
            this.selectedDelta = null;
            this.selectedType = null;
        }
    }
})
</script>

<style scoped>
.monthHeader {
    height: 32px;
}
.dateHeader {
    height: 32px;
}
.weekHeader {
    height: 32px;
}
.monthHeaderCell {
    border: solid 1px;
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
    display: inline-block;
    height: 100%;
}
.dateHeaderCell {
    border: solid 1px;
    max-width: 14px;
    min-width: 14px;
    height: 100%;
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
    display: inline-block;
    font-size: 0.5em;
}
.weekHeaderCell {
    border: solid 1px;
    font-size: 0.5em;
    max-width: 14px;
    min-width: 14px;
    height: 1rem;
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
    display: inline-block;
    height: 100%;
}

.wrapper {
    background-color: azure;
    position: relative;
    user-select: none;
}

.box {
    background-color: aqua;
    border: 1px black solid;
    position: absolute;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.weekendBox {
    position: absolute;
    background-color: whitesmoke;
}

.grip {
    background-color: blue;
    border: 1px black solid;
    position: absolute;
    transform: rotate(45deg);
}
.active {
    background-color: pink;
}
</style>