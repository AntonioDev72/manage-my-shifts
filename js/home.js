const currentUser = getCurrentUser();

if (!currentUser) {
  window.location.href = "index.html";
} else {
  document.getElementById("welcome-message").textContent = currentUser.username;
}

function renderShifts(shifts) {
  const tbody = document.getElementById("shifts-table-body");
  tbody.innerHTML = "";

  shifts.forEach(function (shift) {
    const row = document.createElement("tr");
    row.addEventListener("click", function () {
        window.location.href = `add-shift.html?slug=${shift.slug}`;
    });
    row.innerHTML = `
      <td>${shift.date}</td>
      <td>${shift.startTime}</td>
      <td>${shift.endTime}</td>
      <td>${shift.hourlyWage}</td>
      <td>${shift.workplace}</td>
      <td>${shift.totalEarning.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}

function filterShifts() {
    const fromDate = document.getElementById("search-from").value;
    const toDate = document.getElementById("search-to").value;
    const slug = document.getElementById("search-slug").value;

    const filteredShifts = getShifts().filter(function (shift) {
        return (fromDate === "" || shift.date >= fromDate) &&
               (toDate === "" || shift.date <= toDate) &&
               (slug === "" || shift.slug.includes(slug));
    })

    renderShifts(filteredShifts);
}

document.getElementById("search-filters").addEventListener("input", function () {
  filterShifts();
});

function getHighestEarningMonth() {
  const shifts = getShifts();
  const earningsByMonth = {};

  shifts.forEach(function (shift) {
    const month = shift.date.slice(0, 7);
    if (!earningsByMonth[month]) {
      earningsByMonth[month] = 0;
    }
    earningsByMonth[month] += shift.totalEarning;
  });
  let bestMonth = null;
  let highestEarning = 0;

    Object.keys(earningsByMonth).forEach(function (month) {
    if (earningsByMonth[month] > highestEarning) {
        highestEarning = earningsByMonth[month];
        bestMonth = month;
    }
});
    return { bestMonth, highestEarning };
}


const result = getHighestEarningMonth();

let nameBestMonth = result.bestMonth.split("-")[1] === "01" ? "January" :
nameBestMonth = result.bestMonth.split("-")[1] === "02" ? "February" :
nameBestMonth = result.bestMonth.split("-")[1] === "03" ? "March" :
nameBestMonth = result.bestMonth.split("-")[1] === "04" ? "April" :
nameBestMonth = result.bestMonth.split("-")[1] === "05" ? "May" :
nameBestMonth = result.bestMonth.split("-")[1] === "06" ? "June" :
nameBestMonth = result.bestMonth.split("-")[1] === "07" ? "July" :
nameBestMonth = result.bestMonth.split("-")[1] === "08" ? "August" :
nameBestMonth = result.bestMonth.split("-")[1] === "09" ? "September" :
nameBestMonth = result.bestMonth.split("-")[1] === "10" ? "October" :
nameBestMonth = result.bestMonth.split("-")[1] === "11" ? "November" : 
nameBestMonth = result.bestMonth.split("-")[1] === "12" ? "December" : "";

document.getElementById("highest-earning-month").textContent = `The best month was ${nameBestMonth} with a total earning of $${result.highestEarning.toFixed(2)}.`;
renderShifts(getShifts());

document.getElementById("logout-btn").addEventListener("click", function () {
    clearCurrentUser();
    window.location.href = "index.html";
});