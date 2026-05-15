// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				username: string;
				roleId: string;
				email?: string | null;
				name?: string | null;
				photo?: string | null;
				age?: number | null;
			} | null;
			session: import('$lib/app/modules/user/models/user.schema').Session | null;
		}
	} // interface Error {}
	// interface Locals {}
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export { };
