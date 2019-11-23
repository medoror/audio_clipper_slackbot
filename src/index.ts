require('dotenv').config();

import {Slack} from "./slack";
import {YoutubeVideo} from "./youtubeVideo";
import {VideoInterface} from "./videoInterface";

import {App} from "@slack/bolt";

const {validateYouTubeUrl} = require('./youtubeUtils');

const shortid = require('shortid');


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
    let link: string = payload.text.split(" ")[0];
    let duration :number  = generateDuration(payload.text.split(" ")[1], DEFAULT_DURATION);
    let audioFilename: string = generateAudioFileName();
    let videoFormat: VideoInterface;

    const slackApi = new Slack(payload.channel_name);

    if (validateYouTubeUrl(link)) {
        videoFormat = new YoutubeVideo(link, audioFilename, duration);
    } else {
        say("Example USAGE for youtube: " +
            "/audio [youtube-url] [ duration (10 seconds default) ]")
        return;
    }
    await videoFormat.performDownload();

    await slackApi.uploadToSlack(audioFilename);
});


// Start your app
(async () => {
    await app.start(process.env.PORT || 4000);
    console.log('⚡️ Bolt app is running!');
})();
