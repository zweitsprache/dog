"use client";

import { useId, useState } from "react";

export type ListeningExerciseProps = {
  exerciseNumber: string;
  instruction: string;
  trueLabel: string;
  falseLabel: string;
  statements: Array<{ text: string }>;
};

type Answer = "true" | "false";

export function ListeningExercise({
  exerciseNumber,
  instruction,
  trueLabel,
  falseLabel,
  statements,
}: ListeningExerciseProps) {
  const groupId = useId();
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const normalizedExerciseNumber = exerciseNumber.trim();
  const formattedExerciseNumber = /^\d+$/.test(normalizedExerciseNumber)
    ? normalizedExerciseNumber.padStart(2, "0")
    : normalizedExerciseNumber;

  function selectAnswer(index: number, answer: Answer) {
    setAnswers((current) => ({ ...current, [index]: answer }));
  }

  return (
    <section className="listening-exercise">
      <header className="listening-exercise__header">
        <span className="listening-exercise__number">
          {formattedExerciseNumber}
        </span>
        <h2>{instruction}</h2>
      </header>

      <div className="listening-exercise__body">
        <div className="listening-exercise__table">
          <div className="listening-exercise__labels" aria-hidden="true">
            <span>{trueLabel}</span>
            <span>{falseLabel}</span>
          </div>

          {statements.map((statement, index) => (
            <fieldset className="listening-exercise__row" key={index}>
              <legend className="sr-only">{statement.text}</legend>
              <span className="listening-exercise__row-number">
                {String(index + 1).padStart(2, "0")}.
              </span>
              <p>{statement.text}</p>
              <label>
                <span className="sr-only">{trueLabel}</span>
                <input
                  type="radio"
                  name={`${groupId}-${index}`}
                  checked={answers[index] === "true"}
                  onChange={() => selectAnswer(index, "true")}
                />
              </label>
              <label>
                <span className="sr-only">{falseLabel}</span>
                <input
                  type="radio"
                  name={`${groupId}-${index}`}
                  checked={answers[index] === "false"}
                  onChange={() => selectAnswer(index, "false")}
                />
              </label>
            </fieldset>
          ))}
        </div>
      </div>
    </section>
  );
}