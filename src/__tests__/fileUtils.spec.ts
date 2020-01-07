import * as fs from "fs";
import {deleteMp3Files} from "../fileUtils";

const {assert} = require('chai');

test('deletes existing mp3 files',async function () {
    //arrange
    let files = ['file1.mp3', 'file2.mp3', 'file3.mp3'];

    let creatingEmptyFiles = () => {
        return new Promise(
            (resolve, reject) => {
            for (let file of files) {
                fs.writeFileSync(file, "");
                // console.log(`File: ${file} was created successfully.`);
            }
            resolve();
        }
        )
    };
    await creatingEmptyFiles().then( ()=> {
        console.log("Files done creating");
    });

    let deletingEmptyFiles = () => {
        return new Promise(
            (resolve, reject) => {
                deleteMp3Files();
                resolve();
            });

    };

    await deletingEmptyFiles().then( ()=> {
        console.log("Files done deleting");

    });

    let verifyingFilesAreDeleted = () => {
        return new Promise(
            (resolve, reject) => {
                for (let file of files) {
                    if (fs.existsSync(file)) {
                        assert.fail(`File: ${file} still exists`);
                    } else {
                        console.log('File is deleted successfully.');
                    }
                }
                resolve();
            }
        )
    };
    await verifyingFilesAreDeleted().then( ()=> {
        console.log("Verified files have been deleted");
    });
});

