interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}
const calculateExercises = (
  dailyExcerice: number[],
  target: number,
): Result => {
  const periodLength = dailyExcerice.length;
  const trainingDays = dailyExcerice.filter((x) => x > 0).length;
  const average =
    dailyExcerice.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    ) / periodLength;
  const success = average >= target
  let rating: number;
  let ratingDescription: string;
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

  return result;
};

const parseArguments = (args: string[]): [number, number[]] => {
  if (args.length < 2) {
    throw new Error(
      "Please provide a target and at least one day's exercise hours",
    );
  }

  const numbers = args.map(Number);
  if (numbers.some((number) => !Number.isFinite(number))) {
    throw new Error("All arguments must be valid numbers");
  }

  const [target, ...dailyHours] = numbers;
  if (target <= 0) {
    throw new Error("Target must be greater than zero.");
  }
  if (dailyHours.some((hours) => hours < 0)) {
    throw new Error("Exercise hours cannot be negative.");
  }

  return [target, dailyHours];
};

try {
  const [target, dailyHours]= parseArguments(process.argv.slice(2));

  console.log(calculateExercises(dailyHours, target))
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}

export {}
