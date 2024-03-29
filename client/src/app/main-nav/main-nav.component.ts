import { ChangeDetectorRef, Component, SimpleChanges, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../snackbar/custom-snackbar/custom-snackbar.component';
import { NotificationService } from '../services/notification.service';


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
  private messageSubscription: Subscription | undefined;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
  constructor(private accountService: AccountService,
    private router: Router,
    private toast: MatSnackBar,
    private notificationService: NotificationService)
  {

  }
  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$;
  }

  subscribeToAwardMessageThread(): void {
    this.messageSubscription = this.notificationService.messageThread$.subscribe(messages => {
      if (messages && messages.length > 0) {
        const award = messages[messages.length - 1];
        const toastMessage = `Congratulations! You have earned a new ${award} award!`
        this.showNotification(toastMessage);
      }
    });
  }
  showNotification(message: any) {
    this.toast.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      verticalPosition: 'top', horizontalPosition: 'right'
    });
  }

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      this.model.username = loginForm.value.username;
      this.model.password = loginForm.value.password;
      this.accountService.login(this.model).subscribe({
        next: response => {
          this.showAdmin = true;
          this.subscribeToAwardMessageThread();
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
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.router.navigateByUrl('/register')
  }
}
