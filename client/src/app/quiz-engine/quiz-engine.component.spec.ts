import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizEngineComponent } from './quiz-engine.component';

describe('QuizEngineComponent', () => {
  let component: QuizEngineComponent;
  let fixture: ComponentFixture<QuizEngineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizEngineComponent]
    });
    fixture = TestBed.createComponent(QuizEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
