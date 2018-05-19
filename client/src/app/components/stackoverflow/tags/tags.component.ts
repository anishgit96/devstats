import {Component, Input, OnInit} from '@angular/core';
import {TagsService} from "../../../services/stack/tags.service";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [TagsService]
})
export class TagsComponent implements OnInit {

  @Input() id: string;
   chartLabels: any[];
   chartData: any[];
   chart: any[];
   _hasData: boolean = true;
   chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: true,
      text: 'Tags per Topic (Top 100)'
    },
    legend: {
      labels: {
        fontColor: 'black',
        fontSize: 9
      },
      position: 'left'
    },
     layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
     }
  };
   chartColors: any[] = [
    {
      backgroundColor:["#0091ea"]
    }];

  constructor(protected tagsService: TagsService) {
    this.chart = [{data: [], labels:[]}];
    this.chartData = [];
    this.chartLabels = [];
    this._hasData = true;

    this.tagsService._get("4012073").subscribe(tags => {
        this.chartLabels = tags[0];
        this.chartData = tags[1];
        this.chart[0] = {data: tags[1], labels: tags[0]};
    });
  }

  ngOnInit() {}

  public _get() {
    setTimeout(() => {
      this.tagsService._get(this.id).subscribe(tags => {
        this._hasData = true;
        this.chartData = tags[1];
        this.chartLabels = tags[0];
        this.chart[0] = {data: tags[1], labels: tags[0]};
      });
    }, 2000);

  }

  public onChartClick(event) {
    console.log(event);
  }

  get hasData(): boolean {
    return this._hasData;
  }
}
