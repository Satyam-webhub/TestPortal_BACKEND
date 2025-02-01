const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

class VideoService {
    // 1️⃣ Add text overlay to a video file
    static async addTextOverlay(inputPath, outputPath, taggedText) {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoFilters(taggedText)
                .output(outputPath)
                .on('end', () => {
                    console.log(" Added Text  Successfully") ,
                    resolve(outputPath)
                })
                .on('error', (err) => reject(err))
                .run();
        });
    }

    // 2️⃣ Convert video file to MP4 format
    static async convertToMP4(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
            .outputOptions([
                "-c:v libx264",
                "-crf 23",
                "-preset fast",
                "-c:a aac",
                "-b:a 128k",
                "-filter:v fps=30,scale=1280:720",
              ])
              .output(outputPath)
                
                .on('end', () => {
                    console.log("Converted Videos To MP4 Successfully") ,
                    resolve(outputPath)
                })
                .on('error', (err) => reject(err))
                .run();
        });
    }

    // 3️⃣ Calculate length of video file
    static async getVideoLength(inputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(inputPath, (err, metadata) => {
                if (err) reject(err);
                else resolve(metadata.format.duration);
            });
        });
    }

    // 4️⃣ Extract audio from video file
    static async extractAudio(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
            .output(outputPath)
            .outputOptions([
              "-q:a 0", // Highest quality audio
              "-map a", // Extract only the audio stream
            ])
                .on('end', () => {
                    console.log("Extracted Audio Successfully") ,
                    resolve(outputPath)
                })
                .on('error', (err) => reject(err))
                .run();
        });
    }

    // 5️⃣ Merge multiple video files
    static async mergeVideos(inputPaths, outputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg()
            .input(inputPaths)
            .inputFormat("concat")
            .output(outputPath)
                 .on('end', () => {
                    console.log("merged videos Successfully") ,
                    resolve(outputPath)})
                .on('error', (err) => reject(err))
                .run();
        });
    }
}

module.exports = VideoService;
