const Book = require("../model/bookModel.js");
const cloudinary = require("../lib/cloudinary.js");
const { Cursor } = require("mongoose");

const postBook = async (req, res) => {
  const { title, caption, rating, bookImage, description } = req.body;

  try {
    if (!image || !title || !caption || !rating || !bookImage || !description) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const uploadRespose = await cloudinary.v2.uploader.upload(bookImage);

    const imageUrl = uploadRespose.secure_url;

    const newBook = new Book.create({
      title,
      caption,
      rating,
      bookImage: imageUrl,
      description,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Book posted successfully",
      book: newBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const allPostBook = async () => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const allBooks = await Book.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      allBooks,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const postDelete = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (book.bookImage && book.bookImage.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Failed to delete image from cloudinary" });
      }
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = { postBook, allPostBook, postDelete };
