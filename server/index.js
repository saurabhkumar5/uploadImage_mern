const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/image')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Importing schema


const ImageDetailsScehma = new mongoose.Schema(
    {
     image:String
    },
    {
      collection: "ImageDetails",
    }
  );
  
 const Images = mongoose.model("ImageDetails", ImageDetailsScehma);

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../src/images/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });
// const upload = multer({ dest: "uploads/" });


// Upload image route
app.post("/upload-image", upload.single("image"), async (req, res) => {
    console.log(req.body);
    res.send("uploaded")
    const imageName = req.file.filename;

    try {
        await Images.create({ image: imageName });
        res.json({ status: "ok" });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get image route
app.get("/get-image", async (req, res) => {
    try {
        const data = await Images.find({});
        res.json({ status: "ok", data: data });
    } catch (error) {
        console.error("Error retrieving images:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Default route
app.get("/", (req, res) => {
    res.send("Success!!!!!!");
});

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
