import React, { useRef } from 'react'
interface PaginationControlProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}
const PaginationControl: React.FC<PaginationControlProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    const gotoRef = useRef<HTMLInputElement>(null)
    const getPageNumbers = () => {
        const pages = []
        pages.push(1)
        let rangeStart = Math.max(2, currentPage - 1)
        let rangeEnd = Math.min(totalPages - 1, currentPage + 1)
        if (currentPage <= 3) {
            rangeEnd = Math.min(totalPages - 1, 4)
        } else if (currentPage >= totalPages - 2) {
            rangeStart = Math.max(2, totalPages - 3)
        }
        if (rangeStart > 2) {
            pages.push('ellipsis-start')
        }
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i)
        }
        if (rangeEnd < totalPages - 1) {
            pages.push('ellipsis-end')
        }
        if (totalPages > 1) {
            pages.push(totalPages)
        }
        return pages
    }
    const handlePageClick = (p: number) => {
        if (p !== currentPage) {
            onPageChange(p)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
    const goToPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
    const handleGotoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const v = gotoRef.current?.value
            const n = v ? parseInt(v) : NaN
            if (!isNaN(n) && n >= 1 && n <= totalPages && n !== currentPage) {
                onPageChange(n)
                window.scrollTo({ top: 0, behavior: 'smooth' })
                if (gotoRef.current) gotoRef.current.value = ''
            }
        }
    }
    const pageNumbers = getPageNumbers()
    return (
        <div className="d-flex justify-content-center my-4">
            <nav aria-label="Book pagination">
                <ul className="pagination pagination-md">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link pag-btn" onClick={goToPrevious} aria-label="Previous page" disabled={currentPage === 1}>
                            <span aria-hidden="true">Prev</span>
                        </button>
                    </li>
                    {pageNumbers.map((p, i) => {
                        if (p === 'ellipsis-start' || p === 'ellipsis-end') {
                            return (
                                <li key={`${p}-${i}`} className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            )
                        }
                        return (
                            <li key={`page-${p}`} className={`page-item ${currentPage === p ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageClick(p as number)}>{p}</button>
                            </li>
                        )
                    })}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link pag-btn" onClick={goToNext} aria-label="Next page" disabled={currentPage === totalPages}>
                            <span aria-hidden="true">Next</span>
                        </button>
                    </li>
                    <li className="d-flex align-items-center ms-2">
                        <input type="number" min="1" max={totalPages} ref={gotoRef} onKeyDown={handleGotoKeyDown} placeholder="Goto Page" className="form-control" style={{ width: '100px' }} />
                    </li>
                </ul>
            </nav>
        </div>
    )
}
export default PaginationControl;