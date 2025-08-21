import { useState } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  const chartDataStudents = {
    labels: courses?.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  const chartIncomeData = {
    labels: courses?.map((course) => course.courseName),
    datasets: [
      {
        data: courses?.map((course) => course.totalAmountGenerated),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  // MODIFIED: Expanded options to include tooltips and animation
  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.chart.data.datasets[0].data.reduce((acc, current) => acc + current, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            // Dynamic label based on whether it's a student or income chart
            if (currChart === 'students') {
              return `${label}: ${value} students (${percentage}%)`;
            }
            return `${label}: ₹${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: 'top', // Added legend position
        labels: {
          color: '#e2e8f0', // Adjusting label color for dark theme
        },
      },
    },
    // Adding animation to the chart
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    cutout: '30%',
  };


  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
            }`}
        >
          Student
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
            }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-full w-full">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}
