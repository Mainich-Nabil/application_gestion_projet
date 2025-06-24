import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../home/Project.Service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  newProject: Project = this.emptyProject();
  editProjectId: number | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects.map(p => ({
          ...p,
          startDate: this.formatDateForInput(p.startDate),
          endDate: this.formatDateForInput(p.endDate)
        }));
      },
      error: (err) => console.error('Erreur de chargement:', err)
    });
  }

  emptyProject(): Project {
    const today = new Date().toISOString().split('T')[0];
    return { id: 0, name: '', description: '', startDate: today, endDate: today };
  }

  startAdd(): void {
    this.newProject = this.emptyProject();
    this.editProjectId = null;
  }

  startEdit(project: Project): void {
    this.newProject = { ...project };
    this.editProjectId = project.id;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  saveProject(event?: Event): void {
    if (event) event.preventDefault();

    const request$ = this.editProjectId
      ? this.projectService.updateProject(this.newProject)
      : this.projectService.addProject(this.newProject);

    request$.subscribe({
      next: () => window.location.reload(),
      error: (err) => console.error('Erreur:', err)
    });
  }

  deleteProject(id: number): void {
    if (!confirm('Confirmer la suppression ?')) return;

    this.projectService.deleteProject(id).subscribe({
      next: () => window.location.reload(),
      error: (err) => console.error('Erreur de suppression:', err)
    });
  }

  resetForm(): void {
    this.newProject = this.emptyProject();
    this.editProjectId = null;
  }

  formatDateForInput(dateString: string): string {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  formatDisplayDate(dateString: string): string {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  Tasks(projectId: number): void {
    // Redirection vers la page des tâches du projet
    window.location.href = `/tasks/${projectId}`;
  }
}
