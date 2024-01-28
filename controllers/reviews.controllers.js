import ReviewsModel from "../models/reviews.model";

export const addReview = (req, res) => {
  try {
    const { message, rating } = req.body;
    const saveReview = new ReviewsModel({
      message,
      rating,
    });
    saveReview.save();
    if (saveReview) {
      return res.status(201).json({
        data: saveReview,
        message: "Review has been added Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getReviews = async (req, res) => {
  try {
    const reviews = await ReviewsModel.find({ status: 1 });
    if (reviews) {
      return res.status(200).json({
        data: reviews,
        total: reviews.length,
        message: "SuccessFully Fetched",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getReview = async (req, res) => {
  const reviewID = req.params.review_id;
  try {
    const review = await ReviewsModel.findOne({
      status: 1,
      _id: reviewID,
    });
    if (review) {
      return res.status(200).json({
        data: review,
        message: "Data has been Successfully Fetched",
        filepath: `${process.env.BASE_URL}/uploads`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateReview = async (req, res) => {
  try {
    const { message, rating } = req.body;
    const reviewID = req.params.review_id;
    const updatedReview = await ReviewsModel.updateOne(
      { _id: reviewID },
      {
        $set: {
          message,
          rating,
        },
      }
    );
    if (updatedReview.matchedCount) {
      return res.status(200).json({
        message: "Item has been Successfully Updated..!.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const reviewID = req.params.review_id;
    const deletedReview = await ReviewsModel.updateOne(
      { _id: reviewID },
      {
        $set: {
          status: 0,
        },
      }
    );
    if (deletedReview.acknowledged) {
      return res.status(200).json({
        message: "Item has been Successfully Deleted..!",
      });
    }
  } catch (error) {
    return res.status(500).jason({
      message: error.message,
    });
  }
};
export const removeReview = async (req, res) => {
  try {
    const reviewID = req.params.review_id;

    const deletedReview = await ReviewsModel.deleteOne({
      _id: reviewID,
    });

    if (deletedReview.acknowledged) {
      return res.status(200).json({
        message: "Item has been Successfully Deleted..!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
