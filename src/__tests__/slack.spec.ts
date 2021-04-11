import {Slack} from "../slack";

import fetch from 'node-fetch';
const FormData = require('form-data');
const { Response } = jest.requireActual('node-fetch');

jest.mock('node-fetch', () => jest.fn());

function formDataStub() :FormData {
    const form = new FormData();

    form.append('file', "file contents");
    form.append('token', "slack api token");
    form.append('channels', "slack channel");
    form.append('filetype', "file type");
    form.append('filename', "file name");
    return form;
}

describe('slack api', () => {
    test('verifies fetch is called',async () => {

        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(new Response(JSON.stringify({test: "test"})));

        const slack = new Slack("the channel");
        slack.setFormData(formDataStub());
        await slack.uploadToSlack("audioFilename");

        expect(fetch as jest.MockedFunction<typeof fetch>).toHaveBeenCalledTimes(1);

    });
});