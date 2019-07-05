import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SocketService {
  private socket: any;
  private socketDataSubject = new Subject<any>();
  public socketData$ = this.socketDataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.createSocketConnection();

    // HARDCODED WORKING SOCKET URL, TO BE USED MANUALLY IN CASE ALL OTHERS FAIL
    // this.getSocket('https://gcm-fra-staging-2.7platform.com:8008');
  }

  createSocketConnection() {
    this.getSocketUrl().subscribe(
      (response: any) => {
        this.getSocket(response.url);
      },
      error => {
        console.error(error);
      }
    );
  }

  getSocketUrl() {
    return this.http.get(environment.configUrl);
  }

  getSocket(url) {
    this.socket = io(url, { query: environment.configQuery });
    this.socket.on('connect', () => {
      this.socket.emit('subscribe', {
        channel: environment.configChannel,
        subChannels: {
          language: 'en',
          deliveryPlatform: 'Web',
          playerUuid: null
        }
      });
    });
    this.socket.on('error', () => {
      this.socket.close();
      this.createSocketConnection();
    });
    this.socket.on(environment.configChannel, response => {
      if (response) {
        this.socketDataSubject.next({
          data: response.data,
          type: response.type
        });
      }
    });
  }
}
