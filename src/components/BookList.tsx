import { useSelector } from 'react-redux'
import PaginationControl from './PaginationControl'
import { useState } from 'react'
import { RootState } from '../redux/store'
import { Col, Row } from 'react-bootstrap'
import BookCard from './BookCard'

export default function BookList() {
    const books = useSelector((s: RootState) => s.books.books)
    const [page, setPage] = useState(1)
    const perPage = 8

    const sortedBooks = [...books].sort((a, b) => {
        const d1 = new Date(a.publishedDate?.$date || 0).getTime()
        const d2 = new Date(b.publishedDate?.$date || 0).getTime()
        return d2 - d1
    })

    const totalPages = Math.ceil(sortedBooks.length / perPage)
    const currentBooks = sortedBooks.slice((page - 1) * perPage, page * perPage)

    return (
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
    )
}
