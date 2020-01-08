import * as fs from "fs";
const FormData = require('form-data');
const fetch = require('node-fetch');


export class Slack {

    channel: string;
    formData: FormData = undefined;

    constructor(channel: string) {
        this.channel = channel;
    }

    async uploadToSlack(audioFilename) {

        if (this.formData === undefined) {
            const form = new FormData();
            form.append('file', fs.createReadStream(audioFilename, {flags: 'r'}));
            form.append('token', process.env.SLACK_BOT_TOKEN);
            form.append('channels', this.channel);
            form.append('filetype', "mp3");
            form.append('filename', audioFilename);
            this.formData = form;
        }

        try {
            const result = await fetch('https://slack.com/api/files.upload', {method: 'POST', body: this.formData});
            const json = await result.json();
            console.log(json)

        } catch (err) {
            console.log(`Slack Error: ${err}`)
        }
    }

    setFormData(formData: FormData) {
        this.formData = formData;
    }


    getFormData(): FormData {
        return this.formData;
    }
}