export class Mutex {
	private locker: Promise<void> | null = null;

	async lock(): Promise<() => void> {
		if (this.locker != null) {
			await this.locker;
			return this.lock();
		}

		let unlocked = false;
		let resolve: () => void;

		const promise = new Promise<void>((r) => {
			resolve = r;
		});

		const unLock = () => {
			if (unlocked) {
				return;
			}

			unlocked = true;

			if (this.locker === promise) {
				this.locker = null;
			}

			resolve();
		};

		this.locker = promise;

		return unLock;
	}
}

export class RwMutex {
	private locker: Promise<void> | null = null;
	private readLocks: Array<Promise<void>> = [];

	async writeLock(): Promise<() => void> {
		if (this.locker != null) {
			await this.locker;
			return this.writeLock();
		}

		if (this.readLock.length) {
			await Promise.all(this.readLocks);
			return this.writeLock();
		}

		let unlocked = false;
		let resolve: () => void;

		const promise = new Promise<void>((r) => {
			resolve = r;
		});

		const unLock = () => {
			if (unlocked) {
				return;
			}

			unlocked = true;

			if (this.locker === promise) {
				this.locker = null;
			}

			resolve();
		};

		this.locker = promise;

		return unLock;
	}

	async readLock(): Promise<() => void> {
		if (this.locker != null) {
			await this.locker;
			return this.readLock();
		}

		let unlocked = false;
		let resolve: () => void;

		const promise = new Promise<void>((r) => {
			resolve = r;
		});

		const unLock = () => {
			if (unlocked) {
				return;
			}

			unlocked = true;

			const index = this.readLocks.indexOf(promise);

			if (index >= 0) {
				this.readLocks.splice(index, 1);
			}

			resolve();
		};

		this.readLocks.push(promise);

		return unLock;
	}
}
