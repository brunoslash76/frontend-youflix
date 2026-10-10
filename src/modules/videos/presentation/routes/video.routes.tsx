import type { RouteObject } from 'react-router';

import { VideosPage } from './../pages/videos.page';

export const videoRoutes: RouteObject[] = [
  { path: '/', element: <VideosPage /> },
] 