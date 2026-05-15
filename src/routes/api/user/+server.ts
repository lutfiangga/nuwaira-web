// src/routes/api/user/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/app/database';
import { eq, like, asc, desc } from 'drizzle-orm';

import { user } from '$lib/app/database/schema';
import { hashPassword } from '$lib/app/server/auth';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';

// --- GET (pagination, sorting, search) ---
export const GET: RequestHandler = async ({ url }) => {
	console.log("GET /api/user");

	const page = Number(url.searchParams.get("page") ?? 1);
	const limit = Number(url.searchParams.get("limit") ?? 10);
	const sort = url.searchParams.get("sort") ?? "username";
	const order = url.searchParams.get("order") ?? "asc";
	const search = url.searchParams.get("search") ?? "";

	const offset = (page - 1) * limit;

	// Safe sort mapping
	const sortMap: Record<string, any> = {
		username: user.username,
		age: user.age,
		id: user.id
	};

	const sortCol = sortMap[sort] || user.username;

	try {
		const rows = await db.query.user.findMany({
			where: search
				? like(user.username, `%${search}%`)
				: undefined,
			orderBy: order === "asc" ? asc(sortCol) : desc(sortCol),
			limit,
			offset
		});

		const total = await db.select().from(user);

		return new Response(
			JSON.stringify({
				data: rows,
				pagination: {
					page,
					limit,
					total: total.length
				}
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("GET /api/user error:", error);
		return new Response(
			JSON.stringify({
				data: [],
				pagination: { page, limit, total: 0 },
				message: "Database is unavailable"
			}),
			{ status: 200 }
		);
	}
};

// --- POST (create user) ---
export const POST: RequestHandler = async ({ request }) => {
	console.log("POST /api/user");

	const body = await request.json();
	const { id, username, password, age, email, roleId } = body;

	if (!id || !username || !password) {
		return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
	}

	try {
		const passwordHash = await hashPassword(password);
		const fallbackRoleId = await RbacService.getDefaultRegisterRoleId();

		await db.insert(user).values({
			id,
			username,
			email: email || `${username}@example.com`,
			roleId: roleId || fallbackRoleId,
			passwordHash,
			age
		});

		return new Response(JSON.stringify({ message: "User created" }), { status: 201 });
	} catch (error) {
		console.error("POST /api/user error:", error);
		return new Response(JSON.stringify({ error: "Database is unavailable" }), { status: 503 });
	}
};

// --- PUT (update user) ---
export const PUT: RequestHandler = async ({ request }) => {
	console.log("PUT /api/user");

	const body = await request.json();
	const { id, username, password, age, email, roleId } = body;

	if (!id) {
		return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });
	}

	try {
		const updateData: any = {
			username,
			email,
			roleId,
			age
		};

		if (password) {
			updateData.passwordHash = await hashPassword(password);
		}

		await db.update(user)
			.set(updateData)
			.where(eq(user.id, id));

		return new Response(JSON.stringify({ message: "User updated" }), { status: 200 });
	} catch (error) {
		console.error("PUT /api/user error:", error);
		return new Response(JSON.stringify({ error: "Database is unavailable" }), { status: 503 });
	}
};

// --- DELETE (bulk delete) ---
export const DELETE: RequestHandler = async ({ request }) => {
	console.log("DELETE /api/user");

	const body = await request.json();
	const { ids } = body;

	if (!ids || ids.length === 0) {
		return new Response(JSON.stringify({ error: "IDs required" }), { status: 400 });
	}

	try {
		for (const id of ids) {
			await db.delete(user).where(eq(user.id, id));
		}

		return new Response(
			JSON.stringify({ message: "Deleted", count: ids.length }),
			{ status: 200 }
		);
	} catch (error) {
		console.error("DELETE /api/user error:", error);
		return new Response(JSON.stringify({ error: "Database is unavailable" }), { status: 503 });
	}
};
