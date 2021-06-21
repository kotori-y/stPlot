/*
 * @Description:
 * @Author: Kotori Y
 * @Date: 2021-06-21 16:43:58
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-06-21 21:17:51
 * @FilePath: \statistic-plot\static\scripts\renderStatistic.js
 * @AuthorMail: kotori@cbdd.me
 */

const renderPiPlot = (dataPath, querySelectorID, title, type = "actions") => {
  const colorConfig = {
    actions: new Map([
      ["absorption", "#579572"],
      ["distribution", "#c45a65"],
      ["metabolism", "#1491a8"],
      ["excretion", "#8a988e"],
      ["synergistic effect", "#cf7543"],
      ["antagonistic effect", "#61649f"],
      ["others", "#f9d27d"],
      ["unknown", "#b5aa90"],
    ]),
    level: new Map([
      ["Major", "#a8456b"],
      ["Moderate", "#ddc871"],
      ["Minor", "#83a78d"],
      ["Unknown", "#b6b2b2"],
    ]),
  };

  $.getJSON(dataPath, function (countData) {
    var chartDom = document.getElementById(querySelectorID);
    var myChart = echarts.init(chartDom);
    var option;

    console.log(countData);
    const inputData = [];
    for (const [name, value] of Object.entries(countData)) {
      inputData.push({
        name: name,
        value: value,
        itemStyle: {
          color: colorConfig[type].get(name),
        },
        tooltip: {
          backgroundColor: colorConfig[type].get(name),
          textStyle: {
            color: "white",
          },
        },
      });
    }

    option = {
      title: {
        text: title,
        left: "left",
      },
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c} ({d}%)",
      },
      label: {
        fontSize: 18,
      },
      shadowColor: "rgba(0, 0, 0, 0.5)",
      shadowBlur: 2,
      series: [
        {
          type: "pie",
          radius: "65%",
          center: ["50%", "50%"],
          selectedMode: "multiple",
          data: inputData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);
  });
};

const genStackedBarPlotData = (data) => {
  const countKeys = new Map([
    ["[0,50)", "#61649f"],
    ["[50,100)", "#8076a3"],
    ["[100,200)", "#a7a8bd"],
    ["[200,300)", "#2775b6"],
    ["[300,400)", "#619ac3"],
    ["[400,600)", "#93b5cf"],
    ["[600, )", "#a8456b"],
  ]);

  const atcs = [
    "A",
    "B",
    "C",
    "D",
    "G",
    "H",
    "J",
    "L",
    "M",
    "N",
    "P",
    "R",
    "S",
    "V",
    "U",
  ];

  const barData = [];

  for (const [key, color] of countKeys.entries()) {
    const temp = {
      name: key,
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      areaStyle: {
        opacity: 0.8,
      },
      smooth: true,
      color: color,
      // showSymbol: false,
      data: [],
    };
    for (const atc of atcs) {
      temp.data.push(data[atc][key]);
    }
    barData.push(temp);
  }

  return [barData, Array.from(countKeys.keys()), atcs];
};

const renderStackedBarPlot = (dataPath, querySelectorID, title) => {
  $.getJSON(dataPath, function (data) {
    const [barData, legend, cates] = genStackedBarPlotData(data);

    var chartDom = document.getElementById(querySelectorID);
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: title,
        left: "left",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // Use axis to trigger tooltip
          type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
        },
      },
      legend: {
        data: legend,
        top: "bottom",
        // padding: -10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "5%",
        containLabel: true,
      },
      yAxis: {
        type: "value",
      },
      xAxis: {
        type: "category",
        data: cates,
      },
      series: barData,
      labelLayout: {
        hideOverlap: true,
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          dataView: { readOnly: true },
          magicType: { type: ["bar", "line"] },
          restore: {},
          saveAsImage: {},
        },
      },
    };

    option && myChart.setOption(option);
  });
};

const renderStatistic = () => {
  renderPiPlot(
    "static/data/actionCount.json",
    "actionPiPlot",
    "Statistics of Interaction Mechanism"
  );
  renderPiPlot(
    "static/data/levelCount.json",
    "levelPiPlot",
    "Statistics of Risk Level",
    "level"
  );
  renderStackedBarPlot("static/data/atcCount.json", "atcStacked", "Node Degree Statistics of Each ATC Classification");
};
