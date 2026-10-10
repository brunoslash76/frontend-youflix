import type { RouteObject } from 'react-router';

import { LoginPage } from '@/modules/auth/presentation/page/login.page';
import { ActivationPendingPage } from '../page/activation-pending.page';
import { ConfirmRegistrationPage } from '../page/confirm-registration.page';
import { RegisterPage } from '../page/register.page';

export const authRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/activation-pending', element: <ActivationPendingPage /> },
  { path: '/confirm-registration', element: <ConfirmRegistrationPage /> },
] 