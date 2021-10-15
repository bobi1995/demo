const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
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
    editItem: {
      type: Item,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        price: {
          type: GraphQLFloat,
        },
        description: {
          type: GraphQLString,
        },
        image: {
          type: GraphQLString,
        },
        newName: {
          type: GraphQLString,
        },
      },
      async resolve(parentValue, args) {
        const item = await MongoItem.findOne({ name: args.name });
        if (!item) {
          throw new Error("Item does not exist");
        }
        try {
          const updatedItem = await MongoItem.findOneAndUpdate(
            { _id: item._id },
            {
              $set: {
                name: args.newName,
                price: args.price,
                description: args.description,
                image: args.image,
              },
            }
          );
          return updatedItem;
        } catch (error) {
          throw new Error("Unsuccessfull update");
        }
      },
    },

    deleteClient: {
      type: Client,
      args: {
        clientId: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(parentValue, args) {
        const client = await MongoClient.findById(args.clientId);
        if (!client) {
          throw new Error("Client does not exist");
        }
        if (client.orders.length > 0) {
          client.orders.map(async (el) => {
            const order = await MongoOrder.findById(el);
            if (!order) {
              throw new Error("Order does not exist");
            }

            if (!order.item) {
              throw new Error("Item does not exist");
            }

            const item = await MongoItem.findById(order.item);
            item.order.splice(item.order.indexOf(el), 1);
            await item.save();

            await MongoOrder.deleteOne({
              _id: el,
            });
          });
        }
        if (client.contact.length > 0) {
          client.contact.map(async (cont) => {
            await MongoContact.deleteOne({ _id: cont });
          });
        }

        await MongoClient.deleteOne({
          _id: args.clientId,
        });

        return client;
      },
    },
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

        if (!order.item) {
          throw new Error("Item does not exist");
        }

        const item = await MongoItem.findById(order.item);
        item.order.splice(item.order.indexOf(args.orderId), 1);
        await item.save();

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
        description: {
          type: GraphQLString,
        },
        image: {
          type: GraphQLString,
        },
      },
      async resolve(parentValue, args) {
        const exist = await MongoItem.findOne({ name: args.name });
        if (exist) {
          throw new Error("Item already exists");
        } else {
          const item = new MongoItem({
            name: args.name,
            price: args.price,
            description: args.description,
            image: args.image,
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
        itemId: {
          type: GraphQLString,
        },
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        quantity: {
          type: GraphQLNonNull(GraphQLInt),
        },
      },
      async resolve(parentValue, args) {
        const client = await MongoClient.findById(args.clientId);
        if (!client) {
          throw new Error("Client does not exist");
        }
        const item = await MongoItem.findById(args.itemId).exec();

        if (!item) {
          throw new Error("Item does not exist");
        }

        const order = new MongoOrder({
          name: args.name,
          price: args.price,
          client: client,
          item: item,
          date: args.date ? args.date : new Date(),
          quantity: args.quantity,
        });

        const result = await order.save();
        item.order.push(order);
        await item.save();

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
        email: {
          type: GraphQLString,
        },
        username: {
          type: GraphQLNonNull(GraphQLString),
        },
        password: {
          type: GraphQLNonNull(GraphQLString),
        },
        phone: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        position: { type: GraphQLString },
        salary: { type: GraphQLInt },
      },

      async resolve(
        parentValue,
        {
          firstName,
          lastName,
          username,
          password,
          email,
          phone,
          startDate,
          endDate,
          position,
          salary,
        }
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
            email,
            phone,
            startDate,
            endDate,
            position,
            salary,
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
        logo: {
          type: GraphQLString,
        },
        website: {
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
          logo: args.logo,
          website: args.website,
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
          type: GraphQLNonNull(GraphQLString),
        },
        phone: {
          type: GraphQLString,
        },
        position: {
          type: GraphQLString,
        },
        email: {
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
          email: args.email,
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
