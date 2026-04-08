import { FieldBuilderProps } from "@/types/formfield";
import { FileInput, Select, Textarea, TextInput } from "flowbite-react"
import { Controller } from "react-hook-form";
import SelectWithOptions from "./SelectWithOptions";

export const FieldBuilder: React.FC<FieldBuilderProps> = ({ fieldType, ...props }) => {
    const { register, id, options, control } = props;
    const registrationProps = register(id);
    const combinedProps = {
        ...props,
        ...registrationProps
    };
    switch (fieldType) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'checkbox':
        case 'datetime-local':
            return <TextInput type={fieldType} {...combinedProps} />;
        case 'date':
            return <TextInput type="date" {...combinedProps} />;
        case 'textarea':
            return <Textarea {...combinedProps} rows={5} />;
        case 'file':
            return <FileInput {...combinedProps} accept="image/*" />;
        case 'select':
            return (
                <Controller
                    name={id}
                    control={control}
                    render={({ field }) => (
                        <SelectWithOptions
                            id={id}
                            placeholder={props.placeholder}
                            required={props.required}
                            color={props.color}
                            disabled={props.disabled}
                            fetchedData={options}
                            {...field}
                            value={field.value ?? ""}
                        />
                    )}
                />
            )

        default:
            console.warn(`Unknown fieldType: ${fieldType}`);
            return <></>;
    }
};