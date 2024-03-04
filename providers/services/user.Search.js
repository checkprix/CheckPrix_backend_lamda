class UserSearch {
  constructor(req, res) {
    this.USER_MODEL = require("../../models/user.Search.Model");
    this.REQUEST = req;
    this.RESPONSE = res;
    this.BODY = req.body;
  }

  //update user search
  async updateUserSearch() {
    try {
      const search_word = this.REQUEST.query.search;

      // Use the updateOne method with upsert option
      await this.USER_MODEL.updateOne(
        { search_terms: search_word },
        {
          $inc: { total_search: 1 }, // Increment total_search by 1
          $setOnInsert: { search_terms: search_word, total_search: 1 }, // Set if document is inserted (upsert)
        },
        { upsert: true } // Set upsert option to true
      );

     return this.RESPONSE.status(200).json({
        is_success: true,
        message: "Search term updated Updated !!",
      });

      // Optionally, you can handle success or additional logic here
    } catch (error) {
      // Handle errors here, you can log the error or perform other actions
      console.error("Error in updateUserSearch: in user search class", error);

      return this.RESPONSE.status(500).json({
        is_success: false,
        message: "Internal server error!!",
      });
    }
  }
}
