export interface VideoDetailResponseDto {
  publicId: string;
  title: string;
  description: string;
  genreIds: string[];
  thumbnailIndex?: number;
  customThumbnailKey?: string
}