import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoPriority } from './dto/create-todo.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: string): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: uuidv4(),
      title: createTodoDto.title,
      description: createTodoDto.description ?? '',
      completed: createTodoDto.completed ?? false,
      starred: createTodoDto.starred ?? false,
      priority: createTodoDto.priority ?? TodoPriority.MEDIUM,
      tags: createTodoDto.tags ?? [],
      created: new Date(),
      updated: new Date(),
    };

    this.todos.unshift(todo);
    return todo;
  }

  update(id: string, updateTodoDto: UpdateTodoDto): Todo {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }

    const todo = this.todos[index];
    const updatedTodo = {
      ...todo,
      ...Object.entries(updateTodoDto).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<Todo>),
      updated: new Date(),
    };

    this.todos[index] = updatedTodo;
    return updatedTodo;
  }

  remove(id: string): void {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
    this.todos.splice(index, 1);
  }
}
