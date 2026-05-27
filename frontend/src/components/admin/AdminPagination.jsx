import React from "react";

export const ADMIN_PAGE_SIZE = 20;

const AdminPagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = ADMIN_PAGE_SIZE,
  onPageChange,
}) => {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
        Showing {start}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg border px-3 py-1.5 text-sm font-semibold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
        >
          Previous
        </button>
        <span className="text-sm font-medium px-2" style={{ color: "var(--brand-dark)" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg border px-3 py-1.5 text-sm font-semibold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: "var(--brand-lavender-soft)", color: "var(--brand-dark)" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
