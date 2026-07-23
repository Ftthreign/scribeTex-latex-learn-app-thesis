<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Target data to animate towards
const targetBarData = [85, 55, 70, 48, 38];
const targetLineData = [30, 45, 38, 62, 55, 78, 92];
const targetDonutData = [5, 3]; // 5 Active modules, 3 Draft modules from composable data

// Reactive series values initialized at 0 for scroll animation
const barSeries = ref([
  {
    name: "Modul Selesai (%)",
    data: [0, 0, 0, 0, 0],
  },
]);

const lineSeries = ref([
  {
    name: "Kunjungan",
    data: [0, 0, 0, 0, 0, 0, 0],
  },
]);

const donutSeries = ref([0, 0]);

// ApexCharts Configuration
const barOptions = {
  chart: {
    type: "bar" as const,
    toolbar: { show: false },
    fontFamily: "var(--font-sans)",
  },
  colors: ["var(--color-primary)"],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: "45%",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["LaTeX", "Tabel", "Math", "Biblio", "Grafik"],
    labels: {
      style: {
        colors: "var(--color-text-muted)",
        fontSize: "11px",
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: {
        colors: "var(--color-text-muted)",
        fontSize: "11px",
      },
    },
  },
  grid: {
    borderColor: "var(--color-border)",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    theme: "light",
  },
};

const lineOptions = {
  chart: {
    type: "area" as const,
    toolbar: { show: false },
    fontFamily: "var(--font-sans)",
  },
  colors: ["var(--color-primary)"],
  stroke: {
    curve: "smooth" as const,
    width: 2.5,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.2,
      opacityTo: 0,
      stops: [0, 100],
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    labels: {
      style: {
        colors: "var(--color-text-muted)",
        fontSize: "11px",
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: {
        colors: "var(--color-text-muted)",
        fontSize: "11px",
      },
    },
  },
  grid: {
    borderColor: "var(--color-border)",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    theme: "light",
  },
};

const donutOptions = {
  chart: {
    type: "donut" as const,
    fontFamily: "var(--font-sans)",
  },
  colors: ["var(--color-primary)", "var(--color-text-muted)"],
  labels: ["Aktif", "Draft"],
  dataLabels: {
    enabled: true,
    formatter: function (val: number, opts: any) {
      return opts.w.config.series[opts.seriesIndex];
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "12px",
            color: "var(--color-text-secondary)",
          },
          value: {
            show: true,
            fontSize: "18px",
            fontWeight: "bold",
            color: "var(--color-text-primary)",
            formatter: function (val: string) {
              return val;
            },
          },
          total: {
            show: true,
            label: "Total Modul",
            color: "var(--color-text-secondary)",
            formatter: function (w: any) {
              return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
            },
          },
        },
      },
    },
  },
  legend: {
    position: "bottom" as const,
    fontSize: "12px",
    labels: {
      colors: "var(--color-text-secondary)",
    },
  },
  tooltip: {
    theme: "light",
  },
};

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  // Animate the cards fade-in & upward shift
  gsap.from(".chart-card", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".charts-container",
      start: "top 85%",
    },
  });

  // Animate chart values from 0 using GSAP
  const animationObj = {
    bar0: 0, bar1: 0, bar2: 0, bar3: 0, bar4: 0,
    line0: 0, line1: 0, line2: 0, line3: 0, line4: 0, line5: 0, line6: 0,
    donut0: 0, donut1: 0
  };

  gsap.to(animationObj, {
    bar0: targetBarData[0],
    bar1: targetBarData[1],
    bar2: targetBarData[2],
    bar3: targetBarData[3],
    bar4: targetBarData[4],
    line0: targetLineData[0],
    line1: targetLineData[1],
    line2: targetLineData[2],
    line3: targetLineData[3],
    line4: targetLineData[4],
    line5: targetLineData[5],
    line6: targetLineData[6],
    donut0: targetDonutData[0],
    donut1: targetDonutData[1],
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".charts-container",
      start: "top 80%",
    },
    onUpdate: () => {
      barSeries.value = [{
        name: "Modul Selesai (%)",
        data: [
          Math.round(animationObj.bar0),
          Math.round(animationObj.bar1),
          Math.round(animationObj.bar2),
          Math.round(animationObj.bar3),
          Math.round(animationObj.bar4),
        ]
      }];
      
      lineSeries.value = [{
        name: "Kunjungan",
        data: [
          Math.round(animationObj.line0),
          Math.round(animationObj.line1),
          Math.round(animationObj.line2),
          Math.round(animationObj.line3),
          Math.round(animationObj.line4),
          Math.round(animationObj.line5),
          Math.round(animationObj.line6),
        ]
      }];

      donutSeries.value = [
        Math.round(animationObj.donut0),
        Math.round(animationObj.donut1)
      ];
    }
  });
});
</script>

<template>
  <div class="charts-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <!-- Distribusi Modul -->
    <div
      class="chart-card bg-(--color-surface) border border-border rounded-xl p-6 shadow-xs"
    >
      <h3 class="text-[14px] font-bold text-(--color-text-primary) mb-4">
        Distribusi Modul
      </h3>
      <div class="h-[220px]">
        <ClientOnly>
          <apexchart
            type="bar"
            height="100%"
            :options="barOptions"
            :series="barSeries"
          />
        </ClientOnly>
      </div>
    </div>

    <!-- Monitoring Traffic -->
    <div
      class="chart-card bg-(--color-surface) border border-border rounded-xl p-6 shadow-xs"
    >
      <h3 class="text-[14px] font-bold text-(--color-text-primary) mb-4">
        Monitoring Traffic
      </h3>
      <div class="h-[220px]">
        <ClientOnly>
          <apexchart
            type="area"
            height="100%"
            :options="lineOptions"
            :series="lineSeries"
          />
        </ClientOnly>
      </div>
    </div>

    <!-- Status Modul -->
    <div
      class="chart-card bg-(--color-surface) border border-border rounded-xl p-6 shadow-xs"
    >
      <h3 class="text-[14px] font-bold text-(--color-text-primary) mb-4">
        Status Modul
      </h3>
      <div class="h-[220px]">
        <ClientOnly>
          <apexchart
            type="donut"
            height="100%"
            :options="donutOptions"
            :series="donutSeries"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
