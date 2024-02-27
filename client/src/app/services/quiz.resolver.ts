import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Quiz } from '../models/gametypes';
import { QuizDataService } from './game-data.service';
import { inject } from '@angular/core';

/* export const quizResolver: ResolveFn<boolean> = (route, state) => {
  return true;
}; */

export function quizResolver(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Quiz> {

  const coursesService = inject(QuizDataService);

  return coursesService.getQuiz(route.params['id']);

}
