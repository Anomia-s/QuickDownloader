// FIXME: Fix songs not downloading the folder.
// TODO: Add quality selection
// TODO: Add folder selection
// TODO: Add list downloading
// TODO: Better code lol


const fs = require("fs");
const ytdl = require("ytdl-core");
const progress = require("progress-stream");
const path = require("path");
const { nanoid } = require("nanoid");

const downloadProgressElement = document.querySelector("#downloadProgress");
const downloadProgressElementTwo = document.querySelector("#downloadProgressTwo");

const finishElement = document.querySelector("#done");
const errorElement = document.querySelector("#error");
const videoName = document.querySelector("#videoFilename");

const openVideosFolder = () => {
  const { shell } = require('electron');
  shell.openPath(path.join(__dirname + '\\..\\downloads'));
}

const downloadVideo = async () => {
  const videoURL = document.querySelector("#url").value;
  const videoFileName = document.querySelector("#fileName").value;

  if (!videoURL) {
    errorElement.textContent = "No Video URL!";
  }

  if (!fs.existsSync('./downloads'))
    fs.mkdirSync('./downloads');

  const fileName = videoFileName ? videoFileName : nanoid(20);
  videoName.textContent = fileName;

  const data = await ytdl.getBasicInfo(videoURL);
  const progressDownload = progress({
    length: parseInt(data.formats[0].contentLength),
  });

  progressDownload.on("progress", function (progress) {
    console.log(progress);
    downloadProgressElementTwo.textContent = `${progress.percentage}%`;
    downloadProgressElement.style.width = `${progress.percentage}%`;
  });
  ytdl(videoURL, {quality: 'highest'})
    .pipe(progressDownload)
    .pipe(
      fs.createWriteStream(path.join(__dirname + `\\..\\downloads\\${fileName}.mp4`))
        .on("finish", () => {
          finishElement.textContent = `${__dirname}/${fileName}.mp4 downloaded!`;
          downloadProgressElementTwo.textContent = "0%";
          downloadProgressElement.style.width = "0%";
        })
        .on('error', (err) => {
          errorElement.textContent = err.message
        })
    );

};
