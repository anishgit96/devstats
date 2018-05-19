import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TwitterUser} from "../../components/models/twitter-user";

@Injectable()
export class TwitterfollowersService {

  constructor(protected http: HttpClient) { }

  public _get(handle: string) {
    return this.http.get<any>("/api/twitterfriends/".concat(handle))
      .map(res => res);
  }
}
