import { Component, Input } from '@angular/core';
import { QuizDataService as QuizDataService } from '../services/game-data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, Quiz } from '../models/gametypes';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-quiz-engine',
  templateUrl: './quiz-engine.component.html',
  styleUrls: ['./quiz-engine.component.css']
})
export class QuizEngineComponent {
  @Input() quizId = 0;
  quizData: Question[] = [];
  currentQuestionIndex: number = 0;
  receivedMessage: string = '';
  numCorrect: number = 0;
  numIncorrect: number = 0;
  totalQuestions: number = 0;
  enableNext: boolean = false;
  subscription: Subscription | undefined;

  quiz: Quiz | undefined;
  quizCopy: Quiz | undefined;
  quizResult: string = "";
  score: string = "";
  reportDisplayed = false;

  constructor(private quizDataService: QuizDataService, public dialog: MatDialog, 
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.quiz = this.route.snapshot.data["quiz"];
    console.log("Init", this.quiz?.questions)
    this.copyQuestions(); 
  }
  copyQuestions()
  {
    this.quizCopy  = JSON.parse(JSON.stringify(this.quiz));
    if(this.quizCopy)
    {
      this.quizData = this.quizCopy.questions;
      this.totalQuestions = this.quizData.length;
      console.log(this.quiz)
    }
  }
  getQuizDataById(id:number)
  {
    this.quizDataService.getQuiz(id)
    .subscribe(data => {
      this.quiz = data;
      this.quizData = this.quiz.questions;
      this.totalQuestions = this.quizData.length;
      console.log(this.quiz)
    }); 
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quizData.length - 1) {
      this.currentQuestionIndex++;
      console.log("engine", this.quizData[this.currentQuestionIndex])
      this.enableNext = false;
    }
  }

  pauseGame(): void {
    // Pause game timer
  }

  exit() {
    const message = `You will lose any unsaved results. Are you sure you want to exit?`;

    const dialogData = new ConfirmDialogModel("Confirm Action", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult == true)
        this.router.navigateByUrl('/home')
    });
  }

  reset()
  {
    console.log("reset")
    this.reportDisplayed = false;
    this.unsubscribe();
    this.currentQuestionIndex = 0;
    this.receivedMessage = '';
    this.numCorrect = 0;
    this.numIncorrect = 0;
    this.enableNext = false;
    this.copyQuestions();
    console.log("original question", this.quiz!.questions)
  }

  receiveMessage(message: string) {
    this.receivedMessage = message;
    if(message == "correct")
    {
      this.numCorrect++;
      this.shouldEnableNext();
    }
    else if(message == "incorrect")
    {
      this.numIncorrect++;
      this.shouldEnableNext();
    }
    else if(message == "replay")
      this.reset();
    else if(message == "report")
      this.displayReport();
  }
  displayReport()
  {
    this.reportDisplayed = true;
    this.quizResult = JSON.stringify(this.quizCopy);
    this.score = ((this.numCorrect / this.quizData.length) * 100).toFixed(2) + '%';
  }

  shouldEnableNext()
  {
    if(this.numCorrect + this.numIncorrect < this.quizData.length)
      this.enableNext = true;
  }

  unsubscribe()
  {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  
  ngOnDestroy() {
    this.unsubscribe();
  }
 

}
