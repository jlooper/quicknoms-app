import { Injectable } from "@angular/core";
const http = require("http");
import { AuthService } from "../services/auth.service";

@Injectable()
export class MLService {
    public queryGoogleVisionAPI(imageAsBase64: string):Promise<any>{
        return http.request({
            url: "https://vision.googleapis.com/v1/images:annotate?key="+AuthService.googleKey,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": imageAsBase64.length,
            },
            content: JSON.stringify({
                "requests": [{
                "image": {
                "content": imageAsBase64 
                },
                "features" : [
                    {
                        "type":"LABEL_DETECTION",
                        "maxResults":1
                    }
                ]                      
            }]
        })
      })
      .then(function (response) {
          return response
        }
      )}

    public queryClarifaiAPI(imageAsBase64):Promise<any>{
        return http.request({
            url: AuthService.clarifaiUrl,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 "Authorization": "Key " + AuthService.clarifaiKey,
            },
            content: JSON.stringify({
                "inputs": [{
                    "data": {
                        "image": {
                            "base64": imageAsBase64
                        }
                    }
                }]
            })
        })
      .then(function (response) {
          return response
        }
      )}

}