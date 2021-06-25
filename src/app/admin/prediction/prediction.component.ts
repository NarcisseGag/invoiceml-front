import { HttpEventType } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import 'leader-line';
import { BoundingBox } from 'src/app/models/bounding-box';
import { PredictionConfirm } from 'src/app/models/prediction-confirm';
import { PredictionResult } from 'src/app/models/prediction-result';
import { PredictionService } from 'src/app/service/prediction.service';
import { environment } from 'src/environments/environment';
declare let LeaderLine: any;

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit { //  implements AfterViewInit
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  showPdf = false;


  public imgWidth: number;
  public imgHeight: number;
  public url: string;
  public image;
  id: number | string;
  updateMode: boolean;

  public predictionResult: PredictionResult;
  public predictionConfirm: PredictionConfirm;

  @ViewChild('companyCodeStartElement', { read: ElementRef }) companyCodeStartElement: ElementRef;
  @ViewChild('companyCodeEndElement', { read: ElementRef }) companyCodeEndElement: ElementRef;

  // ngAfterViewInit() {
  //    const line = new LeaderLine(this.companyCodeStartElement.nativeElement, this.companyCodeEndElement.nativeElement);
  // }

  hideRequiredControl = new FormControl(false);
  // constructor() {}

  // Form 1
  predictionForm: FormGroup;
  predictionConfirmFormGroup: FormGroup;
  hide = true;
  hide2 = true;
  hide3 = true;
  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private predictionService: PredictionService, private snackBar: MatSnackBar) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.updateMode = this.id ? true : false;
    this.initPredictionForm();
  }

  ngOnInit() {
    this.predictionForm = this.initPredictionForm();
  }

  initPredictionForm(): FormGroup {
    return this.fb.group({
      COMPANYCODE: [''],
      ADDRESS: [''],
      VENDORNAME: [''],
      VENDORCODE: [''],
      INVOICENUMBER: [''],
      INVOICEDATE: [''],
      INVOICECURRENCY: [''],
      NETAMOUNT: [''],
      VATCODE: ['']
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
   * handle file from browsing
   */
     fileBrowseHandler(event) {
      // this.openFile(event);
      this.uploadFile(event.target.files);
    }

    public uploadFile = (files) => {
      if (files.length === 0) {
        return;
      }
      const fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      this.predictionService.MakePrediction(formData).subscribe((data: PredictionResult) => {
          this.showPdf = !this.showPdf;
          this.url = data.ImagePath;
          this.predictionResult = data;
          this.CompanyCode.patchValue(this.predictionResult.CompanyCode);
          this.Address.patchValue(this.predictionResult.Address);
          this.VendorName.patchValue(this.predictionResult.VendorName);
          this.VendorCode.patchValue(this.predictionResult.VendorCode);
          this.InvoiceNumber.patchValue(this.predictionResult.InvoiceNumber);
          this.InvoiceCurrency.patchValue(this.predictionResult.InvoiceCurrency);
          this.InvoiceDate.patchValue(this.predictionResult.InvoiceDate);
          this.NetAmount.patchValue(this.predictionResult.NetAmount);
          this.VatCode.patchValue(this.predictionResult.VatCode);

          this.predictionConfirmFormGroup = this.initPredictionForm();
        });
    }

    public createImgPath = (serverPath: string) => {
      return `${environment.apiUrl}/${serverPath}`;
    }

    getModalResult(event) {
      if (event.dataResult === false) {
        return this.predictionForm.get(event.prop).reset();
      } else {
        this.predictionForm.get(event.prop).patchValue(event.dataValue);
      }
    }

  clear() {
    this.showPdf = false;
    this.predictionForm.reset();
    this.predictionResult = null;
  }

  confirm(isConfirm: boolean) {
    // this.predictionResult = Object.assign({}, this.predictionResult)
    this.predictionResult.PredictionConfirm = new PredictionConfirm();
    this.predictionResult.PredictionConfirm.CompanyCode = this.CompanyCode.value;
    this.predictionResult.PredictionConfirm.Address = this.Address.value;
    this.predictionResult.PredictionConfirm.VendorName = this.VendorName.value;
    this.predictionResult.PredictionConfirm.VendorCode = this.VendorCode.value;
    this.predictionResult.PredictionConfirm.InvoiceNumber = this.InvoiceNumber.value;
    this.predictionResult.PredictionConfirm.InvoiceCurrency = this.InvoiceCurrency.value;
    this.predictionResult.PredictionConfirm.InvoiceDate = this.InvoiceDate.value;
    this.predictionResult.PredictionConfirm.NetAmount = this.NetAmount.value;
    this.predictionResult.PredictionConfirm.VatCode = this.VatCode.value;
    // this.predictionResult.PredictionConfirm.ConfirmedDate = isConfirm ? new Date() : null;
    this.predictionService.Save(this.predictionResult).subscribe(() => {
      this.showNotification(
        'snackbar-success',
        'Add Record Successfully...!!!',
        'bottom',
        'center'
      );
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  get CompanyCode() {
    return this.predictionForm.get('COMPANYCODE') as FormControl;
  }

  get Address() {
    return this.predictionForm.get('ADDRESS') as FormControl;
  }

  get VendorName() {
    return this.predictionForm.get('VENDORNAME') as FormControl;
  }

  get VendorCode() {
    return this.predictionForm.get('VENDORCODE') as FormControl;
  }

  get InvoiceNumber() {
    return this.predictionForm.get('INVOICENUMBER') as FormControl;
  }

  get InvoiceCurrency() {
    return this.predictionForm.get('INVOICECURRENCY') as FormControl;
  }

  get InvoiceDate() {
    return this.predictionForm.get('INVOICEDATE') as FormControl;
  }

  get NetAmount() {
    return this.predictionForm.get('NETAMOUNT') as FormControl;
  }

  get VatCode() {
    return this.predictionForm.get('VATCODE') as FormControl;
  }
}
