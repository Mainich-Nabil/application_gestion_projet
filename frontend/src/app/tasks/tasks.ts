import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService, Task } from './tasks.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
})
export class TaskListComponent implements OnInit {
  projectId!: number;

  tasks: Task[] = [];
  newTask: Task = this.emptyTask();
  editTaskId: number | null = null;

  statusFilter: string = '';
  titleSearch: string = '';

  // Variables pour les messages d'erreur/succès
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    if (!this.projectId) {
      this.showError('ID de projet invalide');
      return;
    }
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks(this.projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.clearMessages();
      },
      error: (err) => {
        console.error('Erreur de chargement:', err);
        this.showError('Erreur lors du chargement des tâches');
      },
    });
  }

  emptyTask(): Task {
    return {
      id: 0,
      title: '',
      description: '',
      status: 'TODO', // Valeur par défaut
      projectId: this.projectId || 0,
    };
  }

  startAdd(): void {
    this.newTask = this.emptyTask();
    this.editTaskId = null;
    this.clearMessages();
  }

  startEdit(task: Task): void {
    this.newTask = { ...task };
    this.editTaskId = task.id;
    this.clearMessages();
  }

  cancelEdit(): void {
    this.resetForm();
    this.clearMessages();
  }

  saveTask(event?: Event): void {
    if (event) event.preventDefault();

    // Validation côté client
    if (!this.newTask.title || !this.newTask.title.trim()) {
      this.showError('Le titre de la tâche est obligatoire');
      return;
    }

    if (!this.newTask.status || !this.newTask.status.trim()) {
      this.showError('Le statut de la tâche est obligatoire');
      return;
    }

    // Assurer que projectId est défini
    this.newTask.projectId = this.projectId;

    let op$: Observable<any>;
    if (this.editTaskId) {
      op$ = this.taskService.updateTask(this.editTaskId, this.newTask);
    } else {
      op$ = this.taskService.addTask(this.newTask);
    }

    op$.subscribe({
      next: (result) => {
        if (this.editTaskId) {
          // Pour la mise à jour, on reçoit l'objet Task
          if (result) {
            this.showSuccess('Tâche mise à jour avec succès');
            this.resetForm();
            // Rafraîchir la page avec indicateur de chargement
            this.refreshPageWithLoading();
          } else {
            this.showError('Erreur lors de la mise à jour de la tâche');
          }
        } else {
          // Pour l'ajout, on reçoit un boolean
          if (result === true) {
            this.showSuccess('Tâche ajoutée avec succès');
            this.resetForm();
            // Rafraîchir la page avec indicateur de chargement
            this.refreshPageWithLoading();
          } else {
            this.showError('Erreur lors de l\'ajout de la tâche. Vérifiez que le projet existe.');
          }
        }
      },
      error: (err) => {
        console.error('Erreur:', err);
        if (err.status === 400) {
          this.showError('Données invalides. Vérifiez les informations saisies.');
        } else if (err.status === 404) {
          this.showError('Projet non trouvé');
        } else {
          this.showError('Erreur de communication avec le serveur');
        }
      },
    });
  }

  deleteTask(id: number): void {
    if (confirm('Confirmer la suppression de cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe({
        next: (result) => {
          if (result === true) {
            this.showSuccess('Tâche supprimée avec succès');
            // Rafraîchir la page avec indicateur de chargement
            this.refreshPageWithLoading();
          } else {
            this.showError('Erreur lors de la suppression de la tâche');
          }
        },
        error: (err) => {
          console.error('Erreur de suppression:', err);
          if (err.status === 404) {
            this.showError('Tâche non trouvée');
          } else {
            this.showError('Erreur lors de la suppression');
          }
        },
      });
    }
  }

  searchByStatus(): void {
    if (!this.statusFilter || !this.statusFilter.trim()) {
      // Rafraîchir la page pour afficher toutes les tâches
      window.location.reload();
      return;
    }

    this.taskService.getTasksByStatus(this.statusFilter, this.projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.clearMessages();
      },
      error: (err) => {
        console.error('Erreur de filtre par statut:', err);
        this.showError('Erreur lors du filtrage par statut');
      },
    });
  }

  searchByTitle(): void {
    if (!this.titleSearch || !this.titleSearch.trim()) {
      // Rafraîchir la page pour afficher toutes les tâches
      window.location.reload();
      return;
    }

    this.taskService.getTasksByTitle(this.titleSearch, this.projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.clearMessages();
      },
      error: (err) => {
        console.error('Erreur de recherche par titre:', err);
        this.showError('Erreur lors de la recherche par titre');
      },
    });
  }

  resetFilters(): void {
    this.statusFilter = '';
    this.titleSearch = '';
    // Rafraîchir la page pour réinitialiser tous les filtres
    window.location.reload();
  }

  resetForm(): void {
    this.newTask = this.emptyTask();
    this.editTaskId = null;
  }

  trackById(index: number, task: Task): number {
    return task.id;
  }

  // Méthodes pour la gestion des messages
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    // Auto-clear après 5 secondes
    setTimeout(() => this.clearMessages(), 5000);
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    // Auto-clear après 3 secondes
    setTimeout(() => this.clearMessages(), 3000);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Méthode utilitaire pour rafraîchir avec indicateur de chargement
  private refreshPageWithLoading(): void {
    this.isLoading = true;
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}