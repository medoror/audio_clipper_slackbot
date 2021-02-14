import {deleteMp3Files} from "./fileUtils";

require('dotenv').config();

import {Slack} from "./slack";
import {YoutubeVideo} from "./youtubeVideo";
import {VideoInterface} from "./videoInterface";
import {validateYouTubeUrl} from "./youtubeUtils";
import {App, ExpressReceiver} from "@slack/bolt";
// import {awsServerlessExpress} from "aws-serverless-express";
const awsServerlessExpress = require('aws-serverless-express')

const shortid = require('shortid');
const DEFAULT_DURATION_SECONDS: number = 10;

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
    receiver: expressReceiver,
    token: process.env.SLACK_BOT_TOKEN
});

const server = awsServerlessExpress.createServer(expressReceiver.app);

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
    let audioFilename: string = generateAudioFileName();
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

        // delete the downloaded mp3 when finished
        deleteMp3Files();
    } catch (err) {
        console.log("Something went wrong: " + err)
    }
});


// Start your app
//(async () => {
//    await app.start(process.env.PORT || 4000);
//    console.log('⚡️ Bolt app is running!');
//})();

// Handle the Lambda function event
module.exports.handler = (event, context) => {
  console.log('⚡️ Bolt app is running!');
  awsServerlessExpress.proxy(server, event, context);
};


