import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from './quiz-data.service';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private http: HttpClient) { }

  getPagedResults<T>(apiUrl: string, userParams: UserParams): Observable<PaginatedResult<T>> {
    let params = new HttpParams();
    if (userParams) {
      console.log("Pagination", userParams)
      if (userParams.pageNumber && userParams.itemsPerPage) {
        params = params.append('pageNumber', userParams.pageNumber.toString());
        params = params.append('pageSize', userParams.itemsPerPage.toString());
      }
      if (userParams.category && userParams.category !== "") {
        params = params.append('category', userParams.category);
      }
      if (userParams.level && userParams.level !== "") {
        params = params.append('level', userParams.level);
      }
      console.log("Pagination params", params)
    }

    return this.http.get<T>(apiUrl, { observe: 'response', params })
      .pipe(
        map(response => {
          const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
          if (response.body) {
            console.log("Response", response.body)
            paginatedResult.result = response.body;
          }
          const pagination = response.headers.get('Pagination');
          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }
          return paginatedResult;
        })
      );
  }
}
