import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import tweetsRoutes from "./routes/tweet.routes";
import seguidoresRoutes from "./routes/seguidor.routes";
import repliesRoutes from "./routes/reply.routes";
import likesRoutes from "./routes/like.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", tweetsRoutes);
app.use("/api", seguidoresRoutes);
app.use("/api", repliesRoutes);
app.use("/api", likesRoutes);
app.use("/api", authRoutes);

app.listen(3000, () => {
  console.log("🚀 Server ready at: http://localhost:3000");
});
