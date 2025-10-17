import type { UUID } from 'node:crypto';

export type ICategoryType = {
  id: UUID;
  name: string;
  iconName: string;
  color: string;
};
