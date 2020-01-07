const rimraf = require('rimraf');

export const deleteMp3Files = () => {
    rimraf.sync('./*.mp3', {});
};

module.exports = {
    deleteMp3Files,
};