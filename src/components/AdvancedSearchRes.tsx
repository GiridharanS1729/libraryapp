import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { filterBooks } from '../redux/booksSlice'
import { RootState } from '../redux/store'
import BookCard from './BookCard'
import { Col, Row } from 'react-bootstrap'
import PaginationControl from './PaginationControl'

const AdvancedSearchRes = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)

    const books = useSelector((state: RootState) => state.books.books)

    useEffect(() => {
        const filters = {
            title: queryParams.get('title') || '',
            author: queryParams.get('author') || '',
            category: queryParams.get('category') || '',
            status: queryParams.get('status') || '',
            yearFrom: Number(queryParams.get('yearFrom') || 0),
            yearTo: Number(queryParams.get('yearTo') || 9999),
            pageCountMin: Number(queryParams.get('pageCountMin') || 0),
            pageCountMax: Number(queryParams.get('pageCountMax') || Infinity),
        }
        dispatch(filterBooks(filters))
    }, [location.search])



    const [page, setPage] = useState(1)
    const perPage = 8
    const totalPages = Math.ceil(books.length / perPage)
    const currentBooks = books.slice((page - 1) * perPage, page * perPage)

    return (
        <>
            {books.length === 0 ? (
                <p className="text-center col-span-full">No books found.</p>
            ) : (
                <>
                    <Row>
                        {currentBooks.map(b => (
                            <Col sm={6} md={4} lg={3} className="mb-4" key={b._id}>
                                <BookCard book={b} />
                            </Col>
                        ))}
                    </Row>
                    {totalPages > 1 && (
                        <PaginationControl currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    )}
                </>
            )}
        </>
    )
}
export default AdvancedSearchRes
