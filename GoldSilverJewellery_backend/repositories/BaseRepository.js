/**
 * Generic BaseRepository class encapsulating common Mongoose database operations.
 */
export default class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error("BaseRepository requires a Mongoose model");
    }
    this.model = model;
  }

  /**
   * Find documents matching filter with optional sorting, population, pagination, and projection.
   */
  async find(filter = {}, projection = null, options = {}) {
    let query = this.model.find(filter, projection);
    if (options.sort) query = query.sort(options.sort);
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach((p) => {
          query = query.populate(p);
        });
      } else {
        query = query.populate(options.populate);
      }
    }
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.lean) query = query.lean();

    return await query.exec();
  }

  /**
   * Find a single document matching filter.
   */
  async findOne(filter = {}, projection = null, options = {}) {
    let query = this.model.findOne(filter, projection);
    if (options.sort) query = query.sort(options.sort);
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach((p) => {
          query = query.populate(p);
        });
      } else {
        query = query.populate(options.populate);
      }
    }
    if (options.lean) query = query.lean();

    return await query.exec();
  }

  /**
   * Find document by ID.
   */
  async findById(id, projection = null, options = {}) {
    let query = this.model.findById(id, projection);
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach((p) => {
          query = query.populate(p);
        });
      } else {
        query = query.populate(options.populate);
      }
    }
    if (options.lean) query = query.lean();

    return await query.exec();
  }

  /**
   * Create a new document.
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Find document by ID and update.
   */
  async findByIdAndUpdate(id, data, options = { new: true, runValidators: true }) {
    return await this.model.findByIdAndUpdate(id, data, options).exec();
  }

  /**
   * Count documents matching filter.
   */
  async countDocuments(filter = {}) {
    return await this.model.countDocuments(filter).exec();
  }

  /**
   * Execute an aggregation pipeline.
   */
  async aggregate(pipeline = []) {
    return await this.model.aggregate(pipeline).exec();
  }

  /**
   * Delete one document matching filter.
   */
  async deleteOne(filter) {
    return await this.model.deleteOne(filter).exec();
  }

  /**
   * Delete multiple documents matching filter.
   */
  async deleteMany(filter) {
    return await this.model.deleteMany(filter).exec();
  }
}
