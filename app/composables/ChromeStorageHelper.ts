import type { IStorageDataType } from '~/types/IStorageDataType';
import type { ITodoType } from '~/types/ITodoType';
import type { ICategoryType } from '~/types/ICategoryType';
import defaultCategoriesData from '~/data/defaultCategoriesData';
import type { IOldTodoType } from '~/types/IOldTodoType';
import oldCategoriesNameData from '~/data/oldCategoriesNameData';
import { useGlobalEvents } from '~/composables/GlobalEvents';
import { ICustomEvents } from '~/constants/ICustomEvents';

const events = useGlobalEvents();

function getChromeStorage(): chrome.storage.StorageArea | null {
  const hasChrome = typeof chrome !== 'undefined' && !!chrome.storage?.sync;
  return hasChrome ? chrome.storage.sync : null;
}

async function storageGet<T = IStorageDataType>(keys?: string[] | string | null): Promise<T> {
  const s = getChromeStorage();
  if (!s) return {} as T;
  return new Promise<T>((resolve, reject) => {
    s.get(keys ?? null, result => {
      if (chrome.runtime && chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result as T);
      }
    });
  });
}

async function storageSet(data: Partial<IStorageDataType>): Promise<void> {
  const s = getChromeStorage();
  if (!s) return;
  await s.set(data);
}

async function storageRemove(keys: string[]): Promise<void> {
  const s = getChromeStorage();
  if (!s || !keys.length) return;
  await new Promise<void>((resolve, reject) => {
    s.remove(keys, () => {
      if (chrome.runtime && chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

class ChromeStorageHelper {
  private static instance: ChromeStorageHelper;

  public static getInstance(): ChromeStorageHelper {
    if (!ChromeStorageHelper.instance) {
      ChromeStorageHelper.instance = new ChromeStorageHelper();
    }
    return ChromeStorageHelper.instance;
  }

  // public async clearAllStorage(): Promise<void> {
  //   const s = getChromeStorage();
  //   if (!s) return;
  //   await s.clear();
  // }

  public async initDefaultStorage(): Promise<void> {
    const { todos, categories } = await storageGet<{ todos?: ITodoType[]; categories?: ICategoryType[] }>([
      'todos',
      'categories'
    ]);

    const updates: Partial<{ todos: ITodoType[]; categories: ICategoryType[] }> = {};

    if (!Array.isArray(todos)) {
      updates.todos = [];
    }
    if (!Array.isArray(categories)) {
      await storageSet({ categories: defaultCategoriesData });
    }

    if (Object.keys(updates).length > 0) {
      await storageSet(updates);
    }

    events.trigger(ICustomEvents.storageInitiated);
  }

  // public async getAllStorage(): Promise<{ todos: ITodoType[]; categories: ICategoryType[] }> {
  //   return await storageGet();
  // }

  public async getStorageUsage(): Promise<{ total: number; byKey: Record<string, number> }> {
    const s = getChromeStorage();
    if (!s) return { total: 0, byKey: {} };

    const total = await new Promise<number>(resolve => {
      s.getBytesInUse(null, bytes => resolve(bytes));
    });

    const keys = ['todos', 'categories'];
    const byKey: Record<string, number> = {};

    for (const key of keys) {
      byKey[key] = await new Promise<number>(resolve => {
        s.getBytesInUse(key, bytes => resolve(bytes));
      });
    }

    return { total, byKey };
  }

  //////////////////////////////////////////////////////////////////////////////////

  public async getTodos(): Promise<ITodoType[]> {
    const { todos } = await storageGet<{ todos?: ITodoType[] }>(['todos']);
    return Array.isArray(todos) ? todos : [];
  }

  public async getBiggestOrderNumberInTodos(): Promise<number> {
    const todos = await this.getTodos();
    if (todos.length === 0) return 0;
    return Math.max(...todos.map(t => t.order || 0));
  }

  public async setTodos(next: ITodoType[]): Promise<void> {
    await storageSet({ todos: next });
  }

  public async addTodo(todo: ITodoType): Promise<ITodoType[]> {
    const current = await this.getTodos();
    const next = [...current, todo];
    await this.setTodos(next);
    return next;
  }

  public async deleteTodo(id: ITodoType['id']): Promise<ITodoType[]> {
    const current = await this.getTodos();
    const next = current.filter(t => t.id !== id);
    await this.setTodos(next);
    return next;
  }

  public async getTodoOrderById(id: ITodoType['id']): Promise<number | null> {
    const todos = await this.getTodos();
    const todo = todos.find(t => t.id === id);
    return todo ? todo.order || 0 : null;
  }

  public async updateTodosOrder(todos: ITodoType[]): Promise<void> {
    const orderedTodos = todos.map((todo, index) => ({
      ...todo,
      order: index
    }));
    await this.setTodos(orderedTodos);
  }

  //////////////////////////////////////////////////////////////////////////////////

  public async getCategories(): Promise<ICategoryType[]> {
    const { categories } = await storageGet<{ categories?: ICategoryType[] }>(['categories']);
    return Array.isArray(categories) ? categories : [];
  }

  public async getCategoryById(id: ICategoryType['id']): Promise<ICategoryType | null> {
    const categories = await this.getCategories();
    const category = categories.find(c => c.id === id);
    return category || null;
  }

  public async getCategoryByName(name: ICategoryType['name']): Promise<ICategoryType | null> {
    const categories = await this.getCategories();
    const category = categories.find(c => c.name === name);
    return category || null;
  }

  public async updateCategory(id: ICategoryType['id'], updates: Partial<ICategoryType>): Promise<ICategoryType[]> {
    const current = await this.getCategories();
    const next = current.map(c => (c.id === id ? { ...c, ...updates } : c));
    await this.setCategories(next);
    return next;
  }

  public async setCategories(next: ICategoryType[]): Promise<void> {
    await storageSet({ categories: next });
  }

  public async addCategory(category: ICategoryType): Promise<ICategoryType[]> {
    const current = await this.getCategories();
    const next = [...current, category];
    await this.setCategories(next);
    return next;
  }

  public async deleteCategory(id: ICategoryType['id']): Promise<ICategoryType[]> {
    const current = await this.getCategories();
    const next = current.filter(c => c.id !== id);
    await this.setCategories(next);
    return next;
  }

  //////////////////////////////////////////////////////////////////////////////////

  public async migrateOldTodos(): Promise<{ migrated: number; removedKeys: string[] }> {
    await this.initDefaultStorage();

    const all = await storageGet<Record<string, unknown>>(null);

    const categories = (await this.getCategories()) ?? defaultCategoriesData;
    const nameToId = new Map<string, string>();
    categories.forEach(c => nameToId.set((c.name || '').toLowerCase(), c.id as unknown as string));

    const candidateKeys = Object.keys(all).filter(k => k !== 'todos' && k !== 'categories');
    const oldKeys: string[] = [];
    const oldItems: IOldTodoType[] = [];

    for (const key of candidateKeys) {
      const val = all[key] as IOldTodoType;
      if (
        val &&
        typeof val === 'object' &&
        Array.isArray(oldCategoriesNameData) &&
        oldCategoriesNameData.includes(val.category.toLowerCase() as string)
      ) {
        oldKeys.push(key);
        oldItems.push(val as IOldTodoType);
      }
    }

    if (oldItems.length === 0) {
      console.log('rien à migrer');
      return { migrated: 0, removedKeys: [] };
    }

    const existing = await this.getTodos();
    const next: ITodoType[] = [...existing];
    let orderBase = existing.length;

    for (const item of oldItems) {
      const catName = (item.category || '').toLowerCase();
      const categoryId = nameToId.get(catName) ?? nameToId.get('other') ?? crypto.randomUUID();
      next.push({
        id: crypto.randomUUID(),
        task: item.task,
        categoryId,
        order: ++orderBase
      } as ITodoType);
    }

    await this.setTodos(next);
    await storageRemove(oldKeys);

    events.trigger(ICustomEvents.migrationDone);

    console.log(`Migrated ${oldItems.length} old todos.`);
    console.log(`Removed old keys: ${oldKeys.join(', ')}`);

    return { migrated: oldItems.length, removedKeys: oldKeys };
  }
}

export default ChromeStorageHelper;
