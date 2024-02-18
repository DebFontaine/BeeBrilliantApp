import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  registerMode:boolean = false;
  currentUser$: Observable<User | null> = of(null);

  constructor(private accountService : AccountService){}

  ngOnInit()
  {
    this.currentUser$ = this.accountService.currentUser$;
  }
  
  registerToggle()
  {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean)
  {
    console.log("cancelRegister", event)  
    this.registerMode = event;
  }

}
