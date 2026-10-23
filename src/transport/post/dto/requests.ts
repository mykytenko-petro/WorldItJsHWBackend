export interface GetPostsQuery {
    category?: string;
    take?: string;
}

export interface GetPostByIdParams {
    id: string;
}

export interface CreatePostBody {
    title: string;
    content: string;
    authorId: number;
    categoryId: number;
}
