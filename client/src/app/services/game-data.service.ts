import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FillinData } from '../fillin-question/fillin-question.component';

export interface GameData {
  type: number;
  title: string;
  level: string;
  category: string;
  data: object;
}

@Injectable({
  providedIn: 'root'
})


export class GameDataService {

  constructor() { }

  getGameData(): Observable<GameData[]> {
    // Implement fetching logic here (e.g., HTTP request)
    // For demonstration, return a mock array of GameData objects
    return of(this.generateFillInGameData());
  }
  createGameData()
  {

  }

  generateFillInGameData()
  {
    const gameDataArray: GameData[] = [];
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
      const gameDataObj: GameData = {
        
          type: 1,
          title: fillinDataInstances[i].title,
          level: fillinDataInstances[i].level,
          category: "Spelling",
          data: fillinDataInstances[i]
      };
      gameDataArray.push(gameDataObj);
    }
    return gameDataArray;
  }
}
