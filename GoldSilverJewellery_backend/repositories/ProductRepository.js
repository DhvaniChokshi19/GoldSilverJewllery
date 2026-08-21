import BaseRepository from "./BaseRepository.js";
import Product from "../models/Product.js";

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async getFilteredProducts(filter = {}, populateOptions = ["collectionId", "categoryId"]) {
    return await this.find(filter, null, {
      populate: populateOptions,
      sort: { createdAt: -1 },
      lean: true,
    });
  }
}

export default new ProductRepository();
