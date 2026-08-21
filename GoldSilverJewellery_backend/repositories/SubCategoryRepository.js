import BaseRepository from "./BaseRepository.js";
import SubCategory from "../models/subCategory.js";
import Product from "../models/Product.js";

class SubCategoryRepository extends BaseRepository {
  constructor() {
    super(SubCategory);
  }

  /**
   * High-Performance Aggregation:
   * Fetches subcategories and resolves product counts in 1 aggregated batch query.
   */
  async getSubCategoriesWithCounts(filter = {}, sort = { order: 1 }) {
    const subCategories = await this.find(filter, null, { sort, lean: true });
    if (!subCategories || subCategories.length === 0) return [];

    const subCategoryIds = subCategories.map((s) => s._id);

    const productCounts = await Product.aggregate([
      { $match: { subCategoryId: { $in: subCategoryIds } } },
      { $group: { _id: "$subCategoryId", count: { $sum: 1 } } },
    ]);

    const productMap = new Map(productCounts.map((item) => [item._id.toString(), item.count]));

    return subCategories.map((sub) => ({
      ...sub,
      productCount: productMap.get(sub._id.toString()) || 0,
    }));
  }
}

export default new SubCategoryRepository();
