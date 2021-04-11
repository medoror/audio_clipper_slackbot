import {VideoInterface} from './videoInterface'
import {checkYoutubeUrlForTimestamp} from './youtubeUtils';

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
// TODO: enable the installer path via a flag
//const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
//ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfmpegPath('/opt/ffmpeg/ffmpeg');


export class YoutubeVideo implements VideoInterface {
    link: string;
    audioFilename: string;
    duration: number;

    constructor(ytLink: string, audioFilename: string, duration: number) {
        this.link = ytLink;
        this.duration = duration;
        this.audioFilename = audioFilename;
    }

    async performDownload(): Promise<void> {
        let timestamp = checkYoutubeUrlForTimestamp(this.link);

        if (timestamp) {
            await this.downloadFromYoutube(timestamp)
        } else {
            await this.downloadFromYoutube(0)
        }

    }

    private async downloadFromYoutube(timestamp) {
        let start = Date.now();
        let ytdlPromise = () => {
            return new Promise(
                (resolve, reject) => {
                    ffmpeg().input(ytdl(this.link, {filter: YoutubeVideo.filterForAppropriateCodecs()}))
                        .format('mp3')
                        .seekInput(timestamp)
                        .duration(this.duration)
                        .save(this.audioFilename)
                        .on('progress', p => {
                            process.stdout.write(`${p.targetSize}kb downloaded\n`);
                        })
                        .on('end', () => {
                            console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
                            resolve();
                        });
                }
            );
        };
        await ytdlPromise().then(() => {
            console.log(`Video Downloaded`)
        }).catch(() => console.log(`Error Downloading Video`));
    }

    private static filterForAppropriateCodecs() {
        return format => format.container === 'webm' && format.audioBitrate;
    }
}