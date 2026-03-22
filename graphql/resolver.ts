import { GraphQLError } from "graphql";
export const resolver = {
  Query: {
    restaurants: async (_parent: any, arg: any, context: any) => {
      const { user, prisma } = context;
      if (user.role === "ADMIN") {
        return await prisma.restaurants.findMany();
      }
      return await prisma.restaurant.findMany({
        where: {
          country: user.country,
        },
      });
    },
      paymentMethods: async (_parent: any, { userId }: any, context: any) => {
      const { user, prisma } = context;
      if (user.role !== "ADMIN" && user.id !== userId) {
        throw new GraphQLError("You can only view your own payment methods");
      }
 
      return await prisma.paymentMethod.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' }
      });
    },
  },
  

  Mutation: {
    createOrder: async (
      _parent: any,
      { restaurantId, items }: any,
      context: any,
    ) => {
      const { user, prisma } = context;
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: { menuItems: true },
      });
      if (!restaurant) throw new GraphQLError("Restaurant not found");
      if (user.role !== "ADMIN" && user.country !== restaurant.country) {
        throw new GraphQLError("Cannot create orders outside your country");
      }
      let calculateTotal = 0;
      const menuItems = await prisma.menuItem.findMany({
        where: {
          id: {
            in: items.map((i: { menuItemId: string }) => i.menuItemId),
          },
        },
      });
      const menuMap = new Map(menuItems.map((m: { id: any }) => [m.id, m]));
      const total = items.reduce((acc: number, item: any) => {
        const menu: any = menuMap.get(item.menuItemId);

        if (!menu) {
          throw new GraphQLError("Invalid menu item");
        }

        return acc + menu.price * item.quantity;
      }, 0);
      return prisma.order.create({
        data: {
          userId: user.id,
          country: user.country,
          totalAmount: total,
          orderItems: {
            create: items.map(
              (item: { menuItemId: string; quantity: number }) => {
                const menu = menuMap.get(item.menuItemId)!;

                return {
                  menuItemId: item.menuItemId,
                  quantity: item.quantity,
                };
              },
            ),
          },
        },
        include: {
          orderItems: true,
        },
      });
    },
    cancelOrder: async (
      _parent: any,
      args: { orderId: string },
      context: any,
    ) => {
      const { user, prisma } = context;
      if (user.role === "MEMBER") {
        throw new GraphQLError(
          "Members do not have permission to cancel orders",
        );
      }

      const order = await prisma.order.findUnique({
        where: { id: args.orderId },
      });
      if (!order) throw new GraphQLError("Order not found");
      if (user.role === "MANAGER" && order.country !== user.country) {
        throw new GraphQLError("You do not have access to this region");
      }

      if (user.role === "MANAGER" && order.country !== user.country) {
        throw new GraphQLError("You do not have access to this region");
      }

      return prisma.order.update({
        where: { id: args.orderId },
        data: { status: "CANCELLED" },
      });
    },

    placeOrder: async (_parent: any, { orderId }: any, context: any) => {
      const { user, prisma } = context;

      if (user.role === "MEMBER") {
        throw new GraphQLError(
          "Members do not have permission to place orders",
        );
      }

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) throw new GraphQLError("Order not found");

      if (user.role === "MANAGER" && order.country !== user.country) {
        throw new GraphQLError("You do not have access to this region");
      }

      return prisma.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });
    },
    addPaymentMethod: async (
      _parent: any,
      { userId, input }: any,
      context: any,
    ) => {
      const { user, prisma } = context;

      if (user.role !== "ADMIN") {
        throw new GraphQLError("Only administrators can add payment methods");
      }

      if (input.isDefault) {
        await prisma.paymentMethod.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return prisma.paymentMethod.create({
        data: {
          userId,
          type: input.type,
          cardLast4: input.cardLast4,
          cardBrand: input.cardBrand,
          isDefault: input.isDefault ?? false,
        },
      });
    },
    updatePaymentMethod: async (
      _parent: any,
      { paymentMethodId, input }: any,
      context: any,
    ) => {
      const { user, prisma } = context;

    
      if (user.role !== "ADMIN") {
        throw new GraphQLError(
          "Only administrators can update payment methods",
        );
      }

      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId },
      });

      if (!paymentMethod) {
        throw new GraphQLError("Payment method not found");
      }

   
      if (input.isDefault) {
        await prisma.paymentMethod.updateMany({
          where: {
            userId: paymentMethod.userId,
            isDefault: true,
            NOT: { id: paymentMethodId },
          },
          data: { isDefault: false },
        });
      }

      return prisma.paymentMethod.update({
        where: { id: paymentMethodId },
        data: {
          type: input.type,
          cardLast4: input.cardLast4,
          cardBrand: input.cardBrand,
          isDefault: input.isDefault,
        },
      });
    },

    deletePaymentMethod: async (
      _parent: any,
      { paymentMethodId }: any,
      context: any,
    ) => {
      const { user, prisma } = context;


      if (user.role !== "ADMIN") {
        throw new GraphQLError(
          "Only administrators can delete payment methods",
        );
      }

      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId },
      });

      if (!paymentMethod) {
        throw new GraphQLError("Payment method not found");
      }

      return prisma.paymentMethod.delete({
        where: { id: paymentMethodId },
      });
    },
  },
};


