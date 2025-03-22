const { postBook, allPostBook, postDelete } = require('../controller/booksController');
const protectRoute = require('../middleware/auth.middleware');
const bookModel = require('../model/bookModel');

const router = require('express').Router();

router.post('/post-book', protectRoute, postBook);

router.get('/allPostBook', protectRoute, allPostBook);

router.get('/user', protectRoute, async(req, res)=>{
    try {
        const books = await bookModel.findById({user: req.user._id}).sort({createdAt: -1});
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
 
});

router.delete('post-delete/:id', protectRoute, postDelete);





module.exports = router;