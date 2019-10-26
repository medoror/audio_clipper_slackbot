export const validateYouTubeUrl = (potentialUrl: string) => {
    if (potentialUrl !== undefined || potentialUrl !== '') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        const match = potentialUrl.match(regExp);
        if (match && match[2].length === 11) {
            return true;
        }
    }
    return false;
};

function extractTimestamp(potentialUrl: string, regex: RegExp) {
    return potentialUrl.match(regex);
}

export const checkYoutubeUrlForTimestamp = (potentialUrl: string) => {
    let seconds;
    // Urls come in two forms
    // 1. https://youtu.be/DE70MkLGp9g&t=912s (s is optional)
    let match = extractTimestamp(potentialUrl, /t=([0-9]*)s?$/);
    if (match && match[1] && match[2] !== '') {
        return seconds = match[1];
    }
    // 2. https://www.youtube.com/watch?v=DE70MkLGp9g&t=2m54s (s is not optional)
    match = extractTimestamp(potentialUrl, /t=([0-9]*)m([0-9]*)s/);
    if (match && match[1] && match[2]) {
        return seconds = convertMintuesToSeconds(parseInt(match[1]), parseInt(match[2]));
    }
    return seconds;
};

function convertMintuesToSeconds(minutes: number, seconds: number) {
    return (minutes * 60) + seconds;
}

module.exports = {
    validateYouTubeUrl,
    checkYoutubeUrlForTimestamp,
};
