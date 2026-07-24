export type QuestionType =
  | "text"
  | "email"
  | "textarea"
  | "select"
  | "single_choice"
  | "multi_choice"
  | "number";

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "includes"
  | "not_includes"
  | "answered"
  | "not_answered";

export interface QuestionOption {
  id?: string;
  value: string;
  label: string;
}

export interface ShowIfCondition {
  questionKey: string;
  operator: ConditionOperator;
  value?: string | string[];
}

export interface ShowIf {
  logic: "and" | "or";
  conditions: ShowIfCondition[];
}

export interface LabelWhenRule {
  when: {
    questionKey: string;
    operator: ConditionOperator;
    value?: string | string[];
  };
  label: string;
}

export interface QuestionDoc {
  _id?: string;
  key: string;
  order: number;
  type: QuestionType;
  label: string;
  hint?: string;
  placeholder?: string;
  required: boolean;
  options?: QuestionOption[];
  active: boolean;
  showIf?: ShowIf;
  labelWhen?: LabelWhenRule[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type AnswerValue = string | string[] | number | null | undefined;

export type AnswersMap = Record<string, AnswerValue>;

export interface AnswerRecord {
  questionId: string;
  key: string;
  labelSnapshot: string;
  type: QuestionType;
  value: string | string[];
}

export type SubmissionStatus = "new" | "reviewed" | "invited" | "rejected";

export interface SubmissionDoc {
  _id?: string;
  answers: AnswerRecord[];
  answeredKeys?: string[];
  visiblePath?: string[];
  email?: string;
  submittedAt: string | Date;
  pageUrl?: string;
  userAgent?: string;
  status: SubmissionStatus;
  notes?: string;
}
