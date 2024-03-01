import { Component } from '@angular/core';
import { QuizDto } from '../models/gametypes';
import { QuizDataService, UserParams } from '../services/quiz-data.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Pagination } from '../models/pagination';
import { PageEvent } from '@angular/material/paginator';
import { Observable, catchError, finalize, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Member, User } from '../models/user';
import { AccountService } from '../services/account.service';
import { CategoryLevelFilterData } from '../category-level-filter/category-level-filter.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent {
  quizzes: QuizDto[] = [];
  cols = 2;
  rowHeight = '500px';
  handsetPortrait = false;
  loading = false;

  pagination: Pagination | undefined;
  pageNumber = 0;
  pageSize = 10;
  length = 0;
  pageSizeOptions = [1, 2, 5, 10, 25];
  searchCategory = "";
  searchLevel = "";
  userParams: UserParams = new UserParams();
  user: User  | null = null;

  pageEvent: PageEvent | undefined;
  currentUser$: Observable<User | null> = of(null);
  member: Member | null = null;



  constructor(private quizService: QuizDataService, private responsive: BreakpointObserver, 
    private accountService: AccountService, private toast: MatSnackBar) { }

  ngOnInit(): void {
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
    ).subscribe((member: Member | null) => {
      if (member) {
        this.member = member;
      }
    });
    this.getPagedQuizzes();
    this.setupReactiveDisplay(); 
  }

  private setupReactiveDisplay() {
    this.responsive.observe([
      Breakpoints.WebLandscape,
      Breakpoints.TabletPortrait,
      Breakpoints.TabletLandscape,
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ])
      .subscribe(result => {

        this.calculateCols();
        this.rowHeight = "400px";
        this.handsetPortrait = false;

        const breakpoints = result.breakpoints;

        if (breakpoints[Breakpoints.WebLandscape]) {
          this.cols = 4;
        }
        else if (breakpoints[Breakpoints.TabletPortrait]) {
          this.cols = 1;
        }
        else if (breakpoints[Breakpoints.HandsetPortrait]) {
          this.cols = 1;
          this.rowHeight = "430px";
          this.handsetPortrait = true;
        }
        else if (breakpoints[Breakpoints.HandsetLandscape]) {
          this.handsetPortrait = false;
          this.cols = 1;
        }
        else if (breakpoints[Breakpoints.TabletLandscape]) {
          this.cols = 3;
        }

      });
  }

  calculateCols() {
    const viewportWidth = window.innerWidth; // Get viewport width
    const columnCount = Math.floor(viewportWidth / 500); // Calculate column count based on viewport width (adjust 200 as needed)
    this.cols = columnCount > 0 ? columnCount : 1;
  }
  resetFilters(text:string) {
    this.searchCategory = "";
    this.searchLevel = "";
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getPagedQuizzes();
  }
  getFilteredQuizzes(data: CategoryLevelFilterData)
  {
    this.searchCategory = data.selectedCategoryOption;
    this.searchLevel = data.selectedLevelOption;
    this.getPagedQuizzes()
  }

  getPagedQuizzes() {
    this.populateUserParams();
    this.loading = true;

    this.quizService.getPagedQuizzes(this.userParams).pipe(
      tap(response => {
        if (response.result && response.pagination) {
          this.quizzes = response.result;
          this.pagination = response.pagination;
          this.length = this.pagination.totalItems;
        }
      }),
      catchError(err => {
        console.log("Error loading lessons", err);
        this.showToastMessage('Error loading results. Please try again.', 3);
        return throwError(() => new Error(err));

      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }

  private populateUserParams() {
    this.userParams = new UserParams();
    this.userParams.category = this.searchCategory;
    this.userParams.level = this.searchLevel;
    this.userParams.pageNumber = this.pageNumber;
    this.userParams.itemsPerPage = this.pageSize;
  }

  handlePageEvent(e: PageEvent) {
    console.log("e", e)
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex + 1;
    this.getPagedQuizzes();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  private showToastMessage(message: string, duration: number) {
    this.toast.open(message, 'Dismiss', {
      duration: duration * 1000
    });
}

}
