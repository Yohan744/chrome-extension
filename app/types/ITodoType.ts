import type { UUID } from 'node:crypto';

export type ITodoType = {
  id: UUID;
  task: string;
  categoryId: UUID;
  order: number;
  hour?: string;
};
