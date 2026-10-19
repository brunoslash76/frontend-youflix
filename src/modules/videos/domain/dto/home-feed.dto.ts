import type { VideoListItem } from "../entity/video-list-item.entity";

export interface HomeFeed {
  personalized: boolean;
  items: VideoListItem[];
  total: number;
  page: number;
  limit: number;
}