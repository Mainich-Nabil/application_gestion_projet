package management.demo.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import management.demo.Repositories.ProjectRepository;
import management.demo.entite.Project;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public Project getProjectById(int id) {
        return projectRepository.getReferenceById(id);
    }

    public Project updateProject(int id, Project project) {
        Project existingProject = projectRepository.findById(id).orElse(null);
        if (existingProject != null) {
            existingProject.setName(project.getName());
            existingProject.setDescription(project.getDescription());
            existingProject.setStartDate(project.getStartDate());
            existingProject.setEndDate(project.getEndDate());
            return projectRepository.save(existingProject);
        }
        return null;
    }

    public void deleteProject(int id) {
        projectRepository.deleteById(id);
    }

}