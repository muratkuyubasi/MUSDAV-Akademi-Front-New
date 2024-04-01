import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-web-analytics',
  templateUrl: './web-analytics.component.html',
  styleUrls: ['./web-analytics.component.scss']
})
export class WebAnalyticsComponent implements OnInit {

    constructor() {}

    ngOnInit() {
        const options = {
            chart: {
                height: 500,
                type: 'area',
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#008FFB', '#18D2B7'],
            stroke: {
                curve: 'smooth'
            },
            series: [{
                name: 'Listings Views',
                data: [50, 70, 90, 65, 75, 50, 80]
            }, {
            name: 'Bookings',
                data: [40, 60, 80, 55, 65, 40, 70]
            }],
            xaxis: {
                categories: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],                
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            }
        }
        const chart = new ApexCharts(
            document.querySelector("#web-analytics-chart"),
            options
        );
        chart.render();
    }

}