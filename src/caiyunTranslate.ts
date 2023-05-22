import axios, { AxiosRequestConfig } from 'axios';

import { workspace } from 'vscode';
import { ITranslate, ITranslateOptions } from 'comment-translate-manager';

const PREFIXCONFIG = 'caiyunTranslate';

export function getConfig<T>(key: string): T | undefined {
    let configuration = workspace.getConfiguration(PREFIXCONFIG);
    return configuration.get<T>(key);
}

interface CaiyunTranslateOption {
    token?: string;
    targetLang?: string;
}
interface Response {
    "confidence": number,
    "target": string[],
    "rc": number,
}

export class CaiyunTranslate implements ITranslate {
    get maxLen(): number {
        return 3000;
    }

    private _defaultOption: CaiyunTranslateOption;
    constructor() {
        this._defaultOption = this.createOption();
        workspace.onDidChangeConfiguration(async eventNames => {
            if (eventNames.affectsConfiguration(PREFIXCONFIG)) {
                this._defaultOption = this.createOption();
            }
        });
    }

    createOption() {
        const defaultOption: CaiyunTranslateOption = {
            token: getConfig<string>('token'),
            targetLang: getConfig<string>('targetLang'),
        };
        return defaultOption;
    }

    async translate(content: string, { from = 'auto' }: ITranslateOptions) {
        const url = `http://api.interpreter.caiyunai.com/v1/translator`;

        if (!this._defaultOption.token) {
            throw new Error('Please check the configuration of token!');
        }

        if (!this._defaultOption.targetLang) {
            throw new Error('Please check the configuration of target language!');
        }

        const to = this._defaultOption.targetLang;
        const token = this._defaultOption.token;
        const salt = Math.random().toString(16).slice(2);

        let lines = content.split("\n");

        const data = {
            'source': lines,
            'trans_type': from + "2" + to,
            'request_id': salt,
            'detect': true,
        };

        const config: AxiosRequestConfig = {
            timeout: 10000,
            headers: {
                "Accept": "*/*",
                "Proxy-Connection": "keep-alive",
                "content-type": "application/json",
                "x-authorization": "token " + token
            }
        };

        let res = await axios.post<Response>(url, data, config);
        if (res.status === 200) {
            let rlines = res.data.target;
            return rlines.join("\n");
        }
        return res.status.toString(10);
    }


    link(content: string, { }: ITranslateOptions) {
        // Useless, caiyun is not compatible
        let str = `http://api.interpreter.caiyunai.com/v1/translator`;
        return `[Caiyun](${str})`;
    }

    isSupported(src: string) {
        return true;
    }
}





