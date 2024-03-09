import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question, QuestionDataDto, Quiz } from '../models/gametypes';
import { MultiChoiceData } from '../multiple-choice-question/multiple-choice-question.component';
import * as quizData from '../../assets/quizresult.json';
import { FillinData } from '../fillin-question/fillin-question.component';
import { ResultDataService } from '../services/result-data.service';
import { AddResultsDto, ResultsDto } from '../models/results';

@Component({
  selector: 'quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.css']
})
export class QuizResultComponent {
  @Input() quizResult: Quiz | undefined;
  @Input() score: string = "";
  @Input() quizResultStr: string = "";
  @Input() showSave: boolean = true;
  @Output() messageEvent = new EventEmitter<string>();
  resultsSaved: boolean = false;

  constructor(private resultService: ResultDataService){}

  ngOnInit() {

    this.quizResult = quizData;
    this.quizResult = JSON.parse(this.quizResultStr);
  }

  getQuestionType(question: Question) {
    switch (question.type) {
      case 1: {
        return "Fill-In"
      }
      case 2: {
        return "Multiple Choice"
      }
    }
    return "error";
  }

  getQuestionText(question: Question) {
    if (question && question.type === 1) {
      return question.summary
    }
    if (question && question.type === 2) {
      const data: MultiChoiceData = question.data as MultiChoiceData;
      return data.question;
    }
    return "Error";
  }
  
  getCorrectAnswerText(question: Question): string {

    if (question && question.type === 1) {
      const data: FillinData = question.data as FillinData
      return data.word;
    }
    else if (question && question.type === 2) {
      const data: MultiChoiceData = question.data as MultiChoiceData
      return data.options.find(option => option.id === data.correctAnswerId)?.text || 'N/A';
    }

    return "Error";

  }

  getSelectedAnswerText(question: Question): string {
    if (question && question.type === 1) {
      const data: FillinData = question.data as FillinData
      const userInputWord: string = data.letters.map(letter => letter.userInput).join('');
      return userInputWord;
    }
    else if (question && question.type === 2) {
      const data: MultiChoiceData = question.data as MultiChoiceData
      return data.options.find(option => option.id === data.selectedAnswerId)?.text || 'N/A';
    }
    return "Error";
  }
  isCorrect(question: Question): boolean {
      return this.getCorrectAnswerText(question) === this.getSelectedAnswerText(question);
  }

  saveResults(){
    this.resultsSaved = true;
    this.sendMessage("save_report")
  }
  exit(){
    this.sendMessage("close_report")
  }
  sendMessage(message : string) {
    console.log("sending message");
    this.messageEvent.emit(message);
  }
}
