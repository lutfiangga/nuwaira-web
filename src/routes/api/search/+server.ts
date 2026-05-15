import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UserService } from '$lib/app/modules/user/services/user.service';
import { StudentService } from '$lib/app/modules/student/services/student.service';
import { BootcampClassService } from '$lib/app/modules/bootcamp-class/services/bootcamp-class.service';
import { EnrollmentService } from '$lib/app/modules/enrollment/services/enrollment.service';
import { ClassMaterialService } from '$lib/app/modules/class-material/services/class-material.service';

export const GET: RequestHandler = async ({ url, locals }) => {
	const q = url.searchParams.get('q')?.trim();
	if (!q || q.length < 2) return json({ results: [] });

	const [users, students, classes, enrollments, materials] = await Promise.all([
		UserService.getAll({ search: q, pageSize: 3, page: 1, sort: 'username' }).catch(() => ({ users: [], total: 0 })),
		Promise.resolve(StudentService.getAll()).catch(() => []).then(all => {
			const s = (all as any[]);
			const term = q.toLowerCase();
			return s.filter((i: any) =>
				i.fullName?.toLowerCase().includes(term) ||
				i.studentCode?.toLowerCase().includes(term) ||
				i.email?.toLowerCase().includes(term)
			).slice(0, 3);
		}),
		Promise.resolve(BootcampClassService.getAll()).catch(() => []).then(all => {
			const s = (all as any[]);
			const term = q.toLowerCase();
			return s.filter((i: any) =>
				i.title?.toLowerCase().includes(term) ||
				i.code?.toLowerCase().includes(term)
			).slice(0, 3);
		}),
		Promise.resolve(EnrollmentService.getAll()).catch(() => []).then(all => {
			const s = (all as any[]);
			const term = q.toLowerCase();
			return s.filter((i: any) => i.studentName?.toLowerCase().includes(term) || i.classTitle?.toLowerCase().includes(term)).slice(0, 3);
		}),
		Promise.resolve(ClassMaterialService.getAll()).catch(() => []).then(all => {
			const s = (all as any[]);
			const term = q.toLowerCase();
			return s.filter((i: any) => i.title?.toLowerCase().includes(term)).slice(0, 3);
		})
	]);

	const results: { title: string; subtitle: string; href: string; module: string }[] = [];

	(users.users ?? []).forEach((u: any) => results.push({
		title: u.username,
		subtitle: u.email || u.name || '',
		href: '/users',
		module: 'Users'
	}));

	(students as any[]).forEach((s: any) => results.push({
		title: s.fullName,
		subtitle: s.studentCode || '',
		href: '/students',
		module: 'Students'
	}));

	(classes as any[]).forEach((c: any) => results.push({
		title: c.title,
		subtitle: c.code || '',
		href: '/classes',
		module: 'Classes'
	}));

	(enrollments as any[]).forEach((e: any) => results.push({
		title: `${e.studentName || '-'} → ${e.classTitle || '-'}`,
		subtitle: e.status || '',
		href: '/enrollments',
		module: 'Enrollments'
	}));

	(materials as any[]).forEach((m: any) => results.push({
		title: m.title,
		subtitle: m.materialType || '',
		href: '/materials',
		module: 'Materials'
	}));

	return json({ results: results.slice(0, 10) });
};
