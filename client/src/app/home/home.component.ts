import { AfterViewInit, Component, Output, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Observable, Subscription, catchError, finalize, of, switchMap, take, tap, throwError } from 'rxjs';
import { Member, User } from '../models/user';
import { MatTableDataSource } from '@angular/material/table';
import { ResultDataService } from '../services/result-data.service';
import { Pagination } from '../models/pagination';
import { UserParams } from '../services/quiz-data.service';
import { ResultsDto } from '../models/results';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryLevelFilterData } from '../category-level-filter/category-level-filter.component';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { EventEmitter } from '@angular/core';
import { DataService } from '../services/data.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../services/notification.service';



const EMPTY_DATA: ResultsDto[] = [
  { id: 1, userId: 1, username: 'leolion', quizId: 1, quizName: '', quizResultStr: '', score: '', category: '', level: '', dateTaken: new Date() }
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @Output() dataReady: EventEmitter<any> = new EventEmitter<any>();

  currentUser$: Observable<User | null> = of(null);
  user: User | undefined;
  member: Member | undefined;
  hubUrl = environment.hubUrl;
  private messageSubscription: Subscription | undefined;

  quizResults: ResultsDto[] = [];
  resultDisplayed = false;
  quizResult: string = "";
  score: string = "";

  searchCategory = "";
  searchLevel = "";
  textFilter = '';

  pagination: Pagination | undefined;
  pageNumber = 0;
  pageSize = 10;
  length = 0;
  pageSizeOptions = [1, 2, 5, 10, 25];
  userParams: UserParams = new UserParams();

  displayedColumns: string[] = ['quizName', 'category', 'level', 'score', 'dateTaken', 'viewResult'];
  dataSource = new MatTableDataSource(EMPTY_DATA);
  loading: boolean = false;
  pageEvent: PageEvent | undefined;
  sortedData: ResultsDto[] = [];
  hubConnectionStarted: boolean = false;

  constructor(private accountService: AccountService, private resultService: ResultDataService,
    private toast: MatSnackBar, private dataService: DataService, public notificationService: NotificationService) {
    //this.subscribeToMessageThread();
  }

  ngOnInit() {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.accountService.getMember(user.username);
        } else {
          return of(null);
        }
      })
    ).subscribe(member => {
      if (member) {
        this.member = member;
        this.notifyMemberReady();
        this.getPagedResults(this.member.id);
      }
    });

  }

  subscribeToMessageThread(): void {
    this.messageSubscription = this.notificationService.messageThread$.subscribe(messages => {
      if (messages && messages.length > 0) {
        const newMessage = messages[messages.length - 1];
        this.showNotification(newMessage);
      }
    });
  }
  showNotification(message: any) {
    console.log("showing message");
    this.toast.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      verticalPosition: 'top', horizontalPosition: 'right'
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getFilteredResults(data: CategoryLevelFilterData) {
    this.searchCategory = data.selectedCategoryOption;
    this.searchLevel = data.selectedLevelOption;
    this.textFilter = data.textFilterValue;

    if (!this.member) {
      return;
    }

    if (!this.filtersSelected()) {
      this.showToastMessage('Select a Category or Level to filter results', 3);
      return;
    }

    this.getPagedResults(this.member.id);
  }

  getPagedResults(id: number) {
    this.populateUserParams();
    this.loading = true;

    this.resultService.getPagedResults(id, this.userParams).pipe(
      tap(response => {
        if (response.result && response.pagination) {
          this.quizResults = response.result;
          this.pagination = response.pagination;
          this.length = this.pagination.totalItems;
          this.dataSource = new MatTableDataSource(this.quizResults)
        }
        this.notifySibling();
      }),
      catchError(err => {
        this.showToastMessage('Error loading results. Please try again.', 3);
        return throwError(() => new Error(err));
      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }

  applyTextFilter(text: string) {
    this.dataSource.filter = text;
  }

  resetFilters(text: string) {
    this.searchCategory = "";
    this.searchLevel = "";
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getPagedResults(this.member!.id);
  }

  displayResult(row: ResultsDto) {
    this.quizResult = row.quizResultStr;
    this.score = row.score;
    this.resultDisplayed = true;
  }

  handlePageEvent(e: PageEvent) {
    console.log("e", e)
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex + 1;
    this.getPagedResults(this.member!.id);
  }

  receiveMessage(message: string) {
    switch (message) {
      case "close_report":
        this.resultDisplayed = false;
        break;
    }
  }

  sortData(sort: any) {
    const data = this.quizResults.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
  }
  notifySibling() {
    this.dataReady.emit();
    this.dataService.notifyDataReady(this.quizResults);

  }
  notifyMemberReady() {
    if (this.member) {
      this.dataReady.emit();
      this.dataService.notifyMemberReady(this.member);
    }
  }

  private populateUserParams() {
    this.userParams = new UserParams();
    this.userParams.category = this.searchCategory;
    this.userParams.level = this.searchLevel;
    this.userParams.pageNumber = this.pageNumber;
    this.userParams.itemsPerPage = this.pageSize;
  }

  private filtersSelected() {
    return (this.searchCategory && this.searchCategory != '') ||
      (this.searchLevel && this.searchLevel != '');
  }

  private showToastMessage(message: string, duration: number) {
    this.toast.open(message, 'Dismiss', {
      duration: duration * 1000
    });
  }

  ngOnDestroy() {

  }
}
