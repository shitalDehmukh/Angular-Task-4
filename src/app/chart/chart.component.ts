import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables, ChartConfiguration } from 'chart.js';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {


  @ViewChild('chartCanvas') chartCanvas: ElementRef<HTMLCanvasElement> | undefined;

  chartForm: FormGroup;
  value1: number | null = null;
  value2: number | null = null;
  chartVisible: boolean = false;
  validationMessage: string = '';
  chartInstance: Chart | undefined;

  constructor() {
    Chart.register(...registerables);
    this.chartForm = new FormGroup({
      value1: new FormControl(null, [Validators.required, Validators.max(100)]),
      value2: new FormControl(null, [Validators.required, Validators.max(100)]),
    })
  }

  ngAfterViewInit(): void {
    this.createChart();
  }
  calculateRemainingValue(): void {
    const value1 = this.chartForm?.get('value1')?.value;
    const value2 = this.chartForm?.get('value2')?.value;

    if (value1 > 100) {
      this.validationMessage = 'Value cannot exceed 100.';
      return;
    }
    if (value2 > 100) {
      this.validationMessage = 'Value cannot exceed 100.';
      return;
    }
    if (value1 && !value2) {
      this.chartForm?.patchValue({ value2: 100 - value1 });
    } else if (!value1 && value2) {
      this.chartForm?.patchValue({ value1: 100 - value2 });
    }
    this.validationMessage = '';
  }
  createChart(): void {
    if (this.value1 && this.value2 && (this.value1 + this.value2) <= 100 && this.chartCanvas) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');

      if (!ctx) {
        console.error('Could not get canvas context.');
        return;
      }

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const data = {
        labels: ['Box1', 'Box2'],
        datasets: [
          {
            data: [this.value1, this.value2],
            backgroundcolor: ['blue', 'hotpink']
          }
        ]
      };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRation: 0.5
      };
      const chartConfig: ChartConfiguration = {
        type: 'pie',
        data, options
      };
      this.chartInstance = new Chart(ctx, chartConfig);
      this.chartVisible = true;
    }
  }
}



