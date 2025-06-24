package management.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import management.demo.Services.TaskService;
import management.demo.entite.Task;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TasksController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/{projectId}")
    public ResponseEntity<List<Task>> getAllTasks(@PathVariable int projectId) {
        List<Task> tasks = taskService.getAllTasks(projectId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTaskByStatus(@PathVariable String status, @RequestParam int projectId) {
        List<Task> tasks = taskService.getTaskByStatu(status, projectId);
        if (tasks == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/title/{title}")
    public ResponseEntity<List<Task>> getTaskByTitle(@PathVariable String title, @RequestParam int projectId) {
        List<Task> tasks = taskService.getTaskByTitle(title, projectId);
        if (tasks == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tasks);
    }

    // Méthode corrigée pour accepter projectId en paramètre
    @PostMapping("/add")
    public ResponseEntity<Boolean> saveTask(@RequestBody Task task, @RequestParam int projectId) {
        boolean result = taskService.saveTask(task, projectId);
        if (result) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable int id, @RequestBody Task task) {
        Task updatedTask = taskService.updateTask(id, task);
        if (updatedTask != null) {
            return ResponseEntity.ok(updatedTask);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteTask(@PathVariable int id) {
        boolean result = taskService.deleteTask(id);
        if (result) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}