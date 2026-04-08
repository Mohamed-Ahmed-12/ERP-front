import { FormFieldGroup } from "@/types/formfield";

export const departmentFormFields: FormFieldGroup[] = [
    {
        groupKey: 'g1',
        fields: [
            {
                id: 'name',
                label: 'Name',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Software Department',
            },
            {
                id: 'description',
                label: 'Description',
                fieldType: 'textarea',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: 'Software Department description',
            },

        ]
    },
]