class Search {
  constructor(req, res) {
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
    this.PRODUCT_MODEL = require("../../models/products.Model");
    this.AGGREGATION = require("../aggeration/aggration");
  }

  //get request handler
  async SearchProductForUser() {
    try {
      //get query parameter
      const query = this.REQUEST.query.query;
      console.log(query)
     const regexPattern = query.split(/\s+/).map(word => `(?=.*${word})`).join("");
      console.log(regexPattern)
      //create object of AGGREGATION class and call CreateAggregationForUserSearch() method
      //which return aggeration for user search
      const userSearchAggregation =
        await new this.AGGREGATION().CreateAggregationForUserSearch(regexPattern);

      //perform aggregation for user search
      const search_data = await this.PRODUCT_MODEL.aggregate(userSearchAggregation);

      //return response
      return this.RESPONSE.status(200).json({
        is_sucess: true,
        products: search_data,
      });
    } catch (err) {
      console.log("err in SearchProductForUser method in Search class", err);
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }

  async similarProducts() {
    try {
      //get query parameter
      const query = this.REQUEST.query.query;
      console.log(query)
     const regexPattern = query.split(/\s+/).map(word => `(?=.*${word})`).join("");
      console.log(regexPattern)
      //create object of AGGREGATION class and call CreateAggregationForUserSearch() method
      //which return aggeration for user search
      const userSearchAggregation =
         new this.AGGREGATION().CreateAggregationForSimilarProducts(regexPattern);

      //perform aggregation for user search
      const search_data = await this.PRODUCT_MODEL.aggregate(userSearchAggregation);

      //return response
      return this.RESPONSE.status(200).json({
        is_sucess: true,
        products: search_data,
      });
    } catch (err) {
      console.log("err in SearchProductForUser method in Search class", err);
      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }
}

module.exports = Search;
