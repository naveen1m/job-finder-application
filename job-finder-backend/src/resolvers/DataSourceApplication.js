class ApplicationAPI {
	constructor({ db }) {
		this.db = db;
	}

	async getApplicationById(applicationId) {
		return this.db.collection('applications').findOne({ id: applicationId });
	}

	async updateApplication(applicationId, updates) {
		await this.db.collection('applications').updateOne({ id: applicationId }, { $set: updates });
		return this.getApplicationById(applicationId);
	}
}

module.exports = ApplicationAPI;
