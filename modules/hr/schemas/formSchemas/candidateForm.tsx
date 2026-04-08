import { FormFieldGroup } from "@/types/formfield";


export const candidateFormFields: FormFieldGroup[] = [
    {
        groupKey: 'candidate_info',
        groupTitle: 'Candidate Information',
        fields: [
            {
                id: 'vacancy',
                label: 'Vacancy',
                fieldType: 'select',
                required: true,
                placeholder: 'Select Vacancy',
                options: 'hr/vacancies/dropdown/',
            },
            {
                id: 'first_name',
                label: 'First Name',
                fieldType: 'text',
                required: true,
                placeholder: 'John',
            },
            {
                id: 'last_name',
                label: 'Last Name',
                fieldType: 'text',
                required: true,
                placeholder: 'Doe',
            },
            {
                id: 'email',
                label: 'Email',
                fieldType: 'text',
                required: true,
                placeholder: 'john.doe@example.com',
            },
            {
                id: 'phone_number',
                label: 'Phone Number',
                fieldType: 'text',
                required: false,
                placeholder: '+1234567890',
            },
            {
                id: 'resume',
                label: 'Resume',
                fieldType: 'file',
                required: false,
                placeholder: '',
                helpTxt: "Max file size 2 MB"
            },
            {
                id: 'cover_letter',
                label: 'Cover Letter',
                fieldType: 'textarea',
                required: false,
                placeholder: '',

            },
            {
                id: 'expected_salary',
                label: 'Expected Salary',
                fieldType: 'number',
                required: false,
                placeholder: '50000',

            },
            {
                id: 'source_channel',
                label: 'Source Channel',
                fieldType: 'text',
                required: false,
                placeholder: 'LinkedIn, Referral, etc.',
            },
            {
                id: 'status',
                label: 'Status',
                fieldType: 'select',
                required: true,
                placeholder: 'Select Status',
                options: [
                    { label: 'Applied', value: 'Applied' },
                    { label: 'In Review', value: 'In Review' },
                    { label: 'Interview Scheduled', value: 'Interview Scheduled' },
                    { label: 'Offered', value: 'Offered' },
                    { label: 'Rejected', value: 'Rejected' },
                ],

            },
            {
                id: 'score',
                label: 'Score',
                fieldType: 'number',
                required: false,
                placeholder: '85.5',

            },
            {
                id: 'recruiter',
                label: 'Recruiter',
                fieldType: 'text',
                required: false,
                placeholder: 'Name of the recruiter',

            },
            {
                id: 'interviwer',
                label: 'Interviewer',
                fieldType: 'text',
                required: false,
                placeholder: 'Name of the interviewer',

            },
            {
                id: 'notes',
                label: 'Notes',
                fieldType: 'textarea',
                required: false,
                placeholder: 'Additional notes about the candidate',

            },
        ],
    },
]