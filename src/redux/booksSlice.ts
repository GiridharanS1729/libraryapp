// src/redux/booksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { books as initialBooks, Book } from '../data';

interface BooksState {
    books: Book[];
}

const initialState: BooksState = {
    books: initialBooks,
};

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setBooks: (state, action: PayloadAction<Book[]>) => {
            state.books = action.payload;
        },
        addBook: (state, action: PayloadAction<Book>) => {
            state.books.push(action.payload);
        },
        editBook: (state, action: PayloadAction<Book>) => {
            const index = state.books.findIndex((book) => book._id === action.payload._id);
            if (index !== -1) {
                state.books[index] = action.payload;
            }
        },
        deleteBook: (state, action: PayloadAction<number>) => {
            state.books = state.books.filter((book) => book._id !== action.payload);
        },
        filterBooks: (state, action: PayloadAction<{
            title?: string
            author?: string
            category?: string
            status?: string
            yearFrom?: number
            yearTo?: number
            pageCountMin?: number
            pageCountMax?: number
        }>) => {
            const {
                title = '',
                author = '',
                category,
                status,
                yearFrom = 0,
                yearTo = 9999,
                pageCountMin = 0,
                pageCountMax = Infinity
            } = action.payload

            state.books = initialBooks.filter(b => {
                const pubYear = new Date(b.publishedDate?.$date).getFullYear()
                return (
                    b.title.toLowerCase().includes(title.toLowerCase()) &&
                    b.authors.some(a => a.toLowerCase().includes(author.toLowerCase())) &&
                    (!category || b.categories.includes(category)) &&
                    (!status || b.status === status) &&
                    pubYear >= yearFrom &&
                    pubYear <= yearTo &&
                    b.pageCount >= pageCountMin &&
                    b.pageCount <= pageCountMax
                )
            })
        
        }
    },
});

export const { setBooks, addBook, editBook, deleteBook, filterBooks } = booksSlice.actions;
export default booksSlice.reducer;
