import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { requirePermission } from '$lib/app/middleware';
import { UserService } from '$lib/app/modules/user/services/user.service';
import { StudentService } from '$lib/app/modules/student/services/student.service';
import { BootcampClassService } from '$lib/app/modules/bootcamp-class/services/bootcamp-class.service';
import { EnrollmentService } from '$lib/app/modules/enrollment/services/enrollment.service';
import { ClassMaterialService } from '$lib/app/modules/class-material/services/class-material.service';

const getCountBy = <T>(items: T[], predicate: (item: T) => boolean) =>
	items.reduce((total, item) => total + Number(predicate(item)), 0);

export const load: PageServerLoad = async (event) => {
	await requirePermission(event, 'dashboard', 'read');
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const [usersResult, students, classes, enrollments, materials] = await Promise.all([
		UserService.getAll({ page: 1, pageSize: 6, sort: 'username', order: 'asc' }),
		StudentService.getAll(),
		BootcampClassService.getAll(),
		EnrollmentService.getAll(),
		ClassMaterialService.getAll()
	]);

	const moduleStats = [
		{ key: 'users', label: 'Users', href: '/users', value: usersResult.total },
		{ key: 'students', label: 'Students', href: '/students', value: students.length },
		{ key: 'classes', label: 'Classes', href: '/classes', value: classes.length },
		{ key: 'enrollments', label: 'Enrollments', href: '/enrollments', value: enrollments.length },
		{ key: 'materials', label: 'Materials', href: '/materials', value: materials.length }
	];

	const healthCards = [
		{
			key: 'activeStudents',
			label: 'Active Students',
			value: getCountBy(students, (item) => item.status === 'active')
		},
		{
			key: 'activeClasses',
			label: 'Active Classes',
			value: getCountBy(classes, (item) => item.status === 'active')
		},
		{
			key: 'activeEnrollments',
			label: 'Active Enrollments',
			value: getCountBy(enrollments, (item) => item.status === 'active')
		},
		{
			key: 'pendingPayments',
			label: 'Pending Payment',
			value: getCountBy(enrollments, (item) => item.paymentStatus === 'pending')
		}
	];

	return {
		user: event.locals.user,
		moduleStats,
		healthCards,
		recentUsers: usersResult.users.slice(0, 5),
		recentStudents: students.slice(0, 5),
		recentEnrollments: enrollments.slice(0, 5)
	};
};
