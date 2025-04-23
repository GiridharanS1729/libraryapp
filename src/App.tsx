import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddBook from './pages/AddBook'
import BookDetails from './pages/BookDetails'
import EditBook from './pages/EditBook'
import AdvancedSearch from './components/AdvancedSearch'
import AdvancedSearchRes from './components/AdvancedSearchRes'
import NavBar from './components/NavBar'
import SearchResults from './components/SearchResults'

export default function App() {
  return (
    <Router>
      <NavBar/>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/edit/:id" element={<EditBook />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/advanced" element={<AdvancedSearch />} />
          <Route path="/advanced-search" element={<AdvancedSearchRes />} />
        </Routes>
      </Container>
    </Router>
  )
}
