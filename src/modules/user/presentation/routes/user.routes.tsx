import type { RouteObject } from 'react-router';

import { ProfilePage } from '../pages/profile.page';

export const userRoutes: RouteObject[] = [
  { path: '/profile', element: <ProfilePage /> },
] 