import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Member, User } from '../models/user';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NotificationService } from './notification.service';
import { AwardsService } from './awards.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.accountApiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();


  constructor(private http: HttpClient, private notificationService: NotificationService, private awardService: AwardsService) { 
   
  }

  login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response:User) => {
        const user = response;
        if(user) {
          console.log("current user",user)
          this.setCurrentUser(user);
          this.notificationService.createHubConnection(user)
          this.awardService.createHubConnection(user)
        }
        return user;
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map( user => {
    
        if(user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user:User)
  {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    console.log("roles", roles)
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  getMember(username: string){
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
 }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.notificationService.stopHubConnection()
    this.awardService.stopHubConnection()
  }
  getDecodedToken(token:string){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
