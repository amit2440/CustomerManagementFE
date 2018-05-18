import {Pipe} from '@angular/core';
import { Connection } from '../services/connection';

@Pipe({
  name: 'connectionPipe'
})
export class ConnectionPipe {

   transform(value:any[], args:any[]) : Connection[] {
    //let [minAge] = args;
    return value.filter(connection => {
      return connection.connectionStatus==args[0];
    });
  }

}