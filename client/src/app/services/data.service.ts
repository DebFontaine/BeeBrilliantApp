import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResultsDto } from '../models/results';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataReadySource = new Subject<ResultsDto[]>();
  dataReady$ = this.dataReadySource.asObservable();

  constructor() { }


  notifyDataReady(results: ResultsDto[]) {
    this.dataReadySource.next(results);
  }
}
