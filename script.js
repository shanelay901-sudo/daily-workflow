// =========================
// ELEMENTS
// =========================

const tasks =
document.querySelectorAll(".task");

const progressText =
document.getElementById("progressText");

const progressCircle =
document.getElementById("progressCircle");

const calendar =
document.getElementById("calendar");

const avgProgress =
document.getElementById("avgProgress");

const bestDay =
document.getElementById("bestDay");

const completedDays =
document.getElementById("completedDays");

const currentStreak =
document.getElementById("currentStreak");

const bestStreak =
document.getElementById("bestStreak");

// =========================
// DATE
// =========================

const today =
new Date().toISOString().split("T")[0];

// =========================
// LOAD DATA
// =========================

let workflowData =
JSON.parse(
localStorage.getItem("workflowData")
) || {};

// =========================
// LOAD TASKS
// =========================

function loadTasks(){

if(!workflowData[today]){

workflowData[today] = {
tasks:[],
progress:0
};

}

const savedTasks =
workflowData[today].tasks;

tasks.forEach((task,index)=>{

task.checked =
savedTasks[index] || false;

});

}

// =========================
// SAVE TASKS
// =========================

function saveTasks(){

workflowData[today].tasks =
[];

tasks.forEach(task=>{

workflowData[today].tasks.push(
task.checked
);

});

localStorage.setItem(
"workflowData",
JSON.stringify(workflowData)
);

}

// =========================
// UPDATE PROGRESS
// =========================

function updateProgress(){

let total =
tasks.length;

let completed =
document.querySelectorAll(
".task:checked"
).length;

let percent =
Math.round(
(completed/total)*100
);

progressText.innerText =
percent + "%";

const circumference =
471;

const offset =
circumference -
(percent/100)*circumference;

progressCircle.style.strokeDashoffset =
offset;

workflowData[today].progress =
percent;

saveTasks();

updateStatistics();

renderCalendar();

}

// =========================
// CALENDAR
// =========================

function renderCalendar(){

calendar.innerHTML = "";

Object.keys(workflowData)
.reverse()
.slice(0,35)
.forEach(date=>{

let progress =
workflowData[date].progress;

let day =
document.createElement("div");

day.classList.add("day");

if(progress >= 90){

day.classList.add("green");

}
else if(progress >= 70){

day.classList.add("blue");

}
else if(progress >= 40){

day.classList.add("yellow");

}
else{

day.classList.add("red");

}

let dayNumber =
new Date(date).getDate();

day.innerHTML =
`
<div>${dayNumber}</div>
<small>${progress}%</small>
`;

day.title =
date + " : " +
progress + "%";

calendar.appendChild(day);

});

}

// =========================
// STATS
// =========================

function calculateStreaks(){

const dates =
Object.keys(workflowData)
.sort();

let current = 0;
let best = 0;

dates.forEach(date=>{

if(workflowData[date].progress === 100){

current++;

if(current > best){

best = current;

}

}else{

current = 0;

}

});

currentStreak.innerText =
current;

bestStreak.innerText =
best;

}

function updateStatistics(){

const data =
Object.values(workflowData);

if(data.length === 0){

return;

}

let total = 0;

let best = 0;

let completed = 0;

data.forEach(item=>{

total += item.progress;

if(item.progress > best){

best =
item.progress;

}

if(item.progress === 100){

completed++;

}

});

let average =
Math.round(
total/data.length
);

avgProgress.innerText =
average + "%";

bestDay.innerText =
best + "%";

completedDays.innerText =
completed;

calculateStreaks();

}

// =========================
// DAILY RESET
// =========================

function checkNewDay(){

const savedDate =
localStorage.getItem(
"lastDate"
);

if(savedDate !== today){

tasks.forEach(task=>{

task.checked = false;

});

localStorage.setItem(
"lastDate",
today
);

saveTasks();

}

}

// =========================
// EVENTS
// =========================

tasks.forEach(task=>{

task.addEventListener(
"change",
updateProgress
);

});

// =========================
// INIT
// =========================

checkNewDay();

loadTasks();

updateProgress();

renderCalendar();

updateStatistics();

renderMonthlyGraph();

function renderMonthlyGraph(){

const ctx =
document.getElementById("monthlyChart");

if(!ctx) return;

const labels = [];
const values = [];

Object.keys(workflowData)
.sort()
.slice(-30)
.forEach(date=>{

labels.push(
new Date(date).getDate()
);

values.push(
workflowData[date].progress
);

});

new Chart(ctx,{

type:"line",

data:{
labels:labels,

datasets:[{
label:"Progress %",
data:values,
tension:.4
}]
},

options:{
responsive:true,
plugins:{
legend:{
display:false
}
},
scales:{
y:{
beginAtZero:true,
max:100
}
}
}

});

}

const themeBtn =
document.getElementById("themeToggle");

themeBtn.addEventListener(
"click",
()=>{

document.body.classList.toggle(
"light"
);

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("light");

themeBtn.innerText =
document.body.classList.contains("light")
? "☀️"
: "🌙";

});

localStorage.setItem(
"theme",
document.body.classList.contains(
"light"
)
);

}
);

if(
localStorage.getItem("theme")
==="true"
){

document.body.classList.add(
"light"
);

}