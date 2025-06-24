import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  projectId: number;
  dueDate?: string; // Ajouté si nécessaire
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  getAllTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/${projectId}`);
  }

  getTasksByStatus(status: string, projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/status/${status}?projectId=${projectId}`);
  }

  getTasksByTitle(title: string, projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/title/${title}?projectId=${projectId}`);
  }

  // Méthode corrigée pour envoyer le projectId en paramètre
  addTask(task: Task): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/add?projectId=${task.projectId}`, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/update/${id}`, task);
  }

  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/delete/${id}`);
  }
}