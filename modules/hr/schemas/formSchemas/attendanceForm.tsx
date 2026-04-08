import { FormFieldGroup } from "@/types/formfield";

export const attendanceFormFields: FormFieldGroup[] = [
    {
        groupKey: 'attendance_info',
        groupTitle: 'Attendance Record',
        fields: [
            {
                id: 'employee',
                label: 'Employee',
                fieldType: 'select',
                required: true,
                placeholder: 'Select Employee',
                options: 'hr/employees/dropdown/',
            },
            {
                id: 'shift_type',
                label: 'Shift',
                fieldType: 'select',
                required: true,
                placeholder: 'Select Shift',
                options: [
                    { label: 'Day', value: 'Day' },
                    { label: 'Night', value: 'Night' },
                ],
            },
            {
                id: 'check_in',
                label: 'Check In',
                fieldType: 'datetime-local',
                required: true,
                placeholder: '',
                defaultValue: new Date().toISOString().slice(0, 16), // Set current date and time as default
            },
            {
                id: 'check_out',
                label: 'Check Out',
                fieldType: 'datetime-local',
                required: false,
                placeholder: '',
                helpTxt: 'Leave empty if the employee has not checked out yet.',
            },
            {
                id: 'status',
                label: 'Status',
                fieldType: 'select',
                required: true,
                placeholder: 'Select Status',
                options: [
                    { label: 'Present', value: 'Present' },
                    { label: 'Absent', value: 'Absent' },
                    { label: 'Late', value: 'Late' },
                    { label: 'Excused', value: 'Excused' },
                ],
            },
        ],
    },
]
