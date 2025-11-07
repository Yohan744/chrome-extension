import { ICustomEvents } from '~/constants/ICustomEvents';
import ChromeStorageHelper from '~/composables/ChromeStorageHelper';

const events = useGlobalEvents();

class ChromeBadgeHelper {
  private static instance: ChromeBadgeHelper;

  public static getInstance(): ChromeBadgeHelper {
    if (!ChromeBadgeHelper.instance) {
      ChromeBadgeHelper.instance = new ChromeBadgeHelper();
    }
    return ChromeBadgeHelper.instance;
  }

  public async init() {
    const todosCount = (await ChromeStorageHelper.getInstance().getTodos()).length;
    this.updateBadgeText(todosCount);

    events.on(ICustomEvents.taskCreated, async () => {
      const taskCount = (await ChromeStorageHelper.getInstance().getTodos()).length;
      this.updateBadgeText(taskCount);
    });

    events.on(ICustomEvents.taskDeleted, async () => {
      const taskCount = (await ChromeStorageHelper.getInstance().getTodos()).length;
      this.updateBadgeText(taskCount);
    });
  }

  public updateBadgeText(value: number) {
    chrome.action.setBadgeBackgroundColor({ color: value === 0 ? '#AB31ED00' : '#AB31EDFF' });

    chrome.action.setBadgeText({
      text: value === 0 ? '' : value.toString()
    });
  }
}

export default ChromeBadgeHelper;
