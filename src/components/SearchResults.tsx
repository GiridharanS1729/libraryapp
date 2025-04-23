import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Card, Container, Row, Col } from 'react-bootstrap'
import BookCard from './BookCard'

const SearchResults: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || ''
    const books = useSelector((state: RootState) => state.books.books)
    const [filtered, setFiltered] = useState(books)

    useEffect(() => {
        if (query.length > 0) {
            const res = books.filter(b =>
                b.title.toLowerCase().includes(query) ||
                b.authors.some(a => a.toLowerCase().includes(query)) ||
                b.categories.some(c => c.toLowerCase().includes(query))
            )
            setFiltered(res)
        } else {
            setFiltered([])
        }
    }, [query, books])

    return (
        <Container className="mt-4">
            <h4 className="mb-4">Results for "{query}"</h4>
            {filtered.length > 0 ? (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {filtered.map(b => (
                        <Col key={b._id}>
                            <BookCard book={b} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center text-muted">No books found for "{query}"</div>
            )}
        </Container>
    )
}

export default SearchResults
