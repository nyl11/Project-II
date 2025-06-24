const express =require('express')

const {
    createPost,
    getPost,
    getPosts,
    updatePost,
    deletePost,
    votePost,
    getAllPosts
}=require('../controllers/postController')


const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// All posts - no auth required
router.get('/all', getAllPosts)

//protected routes
router.use(requireAuth)

//posts of specific user
router.get('/',getPosts)


//get a single post
router.get('/:id',getPost)

//POST a new single post
router.post('/', createPost)

//DELET a  post
router.delete('/:id',deletePost)

//voteing in post
router.patch('/:id/vote', votePost);

//UPDATE a single post
router.patch('/:id',updatePost)

module.exports = router