import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FillInQuestionComponent} from './fillin-question/fillin-question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { QuizEngineComponent } from './quiz-engine/quiz-engine.component';
import { GameScoreboardComponent } from './game-scoreboard/game-scoreboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './forms/register/register.component';
import { CustomSnackbarComponent } from './snackbar/custom-snackbar/custom-snackbar.component';
import { SharedModule } from './modules/shared.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HasRoleDirective } from './directives/has-role.directive';
import { TestComponent } from './test/test.component';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question/multiple-choice-question.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { QuizResultComponent } from './quiz-result/quiz-result.component';
import { RegisterPageComponent } from './register/register-page.component';
import { CategoryLevelFilterComponent } from './category-level-filter/category-level-filter.component';




@NgModule({
  declarations: [
    AppComponent,
    FillInQuestionComponent,
    MainNavComponent,
    HomeComponent,
    AdminComponent,
    QuizzesComponent,
    QuizEngineComponent,
    GameScoreboardComponent,
    RegisterComponent,
    CustomSnackbarComponent,
    NotFoundComponent,
    ServerErrorComponent,
    HasRoleDirective,
    TestComponent,
    MultipleChoiceQuestionComponent,
    ConfirmDialogComponent,
    QuizResultComponent,
    RegisterPageComponent,
    CategoryLevelFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
