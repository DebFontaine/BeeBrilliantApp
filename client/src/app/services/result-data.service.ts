import { Injectable } from '@angular/core';
import { PaginationService } from './pagination.service';
import { UserParams } from './quiz-data.service';
import { AddResultsDto, ResultsDto } from '../models/results';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultDataService {
  //private apiUrl = 'https://localhost:5005/api/results'; 
  private apiUrl = environment.reportingApiUrl + 'results';

  constructor(private http: HttpClient, private paginationService: PaginationService) { }

  getPagedResults(id:number, userParams: UserParams) {
    console.log("params", userParams)
    return this.paginationService.getPagedResults<ResultsDto[]>(this.apiUrl + '/user/' + id, userParams);
  }
  saveResult(result: AddResultsDto)
  {
    console.log("saving result", result)
    return this.http.post(this.apiUrl, result );
  }
}
