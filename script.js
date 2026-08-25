const inputBox = document.getElementById("input-box");
const deadlineBox = document.getElementById("deadline-box");
const timeBox = document.getElementById("time-box");
const listContainer = document.getElementById("list-container");

const clock = document.getElementById("clock");
const themeBtn = document.getElementById("theme-btn");

const addSound = document.getElementById("add-sound");
const checkSound = document.getElementById("check-sound");
const deleteSound = document.getElementById("delete-sound");

// ===================== ADD TASK =====================
function addTask() {

    if (inputBox.value.trim() === "") {
        alert("You must write something!");
        return;
    }

    let li = document.createElement("li");

    let task = document.createElement("div");
    task.textContent = inputBox.value;
    li.appendChild(task);

    // ===== Deadline tanggal + jam =====
    if (deadlineBox.value) {

        const deadline = new Date(
            `${deadlineBox.value}T${timeBox.value || "23:59"}`
        );

        const now = new Date();

        const tanggal = deadline.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        const jam = deadline.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        });

        let small = document.createElement("small");
        small.className = "deadline";

        if (deadline < now) {
            small.classList.add("overdue");
            small.innerHTML = `⚠️ Deadline: ${tanggal} • ${jam} (Overdue)`;
        } else {
            small.innerHTML = `📅 Deadline: ${tanggal} • ${jam}`;
        }

        li.appendChild(small);
    }

    let span = document.createElement("span");
    span.innerHTML = "×";
    li.appendChild(span);

    listContainer.appendChild(li);

    if (addSound) addSound.play();

    inputBox.value = "";
    deadlineBox.value = "";
    timeBox.value = "";

    saveData();
    updateStats();
}

// Tekan Enter untuk tambah tugas
inputBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// ===================== CLICK EVENT =====================
listContainer.addEventListener("click", function (e) {

    if (e.target.tagName === "LI") {

        e.target.classList.toggle("checked");

        if (checkSound) checkSound.play();

        saveData();
        updateStats();
    }

    else if (e.target.tagName === "SPAN") {

        if (deleteSound) deleteSound.play();

        e.target.parentElement.remove();

        saveData();
        updateStats();
    }

}, false);

// ===================== LOCAL STORAGE =====================
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
    updateStats();
}

// ===================== STATS & ACHIEVEMENT =====================
const achievement = document.createElement("div");
achievement.className = "achievement";
achievement.innerHTML = "🏆 Great Job! Semua tugas selesai!";
document.body.appendChild(achievement);

let alreadyCelebrated = false;

function updateStats() {

    const total = listContainer.querySelectorAll("li").length;
    const done = listContainer.querySelectorAll(".checked").length;

    if (total > 0 && total === done && !alreadyCelebrated) {

        alreadyCelebrated = true;

        achievement.classList.add("show");

        if (checkSound) checkSound.play();

        setTimeout(() => {
            achievement.classList.remove("show");
        }, 3000);
    }

    if (done !== total) {
        alreadyCelebrated = false;
    }
}

// ===================== CLOCK =====================
function updateClock() {
    if (clock) {
        clock.innerHTML = new Date().toLocaleTimeString("id-ID");
    }
}

setInterval(updateClock, 1000);
updateClock();

// ===== THEME =====
if (themeBtn) {

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
        themeBtn.innerHTML = "☀️";
    }

    themeBtn.onclick = () => {

        document.body.classList.toggle("light");

        if (document.body.classList.contains("light")) {
            themeBtn.innerHTML = "☀️";
            localStorage.setItem("theme", "light");
        } else {
            themeBtn.innerHTML = "🌙";
            localStorage.setItem("theme", "dark");
        }
    };
}

// ===== FILTER =====
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {

    btn.onclick = () => {

        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        document.querySelectorAll("#list-container li").forEach(li => {

            if (filter === "all") {
                li.style.display = "block";
            }

            else if (filter === "active") {
                li.style.display = li.classList.contains("checked") ? "none" : "block";
            }

            else {
                li.style.display = li.classList.contains("checked") ? "block" : "none";
            }
        });
    };
});

showTask();