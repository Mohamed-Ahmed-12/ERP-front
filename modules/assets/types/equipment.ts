export interface EquipmentEmployeeRead {
  guid: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
  employee_id: string;
  source: string;

}

export interface EquipmentEmployeeWrite {
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
}


// 
export interface EquipmentTypeRead {
  guid: string;
  name: string;
  drivable: boolean;
}

export interface EquipmentTypeWrite {
  name: string;
  drivable: boolean;
}

// 

export interface EquipmentBrandRead {
  guid: string;
  name: string;
}

export interface EquipmentBrandWrite {
  name: string;
}



// ===== ENUMS =====

export enum EquipmentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  UNDER_MAINTENANCE = "under_maintenance",
  RETIRED = "retired",
}

// ===== NESTED TYPES (used in Read) =====

export interface EmployeeNested {
  guid: string;
  first_name: string;
  last_name: string;
}

// ===== READ INTERFACE =====

export interface EquipmentRead {
  guid: string;
  serial_number: string;
  name: string;
  model: string | null;
  status: EquipmentStatus;
  status_display: string;

  equipment_type: EquipmentTypeRead | null;
  equipment_brand: EquipmentBrandRead | null;

  main_driver_id: string | null;
  main_driver: EmployeeNested | null;

  sub_driver_id: string | null;
  sub_driver: EmployeeNested | null;

  merchant_id: string | null;
  //   merchant: MerchantNested | null;

  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

// ===== WRITE INTERFACE =====

export interface EquipmentWrite {
  serial_number: string;
  name: string;
  model?: string | null;
  status?: EquipmentStatus;

  equipment_type: string;  // UUID of EquipmentType
  equipment_brand: string; // UUID of EquipmentBrand

  main_driver_id?: string | null; // UUID of Employee
  sub_driver_id?: string | null;  // UUID of Employee
  merchant_id?: string | null;    // UUID of Merchant
}

// ===== PARTIAL WRITE (for PATCH requests) =====

export type EquipmentPatch = Partial<EquipmentWrite>;