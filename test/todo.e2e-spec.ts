import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Todo } from '../src/todo/todo.interface';
import { TodoPriority } from '../src/todo/dto/create-todo.dto';

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let createdTodo: Todo;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Enable validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /todos', () => {
    it('should create a new todo', () => {
      const createTodoDto = {
        title: 'E2E Test Todo',
        description: 'Testing with supertest',
        completed: false,
        starred: false,
        priority: TodoPriority.MEDIUM,
        tags: ['e2e', 'test'],
      };

      return request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto)
        .expect(201)
        .expect((response) => {
          const todo = response.body as Todo;
          expect(todo).toHaveProperty('id');
          expect(todo.title).toBe(createTodoDto.title);
          expect(todo.description).toBe(createTodoDto.description);
          expect(todo.completed).toBe(createTodoDto.completed);
          expect(todo.starred).toBe(createTodoDto.starred);
          expect(todo.priority).toBe(createTodoDto.priority);
          expect(todo.tags).toEqual(createTodoDto.tags);
          expect(todo.created).toBeDefined();
          expect(todo.updated).toBeDefined();
          createdTodo = todo;
        });
    });

    it('should validate the request body', () => {
      const invalidTodo = {
        description: 'Missing required title field',
        invalidField: 'This field should cause validation error',
      };

      return request(app.getHttpServer())
        .post('/todos')
        .send(invalidTodo)
        .expect(400)
        .expect((response) => {
          const error = response.body as { message: string[]; error: string };
          expect(error.message).toEqual([
            'property invalidField should not exist',
            'title must be a string',
          ]);
          expect(error.error).toBe('Bad Request');
        });
    });
  });

  describe('GET /todos', () => {
    it('should return an array of todos', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .expect(200)
        .expect((response) => {
          const todos = response.body as Todo[];
          expect(Array.isArray(todos)).toBe(true);
          expect(todos.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a specific todo', () => {
      return request(app.getHttpServer())
        .get(`/todos/${createdTodo.id}`)
        .expect(200)
        .expect((response) => {
          const todo = response.body as Todo;
          expect(todo.id).toBe(createdTodo.id);
          expect(todo.title).toBe(createdTodo.title);
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer())
        .get('/todos/nonexistent-id')
        .expect(404);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo', () => {
      const updateTodoDto = {
        title: 'Updated E2E Test Todo',
        description: 'Updated description',
        priority: TodoPriority.HIGH,
      };

      return request(app.getHttpServer())
        .put(`/todos/${createdTodo.id}`)
        .send(updateTodoDto)
        .expect(200)
        .expect((response) => {
          const todo = response.body as Todo;
          expect(todo.id).toBe(createdTodo.id);
          expect(todo.title).toBe(updateTodoDto.title);
          expect(todo.description).toBe(updateTodoDto.description);
          expect(new Date(todo.updated)).not.toEqual(
            new Date(createdTodo.updated),
          );
        });
    });

    it('should return 404 for updating non-existent todo', () => {
      return request(app.getHttpServer())
        .put('/todos/nonexistent-id')
        .send({ title: 'Updated Title' })
        .expect(404);
    });

    it('should handle partial updates', () => {
      const partialUpdate = {
        title: 'Partially Updated Title',
      };

      return request(app.getHttpServer())
        .put(`/todos/${createdTodo.id}`)
        .send(partialUpdate)
        .expect(200)
        .expect((response) => {
          const todo = response.body as Todo;
          expect(todo.title).toBe(partialUpdate.title);
          // Description should remain unchanged from previous update
          expect(todo.description).toBe('Updated description');
          expect(todo.completed).toBe(createdTodo.completed);
          expect(todo.starred).toBe(createdTodo.starred);
          expect(todo.priority).toBe(TodoPriority.HIGH);
          expect(todo.tags).toEqual(createdTodo.tags);
        });
    });

    it('should validate update data', () => {
      const invalidUpdate = {
        priority: 'invalid-priority',
        invalidField: 'This should cause validation error',
      };

      return request(app.getHttpServer())
        .put(`/todos/${createdTodo.id}`)
        .send(invalidUpdate)
        .expect(400)
        .expect((response) => {
          const error = response.body as { message: string[]; error: string };
          expect(error.message).toEqual([
            'property invalidField should not exist',
            'priority must be one of the following values: low, medium, high',
          ]);
          expect(error.error).toBe('Bad Request');
        });
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', () => {
      return request(app.getHttpServer())
        .delete(`/todos/${createdTodo.id}`)
        .expect(204);
    });

    it('should verify todo was deleted', () => {
      return request(app.getHttpServer())
        .get(`/todos/${createdTodo.id}`)
        .expect(404);
    });

    it('should return 404 for deleting non-existent todo', () => {
      return request(app.getHttpServer())
        .delete('/todos/nonexistent-id')
        .expect(404);
    });
  });
});
