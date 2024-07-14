"use strict";

export class ApiFeatures {
  constructor(mongooseQuery, searchQuery, searchParams) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
    this.searchParams = searchParams;
  }

  pagination() {
    let pageNumber = Math.abs(this.searchQuery.page) * 1 || 1;
    let pageLimit = 8;
    let skip = (pageNumber - 1) * pageLimit;
    this.pageNumber = pageNumber
    this.mongooseQuery.skip(skip).limit(pageLimit);
    return this;
  }
  filter() {
    let filter = { ...this.searchQuery };
    let excludedFields = ["page", "sort", "fields", "keyword"];
    excludedFields.forEach((val) => delete filter[val]);
    filter = JSON.stringify(filter);
    filter = filter.replace(/(gt|gte|lt|lte)/g, (match) => "$" + match);
    filter = JSON.parse(filter);
    this.mongooseQuery.find(filter)
    return this;
  }
  sort() {
    if (this.searchQuery.sort) {
      let sortBy = this.searchQuery.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }
  fields() {
    if (this.searchQuery.fields) {
      let fields = this.searchQuery.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
  search() {
    if (this.searchQuery.keyword) {
      const { keyword } = this.searchQuery;
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: keyword }, },
          { title: { $regex: keyword }, },
          { description: { $regex: keyword } }
        ]
      });
    }
    return this;
  }
}