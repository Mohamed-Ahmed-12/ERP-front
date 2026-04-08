import { Position } from "./position";
import { Department } from "./department";

export interface Employee {
    guid: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    gender: 'Male' | 'Female';
    national_id: string;
    marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed';
    military_status: 'Completed' | 'Exempted' | 'Not Completed';
    education_level: 'High School' | 'Associate Degree' | "Bachelor's Degree" | "Master's Degree" | 'Doctorate' | 'Other';
    
    // Contact & Location
    phone_number: string;
    address: string;
    city: string;
    country: string;
    email: string;
    work_email: string;

    // Dates (ISO Strings)
    dob: string;
    date_hired: string;
    contract_end_date: string | null;

    // Relations (Full Objects)
    position: Position; 
    department: Department;
    manager: Pick<Employee, 'guid' | 'first_name' | 'last_name'> | null;

    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface EmployeeWrite {
    first_name: string;
    middle_name: string;
    last_name: string;
    gender: 'Male' | 'Female';
    national_id: string;
    marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed';
    military_status: 'Completed' | 'Exempted' | 'Not Completed';
    education_level: string;
    
    phone_number: string;
    address: string;
    city: string;
    country: string;
    email: string;
    work_email: string;

    dob: string;
    date_hired: string;
    contract_end_date: string | null;

    // Use 'position', 'department', and 'manager' as keys 
    // to match your Serializer 'source' settings.
    position: string;   // Position GUID
    department: string; // Department GUID
    manager: string | null; // Manager GUID
    
    is_active: boolean;
}