
import type { FormSchema } from '$lib/types/form-builder';

export const getOutletSchema = (
    provinceOptions: { value: string; label: string }[],
    cityOptions: { value: string; label: string }[],
    districtOptions: { value: string; label: string }[],
    onProvinceSelect: (val: string) => void,
    onCitySelect: (val: string) => void
): FormSchema => [
        {
            type: 'grid',
            columns: 1,
            children: [
                { name: 'name', label: 'Outlet Name', type: 'text', required: true },
                { name: 'address', label: 'Address', type: 'textarea' }
            ]
        },
        {
            type: 'section',
            title: 'Location',
            children: [
                {
                    type: 'grid',
                    columns: 3,
                    children: [
                        {
                            name: 'province',
                            label: 'Province',
                            type: 'combobox',
                            options: provinceOptions,
                            onSelect: onProvinceSelect
                        },
                        {
                            name: 'city',
                            label: 'City',
                            type: 'combobox',
                            options: cityOptions,
                            onSelect: onCitySelect
                        },
                        {
                            name: 'district',
                            label: 'District',
                            type: 'combobox',
                            options: districtOptions
                        }
                    ]
                }
            ]
        },
        {
            type: 'section',
            title: 'Coordinates',
            children: [
                {
                    type: 'custom',
                    component: 'LocationSearch'
                }
            ]
        }
    ];
