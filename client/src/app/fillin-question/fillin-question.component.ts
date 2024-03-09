import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { QuizData } from '../services/quiz-data.service';

export interface FillinData {
  title: string;
  level: string;
  word: string;
  imageData: string;
  letters: { letter: string; userInput: string }[];
}

@Component({
  selector: 'fillin-question',
  templateUrl: './fillin-question.component.html',
  styleUrls: ['./fillin-question.component.css'],
})

export class FillInQuestionComponent {
  numberAttampts: number = 0;
  showStaticText = false;
  success: boolean = false;
  @ViewChildren('inputElement') inputElements: QueryList<ElementRef> | undefined;
  @Input() quizData: QuizData | undefined;
  @Output() messageEvent = new EventEmitter<string>();

  currentQuestion: FillinData | undefined;
  title = ""
  level = ""
  word = '';
  imageData: string = '';
  letters: any[] = []
  allowedErrors: number = 3; //make this a configurable param
  
  constructor( ) {}

  ngOnInit()
  {
    this.convertQuizData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.reset();
    this.convertQuizData();
  }

  reset()
  {
    this.numberAttampts = 0;
    this.showStaticText = false;
    this.success = false;
  }

  convertQuizData()
  {
    if(this.quizData)
    {
      this.currentQuestion = this.quizData.data as FillinData;
      this.title = this.quizData.title ?? this.quizData.category;
      this.level = this.quizData.level;
      this.word = this.currentQuestion.word;
      this.imageData = this.currentQuestion.imageData;
      this.letters = this.currentQuestion.letters;

    }
  }


  checkLetter(index: number): void {
    if(this.letters[index].userInput.trim() == '')
      return;
    
    if (this.letters[index].userInput.toLowerCase() === this.letters[index].letter) {
      const nextIndex = index + 1;
      if (this.inputElements && nextIndex < this.inputElements.length) {
        this.inputElements.toArray()[nextIndex].nativeElement.focus();
      }
      else
          this.allCorrect()     
    } 
    else {
      this.numberAttampts++;
      if(this.numberAttampts >= this.allowedErrors)
      {
         this.showStaticText = true;
         this.sendMessage("incorrect");
      }
     
    }
  }

   // Method to clear inputs
  clearInputs(): void {
    this.letters.forEach(letter => letter.userInput = '');
  }

  // Method to check if any input has been entered
  hasInput(): boolean {
    return this.letters.some(letter => letter.userInput.trim() !== '');
  }

  // Method to check if all inputs are correct
  allCorrect(): boolean {
     if(this.letters.every(letter => letter.userInput.toLowerCase() === letter.letter))
     {
        this.showStaticText = true;
        this.success = true;
        this.sendMessage("correct");
        return true;
     }
     return false;
  }

  sendMessage(message : string) {
    this.messageEvent.emit(message);
  }
}
