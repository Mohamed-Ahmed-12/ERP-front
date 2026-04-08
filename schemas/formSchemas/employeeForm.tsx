import { FormFieldGroup } from "@/types/formfield";
export const employeeFormFields: FormFieldGroup[] = [
    {
        groupKey: 'personal_info',
        groupTitle: "Personal Details",
        fields: [
            { id: 'first_name', label: 'First Name', fieldType: 'text', required: true, placeholder: 'John' },
            { id: 'middle_name', label: 'Middle Name', fieldType: 'text', required: false, placeholder: 'Quincy' },
            { id: 'last_name', label: 'Last Name', fieldType: 'text', required: true, placeholder: 'Doe' },
            {
                id: 'gender',
                label: 'Gender',
                fieldType: 'select',
                required: false,
                placeholder: '',
                options: JSON.stringify([
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' }
                ])
            },
            { id: 'dob', label: 'Date of Birth', fieldType: 'date', required: false, placeholder: '' },
            { id: 'national_id', label: 'National ID', fieldType: 'text', required: false, placeholder: 'Enter ID Number' },
            {
                id: 'marital_status',
                label: 'Marital Status',
                fieldType: 'select',
                options: JSON.stringify([
                    { label: 'Single', value: 'Single' },
                    { label: 'Married', value: 'Married' },
                    { label: 'Divorced', value: 'Divorced' },
                    { label: 'Widowed', value: 'Widowed' }
                ]),
                required: false,
                placeholder: '',
            },
            {
                id: 'military_status',
                label: 'Military Status',
                fieldType: 'select',
                options: JSON.stringify([
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Exempted', value: 'Exempted' },
                    { label: 'Not Completed', value: 'Not Completed' }
                ]),
                required: false,
                placeholder: '',
            },
        ]
    },
    {
        groupKey: 'contact_info',
        groupTitle: "Contact & Address",
        fields: [
            { id: 'email', label: 'Personal Email', fieldType: 'text', required: true, placeholder: 'personal@example.com' },
            { id: 'work_email', label: 'Work Email', fieldType: 'text', required: false, placeholder: 'company@example.com' },
            { id: 'phone_number', label: 'Phone Number', fieldType: 'text', required: false, placeholder: '+20...' },
            { id: 'city', label: 'City', fieldType: 'text', required: false, placeholder: '', },
            { id: 'address', label: 'Full Address', fieldType: 'textarea', required: false, placeholder: '', },
        ]
    },
    {
        groupKey: 'work_info',
        groupTitle: "Employment Details",
        fields: [
            {
                id: 'position',
                label: 'Position',
                fieldType: 'select',
                required: true,
                placeholder: '',
                options: 'hr/positions/dropdown/'
            },
            {
                id: 'department',
                label: 'Department',
                fieldType: 'select',
                required: false,
                placeholder: '',
                options: 'hr/departments/dropdown/'
            },
            {
                id: 'manager',
                label: 'Reporting Manager',
                fieldType: 'select',
                required: false,
                options: 'hr/employees/dropdown/',
                placeholder: '',
            },
            { id: 'date_hired', label: 'Hiring Date', fieldType: 'date', required: false, placeholder: '', },
            { id: 'contract_end_date', label: 'Contract End Date', fieldType: 'date', required: false, placeholder: '', },
        ]
    },
    {
        groupKey: 'files',
        groupTitle: "Identification Documents",
        fields: [
            { id: 'photo', label: 'Employee Photo', fieldType: 'file', required: false, placeholder: '', },
            { id: 'id_front', label: 'ID Front Side', fieldType: 'file', required: false, placeholder: '', },
            { id: 'id_back', label: 'ID Back Side', fieldType: 'file', required: false, placeholder: '', },
        ]
    }
];