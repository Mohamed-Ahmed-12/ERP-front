"use client"
import { Button, Spinner } from "flowbite-react";
import React, { useState } from 'react';
import { FieldBuilder } from "./FieldBuilder";
import { FormBuilderProps, FormField, FormFieldGroup } from "@/types/formfield";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosErrorWithData } from "@/types/error";
import { mapApiErrorsToFormFields } from "@/helpers/apis";

interface FormBuilderPropsWithSubmit<TFormValues extends FieldValues> {
    formFields: FormBuilderProps;
    onSubmit: (data: TFormValues) => Promise<TFormValues>;
    successRedirect?: string;
    defaultValues?: DefaultValues<TFormValues> | undefined;
}

export default function FormBuilder<TFormValues extends FieldValues>({
    formFields,
    onSubmit,
    successRedirect,
    defaultValues,
}: FormBuilderPropsWithSubmit<TFormValues>) {
    const isEditing = !!defaultValues;
    const [loading, setLoading] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        setError,
    } = useForm<TFormValues>({
        defaultValues: defaultValues,
    });
    const router = useRouter();

    const onFormSubmit = (data: TFormValues) => {
        setLoading(true);
        onSubmit(data)
            .then(() => {
                // toast.success(isEditing ? "Updated successfully" : "Created successfully");
                if (successRedirect) {
                    router.push(successRedirect);
                }
            })
            .catch((err: AxiosErrorWithData) => {
                console.error(err);
                if (err.responseData) {
                    mapApiErrorsToFormFields(err.responseData, setError);
                }
                toast.error(err.message || "An unknown error occurred.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onFormSubmit)}
            noValidate
        >
            {formFields.map((group: FormFieldGroup) => (
                <section
                    key={group.groupKey}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                    {/* Group header */}
                    {group.groupTitle && (
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <span className="block w-1 h-5 rounded-full bg-blue-600 shrink-0" />
                            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                {group.groupTitle}
                            </h2>
                        </div>
                    )}

                    {/* Fields grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        {group.fields.map((field: FormField) => {
                            const fieldError = errors[field.id as keyof TFormValues];
                            const errorMsg = fieldError?.message as string | undefined;
                            const isDisabled = field.disabled ?? false;

                            return (
                                <div key={field.id} className="flex flex-col gap-1.5">
                                    {/* Label row */}
                                    <label
                                        htmlFor={field.id}
                                        className={`text-sm font-medium leading-none ${
                                            isDisabled
                                                ? "text-slate-400"
                                                : errorMsg
                                                ? "text-red-600"
                                                : "text-slate-700"
                                        }`}
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1 text-red-500 font-semibold">*</span>
                                        )}
                                        {isDisabled && (
                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 uppercase tracking-wide">
                                                read-only
                                            </span>
                                        )}
                                    </label>

                                    {/* Input */}
                                    <FieldBuilder
                                        fieldType={field.fieldType}
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        color={errorMsg ? "failure" : "gray"}
                                        register={register}
                                        control={control}
                                        options={field.options || []}
                                        disabled={isDisabled}
                                        defaultValue={field.defaultValue || undefined}
                                    />

                                    {/* Help text */}
                                    {field.helpTxt && !errorMsg && (
                                        <p className="flex items-start gap-1.5 text-xs text-slate-500 leading-relaxed">
                                            <svg
                                                className="mt-px shrink-0 w-3.5 h-3.5 text-slate-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
                                            </svg>
                                            {field.helpTxt}
                                        </p>
                                    )}

                                    {/* Validation error */}
                                    {errorMsg && (
                                        <p className="flex items-start gap-1.5 text-xs text-red-600 leading-relaxed">
                                            <svg
                                                className="mt-px shrink-0 w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                                            </svg>
                                            {errorMsg}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}

            {/* Footer / Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 mr-auto">
                    <span className="text-red-500 font-semibold">*</span> Required fields
                </span>
                <Button
                    type="submit"
                    disabled={loading}
                    color="blue"
                    className="min-w-[110px] font-medium"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Spinner size="sm" />
                            <span>Saving…</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Update
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Save
                                </>
                            )}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}
