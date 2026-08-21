import express from "express";
import {
  getAllCollectionsAdmin, getAllCollections,
  createCollection, updateCollection,
  toggleCollectionVisibility, deleteCollection,
  seedCollectionsAndCategories,
} from "../Controller/collectionController.js"
 
const collectionRouter = express.Router();
 
collectionRouter.get("/admin/all",   getAllCollectionsAdmin);
collectionRouter.get("/",            getAllCollections);
collectionRouter.post("/seed",       seedCollectionsAndCategories);
collectionRouter.post("/",           createCollection);
collectionRouter.put("/:id",         updateCollection);
collectionRouter.patch("/:id/toggle-visibility", toggleCollectionVisibility);
collectionRouter.delete("/:id",      deleteCollection);
 
export default collectionRouter;
 