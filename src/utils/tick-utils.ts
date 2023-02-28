/* eslint-disable @typescript-eslint/no-inferrable-types */

export interface Tick {
	tick: (deltaTime: number) => void;
}

const now = typeof Date.now === 'function' ? () => Date.now() : () => new Date().getTime();

export class Ticker {
	private targetFPS = 0;
	private measuredFPS = 0;
	private paused: boolean = false;
	private lastTime = 0;
	private tickTime = 0;
	private tickCount = 0;
	private tickers: Tick[] = [];

	pause(): this {
		this.paused = true;
		return this;
	}

	resume(): this {
		this.paused = false;
		return this;
	}

	getMeasuredFPS() {
		return Math.min(this.measuredFPS, this.targetFPS);
	}

	addTick(ticker: Tick): this {
		this.tickers.push(ticker);
		return this;
	}

	removeTick(ticker: Tick): this {
		this.tickers = this.tickers.filter((tick) => tick !== ticker);
		return this;
	}

	nextTick(cb: (dt: number) => void) {
		const tickObj: Tick = {
			tick: (dt) => {
				this.removeTick(tickObj);
				cb(dt);
			},
		};

		return this.addTick(tickObj);
	}

	timeout(cb: () => void, duration: number): this {
		const targetTime = now() + duration;

		const tickObj: Tick = {
			tick: () => {
				const nowTime = now();
				const dt = nowTime - targetTime;
				if (dt >= 0) {
					this.removeTick(tickObj);
					cb();
				}
			},
		};

		return this.addTick(tickObj);
	}

	interval(cb: () => void, duration: number): Tick {
		let targetTime = now() + duration;

		const tickObj: Tick = {
			tick: () => {
				let nowTime = now();
				const dt = nowTime - targetTime;

				if (dt >= 0) {
					if (dt < duration) {
						nowTime -= dt;
					}
					targetTime = nowTime + duration;
					cb();
				}
			},
		};

		this.addTick(tickObj);

		return tickObj;
	}

	tick() {
		if (this.paused) {
			return;
		}

		const startTime = now();
		const deltaTime = startTime - this.lastTime;

		// calculates the real fps
		if (++this.tickCount >= this.targetFPS) {
			/* tslint:disable-next-line:no-bitwise */
			this.measuredFPS = (1000 / (this.tickTime / this.tickCount) + 0.5) >> 0;
			this.tickCount = 0;
			this.tickTime = 0;
		} else {
			this.tickTime += startTime - this.lastTime;
		}

		this.lastTime = startTime;

		for (const t of [...this.tickers]) {
			t.tick(deltaTime);
		}
	}
}
