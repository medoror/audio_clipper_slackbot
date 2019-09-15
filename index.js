const {App} = require('@slack/bolt');

require('dotenv').config();

const fs = require('fs');
const ytdl = require('ytdl-core');
const getInfo = require('ytdl-core');
const request = require('request');
const shortid = require('shortid');
const MP3Cutter = require('mp3-cutter');

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN
});

const DEFAULT_DURATION = 10;

function validateYouTubeUrl(potentialUrl) {
    if (potentialUrl !== undefined || potentialUrl !== '') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        const match = potentialUrl.match(regExp);
        if (match && match[2].length === 11) {
            return true;
        }
    }
    return false;
}

function generateDuration(duration, defaultDuration) {
    return !duration || isNaN(parseInt(duration)) ? defaultDuration : duration;
}

function generateAudioFileName() {
    return shortid.generate().concat('.mp3');
}

function clipMp3(audioFilename, duration) {
    let newCutFilename = '_'.concat(audioFilename);
    MP3Cutter.cut({
        src: audioFilename,
        target: newCutFilename,
        start: 0,
        end: duration
    });
    return newCutFilename;
}

function uploadToSlack(title, audioFilename) {
    request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: process.env.SLACK_BOT_TOKEN,
            title: title,
            filename: audioFilename,
            filetype: "mp3",
            channels: "bot-testing",  // TODO: should be replaced with channel in the payload
            file: fs.createReadStream(audioFilename, {flags: 'r'}),
        },
    }, function (err, response) {
        console.log(JSON.parse(response.body));
    });
}

function downloadFromYoutube(title, url, audioFilename, duration) {
    ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',

    }).pipe(fs.createWriteStream(audioFilename, {flags: 'a'}))
        .on('finish', () => {
        console.log('wrote all data to file');
        uploadToSlack(title, clipMp3(audioFilename, duration));
    });
}

app.command('/audio', async ({payload, ack, say}) => {
    ack();
    let ytLink = payload.text.split(" ")[0];
    let duration = generateDuration(payload.text.split(" ")[1], DEFAULT_DURATION)

    if (validateYouTubeUrl(ytLink)) {
        let title = '';
        let audioFilename = generateAudioFileName();
        getInfo(ytLink, (err, info) => {
            if (err) throw err;
            title = info.title;
        });
        downloadFromYoutube(title, ytLink, audioFilename, duration);

    } else {
        say("USAGE: /audio [youtube-url] [ duration (DEFAULT_DURATION seconds default) ]")
    }
});


// Start your app
(async () => {
    await app.start(process.env.PORT || 4000);
    console.log('⚡️ Bolt app is running!');
})();
