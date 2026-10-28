interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}
const calculateExercises = (dailyExcerice: number[], target: number): Result => {
  const periodLength = dailyExcerice.length;
  const trainingDays = dailyExcerice.filter((x) => x > 0).length;
  const average =
    dailyExcerice.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    ) / periodLength;
  const success = target === average;
  let rating:number;
  let ratingDescription:string;
  if (average >= target) {
    rating = 3;
    ratingDescription = "perfect";
  } else if (average == 0) {
    rating = 1;
    ratingDescription = "you need to work hard";
  } else {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  }

  const result: Result = {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };

  return result
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
