const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100
  let bmi = weight / (heightInMeters ** 2)
  let answer:string
  if(bmi < 18.5){
    answer = "Underweight range"
  } else if (bmi <= 24.9) {
    answer = "Normal range"
  } else if (bmi <= 29.9) {
    answer = "Overweight range"
  } else {
    answer = "Obese range"
  }
  return answer
}

const parseArguments = (args: string[]): [number, number] => {
  if (args.length != 2) {
    throw new Error("Please provide exactly two arguments: height and weight")
  }

  const height = Number(args[0])
  const weight = Number(args[1])

  if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) {
    throw new Error("Height and weight must be positive numbers")
  }

  return [height, weight]
}

try {
  const [height, weight] = parseArguments(process.argv.slice(2))
  console.log(calculateBmi(height, weight))
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}

export {}
