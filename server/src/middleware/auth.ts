import JWT from "jsonwebtoken";
import Prisma from "../PrismaInit";
import { Request, Response, NextFunction } from "express";

const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.cookies;

    // If no token is provided, return unauthorized response
    if (!token) {
      res.status(401).send("Unauthorized: Token not provided.");
      return; // Return early to stop further execution
    }

    const decodedObj = JWT.verify(token, process.env.JWT_SECRET || "") as {
      userId: string;
    };

    const { userId } = decodedObj;

    const user = await Prisma.user.findUnique({
      where: { userId },
    });

    // If user is not found, return not found response
    if (!user) {
      res.status(404).send("User not found");
      return; // Return early to stop further execution
    }

    //@ts-ignore
    req.user = user;

    next();
  } catch (error: any) {
    console.error(error);
    // If any other error occurs, return internal server error
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

export { userAuth };
