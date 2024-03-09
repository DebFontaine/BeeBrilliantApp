import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultsDto } from 'src/app/models/results';
import { DataService } from 'src/app/services/data.service';
import { ChartConfiguration } from 'chart.js';

interface AverageScore {
  category: string;
  date: string;
  averageScore: number;
}

@Component({
  selector: 'quiz-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {
  @Input() quizResults: ResultsDto[] | undefined;
  @Input() maxNumberOfDays: number = 7;
  subscription: Subscription;

  public barChartLegend = true;
  public barChartPlugins = [];

/*   public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A',backgroundColor: ["violet", "pink", "indigo",'gold', 'blue', 'green'] },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B',backgroundColor: ["violet", "pink", "indigo",'gold', 'blue', 'green'] }
    ],

  }; */
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor(private dataService: DataService) {
    this.subscription = this.dataService.dataReady$.subscribe(results => {
      this.quizResults = results;
    });
  }

  ngOnInit() {
    this.dataService.dataReady$.subscribe(() => {
      const { uniqueDates, averageScores } = this.getUniqueDatesAndAverageScore();
      const labels = uniqueDates.slice(0,this.maxNumberOfDays);
      const datasets = this.getDatasetValues(averageScores, uniqueDates)
       this.barChartData = {
         labels: labels,
         datasets: datasets.slice(0,this.maxNumberOfDays) 
       }; 
    })
  }
  getDatasetValues(averageScores: AverageScore[], uniqueDates: string[]) {
    const groupedByCategory: { [category: string]: AverageScore[] } = {};
    averageScores.forEach(score => {
      if (!groupedByCategory[score.category]) {
        groupedByCategory[score.category] = [];
      }
      groupedByCategory[score.category].push(score);
    });

    // Now, for each category, create the required object structure
    const chartData: { data: number[], label: string, backgroundColor: string[]}[] = [];
    let colors:string[] = ["#3F51B5", "#FF4081", "indigo",'#FFEB3B', 'blue', 'green'];
    let i = 0;
    Object.entries(groupedByCategory).forEach(([category, scores]) => {
      const data: number[] = [];
      uniqueDates.forEach(date => {
        const matchingScore = scores.find(score => score.date === date);
        data.push(matchingScore ? matchingScore.averageScore : 0);
      });
      const backgroundcolor: string[] = [colors[i++]];
      chartData.push({ data, label: category, backgroundColor: backgroundcolor});
    });

    console.log("data",chartData);
    return chartData;
  }



  getUniqueDatesAndAverageScore(): { uniqueDates: string[], averageScores: AverageScore[] } {
    const uniqueDatesSet = new Set<string>();
    const averageScoresMap = new Map<string, Map<string, { totalScore: number, count: number }>>();
    const averageScores: AverageScore[] = [];

    if (!this.quizResults) return { uniqueDates: [], averageScores: [] };

    this.quizResults.forEach(result => {
      const dateTakenString = result.dateTaken.toLocaleString().slice(0, 10);
      uniqueDatesSet.add(dateTakenString);

      if (!averageScoresMap.has(dateTakenString)) {
        averageScoresMap.set(dateTakenString, new Map<string, { totalScore: number, count: number }>());
      }

      const scoreMap = averageScoresMap.get(dateTakenString)!;

      if (!scoreMap.has(result.category)) {
        scoreMap.set(result.category, { totalScore: 0, count: 0 });
      }

      const scoreEntry = scoreMap.get(result.category)!;
      scoreEntry.totalScore += parseFloat(result.score);
      scoreEntry.count++;
    });

    const uniqueDates = Array.from(uniqueDatesSet);


    averageScoresMap.forEach((scoreMap, date) => {
      scoreMap.forEach((scoreEntry, category) => {
        const averageScore = scoreEntry.totalScore / scoreEntry.count;
        averageScores.push({ category, date, averageScore });
      });
    });
    console.log("bar", uniqueDates, averageScores)
    return { uniqueDates, averageScores };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
