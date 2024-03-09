import { Component, Input } from '@angular/core';
import { QuizDataService as QuizDataService } from '../services/quiz-data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, Quiz } from '../models/gametypes';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { AddResultsDto } from '../models/results';
import { ResultDataService } from '../services/result-data.service';
import { AccountService } from '../services/account.service';
import { Member } from '../models/user';


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
  reportSaved: boolean = false;
  member: Member | undefined;

  constructor(private accountService: AccountService, private quizDataService: QuizDataService, private resultService: ResultDataService, public dialog: MatDialog,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.quiz = this.route.snapshot.data["quiz"];
    this.member = this.route.snapshot.data["member"];
    this.copyQuestions();
  }

  copyQuestions() {
    this.quizCopy = JSON.parse(JSON.stringify(this.quiz));
    if (this.quizCopy) {
      this.quizData = this.quizCopy.questions;
      this.totalQuestions = this.quizData.length;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quizData.length - 1) {
      this.currentQuestionIndex++;
      this.enableNext = false;
    }
  }

  pauseGame(): void {
    // Pause game timer TODO
  }

  exit() {
    if (!this.reportSaved) {
      const message = `You will lose any unsaved results. Are you sure you want to exit?`;

      const dialogData = new ConfirmDialogModel("Confirm Action", message);

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true)
          this.router.navigateByUrl('/home')
      });
    }
    else
      this.router.navigateByUrl('/home')
  }

  reset() {
    this.reportDisplayed = false;

    this.currentQuestionIndex = 0;
    this.receivedMessage = '';
    this.numCorrect = 0;
    this.numIncorrect = 0;
    this.enableNext = false;
    this.copyQuestions();
    this.unsubscribe();
  }

  receiveMessage(message: string) {
    this.receivedMessage = message;
    switch (message) {
      case "correct":
        this.handleCorrect();
        break;
      case "incorrect":
        this.handleIncorrect();
        break;
      case "replay":
        this.reset();
        break;
      case "report":
        this.displayReport();
        break;
      case "save_report":
        this.saveReport();
        break;
      case "close_report":
        this.reportDisplayed = false;
        break;
    }
  }

  handleCorrect() {
    this.numCorrect++;
    this.shouldEnableNext();
  }

  handleIncorrect() {
    this.numIncorrect++;
    this.shouldEnableNext();
  }
  displayReport() {
    this.reportDisplayed = true;
    this.quizResult = JSON.stringify(this.quizCopy);
    this.score = ((this.numCorrect / this.quizData.length) * 100).toFixed(2) + '%';
  }
  saveReport() {
    const results: AddResultsDto = {
      userId: this.member!.id,
      username: this.member!.userName,
      quizName: this.quizCopy!.title,
      quizId: this.quizCopy!.id,
      quizResultStr: JSON.stringify(this.quizCopy),
      score: ((this.numCorrect / this.quizData.length) * 100).toFixed(2) + '%',
      category: this.quizCopy!.category,
      level: this.quizCopy!.level,
      dateTaken: new Date()
    };

    this.resultService.saveResult(results).subscribe(result => {
      console.log(result);
      this.reportSaved = true;
    });
  }

  shouldEnableNext() {
    if (this.numCorrect + this.numIncorrect < this.quizData.length)
      this.enableNext = true;
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }


}
