import type { Express, RequestHandler } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";

export function setupSimpleAuth(app: Express) {
  // Setup session middleware
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const memoryStore = MemoryStore(session);
  const sessionStore = new memoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  });
  
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  }));

  // Simple login route that creates a demo user
  app.get("/api/login", async (req: any, res) => {
    try {
      // Create or get demo user
      let user = await storage.getUser("demo-user");
      if (!user) {
        user = await storage.upsertUser({
          id: "demo-user",
          email: "demo@example.com",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: null,
        });
      }
      
      // Set session
      req.session.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      };

      res.redirect("/");
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout route
  app.get("/api/logout", (req: any, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  // Get current user route
  app.get("/api/auth/user", (req: any, res) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};