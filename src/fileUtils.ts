const rimraf = require('rimraf');
const fs = require('fs');

const FRAME_FOR_128_KBPS_BYTES = 417;
const FRAME_FOR_192_KBPS_BYTES = 626;
const FRAME_CONSTANT_LENGTH_TIME = 0.026;

export const deleteMp3Files = ( callback ) => {
    rimraf('./*.mp3', callback);
};

export const clipMp3 = (audioFilename, duration) => {
    let frames = duration / FRAME_CONSTANT_LENGTH_TIME;
    const truncatedSizeBytes = Math.round(((FRAME_FOR_128_KBPS_BYTES * frames) / 1024) * 1000);
    const fd = fs.openSync(audioFilename, 'r+');
    fs.ftruncateSync(fd, truncatedSizeBytes);
};

module.exports = {
    deleteMp3Files,
    clipMp3
};