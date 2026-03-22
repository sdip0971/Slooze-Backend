export const typeDefs = `#graphql
  enum Role {
    ADMIN
    MANAGER
    MEMBER
  }

  enum Country {
    INDIA
    AMERICA
  }

  type Restaurant {
    id: ID!
    name: String!
    country: Country!
  }
 

  type OrderItem {
    id: ID!
    menuItemId: String!
    quantity: Int!
  }

 type Order {
    id: ID!
    userId: String!
    country: String!
    status: String!
    totalAmount: Float!
    orderItems: [OrderItem!]!
  }

  input OrderItemInput {
    menuItemId: ID!
    quantity: Int!
  }

  type Query {
    restaurants: [Restaurant!]!
  }

  type Mutation {
    createOrder(restaurantId: ID!, items: [OrderItemInput!]! ): Order!
    placeOrder(orderId: ID!): Order!
    cancelOrder(orderId: ID!): Order!
  }
`;
