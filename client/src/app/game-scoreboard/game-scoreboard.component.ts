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

  ngOnChanges(changes: SimpleChanges) {
    console.log('Input changed:', changes['correct']?.currentValue);
    console.log('Input changed:', changes['incorrect']?.currentValue);
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
    this.sendMessage("replay");
  }
  viewReport()
  {
    this.sendMessage("report");
  }
  sendMessage(message : string) {
    console.log("sending message");
    this.messageEvent.emit(message);
  }
}
