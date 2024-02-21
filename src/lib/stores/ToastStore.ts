import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

type NotificationType = 'success' | 'error' | 'warning' | 'info';
type Toast = {
	id: string;
	message: string;
	duration: number;
	type: NotificationType;
};

type ToastOptions = Omit<Toast, 'id' | 'duration'> & Partial<Pick<Toast, 'duration'>>;

const newToast = () => {
	const { update, subscribe } = writable<Toast[]>([]);

	function send({ message, type, duration = 5000 }: ToastOptions) {
		const newContent: Toast = { id: uuidv4(), message, type, duration };
		update((store) => [...store, newContent]);
	}

	function remove(id: string | null = null) {
		update((store) => {
			if (id) return store.filter((item) => item.id !== id);
			const [, ...rest] = store;
			return [...rest];
		});
	}

	return { subscribe, send, remove };
};

export const toast = newToast();
