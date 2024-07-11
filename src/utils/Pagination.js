const _ = require("lodash");

class Pagination {
  constructor(model, query) {
    const { page, limit, sort, fields = "", search, ...filter } = query;

    this.model = model;
    this.page = +page || 1;
    this.limit = +limit || 10;
    this.sorting = sort;
    this.fields = fields;
    this.filtering = filter;
    this.searching = search;

    this.result = model.find();
    this.count = model.countDocuments();
  }

  paginate = () => {
    const { page, limit } = this;
    const skip = (page - 1) * limit;

    this.result = this.result.skip(skip).limit(limit);

    return this;
  };

  sort = () => {
    const { sorting } = this;

    if (sorting) {
      this.result = this.result.sort(sorting.split(",").join(" "));
    }

    return this;
  };

  select = () => {
    const { fields } = this;

    if (fields) {
      this.result = this.result.select(fields.split(",").join(" "));
    }

    return this;
  };

  #createSearchQuery = (searching, searchAbleFields) => {
    const tokens = searching
      .split(" ")
      .map((token) => token.trim())
      .filter(Boolean);
    const regex = new RegExp(tokens.join("|"), "i");

    let filteredSearchAbleFields = searchAbleFields;

    const { fields } = this;

    if (fields.length) {
      filteredSearchAbleFields = _.intersection(
        fields.split(","),
        searchAbleFields
      );
    }

    return {
      $or: filteredSearchAbleFields.map((key) => ({
        [key]: { $regex: regex },
      })),
    };
  };

  search = (searchAbleFields = []) => {
    const { searching } = this;

    if (searching && searchAbleFields.length) {
      const searchQuery = this.#createSearchQuery(searching, searchAbleFields);

      this.result = this.result.find(searchQuery);
      this.count = this.count.countDocuments(searchQuery);
    }

    return this;
  };

  #replaceMongooseOperators = (query) => {
    return query.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  };

  filter = () => {
    const { filtering } = this;
    let filterQuery = JSON.stringify(filtering);
    filterQuery = this.#replaceMongooseOperators(filterQuery);
    filterQuery = JSON.parse(filterQuery);

    this.result = this.result.find(filterQuery);
    this.count = this.count.countDocuments(filterQuery);

    return this;
  };

  run = () => {
    return [this.result, this.count];
  };
}

module.exports = Pagination;
