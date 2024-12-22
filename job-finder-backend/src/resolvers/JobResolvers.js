const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const Job = require("./../models/Job");
const Application = require("./../models/Application");
const User = require("./../models/User");

const authMiddleware = require("./../utils/authMiddleware");

const sendEmail = require("./../utils/email");

const getAllSeekersEmails = async () => {
  const seekers = await User.find({ role: "seeker" });
  return seekers.map((seeker) => seeker.email);
};

module.exports = {
  Query: {
    getJobs: async (_, { location, ctcRange }) => {
      const filter = {};
      if (location) filter.location = location;
      if (ctcRange)
        filter.ctc = {
          $gte: parseInt(ctcRange.split("-")[0]),
          $lte: parseInt(ctcRange.split("-")[1]),
        };
      return await Job.find(filter);
    },

    getJobById: async (_, { id }) => {
      return await Job.findById(id);
    },
    getJobsAppliedBySeeker: async (_, __, context) => {
      const user = authMiddleware(context);

      const { dataSources } = context;

      if (!user || user.role !== "seeker")
        throw new Error("Unauthorized access");

      const applications =
        await dataSources.applicationAPI.getApplicationsByUser(user.id);

      if (!applications) throw new Error("No applications found for the user");

      return applications;
    },

    // Get all jobs posted by a poster
    getJobsPostedByPoster: async (_, __, context) => {
      const user = authMiddleware(context);

      const { dataSources } = context;

      if (!user || user.role !== "poster")
        throw new Error("Unauthorized access");

      const jobs = await dataSources.jobAPI.getJobsByPoster(user.id);

      if (!jobs) throw new Error("No jobs found for the user");

      return jobs;
    },

    getJobApplicants: async (_, { jobId }) => {
      // Find applications for the job
      const applications = await Application.find({ jobId });

      if (!applications) throw new Error("No applicants found for this job");

      return applications.map((app) => ({
        id: app.id,
        status: app.status,
        userId: app.userId,
      }));
    },

    hasUserAppliedForJob: async (_, { jobId }, context) => {
      const user = authMiddleware(context);
      if (!user) {
        throw new AuthenticationError("Unauthorized access");
      }

      const application = await Application.findOne({ jobId, userId: user.id });

      return application !== null;
    },
  },

  Mutation: {
    postJob: async (
      _,
      { title, company, description, ctc, location },
      context
    ) => {
      const user = authMiddleware(context);

      if (user.role !== "poster")
        throw new Error("Only employers can post jobs");

      const job = new Job({
        title,
        company,
        description,
        ctc,
        location,
        postedBy: user.id,
      });

      await job.save();

      // Publish the new job event
      pubsub.publish("JOB_POSTED", { jobPosted: job });

      try {
        const seekers = await getAllSeekersEmails();
        seekers.forEach(async (email) => {
          await sendEmail({
            to: email,
            subject: "New Job Posted",
            text: `A new job has been posted: ${title} at ${company}. Check it out!`,
          });
        });
      } catch (error) {
        console.error("Error sending email:", error);
      }

      return job;
    },

    applyForJob: async (_, { jobId }, context) => {
      const user = authMiddleware(context);
      // add unique validation
      if (user.role !== "seeker")
        throw new Error("Only job seekers can apply for jobs");

      const userId = user.id;

      const existingApplication = await Application.findOne({
        where: { userId, jobId },
      });

      if (existingApplication) {
        throw new Error("You have already applied to this job!");
      }

      const job = await Job.findById(jobId);
      if (!job) throw new Error("Job not found");

      const application = new Application({
        jobId: job._id,
        userId: user.id,
        status: "Applied",
      });

      await application.save();

      // change the name of the event
      pubsub.publish("APPLICATION_STATUS_CHANGED", {
        applicationStatusChanged: application,
      });

      // Get job and poster details

      const jobPoster = await User.findById(job.postedBy);
      if (!jobPoster) throw new Error("Job poster not found");

      // Send email notification to the job poster
      await sendEmail({
        to: jobPoster.email,
        subject: job.title,
        text: `Applicant Name : ${user.username}
				\nApplicant Email : ${user.email}`,
      });

      return application;
    },

    updateApplicationStatus: async (_, { applicationId, status }, context) => {
      const user = authMiddleware(context);
      const { dataSources } = context;

      if (!user) throw new Error("User not authenticated");

      if (user.role !== "poster") {
        throw new Error("Unauthorized");
      }

      const updatedApplication =
        await dataSources.applicationAPI.updateApplicationStatus(
          applicationId,
          status
        );

      if (!updatedApplication) {
        throw new Error("Application not found or update failed");
      }
      const dataToBePublished = {
        applicationStatusChanged: updatedApplication,
      };
      // Publish the application status change event
      pubsub.publish("APPLICATION_STATUS_CHANGED", dataToBePublished);

      // console.log(dataToBePublished);

      return updatedApplication;
    },
  },
  Subscription: {
    jobPosted: {
      subscribe: () => {
        // console.log('Job Posted');
        return pubsub.asyncIterableIterator("JOB_POSTED");
      },
    },
    applicationStatusChanged: {
      subscribe: () => {
        // console.log('APPLICATION STATUS CHANGED');
        return pubsub.asyncIterableIterator("APPLICATION_STATUS_CHANGED");
      },
    },
  },
};
