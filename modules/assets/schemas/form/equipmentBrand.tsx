import { FormFieldGroup } from "@/types/formfield";

export const equipmentBrandFormFields: FormFieldGroup[] = [
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
                placeholder: 'e.g. Mercedes',
            },
        ]
    },
]