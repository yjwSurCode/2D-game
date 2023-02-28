import script from 'scriptjs';
import { RwMutex } from './mutex-utils';

const scriptCache = new Map<string, RwMutex>();

export async function loadScript(path: string): Promise<void> {
	let mutex = scriptCache.get(path);

	if (mutex == null) {
		mutex = new RwMutex();
		scriptCache.set(path, mutex);

		const unlock = await mutex.writeLock();

		await new Promise<void>((resolve) => {
			script(path, () => {
				resolve();
			});
		});

		unlock();
	} else {
		const unlock = await mutex.readLock();
		unlock();
	}
}

const imageCache = new Map<string, RwMutex>();

export async function loadImage(path: string): Promise<void> {
	let mutex = imageCache.get(path);

	if (mutex == null) {
		mutex = new RwMutex();
		imageCache.set(path, mutex);

		const unlock = await mutex.writeLock();

		const err = await new Promise<any>((resolve) => {
			const img = new Image();

			img.onload = () => {
				resolve(null);
			};

			img.onerror = (err) => {
				resolve(err);
			};

			img.src = path;
		});

		unlock();

		if (err) {
			throw err;
		}
	} else {
		const unlock = await mutex.readLock();
		unlock();
	}
}
