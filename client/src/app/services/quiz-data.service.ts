import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Quiz, QuizDto } from '../models/gametypes';
import { PaginatedResult } from '../models/pagination';

export interface QuizData {
  type: number;
  title: string;
  level: string;
  category: string;
  summary: string;
  data: object;
}

export class UserParams   {
  pageNumber: number = 1;
  itemsPerPage: number = 10;
  category: string = "";
  level: string = "";
}

@Injectable({
  providedIn: 'root'
})


export class QuizDataService {
  paginatedResult: PaginatedResult<QuizDto[]> = new PaginatedResult<QuizDto[]>
  
  private apiUrl = 'https://localhost:5003/api/quiz';

  constructor(private http: HttpClient) { }

  getQuiz(id: number): Observable<Quiz> {
    console.log("getQuiz",`${this.apiUrl}/${id}`)
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  getAllQuizzes(){
    return this.http.get<QuizDto[]>(`${this.apiUrl}`);
  }

  getPagedQuizzes(userParams:UserParams)
  {
    let params = new HttpParams();
    if(userParams)
    {
      if(userParams.pageNumber && userParams.itemsPerPage)
      {
          params = params.append('pageNumber', userParams.pageNumber);
          params = params.append('pageSize', userParams.itemsPerPage);
      }
      if(userParams.category && userParams.category != "")
      {
          params = params.append('category', userParams.category);
      }
      if(userParams.level && userParams.level != "")
      {
          params = params.append('level', userParams.level);
      }
    }

    return this.http.get<QuizDto[]>(`${this.apiUrl}`, {observe: 'response', params})
      .pipe(
        map(response => {
          if(response.body){
            this.paginatedResult.result = response.body;
          }
          const pagination = response.headers.get('Pagination');
          if(pagination){
            this.paginatedResult.pagination = JSON.parse(pagination);
          }
          console.log("results", this.paginatedResult);
          return this.paginatedResult;
        })
    )
  }
}
