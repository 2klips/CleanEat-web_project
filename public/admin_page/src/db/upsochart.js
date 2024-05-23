let tableData = [];
let rKey = []; //랭크 데이터 키 추출
let rank = {}; //랭크 배열

// 페이지 로드 시 사용자 데이터 가져오기
$(document).ready(function(){
  $.ajax({
      url: '/admin/api/admin', // 서버에서 사용자 데이터를 가져올 엔드포인트
      method: 'GET',
      success: function(data) {
        tableData = data.upso; 
        console.log(tableData);

        /*표에 쓰일 배열들 생성*/
         // rank와 addr에 대한 객체 생성
         let ranks = {};
         let addrs = {};

         // 데이터를 순회하며 rank와 addr 객체 생성
         tableData.forEach(function(item) {
             // rank 객체에 데이터 추가
             if (ranks[item.rank]) {
              ranks[item.rank]++;
          } else {
              ranks[item.rank] = 1;
          }

          // addr 객체에 데이터 추가 및 세분화
          if (!addrs[item.addr.split(' ')[1]]) {
              addrs[item.addr.split(' ')[1]] = {};
          }
          if (addrs[item.addr.split(' ')[1]][item.rank]) {
              addrs[item.addr.split(' ')[1]][item.rank]++;
          } else {
              addrs[item.addr.split(' ')[1]][item.rank] = 1;
          }
      });

      console.log('Ranks:', ranks); // rank 객체 출력
      console.log('Addrs:', addrs); // addr 객체 출력
      },
      error: function(err) {
          console.error('Error fetching upso data:', err);
      }
  });
});

$(function () {
    
    /* ChartJS
     * -------
     * Data and config for chartjs

    'use strict';
   
    /*도넛 차트 데이터*/
    var doughnutPieData = {
      datasets: [{
        data: [30, 40, 30],
        backgroundColor: [
          '#BDF3FF',
          '#55ddff',
          '#FFAEC9'
        ],
        borderColor: [
          '#0AB4FF',
          '#0978ED',
          '#C00000'
        ],
      }],
  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [1,2,3,4]
    };
    var doughnutPieOptions = {
      responsive: true,
      animation: {
        animateScale: true,
        animateRotate: true
      }
    };
    /*끝 */

    var multiLineData = {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange","Red", "Blue", "Yellow", "Green", "Purple", "Orange","Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '2성',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: [
          '#587ce4'
        ],
        borderWidth: 2,
        fill: false
      },
      {
        label: '3성',
        data: [5, 23, 7, 12, 42, 23],
        borderColor: [
          '#ede190'
        ],
        borderWidth: 2,
        fill: false
      },
      {
        label: '모범 음식점',
        data: [15, 10, 21, 32, 12, 33],
        borderColor: [
          '#f44252'
        ],
        borderWidth: 2,
        fill: false
      },
      {
        label: '기타',
        data: [5, 1, 2, 3, 2, 3],
        borderColor: [
          '#f44252'
        ],
        borderWidth: 2,
        fill: false
      }
      ]
    };
    var options = {
      scales: {
        y: {
          ticks: {
            beginAtZero: true
          }
        }
      },
      legend: {
        display: false
      },
      elements: {
        line: {
          tension: 0.5
        },
        point: {
          radius: 0
        }
      }
  
    };
    var optionsDark = {
      scales: {
        y: {
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: '#322f2f',
            zeroLineColor: '#322f2f'
          }
        },
        x: {
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: '#322f2f',
          }
        },
      },
      legend: {
        display: false
      },
      elements: {
        line: {
          tension: 0.5
        },
        point: {
          radius: 0
        }
      }
  
    };

    // Get context with jQuery - using jQuery's .get() method.
  
    if ($("#lineChart").length) {
      var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
      var lineChart = new Chart(lineChartCanvas, {
        type: 'line',
        data: multiLineData,
        options: options
      });
    }
  
    if ($("#lineChartDark").length) {
      var lineChartCanvasDark = $("#lineChartDark").get(0).getContext("2d");
      var lineChartDark = new Chart(lineChartCanvasDark, {
        type: 'line',
        data: dataDark,
        options: optionsDark
      });
    }
  
    if ($("#linechart-multi").length) {
      var multiLineCanvas = $("#linechart-multi").get(0).getContext("2d");
      var lineChart = new Chart(multiLineCanvas, {
        type: 'line',
        data: multiLineData,
        options: options
      });
    }
  
    if ($("#doughnutChart").length) {
      var doughnutChartCanvas = $("#doughnutChart").get(0).getContext("2d");
      var doughnutChart = new Chart(doughnutChartCanvas, {
        type: 'doughnut',
        data: doughnutPieData,
        options: doughnutPieOptions
      });
    }
  });
  