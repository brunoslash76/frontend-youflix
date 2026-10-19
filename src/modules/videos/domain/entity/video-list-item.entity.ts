import type { GenreEntity } from "./genre.entity";

export interface VideoListItem {
  publicId: string;
  title: string;
  genres: GenreEntity[];
  views: number;
  createdAt: Date;
  thumbnailUrl: string | null;
}