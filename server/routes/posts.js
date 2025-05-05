const express =require('express')

const {
    createPost,
    getPost,
    getPosts,
    updatePost,
    deletePost
}=require('../controllers/postController')

const router = express.Router()

//get all post
router.get('/',getPosts)

//get a single post
router.get('/:id',getPost)

//POST a new single post
router.post('/', createPost)

//DELET a  post
router.delete('/:id',deletePost)

//UPDATE a single post
router.patch('/:id',updatePost)

module.exports = router