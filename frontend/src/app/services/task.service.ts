import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Task } from "../models/task.model";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = `${environment.apiUrl}/tasks`;

    constructor(private http: HttpClient) {}

    getTasks(dateFrom: Date, dateTo: Date): Observable<Task[]> {
        return this.http.get<Task[]>(
            this.apiUrl,
            {
                params: new HttpParams()
                    .set('dateFrom', dateFrom.toISOString())
                    .set('dateTo', dateTo.toISOString())
            }
        );
    }
}