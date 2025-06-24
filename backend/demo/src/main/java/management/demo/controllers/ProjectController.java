package management.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import management.demo.entite.Project;
import management.demo.Services.ProjectService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/all")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable int id) {
        return projectService.getProjectById(id);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable int id, @RequestBody Project project) {
        System.out.println("Mise à jour projet: " + project.getName()); // Debug
        return projectService.updateProject(id, project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable int id) {
        projectService.deleteProject(id);
    }

    @PostMapping("/add")
    public Project addProject(@RequestBody Project project) {
        System.out.println("Ajout projet: " + project.getName()); // Debug
        System.out.println("Description: " + project.getDescription()); // Debug
        System.out.println("Date début: " + project.getStartDate()); // Debug
        return projectService.saveProject(project);
    }
}