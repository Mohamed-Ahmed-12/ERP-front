"use client";
import { SelectOption } from "@/types/formfield";
import { Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/network";


type SelectWithOptionsProps = React.ComponentProps<typeof Select> & {
    fetchedData?: string | SelectOption[];
    options?: SelectOption[];
    placeholder?: string;
};

/*
    Usage examples
    inline schema options array:
    options: [{ label: "A", value: "a" }]
    string endpoint:
    options: "hr/departments/"
    json string:
    options: JSON.stringify([{label:"A",value:"a"}])
*/
export default function SelectWithOptions({ fetchedData, options: fieldOptions, value, ...props }: SelectWithOptionsProps) {
    const [options, setOptions] = useState<SelectOption[]>([]);

    useEffect(() => {
        const loadOptions = async () => {
            if (Array.isArray(fieldOptions) && fieldOptions.length > 0) {
                setOptions(fieldOptions);
                return;
            }

            if (Array.isArray(fetchedData)) {
                setOptions(fetchedData);
                return;
            }

            if (!fetchedData || typeof fetchedData !== "string") {
                setOptions([]);
                return;
            }

            // try parse JSON string
            try {
                const parsed = JSON.parse(fetchedData);
                if (Array.isArray(parsed)) {
                    setOptions(parsed);
                    return;
                }
            } catch {
                // not JSON, proceed as API endpoint value
            }

            // If it looks like an endpoint, fetch options from API
            try {
                const url = fetchedData.startsWith("http") ? fetchedData : fetchedData;
                const response = await axiosInstance.get(url);

                if (Array.isArray(response.data)) {
                    // Expect API returns items with id/name or label/value.
                    const mapped = response.data.map((item: any) => {
                        if (!item || typeof item !== "object") return null;
                        if ("label" in item && "value" in item) return item;
                        return null;
                    }).filter(Boolean) as SelectOption[];
                    setOptions(mapped);
                    return;
                }
            } catch (error) {
                console.error("SelectWithOptions fetch error", error);
            }

            setOptions([]);
        };

        loadOptions();
    }, [fetchedData, fieldOptions]);

    return (
        <Select {...props} value={value || ""}>
            <option value="">Select</option>
            {options.map((opt, index) => (
                <option key={index} value={opt.value}>{opt.label}</option>
            ))}
        </Select>
    );
}
