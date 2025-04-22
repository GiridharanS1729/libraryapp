import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store'
import { deleteBook } from '../redux/booksSlice'
import { Button } from 'react-bootstrap'

export default function BookDetails() {
    const { id } = useParams()
    const nav = useNavigate()
    const dispatch = useDispatch()
    const book = useSelector((s: RootState) => s.books.books.find(b => b.id == id))

    if (!book) return <div>Book not found</div>

    return (
        <div>
            <h2>{book.title}</h2>
            <img src={book.thumbnailUrl} alt={book.title} />
            <p>{book.longDescription}</p>
            <Button variant="secondary" onClick={() => nav('/')}>Back</Button>{' '}
            <Button variant="primary" onClick={() => nav(`/edit/${book.id}`)}>Edit</Button>{' '}
            <Button variant="danger" onClick={() => {
                dispatch(deleteBook(book._id))
                nav('/')
            }}>Delete</Button>
        </div>
    )
}
