import {Pipe} from '@angular/core';
import { Connection } from '../services/connection';

@Pipe({
  name: 'connectionPipe'
})
export class ConnectionPipe {
   transform(value:any[], args:any[]) : Connection[] {
    return value.filter(connection => {
      return connection.connectionStatus==args[0];
    });
  }

  getNewPastConnections(value:any[]) : Map<String,Connection[]> {
      let currYear = new Date().getFullYear();
      let currMonth = new Date().getMonth()+1;
      let oldConnection = new Array();
      let newConnection = new Array();
      let oldNewConnections = new Map();
    value.forEach(connection => {
      if(Number(connection.connectionDate.split("-")[0]) == currYear){
        if(Number(connection.connectionDate.split("-")[1]) == currMonth)
            newConnection.push(connection);
        if(Number(connection.connectionDate.split("-")[1]) < currMonth)
            oldConnection.push(connection);
      }
      if(Number(connection.connectionDate.split("-")[0]) < currYear){
            oldConnection.push(connection);
      }
    });
      oldNewConnections.set("oldConnection",oldConnection);
      oldNewConnections.set("newConnection",newConnection);
      return oldNewConnections;
  }
}