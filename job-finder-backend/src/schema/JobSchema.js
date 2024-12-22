const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Job {
    id: ID!
    title: String!
    company: String!
    location: String!
    ctc: Float
    description: String!
    postedBy: User!
  }

  type Application {
    id: ID!
    jobId: ID!
    job: Job
    userId: ID!
    status: String! # Applied, Interviewing, Hired
  }

  type Query {
    getJobs(location: String, ctcRange: String): [Job!]!
    getJobById(id: ID!): Job
    getJobsAppliedBySeeker: [Application!]!
    getJobsPostedByPoster: [Job!]!
    getJobApplicants(jobId: ID!): [Application!]!
    hasUserAppliedForJob(jobId: ID!): Boolean!
  }

  type Mutation {
    postJob(
      title: String!
      company: String!
      description: String!
      ctc: Float!
      location: String!
    ): Job
    applyForJob(jobId: ID!): Application
    updateApplicationStatus(applicationId: ID!, status: String!): Application
  }

  type Subscription {
    jobPosted: Job
    applicationStatusChanged: Application
  }
`;

module.exports = typeDefs;
