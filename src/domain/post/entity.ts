export interface PostEntity {
    id: number;

    title: string;
    content: string;
    author: string;

    categoryId: number | null;
    userId: number | null;
}
