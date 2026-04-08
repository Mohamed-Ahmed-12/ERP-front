import { FormFieldGroup } from "@/types/formfield";

export const equipmentEmployeeFormFields: FormFieldGroup[] = [
    {
        groupKey: 'g1',
        fields: [
            {
                id: 'first_name',
                label: 'First Name',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'e.g. Joe',
            },
            {
                id: 'last_name',
                label: 'Last Name',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'e.g. Doe',
            },
            {
                id: 'national_id',
                label: 'National ID',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: '',
            },
            {
                id: 'phone_number',
                label: 'Phone Number',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: '01149228665',
            },
        ]
    },
]