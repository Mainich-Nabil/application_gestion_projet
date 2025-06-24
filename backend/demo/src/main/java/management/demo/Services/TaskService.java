package management.demo.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import management.demo.Repositories.TaskRepository;
import management.demo.Repositories.ProjectRepository;
import management.demo.entite.Project;
import management.demo.entite.Task;

@Service
public class TaskService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks(int projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTaskByStatu(String statu, int projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return null; // Project not found
        } else {
            List<Task> tasks = project.getTasks();
            return tasks.stream()
                    .filter(task -> task.getStatus().equalsIgnoreCase(statu))
                    .toList();
        }
    }

    public List<Task> getTaskByTitle(String title, int projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return null; // Project not found
        } else {
            List<Task> tasks = project.getTasks();
            return tasks.stream()
                    .filter(task -> task.getTitle().toLowerCase().contains(title.toLowerCase()))
                    .toList();
        }
    }

    // Méthode corrigée pour accepter un projectId séparé
    public boolean saveTask(Task task, int projectId) {
        if (task == null || projectId == 0) {
            return false; // données manquantes
        }

        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return false; // projet non trouvé
        }

        // Associer le projet à la tâche
        task.setProject(project);

        try {
            taskRepository.save(task);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Task updateTask(int id, Task task) {
        Task existingTask = taskRepository.findById(id).orElse(null);
        if (existingTask != null) {
            existingTask.setTitle(task.getTitle());
            existingTask.setDescription(task.getDescription());
            existingTask.setStatus(task.getStatus());
            existingTask.setDueDate(task.getDueDate());
            return taskRepository.save(existingTask);
        }
        return null;
    }

    public boolean deleteTask(int id) {
        Task existingTask = taskRepository.findById(id).orElse(null);
        if (existingTask == null) {
            return false;
        } else {
            try {
                existingTask.getProject().getTasks().remove(existingTask);
                taskRepository.deleteById(id);
                taskRepository.flush();
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }
    }
}