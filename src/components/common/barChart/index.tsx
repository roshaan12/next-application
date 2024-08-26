import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type IProps = {
    data: number[],
    labels: string[]
}

const BarChart = ({ data, labels }: IProps) => {
    // Define chart options
    const chartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',  // Similar to barThickness
                distributed: true // Ensure colors are distributed among the bars
            },
        },
        colors: [
            '#FF6384', // Token Issued
            '#36A2EB', // Fuel Veh Pak to Iran
            '#FFCE56', // Fuel Veh Iran to Pak
            '#4BC0C0', // Pedestrian Pak to Iran
            '#9966FF', // Pedestrian Iran to Pak
            '#FF9F40', // Trade Xing Pak to Iran
            '#FFCD56', // Trade Xing Iran to Pak
        ],
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: labels,
            labels: {
                style: {
                    colors: [
                        '#FF6384', // Token Issued
                        '#36A2EB', // Fuel Veh Pak to Iran
                        '#FFCE56', // Fuel Veh Iran to Pak
                        '#4BC0C0', // Pedestrian Pak to Iran
                        '#9966FF', // Pedestrian Iran to Pak
                        '#FF9F40', // Trade Xing Pak to Iran
                        '#FFCD56', // Trade Xing Iran to Pak
                    ],
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Counts',
            },
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} counts`,
            },
        },
        legend: {
            show: false // Hide legend to avoid confusion with distributed colors
        }
    };

    // Define chart series
    const chartSeries = [{
        name: 'Counts',
        data: data,
    }];

    // Render the Bar chart
    return (
        <div id="chart">
            <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
    );
};

export default BarChart;
