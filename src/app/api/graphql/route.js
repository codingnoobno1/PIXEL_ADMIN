import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongo';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  formatError: (error) => {
    console.error('GraphQL Error:', error.message);
    return error;
  },
});

export const POST = startServerAndCreateNextHandler(server, {
  context: async () => {
    const session = await getServerSession(authOptions);
    const db = (await clientPromise).db('quiz1');
    return { db, session };
  },
});
