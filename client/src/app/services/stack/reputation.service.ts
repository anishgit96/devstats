import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ReputationService {

  constructor(protected http: HttpClient) { }

  public _get(id: string) {
    return this.http.get<any>("/api/stackuserreputation/".concat(id))
      .map(reputation => reputation.items)
  }
}
