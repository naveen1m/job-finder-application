// const { ApolloServer, gql } = require('apollo-server-express');
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
// const ApplicationAPI = require('./ApplicationAPI');
// const JobAPI = require('./JobAPI');

// require('dotenv').config();

// const app = express();

// app.use(cors());

// mongoose
// 	.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
// 	.then(() => console.log('MongoDB connected'))
// 	.catch(err => console.error(err));

// // console.log(process.env.MONGODB_URI);

// const userTypeDefs = require('./schema/userSchema');
// const jobTypeDefs = require('./schema/JobSchema');

// const userResolvers = require('./resolvers/UserResolvers');
// const jobResolvers = require('./resolvers/JobResolvers');

// const typeDefs = mergeTypeDefs([userTypeDefs, jobTypeDefs]);
// const resolvers = mergeResolvers([userResolvers, jobResolvers]);

// const server = new ApolloServer({
// 	typeDefs,
// 	resolvers,
// 	context: ({ req }) => {
// 		// You can add any context that you need for authentication or other purposes
// 		return { req };
// 	},
// 	dataSources: () => ({
// 		applicationAPI: new ApplicationAPI(),
// 		jobAPI: new JobAPI()
// 	})
// });

// const startServer = async () => {
// 	await server.start();
// 	server.applyMiddleware({ app, path: '/graphql' });

// 	const PORT = process.env.PORT || 5000;
// 	app.listen(PORT, () => {
// 		console.log(`Server running on port ${PORT}`);
// 		console.log(`GraphQL endpoint is at http://localhost:${PORT}/graphql`);
// 	});
// };

// startServer();

const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const ApplicationAPI = require('./ApplicationAPI');
const JobAPI = require('./JobAPI');

require('dotenv').config();

const app = express();

app.use(cors());

mongoose
	.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error(err));

const userTypeDefs = require('./schema/userSchema');
const jobTypeDefs = require('./schema/JobSchema');

const userResolvers = require('./resolvers/UserResolvers');
const jobResolvers = require('./resolvers/JobResolvers');

const typeDefs = mergeTypeDefs([userTypeDefs, jobTypeDefs]);
const resolvers = mergeResolvers([userResolvers, jobResolvers]);

// Create schema for subscriptions
const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

const server = new ApolloServer({
	schema,
	context: ({ req }) => {
		// Add context if needed for authentication or other purposes
		return { req };
	},
	dataSources: () => ({
		applicationAPI: new ApplicationAPI(),
		jobAPI: new JobAPI()
	})
});

// Start the server with WebSocket support
const startServer = async () => {
	await server.start();
	server.applyMiddleware({ app, path: '/graphql' });

	const PORT = process.env.PORT || 5000;

	// Create HTTP server to attach WebSocket support
	const httpServer = createServer(app);

	// Set up subscription server
	SubscriptionServer.create(
		{
			schema,
			execute,
			subscribe,
			onConnect: (connectionParams, webSocket) => {
				console.log('Client connected for subscriptions');
			},
			onDisconnect: (webSocket, context) => {
				console.log('Client disconnected from subscriptions');
			}
		},
		{
			server: httpServer,
			path: '/graphql'
		}
	);

	httpServer.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
		console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
		console.log(`WebSocket endpoint: ws://localhost:${PORT}/graphql`);
	});
};

startServer();
