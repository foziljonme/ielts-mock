import type { NoteCompletionBlock } from "../../shared/types";

export const placeNumberOnTemplateBeforeBlank = (
  template: string,
  number: number
) => {
  return template.replace("{{blank}}", `<strong>${number}</strong>{{blank}}`);
};

export const inputTemplate = (qid: string) => `
<input
        type="text"
        data-qid="${qid}"
        name="${qid}"
        class="inline-input"
        />
`;

export const placeInputOnTemplateBlank = (template: string, qid: string) => {
  return template.replace("{{blank}}", inputTemplate(qid));
};

export const constructTemplate = (block: NoteCompletionBlock) => {
  const template = block.template || "{{blank}}";

  const numberedTemplate = placeNumberOnTemplateBeforeBlank(
    template,
    block.number!
  );

  const inputTemplate = placeInputOnTemplateBlank(
    numberedTemplate,
    block.questionId!
  );

  return inputTemplate;
};
