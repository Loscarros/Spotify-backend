const express=require('express')
const postController=require('../controllers/music.controller')
const authMiddleware=require('../middlewares/auth.middlewares')
const multer=require('multer');

const upload=multer({
    storage:multer.memoryStorage()
})

const router=express.Router()

router.post("/createmusic",authMiddleware.authArtist,upload.single("music"),postController.createMusic)
router.post("/createalbum",authMiddleware.authArtist,postController.createAlbum)
router.get("/",authMiddleware.authUser,postController.getAllMusic)
router.get("/album",authMiddleware.authUser,postController.getAllAlbum)
router.get("/albums/:albumId",authMiddleware.authUser,postController.getAlbumById)


module.exports=router;