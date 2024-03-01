
  export interface ResultsDto {
    id: number;
    userId: number;
    username: string;
    quizName: string;
    quizId: number;
    quizResultStr: string;
    score: string;
    category: string;
    level: string;
    dateTaken: Date;
  }
  export interface AddResultsDto {
    userId: number;
    username: string;
    quizName: string;
    quizId: number;
    quizResultStr: string;
    score: string;
    category: string;
    level: string;
    dateTaken: Date;
  }