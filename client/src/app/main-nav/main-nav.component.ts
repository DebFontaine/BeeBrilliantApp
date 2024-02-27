import { ChangeDetectorRef, Component, SimpleChanges, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../snackbar/custom-snackbar/custom-snackbar.component';


@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  durationInSeconds = 5;
  model: any = {};
  currentUser$: Observable<User | null> = of(null);
  showAdmin = false;
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
  constructor(private accountService: AccountService,
    private router: Router,
    private toast: MatSnackBar)
  {

  }
  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$;
  }

 

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      this.model.username = loginForm.value.username;
      this.model.password = loginForm.value.password;
      this.accountService.login(this.model).subscribe({
        next: response => {
          console.log(response);
          this.showAdmin = true;
          this.router.navigateByUrl('/home')
        },
        error: error => {
          console.log(error);
        }
      })
    }

  }
  logout()
  {
    this.accountService.logout();
    this.router.navigateByUrl('/home')
  }
 
  displayError(message: string) {
    this.toast.openFromComponent(CustomSnackbarComponent, {
      duration: 5000, // Adjust as needed
      data: {
        message: message,
        dismiss: () => this.toast.dismiss(),
      },
    });
  }

  displayAdmin(user: User | null)
  {
    if(!user) return false;
    console.log("user",user)
    if(user.roles.includes('Admin') || user.roles.includes('Moderator')){
      return true;
    }
    return false;
  }
}
