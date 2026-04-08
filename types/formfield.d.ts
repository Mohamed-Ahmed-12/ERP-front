import { HTMLInputTypeAttribute } from "react";
export interface SelectOption {
    label:string;
    value:string;
}
export interface FieldBuilderProps {
    fieldType: HTMLInputTypeAttribute;
    [key: string]: any;
}

// this used for descripe field schema defination
export interface FormField {
    id: string;
    label: string;
    fieldType: HTMLInputTypeAttribute;
    placeholder: string;
    required: boolean;
    helpTxt?: string;
    errorMsg?: string;
    options?: string | SelectOption[];
    disabled?: boolean; // used for edit form to disable editing field
    textEditor?: boolean
    defaultValue?: string; // for fields like datetime-local to set default value to current date and time
    
}

export interface FormFieldGroup {
    groupKey: string;
    groupTitle?: string; // Used for the header (e.g., "Basic Info")
    fields: FormField[]; // The array of input fields
}

export type FormBuilderProps = FormFieldGroup[]