import { Component, Input } from '@angular/core';
import { ResultsDto } from 'src/app/models/results';
import { ChartOptions } from 'chart.js';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { ChartDataset } from 'chart.js';

@Component({
  selector: 'category-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {
  @Input() quizResults: ResultsDto[] | undefined;
  subscription: Subscription;

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels: string[] | [] = [];
  public pieChartDatasets: ChartDataset<"pie", number[]>[] | undefined = [{
    data: [],
    backgroundColor: ['indigo', 'gold', 'blue', 'green', 'yellow', 'orange'],
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private dataService: DataService) { 
    this.subscription = this.dataService.dataReady$.subscribe(results => {
      this.quizResults = results;
    });
  }

  ngOnInit() {
    this.dataService.dataReady$.subscribe(() => {
      const { labels, values } = this.getPieChartData();
      console.log(labels, values)
      this.pieChartLabels = labels;
      this.pieChartDatasets = [{
        data: values,
        backgroundColor: ['indigo', 'gold', 'blue', 'green', 'yellow', 'orange'],
      }];
    });
  }

  getPieChartData(): { labels: string[]; values: number[] } {
    if (!this.quizResults) return { labels: [], values: [] }
    const categoryCounts = new Map<string, number>(); // Map to store category counts

    // Iterate over quizResults to count occurrences of each category
    this.quizResults.forEach(result => {
      if (result.category.includes(' ')) {
        const categories = result.category.split(' ');
        categories.forEach(category => {
          const count = categoryCounts.get(category) || 0;
          categoryCounts.set(category, count + 1);
        });
      } else {
        const count = categoryCounts.get(result.category) || 0;
        categoryCounts.set(result.category, count + 1);
      }
    });

    // Separate labels and values into arrays
    const labels: string[] = [];
    const values: number[] = [];
    categoryCounts.forEach((count, label) => {
      labels.push(label);
      values.push(count);
    });

    return { labels, values };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
