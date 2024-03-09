import { Component, Input } from '@angular/core';
import { Subscription, delay, filter, take } from 'rxjs';
import { AWARD_IMAGE_PATHS, AWARD_NUM_SCORES, AWARD_STRING, AwardDisplayItem, AwardType, AwardsDto, createAwardDisplayItem } from 'src/app/models/awards';
import { AwardsService } from 'src/app/services/awards.service';
import { DataService } from 'src/app/services/data.service';
import { getLocalDate } from 'src/app/utils/dateutils';

@Component({
  selector: 'trophy-case',
  templateUrl: './trophy-case.component.html',
  styleUrls: ['./trophy-case.component.css']
})
export class TrophyCaseComponent {
  @Input() userId: number | undefined = 0;
  subscription: Subscription;
  awardSubscription: Subscription;
  displayedAwards: AwardDisplayItem[] | undefined = [];

  awards: AwardsDto[]  = [];

  constructor(private awardsService: AwardsService, private dataService: DataService) {
    this.subscription = this.dataService.memberReady$.subscribe(results => {
      this.userId = results.id;
    });
    this.awardSubscription = this.awardsService.awardThread$.subscribe(award => {
      if (award) {
        console.log("new award")
          this.awards.push(award);
          this.displayAwards(this.awards);
      }
    });
  }

  ngOnInit() {
    this.dataService.memberReady$.subscribe(() => {
      this.getAwardsForUser()
    });
  }

  getAwardsForUser() {
    if (this.userId && this.userId != 0) {
      this.awardsService.getAwardsForUser(this.userId).subscribe(
        (data) => {
          this.awards = data;
          this.displayAwards(this.awards)
        }
      )
    }
  }
  
  displayAwards(awards: AwardsDto[]) {
    if (!awards) return;

    this.displayedAwards = [];

    awards.forEach(award => {
      //skip high scores for now
      if (award.award >= 3) {
        let awardItem: AwardDisplayItem = createAwardDisplayItem(award);
        let numPerfectScores = 0;
        let awardTypeStr = '';

        switch (award.award) {
          case AwardType.Bronze:
          case AwardType.Silver:
          case AwardType.Gold: {
            awardItem.image = AWARD_IMAGE_PATHS[award.award];
            numPerfectScores = AWARD_NUM_SCORES[award.award];
            awardTypeStr = AWARD_STRING[award.award];
            break;
          }
        }
        awardItem.toolTip = `${awardTypeStr} (${numPerfectScores} perfect scores): ${awardItem.category}-${awardItem.level} ${getLocalDate(awardItem.dateAwarded)}`;
        this.displayedAwards?.push(awardItem);
      }
    });
    console.log("awarditems", this.displayedAwards)
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}


