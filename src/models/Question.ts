import mongoose, { Schema, models, model } from "mongoose";
import type { QuestionType } from "@/types/question";

const OptionSchema = new Schema(
  {
    id: String,
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const ConditionSchema = new Schema(
  {
    questionKey: { type: String, required: true },
    operator: {
      type: String,
      enum: [
        "equals",
        "not_equals",
        "includes",
        "not_includes",
        "answered",
        "not_answered",
      ],
      required: true,
    },
    value: Schema.Types.Mixed,
  },
  { _id: false }
);

const ShowIfSchema = new Schema(
  {
    logic: { type: String, enum: ["and", "or"], default: "and" },
    conditions: { type: [ConditionSchema], default: [] },
  },
  { _id: false }
);

const LabelWhenSchema = new Schema(
  {
    when: { type: ConditionSchema, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const QuestionSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[a-z][a-z0-9_]*$/, "key must be snake_case"],
    },
    order: { type: Number, required: true, index: true },
    type: {
      type: String,
      enum: [
        "text",
        "email",
        "textarea",
        "select",
        "single_choice",
        "multi_choice",
        "number",
      ] as QuestionType[],
      required: true,
    },
    label: { type: String, required: true, maxlength: 500 },
    hint: { type: String, maxlength: 500 },
    placeholder: { type: String, maxlength: 300 },
    required: { type: Boolean, default: false },
    options: { type: [OptionSchema], default: undefined },
    active: { type: Boolean, default: true, index: true },
    showIf: { type: ShowIfSchema, default: undefined },
    labelWhen: { type: [LabelWhenSchema], default: undefined },
  },
  { timestamps: true }
);

QuestionSchema.index({ active: 1, order: 1 });

export type QuestionDocument = mongoose.InferSchemaType<typeof QuestionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Question =
  models.Question || model("Question", QuestionSchema);
