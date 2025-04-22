export interface Book {
    _id: number
    title: string
    isbn: string
    pageCount: number
    publishedDate: {
        $date: string
    }
    thumbnailUrl: string
    shortDescription?: string
    longDescription?: string
    status: string
    authors: string[]
    categories: string[]
}
