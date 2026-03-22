export const typeDefs = `#graphql
  enum Role {
    ADMIN
    MANAGER
    MEMBER
  }
  enum PaymentType {
    CREDIT_CARD
    DEBIT_CARD
    UPI
    WALLET
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
   
 type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    country: Country!
    paymentMethods: [PaymentMethod!]!
  }
  type PaymentMethod {
    id: ID!
    userId: String!
    type: PaymentType!
    cardLast4: String
    cardBrand: String
    isDefault: Boolean!
    createdAt: String!
  }
 


  type OrderItem {
    id: ID!
    menuItemId: String!
    quantity: Int!
  }

  
  type PaymentMethod {
    id: ID!
    userId: String!
    type: PaymentType!
    cardLast4: String
    cardBrand: String
    isDefault: Boolean!
    createdAt: String!
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
  input PaymentMethodInput {
    type: PaymentType!
    cardLast4: String
    cardBrand: String
    isDefault: Boolean
  }
  type Query {
    restaurants: [Restaurant!]!
     paymentMethods(userId: ID!): [PaymentMethod!]!
  }

  type Mutation {
    createOrder(restaurantId: ID!, items: [OrderItemInput!]! ): Order!
    placeOrder(orderId: ID!): Order!
    cancelOrder(orderId: ID!): Order!
    addPaymentMethod(userId: ID!, input: PaymentMethodInput!): PaymentMethod!
    updatePaymentMethod(paymentMethodId: ID!, input: PaymentMethodInput!): PaymentMethod!
    deletePaymentMethod(paymentMethodId: ID!): PaymentMethod!
  }
`;
