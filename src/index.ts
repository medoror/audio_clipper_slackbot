require('dotenv').config();

import {Slack} from "./slack";
import {YoutubeVideo} from "./youtubeVideo";
import {VideoInterface} from "./videoInterface";
import {validateYouTubeUrl} from "./youtubeUtils";
import {App, ExpressReceiver} from "@slack/bolt";
const serverlessExpress = require('@vendia/serverless-express');


const shortid = require('shortid');
const DEFAULT_DURATION_SECONDS: number = 10;

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
});

const app = new App({
    receiver: expressReceiver,
    token: process.env.SLACK_BOT_TOKEN
});

function generateDuration(duration, defaultDuration) {
    return !duration || isNaN(parseInt(duration)) ? defaultDuration : duration;
}

function generateAudioFileName() {
    return shortid.generate().concat('.mp3');
}

app.command('/audio', async ({payload, ack, say}) => {
    ack();
    let link: string = payload.text.split(" ")[0];
    let duration: number = generateDuration(payload.text.split(" ")[1], DEFAULT_DURATION_SECONDS);
    let audioFilename: string = "/tmp/"+generateAudioFileName();
    let videoFormat: VideoInterface;

    if (validateYouTubeUrl(link)) {

        videoFormat = new YoutubeVideo(link, audioFilename, duration);
    } else {
        say("Example USAGE for youtube: " +
            "/audio [youtube-url] [ duration (10 seconds default) ]");
        return;
    }
    try {
        await videoFormat.performDownload();

        const slackApi = new Slack(payload.channel_name);
        await slackApi.uploadToSlack(audioFilename);

    } catch (err) {
        console.log("Something went wrong: " + err)
    }
});

module.exports.handler = serverlessExpress({
  app: expressReceiver.app
});


