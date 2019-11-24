import {VideoInterface} from './videoInterface'
import {checkYoutubeUrlForTimestamp} from './youtubeUtils';
import * as fs from 'fs';
import {clipMp3} from "./fileUtils";

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
            await this.downloadFromYoutubePartial(timestamp)
        } else {
            await this.downloadFromYoutubeFull();
        }

    }

    async downloadFromYoutubeFull() {
        let ytdlPromise = () => {
            return new Promise(
                (resolve, reject) => {
                    ytdl(this.link, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                    }).pipe(fs.createWriteStream(this.audioFilename, {flags: 'a'}))
                        .on('finish', () => {
                            resolve();
                        });
                }
            );
        };

        await ytdlPromise().then(() => {
            console.log(`Video Downloaded`)
        }).catch(() => console.log(`Error Downloading Video`));
        clipMp3(this.audioFilename, this.duration);
    }

    async downloadFromYoutubePartial(timestamp) {
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



