import {Slack} from "../slack";

import fetch from 'node-fetch';
const FormData = require('form-data');

jest.mock('node-fetch', () => jest.fn(()=> {return {test: "test"}}));
// jest.mock('node-fetch', () => jest.fn());

function generateFormData() {
    const form = new FormData();

    form.append('file', "file contents");
    form.append('token', "slack api token");
    form.append('channels', "slack channel");
    form.append('filetype', "file type");
    form.append('filename', "file name");
    return form;
}

describe('slack api', () => {
    test('calls upload user with the correct arguments',async () => {
        const slack = new Slack("the channel");
        slack.setFormData(generateFormData());
        await slack.uploadToSlack("audioFilename");

        expect(fetch as jest.MockedFunction<typeof fetch>).toHaveBeenCalledTimes(1);
    });
});
