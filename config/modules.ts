type ModuleName =
  | "hr"
  | "merchant"
  | "warehouse"
  | "finance"
  | "payroll"
  | "equipment";


export const ENABLED_MODULES: Record<ModuleName, boolean> = {
  hr: true,
  equipment: true,
  merchant: false,
  warehouse: false,
  finance: false,
  payroll: false,

};

export const isModuleEnabled = (module: ModuleName): boolean => {
  return !!ENABLED_MODULES[module];
};