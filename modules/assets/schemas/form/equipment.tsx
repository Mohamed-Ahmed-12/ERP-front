import { FormFieldGroup } from "@/types/formfield";
import { EquipmentStatus } from "../../types/equipment";
import { isModuleEnabled } from "@/config/modules";

export const equipmentFormFields: FormFieldGroup[] = [

    // ===== GROUP 1: Basic Information =====
    {
        groupKey: 'g1',
        fields: [
            {
                id: 'serial_number',
                label: 'Serial Number',
                fieldType: 'text',
                helpTxt: 'Unique hardware identifier for this equipment',
                errorMsg: '',
                required: true,
                placeholder: 'e.g. CAT-2024-00123',
            },
            {
                id: 'name',
                label: 'Name',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'e.g. Excavator A1',
            },
            {
                id: 'model',
                label: 'Model',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: 'e.g. CAT 320',
            },
            {
                id: 'status',
                label: 'Status',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Select status',
                // Static options — no endpoint needed
                options: [
                    { label: 'Active', value: EquipmentStatus.ACTIVE },
                    { label: 'Inactive', value: EquipmentStatus.INACTIVE },
                    { label: 'Under Maintenance', value: EquipmentStatus.UNDER_MAINTENANCE },
                    { label: 'Retired', value: EquipmentStatus.RETIRED },
                ],
            },
        ],
    },

    // ===== GROUP 2: Classification =====
    {
        groupKey: 'g2',
        fields: [
            {
                id: 'equipment_type',
                label: 'Equipment Type',
                fieldType: 'select',
                helpTxt: 'The category/type of this equipment',
                errorMsg: '',
                required: true,
                placeholder: 'Select equipment type',
                options: 'equipments/types/dropdown/',
            },
            {
                id: 'equipment_brand',
                label: 'Brand',
                fieldType: 'select',
                helpTxt: 'The manufacturer/brand of this equipment',
                errorMsg: '',
                required: true,
                placeholder: 'Select brand',
                options: 'equipments/brands/dropdown/',

            },
        ],
    },

    // ===== GROUP 3: Drivers =====
    {
        groupKey: 'g3',
        fields: [
            {
                id: 'main_driver',
                label: 'Main Driver',
                fieldType: 'select',
                helpTxt: 'Primary operator of this equipment',
                errorMsg: '',
                required: false,
                placeholder: 'Select main driver',
                options: 'equipments/equipment-employee/dropdown',
            },
            {
                id: 'sub_driver',
                label: 'Sub Driver',
                fieldType: 'select',
                helpTxt: 'Secondary operator of this equipment',
                errorMsg: '',
                required: false,
                placeholder: 'Select sub driver',
                options: 'equipments/equipment-employee/dropdown',
            },
        ],
    },
]