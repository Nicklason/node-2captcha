//#region API errors
export type ApiRateLimitErrors =
    | 'ERROR: 1001'
    | 'ERROR: 1002'
    | 'ERROR: 1003'
    | 'ERROR: 1004'
    | 'ERROR: 1005';

export type ApiInErrors =
    | 'ERROR_WRONG_USER_KEY'
    | 'ERROR_KEY_DOES_NOT_EXIST'
    | 'ERROR_ZERO_BALANCE'
    | 'ERROR_PAGEURL'
    | 'ERROR_NO_SLOT_AVAILABLE'
    | 'ERROR_ZERO_CAPTCHA_FILESIZE'
    | 'ERROR_TOO_BIG_CAPTCHA_FILESIZE'
    | 'ERROR_WRONG_FILE_EXTENSION'
    | 'ERROR_IMAGE_TYPE_NOT_SUPPORTED'
    | 'ERROR_UPLOAD'
    | 'ERROR_IP_NOT_ALLOWED'
    | 'IP_BANNED'
    | 'ERROR_BAD_TOKEN_OR_PAGEURL'
    | 'ERROR_GOOGLEKEY'
    | 'ERROR_CAPTCHAIMAGE_BLOCKED'
    | 'MAX_USER_TURN'
    | 'ERROR_BAD_PARAMETERS'
    | ApiRateLimitErrors;

export type ApiResErrors =
    | 'CAPCHA_NOT_READY'
    | 'ERROR_CAPTCHA_UNSOLVABLE'
    | 'ERROR_WRONG_USER_KEY'
    | 'ERROR_KEY_DOES_NOT_EXIST'
    | 'ERROR_WRONG_ID_FORMAT'
    | 'ERROR_WRONG_CAPTCHA_ID'
    | 'ERROR_BAD_DUPLICATES'
    | 'REPORT_NOT_RECORDED'
    | 'ERROR_IP_ADDRES'
    | 'ERROR_TOKEN_EXPIRED'
    | 'ERROR_EMPTY_ACTION'
    | ApiRateLimitErrors;

export type ApiErrors = ApiInErrors | ApiResErrors;
//#endregion

//#region Generic API response
export interface ApiResponse {
    status: 0 | 1;
    request?: string | ApiErrors;
    error_text?: string;
}

export interface ApiInResponse {
    status: 0 | 1;
    request?: string | ApiInErrors;
    error_text?: string;
}

export interface ApiResResponse {
    status: 0 | 1;
    request?: string | ApiResErrors;
    error_text?: string;
}
//#endregion

export type ApiParams = Required<{
    key: string;
}> & { json?: 0 | 1 };

//#region Get solution method
export interface ApiGetParams {
    key: string;
    json?: 0 | 1;
    action: 'get';
    id: number;
}

export interface ApiGetResponse {
    status: 0 | 1;
    request?: 'CAPCHA_NOT_READY' | ApiInErrors;
    error_text?: string;
}
//#endregion

//#region Report method
export interface ApiReportParams {
    key: string;
    json?: 0 | 1;
    action: 'reportgood' | 'reportbad';
    id: number;
}

export interface ApiReportResponse {
    status: 0 | 1;
    request?: 'OK_REPORT_RECORDED' | 'ERROR_REPORT_NOT_RECORDED' | ApiInErrors;
    error_text?: string;
}
//#endregion

//#region Solve Hcaptcha method
export interface ApiHcaptchaParams {
    key: string;
    method: 'hcaptcha';
    sitekey: string;
    pageurl: string;
    header_acao?: 0 | 1;
    pingback?: string;
    json?: 0 | 1;
    soft_id?: number;
    proxy?: string;
    proxytype?: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
}

// No changes to type
export type ApiHcaptchaResponse = ApiInResponse;
//#endregion

// TODO: Add types for other methods
