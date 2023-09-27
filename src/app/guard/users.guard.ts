import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../pages/services/users.service';
import { inject } from '@angular/core';

export const usersGuard: CanActivateFn = (route, state) => {
  const userSvc = inject(UsersService);
  const router = inject(Router);

  if(userSvc.isLoggedIn()){
    let userRole = userSvc.getUserRole(); 
    const requiredRoles = (route.data as any)['roles'] as string[];
    const hasRequiredRole = requiredRoles.some(role => role === userRole);
    if (hasRequiredRole){
      return true;
    }
    else{
      router.navigate(['/']);
      return false;
    }
  }
  else{
    router.navigate(['login']);
    return false;
  }

};
