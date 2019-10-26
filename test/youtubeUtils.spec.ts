import {describe} from "mocha"

const {assert} = require('chai');

const {validateYouTubeUrl, checkYoutubeUrlForTimestamp} = require('../src/youtubeUtils');

describe('YoutubeVideo Utils', function () {
    it('returns proper result given a valid/invalid youtube url', function () {
        let urls =
            [{url: 'https://www.youtube.com/watch?v=lXyzL90g7nY', result: true},
                {url: 'https://www.youtube.com/watchZqzgj8yOAHc', result: false},
                {url: 'https://www.youtube.com/watchlXyzL90g7nY', result: false},
                {url: '', result: false},
                {url: 'clearly a bad url', result: false}];
        for (let testCase of urls) {
            assert.equal(validateYouTubeUrl(testCase.url), testCase.result)
        }
    });

    it('returns undefined for a valid youtube url with no timestamp', function () {
        let urls =
            ['https://www.youtube.com/watch?v=lXyzL90g7nY'];
        for (let url of urls) {
            assert.equal(checkYoutubeUrlForTimestamp(url), undefined);
        }
    });

    it('returns proper value in seconds given a valid youtube url with a timestamp', function () {
        let urls =
            [{url: 'https://www.youtube.com/watch?v=lXyzL90g7nY&t=1m5s', result: 65},
                {url: 'https://www.youtube.com/watch?v=lXyzL90g7nY&t=1m5', result: undefined},
                {url: 'https://youtu.be/lXyzL90g7nY?t=192',  result: 192},
                {url: 'https://youtu.be/lXyzL90g7nY?t=150s',  result: 150}];

        for (let testCase of urls) {
            assert.equal(
                checkYoutubeUrlForTimestamp(testCase.url), testCase.result);
        }
    });
});