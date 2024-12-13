package com.todoapi.service;

import com.todoapi.entity.Todo;
import com.todoapi.repository.TodoRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {
    TodoService(TodoRepository repository){
        this.repository = repository;
    }
    private final TodoRepository repository;


    public List<Todo> findAll() {
        return repository.findAll();
    }

    public Todo save(Todo todo) {
        return repository.save(todo);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

