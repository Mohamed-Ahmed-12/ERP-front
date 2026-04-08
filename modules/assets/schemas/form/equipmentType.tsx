import { FormFieldGroup } from "@/types/formfield";

export const equipmentTypeFormFields: FormFieldGroup[] = [
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
                placeholder: 'e.g. Excavator',
            },
            {
                id: 'drivable',
                label: 'Drivable',
                fieldType: 'checkbox',
                helpTxt: 'Check if this equipment type requires a driver',
                errorMsg: '',
                required: false,
                placeholder: '',
            },
        ]
    },
]