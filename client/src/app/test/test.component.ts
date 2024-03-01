import { Component } from '@angular/core';
import { QuizDataService } from '../services/quiz-data.service';
import { FillInQuestionDataDto, Quiz } from '../models/gametypes';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  quiz: Quiz | undefined;

  constructor(private quizService: QuizDataService)
  {

  }

  ngOnInit(): void {
    this.getQuizData(5);
  }

  getQuizData(id:number)
  {
    this.quizService.getQuiz(id)
    .subscribe(data => {
      this.quiz = data;
      console.log(this.quiz)
    });
  }

  isFillInQuestion(data: any): data is FillInQuestionDataDto {
    return (data as FillInQuestionDataDto).word !== undefined;
  }



}
