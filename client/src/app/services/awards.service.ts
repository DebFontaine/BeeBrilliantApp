import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AwardsDto } from '../models/awards';

@Injectable({
  providedIn: 'root'
})
export class AwardsService {
  
  constructor(private http: HttpClient) { 
    console.log("Environment is production", environment.production);
    console.log("Url", environment.reportingApiUrl);
  }

  private apiUrl = environment.reportingApiUrl + 'awards';


  getAwardsForUser(id: number){

    return this.http.get<AwardsDto[]>(`${this.apiUrl}/user/${id}`);
  }
}
