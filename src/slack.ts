const fetch = require('node-fetch');
const FormData = require('form-data');

import * as fs from 'fs';

export class Slack {

    channel: string;

    constructor(channel: string) {
        this.channel = channel;
    }

    uploadToSlack(audioFilename) {
        const form = new FormData();

        form.append('file', fs.createReadStream(audioFilename, {flags: 'r'}));
        form.append('token', process.env.SLACK_BOT_TOKEN);
        form.append('channels', this.channel);
        form.append('filetype', "mp3");
        form.append('filename', audioFilename);

        fetch('https://slack.com/api/files.upload', {method: 'POST', body: form})
            .then(res => res.json())
            .then(json => {
                console.log(json)
            })
            .catch(err => console.log(`Slack Error: ${err}`));
    }
}