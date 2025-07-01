import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CheckUserService } from 'src/app/services/user-role/check-user.service';

export const activeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('login');
  const routerPath = route.routeConfig?.path ?? '';
  const userRoute = ['auth'].includes(routerPath);
  if (user) {
    const userData = JSON.parse(user);
    if (userData.role && userData.id && userRoute) {
      router.navigate(['main']);
      return true;
    } else {
      return true;
    }
  } else {
    if (!user && !userRoute) {
      localStorage?.removeItem('login');
      router.navigate(['auth']);
      return true;
    } else {
      return true;
    }
  }
};
