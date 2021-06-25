
import { BoundingBox } from "./bounding-box";
import { IModel } from "./Imodel";
import { PredictionFirst } from "./prediction-first";
import { PredictionConfirm } from "./prediction-confirm";

export class PredictionResult implements IModel {
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
    ImagePath: string;
    ConfirmedDate: Date;
    BoundingBoxesDict: Array<BoundingBox>;

    // IdPredictionFirst: number;
    // PredictionFirst: PredictionFirst;

    IdPredictionConfirm: number;
    PredictionConfirm: PredictionConfirm;
}
