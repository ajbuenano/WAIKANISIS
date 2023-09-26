import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../pages/services/users.service';
import { inject } from '@angular/core';

export const usersGuard: CanActivateFn = (route, state) => {
  const userSvc = inject(UsersService);
  const router = inject(Router);

  if(userSvc.isLoggedIn()){
    console.log("loggeado");
    let userRole = userSvc.getUserRole(); 
    console.log(userRole);// Roles del usuario actual
    // Verifica si el rol necesario está presente en los roles del usuario
    console.log(route);
    const requiredRoles = (route.data as any)['roles'] as string[];
    console.log(requiredRoles);
    const hasRequiredRole = requiredRoles.some(role => role === userRole);
    console.log(hasRequiredRole);
    if (hasRequiredRole){
      console.log("autorizado");
      return true;
    }
    else{
      console.log("no autorizado");
      return false;
    }
  }
  else{
    router.navigate(['login']);
    console.log("deslogeado");
    return false;

  }

};
