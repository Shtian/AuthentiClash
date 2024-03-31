import storage from './PersistantStorage';

export const seenBadges = storage<Array<string>>('seenBadges', []);
