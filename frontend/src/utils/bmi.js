// BMI = weight(kg) / height(m)^2
export function calculateBMI(heightCm, weightKg) {
  const h = Number(heightCm);
  const w = Number(weightKg);
  if (!h || !w) return null;
  const heightM = h / 100;
  return Math.round((w / (heightM * heightM)) * 10) / 10;
}

export function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return null;
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export const BMI_META = {
  underweight: { label: "Underweight", color: "#4C6FFF", hint: "Below the typical healthy range." },
  normal: { label: "Healthy weight", color: "#00C896", hint: "Within the typical healthy range." },
  overweight: { label: "Overweight", color: "#FFB020", hint: "Above the typical healthy range." },
  obese: { label: "Obese", color: "#FF5470", hint: "Well above the typical healthy range." },
};

// BMI scale used for the gauge: 15 -> 40, with band boundaries at 18.5 / 25 / 30
export const BMI_SCALE = { min: 15, max: 40, bands: [18.5, 25, 30] };
