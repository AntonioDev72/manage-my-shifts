const currentUser = getCurrentUser();
const params = new URLSearchParams(window.location.search);
const slugToEdit = params.get("slug");

if (!currentUser) {
  window.location.href = "index.html";
}

const shifts = getShifts();

const shiftToEdit = shifts.find(function (shift){
  return shift.slug === slugToEdit;
});

const workplaces = [...new Set(shifts.map(s => s.workplace))];

const workplaceSelect = document.getElementById("workplace");
workplaces.forEach(function (place) {
  const option = document.createElement("option");
  option.value = place;
  option.textContent = place;
  workplaceSelect.appendChild(option);
});

workplaceSelect.addEventListener("change", function () {
  const newWorkplaceInput = document.getElementById("new-workplace");
  if (workplaceSelect.value === "__new__") {
    newWorkplaceInput.style.display = "block";
  } else {
    newWorkplaceInput.style.display = "none";
  }
});

function calculateHours(start, end) {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;

    const diffMinutes = endTotalMinutes - startTotalMinutes;
    return diffMinutes / 60;
}

document.getElementById("shift-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const ErrorEl = document.getElementById("error-message");

    const date = document.getElementById("shiftDate").value;
    const startTime = document.getElementById("shiftTime").value;
    const endTime = document.getElementById("shiftEndTime").value;
    const hourlyWage = document.getElementById("hourlyWage").value;
    const slug = document.getElementById("slug").value;
    const comments = document.getElementById("comments").value;

    let workplace = workplaceSelect.value;
    if (workplace === "__new__") {
      workplace = document.getElementById("new-workplace").value;
      if (!workplace) {
        ErrorEl.textContent = "Please enter a workplace name.";
        return;
      }
    }

    if(isSlugTaken(slug) && (!shiftToEdit || slug !== shiftToEdit.slug)) {
      ErrorEl.textContent = "This slug is already taken. Please choose another one.";
      return;
    }


    const hoursWorked = calculateHours(startTime, endTime);
    if (hoursWorked <= 0) {
        ErrorEl.textContent = "End time must be after start time.";
        return;
    }

    const totalEarning = hoursWorked * parseFloat(hourlyWage);

    const shift = {
      date,
      startTime,
      endTime,
      hourlyWage,
      slug,
      comments,
      workplace,
      totalEarning,
    };


    document.getElementById("progress-spinner").style.display = "block";
    
    setTimeout(() => {
      if (shiftToEdit) {
        updateShift(shiftToEdit.slug, shift);
        window.location.href = "home.html";
      } else {
        saveShift(shift);
        window.location.href = "home.html";
      }
    }, 800);
});

if(shiftToEdit) {
  document.getElementById("page-title").textContent = "Edit Shift";
  document.getElementById("shiftDate").value = shiftToEdit.date;
  document.getElementById("shiftTime").value = shiftToEdit.startTime;
  document.getElementById("shiftEndTime").value = shiftToEdit.endTime;
  document.getElementById("hourlyWage").value = shiftToEdit.hourlyWage;
  document.getElementById("slug").value = shiftToEdit.slug;
  document.getElementById("comments").value = shiftToEdit.comments;
  document.getElementById("workplace").value = shiftToEdit.workplace;
}