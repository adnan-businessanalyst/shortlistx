import mongoose, { Schema, models, model } from "mongoose";

const AnswerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    key: { type: String, required: true },
    labelSnapshot: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const SubmissionSchema = new Schema(
  {
    answers: { type: [AnswerSchema], required: true },
    answeredKeys: { type: [String], default: [] },
    visiblePath: { type: [String], default: [] },
    email: { type: String, index: true, sparse: true },
    submittedAt: { type: Date, default: Date.now, index: true },
    pageUrl: String,
    userAgent: String,
    status: {
      type: String,
      enum: ["new", "reviewed", "invited", "rejected"],
      default: "new",
      index: true,
    },
    notes: { type: String, maxlength: 5000 },
  },
  { timestamps: true }
);

SubmissionSchema.index({ submittedAt: -1 });
SubmissionSchema.index({ status: 1, submittedAt: -1 });

export type SubmissionDocument = mongoose.InferSchemaType<
  typeof SubmissionSchema
> & { _id: mongoose.Types.ObjectId };

export const Submission =
  models.Submission || model("Submission", SubmissionSchema);
