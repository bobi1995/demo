const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");
const MongoUser = require("../mongoModels/user");
const MongoClient = require("../mongoModels/client");
const MongoContact = require("../mongoModels/contact");
const MongoOrder = require("../mongoModels/order");
const MongoItem = require("../mongoModels/item");
const { User, Client, Contact, Order, Item } = require("./types");
const bcrypt = require("bcryptjs");

const mutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: () => ({
    deleteOrder: {
      type: Order,
      args: {
        orderId: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(parentValue, args) {
        const order = await MongoOrder.findById(args.orderId);
        if (!order) {
          throw new Error("Order does not exist");
        }
        const client = await MongoClient.findById(order.client);
        if (!client) {
          throw new Error("Client does not exist");
        }

        if (order.items.length < 1) {
          throw new Error("Item does not exist");
        }

        order.items.map(async (el) => {
          const item = await MongoItem.findById(el);
          item.order.splice(item.order.indexOf(args.orderId), 1);
          await item.save();
        });

        client.orders.splice(client.orders.indexOf(args.orderId), 1);
        await client.save();

        await MongoOrder.deleteOne({
          _id: args.orderId,
        });

        return order;
      },
    },
    addItem: {
      type: Item,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        price: {
          type: GraphQLNonNull(GraphQLFloat),
        },
      },
      async resolve(parentValue, args) {
        const exist = await MongoItem.findOne({ name: args.name });
        if (exist) {
          throw new Error("User already exists");
        } else {
          const item = new MongoItem({
            name: args.name,
            price: args.price,
            order: [],
          });
          return item
            .save()
            .then((res) => res)
            .catch((err) => {
              throw err;
            });
        }
      },
    },
    addOrder: {
      type: Order,
      args: {
        clientId: {
          type: GraphQLNonNull(GraphQLString),
        },
        date: {
          type: GraphQLString,
        },
        price: {
          type: GraphQLNonNull(GraphQLFloat),
        },
        itemsIds: {
          type: GraphQLList(GraphQLString),
        },
      },
      async resolve(parentValue, args) {
        const client = await MongoClient.findById(args.clientId);
        if (!client) {
          throw new Error("Client does not exist");
        }
        const items = await MongoItem.find({
          _id: { $in: args.itemsIds },
        }).exec();

        if (items.length < 1) {
          throw new Error("Item does not exist");
        }
        const order = new MongoOrder({
          name: args.name,
          price: args.price,
          client: client,
          items: items,
          date: args.date ? args.date : new Date(),
        });

        const result = await order.save();
        items.map(async (el) => {
          el.order.push(order);
          await el.save();
        });

        client.orders.push(order);
        client.save();

        return result;
      },
    },
    addUser: {
      type: User,
      args: {
        firstName: {
          type: GraphQLString,
        },
        lastName: {
          type: GraphQLString,
        },
        type: {
          type: GraphQLString,
        },
        username: {
          type: GraphQLNonNull(GraphQLString),
        },
        password: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(
        parentValue,
        { firstName, lastName, username, password, type }
      ) {
        const exist = await MongoUser.findOne({ username: username });
        if (exist) {
          throw new Error("User already exists");
        } else {
          const hashedPassword = await bcrypt.hash(password, 12);
          const user = new MongoUser({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            type: type,
          });
          return user
            .save()
            .then((res) => res)
            .catch((err) => {
              throw err;
            });
        }
      },
    },

    addClient: {
      type: Client,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        address: {
          type: GraphQLString,
        },
      },
      async resolve(parentValue, args, req) {
        // if (!req.isAuth) {
        //   throw new Error("You are not authenticated");
        // }
        const client = new MongoClient({
          name: args.name,
          address: args.address,
        });

        return client
          .save()
          .then((res) => res)
          .catch((err) => {
            throw err;
          });
      },
    },
    addContact: {
      type: Contact,
      args: {
        clientId: {
          type: GraphQLNonNull(GraphQLString),
        },
        firstName: {
          type: GraphQLString,
        },
        lastName: {
          type: GraphQLString,
        },
        phone: {
          type: GraphQLString,
        },
        position: {
          type: GraphQLString,
        },
      },
      async resolve(parentValue, args, req) {
        // if (!req.isAuth) {
        //   throw new Error("You are not authenticated");
        // }

        const client = await MongoClient.findById(args.clientId);
        if (!client) {
          throw new Error("Client does not exist");
        }

        const contact = new MongoContact({
          firstName: args.firstName,
          lastName: args.lastName,
          phone: args.phone,
          position: args.position,
        });

        const result = await contact.save();
        client.contact.push(contact);
        await client.save();

        return result;
      },
    },
  }),
});

module.exports = mutation;
