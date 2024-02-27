import { Component } from '@angular/core';
import { QuizDto } from '../models/gametypes';
import { QuizDataService, UserParams } from '../services/game-data.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Pagination } from '../models/pagination';
import { PageEvent } from '@angular/material/paginator';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

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

  pageEvent: PageEvent | undefined;

  constructor(private quizService: QuizDataService, private responsive: BreakpointObserver) { }

  ngOnInit(): void {
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
          this.cols = 3; // Set column count, ensuring it's at least 1
        }

      });

    this.getPagedQuizzes();
  }
  calculateCols() {
    const viewportWidth = window.innerWidth; // Get viewport width
    const columnCount = Math.floor(viewportWidth / 500); // Calculate column count based on viewport width (adjust 200 as needed)
    this.cols = columnCount > 0 ? columnCount : 1;
  }
  resetFilters() {
    this.searchCategory = "";
    this.searchLevel = "";
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getPagedQuizzes();
  }

  getPagedQuizzes() {
    console.log("Getting quizzes")
    this.populateUserParams();
    console.log("userparams", this.userParams)
    this.loading = true;
    this.quizService.getPagedQuizzes(this.userParams).pipe(
      tap(response => {
        console.log(response.result, response.pagination)
        if (response.result && response.pagination) {
          this.quizzes = response.result;
          console.log(this.quizzes)
          this.pagination = response.pagination;
          this.length = this.pagination.totalItems;
        }
      }),
      catchError(err => {
        console.log("Error loading lessons", err);
        alert("Error loading lessons.");
        return throwError(err);

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
  onCategorySelectionChange(event: MatSelectChange) {
    this.searchCategory = event.value;
    console.log('Selected value:', this.searchCategory);
  }
  onLevelSelectionChange(event: MatSelectChange) {
    this.searchLevel = event.value;
    console.log('Selected value:', this.searchLevel);
  }
}
