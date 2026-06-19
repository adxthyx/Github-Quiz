export type Repo = {
  /** "facebook/react" */
  fullName: string;
  description: string;
  /** https://github.com/facebook/react */
  url: string;
};

export type Choice = Repo & { correct: boolean };

export type Question = {
  id: string;
  /** Shiki language id, e.g. "tsx", "python" */
  lang: string;
  /** Revealed only after answering */
  filePath: string;
  /** Shiki-rendered HTML, redacted */
  snippetHtml: string;
  /** Length 4, exactly one correct, shuffled */
  choices: Choice[];
  /** The correct choice — repo link + path shown in the reveal */
  answer: Repo;
};
