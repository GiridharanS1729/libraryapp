import { Button, Col, Container, Row } from 'react-bootstrap'
import BookList from '../components/BookList'
import SearchBar from '../components/SearchBar'
import { Link } from 'react-router-dom'
// import AdvancedSearch from '../components/AdvancedSearch'

export default function Home() {
    return (
        <>
            <BookList />
        </>
    )
}
