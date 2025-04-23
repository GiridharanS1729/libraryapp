import BookForm from '../components/BookForm'
import { useParams } from 'react-router-dom'

export default function EditBook() {
    const { id } = useParams()
    return <BookForm editId={Number(id)} />
}
