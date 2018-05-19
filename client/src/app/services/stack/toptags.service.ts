import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Injectable()
export class ToptagsService {

  constructor(protected http: HttpClient) { }

  // End up with an array of badges.
  public _get(id: string) {
    return this.http.get<any>("/api/stackusertoptags/".concat(id)).map(topTags => topTags.items);
  }

}
