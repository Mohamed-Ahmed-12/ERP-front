import React from "react";
import { ColDef } from "ag-grid-community";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { useAuth } from "@/context/auth";


export type ExtraAction<T> = {
  icon: React.ReactNode;
  onClick: (row: T) => void;
  title?: string;
  className?: string;
  show?: (row: T) => boolean; // Optional: logic to hide/show based on row data
};

type ActionsCellProps<T> = {
  row: T;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extraActions?: ExtraAction<T>[]; // Added this
  editGroups?: string[];
  deleteGroups?: string[];
};

function ActionsCell<T>({ row, onView, onEdit, onDelete, extraActions, editGroups, deleteGroups }: ActionsCellProps<T>) {
  const { user } = useAuth();
  
  const canEdit = editGroups ? user?.groups?.some((g: string) => editGroups.includes(g)) : true;
  const canDelete = deleteGroups ? user?.groups?.some((g: string) => deleteGroups.includes(g)) : true;

  const btnBase = "p-1.5 rounded text-base transition-colors";

  return (
    <div className="flex gap-1 items-center h-full">
      {onView && (
        <button
          onClick={() => onView(row)}
          title="View"
          className={`${btnBase} text-slate-500 hover:text-indigo-600 hover:bg-indigo-50`}
        >
          <BsEye />
        </button>
      )}

      {extraActions?.map((action, index) => {
        if (action.show && !action.show(row)) return null;
        return (
          <button
            key={index}
            onClick={() => action.onClick(row)}
            className={action.className ?? `${btnBase} text-slate-500 hover:text-slate-800 hover:bg-slate-100`}
            title={action.title}
          >
            {action.icon}
          </button>
        );
      })}

      {canEdit && onEdit && (
        <button
          onClick={() => onEdit(row)}
          title="Edit"
          className={`${btnBase} text-slate-500 hover:text-indigo-600 hover:bg-indigo-50`}
        >
          <BiEdit />
        </button>
      )}
      {canDelete && onDelete && (
        <button
          onClick={() => onDelete(row)}
          title="Delete"
          className={`${btnBase} text-slate-400 hover:text-red-600 hover:bg-red-50`}
        >
          <MdDeleteOutline />
        </button>
      )}
    </div>
  );
}

export const actionsColumn = <T,>(config: {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extraActions?: ExtraAction<T>[]; // Pass custom buttons here
  editGroups?: string[];
  deleteGroups?: string[];
}): ColDef<T>[] => [
  {
    headerName: "Actions",
    sortable: false,
    filter: false,
    pinned: 'right', // Useful for action columns
    cellRenderer: (params: any) => (
      <ActionsCell 
        row={params.data} 
        {...config}
      />
    ),
  },
];