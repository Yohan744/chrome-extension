import type { IStorageDataType } from '~/types/IStorageDataType';
import type { ITodoType } from '~/types/ITodoType';
import type { ICategoryType } from '~/types/ICategoryType';
import defaultCategoriesData from '~/data/defaultCategoriesData';
import type { IOldTodoType } from '~/types/IOldTodoType';
import oldCategoriesData from '~/data/oldCategoriesData';

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

  public async clearAllStorage(): Promise<void> {
    const s = getChromeStorage();
    if (!s) return;
    await s.clear();
  }

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
  }

  public async getAllStorage(): Promise<{ todos: ITodoType[]; categories: ICategoryType[] }> {
    return await storageGet();
  }

  //////////////////////////////////////////////////////////////////////////////////

  public async getTodos(): Promise<ITodoType[]> {
    const { todos } = await storageGet<{ todos?: ITodoType[] }>(['todos']);
    return Array.isArray(todos) ? todos : [];
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

  //////////////////////////////////////////////////////////////////////////////////

  public async getCategories(): Promise<ICategoryType[]> {
    const { categories } = await storageGet<{ categories?: ICategoryType[] }>(['categories']);
    return Array.isArray(categories) ? categories : [];
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

  public async addOldTodo(oldTodos: IOldTodoType): Promise<void> {
    const s = getChromeStorage();
    if (!s) return;
    await s.set({ [Math.floor(Math.random() * 100)]: oldTodos });
  }

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
        Array.isArray(oldCategoriesData) &&
        oldCategoriesData.includes(val.category.toLowerCase() as string)
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
      const categoryId = nameToId.get(catName) ?? nameToId.get('others') ?? crypto.randomUUID();
      next.push({
        id: crypto.randomUUID(),
        task: item.task,
        categoryId,
        order: ++orderBase
      } as ITodoType);
    }

    await this.setTodos(next);
    await storageRemove(oldKeys);

    console.log(`Migrated ${oldItems.length} old todos.`);
    console.log(`Removed old keys: ${oldKeys.join(', ')}`);

    return { migrated: oldItems.length, removedKeys: oldKeys };
  }
}

export default ChromeStorageHelper;
