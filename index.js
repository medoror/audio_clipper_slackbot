const {App} = require('@slack/bolt');

require('dotenv').config();

const fs = require('fs');
const ytdl = require('ytdl-core');
const getInfo = require('ytdl-core');
const request = require('request');
const shortid = require('shortid');
const rimraf = require('rimraf');

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN
});

const DEFAULT_DURATION = 10;
const FRAME_FOR_128_KBPS_BYTES = 417;
const FRAME_FOR_192_KBPS_BYTES = 626;
const FRAME_CONSTANT_LENGTH_TIME = 0.026;

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

function clipMp3(title, audioFilename, duration, channel) {
    let frames = duration / FRAME_CONSTANT_LENGTH_TIME;
    const truncatedSizeBytes = Math.round(((FRAME_FOR_128_KBPS_BYTES * frames) / 1024) * 1000);
    const fd = fs.openSync(audioFilename, 'r+');
    fs.ftruncate(fd, truncatedSizeBytes, (err) => {
        if(!err){
            console.log('...truncated file');
            uploadToSlack(title, audioFilename, channel);
        }else{
            console.error('error truncating file: '+audioFilename);
        }

    });
}

function deleteMp3Files() {
    rimraf('./*.mp3', function () {
        console.log('...deleting all mp3s');
    });
}

function uploadToSlack(title, audioFilename, channel) {
    request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: process.env.SLACK_BOT_TOKEN,
            title: title,
            filename: audioFilename,
            filetype: "mp3",
            channels: channel,
            file: fs.createReadStream(audioFilename, {flags: 'r'}),
        },
    }, function (err, response) {
        console.log(JSON.parse(response.body));
        deleteMp3Files();
    });
}

function downloadFromYoutube(title, url, audioFilename, duration, channel) {
    ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',

    }).pipe(fs.createWriteStream(audioFilename, {flags: 'a'}))
        .on('finish', () => {
        console.log('...wrote all data to file');

        clipMp3(title, audioFilename, duration, channel);
    });
}

app.command('/audio', async ({payload, ack, say}) => {
    ack();
    let ytLink = payload.text.split(" ")[0];
    let duration = generateDuration(payload.text.split(" ")[1], DEFAULT_DURATION);

    if (validateYouTubeUrl(ytLink)) {
        let title = '';
        let channel = '';
        let audioFilename = generateAudioFileName();
        getInfo(ytLink, (err, info) => {
            if (err) throw err;
            title = info.title;
            channel = payload.channel_name;
        });
        downloadFromYoutube(title, ytLink, audioFilename, duration, channel);
    } else {
        say("USAGE: /audio [youtube-url] [ duration (10 seconds default) ]")
    }
});


// Start your app
(async () => {
    await app.start(process.env.PORT || 4000);
    console.log('⚡️ Bolt app is running!');
})();
