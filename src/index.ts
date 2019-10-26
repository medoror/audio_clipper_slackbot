require('dotenv').config();
const Slack = require('./slack');
const {validateYouTubeUrl} = require('./youtubeUtils');
const {App} = require('@slack/bolt');
const shortid = require('shortid');
const {YoutubeVideo} = require('./youtubeVideo');

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN
});

const DEFAULT_DURATION = 10;

function generateDuration(duration, defaultDuration) {
    return !duration || isNaN(parseInt(duration)) ? defaultDuration : duration;
}

function generateAudioFileName() {
    return shortid.generate().concat('.mp3');
}

app.command('/audio', async ({payload, ack, say}) => {
    ack();
    let link = payload.text.split(" ")[0];
    let duration = generateDuration(payload.text.split(" ")[1], DEFAULT_DURATION);
    let audioFilename = generateAudioFileName();
    let videoFormat;

    const slackApi = new Slack(payload.channel);

    if (validateYouTubeUrl(link)) {
        videoFormat = new YoutubeVideo(link, duration, audioFilename);
    } else {
        say("Example USAGE f" +
            "or youtube: /audio [youtube-url] [ duration (10 seconds default) ]")
    }
    videoFormat.performDownload();

    slackApi.uploadToSlack(audioFilename);
});


// Start your app
(async () => {
    await app.start(process.env.PORT || 4000);
    console.log('⚡️ Bolt app is running!');
})();
