const { DataSource } = require('apollo-datasource');
const Job = require('../src/models/Job');

class JobAPI extends DataSource {
	constructor() {
		super();
	}

	initialize(config) {
		this.context = config.context;
	}

	async getJobsByPoster(userId) {
		return await Job.find({ postedBy: userId });
	}

	async getJobById(jobId) {
		return await Job.find({ id: jobId });
	}
}

module.exports = JobAPI;
