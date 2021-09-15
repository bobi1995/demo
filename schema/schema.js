const { GraphQLSchema } = require("graphql");
const mutation = require("./mutations");
const query = require("./query");

const schema = new GraphQLSchema({
  query: query,
  mutation: mutation,
});

module.exports = schema;
