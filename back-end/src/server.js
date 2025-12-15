import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favouritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 8001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
  });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recepeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recepeId || !title || !image || !cookTime || !servings) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    const result = await db
      .insert(favouritesTable)
      .values({
        userId,
        recepeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.log("Error adding favourites ", error);
    res.status(500).json({
      status: "error",
      message: "Error adding favourites",
    });
  }
});

app.delete("/api/farvorites/:userId/:recepeId", async (req, res) => {
  try {
    const { userId, recepeId } = req.params;

    await db
      .delete(favouritesTable)
      .where(
        and(
          eq(favouritesTable.userId, userId),
          eq(favouritesTable.recepeId, parseInt(recepeId))
        )
      );

    res.status(200).json({
      status: "success",
      message: "Favorite removed successfully",
    });
  } catch (error) {
    console.log("Error adding favourites ", error);
    res.status(500).json({
      status: "error",
      message: "Error removeing a favourites",
    });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db
      .select()
      .from(favouritesTable)
      .where(eq(favouritesTable.userId, userId))
      .then((result) => {
        res.status(200).json({
          status: "success",
          data: result,
        });
      });

  } catch (error) {
    console.log("Error adding favourites ", error);
    res.status(500).json({
      status: "error",
      message: "Error get all favourites",
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
