const fs = require("fs");
const express = require("express");
var cors = require("cors");
var path = require("path");
const ytdl = require("ytdl-core");

const port = process.env.PORT || 5000;
const outputFileDir = (path.join(__dirname, "output")+path.sep);
// Make output dir if needed
if (!fs.existsSync(outputFileDir))
  fs.mkdirSync(outputFileDir);

// Get the audio from a YouTube video function
const getAudio = (videoURL, res) => {
  ytdl.getInfo(videoURL).then((info) => {
  console.log("Downloading:", info.videoDetails.title);
    // Select the video format and quality
    let audioFormats = ytdl.filterFormats(info.formats, (format) => !format.hasVideo && format.audioQuality === 'AUDIO_QUALITY_MEDIUM' && format.container === 'mp4');
    console.log("Selected format " + audioFormats.mimeType);
    if (audioFormats.length === 0) {
      const msg = 'Aucun format audio de qualité satisfaisante trouvé';
      console.error(msg);
      res.send(msg);
      return;
    }
    // Create a write stream to save the video file
    const outputFilePath = outputFileDir + `${info.videoDetails.title}.${audioFormats[0].container}`;
    const outputStream = fs.createWriteStream(outputFilePath);
    // Download the video file
    ytdl.downloadFromInfo(info, { format: audioFormats[0] }).pipe(outputStream);
    // When the download is complete, show a message
    outputStream.on('finish', () => {
      console.log(`Finished downloading: ${outputFilePath}`);
      res.send("'" + info.videoDetails.title + "' téléchargée sur " + outputFilePath)
    });
  }).catch((err) => {
    console.error(err);
  });
};
// Catch signals to close the app from docker
process.on('SIGTERM', ()=>process.exit());
process.on('SIGINT', ()=>process.exit());

// ########################  EXPRESS  ############################
const app = express();
var http = require("http").createServer(app);

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors());

// Url definition
app.get("/", (req, res) => {
  if(req.query.url) {
    getAudio(req.query.url, res);
  } else {
    res.send(fs.readFileSync("./index.html", "utf8"));
  }
});

http.listen(port, () => {
  console.log(`YT-Downloader listening at http://localhost:${port}`);
});