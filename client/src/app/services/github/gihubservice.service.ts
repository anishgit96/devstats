import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {User} from '../../components/models/user';
import 'rxjs/add/operator/map';


@Injectable()
export class GithubService {

  constructor(protected http: HttpClient) {}

  call(username: string) {
    return this.http.get<User>('/api/githubUser/'.concat(username),
      {headers: {}}). map(res => res);
  }

  callRepo(username: string) {
    return this.http.get<any[]>('/api/githubRepo/'.concat(username))
      .map(res => res);
  }

}
