import { FormFieldGroup } from "@/types/formfield";


// employee:string;
// current_position:string;
// desired_position:string;
// reason?:string |null;
// request_type: 'Promotion' | 'Demotion' | 'Transfer';
// status:'Pending' | 'Approved' | 'Rejected';
export const jobChangeReqFormFields: FormFieldGroup[] = [
    {
        groupKey: 'g1',
        fields: [
            {
                id: 'employee',
                label: 'Employee',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select',
                options: 'hr/employees/dropdown'
            },
            {
                id: 'current_position',
                label: 'Current Position',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select',
                options: 'hr/positions/dropdown'// API endpoint to fetch options
            },
            {
                id: 'desired_position',
                label: 'Desired Position',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select',
                options: 'hr/positions/dropdown'// API endpoint to fetch options
            },
            {
                id: 'reason',
                label: 'Reason',
                fieldType: 'textarea',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: 'Why ?',
            },
            {
                id: 'request_type',
                label: 'Request Type',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select Request Type',
                options: JSON.stringify([
                    { label: 'Promotion', value: 'Promotion' },
                    { label: 'Demotion', value: 'Demotion' },
                    { label: 'Transfer', value: 'Transfer' },
                ])
            },
            {
                id: 'status',
                label: 'Request Status',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select Request Type',
                options: JSON.stringify([
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Approved', value: 'Approved' },
                    { label: 'Rejected', value: 'Rejected' },
                ])
            }

        ]
    },
]