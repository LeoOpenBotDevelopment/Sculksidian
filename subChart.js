(function () {
const chartHeight = document.querySelector("#subStats .chartHeight");
const chartContent = document.querySelector("#subStats .chartContent");
const chartWidth = document.querySelector("#subStats .chartWidth");
const chartPointObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll("#subStats .point").forEach(point  => {
                point.style.visibility = "visible";
                point.style.animation = "none";
                void point.offsetWidth;
                point.style.animation = "subChartPointAnimation 1s ease";
            });
        } else {
            document.querySelectorAll("#subStats .point").forEach(point  => {
                point.style.visibility = "hidden";
            });
        }
    });
});
chartPointObserver.observe(chartContent);
function getDateSeries(startStr) {
    const parseEU = (s) => {
        const [d, m, y] = s.split("/").map(Number);
        return new Date(y, m - 1, d);
    };
    
    const formatEU = (date) => {
        const d = String(date.getDate()).padStart(2, "0");
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };
    
    const start = parseEU(startStr);
    const end = new Date();
    
    const totalMs = end - start;
    const step = totalMs / 4; // 10 dates → 9 gaps
    
    const result = [];
    
    for (let i = 0; i <= 4; i++) {
        const date = new Date(start.getTime() + step * i);
        result.push(formatEU(date));
    }
    
    return result;
}
fetch("subs.json")
    .then(res => res.json())
    .then(data => {
        const sum = data.reduce((acc, n) => acc + n, 0);
        document.querySelector("#subscribers").textContent = sum;
        const highest = Math.max(...data);
        for (let i = 0; i <= 2; i++) {
            const newHeightpoint = highest / 2 * i;
            const newSpan = document.createElement("span");
            newSpan.textContent = newHeightpoint;
            chartWidth.appendChild(newSpan);
        }
        data.forEach(point => {
            const newBar = document.createElement("div");
            const percentage = point / highest * 100;
            newBar.style.width = percentage + "%";
            newBar.innerHTML = point + " sub*s <br>" + percentage + "%";
            newBar.className = "point";
            if (percentage < 40) {
                newBar.classList.add("red");
            } else if (percentage < 60) {
                newBar.classList.add("orange");
            } else {
                newBar.classList.add("green");
            }
            chartContent.appendChild(newBar);
        });
        const widthData = getDateSeries("11/01/2026");
        widthData.forEach(date => {
            const newSpan = document.createElement("span");
            newSpan.textContent = date;
            chartHeight.appendChild(newSpan);
        });
    })
    .catch(err => {
        console.error(err);
    });
})();
