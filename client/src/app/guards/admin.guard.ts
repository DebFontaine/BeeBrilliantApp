import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toast = inject(MatSnackBar);

  return accountService.currentUser$.pipe(
    map(user => {
      if (!user) return false;
      if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
        return true;
      }
      else {
        toast.open('You must be an Admin to access this area', undefined, {
          duration: 5 * 1000
        });
        return false;
      }
    })
  )
};
