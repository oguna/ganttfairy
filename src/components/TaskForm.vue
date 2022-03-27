<template>
<div>
    <h2>{{modelValue.id === 0 ? 'New' : 'Edit #' + modelValue.id}}</h2>
    タスク名: <input v-model="name" type="text"><br>
    開始日: <input v-model="start" type="date"><br>
    終了日: <input v-model="end" type="date"><br>
    進捗: <input v-model="progress" type="number"><br>
    <button @click="$emit('cancel')">Cancel</button>
    <button @click="$emit('submit')">Submit</button>
</div>
</template>

<script lang="ts">
import type { Task } from "@/types";
import { defineComponent, type PropType } from "vue";
import {format, parseISO} from 'date-fns'

export default defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<Task>,
            required: true
        }
    },
    emits: ['cancel', 'submit', "update:modelValue"],
    data() {
        return {
        }
    },
    computed: {
        name: {
            get(): string {
                return this.modelValue.name
            },
            set(value: string) {
                const a = Object.assign({}, this.modelValue)
                a.name = value
                this.$emit('update:modelValue', a)
            }
        },
        start: {
            get(): string {
                return format(this.modelValue.start, "yyyy-MM-dd")
            },
            set(value: string) {
                const a = Object.assign({}, this.modelValue)
                a.start = parseISO(value)
                this.$emit('update:modelValue', a)
            }
        },
        end: {
            get(): string {
                return format(this.modelValue.end, "yyyy-MM-dd")
            },
            set(value: string) {
                const a = Object.assign({}, this.modelValue)
                a.end = parseISO(value)
                this.$emit('update:modelValue', a)
            }
        },
        progress: {
            get(): number {
                return this.modelValue.progress
            },
            set(value: number) {
                const a = Object.assign({}, this.modelValue)
                a.progress = value
                this.$emit('update:modelValue', a)
            }
        },
    }
})
</script>