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
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    position: { type: GraphQLString },
    salary: { type: GraphQLInt },
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
    logo: { type: GraphQLString },
    website: { type: GraphQLString },
  }),
});

const Contact = new GraphQLObjectType({
  name: "Contact",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    position: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const Order = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    client: { type: Client },
    date: { type: GraphQLString },
    price: { type: GraphQLFloat },
    item: { type: Item },
    name: { type: GraphQLNonNull(GraphQLString) },
    quantity: { type: GraphQLInt },
  }),
});

const Item = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
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
