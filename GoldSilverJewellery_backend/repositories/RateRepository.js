import BaseRepository from "./BaseRepository.js";
import Rate from "../models/rateModel.js";

class RateRepository extends BaseRepository {
  constructor() {
    super(Rate);
  }

  async getLatestRate() {
    return await this.findOne({}, null, { sort: { updatedAt: -1 } });
  }
}

export default new RateRepository();
