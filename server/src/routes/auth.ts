import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import Prisma from "../PrismaInit";
import JWT from "jsonwebtoken";
import { userAuth } from "../middleware/auth";

const authRouter = express.Router();

// Sign-up route
authRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if all fields are provided
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are mandatory" });
      }

      const user = await Prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        return res.status(409).json({ message: "User Already Exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new user in the database
      const newUser = await Prisma.user.create({
        data: {
          email,
          password: passwordHash,
          firstName,
          lastName,
        },
      });

      // Prepare data to send back to the client
      const sendData = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userId: newUser.userId,
      };

      // Generate JWT token
      const token = JWT.sign(
        { userId: newUser.userId },
        process.env.JWT_SECRET || "",
        { expiresIn: "1d" }
      );

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(201)
        .json({ message: "User created successfully", user: sendData });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Login route
authRouter.post(
  "/login",

  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await Prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = JWT.sign(
        { userId: user.userId },
        process.env.JWT_SECRET || "",
        { expiresIn: "1d" }
      );

      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        })
        .json({
          message: "Login successful",
          user: {
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

authRouter.get(
  "/profile",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      //@ts-ignores
      const userId = req.user.userId;

      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch user profile from the database
      const user = await Prisma.user.findUnique({
        where: {
          userId: userId, // Using the userId from the decoded token
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user profile
      return res.status(200).json({
        user: {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

authRouter.get("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.status(201).json({ message: "LogOut Successful" });
  } catch (error) {
    res.status(400).send("Error logout the user:" + error);
  }
});

export default authRouter;
