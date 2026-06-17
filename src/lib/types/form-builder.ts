export type FieldType =
	| 'text'
	| 'number'
	| 'email'
	| 'password'
	| 'time'
	| 'textarea'
	| 'select'
	| 'combobox'
	| 'checkbox'
	| 'checkbox-group'
	| 'switch'
	| 'file'
	| 'date'
	| 'rich-text'
	| 'color';

export interface BaseFieldConfig {
	name: string;
	label: string;
	type: FieldType;
	required?: boolean;
	placeholder?: string;
	description?: string; // Helper text
	disabled?: boolean;
	class?: string; // Custom classes for the wrapper
	defaultValue?: unknown;
	visibleWhen?: {
		field: string;
		equals?: string | number | boolean | null;
		notEquals?: string | number | boolean | null;
	};
}

export interface TextFieldConfig extends BaseFieldConfig {
	type: 'text' | 'email' | 'password' | 'number' | 'time';
	step?: string | number;
	min?: number;
	max?: number;
	slugOrigin?: string; // Name of the field to generate slug from
}

export interface DateFieldConfig extends BaseFieldConfig {
	type: 'date';
	min?: string;
	max?: string;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
	type: 'textarea';
	rows?: number;
}

export interface SelectOption {
	label: string;
	value: string | number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
	type: 'select';
	options: SelectOption[];
	multiple?: boolean;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
	type: 'checkbox' | 'switch';
}

export interface CheckboxGroupFieldConfig extends BaseFieldConfig {
	type: 'checkbox-group';
	options: SelectOption[];
}

export interface FileFieldConfig extends BaseFieldConfig {
	type: 'file';
	accept?: string;
	multiple?: boolean;
	path?: string; // Target storage path
	maxSize?: number; // In bytes
}

export interface RichTextFieldConfig extends BaseFieldConfig {
	type: 'rich-text';
}

export interface ColorFieldConfig extends BaseFieldConfig {
	type: 'color';
}

export interface ComboboxFieldConfig extends BaseFieldConfig {
	type: 'combobox';
	options: SelectOption[];
	onSelect?: (value: string) => void | Promise<void>;
}

export interface CustomComponentConfig {
	type: 'custom';
	component: string; // Component name or identifier
}

export type FieldConfig =
	| TextFieldConfig
	| DateFieldConfig
	| TextareaFieldConfig
	| SelectFieldConfig
	| ComboboxFieldConfig
	| CheckboxFieldConfig
	| CheckboxGroupFieldConfig
	| FileFieldConfig
	| CustomComponentConfig
	| RichTextFieldConfig
	| ColorFieldConfig;

// Layouts
export interface BaseLayout {
	type: 'section' | 'grid' | 'group';
	class?: string;
}

export interface SectionLayout extends BaseLayout {
	type: 'section';
	title?: string;
	description?: string;
	collapsible?: boolean; // Future-proof
	children: (FieldConfig | LayoutConfig)[];
}

export interface GridLayout extends BaseLayout {
	type: 'grid';
	columns?: number | { default?: number; sm?: number; md?: number; lg?: number; xl?: number };
	gap?: number;
	children: (FieldConfig | LayoutConfig)[];
}

export interface GroupLayout extends BaseLayout {
	type: 'group';
	children: (FieldConfig | LayoutConfig)[];
}

export type LayoutConfig = SectionLayout | GridLayout | GroupLayout;

export type FormSchemaItem = FieldConfig | LayoutConfig;

export type FormSchema = FormSchemaItem[];
