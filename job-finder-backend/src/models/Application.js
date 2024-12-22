const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
	jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	status: { type: String, enum: ['Applied', 'Interviewing', 'Hired'], required: true }
});

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
