"use client";
import { useTranslation } from "react-i18next";

export default function Today() {
  const { t } = useTranslation("common");

  const today = new Date();

  // JavaScript liefert Zahlen → wir mappen sie auf unsere JSON-Keys
  const weekdays = [
    "sunday",    // 0
    "monday",    // 1
    "tuesday",   // 2
    "wednesday", // 3
    "thursday",  // 4
    "friday",    // 5
    "saturday"   // 6
  ];

  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  const weekdayKey = weekdays[today.getDay()];
  const monthKey = months[today.getMonth()];

  const weekday = t(`weekdays.${weekdayKey}.long`);
  const month = t(`months.${monthKey}`);
  const day = today.getDate();
  const year = today.getFullYear();

  return (
    <p>
      {weekday}, {day}. {month} {year}
    </p>
  );
}