
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { StudentsService } from './students.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { Students } from './students.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
// import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteDialogComponent } from '../delete/delete.component';
import { PredictionResult } from 'src/app/models/prediction-result';
import { PredictionService } from 'src/app/service/prediction.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-prediction-list',
    templateUrl: './prediction-list.component.html',
    styleUrls: ['./prediction-list.component.scss']
  })
  export class PredictionListComponent implements OnInit {
    displayedColumns = [
      'select',
      'DocumentName',
      'CompanyCode',
      'VendorName',
      'InvoiceDate',
      'AddedDate',
      // 'ModifiedDate',
      'ConfirmedDate',
      'ConfirmedBy',
      'actions',
    ];
    dataSource: ExampleDataSource | null;
    selection = new SelectionModel<PredictionResult>(true, []);
    id: number;
    students: PredictionResult | null;
    constructor(
      public httpClient: HttpClient,
      public dialog: MatDialog,
      public predictionService: PredictionService,
      private snackBar: MatSnackBar,
      private router: Router
    ) {}
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;
    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };

    ngOnInit() {
      this.loadData();
    }
    refresh() {
      this.loadData();
    }
    addNew() {
    }

    editCall(id: number) {
      this.router.navigate(['/admin/prediction/', id]);
    }

    deleteItem(row) {
      this.id = row.id;
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: row,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.predictionService.Delete(this.id).subscribe(data => {
            this.refreshTable();
            this.showNotification(
              'snackbar-danger',
              'Delete Record Successfully...!!!',
              'bottom',
              'center'
            );
          }, (err: HttpErrorResponse) => {
            // error code here
          });
        }
      });
    }
    private refreshTable() {
      this.paginator._changePageSize(this.paginator.pageSize);
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.renderedData.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.renderedData.forEach((row) =>
            this.selection.select(row)
          );
    }

    removeSelectedRows() {
      // const totalSelect = this.selection.selected.length;
      // this.selection.selected.forEach((item) => {
      //   const index: number = this.dataSource.renderedData.findIndex(
      //     (d) => d === item
      //   );
      //   // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      //   this.predictionService.dataChange.value.splice(index, 1);
      //   this.refreshTable();
      //   this.selection = new SelectionModel<PredictionResult>(true, []);
      // });
      // this.showNotification(
      //   'snackbar-danger',
      //   totalSelect + ' Record Delete Successfully...!!!',
      //   'bottom',
      //   'center'
      // );
    }

    public loadData() {
      this.dataSource = new ExampleDataSource(
        this.predictionService,
        this.paginator,
        this.sort
      );
      fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
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
  }


export class ExampleDataSource extends DataSource<PredictionResult> {
  subject: BehaviorSubject<PredictionResult[]> = new BehaviorSubject<PredictionResult[]>([]);
    filterChange = new BehaviorSubject('');
    isTblLoading = true;
    get filter(): string {
      return this.filterChange.value;
    }
    set filter(filter: string) {
      this.filterChange.next(filter);
    }
    filteredData: PredictionResult[] = [];
    renderedData: PredictionResult[] = [];
    constructor(
      public predictionService: PredictionService,
      public paginator: MatPaginator,
      public sort: MatSort
    ) {
      super();
      // Reset to the first page when the user changes the filter.
      this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
    }
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<PredictionResult[]> {
      // Listen for any changes in the base data, sorting, filtering, or pagination
      const displayDataChanges = [
        // this.sort.sortChange,
        this.filterChange,
        this.paginator.page,
      ];
      this.predictionService.GetAll().subscribe((data: []) => {
        this.isTblLoading = false;
        // this.renderedData = data;
        this.subject.next(data);
      },
      (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
        // return merge();
      });
      return merge(this.subject);
      // return merge(...displayDataChanges).pipe(
      //   map(() => {
      //     // Filter data
      //     this.filteredData = this.predictionService.data
      //       .slice()
      //       .filter((students: PredictionResult) => {
      //         const searchStr = (
      //           students.id +
      //           students.name +
      //           students.email +
      //           students.mobile
      //         ).toLowerCase();
      //         return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      //       });
      //     // Sort filtered data
      //     const sortedData = this.sortData(this.filteredData.slice());
      //     // Grab the page's slice of the filtered sorted data.
      //     const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      //     this.renderedData = sortedData.splice(
      //       startIndex,
      //       this.paginator.pageSize
      //     );
      //     return this.renderedData;
      //   })
      // );
    }
    disconnect() {}
    /** Returns a sorted copy of the database data. */
    sortData(data: PredictionResult[]): PredictionResult[] {
      if (!this.sort.active || this.sort.direction === '') {
        return data;
      }
      return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';
        switch (this.sort.active) {
          case 'VendorCode':
            [propertyA, propertyB] = [a.VendorCode, b.VendorCode];
            break;
          case 'VendorName':
            [propertyA, propertyB] = [a.VendorName, b.VendorName];
            break;
          case 'InvoiceNumber':
            [propertyA, propertyB] = [a.InvoiceNumber, b.InvoiceNumber];
            break;
          case 'InvoiceDate':
            [propertyA, propertyB] = [a.InvoiceDate, b.InvoiceDate];
            break;
          case 'InvoiceCurrency':
            [propertyA, propertyB] = [a.InvoiceCurrency, b.InvoiceCurrency];
            break;
          case 'NetAmount':
            [propertyA, propertyB] = [a.NetAmount, b.NetAmount];
            break;
        }
        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
        return (
          (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1)
        );
      });
    }
}
