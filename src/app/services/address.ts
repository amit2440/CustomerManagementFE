import { Connection } from "./connection";

export class Address{
    addressId: number;
    address: String;
    city: String;
    country:String;
    pinCode: number;
    connection: Connection;
    constructor(){}
}