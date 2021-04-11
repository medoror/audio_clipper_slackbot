export const validateYouTubeUrl = (potentialUrl: string) => {
    const VALID_VIDEO_ID_LENGTH: number = 11;
    if (potentialUrl !== undefined || potentialUrl !== '') {
        const match = parseUrl(potentialUrl, /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/);
        if (match && match[2].length === VALID_VIDEO_ID_LENGTH) {
            return true;
        }
    }
    return false;
};

/**
 * Will apply regex on given url and return the matches object
 * @param potentialUrl
 * @param regex
 */
function parseUrl(potentialUrl: string, regex: RegExp) {
    return potentialUrl.match(regex);
}


/**
 * Given a youtube url this method will return the number of seconds located in the
 * timestamp portion of the url or undefined if it doesn't exist.
 * @param potentialUrl
 */
export const checkYoutubeUrlForTimestamp = (potentialUrl: string) => {
    let seconds: number | undefined;
    // Urls come in two forms
    // 1. https://youtu.be/DE70MkLGp9g&t=912s (s is optional)
    let match = parseUrl(potentialUrl, /t=([0-9]*)s?$/);
    if (match && match[1] && match[2] !== '') {
        return seconds = Number(match[1]);
    }
    // 2. https://www.youtube.com/watch?v=DE70MkLGp9g&t=2m54s (s is not optional)
    match = parseUrl(potentialUrl, /t=([0-9]*)m([0-9]*)s/);
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