import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { User } from '../models/user';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  baseUrl = environment.reportingApiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]> ([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor() { }

  createHubConnection(user: User)
  {
    console.log("url", this.hubUrl)
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'notification', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start()
        .catch(error => console.log(error))

      this.hubConnection.on('ReceiveAwardNotification', message => {
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages => {
            console.log("new message", message);
            this.messageThreadSource.next([...messages, message]);
          }
        })
      })
  } 

  stopHubConnection() {
    if(this.hubConnection)
    {
      console.log("stopping hub connection")
      this.messageThreadSource.next([]);
      this.hubConnection?.stop();
    }
  }
}
