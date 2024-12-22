const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type User {
		id: ID!
		username: String!
		email: String!
		role: String
		token: String!
	}

	input SignUpInput {
		username: String!
		email: String!
		password: String!
		role: String!
	}

	type Query {
		getUsers: [User]
		getUserById(id: ID!): User
	}

	type Mutation {
		signUp(signUpInput: SignUpInput!): User!
		login(email: String!, password: String!): User!
		updateUserProfile(id: ID!, username: String, email: String): User
	}
`;

module.exports = typeDefs;
