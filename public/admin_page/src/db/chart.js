
const Now = new Date();
        const yearNow = Now.getFullYear();
        const dayNow = Now.getDate();
        const MonthNow = Now.getMonth()+1;
        
        const prevLast = new Date(yearNow, MonthNow, 0).getDate();
        const thisLast = new Date(yearNow, MonthNow + 1, 0).getDate();

function preMon(n){
  const mon = dayNow-n<=0?MonthNow-1:MonthNow;
  return mon
}
function preDay(n){
  const day = dayNow-n<=0?dayNow-n+prevLast:dayNow-n;
  return day
}

function nextMon(){
  const mon = dayNow+1<thisLast?MonthNow:MonthNow+1;
  return mon
}

function nextDay(){
  const day = dayNow+1<thisLast?dayNow+1:dayNow+1-thisLast;
  return day
}

/**/
$(document).ready(function(){
  let tableData = [];
  let tableData_violation
  = [];

  // 페이지 로드 시 사용자 데이터 가져오기
  $.ajax({
      url: '/admin/api/upso', // 서버에서 사용자 데이터를 가져올 엔드포인트
      method: 'GET',
      success: function(data) {
        
          tableData = data.upso; 

          let addresses = []; // 주소 배열 추가

          /*표에 쓰일 배열들 생성*/
          // rank와 addr에 대한 객체 생성
          let ranks = {};
          let addrs = {};

          // 
          let rankdata = [];
          let ranklabel = [];

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

          // addrs 객체를 순회하며 배열에 데이터 추가
          for (const address in addrs) {
              addresses.push(address);
          }


          for (let i in ranks){
            ranklabel.push(i)
            rankdata.push(ranks[i])
          }


          /* ChartJS
           * -------
           * Data and config for chartjs
           */

  /*도넛 차트 데이터*/
  var doughnutPieData = {
    datasets: [{
      data: rankdata,
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
    labels: ranklabel
  };
  var doughnutPieOptions = {
      responsive: true,
      animation: {
      animateScale: true,
      animateRotate: true
    }
  };
  /*끝 */
  /*데이터 호출*/
  let linelabels = Object.keys(ranks);
  /*데이터 셋 초기화*/
  let linedatasets = [];

  /*선 색상*/
  const colors = ['#0930ED', '#0978ED', '#2DB3FE', '#FF33EA', '#33EAFF', '#EAFF33'];
  // 각 등급에 대해 데이터셋 생성
  for (let i = 0; i < linelabels.length; i++) {
      let rank = linelabels[i];
      let dataEntry = {
          label: rank, // 등급 레이블을 label로 설정
          data: [], // 데이터 배열 초기화
          borderColor: colors[i % colors.length],
          borderWidth: 2,
          fill: false
      };

      // 주소 배열 순회
      for (const address in addrs) {
          dataEntry.data.push(addrs[address][rank] || 0); // 해당하는 키가 없으면 0을 집어넣음
      }

      // 데이터셋 배열에 데이터셋 추가
      linedatasets.push(dataEntry);
  }

  const mainupsotable = document.querySelector('#mainupsotable');
  mainupsotable.innerHTML = '';
  
  console.log('되나',addresses)
  console.log('되나2',linedatasets)
  for (let i = 0; i < addresses.length; i++) {
    let address = addresses[i];
    let newElements = `
        <tr>
            <td>${address}</td>`;
    
    // 각 라벨에 대한 데이터를 추가
    linedatasets.forEach(dataset => {
        newElements += `<td>${dataset.data[i]}</td>`;
    });
    
    // 행을 완성하고 테이블에 추가
    newElements += `</tr>`;
    mainupsotable.innerHTML += newElements;
}
  /*종료*/
  /*각 구 별로 */
  var multiLineData = {
    labels: addresses,
    datasets: linedatasets
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

  /*일별 이용자수 차트, 데이터*/
  'use strict';
  var data = {
    labels: [`${preMon(4)}.${preDay(4)}`,`${preMon(3)}.${preDay(3)}`, `${preMon(2)}.${preDay(2)}`,`${preMon(1)}.${preDay(1)}`, `${MonthNow}.${dayNow}`, `${nextMon(1)}.${nextDay(1)}`],
    datasets: [{
      label: '# 이용자 수',
      /*D연동파트1 */
      data: [10, 23,4,18,22,0],
      backgroundColor: [
        '#BDF3FF',
        '#BDF3FF',
        '#BDF3FF',
        '#BDF3FF',
        '#55ddff',
        '#BDF3FF'
      ],
      borderColor: [
        '#55ddff',
        '#55ddff',
        '#55ddff',
        '#55ddff',
        '#2DB3FE',
        '#55ddff'
      ],
      borderWidth: 2,
      fill: false
    }]
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

  var dataDark = {
    labels: ["2013", "2014", "2014", "2015", "2016", "2017"],
    datasets: [{
      label: '# of Votes',
      data: [10, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1,
      fill: false
    }]
  };

  // Get context with jQuery - using jQuery's .get() method.
  if ($("#barChart").length) {
    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: data,
      options: options
    });
  }

  if ($("#barChartDark").length) {
    var barChartCanvasDark = $("#barChartDark").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChartDark = new Chart(barChartCanvasDark, {
      type: 'bar',
      data: dataDark,
      options: optionsDark
    });
  }
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
}
  });
})