import { IModel } from "./Imodel";

export class PredictionConfirm implements IModel {
    Id: number;
    AddedDate: Date;
    ModifiedDate: Date;
    CompanyCode: string;
    Address: string;
    VendorName: string;
    VendorCode: string;
    InvoiceNumber: string;
    InvoiceDate: string;
    InvoiceCurrency: string;
    NetAmount: string;
    VatCode: string;
}
