// charts.jsx
export const patientReadmissionChart = {
  data: (canvas) => {
    return {
      labels: [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Week 8",
        "Week 9",
        "Week 10",
      ],
      datasets: [
        {
          label: "Readmission Rate",
          borderColor: "#f17e5d",
          backgroundColor: "#f17e5d",
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          data: [12, 15, 14, 18, 20, 19, 21, 23, 25, 22],
        },
      ],
    };
  },
  options: {
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        ticks: {
          color: "#9f9f9f",
          beginAtZero: true,
          maxTicksLimit: 7,
        },
        grid: {
          drawBorder: false,
          display: true,
        },
      },
      x: {
        barPercentage: 1.6,
        grid: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          padding: 10,
          color: "#9f9f9f",
        },
      },
    },
  },
};

export const patientRiskDistributionChart = {
  data: (canvas) => {
    return {
      labels: ["Low Risk", "Medium Risk", "High Risk"],
      datasets: [
        {
          label: "Risk Levels",
          backgroundColor: ["#4acccd", "#fcc468", "#ef8157"],
          borderWidth: 0,
          data: [50, 35, 15],
        },
      ],
    };
  },
  options: {
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  },
};

export const totalAdmissionsChart = {
  data: (canvas) => {
    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Admissions",
          data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354, 370, 380],
          fill: false,
          borderColor: "#85c1e9",
          backgroundColor: "transparent",
          pointBorderColor: "      ",
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Readmissions",
          data: [30, 34, 31, 29, 27, 25, 28, 26, 24, 23, 22, 21],
          fill: false,
          borderColor: "#ef8157",
          backgroundColor: "transparent",
          pointBorderColor: "red",
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  },
  options: {
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        ticks: {
          color: "#9f9f9f",
          beginAtZero: true,
          maxTicksLimit: 7,
        },
        grid: {
          drawBorder: false,
          display: true,
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          padding: 10,
          color: "#9f9f9f",
        },
      },
    },
  },
};
