export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  starred: boolean;
  created: Date;
  updated: Date;
  priority: 'low' | 'medium' | 'high'; // Additional property that might be useful
  tags: string[]; // Additional property for categorization
}

export const mockTodos: Todo[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Complete Project Proposal',
    description: 'Draft and finalize the Q1 project proposal for the new client dashboard',
    completed: false,
    starred: true,
    created: new Date('2024-01-28T09:00:00Z'),
    updated: new Date('2024-01-29T14:30:00Z'),
    priority: 'high',
    tags: ['work', 'client', 'urgent']
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    title: 'Grocery Shopping',
    description: 'Buy groceries for the week: vegetables, fruits, and household items',
    completed: true,
    starred: false,
    created: new Date('2024-01-25T15:00:00Z'),
    updated: new Date('2024-01-25T18:45:00Z'),
    priority: 'low',
    tags: ['personal', 'shopping']
  },
  {
    id: '323e4567-e89b-12d3-a456-426614174002',
    title: 'Review Pull Requests',
    description: 'Review and provide feedback on team members\' pull requests for the API integration',
    completed: false,
    starred: true,
    created: new Date('2024-01-29T11:00:00Z'),
    updated: new Date('2024-01-29T11:00:00Z'),
    priority: 'medium',
    tags: ['work', 'code-review']
  },
  {
    id: '423e4567-e89b-12d3-a456-426614174003',
    title: 'Schedule Dentist Appointment',
    description: 'Call dental office to schedule annual checkup and cleaning',
    completed: false,
    starred: false,
    created: new Date('2024-01-27T10:15:00Z'),
    updated: new Date('2024-01-27T10:15:00Z'),
    priority: 'medium',
    tags: ['personal', 'health']
  },
  {
    id: '523e4567-e89b-12d3-a456-426614174004',
    title: 'Prepare Tech Talk',
    description: 'Create presentation slides and demo for the upcoming tech talk on Next.js and NestJS integration',
    completed: false,
    starred: true,
    created: new Date('2024-01-26T13:20:00Z'),
    updated: new Date('2024-01-30T09:45:00Z'),
    priority: 'high',
    tags: ['work', 'presentation', 'learning']
  }
]; 