import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Book } from '../redux/booksSlice';

interface BookCardProps {
    book: Book;
    onViewDetails?: (bookId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onViewDetails }) => {

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return 'Unknown Date';
        }
    };


    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(book._id);
        }
    };

    return (
        <Card className="h-100 shadow-sm">
            <div className="position-relative">
                <Card.Img
                    variant="top"
                    src={book.thumbnailUrl || '/default.png'}
                    alt={book.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => (e.target as HTMLImageElement).src = '/default.png'}
                />
                {book.status === 'PUBLISH' && (
                    <span className="position-absolute top-0 end-0 badge bg-success m-2">
                        Published
                    </span>
                )}
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate">{book.title}</Card.Title>
                <Card.Text className="text-muted mb-1 small">
                    {book.authors.join(', ')}
                </Card.Text>
                <Card.Text className="mb-1 small">
                    <span className="text-muted">Published: </span>
                    {formatDate(book.publishedDate.$date)}
                </Card.Text>
                <div className="mb-2">
                    {book.categories.map((category, index) => (
                        <span key={index} className="badge bg-light text-dark me-1 mb-1">
                            {category}
                        </span>
                    ))}
                </div>
                {book.shortDescription && (
                    <Card.Text className="small flex-grow-1 overflow-hidden text-truncate" style={{ maxHeight: '80px' }}>
                        {book.shortDescription}
                    </Card.Text>
                )}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="badge bg-info">{book.pageCount} pages</span>
                    <Button
                        as={Link}
                        to={`/book/${book._id}`}
                        variant="outline-primary"
                        size="sm"
                    >
                        View Details
                    </Button>
                </div>
            </Card.Body>
            <Card.Footer className="bg-white">
                <small className="text-muted">ISBN: {book.isbn}</small>
            </Card.Footer>
        </Card>
    );
};

export default BookCard;
