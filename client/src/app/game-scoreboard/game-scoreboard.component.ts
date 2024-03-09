import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'game-scoreboard',
  templateUrl: './game-scoreboard.component.html',
  styleUrls: ['./game-scoreboard.component.css']
})
export class GameScoreboardComponent {
  progressValue: number = 0;
  @Input() correct: number = 0;
  @Input() incorrect: number = 0;
  @Input() total: number = 10;
  @Output() messageEvent = new EventEmitter<string>();
  reportDisplayed: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    this.progressValue = this.correct;
  }
  quizComplete()
  {
    return (this.correct + this.incorrect) == this.total;
  }

  calculateProgressValue(): number {
    return ((this.correct + this.incorrect) / this.total) * 100;
  }

  replay()
  {
    this.reportDisplayed = false;
    this.sendMessage("replay");
  }
  viewReport()
  {
    if(!this.reportDisplayed)
    {
      this.reportDisplayed = true;
      this.sendMessage("report");
    }
  }
  sendMessage(message : string) {
    this.messageEvent.emit(message);
  }
}
