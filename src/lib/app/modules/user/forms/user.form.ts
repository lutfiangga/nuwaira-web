import type { FormSchema, SelectOption } from '$lib/types/form-builder';

export function getCreateUserSchema(roleOptions: SelectOption[]): FormSchema {
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
					path: 'uploads/users',
					maxSize: 1024 * 1024 * 5,
					multiple: false
				},
				{ name: 'username', label: 'Username', type: 'text', required: true },
				{ name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'name@example.com' },
				{ name: 'roleId', label: 'Role', type: 'select', required: true, options: roleOptions },
				{ name: 'age', label: 'Age', type: 'number' },
				{ name: 'password', label: 'Password', type: 'password', required: true }
			]
		}
	];
}

export function getEditUserSchema(roleOptions: SelectOption[]): FormSchema {
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
					path: 'uploads/users',
					maxSize: 1024 * 1024 * 5,
					multiple: false
				},
				{ name: 'username', label: 'Username', type: 'text', required: true },
				{ name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'name@example.com' },
				{ name: 'roleId', label: 'Role', type: 'select', required: true, options: roleOptions },
				{ name: 'age', label: 'Age', type: 'number' },
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
