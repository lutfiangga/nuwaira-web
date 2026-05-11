export function logDbError(context: string, error: unknown) {
	console.error(`[db] ${context} failed`, error);
}

export async function withDbFallback<T>(
	context: string,
	run: () => Promise<T>,
	fallback: T
): Promise<T> {
	try {
		return await run();
	} catch (error) {
		logDbError(context, error);
		return fallback;
	}
}

export async function withDbNullable<T>(context: string, run: () => Promise<T>): Promise<T | null> {
	try {
		return await run();
	} catch (error) {
		logDbError(context, error);
		return null;
	}
}
