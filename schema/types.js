const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLFloat,
} = require("graphql");

const User = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    type: { type: GraphQLString },
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const Client = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLString },
    contact: { type: GraphQLList(Contact) },
    orders: { type: GraphQLList(Order) },
  }),
});

const Contact = new GraphQLObjectType({
  name: "Contact",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    position: { type: GraphQLString },
  }),
});

const Order = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    client: { type: Client },
    date: { type: GraphQLString },
    price: { type: GraphQLFloat },
    items: { type: GraphQLList(Item) },
  }),
});

const Item = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    order: { type: GraphQLList(Order) },
  }),
});

const AuthData = new GraphQLObjectType({
  name: "AuthData",
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString) },
    tokenExpiration: { type: GraphQLNonNull(GraphQLInt) },
    userId: { type: GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = { User, Client, Contact, Order, Item, AuthData };
