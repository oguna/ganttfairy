import {parse, parseISO} from 'date-fns';
export function parseVariousDateString(date: string):Date|null {
    const now = new Date();
    const formats = [
        "yyyy-MM-dd",
        "M月d日",
        "yyyy年M月d日",
    ]
    for (const format of formats) {
        const parsed = parse(date, format, now);
        if (parsed.toString() !== "Invalid Date") {
            return parsed;
        }
    }
    return null;
}