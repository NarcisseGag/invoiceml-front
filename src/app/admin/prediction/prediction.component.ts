import { HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import 'leader-line';
import { BoundingBox } from 'src/app/models/bounding-box';
import { PredictionResult } from 'src/app/models/prediction-result';
import { PredictionService } from 'src/app/service/prediction.service';
declare let LeaderLine: any;

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent { //  implements AfterViewInit
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  showPdf = false;


  @ViewChild("companyCodeLayer", { static: false }) companyCodeLayerCanvas: ElementRef;
  private context: CanvasRenderingContext2D;
  private companyCodeLayerCanvasElement: any;

  public imgWidth: number;
  public imgHeight: number;
  public url: string;
  public image;

  @ViewChild('companyCodeStartElement', { read: ElementRef }) companyCodeStartElement: ElementRef;
  @ViewChild('companyCodeEndElement', { read: ElementRef }) companyCodeEndElement: ElementRef;

  // ngAfterViewInit() {
  //    const line = new LeaderLine(this.companyCodeStartElement.nativeElement, this.companyCodeEndElement.nativeElement);
  // }

  hideRequiredControl = new FormControl(false);
  // constructor() {}

  // Form 1
  predictionForm: FormGroup;
  hide = true;
  hide2 = true;
  hide3 = true;
  constructor(private fb: FormBuilder, private predictionService: PredictionService) {
    this.initPredictionForm();
  }

  initPredictionForm() {
    this.predictionForm = this.fb.group({
      CompanyCode: [''],
      Address: [''],
      VendorName: [''],
      VendorCode: [''],
      InvoiceNumber: [''],
      InvoiceDate: [''],
      InvoiceCurrency: [''],
      NetAmount: [''],
      VatCode: ['']
    });
  }

  onpredictionForm() {
    console.log('Form Value', this.predictionForm.value);
  }

  /**
   * on file drop handler
   */
     onFileDropped($event) {
      this.prepareFilesList($event);
    }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
  }

  /**
   * Simulate the upload process
   */
     uploadFilesSimulator(index: number) {
      setTimeout(() => {
        if (index === this.files.length) {
          return;
        } else {
          const progressInterval = setInterval(() => {
            if (this.files[index].progress === 100) {
              clearInterval(progressInterval);
              this.uploadFilesSimulator(index + 1);
            } else {
              this.files[index].progress += 5;
            }
          }, 200);
        }
      }, 1000);
    }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
     formatBytes(bytes, decimals = 2) {
      if (bytes === 0) {
        return "0 Bytes";
      }
      const k = 1024;
      const dm = decimals <= 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.files.splice(index, 1);
  }

  /**
   * handle file from browsing
   */
     fileBrowseHandler(event) {
      // this.prepareFilesList(event.target.files);
      this.openFile(event);
    }

    public uploadFile = (files) => {
      if (files.length === 0) {
        return;
      }
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      this.predictionService.Save(formData).subscribe(event => {
          // if (event.type === HttpEventType.UploadProgress)
            // this.progress = Math.round(100 * event.loaded / event.total);
          // else if (event.type === HttpEventType.Response) {
          //   // this.message = 'Upload success.';
          //   this.onUploadFinished.emit(event.body);
          // }
        });
    }

  openFile(event) {
    this.showPdf = !this.showPdf;
    this.predictionService.MakePrediction().subscribe((data: PredictionResult) => {
      this.predictionForm.patchValue(data);
      // if (event.target.files && event.target.files[0]) {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(event.target.files[0]);
      //   reader.onload = event => {
      //     this.image = new Image();
      //     this.image.src = reader.result;
      //     this.image.onload = () => {
      //       this.imgWidth = this.image.width;
      //       this.imgHeight = this.image.height;
      //       this.showImage();
      //       this.drawRect(data.BoundingBoxes);
            
      //     };
      //   };
      // }
    });
  }

  showImage() {
    this.companyCodeLayerCanvasElement = this.companyCodeLayerCanvas.nativeElement;
    this.context = this.companyCodeLayerCanvasElement.getContext("2d");
    this.companyCodeLayerCanvasElement.width = this.imgWidth;
    this.companyCodeLayerCanvasElement.height = this.imgHeight;
    this.context.drawImage(this.image, 0, 0, this.imgWidth, this.imgHeight);
    const parent = this;
    this.companyCodeLayerCanvasElement.addEventListener("mousemove", function(e) {
      console.log("canvas click");
      console.log(e);
      let x = 200;
      let y = 300; 
      let w = 400;
      let h = 500;
      // if (x <= e.clientX && e.clientX <= x + w && y <= e.clientY && e.clientY <= y + h) {
      //   parent.drawRect("red");
      // } else {
      //   parent.drawRect();
      // }
    });
  }

  drawRect(boundingBoxes: Array<BoundingBox>) {
    this.context.beginPath();
    boundingBoxes.forEach((boundingBox: BoundingBox) => {
        this.context.rect(boundingBox.Left, boundingBox.Top, boundingBox.Width, boundingBox.Height);
    });
    // this.context.rect(206,1960,380,39);
    this.context.lineWidth = 2;
    this.context.strokeStyle = "#2F72FF";
    this.context.stroke();
  }

  clear() {
    this.showPdf = false;
    this.predictionForm.reset();
  }
}
