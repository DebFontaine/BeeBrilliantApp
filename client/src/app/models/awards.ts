  export interface AwardsDto {
    id: number;
    userId: number;
    quizId: number;
    quizName: string;
    category: string;
    level: string;
    dateAwarded: Date;
    award: AwardType;
}

export enum AwardType {
    HighScoreQuiz = 1,
    HighScoreLevelCategory = 2,
    Bronze = 3,
    Silver = 4,
    Gold = 5
}

export interface AwardDisplayItem {
    quizId: number;
    quizName: string;
    category: string;
    level: string;
    dateAwarded: Date;
    award: AwardType;
    image: string;
    toolTip: string;
}
export const AWARD_IMAGE_PATHS = {
    [AwardType.Bronze]: './assets/images/bronze.svg',
    [AwardType.Silver]: './assets/images/silver.svg',
    [AwardType.Gold]: './assets/images/gold.svg'
  };

export const AWARD_NUM_SCORES = {
    [AwardType.Bronze]: 5,
    [AwardType.Silver]: 15,
    [AwardType.Gold]: 30
  };

export const AWARD_STRING = {
    [AwardType.Bronze]: 'Bronze',
    [AwardType.Silver]: 'Silver',
    [AwardType.Gold]: 'Gold'
  };

  export function createAwardDisplayItem(award: AwardsDto): AwardDisplayItem {
    return {
      quizId: award.quizId,
      quizName: award.quizName,
      category: award.category,
      level: award.level,
      dateAwarded: award.dateAwarded,
      award: award.award,
      image: '',
      toolTip: ''
    };
  }