import BaseRepository from "./BaseRepository.js";
import Collection from "../models/Collection.js";

class CollectionRepository extends BaseRepository {
  constructor() {
    super(Collection);
  }
}

export default new CollectionRepository();
