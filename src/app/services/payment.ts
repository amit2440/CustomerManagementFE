import { Connection } from "./connection";

export class Payment{
    paymentId: number;
    paymentStatus: string;
    date: Date;
    paymentAmount: number;
    paymentMethod: string;
    paymentFrom: Date;
    paymentTo: Date;
    internetPlan: String;
   invoiceNo: String;
   connection: Connection;
   constructor(){}
}