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


console.log(calculateBmi(180, 74))
