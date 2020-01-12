import {YoutubeVideo} from "../youtubeVideo";

jest.mock('fluent-ffmpeg', () => jest.fn(setFfmpegPath => {}));
jest.mock('ytdl-core', () => jest.fn());

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');


test('verifies order of dependencies called', async () => {

    // (ffmpeg as jest.MockedFunction<typeof ffmpeg>).mockResolvedValueOnce("ffmpeg return");

    (ffmpeg as jest.MockedFunction<typeof ffmpeg>) = {
        setFfmpegPath: true,
    };

    // (ffmpeg as jest.MockedFunction<typeof ffmpeg>).mockImplementation(() => {
    //     return {
    //         setFfmpegPath: jest.fn(),
    //     };
    // })

    // (ytdl as jest.MockedFunction<typeof ytdl>).mockResolvedValueOnce("ytdl return");

    const youtubeVideo = new YoutubeVideo("ytLink", "audioFilename", 0);

    youtubeVideo.performDownload();

    expect(ffmpeg as jest.MockedFunction<typeof ffmpeg>).toHaveBeenCalledTimes(1);
    // expect(ytdl as jest.MockedFunction<typeof ytdl>).toHaveBeenCalledTimes(1);

});
