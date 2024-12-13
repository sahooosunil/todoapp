package com.todoapi.repository;

import com.todoapi.entity.Todo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
@RequiredArgsConstructor
public class TodoRepository {
    private final Map<Long, Todo> todoStore = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    // Save a new Todo
    public Todo save(Todo todo) {
        if (todo.getId() == null) {
            todo.setId(idGenerator.getAndIncrement());
        }
        todoStore.put(todo.getId(), todo);
        return todo;
    }

    // Find all Todos
    public List<Todo> findAll() {
        return new ArrayList<>(todoStore.values());
    }

    // Find a Todo by ID
    public Todo findById(Long id) {
        return todoStore.get(id);
    }

    // Delete a Todo by ID
    public void deleteById(Long id) {
        todoStore.remove(id);
    }

}
