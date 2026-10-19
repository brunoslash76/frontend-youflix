import type { RouteObject } from 'react-router';

import { ShortsPage } from '../pages/shorts.page';
import { HistoryPage } from './../pages/history.page';
import { VideosPage } from './../pages/videos.page';

export const videoRoutes: RouteObject[] = [
  { path: '/', element: <VideosPage /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '/shorts', element: <ShortsPage /> },
]
