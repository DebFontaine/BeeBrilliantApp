import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { User } from '../models/user';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const toast = inject(MatSnackBar);
  
  return accountService.currentUser$.pipe(
    map(user => {
      if(user) 
      {
        console.log("user", user)
        return true;
      }
      else {
        router.navigate(['/register']);
        return false;
      }
    })
  )
  return true;
};
