// src/lib/auth.js
import dbConnect from "./dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import Faculty from "../models/Faculty";
import FacultyCard from "../models/FacultyCard";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Faculty Credentials",
      credentials: {
        email: { label: "Amity Email", type: "email", placeholder: "example@amity.edu" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing credentials in authorize()");
            return null;
          }

          console.log("🔹 Attempting login for:", credentials.email);

          // Ensure DB connection
          await dbConnect();

          // 🔍 Find faculty by Amity email
          const faculty = await Faculty.findOne({
            amity_email: credentials.email.trim().toLowerCase(),
          });

          if (!faculty) {
            console.log("❌ No faculty found for email:", credentials.email);
            return null;
          }

          // 🔐 Compare password (new field name)
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            faculty.password
          );

          if (!isPasswordValid) {
            console.log("❌ Invalid password for:", credentials.email);
            return null;
          }

          // 🪪 Ensure FacultyCard exists
          let facultyCard = await FacultyCard.findOne({ faculty: faculty._id });
          if (!facultyCard) {
            facultyCard = await FacultyCard.create({
              faculty: faculty._id,
              name: faculty.name,
              department: faculty.department || "Unknown",
              position: faculty.position || "Assistant Professor",
            });
            console.log("🆕 FacultyCard created for:", faculty.amity_email);
          }

          console.log("✅ Faculty authorized:", faculty.amity_email);

          // ✅ Return session-safe user object
          return {
            id: faculty._id.toString(),
            name: faculty.name,
            email: faculty.amity_email,
            amiId: faculty.amizone_id, // Add amiId here
            position: faculty.position,
            roles: faculty.roles || [],
            department: faculty.department || "N/A",
            facultyCardId: facultyCard._id.toString(),
          };
        } catch (err) {
          console.error("🚨 Authorization error:", err);
          return null;
        }
      },
    }),
  ],

  // 🔒 JWT-based sessions
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  // 🧠 Attach user data to session token
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token?.user) session.user = token.user;
      return session;
    },
  },

  // Custom sign-in page
  pages: {
    signIn: "/admin_login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
