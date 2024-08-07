export interface IPostsTranslation {
  id: string;
  languageCode: string;
  description: string;
  postsId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPosts {
  id: string;
  linkedinId: string;
  image?: string;
  likes: number;
  commentsSum: number;
  link: string;
  translations: IPostsTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IPostsResponse {
  findManyPosts: IPosts;
}

export interface PostsInitialValues {
  link: string | undefined;
  likes: string;
  commentsSum: string;
  enDescription: string | undefined;
  kaDescription: string | undefined;
}
