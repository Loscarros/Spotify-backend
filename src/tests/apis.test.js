const request = require("supertest");
const app = require("../app");

const postModel = require("../models/postsong.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

jest.mock("../models/postsong.model");
jest.mock("../models/album.model");
jest.mock("../services/storage.service");

jest.mock("../middlewares/auth.middlewares", () => ({
    authArtist: (req, res, next) => {
        req.user = {
            id: "artist123",
            role: "artist"
        };
        next();
    },

    authUser: (req, res, next) => {
        req.user = {
            id: "user123",
            role: "user"
        };
        next();
    }
}));

describe("Song Routes", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/song/createmusic", () => {

        it("should create a song", async () => {

            uploadFile.mockResolvedValue({
                url: "https://test.com/song.mp3"
            });

            postModel.create.mockResolvedValue({
                _id: "song1",
                title: "Test Song"
            });

            const res = await request(app)
                .post("/api/song/createmusic")
                .field("title", "Test Song")
                .attach(
                    "music",
                    Buffer.from("dummy-audio"),
                    "song.mp3"
                );

            expect(res.status).toBe(201);
            expect(res.body.message)
                .toBe("Song Uploaded Successfully");
        });

    });

    describe("POST /api/song/createalbum", () => {

        it("should create album", async () => {

            albumModel.create.mockResolvedValue({
                _id: "album1",
                title: "Album 1"
            });

            const res = await request(app)
                .post("/api/song/createalbum")
                .send({
                    title: "Album 1",
                    musicIds: ["1", "2"]
                });

            expect(res.status).toBe(201);
            expect(res.body.message)
                .toBe("Album created successfully");
        });

    });

    describe("GET /api/song", () => {

        it("should fetch all songs", async () => {

            postModel.find.mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        populate: jest.fn().mockResolvedValue([
                            {
                                _id: "song1",
                                title: "Song 1"
                            }
                        ])
                    })
                })
            });

            const res = await request(app)
                .get("/api/song");

            expect(res.status).toBe(200);
        });

    });

    describe("GET /api/song/album", () => {

        it("should fetch all albums", async () => {

            albumModel.find.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue([
                        {
                            _id: "album1",
                            title: "Album 1"
                        }
                    ])
                })
            });

            const res = await request(app)
                .get("/api/song/album");

            expect(res.status).toBe(200);
        });

    });

    describe("GET /api/song/albums/:albumId", () => {

        it("should fetch album by id", async () => {

            albumModel.findById.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue({
                        _id: "album1",
                        title: "Album 1"
                    })
                })
            });

            const res = await request(app)
                .get("/api/song/albums/album1");

            expect(res.status).toBe(200);
        });

    });

});