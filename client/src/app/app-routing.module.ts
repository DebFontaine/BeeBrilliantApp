import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FillInQuestionComponent } from "./fillin-question/fillin-question.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { HomeComponent } from "./home/home.component";
import { QuizzesComponent } from "./quizzes/quizzes.component";
import { AdminComponent } from "./admin/admin.component";
import { QuizEngineComponent } from "./quiz-engine/quiz-engine.component";
import { authGuard } from "./guards/auth.guard";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { ServerErrorComponent } from "./errors/server-error/server-error.component";
import { adminGuard } from "./guards/admin.guard";
import { TestComponent } from "./test/test.component";
import { quizResolver } from "./services/quiz.resolver";
import { QuizResultComponent } from "./quiz-result/quiz-result.component";

const routes: Routes = [
  {
    path: '', component: MainNavComponent, runGuardsAndResolvers: 'always',
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'quizzes', component: QuizzesComponent, canActivate: [authGuard] },
      {
        path: 'quiz/:id', component: QuizEngineComponent, resolve: {
          quiz: quizResolver
        }, canActivate: [authGuard]
      },
      { path: 'test', component: QuizResultComponent },
      { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
      { path: 'not-found', component: NotFoundComponent },
      { path: 'server-error', component: ServerErrorComponent },
      { path: '**', component: NotFoundComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
