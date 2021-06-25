import { PredictionConfirm } from "./prediction-confirm";
import { PredictionFirst } from "./prediction-first";

export class BoundingBox {
    Left: number;
    Top: number;
    Width: number;
    Height: number;

    Key: string;
    Value: string;
    IdPredictionFirst: number;
    PredictionFirst: PredictionFirst;
    IdPredictionConfirm: number;
    PredictionConfirm: PredictionConfirm;
}
