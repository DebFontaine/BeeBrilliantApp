import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FillInQuestionComponent } from "./fillin-question/fillin-question.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { HomeComponent } from "./home/home.component";
import { QuizzesComponent } from "./quizzes/quizzes.component";
import { AdminComponent } from "./admin/admin.component";
import { QuizEngineComponent } from "./quiz-engine/quiz-engine.component";

const routes: Routes = [
    {path: '', component: MainNavComponent,
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'quizzes', component: QuizzesComponent},
      {path: 'quiz', component: QuizEngineComponent},
      {path: 'admin', component: AdminComponent},
    ]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
