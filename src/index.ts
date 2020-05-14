import 'bluebird-global';

import axios from 'axios';
import axiosRetry from 'axios-retry';

import * as types from './types';

const client = axios.create({ baseURL: 'https://2captcha.com' });

axiosRetry(client, { retryDelay: axiosRetry.exponentialDelay.bind(this) });

export class ApiResponseError extends Error {
    public code: types.ApiErrors;

    constructor(code: types.ApiErrors, text?: string) {
        super(text === undefined ? code : code + ' (' + text + ')');

        Object.setPrototypeOf(this, ApiResponseError.prototype);

        this.code = code;
    }
}

export default class TwoCaptcha {
    public apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    // TODO: Proxy support

    /**
     * Request a hCaptcha to be solved
     * @param sitekey - Sitekey from the captcha
     * @param pageurl - Url of page where the captcha was located
     */
    public async solveHcaptcha(
        sitekey: string,
        pageurl: string
    ): Promise<number> {
        const params: types.ApiHcaptchaParams = {
            key: this.apiKey,
            json: 1,
            method: 'hcaptcha',
            sitekey: sitekey,
            pageurl: pageurl
        };

        const data = (await this.makeRequest(
            'GET',
            '/in.php',
            params
        )) as types.ApiHcaptchaResponse;

        return parseInt(data.request as string);
    }

    /**
     * Continueously attempt to get solution of captcha
     * @param id - Id of the captcha
     * @param interval - Milliseconds to wait between requests to poll solution
     * @param initialWait - How many milliseconds to wait before polling the captcha
     */
    public async pollSolution(
        id: number,
        interval: number,
        initialWait?: number
    ): Promise<string> {
        if (initialWait !== undefined) {
            await Promise.delay(initialWait);
        }

        let solution: string,
            polling = true;

        // Could use a generator function but I think this is a lot neater

        while (polling) {
            try {
                solution = await this.getSolution(id);
                polling = false;
            } catch (err) {
                if (err.code !== 'CAPCHA_NOT_READY') {
                    polling = false;
                    throw err;
                }

                await Promise.delay(interval);
            }
        }

        // https://github.com/microsoft/TypeScript/issues/9568
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return solution;
    }

    public async getSolution(id: number): Promise<string> {
        const params: types.ApiGetParams = {
            key: this.apiKey,
            json: 1,
            action: 'get',
            id: id
        };

        const data = (await this.makeRequest(
            'GET',
            '/res.php',
            params
        )) as types.ApiGetResponse;

        return data.request as string;
    }

    public async reportSolution(id: number, correct: boolean): Promise<void> {
        const params: types.ApiReportParams = {
            key: this.apiKey,
            json: 1,
            action: correct ? 'reportgood' : 'reportbad',
            id: id
        };

        await this.makeRequest('POST', '/res.php', params);
    }

    private async makeRequest(
        httpMethod: 'GET' | 'POST',
        path: '/in.php' | '/res.php',
        params: types.ApiParams
    ): Promise<types.ApiResponse> {
        if (params.key === undefined) {
            throw new Error('API key not set (yet)');
        }

        // Force json
        params.json = 1;

        const response = await client({
            method: httpMethod,
            url: path,
            params: params
        });

        this.checkForErrorAndThrow(response.data);

        return response.data;
    }

    private checkForErrorAndThrow(data: types.ApiResponse): void {
        if (data.status === 1) {
            // No error
            return;
        }

        // Not a success, throw error with error code and text
        throw new ApiResponseError(
            data.request as types.ApiErrors,
            data.error_text
        );
    }
}
