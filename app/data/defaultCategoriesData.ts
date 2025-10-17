import type { ICategoryType } from '~/types/ICategoryType';

const defaultCategoriesData: ICategoryType[] = [
  {
    id: crypto.randomUUID(),
    name: 'food',
    iconName: 'test',
    color: '#FF5733'
  },
  {
    id: crypto.randomUUID(),
    name: 'workout',
    iconName: 'test',
    color: '#FF5733'
  },
  {
    id: crypto.randomUUID(),
    name: 'work',
    iconName: 'test',
    color: '#FF5733'
  },
  {
    id: crypto.randomUUID(),
    name: 'education',
    iconName: 'test',
    color: '#FF5733'
  },
  {
    id: crypto.randomUUID(),
    name: 'others',
    iconName: 'test',
    color: '#FF5733'
  }
];

export default defaultCategoriesData;
