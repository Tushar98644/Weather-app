/* eslint-disable @typescript-eslint/no-explicit-any */
export class LocalStorageService {
  private static readonly KEYS = {
    LAST_SEARCHED_CITY: "weather_last_searched_city",
    TEMPERATURE_UNIT: "weather_temperature_unit",
    USER_PREFERENCES: "weather_user_preferences",
  } as const;

  static getLastSearchedCity(): string {
    return localStorage.getItem(this.KEYS.LAST_SEARCHED_CITY) || "";
  }

  static setLastSearchedCity(city: string): void {
    localStorage.setItem(this.KEYS.LAST_SEARCHED_CITY, city);
  }

  static getTemperatureUnit(): "celsius" | "fahrenheit" {
    const unit = localStorage.getItem(this.KEYS.TEMPERATURE_UNIT);
    return unit === "fahrenheit" ? "fahrenheit" : "celsius";
  }

  static setTemperatureUnit(unit: "celsius" | "fahrenheit"): void {
    localStorage.setItem(this.KEYS.TEMPERATURE_UNIT, unit);
  }

  static getUserPreferences(): Record<string, any> {
    try {
      const preferences = localStorage.getItem(this.KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : {};
    } catch {
      return {};
    }
  }

  static setUserPreferences(preferences: Record<string, any>): void {
    localStorage.setItem(
      this.KEYS.USER_PREFERENCES,
      JSON.stringify(preferences)
    );
  }

  static clearAll(): void {
    Object.values(this.KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
