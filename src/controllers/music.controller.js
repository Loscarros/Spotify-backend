const postModel = require('../models/postsong.model')
const albumModel = require('../models/album.model')

const jwt = require('jsonwebtoken')
const { uploadFile } = require('../services/storage.service')

const createMusic = async (req, res) => {

    const { title } = req.body;
    const file = req.file;
    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await postModel.create({
        uri: result.url,
        title: title,
        artist: req.user.id
    })
    return res.status(201).json({
        message: "Song Uploaded Successfully",
        music
    })



}

const createAlbum = async (req, res) => {

    const { title, musicIds } = req.body;

    const album = await albumModel.create({
        title: title,
        artist: req.user.id,
        music: musicIds
    })

    return res.status(201).json({
        message: "Album created successfully",
        album
    })

}

const getAllMusic = async (req, res) => {
    const musics = await postModel.find().skip(2).limit(20).populate("artist")

    return res.status(200).json({
        message: "Musics fetched successfully",
        musics
    })
}

const getAllAlbum = async (req, res) => {
    const albums = await albumModel.find().select("title artist ").populate("artist")

    return res.status(200).json({
        message: "Albums fetched successfully",
        albums
    })
}

const getAlbumById = async (req, res) => {
    const albumId = req.params.albumId;
    const albums = await albumModel.findById(albumId).select("title artist ").populate("artist")

    return res.status(200).json({
        message: "Albums fetched successfully",
        albums
    })
}

module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbum, getAlbumById };