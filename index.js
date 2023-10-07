import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path from 'path';
import ytdl from 'ytdl-core';
import {init as initGpt,askFileName} from 'interface-gpt';
import dotenv from 'dotenv';
import {createServer} from "http";
dotenv.config();

const port = process.env.PORT || 5000;
const outputFileDir = (process.env.TARGET_DIRECTORY??"./output")+path.sep;

if(process.env.OPENAI_API_KEY)
  initGpt(process.env.OPENAI_API_KEY);

// Make output dir if needed
if (!fs.existsSync(outputFileDir))
  fs.mkdirSync(outputFileDir);

// Catch signals to close the app from docker
process.on('SIGTERM', ()=>process.exit());
process.on('SIGINT', ()=>process.exit());

// ########################  EXPRESS  ############################
const app = express();
var http = createServer(app);

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors());

// Url definition
app.get("/", async (req, res) => {
  // List already downloaded files
  let dirfilesString = "";
  const files = fs.readdirSync(outputFileDir)
  files.forEach((file) => {
    dirfilesString += "<li>"+removeFileExtension(file)+"</li>";
  })

  if(req.query.url) {
     ytdl.getInfo(req.query.url).then(async (info) => {
      console.log("Downloading:", info.videoDetails.title);
        // Select the video format and quality
        let audioFormats = ytdl.filterFormats(info.formats, (format) => !format.hasVideo && format.audioQuality === 'AUDIO_QUALITY_MEDIUM' && format.container === 'mp4');
        if (audioFormats.length === 0) {
          const msg = 'Aucun format audio de qualité satisfaisante trouvé';
          console.error(msg);
          res.send(msg);
          return;
        }

        // Ask for filename to GPT-3
        let gptCallPromise = null;
        if(process.env.OPENAI_API_KEY){
          console.log("Asking for filename to GPT-3");
          gptCallPromise = askFileName(info.videoDetails.title);
        }
          
        // Create a write stream to save the video file
        let filename = info.videoDetails.title + "." + audioFormats[0].container;
        const outputFilePath = outputFileDir + filename;
        const outputStream = fs.createWriteStream(outputFilePath);
        // Download the video file
        ytdl.downloadFromInfo(info, { format: audioFormats[0] }).pipe(outputStream);
        // When the download is complete, show a message
        outputStream.on('finish', async () => {
          // rename file
          if(gptCallPromise) {
            filename = await gptCallPromise + "." + audioFormats[0].container;
            console.log("Renaming file to " + filename);
            fs.renameSync(outputFilePath, outputFileDir + filename);
          }
          console.log(`Finished downloading: ${outputFilePath}`);
          const body = "<ul><li><b>=> "+removeFileExtension(filename)+"</b></li>"+dirfilesString+"</ul>";
          res.send(fs.readFileSync("./index.html", "utf8").replace("<p id=\"result\"></p>", "<p id=\"result\">" + body + "</p>"));
        });
      }).catch((err) => {
        console.error(err);
      });
  } else {
    const body = "<ul>"+dirfilesString+"</ul>";
    res.send(fs.readFileSync("./index.html", "utf8").replace("<p id=\"result\"></p>", "<p id=\"result\">" + body + "</p>"));
  }
});

http.listen(port, () => {
  console.log(`YT-Downloader listening at http://localhost:${port}`);
});

function removeFileExtension(filename){
  return filename.split('.').slice(0, -1).join('.');
}