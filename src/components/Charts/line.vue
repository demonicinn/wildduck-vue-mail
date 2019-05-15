<template>
  <div :class="className" :id="id" :style="{height:height,width:width}">
  </div>
</template>
<script>
// Introduce ECharts Main module
const echarts = require('echarts/lib/echarts');
// Import map
require('echarts/lib/chart/line');
// Introducing a prompt box and title component
require('echarts/lib/component/markLine');
require('echarts/lib/component/markPoint');
require('echarts/lib/component/tooltip');
export default {
  name: 'lineChart',
  props: {
    className: {
      type: String,
      default: 'line-chart'
    },
    id: {
      type: String,
      default: 'line-chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '280px'
    },
    listData: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    listData(dataList) {
      this.setLine(dataList)
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.id));
    this.setLine(this.listData);
  },
  methods: {
    setLine(dataList) {
      const xAxisData = [];
      const receiveData = [];
      const sendData = [];
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i]
        xAxisData.push(item.week.substring(item.week.length - 2) + ' week');
        receiveData.push(item.receiveCount);
        sendData.push(item.sendCount);
      }
      const markLineReceive = [];
      const markLineSend = [];
      for (let i = 1; i < receiveData.length; i++) {
        markLineReceive.push([{
          xAxis: i - 1,
          yAxis: receiveData[i - 1],
          value: receiveData[i] - receiveData[i - 1]
        }, {
          xAxis: i,
          yAxis: receiveData[i]
        }]);
      }
      for (let i = 1; i < sendData.length; i++) {
        markLineSend.push([{
          xAxis: i - 1,
          yAxis: sendData[i - 1],
          value: sendData[i] - sendData[i - 1]
        }, {
          xAxis: i,
          yAxis: sendData[i]
        }]);
      }
      this.chart.setOption({
        title: {
          text: 'Awesome Chart'
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        animationDelay: 1000,
        xAxis: {
          data: xAxisData,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
          // axisLabel:{
          //   show:false
          // },
        },

        yAxis: {
          splitLine: {
            show: false
          },
          show: false
          // min: 90
        },
        series: [
          {
            name: 'Number of receipts',
            type: 'line',
            data: receiveData,
            markPoint: {
              data: [
                { type: 'max', name: 'Maximum' },
                { type: 'min', name: 'Minimum' }
              ]
            },
            itemStyle: {
              normal: {
                color: '#30b08f'
              }
            },
            markLine: {
              silent: true,
              smooth: true,
              effect: {
                show: true
              },
              animationDuration(idx) {
                return idx * 100;
              },
              animationDelay: 1000,
              animationEasing: 'quadraticInOut',
              distance: 1,
              label: {
                normal: {
                  position: 'middle'
                }
              },
              symbol: ['none', 'none'],
              data: markLineReceive
            }
          },
          {
            name: 'Number of shipments',
            type: 'line',
            data: sendData,
            markPoint: {
              data: [
                { type: 'max', name: 'maximum' },
                { type: 'min', name: 'Minimum' }
              ]
            },
            itemStyle: {
              normal: {
                color: '#F08A5D'
              }
            },
            markLine: {
              silent: true,
              smooth: true,
              effect: {
                show: true
              },
              animationDuration(idx) {
                return idx * 100;
              },
              animationDelay: 1000,
              animationEasing: 'quadraticInOut',
              distance: 1,
              label: {
                normal: {
                  position: 'middle'
                }
              },
              symbol: ['none', 'none'],
              data: markLineSend
            }
          }
        ]
      })
    }
  }
}
</script>
