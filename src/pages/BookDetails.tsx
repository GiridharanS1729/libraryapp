import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store'
import { deleteBook } from '../redux/booksSlice'
import { Container, Row, Col, Card } from 'react-bootstrap'
import BButton from '../ReuseC/BButton'

export default function BookDetails() {
    const { id } = useParams()
    const nav = useNavigate()
    const dispatch = useDispatch()
    const book = useSelector((s: RootState) => s.books.books.find(b => b.id == id))

    if (!book) return (
        <Container className="mt-5 text-center">
            <div className="alert alert-warning">Book not found</div>
        </Container>
    )

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center mb-3 mb-md-0">
                            <img
                                src={book.thumbnailUrl || "/default.png"}
                                alt={book.title}
                                className="img-fluid rounded"
                                style={{ maxHeight: '400px', height: '80vh' }}
                            />
                        </Col>
                        <Col md={8}>
                            <Card.Title as="h2" className="mb-3">{book.title}</Card.Title>
                            <Card.Text className="text-muted mb-4 bdl pr-2">{book.longDescription}</Card.Text>

                            <div className="d-flex gap-2">
                                <BButton
                                    variant="outline-secondary"
                                    label="Back"
                                    onClick={() => nav('/')}
                                />

                                <BButton
                                    variant="primary"
                                    label="Edit"
                                    onClick={() => nav(`/edit/${book.id}`)}
                                />

                                <BButton
                                    variant="danger"
                                    label="Delete"
                                    onClick={() => {
                                        dispatch(deleteBook(book._id))
                                        nav('/')
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}