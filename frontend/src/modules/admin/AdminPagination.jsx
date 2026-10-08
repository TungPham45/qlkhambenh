function getPageNumbers(currentPage, totalPages) {
  const pagesPerGroup = 4;
  const firstPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const lastPage = Math.min(firstPage + pagesPerGroup - 1, totalPages);
  return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index);
}

export function AdminPagination({ page, limit, total, totalPages, itemLabel, onPageChange }) {
  const safePage = Math.max(1, page || 1);
  const safeLimit = Math.max(1, limit || 4);
  const safeTotalPages = Math.max(1, totalPages || 1);
  const start = total > 0 ? (safePage - 1) * safeLimit + 1 : 0;
  const end = Math.min(safePage * safeLimit, total);
  const pages = getPageNumbers(safePage, safeTotalPages);

  return (
    <footer className="admin-pagination">
      <span>
        Hiển thị <strong>{start} - {end}</strong> trên tổng số <strong>{total.toLocaleString("vi-VN")}</strong> {itemLabel}
      </span>
      <div>
        <button type="button" disabled={safePage <= 1} onClick={() => onPageChange(safePage - 1)}>Trước</button>
        {pages.map((pageNumber) => (
          <button
            className={pageNumber === safePage ? "admin-page-active" : ""}
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button type="button" disabled={safePage >= safeTotalPages} onClick={() => onPageChange(safePage + 1)}>Sau</button>
      </div>
    </footer>
  );
}
