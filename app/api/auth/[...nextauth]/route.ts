import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user';
        token.email = user.email;
        token.sub = user.id;
      }
      // Preserve role on subsequent requests if it exists
      if (!token.role) {
        token.role = 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        session.user.email = token.email;

        try {
          // Check database for current role on each session request
          const client = await clientPromise;
          const db = client.db();

          // Try to find user by ObjectId first, then by string id
          let user = null;
          try {
            user = await db.collection('users').findOne({ _id: new ObjectId(token.sub) });
          } catch {
            // If token.sub is not a valid ObjectId, try as string
            user = await db.collection('users').findOne({ _id: token.sub as any });
          }

          (session.user as any).role = user?.role || (token as any).role || 'user';
        } catch (error) {
          console.error('Error fetching user role:', error);
          (session.user as any).role = (token as any).role || 'user';
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
