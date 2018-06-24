import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class UploadFileService {
  constructor(private http: HttpClient) {}
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', 'http://localhost:8080/custManagement/profile/uploadpicture', formdata, {
      reportProgress: true,
      responseType: 'text'
    }
    );
    console.log(req);
    console.log(formdata);
    return this.http.request(req);
  }
}