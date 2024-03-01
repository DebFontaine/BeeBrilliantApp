import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { QuizData } from '../services/quiz-data.service';
import { ChoicesDto, Question } from '../models/gametypes';

export interface MultiChoiceData {
  title: string;
  level: string;
  question: string;
  imageData: string;
  correctAnswerId: number;
  selectedAnswerId: number;
  options: ChoicesDto[];
}

@Component({
  selector: 'multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.css']
})
export class MultipleChoiceQuestionComponent {
  numberAttampts: number = 0;
  isCorrect: boolean = false;
  error: boolean = false;
  @Input() questionData: any; 
  @Input() quizData: QuizData | undefined;
  @Output() messageEvent = new EventEmitter<string>();

  currentQuestion: MultiChoiceData | undefined;
  title = ""
  level = ""
  question = '';
  imageData: string = '';
  options: any[] = [];
  correctChoice: number = 0;
  allowedErrors: number = 3; //make this a configurable param

  selectedOptionId: number | null = null;

  ngOnInit(){
    this.transformData()
  }

  selectOption(optionId: number): void {
    if (this.selectedOptionId === null)
    {
      this.selectedOptionId = optionId;
      this.currentQuestion!.selectedAnswerId = optionId;
      if(this.correctChoice === optionId)
        this.sendMessage("correct");
      else
      {
        this.sendMessage("incorrect");
        this.error = true;
      }
    }
  }
  showAnswer()
  {
 
  }
  

  isOptionSelected(optionId: number): boolean {
      return this.selectedOptionId === optionId;
  }

  isAnswerCorrect(optionId: number): boolean {
    return this.correctChoice === optionId && this.isOptionSelected(optionId);
  }

  isAnswerIncorrect(optionId: number): boolean {
    return this.correctChoice !== optionId && this.isOptionSelected(optionId);
  }

  sendMessage(message : string) {
    console.log("sending message");
    this.messageEvent.emit(message);
  }

  transformData()
  {
      if(this.quizData)
      {
        console.log("gamedata", this.quizData)
        this.currentQuestion = this.quizData.data as MultiChoiceData;
        console.log("current Question", this.currentQuestion);
        this.title = this.quizData.title ?? this.quizData.category;
        this.level = this.quizData.level;
        this.question = this.currentQuestion.question;
        this.imageData = this.currentQuestion.imageData;
        this.options = this.currentQuestion.options;
        this.correctChoice = this.currentQuestion.correctAnswerId;
      }

  }
  ngOnChanges(changes: SimpleChanges) {
    //console.log('Input changed:', changes['gameData'].currentValue);
    this.reset();
    this.transformData();
  }
  reset()
  {
    this.numberAttampts = 0;
    this.error = false;
    this.isCorrect = false;
    this.selectedOptionId = null;
  }

}
