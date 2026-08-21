import BaseRepository from "./BaseRepository.js";
import Category from "../models/Category.js";
import SubCategory from "../models/subCategory.js";
import Product from "../models/Product.js";

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  /**
   * High-Performance Aggregation:
   * Fetches categories and resolves subcategory & product counts in 2 aggregated batch queries,
   * eliminating N+1 database round-trips.
   */
  async getCategoriesWithCounts(filter = {}, sort = { order: 1 }) {
    const categories = await this.find(filter, null, { sort, lean: true });
    if (!categories || categories.length === 0) return [];

    const categoryIds = categories.map((c) => c._id);

    // Run subcategory & product count aggregations in parallel
    const [subCatCounts, productCounts] = await Promise.all([
      SubCategory.aggregate([
        { $match: { categoryId: { $in: categoryIds } } },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: { categoryId: { $in: categoryIds } } },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      ]),
    ]);

    const subCatMap = new Map(subCatCounts.map((item) => [item._id.toString(), item.count]));
    const productMap = new Map(productCounts.map((item) => [item._id.toString(), item.count]));

    return categories.map((cat) => ({
      ...cat,
      subCategoryCount: subCatMap.get(cat._id.toString()) || 0,
      productCount: productMap.get(cat._id.toString()) || 0,
    }));
  }
}

export default new CategoryRepository();
