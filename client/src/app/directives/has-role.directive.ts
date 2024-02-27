import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective{
  @Input() appHasRole: string[] = [];
  user: User = {} as User

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>,
      private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => {
          if(user) {
            this.user = user;
            console.log("roles", user.roles)
          }
          else
          {
            console.log("no user")
          }
        }
      })
   }

   ngOnInit(){
      console.log("checking roles", this.user?.roles);
      if( this.user?.roles.some(r =>this.appHasRole.includes(r))){
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
      else {
        this.viewContainerRef.clear(); //removes element from the DOM
      }
   }

}
