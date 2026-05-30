const {ImageKit} = require('@imagekit/nodejs')

const ImageKitClient= new ImageKit({
    privateKey:"key"
})

const uploadFile=async(file)=>{
    const result = await ImageKitClient.files.upload({
        file,
        fileName:"music_"+Date.now(),
        folder:"yt-complete-backend/music"
    })

    return result;
}

module.exports={uploadFile};