import { Connection } from "./connection";

export class Customer{
    customerId: number;
    firstName: string;
    lastName: string;
    userName: string;
    mobileNo: number;
    emailId: string;
    connections: Connection[];
    constructor(){}
}