import {VideoInterface} from './videoInterface'

import {checkYoutubeUrlForTimestamp} from './youtubeUtils';
import {getInfo} from 'ytdl-core'

const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const {clipMp3} = require('./fileUtils');


export class YoutubeVideo implements VideoInterface {
    link: string;
    audioFilename: string;
    duration: number;

    constructor(ytLink: string, audioFilename: string, duration: number) {
        this.link = ytLink;
        this.duration = duration;
        this.audioFilename = audioFilename;

        // getInfo(ytLink, (err, info) => {
        //     if (err) throw err;
        //     this.title = info.title;
        // });
    }

    performDownload(): void {
        let timestamp = checkYoutubeUrlForTimestamp(this.link);

        if (timestamp) {
            this.downloadFromYoutubePartial(this.link, timestamp, this.audioFilename, this.duration)
        } else {
            this.downloadFromYoutubeFull(this.link, this.audioFilename, this.duration);
        }

    }

    async downloadFromYoutubeFull(link: any, audioFilename: any, duration: any) {

        let ytdlPromise = () => {
            return new Promise(
                (resolve, reject) => {
                    ytdl(this.link, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                    }).pipe(fs.createWriteStream(audioFilename, {flags: 'a'}))
                        .on('finish', () => {
                            resolve();
                        });
                }
            );
        };

        await ytdlPromise();
        clipMp3(audioFilename, duration);
    }

    async downloadFromYoutubePartial(link, timestamp, audioFilename, duration) {

        let ytdlPromise = () => {
            return new Promise(
                (resolve, reject) => {
                    ffmpeg().input(
                        ytdl(link, {
                            filter: function (format) {
                                if (format.container === 'webm' && format.resolution === null) {
                                    return format
                                }
                            }
                        })
                    ).format('webm')
                        .seekInput(timestamp)
                        .duration(duration)
                        .pipe(fs.createWriteStream(audioFilename, {flags: 'a'}))
                        .on('finish', () => {
                            resolve();
                        });
                }
            );
        };

        await ytdlPromise();
    }

}



