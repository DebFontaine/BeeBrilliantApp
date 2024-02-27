export interface Letter {
    letter: string;
    userInput: string;
}

export interface FillInData {
    word: string;
    imageData: string;
    letters: Letter[];
}

export interface FillInQuestion {
    type: number;
    category: string;
    level: string;
    title: string;
    summary: string;
    data: FillInData;
}
export interface Quiz {
    id: number;
    type: number;
    title: string;
    category: string;
    description: string;
    photoUrl: string;
    level: string;
    questions: Question[];
  }
  export interface QuizDto {
    id: number;
    type: number;
    title: string;
    category: string;
    description: string;
    photoUrl: string;
    level: string;
    questionCount: number;
  }
  
  export interface Question {
    type: number;
    category: string;
    level: string;
    title: string;
    summary: string;
    data: QuestionDataDto;
  }
  export interface QuestionDataDto {
    // Common properties for all types of question data
    imageData: string;
  }
  
  export interface FillInQuestionDataDto extends QuestionDataDto {
    word: string;
    letters: LetterDto[];
  }
  
  export interface LetterDto {
    letter: string;
    userInput: string;
  }

  
  export interface MultipleChoiceQuestionData extends QuestionDataDto {
    question: string;
    choices: ChoicesDto[];
    correctAnswerId: number;
  }

     
  export interface ChoicesDto{
    id: number;
    text: string;
  }
