const request = require('request');
const fs = require('fs');
const {deleteMp3Files} = require('./fileUtils');

export class Slack {
    channel: string;

    constructor(channel: string) {
        this.channel = channel;
    }

    async uploadToSlack(audioFilename) {
        let requestPromise = () => {
            return new Promise((resolve, reject) => {
                request.post({
                    url: 'https://slack.com/api/files.upload',
                    formData: {
                        token: process.env.SLACK_BOT_TOKEN,
                        filename: audioFilename,
                        filetype: "mp3",
                        channels: this.channel,
                        file: fs.createReadStream(audioFilename, {flags: 'r'}),
                    },
                }, function postRequestCallback (err, response) {
                    console.log(`the error: ${err}`);
                    reject(err);
                    resolve(JSON.parse(response.body));
                });
            });
        };
        await requestPromise().then( response => {
            console.log(`Slack response: ${response}`)}).catch(err => console.log(`Slack Error: ${err}`));

        deleteMp3Files( () => {console.log(`${audioFilename} file deleted`)});
    }
}