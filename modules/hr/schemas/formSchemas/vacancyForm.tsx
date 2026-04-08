import { FormFieldGroup } from "@/types/formfield";
export const vacancyFormFields: FormFieldGroup[] = [
    {
        groupKey: 'vacancy_info',
        groupTitle: 'Vacancy Information',
        fields: [
            {
                id: 'position',
                label: 'Position',
                fieldType: 'select',
                required: true,
                placeholder: 'Select Position',
                options: 'hr/positions/dropdown/',
            },
            {
                id: 'number_of_positions',
                label: 'Number of Positions',
                fieldType: 'number',
                required: true,
                placeholder: '',
                // min: 1,
            },
            {
                id: 'open_date',
                label: 'Open Date',
                fieldType: 'date',
                required: true,
                placeholder: '',
                defaultValue: new Date().toISOString().slice(0, 16), // Set current date and time as default
            },
            {
                id: 'close_date',
                label: 'Close Date',
                fieldType: 'date',
                required: false,
                placeholder: '',
                helpTxt: '',
            },
            {
                id: 'description',
                label: 'Description',
                fieldType: 'textarea',
                required: true,
                placeholder: '',

            },
            {
                id: 'required_qualifications',
                label: 'Required Qualifications',
                fieldType: 'textarea',
                required: true,
                placeholder: '',
            },
            {
                id: 'responsibilities',
                label: 'Responsibilities',
                fieldType: 'textarea',
                required: true,
                placeholder: '',

            },
            {
                id: 'is_open',
                label: 'Is Open',
                fieldType: 'select',
                required: true,
                placeholder: 'Select Status',
                options: [
                    { label: 'Yes', value: '1' },
                    { label: 'No', value: '0' },
                ],
            }
        ],
    },
]
