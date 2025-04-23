import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addBook, editBook } from '../redux/booksSlice';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';

interface BookFormProps {
    editId?: number;
}

interface FormState {
    title: string;
    authors: string;
    description: string;
    thumbnail: string;
    categories: string;
    pageCount: number;
}

interface FormErrors {
    title?: string;
    authors?: string;
    thumbnail?: string;
}

export default function BookForm({ editId }: BookFormProps) {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const editBookData = useSelector((s: RootState) =>
        s.books.books.find(b => b._id == editId)
    );

    const [form, setForm] = useState<FormState>({
        title: '',
        authors: '',
        description: '',
        thumbnail: '',
        categories: 'General',
        pageCount: 1
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (editBookData) {
            setForm({
                title: editBookData.title || '',
                authors: editBookData.authors ? editBookData.authors.join(', ') : '',
                description: editBookData.longDescription || editBookData.shortDescription || '',
                thumbnail: editBookData.thumbnailUrl || '',
                categories: editBookData.categories ? editBookData.categories.join(', ') : 'General',
                pageCount: editBookData.pageCount || 100
            });
        }
    }, [editBookData]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!form.authors.trim()) {
            newErrors.authors = 'At least one author is required';
        }

        if (form.thumbnail && !isValidUrl(form.thumbnail)) {
            newErrors.thumbnail = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        const randid = Math.floor(Math.random() * 10000)
        const payload = {
            _id: editId || randid,
            id: editId || randid,
            title: form.title,
            authors: form.authors.split(',').map(a => a.trim()),
            longDescription: form.description,
            shortDescription: form.description.substring(0, 150) + (form.description.length > 150 ? '...' : ''),
            thumbnailUrl: form.thumbnail,
            pageCount: form.pageCount,
            categories: form.categories.split(',').map(c => c.trim()),
            status: 'PUBLISH',
            isbn: editBookData?.isbn || `ISBN-${Date.now().toString().substring(7)}`,
            publishedDate: editBookData?.publishedDate || { $date: new Date().toISOString() }
        }
        if (editId) {
            dispatch(editBook(payload))
        } else {
            const existing = JSON.parse(localStorage.getItem("books") || "null")
            if (existing) {
                const updated = [payload,...existing]
                localStorage.setItem("books", JSON.stringify(updated))
                // dispatch(addBook((updated)))
            } else {
                localStorage.setItem("books", JSON.stringify([payload]))
            }
            dispatch(addBook(payload))
        }

        nav('/');
    };

    const handleInputChange = (field: keyof FormState, value: string | number) => {
        setForm({ ...form, [field]: value });
        if (errors[field as keyof FormErrors]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h3 className="m-0">{editId ? 'Edit' : 'Add New'} Book</h3>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={showPreview ? 8 : 12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Book Title</Form.Label>
                                <Form.Control
                                    placeholder="Enter book title"
                                    value={form.title}
                                    onChange={e => handleInputChange('title', e.target.value)}
                                    isInvalid={!!errors.title}
                                />
                                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Authors</Form.Label>
                                <Form.Control
                                    placeholder="Authors (comma separated)"
                                    value={form.authors}
                                    onChange={e => handleInputChange('authors', e.target.value)}
                                    isInvalid={!!errors.authors}
                                />
                                <Form.Control.Feedback type="invalid">{errors.authors}</Form.Control.Feedback>
                                <Form.Text className="text-muted">
                                    For multiple authors, separate with commas.
                                </Form.Text>
                            </Form.Group>

                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thumbnail URL</Form.Label>
                                        <Form.Control
                                            placeholder="https://example.com/image.jpg"
                                            value={form.thumbnail}
                                            onChange={e => handleInputChange('thumbnail', e.target.value)}
                                            isInvalid={!!errors.thumbnail}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.thumbnail}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Page Count</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            placeholder="Number of pages"
                                            value={form.pageCount}
                                            onChange={e => handleInputChange('pageCount', parseInt(e.target.value) || 0)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Categories</Form.Label>
                                <Form.Control
                                    placeholder="Categories (comma separated)"
                                    value={form.categories}
                                    onChange={e => handleInputChange('categories', e.target.value)}
                                />
                                <Form.Text className="text-muted">
                                    For multiple categories, separate with commas.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Book description"
                                    value={form.description}
                                    onChange={e => handleInputChange('description', e.target.value)}
                                />
                            </Form.Group>
                        </Col>

                        {showPreview && (
                            <Col md={4}>
                                <div className="border rounded p-3 h-100 d-flex flex-column">
                                    <h5 className="text-center mb-3">Preview</h5>
                                    <div className="d-flex justify-content-center mb-3">
                                        <img
                                            src={isValidUrl(form.thumbnail) ? form.thumbnail : "/api/placeholder/150/200"}
                                            alt="Book cover preview"
                                            style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                                            className="shadow-sm border"
                                        />
                                    </div>
                                    <h6 className="text-center">{form.title || 'Book Title'}</h6>
                                    <p className="text-center text-muted small mb-2">
                                        {form.authors || 'Author Name'}
                                    </p>
                                    <div className="mt-auto">
                                        <p className="small text-truncate">{form.description.substring(0, 100)}{form.description.length > 100 ? '...' : ''}</p>
                                    </div>
                                </div>
                            </Col>
                        )}
                    </Row>

                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowPreview(!showPreview)}
                            type="button"
                        >
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                        <div>
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={() => nav('/')}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                {editId ? 'Update' : 'Add'} Book
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}