import { useState } from "react";

export default function useForm() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  console.log({ answers, errors });

  const inputHandler = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const qid = target.dataset.qid;
    if (!qid) return;

    const value = target.value;
    console.log("Answer changed:", { qid, value });

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [qid]: "Answer is required",
      }));
      return;
    }

    const allowedOptions = target.dataset.allowedOptions?.split(",");
    if (target.type === "text") {
      if (allowedOptions && !allowedOptions.includes(value.toUpperCase())) {
        console.warn(
          `Invalid option for question ${qid}. Must be one of: ${allowedOptions.join(
            ", "
          )}`
        );
        target.value = "";
        setErrors((prev) => ({
          ...prev,
          [qid]: `Invalid option for question ${qid}: ${value}. Must be one of: ${allowedOptions.join(
            ", "
          )}`,
        }));
        return;
      }
    }
    if (target.type === "radio") {
      // Do nothing
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[qid];
      return newErrors;
    });

    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [qid]: value,
      };
      localStorage.setItem("answers", JSON.stringify(newAnswers));
      console.log("Answers saved:", newAnswers);
      return newAnswers;
    });
  };

  const restoreAnswers = () => {
    const savedAnswers = localStorage.getItem("answers");
    if (!savedAnswers) return;

    const answers = JSON.parse(savedAnswers);
    const inputs = document.querySelectorAll<HTMLInputElement>("[data-qid]");

    inputs.forEach((input) => {
      const qid = input.getAttribute("data-qid");
      if (input.type === "text") {
        if (qid && answers[qid]) {
          input.value = answers[qid];
        }
      } else if (input.type === "radio" || input.type === "checkbox") {
        if (qid && answers[qid]) {
          input.checked = answers[qid] === input.value;
        }
      }
    });
    setTimeout(() => {
      setAnswers(answers);
    }, 0);
  };

  const handleSubmitListeningAnswers = () => {};

  return {
    answers,
    inputHandler,
    restoreAnswers,
    errors,
  };
}
