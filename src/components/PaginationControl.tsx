import React from 'react';
interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
const PaginationControl: React.FC<PaginationControlProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    const getPageNumbers = () => {
        const pages = [];
        pages.push(1);
        let rangeStart = Math.max(2, currentPage - 1);
        let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
        if (currentPage <= 3) {
            rangeEnd = Math.min(totalPages - 1, 4);
        } else if (currentPage >= totalPages - 2) {
            rangeStart = Math.max(2, totalPages - 3);
        }
        if (rangeStart > 2) {
            pages.push('ellipsis-start');
        }
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }
        if (rangeEnd < totalPages - 1) {
            pages.push('ellipsis-end');
        }
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        return pages;
    };
    const handlePageClick = (page: number) => {
        if (page !== currentPage) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const goToPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const pageNumbers = getPageNumbers();
    return (
        <div className="d-flex justify-content-center my-4">
            <nav aria-label="Book pagination">
                <ul className="pagination pagination-md">
                    { }
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={goToPrevious}
                            aria-label="Previous page"
                            disabled={currentPage === 1}
                        >
                            <span aria-hidden="true" className="pag-btn">Prev</span>
                        </button>
                    </li>
                    { }
                    {pageNumbers.map((page, index) => {
                        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                            return (
                                <li key={`${page}-${index}`} className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            );
                        }
                        return (
                            <li
                                key={`page-${page}`}
                                className={`page-item ${currentPage === page ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handlePageClick(page as number)}
                                >
                                    {page}
                                </button>
                            </li>
                        );
                    })}
                    { }
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={goToNext}
                            aria-label="Next page"
                            disabled={currentPage === totalPages}
                        >
                            <span aria-hidden="true" className="pag-btn">Next</span>

                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
export default PaginationControl;