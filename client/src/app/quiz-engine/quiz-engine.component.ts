import { Component } from '@angular/core';
import { GameData, GameDataService } from '../services/game-data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
//import { MatConfirmDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quiz-engine',
  templateUrl: './quiz-engine.component.html',
  styleUrls: ['./quiz-engine.component.css']
})
export class QuizEngineComponent {
  gameDatas: GameData[] = [];
  currentQuestionIndex: number = 0;
  receivedMessage: string = '';
  numCorrect: number = 0;
  numIncorrect: number = 0;
  totalQuestions: number = 0;
  enableNext: boolean = false;
  subscription: Subscription | undefined;

  constructor(private gameDataService: GameDataService, public dialog: MatDialog, router: Router) { }

  ngOnInit(): void {
    this.getQuizData();
  }
  getQuizData()
  {
    this.subscription = this.gameDataService.getGameData().subscribe(data => {
      this.gameDatas = data;
      this.totalQuestions = data.length;
    });
    console.log(this.gameDatas);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.gameDatas.length - 1) {
      this.currentQuestionIndex++;
      this.enableNext = false;
    }
  }

  pauseGame(): void {
    // Pause game timer
  }

  reset()
  {
    this.unsubscribe();
    this.getQuizData();
    //this.gameDatas = [];
    this.currentQuestionIndex = 0;
    this.receivedMessage = '';
    this.numCorrect = 0;
    this.numIncorrect = 0;
    this.enableNext = false;
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
  }

  shouldEnableNext()
  {
    if(this.numCorrect + this.numIncorrect < this.gameDatas.length)
      this.enableNext = true;
  }

  unsubscribe()
  {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
/*   openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(MatConfirmDialog, {
      width: '250px',
      data: { message: 'Are you sure you want to quit?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle quit action
      }
    });
  } */
  
  ngOnDestroy() {
    this.unsubscribe();
  }
 

}
