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
  socketUrlRequestInProgress = false;

  constructor(private http: HttpClient) {
    // this.createSocket();
    this.socket = io(environment.socketUrl, { query: environment.configQuery });
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
    this.socket.on(environment.configChannel, response => {
      if (response) {
        this.socketDataSubject.next({
          isConnected: this.socket.connected,
          data: response.data,
          type: response.type
        });
      }
    });
  }

  createSocket() {
    if (!this.socketUrlRequestInProgress) {
      this.socketUrlRequestInProgress = true;
      this.http.get(environment.configUrl).subscribe(
        (res: any) => {
          this.validateSocket(res.url).subscribe(
            socketData => {
              this.socketUrlRequestInProgress = false;
              console.log('socket valid', socketData);
            },
            err => {
              console.log('socket invalid: ', err);
              this.socketUrlRequestInProgress = false;
              if(this.socket.connected){
                this.socket.disconnect();
              }
              this.socket=undefined;
              this.createSocket();
            }
          );
        },
        err => {
          this.socketUrlRequestInProgress = false;
        }
      );
    }
  }

  validateSocket(socketUrl) {
    return new Observable(observer => {
      this.socket = io(socketUrl, { query: environment.configQuery });
      console.log(this.socket);
      this.socket.on('connect', () => {
        console.log('SOCKET CONNECTED');
        this.socket.emit('subscribe', {
          channel: environment.configChannel,
          subChannels: {
            language: 'en',
            deliveryPlatform: 'Web',
            playerUuid: null
          }
        });
        observer.next();
      });
      this.socket.on(environment.configChannel, response => {
        if (response) {
          observer.next({
            isConnected: this.socket.connected,
            data: response.data,
            type: response.type
          });
        }
      });
      this.socket.on('error', () => {
        this.socket.off('connect_error');
        this.socket.off('error');
        observer.error('error');
      });
      // this.socket.on('disconnect', () => {
      //   debugger;
      //   reject('disconnect');
      // });
      // this.socket.on('connect_failed', () => {
      //   debugger;
      //   if(this.socket.connected){
      //     this.socket.disconnect();
      //   }
      //   observer.error('connect failed');
      // });
      this.socket.on('connect_error', () => {
        this.socket.off('connect_error');
        this.socket.off('error');
        observer.error('connect error');
      });
    });
  }
}
