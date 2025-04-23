import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import { Book } from '../redux/booksSlice';
import { Book } from '../data';
import CButton from '../ReuseC/CButton';

interface BookCardProps {
    book: Book;
    onViewDetails?: (bookId: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {

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

    return (
        <Card className="h-100 shadow-sm">
            <div className="position-relative">
                <Card.Img
                    className='b-img'
                    variant="top"
                    src={book.thumbnailUrl || '/default.png'}
                    alt={book.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => (e.target as HTMLImageElement).src = '/default.png'}
                />
                {book.status === 'PUBLISH' ? (
                    <CButton
                        label="Published"
                        clas="position-absolute top-0 end-0 badge bg-success m-2"
                    />
                ) : (
                    <CButton
                        label="Yet to be Published"
                        clas="position-absolute top-0 end-0 badge bg-danger m-2"
                    />
                )}

            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate">{book.title}</Card.Title>
                <Card.Text className="text-muted mb-1 small">
                    {book.authors && book.authors.length > 1 ? book.authors.join(', ') : book.authors} 
                    
                </Card.Text>
                <Card.Text className="mb-1 small">
                    <span className="text-muted">Published: </span>
                    {formatDate(book.publishedDate?.$date)}
                </Card.Text>
                <div className="mb-2">
                    {book.categories?.map((category: any, index: any) => (
                        <CButton
                            clas="badge bg-light text-dark me-1 mb-1 ctg"
                            key={index}
                            label={category}
                        />
                    ))}
                </div>
                {book.shortDescription ? (
                    <Card.Text className="small flex-grow-1 overflow-hidden" style={{ maxHeight: '80px' }}>
                        {book.shortDescription}
                    </Card.Text>
                ) :
                    book.longDescription ?
                        (
                            <Card.Text className="small flex-grow-1 overflow-hidden" style={{ maxHeight: '80px' }}>
                                {book.longDescription}
                            </Card.Text>
                        ) :
                        (
                            <Card.Text className="small flex-grow-1 overflow-hidden" style={{ maxHeight: '80px' }}>
                                No Description Available
                            </Card.Text>
                        )}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <CButton clas="badge bg-info" label={`${book.pageCount != 0 ? book.pageCount:1} pages`} />
                    <Button
                        as={Link as any}
                        to={`/book/${book._id}`}
                        variant="outline-primary"
                        size="sm"
                    >
                        View Details
                    </Button>
                    
                </div>
            </Card.Body>
            <Card.Footer className="bg-white">
                <small className="text-muted"><b>ISBN:</b> {book.isbn}</small>
            </Card.Footer>
        </Card>
    );
};

export default BookCard;
