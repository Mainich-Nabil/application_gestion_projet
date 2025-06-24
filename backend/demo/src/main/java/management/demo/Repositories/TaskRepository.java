package management.demo.Repositories;

import management.demo.entite.Task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByProjectId(int projectId);

    List<Task> findByStatus(String status);
    List<Task> findByTitleContaining(String title);
    
}