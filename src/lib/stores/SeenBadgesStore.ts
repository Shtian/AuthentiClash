import storage from './PersistantStorage';

export const seenBadges = storage<string[]>('seenBadges', []);
