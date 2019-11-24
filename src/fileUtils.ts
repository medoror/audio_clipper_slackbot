import * as fs from 'fs';

const rimraf = require('rimraf');

const FRAME_SIZE_BYTES_FOR_128_KBPS_BITRATE = 417;
const FRAME_SIZE_BYTES_FOR_192_KBPS_BITRATE = 626;
const FRAME_CONSTANT_LENGTH_TIME_SECONDS = 0.026;
const BYTES_PER_SECOND_TO_KILO_BYTES_PER_SECOND = 1024;
const KILOBYTES_TO_BYTES = 1000;


export const deleteMp3Files = (callback) => {
    rimraf('./*.mp3', callback);
};

/**
 * Takes an mp3 and truncates and augments the size, removing
 * bytes after the given duration
 *
 * More info about this logic here: https://stackoverflow.com/questions/42814866/ios-download-only-few-seconds-from-mp3-file
 * @param audioFilename
 * @param duration
 */
export const clipMp3 = (audioFilename, duration) => {
    let frames = duration / FRAME_CONSTANT_LENGTH_TIME_SECONDS;
    const truncatedSizeBytes = Math.round(((FRAME_SIZE_BYTES_FOR_128_KBPS_BITRATE * frames) / BYTES_PER_SECOND_TO_KILO_BYTES_PER_SECOND
    ) * KILOBYTES_TO_BYTES);
    const fd = fs.openSync(audioFilename, 'r+');
    fs.ftruncateSync(fd, truncatedSizeBytes);
};

module.exports = {
    deleteMp3Files,
    clipMp3
};