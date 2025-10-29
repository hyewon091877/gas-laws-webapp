// 🔹 탭 전환 기능
const tabButtons = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// 🔹 보일의 법칙
const pSlider = document.getElementById('pressure');
const pValue = document.getElementById('pressureValue');
const vValue = document.getElementById('volumeValue');
const boyleBalloon = document.getElementById('boyleBalloonSVG');
const boyleConst = 100;

const ctx1 = document.getElementById('boyleChart').getContext('2d');
const boyleChart = new Chart(ctx1, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'P vs V', data: [], borderColor: '#007bff' }] },
  options: { scales: { x: { title: { display: true, text: '압력 (atm)' } }, y: { title: { display: true, text: '부피 (L)' } } } }
});

pSlider.addEventListener('input', () => {
  const P = parseFloat(pSlider.value);
  const V = boyleConst / P;
  pValue.textContent = P.toFixed(1);
  vValue.textContent = V.toFixed(1);
  boyleBalloon.style.transform = `scale(${V / 100})`;
  boyleBalloon.style.transformOrigin = 'center center';

  boyleChart.data.labels.push(P);
  boyleChart.data.datasets[0].data.push(V);
  recordBoyleData(P, V);
  boyleChart.update();
});

// 🔹 샤를의 법칙
const tSlider = document.getElementById('temperature');
const tValue = document.getElementById('tempValue');
const vCharle = document.getElementById('charleVolumeValue');
const charleBalloon = document.getElementById('charleBalloonSVG');

// 기준 부피 (0°C일 때)
const V0 = 50;

const ctx2 = document.getElementById('charleChart').getContext('2d');
const charleChart = new Chart(ctx2, {
  type: 'line',
  data: { 
    labels: [], 
    datasets: [{ 
      label: '온도(°C) vs 부피(L)',
      data: [], 
      borderColor: '#ff6600',
      borderWidth: 2 
    }] 
  },
  options: { 
    scales: { 
      x: { title: { display: true, text: '온도 (°C)' } }, 
      y: { title: { display: true, text: '부피 (L)' } } 
    },
    plugins: {
      legend: { display: false }
    }
  }
});

tSlider.addEventListener('input', () => {
  const t = parseFloat(tSlider.value);  // 섭씨 온도
  const V = V0 * (1 + t / 273);         // 샤를의 법칙 실제 계산식
  tValue.textContent = t;
  vCharle.textContent = V.toFixed(1);
  // 풍선 크기 조절
  charleBalloon.style.transform = `scale(${V / V0})`;
  charleBalloon.style.transformOrigin = 'center center';
  // 풍선 색상 변경
  const ellipse = charleBalloon.querySelector('ellipse');
  // 온도에 따라 RGB 색상 변화 (0°C 파랑, 100°C 빨강)
  const r = Math.round(255 * (t / 100));       // 빨강 비율 증가
  const g = Math.round(200 * (1 - t / 100)); // 녹색 감소
  const b = Math.round(255 * (1 - t / 100));   // 파랑 비율 감소
  ellipse.setAttribute('fill', `rgb(${r},${g},${b})`);
  // 그래프 업데이트
  charleChart.data.labels.push(t);
  charleChart.data.datasets[0].data.push(V);
  recordCharleData(T, V);
  charleChart.update();
});

// 🔹 퀴즈 기능
const quizBox = document.getElementById('quizBox');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');

// ----------------------------
// 🎯 평가용 퀴즈 데이터 (15문항)
// ----------------------------
const allQuestions = [
  { question: "보일의 법칙에서 압력이 두 배가 되면 부피는?", options: ["2배", "1/2배", "변화 없음", "4배"], answer: 1 },
  { question: "샤를의 법칙의 그래프 형태는?", options: ["직선", "곡선", "수평선", "사인파"], answer: 0 },
  { question: "PV=일정 은 어떤 법칙?", options: ["보일의 법칙", "샤를의 법칙", "아보가드로 법칙", "기체 확산 법칙"], answer: 0 },
  { question: "온도가 높을수록 기체 분자는?", options: ["느려진다", "빠르다", "변화 없음", "정지한다"], answer: 1 },
  { question: "V∝T 은 어떤 법칙?", options: ["샤를의 법칙", "보일의 법칙", "아보가드로 법칙", "달톤의 법칙"], answer: 0 },
  { question: "기체 압력이 일정할 때 부피는 온도에?", options: ["반비례", "비례", "무관", "감소"], answer: 1 },
  { question: "보일의 법칙에서 P가 3배면 V는?", options: ["3배", "1/3배", "2배", "변화 없음"], answer: 1 },
  { question: "샤를의 법칙에서 온도 0°C일 때 부피는?", options: ["0이 된다", "일정", "무한대", "줄어들다 멈춤"], answer: 0 },
  { question: "기체 압력 단위는?", options: ["℃", "L", "Pa", "g"], answer: 2 },
  { question: "온도 단위 변환시 절대온도는?", options: ["T=℃", "T=℃+273", "T=℃-273", "T=273-℃"], answer: 1 },
  { question: "보일의 법칙 실험에서 주로 사용하는 기구는?", options: ["유리관", "피스톤 실린더", "온도계", "비커"], answer: 1 },
  { question: "샤를의 법칙은 어떤 조건에서 성립?", options: ["압력 일정", "온도 일정", "부피 일정", "질량 일정"], answer: 0 },
  { question: "기체가 팽창할 때 부피는?", options: ["작아진다", "커진다", "변화 없음", "없어진다"], answer: 1 },
  { question: "기체 법칙의 공통점은?", options: ["온도 관련 없음", "압력·부피·온도 관계", "질량만 중요", "상태 변화 없음"], answer: 1 },
  { question: "절대영도란?", options: ["온도가 0°C일 때", "분자 운동이 멈춘 온도", "기체 부피가 2배일 때", "압력이 0일 때"], answer: 1 }
];

// ----------------------------
// 📋 랜덤으로 5문제 선택
// ----------------------------
const quizData = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

let currentQuiz = 0;
let attempts = Array(quizData.length).fill(0);
let resultData = [];

// ----------------------------
// ⚙️ 문제 표시
// ----------------------------
function showQuiz() {
  const quiz = quizData[currentQuiz];
  const quizBox = document.getElementById('quizBox');
  quizBox.innerHTML = `
    <div class="quiz-card">
      <h3>문제 ${currentQuiz + 1}. ${quiz.question}</h3>
      ${quiz.options.map((opt, i) => `
        <button class="optionBtn" onclick="checkAnswer(${i})">${opt}</button>
      `).join('')}
    </div>
  `;
  document.getElementById('feedback').textContent = '';
}

function checkAnswer(selected) {
  const quiz = quizData[currentQuiz];
  attempts[currentQuiz]++;

  const feedback = document.getElementById('feedback');
  if (selected === quiz.answer) {
    feedback.textContent = `🎉 정답! (${attempts[currentQuiz]}번 만에 맞춤)`;
    feedback.style.color = "#2d7a2d";

    resultData.push({ question: currentQuiz + 1, tries: attempts[currentQuiz] });
  } else {
    feedback.textContent = "틀렸어요! 다시 도전해봐요 💪";
    feedback.style.color = "#c0392b";
  }
}

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentQuiz < quizData.length - 1) {
    currentQuiz++;
    showQuiz();
  } else {
    showResultChart();
  }
});

function showResultChart() {
  document.getElementById('quizBox').innerHTML = "<h3>모든 문제를 완료했습니다 👏</h3>";
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';

  const ctx = document.getElementById('resultChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: resultData.map(r => `문제 ${r.question}`),
      datasets: [{
        label: '정답까지 시도 횟수',
        data: resultData.map(r => r.tries),
        borderWidth: 1,
        backgroundColor: '#6a85b6'
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      plugins: { legend: { display: false } }
    }
  });
}

// 📸 퀴즈 결과 이미지 또는 PDF 저장
document.getElementById("saveResultBtn").addEventListener("click", () => {
  const resultArea = document.getElementById("resultSection");

  html2canvas(resultArea).then(canvas => {
    const image = canvas.toDataURL("image/png");

    // 이미지로 저장
    const link = document.createElement("a");
    link.href = image;
    link.download = "quiz_result.png";
    link.click();

    // PDF 저장 옵션
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4"
    });

    const imgWidth = 400;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(image, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save("quiz_result.pdf");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  showQuiz(); // 첫 문제 자동 표시
});

// -------------------------------
// 🧪 실험 결과 저장 기능 추가
// -------------------------------
let results = [];

function recordBoyleData(P, V) {
  results.push({
    law: "Boyle",
    pressure: P,
    volume: V,
    timestamp: new Date().toLocaleTimeString()
  });
}

function recordCharleData(T, V) {
  results.push({
    law: "Charles",
    temperature: T,
    volume: V,
    timestamp: new Date().toLocaleTimeString()
  });
}

function exportToExcel() {
  if (results.length === 0) {
    alert("저장된 데이터가 없습니다!");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(results);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Experiment Results");

  XLSX.writeFile(wb, "기체실험결과_보일샤를_학번이름.xlsx");
}
