/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Registrar los elementos necesarios para Chart.js v3
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

var mode = "light"; //(themeMode) ? themeMode : 'light';
var fonts = {
  base: "Open Sans",
};

// Colors
var colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529",
  },
  theme: {
    default: "#172b4d",
    primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340",
  },
  black: "#12263F",
  white: "#FFFFFF",
  transparent: "transparent",
};

// Chart.js global options
function chartOptions() {
  // Options
  var options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        backgroundColor: colors.theme["primary"],
      },
      line: {
        tension: 0.4,
        borderWidth: 4,
        borderColor: colors.theme["primary"],
        backgroundColor: colors.transparent,
      },
      rectangle: {
        backgroundColor: colors.theme["warning"],
      },
      arc: {
        backgroundColor: colors.theme["primary"],
        borderColor: mode === "dark" ? colors.gray[800] : colors.white,
        borderWidth: 4,
      },
    },
    scales: {
      y: {
        grid: {
          color: mode === "dark" ? colors.gray[900] : colors.gray[300],
          drawBorder: false,
          drawTicks: false,
          lineWidth: 0,
          zeroLineWidth: 0,
          zeroLineColor: mode === "dark" ? colors.gray[900] : colors.gray[300],
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
          callback: function (value) {
            if (!(value % 10)) {
              return value;
            }
          },
        },
      },
      x: {
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          padding: 20,
        },
      },
    },
  };

  return options;
}

// Parse global options
function parseOptions(parent, options) {
  for (var item in options) {
    if (typeof options[item] !== "object") {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
}

// Example 1 of Chart inside src/views/Index.js (Sales value - Card)
let chartExample1 = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || "";
            var value = context.parsed.y;
            var content = "";

            if (context.dataset.label) {
              content += label;
            }

            content += "$" + value + "k";
            return content;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: colors.gray[900],
          zeroLineColor: colors.gray[900],
        },
        ticks: {
          callback: function (value) {
            if (!(value % 10)) {
              return "$" + value + "k";
            }
          },
        },
      },
      x: {
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
    },
  },
  data1: () => {
    return {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
          borderColor: colors.theme.primary,
          backgroundColor: colors.theme.primary,
          tension: 0.4,
          borderWidth: 4,
        },
      ],
    };
  },
  data2: () => {
    return {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 5, 25, 10, 30, 15, 40, 40],
          borderColor: colors.theme.primary,
          backgroundColor: colors.theme.primary,
          tension: 0.4,
          borderWidth: 4,
        },
      ],
    };
  },
};

// Example 2 of Chart inside src/views/Index.js (Total orders - Card)
let chartExample2 = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || "";
            var value = context.parsed.y;
            var content = "";
            if (context.dataset.label) {
              content += label;
            }
            content += value;
            return content;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            if (!(value % 10)) {
              return value;
            }
          },
        },
      },
      x: {
        grid: {
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
    },
  },
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [25, 20, 30, 22, 17, 29],
        backgroundColor: colors.theme.warning,
        borderColor: colors.theme.warning,
        borderWidth: 1,
        maxBarThickness: 10,
      },
    ],
  },
};

export {
  chartOptions, // used inside src/views/Index.js
  parseOptions, // used inside src/views/Index.js
  chartExample1, // used inside src/views/Index.js
  chartExample2, // used inside src/views/Index.js
};
