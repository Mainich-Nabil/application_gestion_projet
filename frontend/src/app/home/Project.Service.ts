import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string; 
    endDate: string;   // Changé en string pour les dates HTML
}

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly url = 'http://localhost:8080/api/projects';
    
    constructor(private http: HttpClient) {}
    
    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.url}/all`);
    }
    
    getProjectById(id: number): Observable<Project> {
        return this.http.get<Project>(`${this.url}/${id}`);
    }
    
    addProject(project: Project): Observable<Project> {
        // Formatage des dates avant envoi
        const projectData = {
            ...project,
            startDate: this.formatDateForBackend(project.startDate),
            endDate: this.formatDateForBackend(project.endDate)
        };
        console.log('Données envoyées:', projectData); // Debug
        return this.http.post<Project>(`${this.url}/add`, projectData);
    }
    
    updateProject(project: Project): Observable<Project> {
        const projectData = {
            ...project,
            startDate: this.formatDateForBackend(project.startDate),
            endDate: this.formatDateForBackend(project.endDate)
        };
        return this.http.put<Project>(`${this.url}/${project.id}`, projectData);
    }
    
    deleteProject(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
    
    private formatDateForBackend(dateString: string): string {
        if (!dateString) return '';
        // Convertir la date HTML (YYYY-MM-DD) en format ISO
        const date = new Date(dateString);
        return date.toISOString();
    }
}