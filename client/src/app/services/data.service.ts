import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResultsDto } from '../models/results';
import { Member } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataReadySource = new Subject<ResultsDto[]>();
  dataReady$ = this.dataReadySource.asObservable();
  private memberReadySource = new Subject<Member>();
  memberReady$ = this.memberReadySource.asObservable();

  constructor() { }


  notifyMemberReady(member: Member) {
    this.memberReadySource.next(member);
  }
  notifyDataReady(results: ResultsDto[]) {
    this.dataReadySource.next(results);
  }
}
