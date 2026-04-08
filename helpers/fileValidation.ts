/**
 * Validates a File object
 * @param {File} file - The file object from an input or drop event
 * @param {Object} options - Configuration for validation
 * @param {number} options.maxSizeMB - Maximum allowed size in Megabytes
 * @param {string[]} options.allowedTypes - Array of allowed MIME types (e.g., ['image/jpeg', 'application/pdf'])
 * @returns {Object} { isValid: boolean, error: string | null }
 */

interface FileValidationRequirements {
    maxSizeMB: number;
    allowedTypes: string[]; // Changed to string array for .includes() to work correctly
}

interface FileValidationProps {
    file: File | null | undefined;
    requirements: FileValidationRequirements;
}

interface ValidationResult {
    isValid: boolean;
    error: string | null;
}

export const validateFile = ({ file, requirements }: FileValidationProps): ValidationResult => {
    const { maxSizeMB, allowedTypes } = requirements;

    // 1. Check if file exists
    if (!file) {
        return { isValid: false, error: "No file provided." };
    }

    // 2. Validate File Type
    // Use .some() or .includes() on the array of allowed MIME types
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return { 
            isValid: false, 
            error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
        };
    }

    // 3. Validate File Size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return { 
            isValid: false, 
            error: `File is too large. Max size is ${maxSizeMB}MB.` 
        };
    }

    return { isValid: true, error: null };
};