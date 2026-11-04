import type { ITodoType } from '~/types/ITodoType';
import type { ICategoryType } from '~/types/ICategoryType';

export type IStorageDataType = {
  todos?: ITodoType[];
  categories?: ICategoryType[];
  lastSeenVersion?: string;
  [key: string]: unknown;
};
