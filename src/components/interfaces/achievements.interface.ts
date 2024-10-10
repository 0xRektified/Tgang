export interface IAchievement {
  id: number;
  name: string;
  description: string;
  requirements: string;
  image: string;
  timeLimit?: Date;
}
