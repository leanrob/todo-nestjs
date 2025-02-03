import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { NotFoundException } from '@nestjs/common';
import { Todo } from './todo.interface';
import { CreateTodoDto, TodoPriority } from './dto/create-todo.dto';

describe('TodoService', () => {
  let service: TodoService;

  const createDefaultTodo = (title: string): CreateTodoDto => ({
    title,
    description: '',
    completed: false,
    starred: false,
    priority: TodoPriority.MEDIUM,
    tags: [],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', () => {
      // Create some test todos
      service.create({
        title: 'Todo 1',
        description: 'Description 1',
        completed: false,
        starred: false,
        priority: TodoPriority.LOW,
        tags: [],
      });
      service.create({
        title: 'Todo 2',
        description: 'Description 2',
        completed: true,
        starred: true,
        priority: TodoPriority.HIGH,
        tags: ['important'],
      });

      const todos: Todo[] = service.findAll();
      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe('Todo 2'); // Should be first due to unshift
      expect(todos[1].title).toBe('Todo 1');
    });

    it('should initially return an empty array', () => {
      const result = service.findAll();
      expect(result).toHaveLength(0);
    });

    it('should maintain order with newest first', () => {
      const todo1 = service.create(createDefaultTodo('First Todo'));
      const todo2 = service.create(createDefaultTodo('Second Todo'));

      const todos = service.findAll();
      expect(todos[0].id).toBe(todo2.id);
      expect(todos[1].id).toBe(todo1.id);
    });
  });

  describe('create', () => {
    it('should create a todo with all required fields', () => {
      const createTodoDto = {
        title: 'New Todo',
        description: 'New Description',
        completed: false,
        starred: false,
        priority: TodoPriority.MEDIUM,
        tags: ['test'],
      };

      const todo = service.create(createTodoDto);

      expect(todo).toEqual({
        ...createTodoDto,
        id: expect.any(String),
        created: expect.any(Date),
        updated: expect.any(Date),
      });
    });

    it('should create a todo with minimal fields', () => {
      const todo = service.create(createDefaultTodo('Minimal Todo'));

      expect(todo).toEqual({
        id: expect.any(String),
        title: 'Minimal Todo',
        description: '',
        completed: false,
        starred: false,
        priority: 'medium',
        tags: [],
        created: expect.any(Date),
        updated: expect.any(Date),
      });
    });

    it('should add the created todo to the beginning of the list', () => {
      const todo1 = service.create(createDefaultTodo('First Todo'));
      const todo2 = service.create(createDefaultTodo('Second Todo'));

      const todos = service.findAll();
      expect(todos[0].id).toBe(todo2.id);
      expect(todos[1].id).toBe(todo1.id);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', () => {
      const createTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        starred: false,
        priority: TodoPriority.MEDIUM,
        tags: ['test'],
      };

      const created = service.create(createTodoDto);
      const found = service.findOne(created.id);

      expect(found).toEqual(created);
    });

    it('should throw NotFoundException when todo is not found', () => {
      expect(() => service.findOne('nonexistent-id')).toThrow(NotFoundException);
    });

    it('should throw NotFoundException with custom message', () => {
      const id = 'nonexistent-id';
      try {
        service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        if (error instanceof NotFoundException) {
          expect(error.message).toBe(`Todo with ID "${id}" not found`);
        }
      }
    });
  });

  describe('update', () => {
    let todo: Todo;

    beforeEach(() => {
      todo = service.create({
        title: 'Original Title',
        description: 'Original Description',
        completed: false,
        starred: false,
        priority: TodoPriority.MEDIUM,
        tags: ['original'],
      });
      // Advance timer by 1 second
      jest.advanceTimersByTime(1000);
    });

    it('should update all provided fields', () => {
      const updateTodoDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
        starred: true,
        priority: TodoPriority.HIGH,
        tags: ['updated'],
      };

      const updated = service.update(todo.id, updateTodoDto);

      expect(updated).toEqual({
        ...todo,
        ...updateTodoDto,
        updated: expect.any(Date),
      });
      expect(updated.updated.getTime()).toBeGreaterThan(todo.updated.getTime());
    });

    it('should update only provided fields', () => {
      const partialUpdate = {
        title: 'Updated Title',
      };

      const updated = service.update(todo.id, partialUpdate);

      expect(updated.title).toBe(partialUpdate.title);
      expect(updated.description).toBe(todo.description);
      expect(updated.completed).toBe(todo.completed);
      expect(updated.starred).toBe(todo.starred);
      expect(updated.priority).toBe(todo.priority);
      expect(updated.tags).toEqual(todo.tags);
      expect(updated.updated.getTime()).toBeGreaterThan(todo.updated.getTime());
    });

    it('should throw NotFoundException when updating non-existent todo', () => {
      expect(() =>
        service.update('nonexistent-id', { title: 'Updated' }),
      ).toThrow(NotFoundException);
    });

    it('should maintain the same ID after update', () => {
      const updated = service.update(todo.id, { title: 'New Title' });
      expect(updated.id).toBe(todo.id);
    });
  });

  describe('remove', () => {
    it('should remove a todo', () => {
      const todo = service.create(createDefaultTodo('Todo to Remove'));

      service.remove(todo.id);
      expect(() => service.findOne(todo.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when removing non-existent todo', () => {
      expect(() => service.remove('nonexistent-id')).toThrow(NotFoundException);
    });

    it('should reduce the total count of todos', () => {
      const todo = service.create(createDefaultTodo('Todo to Remove'));
      const initialCount = service.findAll().length;

      service.remove(todo.id);
      const finalCount = service.findAll().length;

      expect(finalCount).toBe(initialCount - 1);
    });

    it('should remove only the specified todo', () => {
      const todo1 = service.create(createDefaultTodo('Todo 1'));
      const todo2 = service.create(createDefaultTodo('Todo 2'));
      const todo3 = service.create(createDefaultTodo('Todo 3'));

      service.remove(todo2.id);

      const remainingTodos = service.findAll();
      expect(remainingTodos).toHaveLength(2);
      expect(remainingTodos.map(t => t.id)).toEqual([todo3.id, todo1.id]);
    });
  });
}); 