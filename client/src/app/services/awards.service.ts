import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AwardsDto } from '../models/awards';
import { User } from '../models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class AwardsService {
  private hubConnection?: HubConnection;
  private awardThreadSource = new BehaviorSubject<AwardsDto | null>(null);
  awardThread$ = this.awardThreadSource.asObservable();
  
  constructor(private http: HttpClient) { 
    console.log("Environment is production", environment.production);
    console.log("Url", environment.reportingApiUrl);
  }

  private apiUrl = environment.reportingApiUrl + 'awards';
  private hubUrl = environment.hubUrl + 'awards';


  getAwardsForUser(id: number){

    return this.http.get<AwardsDto[]>(`${this.apiUrl}/user/${id}`);
  }
  createHubConnection(user: User)
  {
    console.log("url", this.hubUrl)
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();
      console.log("token", user.token)
      this.hubConnection.start()
        .catch(error => console.log(error))

      /* this.hubConnection.on('AwardAdded', award => {
        this.awardThread$.pipe(take(1)).subscribe({
          next: awards => {
            console.log("award from signalR", award)
            this.awardThreadSource.next(award);
          }
        })
      }) */

      this.hubConnection.on('AwardAdded', award => {
        console.log("award from signalR", award);
        this.awardThreadSource.next(award);
    });
  } 

  stopHubConnection() {
    if(this.hubConnection)
    {
      console.log("stopping hub connection")
      this.awardThreadSource.next(null);
      this.hubConnection?.stop();
    }
  }
}
