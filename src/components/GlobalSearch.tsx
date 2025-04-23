import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { Search } from 'react-bootstrap-icons';
interface BookSearchResult {
    _id: number;
    title: string;
    authors: string[];
    thumbnailUrl?: string;
}
const GlobalSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const books = useSelector((state: RootState) => state.books.books);
    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                const filteredBooks = books.filter(book => {
                    const searchLower = searchTerm.toLowerCase();
                    if (book.title.toLowerCase().includes(searchLower)) {
                        return true;
                    }
                    if (book.authors.some(author => author.toLowerCase().includes(searchLower))) {
                        return true;
                    }
                    if (book.categories.some(category => category.toLowerCase().includes(searchLower))) {
                        return true;
                    }
                    return false;
                });
                setSearchResults(filteredBooks.slice(0, 5).map(book => ({
                    _id: book._id,
                    title: book.title,
                    authors: book.authors,
                    thumbnailUrl: book.thumbnailUrl
                })));
                setIsSearching(false);
                setShowResults(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchTerm, books]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleSelectBook = (bookId: number) => {
        setShowResults(false);
        setSearchTerm('');
        navigate(`/book/${bookId}`);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setShowResults(false);
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };
    const navigateToAdvancedSearch = () => {
        setShowResults(false);
        navigate('/advanced-search');
    };
    return (
        <div ref={searchRef} className="position-relative">
            <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                    <Search />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.trim().length > 0 && setShowResults(true)}
                    className="border-start-0"
                />
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Search
                </Button>
                <Button
                    variant="outline-secondary"
                    onClick={navigateToAdvancedSearch}
                    title="Advanced Search"
                    as={Link as any}
                    to="/advanced"
                >
                    <i className="bi bi-filter">Advanced </i>

                </Button>
            </InputGroup>
            { }
            {showResults && searchResults.length > 0 && (
                <div className="position-absolute w-100 mt-1 shadow-lg rounded-3 bg-white z-index-dropdown" style={{ zIndex: 1000 }}>
                    <ul className="list-group">
                        {searchResults.map((book) => (
                            <li
                                key={book._id}
                                className="list-group-item list-group-item-action d-flex align-items-center cursor-pointer"
                                onClick={() => handleSelectBook(book._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="me-2" style={{ width: '40px', height: '40px' }}>
                                    <img
                                        src={book.thumbnailUrl || "/api/placeholder/40/60"}
                                        alt={book.title}
                                        className="img-fluid"
                                        style={{ maxHeight: '40px', maxWidth: '40px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="fw-bold text-truncate">{book.title}</div>
                                    <div className="small text-muted text-truncate">
                                        {book.authors.join(', ')}
                                    </div>
                                </div>
                            </li>
                        ))}
                        <li className="list-group-item list-group-item-action text-primary text-center">
                            <span onClick={handleSubmit} style={{ cursor: 'pointer' }}>
                                See all results for "{searchTerm}"
                            </span>
                        </li>
                    </ul>
                </div>
            )}
            {showResults && searchTerm.trim().length > 1 && searchResults.length === 0 && !isSearching && (
                <div className="position-absolute w-100 mt-1 shadow-lg rounded-3 bg-white z-index-dropdown" style={{ zIndex: 1000 }}>
                    <div className="p-3 text-center text-muted">
                        No results found for "{searchTerm}"
                    </div>
                </div>
            )}
        </div>
    );
};
export default GlobalSearch;