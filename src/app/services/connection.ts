import {Payment} from "./payment";
import {Address} from "./address";
import {Customer} from "./customer";

export class Connection{
    connectionId: number;
    connectionName: string;
    connectionStatus: string;
    payments: Payment[];
    addresses: Address;
    customer: any;
    connectionDate: Date;
    constructor(){}
}