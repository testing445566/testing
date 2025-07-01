import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const childGuardGuard: CanActivateFn = (route, state) => {
  let isAdmin;
  const user = localStorage.getItem('login');

  if (user) {
    const admin = JSON.parse(user).role;
    isAdmin = admin === 'admin' ? true : false;
  }
  const router = inject(Router);
  const routePath = route.routeConfig?.path ?? '';
  const isValid = ['user-management', 'all-reports', 'compliance'].includes(
    routePath
  );

  if (isAdmin) {
    if (!isValid) {
      router.navigate(['main']);
      return true;
    } else {
      return true;
    }
  } else {
    if (isValid) {
      router.navigate(['main']);
      return true;
    } else {
      return true;
    }
  }
};
