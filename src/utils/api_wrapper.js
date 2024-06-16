import axios from "axios";
import { makeCancelable } from "./utils";

export class APIWrapper {
    constructor({
        baseUrl = "",
    }) {
        this.baseUrl = baseUrl;
    }
    request = ({ path = '', method = '', body = {} }) => {
        switch (method) {
            case "get":
                return makeCancelable(new Promise(async (resolve, reject) => {
                    try {
                        var url = this.baseUrl + path;
                        console.log(url)
                        axios({
                            method: "get",
                            url: url,
                        }).then((res) => {
                            resolve({
                                ...res.data,
                                isSuccess: res.status >= 200 && res.status < 300,
                            });
                        }).catch(err => {
                            resolve({
                                ...err.response,
                                isSuccess: false,
                            })
                        });
                    }
                    catch (err) {
                        console.log(`request.catch`, err);
                        reject(err);
                    }
                }));
            case "post":
                return makeCancelable(new Promise(async (resolve, reject) => {
                    try {
                        var url = this.baseUrl + path;
                        axios({
                            method: "post",
                            url: url,
                            data: body,
                        }).then((res) => {
                            resolve({
                                ...res.data,
                                isSuccess: res.status >= 200 && res.status < 300,
                            });
                        }).catch(err => {
                            resolve({
                                ...err.response,
                                isSuccess: false,
                            })
                        });
                    }
                    catch (err) {
                        console.log(`request.catch`, err);
                        reject(err);
                    }
                }));
            //other methods such as put,patch,delete can be implemented but for this project here post method is unneccessary :)
            default: return undefined;
        }

    }
}