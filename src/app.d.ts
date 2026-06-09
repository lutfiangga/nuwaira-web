declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				role: string;
				email?: string | null;
				name?: string | null;
				photo?: string | null;
				phone?: string | null;
				studentType?: string | null;
			} | null;
			session: import('$lib/app/modules/user/models/user.schema').Session | null;
		}
	}

	interface Window {
		turnstile?: {
			render: (container: HTMLElement, options: Record<string, unknown>) => string;
			remove: (widgetId: string) => void;
			reset: (widgetId?: string) => void;
		};
	}
}

export {};
