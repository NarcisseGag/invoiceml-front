
import { BoundingBox } from "./bounding-box";

export class PredictionResult {
    CompanyCode: string;
    Address: string;
    VendorName: string;
    VendorCode: string;
    InvoiceNumber: string;
    InvoiceDate: string;
    InvoiceCurrency: string;
    NetAmount: string;
    VatCode: string;
    BoundingBoxes: Array<BoundingBox>;
}
