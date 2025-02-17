"use client";

import { useState } from "react";
import type { GameSettings } from "#/types/game";

interface Props {
  onStart: (settings: GameSettings) => void;
  defaultSettings: GameSettings;
}

export default function GameSettingsScreen({
  onStart,
  defaultSettings,
}: Props) {
  const [settings, setSettings] = useState(defaultSettings);
  const [tempValues, setTempValues] = useState({
    rounds: String(defaultSettings.rounds),
    min: String(defaultSettings.min),
    max: String(defaultSettings.max),
  });

  const isValid = Number(tempValues.min) <= Number(tempValues.max);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Ensure all values are valid before starting
    const validatedSettings = {
      rounds: Math.max(1, Number(tempValues.rounds) || defaultSettings.rounds),
      min: Math.max(0, Number(tempValues.min) || defaultSettings.min),
      max: Math.max(0, Number(tempValues.max) || defaultSettings.max),
      timer: settings.timer, // Include timer value
    };
    console.log("Submitting settings:", validatedSettings);
    onStart(validatedSettings);
  };

  const handleInputChange = (field: keyof typeof tempValues, value: string) => {
    console.log("Input changed:", field, value);
    setTempValues((prev) => ({ ...prev, [field]: value }));
    const numValue = value === "" ? 0 : Number(value);
    setSettings((prev) => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="w-full max-w-md space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Spillinnstillinger</h2>
        <p className="mt-2 text-gray-600">Tilpass spillet til ditt nivå</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="rounds"
              className="block text-sm font-medium text-gray-700"
            >
              Antall runder
            </label>
            <input
              type="number"
              id="rounds"
              min="1"
              max="50"
              value={tempValues.rounds}
              onChange={(e) => handleInputChange("rounds", e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="min"
                className="block text-sm font-medium text-gray-700"
              >
                Minste tall
              </label>
              <input
                type="number"
                id="min"
                min="0"
                max="12"
                value={tempValues.min}
                onChange={(e) => handleInputChange("min", e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="max"
                className="block text-sm font-medium text-gray-700"
              >
                Største tall
              </label>
              <input
                type="number"
                id="max"
                min="0"
                max="12"
                value={tempValues.max}
                onChange={(e) => handleInputChange("max", e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {!isValid && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Minste tall kan ikke være større enn største tall
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full rounded-lg p-4 text-lg font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isValid
              ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          Start Spillet
        </button>
      </form>
    </div>
  );
}
