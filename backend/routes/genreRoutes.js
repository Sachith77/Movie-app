import express from "express";
const router = express.Router();

// Controllers
import {
  createGenre,
  updateGenre,
  removeGenre,
  listGenres,
  readGenre,
} from "../controllers/genreController.js";

router.route("/").post(createGenre);
router.route("/:id").put(updateGenre);
router.route("/:id").delete(removeGenre);
router.route("/genres").get(listGenres);
router.route("/:id").get(readGenre);

export default router;
