"use client"
import PageHeader from "@/components/common/PageHeader";
import { useFetch } from "@/hooks/useFetch";
import { Card, Spinner } from "flowbite-react";
import { MdApartment } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { isModuleEnabled } from "@/config/modules";

function StatCard({ label, value, icon: Icon, colorClass, iconBgClass, iconTextClass, loading }) {
    return (
        <Card className={`shadow-none hover:shadow-md relative ${colorClass}`}>
            <div className={`absolute right-5 top-5 rounded-lg p-1 ${iconBgClass}`}>
                <Icon className={`text-5xl ${iconTextClass}`} />
            </div>
            <h5 className="font-bold text-gray-700">{label}</h5>
            <span className="text-2xl font-semibold text-gray-900">
                {loading ? <Spinner size="sm" /> : value ?? 0}
            </span>
        </Card>
    );
}

export default function DashboardPage() {
    const { data, loading } = useFetch('dashboard/stats/');

    return (
        <>
            <PageHeader title="Dashboard" />
            {
                isModuleEnabled('hr') && (
                    <>

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Human Resources</p>
                        <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3'>
                            <StatCard
                                label="Departments"
                                value={data?.department_count}
                                loading={loading}
                                icon={MdApartment}
                                colorClass="bg-indigo-50 hover:border-indigo-200 hover:shadow-indigo-100"
                                iconBgClass="bg-indigo-50"
                                iconTextClass="text-indigo-600"
                            />
                            <StatCard
                                label="Employees"
                                value={data?.employee_count}
                                loading={loading}
                                icon={IoPeople}
                                colorClass="bg-violet-50 hover:border-violet-200 hover:shadow-violet-100"
                                iconBgClass="bg-violet-50"
                                iconTextClass="text-violet-600"
                            />
                        </div>

                    </>)}

        </>
    );
}