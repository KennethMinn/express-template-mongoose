import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/createToken";

export class AuthService {
  async registerUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User({ email, password });
      await user.save();

      return res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      //actual response body for user
      const userResponse = {
        id: user.id,
        email: user.email,
      };

      const accessToken = createToken(
        userResponse,
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "15m",
        }
      );

      const refreshToken = createToken(
        userResponse,
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "3d" }
      );

      // Save the refresh token in the database
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ accessToken, user: userResponse });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  async logoutUser(req: Request, res: Response) {
    const cookies = req.cookies;

    if (!cookies?.refresh_token)
      return res.status(401).json({ message: "Unauthenticated" });

    const refreshToken = cookies.refresh_token;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      res.clearCookie("refresh_token", { httpOnly: true });
      return res.status(204).json({ message: "Logout successfully" });
    }

    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("refresh_token", { httpOnly: true });
    return res.status(204).json({ message: "Logout successfully" });
  }

  async handleRefresh(req: Request, res: Response) {
    const cookies = req.cookies;
    const refreshToken = cookies?.refresh_token;

    if (!refreshToken)
      return res.status(401).json({ message: "Unauthenticated" });

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any) => {
      if (err) return res.status(401).json({ message: "Unauthenticated" }); //invalid token
      const accessToken = jwt.sign(
        { userId: foundUser.id },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "20s",
        }
      );

      return res.status(200).json({ accessToken });
    });
  }

  async verifyJwtToken(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.replace("Bearer", "").trim();

    if (!accessToken) {
      //throw new Error("Unauthenticated");
      return res.status(401).json({ message: "Unauthenticated" }); //invalid token
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err) => {
      if (err) {
        return res.status(401).json({ message: "Unauthenticated" }); //invalid token
      } else {
        next();
      }
    });
  }
}
