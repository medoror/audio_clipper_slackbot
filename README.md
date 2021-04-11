# Audio Clipper
A couple of months ago, I tried to be funny on a personal slack channel.  One of my friends
made a comment in our group slack channel and I tried to reply with an audio reaction.

I found a video on youtube with the relevant audio and posted the link in the channel but the execution was not great. 
The funniest joke ever was ruined because:

1. The video had ads
1. The video played a longer portion of the audio I wanted


Feeling jarred. I decided to take this opportunity to try and fix this so my jokes would never get ruined again.

This repo represents my MVP attempt to upload sound clips via a slackbot.  Instead of posting a link, this bot will take a youtube video and upload the audio as an mp3. At this time it has the following usages

## Usage

**Usage 1** - `/audio https://www.youtube.com/watch?v=WBC_CepxWHU`
This will upload audio from the beginning of the given youtube url up to the given duration (in seconds).  If no
duration is given, the default is 10 seconds.

**Usage 2** - `/audio https://youtu.be/WBC_CepxWHU?t=3 3`
This will upload audio from the beginning of a given youtube url at the timestamp up to the given
duration (in seconds).


## Deploying the slackbot

1. Clone this repo
1. `cp _env .env`
1. `source .env`
1. Add your slack secret and token to your env files
1. `yarn build` to generate javascript files
1. Follow the instructions to deploy and manage: https://slack.dev/bolt-js/deployments/aws-lambda
