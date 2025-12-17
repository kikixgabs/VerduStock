import { inject } from '@angular/core';
import { CanActivateFn, Router, CanActivateChildFn } from '@angular/router';
import { AuthService } from '@app/global/services/auth-service/auth-service';

export const authGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/login']);
};
