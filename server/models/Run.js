const mongoose = require('mongoose');
const { Schema } = mongoose;

const runSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    durationMs: { type: Number, required: true },
    dodges: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    scoreMixed: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Run', runSchema);
