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

const { User, Client, Contact, Order, Item } = require("./types");

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
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
