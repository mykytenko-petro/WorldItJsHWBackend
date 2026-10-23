export interface PostResponse {
    id: number;
    title: string;
    content: string;
    author: string;
    categoryId: number | null;
    userId: number | null;
}

export interface PostWithRelationsResponse extends PostResponse {
    category: {
        id: number;
        name: string;
    } | null;
    user: {
        id: number;
        email: string;
    } | null;
}
