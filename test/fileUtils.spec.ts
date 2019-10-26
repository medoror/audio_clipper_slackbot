import {describe} from "mocha"
import * as fs from "fs";
import {clipMp3} from "../src/fileUtils";
import * as path from "path";

const {assert, expect} = require('chai');

const {deleteMp3Files} = require('../src/fileUtils');

const mp3Duration = require('mp3-duration');

describe('File Utils', function () {
    it('deletes existing mp3 files', function () {
        //arrange
        let files = ['file1.mp3', 'file2.mp3', 'file3.mp3'];

        for (let file of files) {
            fs.writeFile(file, "", function (err) {
                if (err) throw err;
                console.log('File is created successfully.');
            });
        }

        //act & assert
        deleteMp3Files(() => {
            for (let file of files) {
                if (fs.existsSync(file)) {
                    assert.fail(`File: ${file} still exists`);
                } else {
                    console.log('File is deleted successfully.'); //why doesnt this print?
                }
            }
        });
    });

    it('truncates mp3 file by given duration', async function () {
        let sampleFile : string = './test/sample.mp3';
        //arrange
        fs.copyFileSync(path.resolve(__dirname, './fixtures/SampleAudio_0.4mb.mp3'), './test/sample.mp3');

        //act
        clipMp3(sampleFile, 15);

        //assert
        let mp3DurationPromise = () => {
            return new Promise(
                (resolve, reject) => {
                    mp3Duration(sampleFile, function (err, duration) {
                        if (err) reject(err);
                        resolve(duration);
                    })
                }
            );
        };
        let finalDuration;
        await mp3DurationPromise().then(duration => {
            finalDuration = duration;
        }).catch(err => console.log(err));

        expect(finalDuration).to.be.closeTo(15, 0.5);

        //delete the file
        fs.unlinkSync(sampleFile);
    });
});
