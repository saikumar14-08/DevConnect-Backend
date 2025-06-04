const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');

async function setupGraphQL(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.user }) // Add auth later
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = setupGraphQL;
