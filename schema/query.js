const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} = require("graphql");
const UserMongo = require("../mongoModels/user");
const ClientMongo = require("../mongoModels/client");
const ContactMongo = require("../mongoModels/contact");
const OrderMongo = require("../mongoModels/order");
const ItemMongo = require("../mongoModels/item");
const { AuthData } = require("./types");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, Client, Contact, Order, Item } = require("./types");

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
    login: {
      type: AuthData,
      args: {
        username: {
          type: GraphQLNonNull(GraphQLString),
        },
        password: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(parentValue, args) {
        console.log(args);
        const user = await UserMongo.findOne({ username: args.username });
        if (!user) {
          throw new Error("User does not exists");
        }

        const isEqual = await bcrypt.compare(args.password, user.password);
        if (!isEqual) {
          throw new Error("Password is incorrect");
        }

        const token = jwt.sign(
          {
            userId: user._id,
            username: user.username,
          },
          "supersecterkey123!",
          {
            expiresIn: "1h",
          }
        );

        return {
          userId: user._id,
          token,
          tokenExpiration: 1,
        };
      },
    },
    getAllOrders: {
      type: GraphQLList(Order),
      async resolve(parentValue, args) {
        const orders = await OrderMongo.find()
          .populate("items")
          .populate("client");
        return orders;
      },
    },
    getUser: {
      type: User,
      args: {
        userId: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(parentValue, args) {
        const user = await UserMongo.findById(args.userId);
        return user;
      },
    },
    getAllClients: {
      type: GraphQLList(Client),
      async resolve(parentValue, args) {
        try {
          const clients = await ClientMongo.find()
            .populate("contact")
            .populate({
              path: "orders",
              populate: {
                path: "items",
                model: "Item",
              },
            });
          return clients;
        } catch (err) {
          throw err;
        }
      },
    },
  }),
});

module.exports = query;
