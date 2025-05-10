import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TaskService } from "../../services/task.service";
import { Task } from "../../models/task.model";

@Component({
    selector: 'calendar',
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
    tasks: Task[] = [];

    daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    numberOfDays = 31;
    
    firstDayOfMonth = 2; // 0 = Monday, 1 = Tuesday, ..., 6 = Sunday (e.g., 2 = Wednesday)

    weeks: (number | null)[][] = [];

    constructor(private taskService: TaskService) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);;
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        taskService.getTasks(monthStart, monthEnd).subscribe({
            next: (tasks) => this.tasks = tasks
        });
        
        this.generateCalendar();
    }

    generateCalendar() {
        const calendarDays: (number | null)[] = [];

        for (let i = 0; i < this.firstDayOfMonth; i++) {
            calendarDays.push(null);
        }

        for (let day = 1; day <= this.numberOfDays; day++) {
            calendarDays.push(day);
        }

        for (let i = 0; i < calendarDays.length; i += 7) {
            this.weeks.push(calendarDays.slice(i, i + 7));
        }
    }
}