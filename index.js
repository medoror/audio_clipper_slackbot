const {App} = require('@slack/bolt');

require('dotenv').config();

const fs = require('fs');
const ytdl = require('ytdl-core');
const getInfo = require('ytdl-core');
const validateURL = require('ytdl-core');
const request = require('request');

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN
});

app.command('/audio', async ({payload, ack, say}) => {
    ack();
    if (validateURL(payload.text)) {
        let title;
        let audioFilename = 'audio.mp3';
        getInfo(payload.text, (err, info) => {
            if (err) throw err;
            title = info.title;
        });

        ytdl(payload.text, {
            filter: 'audioonly',
            quality: 'highestaudio',

        }).pipe(fs.createWriteStream(audioFilename, {flags: 'a'}));

        request.post({
            url: 'https://slack.com/api/files.upload',
            formData: {
                token: process.env.SLACK_BOT_TOKEN,
                title: payload.text,
                filename: audioFilename,
                filetype: "auto",
                channels: "bot-testing",
                file: fs.createReadStream(audioFilename),
            },
        }, function (err, response) {
            console.log(JSON.parse(response.body));
        });

    } else {
        say('bad youtube url');

    }
});


// Start your app
(async () => {
    await app.start(process.env.PORT || 4000);
    console.log('⚡️ Bolt app is running!');
})();
