import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../redux/store';

interface SearchFilters {
    title: string;
    author: string;
    category: string;
    status: string;
    yearFrom: string;
    yearTo: string;
    pageCountMin: string;
    pageCountMax: string;
}

interface BookSearchResult {
    _id: number;
    title: string;
    authors: string[];
    thumbnailUrl?: string;
    categories: string[];
    status: string;
    publishedDate: {
        $date: string;
    };
    pageCount: number;
}

const AdvancedSearch: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const books = useSelector((state: RootState) => state.books.books);


    const categories = Array.from(new Set(books.flatMap(book => book.categories)));
    const authors = Array.from(new Set(books.flatMap(book => book.authors)));
    const statuses = Array.from(new Set(books.map(book => book.status)));


    const [filters, setFilters] = useState<SearchFilters>({
        title: searchParams.get('title') || '',
        author: searchParams.get('author') || '',
        category: searchParams.get('category') || '',
        status: searchParams.get('status') || '',
        yearFrom: searchParams.get('yearFrom') || '',
        yearTo: searchParams.get('yearTo') || '',
        pageCountMin: searchParams.get('pageCountMin') || '',
        pageCountMax: searchParams.get('pageCountMax') || ''
    });

    const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);


    useEffect(() => {
        let count = 0;
        Object.values(filters).forEach(value => {
            if (value) count++;
        });
        setActiveFiltersCount(count);


        if (count > 0 && !hasSearched && searchParams.toString()) {
            handleSearch();
        }
    }, [filters, searchParams]);


    const handleFilterChange = (field: keyof SearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };


    const handleReset = () => {
        setFilters({
            title: '',
            author: '',
            category: '',
            status: '',
            yearFrom: '',
            yearTo: '',
            pageCountMin: '',
            pageCountMax: ''
        });
        setSearchResults([]);
        setHasSearched(false);
        navigate('/advanced-search');
    };


    const handleSearch = () => {

        const filteredBooks = books.filter(book => {

            if (filters.title && !book.title.toLowerCase().includes(filters.title.toLowerCase())) {
                return false;
            }


            if (filters.author && !book.authors.some(author =>
                author.toLowerCase().includes(filters.author.toLowerCase())
            )) {
                return false;
            }


            if (filters.category && !book.categories.includes(filters.category)) {
                return false;
            }


            if (filters.status && book.status !== filters.status) {
                return false;
            }


            if (book.publishedDate && book.publishedDate.$date) {
                const publishYear = new Date(book.publishedDate.$date).getFullYear();

                if (filters.yearFrom && publishYear < parseInt(filters.yearFrom)) {
                    return false;
                }

                if (filters.yearTo && publishYear > parseInt(filters.yearTo)) {
                    return false;
                }
            }


            if (filters.pageCountMin && book.pageCount < parseInt(filters.pageCountMin)) {
                return false;
            }

            if (filters.pageCountMax && book.pageCount > parseInt(filters.pageCountMax)) {
                return false;
            }

            return true;
        });

        setSearchResults(filteredBooks);
        setHasSearched(true);


        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        navigate({
            pathname: '/advanced-search',
            search: params.toString()
        });
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };


    const navigateToBook = (bookId: number) => {
        navigate(`/book/${bookId}`);
    };

    return (
        <div>
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="m-0">Advanced Search</h3>
                    {activeFiltersCount > 0 && (
                        <Badge bg="light" text="dark" pill>
                            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                        </Badge>
                    )}
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by title"
                                        value={filters.title}
                                        onChange={(e) => handleFilterChange('title', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Author</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by author"
                                        value={filters.author}
                                        onChange={(e) => handleFilterChange('author', e.target.value)}
                                        list="author-suggestions"
                                    />
                                    <datalist id="author-suggestions">
                                        {authors.map((author, index) => (
                                            <option key={`author-${index}`} value={author} />
                                        ))}
                                    </datalist>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category, index) => (
                                            <option key={`category-${index}`} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <option value="">All Statuses</option>
                                        {statuses.map((status, index) => (
                                            <option key={`status-${index}`} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Label>Publication Year</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="number"
                                                placeholder="From"
                                                min="1800"
                                                max={new Date().getFullYear()}
                                                value={filters.yearFrom}
                                                onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="number"
                                                placeholder="To"
                                                min="1800"
                                                max={new Date().getFullYear()}
                                                value={filters.yearTo}
                                                onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>

                            <Col md={6}>
                                <Form.Label>Page Count</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="number"
                                                placeholder="Min pages"
                                                min="1"
                                                value={filters.pageCountMin}
                                                onChange={(e) => handleFilterChange('pageCountMin', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="number"
                                                placeholder="Max pages"
                                                min="1"
                                                value={filters.pageCountMax}
                                                onChange={(e) => handleFilterChange('pageCountMax', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-3">
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={handleReset}
                                type="button"
                            >
                                Reset Filters
                            </Button>
                            <Button variant="primary" type="submit">
                                Search
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            { }
            {hasSearched && (
                <Card className="shadow-sm">
                    <Card.Header className="bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="m-0">Search Results</h4>
                            <Badge bg="secondary">{searchResults.length} book{searchResults.length !== 1 ? 's' : ''}</Badge>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {searchResults.length > 0 ? (
                            <div className="list-group">
                                {searchResults.map((book) => (
                                    <div
                                        key={book._id}
                                        className="list-group-item list-group-item-action d-flex gap-3 py-3"
                                        onClick={() => navigateToBook(book._id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div style={{ width: '60px', height: '90px', flexShrink: 0 }}>
                                            <img
                                                src={book.thumbnailUrl || "/api/placeholder/60/90"}
                                                alt={book.title}
                                                className="img-fluid"
                                                style={{ maxWidth: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="d-flex w-100 justify-content-between">
                                            <div>
                                                <h5 className="mb-1">{book.title}</h5>
                                                <p className="mb-1 text-muted">
                                                    By {book.authors.join(', ')}
                                                </p>
                                                <div>
                                                    {book.categories.map((category, i) => (
                                                        <Badge
                                                            key={`cat-${book._id}-${i}`}
                                                            bg="light"
                                                            text="dark"
                                                            className="me-1"
                                                        >
                                                            {category}
                                                        </Badge>
                                                    ))}
                                                    <Badge
                                                        bg={book.status === 'PUBLISH' ? 'success' : 'warning'}
                                                        className="ms-1"
                                                    >
                                                        {book.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <small className="text-muted">
                                                    {new Date(book.publishedDate.$date).getFullYear()}
                                                </small>
                                                <div>
                                                    <Badge bg="info">{book.pageCount} pages</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <p className="mb-0">No books match your search criteria.</p>
                                <Button
                                    variant="link"
                                    onClick={handleReset}
                                >
                                    Clear filters and try again
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default AdvancedSearch;