import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { FillinData } from '../fillin-question/fillin-question.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Quiz, QuizDto } from '../models/gametypes';
import { PaginatedResult } from '../models/pagination';

export interface QuizData {
  type: number;
  title: string;
  level: string;
  category: string;
  summary: string;
  data: object;
}

export class UserParams   {
  pageNumber: number = 1;
  itemsPerPage: number = 10;
  category: string = "";
  level: string = "";
}

@Injectable({
  providedIn: 'root'
})


export class QuizDataService {
  paginatedResult: PaginatedResult<QuizDto[]> = new PaginatedResult<QuizDto[]>
  
  private apiUrl = 'https://localhost:5003/api/quiz';

  constructor(private http: HttpClient) { }



  getQuiz(id: number): Observable<Quiz> {
    console.log("getQuiz",`${this.apiUrl}/${id}`)
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  getAllQuizzes(){
    return this.http.get<QuizDto[]>(`${this.apiUrl}`);
  }

  getPagedQuizzes(userParams:UserParams)
  {
    let params = new HttpParams();
    if(userParams)
    {
      if(userParams.pageNumber && userParams.itemsPerPage)
      {
          params = params.append('pageNumber', userParams.pageNumber);
          params = params.append('pageSize', userParams.itemsPerPage);
      }
      if(userParams.category && userParams.category != "")
      {
          params = params.append('category', userParams.category);
      }
      if(userParams.level && userParams.level != "")
      {
          params = params.append('level', userParams.level);
      }
    }

    return this.http.get<QuizDto[]>(`${this.apiUrl}`, {observe: 'response', params})
      .pipe(
        map(response => {
          if(response.body){
            this.paginatedResult.result = response.body;
          }
          const pagination = response.headers.get('Pagination');
          if(pagination){
            this.paginatedResult.pagination = JSON.parse(pagination);
          }
          console.log("results", this.paginatedResult);
          return this.paginatedResult;
        })
    )
  }



  getGameData(): Observable<QuizData[]> {
  
    return of(this.generateFillInGameData());
  }

  generateFillInGameData()
  {
    const gameDataArray: QuizData[] = [];
    const fillinDataInstances: FillinData[] = [
      {
        title: "Spelling",
        level: "K-1",
        word: "cat",
        imageData: "https://cdn.pixabay.com/photo/2019/11/08/11/56/kitten-4611189_1280.jpg",
        letters: [
          { letter: 'c', userInput: '' },
          { letter: 'a', userInput: '' },
          { letter: 't', userInput: '' }
        ]
      },
      {
        title: "Spelling",
        level: "K-1",
        word: "hat",
        imageData: "https://cdn.pixabay.com/photo/2017/09/30/09/29/cowboy-hat-2801582_1280.png",
        letters: [
          { letter: 'h', userInput: '' },
          { letter: 'a', userInput: '' },
          { letter: 't', userInput: '' }
        ]
      },
      {
        title: "Spelling",
        level: "k-1",
        word: "rat",
        imageData: "https://cdn.pixabay.com/photo/2017/02/23/08/50/rat-2091553_1280.jpg",
        letters: [
          { letter: 'r', userInput: '' },
          { letter: 'a', userInput: '' },
          { letter: 't', userInput: '' }
        ]
      },
      {
        title: "Spelling",
        level: "K-1",
        word: "can",
        imageData: "https://cdn.pixabay.com/photo/2017/09/30/22/09/watering-can-2803719_1280.png",
        letters: [
          { letter: 'c', userInput: '' },
          { letter: 'a', userInput: '' },
          { letter: 'n', userInput: '' }
        ]
      },
      {
        title: "Spelling",
        level: "k-1",
        word: "fan",
        imageData: "https://cdn.pixabay.com/photo/2015/09/05/23/22/white-926202_1280.jpg",
        letters: [
          { letter: 'f', userInput: '' },
          { letter: 'a', userInput: '' },
          { letter: 'n', userInput: '' }
        ]
      }
    ];

    for (let i = 0; i < fillinDataInstances.length; i++) {
      const gameDataObj: QuizData = {
        
          type: 1,
          title: fillinDataInstances[i].title,
          level: fillinDataInstances[i].level,
          category: "Spelling",
          summary: "This is the summary",
          data: fillinDataInstances[i]
      };
      gameDataArray.push(gameDataObj);
    }
    return gameDataArray;
  }
}
