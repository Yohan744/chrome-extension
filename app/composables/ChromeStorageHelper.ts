import type { IStorageDataType } from '~/types/IStorageDataType';
import type { ITodoType } from '~/types/ITodoType';
import type { ICategoryType } from '~/types/ICategoryType';

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
      console.log('les catégories sont vides');
      await this.initDefaultCategories();
    }

    if (Object.keys(updates).length > 0) {
      await storageSet(updates);
    }
  }

  public async getAllStorage(): Promise<{ todos: ITodoType[]; categories: ICategoryType[] }> {
    const { todos, categories } = await storageGet<{ todos?: ITodoType[]; categories?: ICategoryType[] }>([
      'todos',
      'categories'
    ]);
    return {
      todos: Array.isArray(todos) ? todos : [],
      categories: Array.isArray(categories) ? categories : []
    };
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

  public async initDefaultCategories(): Promise<void> {
    const { categories } = await storageGet<{ categories?: ICategoryType[] }>(['categories']);

    if (!Array.isArray(categories)) {
      console.log('initialisation des catégories par défaut');
      await storageSet({ categories: [] });
    }
  }

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
}

export default ChromeStorageHelper;
