import {VideoInterface} from './videoInterface'
import {checkYoutubeUrlForTimestamp} from './youtubeUtils';
import * as fs from 'fs';

const ytdl = require('ytdl-core');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


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
        let ytdlPromise = () => {
            return new Promise(
                (resolve, reject) => {
                    ffmpeg().input(
                        ytdl(this.link, {
                            filter: function (format) {
                                if (format.container === 'webm' && format.resolution === null) {
                                    return true;
                                }
                            }
                        })
                    ).format('webm')
                        .seekInput(timestamp)
                        .duration(this.duration)
                        .pipe(fs.createWriteStream(this.audioFilename, {flags: 'a'}))
                        .on('finish', () => {
                            resolve();
                        });
                }
            );
        };
        await ytdlPromise().then(() => {
            console.log(`Video Downloaded`)
        }).catch(() => console.log(`Error Downloading Video`));
    }
}



