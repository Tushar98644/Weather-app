export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

export function formatTemperature(
  temp: number,
  unit: "celsius" | "fahrenheit"
): string {
  const convertedTemp =
    unit === "fahrenheit" ? celsiusToFahrenheit(temp) : temp;
  const symbol = unit === "fahrenheit" ? "°F" : "°C";
  return `${convertedTemp}${symbol}`;
}

export function getTemperatureRange(
  min: number,
  max: number,
  unit: "celsius" | "fahrenheit"
): string {
  const minTemp = unit === "fahrenheit" ? celsiusToFahrenheit(min) : min;
  const maxTemp = unit === "fahrenheit" ? celsiusToFahrenheit(max) : max;
  const symbol = unit === "fahrenheit" ? "°F" : "°C";
  return `${minTemp}${symbol} / ${maxTemp}${symbol}`;
}
