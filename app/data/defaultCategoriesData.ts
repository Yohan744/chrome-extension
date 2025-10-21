import type { ICategoryType } from '~/types/ICategoryType';

const defaultCategoriesData: ICategoryType[] = [
  {
    id: '0010f75f-a962-4084-9680-06e9d18a7707',
    name: 'food',
    iconName: 'cookie',
    color: '#f4686a'
  },
  {
    id: '6c06ee36-296f-4391-b1f2-e634092e5c97',
    name: 'workout',
    iconName: 'dumbbell',
    color: '#e79131'
  },
  {
    id: 'fbab4d47-c9b6-4d3f-b901-5ab007c0e2e4',
    name: 'work',
    iconName: 'briefcase-business',
    color: '#6254f4'
  },
  {
    id: '2fe81fbc-c89a-41a7-b277-706f69ee1505',
    name: 'education',
    iconName: 'utensils',
    color: '#234cb5'
  },
  {
    id: '3200dc7f-006f-45fc-afd4-0c3d8f3ded9b',
    name: 'other',
    iconName: 'ellipsis',
    color: '#2abfd0'
  }
];

export default defaultCategoriesData;
