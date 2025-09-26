import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Utility function to safely check if a date is valid
export function isValidDate(date) {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

// Utility function to safely format dates with fallback
export function safeFormatDate(date, formatString, fallback = "Invalid Date") {
  if (!isValidDate(date)) return fallback;
  try {
    const { format } = require("date-fns");
    return format(new Date(date), formatString);
  } catch (error) {
return fallback;
  }
}