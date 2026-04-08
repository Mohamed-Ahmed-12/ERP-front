import { FormFieldGroup } from "@/types/formfield";

export const positionFormFields: FormFieldGroup[] = [
    {
        groupKey: 'g1',
        fields: [
            {
                id:'seniority_level',
                label: 'Seniority Level',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select Level',
                options: JSON.stringify([
                    { label: 'Entry Level', value: 'entry' },
                    { label: 'Mid Level', value: 'mid' },
                    { label: 'Senior Level', value: 'senior' },
                    { label: 'Director Level', value: 'director' },
                    { label: 'Vice President', value: 'vp' },
                    // { label: 'Executive', value: 'c_suite' },
                ])
            },
            {
                id: 'title',
                label: 'Title',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Software Engineer',
            },
            {
                id: 'base_salary',
                label: 'Base Salary',
                fieldType: 'number',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: '50000',
            },
            {
                id:'department',
                label: 'Department',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select Department',
                options: 'hr/departments/dropdown/' // API endpoint to fetch options
            },
            {
                id:'contract_type',
                label: 'Contract Type',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select Contract Type',
                options: JSON.stringify([
                    { label: 'Full-time', value: 'Full-time' },
                    { label: 'Part-time', value: 'Part-time' },
                    { label: 'Contract', value: 'Contract' },
                ])
            }
            
        ]
    },
]