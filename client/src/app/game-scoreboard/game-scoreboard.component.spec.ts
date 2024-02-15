import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameScoreboardComponent } from './game-scoreboard.component';

describe('GameScoreboardComponent', () => {
  let component: GameScoreboardComponent;
  let fixture: ComponentFixture<GameScoreboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameScoreboardComponent]
    });
    fixture = TestBed.createComponent(GameScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
