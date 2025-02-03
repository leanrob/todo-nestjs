import { TodoPriority } from './dto/create-todo.dto';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  starred: boolean;
  priority: TodoPriority;
  tags: string[];
  created: Date;
  updated: Date;
}
