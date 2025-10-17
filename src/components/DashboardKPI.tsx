import React from "react";

interface DashboardKPIProps {
  label: string;
  value: string | number;
  textClass?: string;
  valueClass?: string;
}

export function DashboardKPI({ label, value, textClass = "text-gray-400", valueClass = "text-[#4ADE80]" }: DashboardKPIProps) {
  return (
    <div className="bg-[#181818] rounded-2xl shadow-lg border border-gray-700 p-3 sm:p-5 flex flex-col items-center" tabIndex={0} aria-label={label + ' ' + value}>
      <span className={`text-xs sm:text-sm font-semibold ${textClass}`}>{label}</span>
      <span className={`text-2xl sm:text-3xl font-extrabold ${valueClass}`}>{value}</span>
    </div>
  );
}
