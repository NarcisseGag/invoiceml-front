import { IModel } from "./Imodel";

export class PredictionFirst implements IModel {
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
