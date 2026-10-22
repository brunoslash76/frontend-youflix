import type { GenreEntity } from "./genre.entity";

export interface VideoListItem {
  publicId: string;
  title: string;
  genres: GenreEntity[];
  views: number;
  author: {
    id: string;
    username: string;
  };
  createdAt: string;
  thumbnailUrl: string | null;
}