
const SUBSCRIBERS_KEY = 'blog-subscribers';

export const getSubscribers = (): string[] => {
  try {
    const subscribersJson = localStorage.getItem(SUBSCRIBERS_KEY);
    return subscribersJson ? JSON.parse(subscribersJson) : [];
  } catch (e) {
    console.error("Failed to retrieve subscribers from localStorage", e);
    return [];
  }
};

export const addSubscriber = (email: string): void => {
  try {
    const subscribers = getSubscribers();
    if (subscribers.includes(email)) {
      throw new Error('This email is already subscribed.');
    }
    const newSubscribers = [...subscribers, email];
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(newSubscribers));
  } catch(e) {
    console.error("Failed to add subscriber to localStorage", e);
    if (e instanceof Error) throw e;
    throw new Error('Could not add subscriber.');
  }
};
