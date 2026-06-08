import type { FormSchema, SelectOption } from '$lib/types/form-builder';

export const USER_ROLE_OPTIONS: SelectOption[] = [
	{ value: 'admin', label: 'Admin' },
	{ value: 'student', label: 'Student' }
];

export function getCreateUserSchema(roleOptions: SelectOption[] = USER_ROLE_OPTIONS): FormSchema {
	return [
		{
			type: 'grid',
			columns: 1,
			children: [
				{
					name: 'photo',
					label: 'Photo',
					type: 'file',
					accept: 'image/*',
					maxSize: 1024 * 1024 * 5,
					multiple: false
				},
				{
					name: 'email',
					label: 'Email',
					type: 'email',
					required: true,
					placeholder: 'name@example.com'
				},
				{ name: 'role', label: 'Role', type: 'select', required: true, options: roleOptions },
				{ name: 'password', label: 'Password', type: 'password', required: true }
			]
		}
	];
}

export function getEditUserSchema(roleOptions: SelectOption[] = USER_ROLE_OPTIONS): FormSchema {
	return [
		{
			type: 'grid',
			columns: 1,
			children: [
				{
					name: 'photo',
					label: 'Photo',
					type: 'file',
					accept: 'image/*',
					maxSize: 1024 * 1024 * 5,
					multiple: false
				},
				{
					name: 'email',
					label: 'Email',
					type: 'email',
					required: true,
					placeholder: 'name@example.com'
				},
				{ name: 'role', label: 'Role', type: 'select', required: true, options: roleOptions },
				{
					name: 'password',
					label: 'Password',
					type: 'password',
					placeholder: '(Unchanged)',
					description: 'Leave blank to keep current password.'
				}
			]
		}
	];
}
