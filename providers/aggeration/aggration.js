module.exports = class Aggregation {
  constructor() {}

   CreateAggregationForUserSearch(query) {
    return [
      {
        $addFields: {
          detailsArray: { $objectToArray: "$details" }, // Convert 'details' object to array of key-value pairs
        },
      },
      {
        $addFields: {
          concatenatedFields: {
            $reduce: {
              input: "$detailsArray",
              initialValue: "",
              in: {
                $concat: ["$$value", "$$this.v", " "], // Concatenate the values of all fields
              },
            },
          },
        },
      },
      {
        $match: {
          concatenatedFields: { $regex: query, $options: "i" },
        },
      },
      {
        $project: {
          id: 1,
          "details.product_name": 1,
          "details.manufacturer": 1,
          store_link: 1,
          image: [{ link: { $arrayElemAt: ["$image.link", 0] } }],
          old_price: 1,
          new_price: 1,
        },
      },
    ];
  }

  CreateAggregationForSimilarProducts(query) {
    return [
      {
        $sort:{id:-1}
      },
      {
        $limit:5
      }
      
      ,
      {
        $addFields: {
          detailsArray: { $objectToArray: "$details" }, // Convert 'details' object to array of key-value pairs
        },
      },
      {
        $addFields: {
          concatenatedFields: {
            $reduce: {
              input: "$detailsArray",
              initialValue: "",
              in: {
                $concat: ["$$value", "$$this.v", " "], // Concatenate the values of all fields
              },
            },
          },
        },
      },
      {
        $match: {
          concatenatedFields: { $regex: query, $options: "i" },
        },
      },
      {
        $project: {
          id: 1,
          "details.product_name": 1,
          "details.manufacturer": 1,
          store_link: 1,
          image: [{ link: { $arrayElemAt: ["$image.link", 0] } }],
          old_price: 1,
          new_price: 1,
        },
      },
    ];
  }

  priceDropAggregation(skip, pageSize) {
    return [
      {
        $sort:{"item_id":-1}
      },
     
      { $skip: skip },
      { $limit: pageSize },
      {
        $lookup: {
          from: "products",
          localField: "item_id",
          foreignField: "id",
          as: "price_drop",
        },
      },
    
      {
        $unwind: "$price_drop", // Unwind the array created by the $lookup
      },

      {
        $project: {
          _id: 0,
          id: "$price_drop.id",
          product_name: "$price_drop.details.product_name",
          manufacturer: "$price_drop.details.manufacturer",
          new_price: "$price_drop.new_price",
          old_price: "$price_drop.old_price",
          store_link: "$price_drop.store_link",
          image: { $arrayElemAt: ["$price_drop.image.link", 0] },
        },
      },
    ];
  }

  favrouiteAggregation(user_id) {
    return [
      {
        $match: {
          user_id: user_id, // Match based on user_id
        },
      },
      {
        $unwind: "$favrouite", // Unwind the favrouite array
      },
      {
        $replaceRoot: { newRoot: "$favrouite" }, // Replace the root document with the favrouite array elements
      },
      {
        $lookup: {
          from: "products",
          localField: "item_id", // Match the item_id from favrouite array
          foreignField: "id",
          as: "favrouite_products",
        },
      },
      {
        $project: {
          id: {
            $arrayElemAt: ["$favrouite_products.id", 0],
          },
          product_name: {
            $arrayElemAt: ["$favrouite_products.details.product_name", 0],
          },
          new_price: {
            $arrayElemAt: ["$favrouite_products.new_price", 0],
          },
          old_price: {
            $arrayElemAt: ["$favrouite_products.old_price", 0],
          },
          store_link: {
            $arrayElemAt: ["$favrouite_products.store_link", 0],
          },
          manufacturer: {
            $arrayElemAt: ["$favrouite_products.details.manufacturer", 0],
          },
          image: { $arrayElemAt: ["$favrouite_products.image.link", 0] },
        },
      },
    ];
  }

  AggregationForProductPage(id) {
    return [
      {
        $match: {
          id: id, // Match documents based on the product ID
        },
      },
      {
        $unwind: "$store", // Unwind the store array
      },
      {
        $lookup: {
          from: "stores", // Name of the stores collection
          localField: "store.id", // Field in the products collection
          foreignField: "id", // Field in the stores collection
          as: "store_info", // Alias for the joined data
        },
      },
      {
        $unwind: "$store_info", // Unwind the array created by the lookup
      },
      {
        $addFields: {
          "store_info.price": "$store.price", // Add price field from the store array into the store_info object
          "store_info.logo": { $arrayElemAt: ["$store_info.image.link", 0] },
          "store_info.store_link": "$store.link",
        },
      },
      {
        $group: {
          _id: "$id",
          id: { $first: "$id" },
          old_price: { $first: "$old_price" },
          new_price: { $first: "$new_price" },
          store_link: { $first: "$store_link" },
          details: { $first: "$details" },
          store_info: { $push: "$store_info" }, // Push all store_info into an array
          image: { $first: "$image" }, // You might want to adjust this based on your data structure
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          old_price: 1,
          new_price: 1,
          store_link: 1,
          details: 1, // Include any other fields you want from the products collection
          store_info: {
            id: 1,
            name: 1,
            price: 1,
            logo: 1,
            store_link: 1,
          },

          image: [{ $arrayElemAt: ["$image.link", 0] }],
        },
      },
    ];
  }

  AggregationForPerPageProduct(skip, pageSize) {
    return [
      {
        $sort:{"id":-1}
      },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          _id: 1,
          id: 1,
          "details.manufacturer": 1,
          "details.product_name": 1,
          old_price: 1,
          new_price: 1,
          store_link: 1,
          created_at: 1,
          __v: 1,
          image: { link: 1 }, // Only keep the "link" field in the "image" array
        },
      },
    ];
  }

  AggregationForPerPageProductForAdmin(skip, pageSize) {
    return [
      {
        $sort:{"id":-1}
      },
      { $skip: skip },
      { $limit: pageSize },

      {
        $lookup: {
          from: "price_drops",
          localField: "id",
          foreignField: "item_id",
          as: "price_drop",
        },
      },
      {
        $addFields: {
          has_price_drop: {
            $cond: {
              if: { $eq: [{ $size: "$price_drop" }, 0] },
              then: false, // if there's no matching price drop
              else: true, // if there's a matching price drop
            },
          },
        },
      },
      {
        $project: {
          id: 1,
          created_at: 1,
          "details.model": 1,
          "details.product_name": 1,
          image: 1,
          has_price_drop: 1,
        },
      },
    ];
  }

  AggregationForPerPageBlog(skip, pageSize) {
    return [
      {
        $sort:{"id":-1}
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
      {
        $project: {
          id: 1,
          title: 1,
          image: { $arrayElemAt: ["$image.link", 0] },
        },
      },
    ];
  }

  AggregationForPerPageBlogForAdmin(skip, pageSize) {
    return [
      {
        $sort:{"id":-1}
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
      {
        $project: {
          id: 1,
          title: 1,
          description: 1,
          created_at: 1,
          detail: 1,
          image: 1,
        },
      },
    ];
  }
};
