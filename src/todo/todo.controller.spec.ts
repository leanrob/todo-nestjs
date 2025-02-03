import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { NotFoundException } from '@nestjs/common';
import { Todo } from './todo.interface';
import { CreateTodoDto, TodoPriority } from './dto/create-todo.dto';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    starred: false,
    priority: TodoPriority.MEDIUM,
    tags: ['test'],
    created: new Date(),
    updated: new Date(),
  };

  const mockTodoService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', () => {
      const todos = [mockTodo];
      mockTodoService.findAll.mockReturnValue(todos);

      const result = controller.findAll();

      expect(result).toBe(todos);
      expect(mockTodoService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no todos exist', () => {
      mockTodoService.findAll.mockReturnValue([]);

      const result = controller.findAll();

      expect(result).toEqual([]);
      expect(mockTodoService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', () => {
      mockTodoService.findOne.mockReturnValue(mockTodo);

      const result = controller.findOne('1');

      expect(result).toBe(mockTodo);
      expect(mockTodoService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when todo is not found', () => {
      mockTodoService.findOne.mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.findOne('nonexistent-id')).toThrow(
        NotFoundException,
      );
      expect(mockTodoService.findOne).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('create', () => {
    it('should create a todo', () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        starred: false,
        priority: TodoPriority.MEDIUM,
        tags: ['test'],
      };

      const mockTodo: Todo = {
        id: '1',
        title: createTodoDto.title,
        description: createTodoDto.description ?? '',
        completed: createTodoDto.completed ?? false,
        starred: createTodoDto.starred ?? false,
        priority: createTodoDto.priority ?? TodoPriority.MEDIUM,
        tags: createTodoDto.tags ?? [],
        created: new Date(),
        updated: new Date(),
      };

      jest.spyOn(service, 'create').mockReturnValue(mockTodo);

      const result = controller.create(createTodoDto);
      expect(result).toBe(mockTodo);
    });

    it('should return the created todo with all required properties', () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        starred: false,
        priority: TodoPriority.MEDIUM,
        tags: ['test'],
      };

      const mockTodo: Todo = {
        id: '1',
        title: createTodoDto.title,
        description: createTodoDto.description ?? '',
        completed: createTodoDto.completed ?? false,
        starred: createTodoDto.starred ?? false,
        priority: createTodoDto.priority ?? TodoPriority.MEDIUM,
        tags: createTodoDto.tags ?? [],
        created: new Date(),
        updated: new Date(),
      };

      jest.spyOn(service, 'create').mockReturnValue(mockTodo);

      const result = controller.create(createTodoDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('created');
      expect(result).toHaveProperty('updated');
    });
  });

  describe('update', () => {
    const updateTodoDto = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    it('should update a todo', () => {
      const updatedTodo = { ...mockTodo, ...updateTodoDto };
      mockTodoService.update.mockReturnValue(updatedTodo);

      const result = controller.update('1', updateTodoDto);

      expect(result).toBe(updatedTodo);
      expect(mockTodoService.update).toHaveBeenCalledWith('1', updateTodoDto);
    });

    it('should throw NotFoundException when updating non-existent todo', () => {
      mockTodoService.update.mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.update('nonexistent-id', updateTodoDto)).toThrow(
        NotFoundException,
      );
      expect(mockTodoService.update).toHaveBeenCalledWith(
        'nonexistent-id',
        updateTodoDto,
      );
    });

    it('should update only provided fields', () => {
      const partialUpdate = { title: 'Updated Title' };
      const updatedTodo = { ...mockTodo, ...partialUpdate };
      mockTodoService.update.mockReturnValue(updatedTodo);

      const result = controller.update('1', partialUpdate);

      expect(result.title).toBe(partialUpdate.title);
      expect(result.description).toBe(mockTodo.description);
      expect(mockTodoService.update).toHaveBeenCalledWith('1', partialUpdate);
    });
  });

  describe('remove', () => {
    it('should remove a todo', () => {
      mockTodoService.remove.mockReturnValue(undefined);

      const result = controller.remove('1');

      expect(result).toBeUndefined();
      expect(mockTodoService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when removing non-existent todo', () => {
      mockTodoService.remove.mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.remove('nonexistent-id')).toThrow(
        NotFoundException,
      );
      expect(mockTodoService.remove).toHaveBeenCalledWith('nonexistent-id');
    });
  });
});
