const {describe} = require('mocha');

const {expect, assert} = require('chai');

const {validateYouTubeUrl} = require('../src/youtubeUtils');

describe('Youtube Utils:', function() {
    it('returns true for a valid youtube url', function() {
        assert.equal(
            validateYouTubeUrl('https://www.youtube.com/watch?v=lXyzL90g7nY'), true)
    });

    it('returns false for invalid url', function () {
        assert.equal(
            validateYouTubeUrl('https://www.youtube.com/watch?v=lXyzL90g7nY'), false)
    });
});