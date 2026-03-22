# Architecture & Design Decisions

## 1. Core Architecture
The application utilizes a single-endpoint GraphQL architecture hosted on a Next.js App Router API route. Apollo Server handles query parsing and execution, while Prisma serves as the ORM to safely interact with a PostgreSQL database.

## 2. Access Management Strategy
Access control is handled at the GraphQL Resolver level via the Context object. 

### Role-Based Access Control (RBAC)
User roles (ADMIN, MANAGER, MEMBER) are injected into the GraphQL context per request. Resolvers explicitly check these roles before executing mutations. For example, the \`placeOrder\` and \`cancelOrder\` resolvers immediately throw a \`GraphQLError\` if the context indicates the user is a \`MEMBER\`.

### Relational Access Control (Re-BAC) / Region Locking
To satisfy the bonus objective of region-locking data, a \`country\` enum is assigned to Users, Restaurants, and Orders. 
- **Query Filtering:** When a MANAGER or MEMBER queries \`restaurants\`, the resolver dynamically appends a \`where: { country: user.country }\` clause to the Prisma query. This ensures they mathematically cannot retrieve out-of-region data.
- **Mutation Validation:** When creating or modifying an order, the resolver fetches the target entity and compares its \`country\` flag against the user's \`country\` flag, rejecting the action if they do not match (unless the user is an ADMIN).

## 3. Data Integrity and Business Logic
- **Financial Calculation:** The \`createOrder\` mutation does not accept a total amount from the client. It calculates the true total server-side by querying the database for the current prices of the requested menu items, preventing client-side price manipulation.
- **Transactional Writes:** Creating an order and its associated order items is handled via Prisma's nested writes, ensuring database consistency without requiring manual SQL transactions.
