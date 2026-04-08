"use client";

import { isModuleEnabled } from "@/config/modules";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GiGearHammer } from "react-icons/gi";
import { HiChartPie, HiLogout, HiChevronDown, HiChevronRight } from "react-icons/hi";
import { IoPeople, IoBriefcase } from "react-icons/io5";
import { MdApartment, MdLabel } from "react-icons/md";


const HR =   {
    label: "Human Resources",
    key: "hr",
    icon: IoPeople,
    items: [
      { href: "/dashboard/hr/departments", label: "Departments", icon: MdApartment },
      { href: "/dashboard/hr/positions", label: "Positions", icon: IoBriefcase },
      { href: "/dashboard/hr/employees", label: "Employees", icon: IoPeople },
      { href: "/dashboard/hr/attendance", label: "Attendance", icon: HiChartPie },
      { href: "/dashboard/hr/vacancies", label: "Vacancies", icon: IoPeople },
      { href: "/dashboard/hr/candidates", label: "Candidates", icon: IoPeople },
      { href: "/dashboard/hr/job-change-request", label: "Position Change", icon: IoPeople },
    ],
  }
const ASSETS =   {
    label: "Asset Management",
    key: "asset",
    icon: GiGearHammer ,
    items: [
      { href: "/dashboard/assets/equipment-types", label: "Equipment Types", icon: MdLabel },
      { href: "/dashboard/assets/equipment-brands", label: "Equipment Brands", icon: MdLabel },
      { href: "/dashboard/assets/equipments", label: "Equipments", icon: GiGearHammer },
      { href: "/dashboard/assets/equipment-employee", label: "Equipment Employees", icon: IoPeople },
    ],
  }
const navGroups = [
  {
    label: null,
    items: [
      { href: "/dashboard", label: "Dashboard", icon: HiChartPie, exact: true },
    ],
  },
  ...(isModuleEnabled("hr") ? [HR] : []),
  ...(isModuleEnabled("equipment") ? [ASSETS] : []),

];

function NavItem({ href, label, icon: Icon, isActive }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive
          ? "bg-indigo-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
    >
      <Icon className="text-base flex-shrink-0" />
      {label}
    </Link>
  );
}

function NavGroup({ group, pathname }) {
  const isAnyActive = group.items.some((item) => pathname.startsWith(item.href));
  const [open, setOpen] = useState(isAnyActive);
  const Icon = group.icon;

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${isAnyActive ? "text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
      >
        <Icon className="text-base flex-shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        {open
          ? <HiChevronDown className="text-xs text-slate-500" />
          : <HiChevronRight className="text-xs text-slate-500" />
        }
      </button>

      {open && (
        <div className="ml-4 pl-3 border-l border-slate-700 space-y-0.5">
          {group.items.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={pathname.startsWith(item.href)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarDashboard() {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center h-16 px-5 border-b border-slate-800 flex-shrink-0">
        <span className="text-lg font-bold text-white tracking-tight">
          Oretech <span className="text-indigo-400">ERP</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navGroups.map((group, i) => {
          if (!group.label) {
            return (
              <div key={i} className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                  />
                ))}
              </div>
            );
          }
          return (
            <div key={i} className="pt-2">
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
              <NavGroup group={group} pathname={pathname} />
            </div>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="flex-shrink-0 border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.username ?? "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">Administrator</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <HiLogout className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}
