import { Injectable, NgZone } from "@angular/core";
const http = require("http");
import { AuthService } from "../services";

@Injectable()
export class PhotonService {
  
  constructor(private zone: NgZone) { }

  public getTemperature():Promise<any>{
        return http.request({
            url: AuthService.clarifaiUrl,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 "Authorization": "Key " + AuthService.clarifaiKey,
            },
            content: JSON.stringify({
                "inputs": [{
                    
                }]
            })
        })
      .then(function (response) {
          return response
        }
      )}
}
