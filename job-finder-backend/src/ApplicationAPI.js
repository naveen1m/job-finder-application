const { DataSource } = require('apollo-datasource');
const Application = require('../src/models/Application');
const Job = require('../src/models/Job');

class ApplicationAPI extends DataSource {
	constructor() {
		super();
	}

	initialize(config) {
		this.context = config.context;
	}

	async updateApplicationStatus(applicationId, status) {
		const validStatuses = ['Applied', 'Interviewing', 'Hired', 'Rejected'];
		if (!validStatuses.includes(status)) {
			throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
		}

		const application = await Application.findById(applicationId);

		if (!application) {
			throw new Error('Application not found');
		}

		application.status = status;
		await application.save();

		return application;
	}

	async getApplicationsByUser(userId) {
		const applications = await Application.find({ userId: userId });

		return applications;
	}
}

module.exports = ApplicationAPI;
