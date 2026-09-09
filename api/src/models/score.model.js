import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    pseudo: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 30,
    },
    scoreQuiz1: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    scoreQuiz2: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },
    playedDouble: {
      type: Boolean,
      required: true,
      default: false,
    },
    doubleWon: {
      type: Boolean,
      required: true,
      default: false,
    },
    finalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
  },
  {
    timestamps: true,
    collection: "scores",
    versionKey: false,
  },
);

scoreSchema.index({ finalScore: -1, createdAt: 1 });

const Score = mongoose.models.Score || mongoose.model("Score", scoreSchema);

export default Score;
