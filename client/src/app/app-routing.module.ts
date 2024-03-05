import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { HomeComponent } from "./home/home.component";
import { QuizzesComponent } from "./quizzes/quizzes.component";
import { AdminComponent } from "./admin/admin.component";
import { QuizEngineComponent } from "./quiz-engine/quiz-engine.component";
import { authGuard } from "./guards/auth.guard";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { ServerErrorComponent } from "./errors/server-error/server-error.component";
import { adminGuard } from "./guards/admin.guard";
import { quizResolver } from "./services/quiz.resolver";
import { QuizResultComponent } from "./quiz-result/quiz-result.component";
import { RegisterPageComponent } from "./register/register-page.component";
import { memberResolver } from "./services/member.resolver";

const routes: Routes = [
  {
    path: '', component: MainNavComponent, runGuardsAndResolvers: 'always',
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'register', component: RegisterPageComponent },
      { path: 'home', component: HomeComponent, canActivate: [authGuard]},
      { path: 'quiz', component: QuizzesComponent, canActivate: [authGuard] },
      {
        path: 'quiz/:id/:username', component: QuizEngineComponent, resolve: {
          quiz: quizResolver,
          member: memberResolver
        }, canActivate: [authGuard]
      },
      { path: 'test', component: QuizResultComponent },
      { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
      { path: 'not-found', component: NotFoundComponent },
      { path: 'server-error', component: ServerErrorComponent },
    ]
  },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
