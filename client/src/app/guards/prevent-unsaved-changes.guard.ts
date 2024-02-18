import { CanActivateFn } from '@angular/router';

export const preventUnsavedChangesGuard: CanActivateFn = (route, state) => {
  return true;
};

/* export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = 
  (component) => {
    const confirmService = inject(ConfirmService);
    if(component.editForm?.dirty){
      return confirmService.confirm();
    }
    return true;
}; */

//then add to routing