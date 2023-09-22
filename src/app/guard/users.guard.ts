import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../pages/services/users.service';
import { inject } from '@angular/core';

export const usersGuard: CanActivateFn = (route, state) => {
  const userSvc = inject(UsersService);
  const router = inject(Router);

  if(userSvc.isLoggedIn()){
    return true; 
    console.log("logeado");
  }
  else{
    router.navigate(['login']);
    console.log("deslogeado");
    return false;

  }

};
