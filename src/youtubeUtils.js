const validateYouTubeUrl = (potentialUrl) => {
    if (potentialUrl !== undefined || potentialUrl !== '') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        const match = potentialUrl.match(regExp);
        if (match && match[2].length === 11) {
            return true;
        }
    }
    return false;
};

module.exports = {
    validateYouTubeUrl,
};
