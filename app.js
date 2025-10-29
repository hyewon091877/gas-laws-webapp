// 학생 정보 전역 변수
let studentInfo = {
  grade: '',
  class: '',
  number: '',
  name: ''
};

// 🔹 페이지 로드 시 학생 정보 모달 표시
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('studentModal').style.display = 'flex';
  
  // 엔터키로도 시작 가능
  const inputs = document.querySelectorAll('#studentModal input');
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('startBtn').click();
      }
    });
  });
});

// 🔹 학생 정보 저장 및 실험 시작
document.getElementById('startBtn').addEventListener('click', () => {
  const grade = document.getElementById('studentGrade').value.trim();
  const classNum = document.getElementById('studentClass').value.trim();
  const number = document.getElementById('studentNumber').value.trim();
  const name = document.getElementById('studentName').value.trim();

  if (!grade || !classNum || !number || !name) {
    alert('⚠️ 모든 정보를 입력해주세요!');
    return;
  }

  studentInfo = { grade, class: classNum, number, name };
  document.getElementById('studentModal').style.display = 'none';
  
  // 퀴즈 첫 문제 로드
  showQuiz();
  document.getElementById('nextBtn').disabled = true;
});

// 🔹 탭 전환 기능
const tabButtons = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    
    btn.classList.add('active');
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
  data: { 
    labels: [], 
    datasets: [{ 
      label: '압력 vs 부피', 
      data: [], 
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7
    }] 
  },
  options: { 
    responsive: true,
    scales: { 
      x: { title: { display: true, text: '압력 (atm)', font: { size: 14 } } }, 
      y: { title: { display: true, text: '부피 (L)', font: { size: 14 } } } 
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `부피: ${context.parsed.y.toFixed(1)}L`;
          }
        }
      }
    }
  }
});

pSlider.addEventListener('input', () => {
  const P = parseFloat(pSlider.value);
  const V = boyleConst / P;
  pValue.textContent = P.toFixed(1);
  vValue.textContent = V.toFixed(1);
  
  boyleBalloon.style.transform = `scale(${V / 100})`;
  boyleBalloon.style.transformOrigin = 'center center';

  boyleChart.data.labels.push(P.toFixed(1));
  boyleChart.data.datasets[0].data.push(V);
  recordBoyleData(P, V);
  boyleChart.update();
});

// 🔹 보일의 법칙 초기화
function resetBoyle() {
  if (confirm('🔄 실험 데이터를 초기화하시겠습니까?')) {
    pSlider.value = 1;
    pValue.textContent = '1.0';
    vValue.textContent = '100.0';
    boyleBalloon.style.transform = 'scale(1)';
    
    boyleChart.data.labels = [];
    boyleChart.data.datasets[0].data = [];
    boyleChart.update();
    
    // 보일의 법칙 데이터만 초기화
    results = results.filter(r => r.law !== "보일의 법칙");
  }
}

// 🔹 샤를의 법칙
const tSlider = document.getElementById('temperature');
const tValue = document.getElementById('tempValue');
const vCharle = document.getElementById('charleVolumeValue');
const charleBalloon = document.getElementById('charleBalloonSVG');

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
      backgroundColor: 'rgba(255, 102, 0, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7
    }] 
  },
  options: { 
    responsive: true,
    scales: { 
      x: { title: { display: true, text: '온도 (°C)', font: { size: 14 } } }, 
      y: { title: { display: true, text: '부피 (L)', font: { size: 14 } } } 
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `부피: ${context.parsed.y.toFixed(1)}L`;
          }
        }
      }
    }
  }
});

tSlider.addEventListener('input', () => {
  const t = parseFloat(tSlider.value);
  const V = V0 * (1 + t / 273);
  tValue.textContent = t;
  vCharle.textContent = V.toFixed(1);
  
  charleBalloon.style.transform = `scale(${V / V0})`;
  charleBalloon.style.transformOrigin = 'center center';
  
  const ellipse = charleBalloon.querySelector('ellipse');
  const r = Math.round(255 * (t / 100));
  const g = Math.round(200 * (1 - t / 100));
  const b = Math.round(255 * (1 - t / 100));
  ellipse.setAttribute('fill', `rgb(${r},${g},${b})`);
  
  charleChart.data.labels.push(t);
  charleChart.data.datasets[0].data.push(V);
  recordCharleData(t, V);
  charleChart.update();
});

// 🔹 샤를의 법칙 초기화
function resetCharles() {
  if (confirm('🔄 실험 데이터를 초기화하시겠습니까?')) {
    tSlider.value = 0;
    tValue.textContent = '0';
    vCharle.textContent = '50.0';
    charleBalloon.style.transform = 'scale(1)';
    charleBalloon.querySelector('ellipse').setAttribute('fill', '#4a90e2');
    
    charleChart.data.labels = [];
    charleChart.data.datasets[0].data = [];
    charleChart.update();
    
    // 샤를의 법칙 데이터만 초기화
    results = results.filter(r => r.law !== "샤를의 법칙");
  }
}

// 🔹 퀴즈 데이터
const allQuestions = [
  { question: "보일의 법칙에서 압력이 두 배가 되면 부피는?", options: ["2배", "1/2배", "변화 없음", "4배"], answer: 1 },
  { question: "샤를의 법칙의 그래프 형태는?", options: ["직선", "곡선", "수평선", "사인파"], answer: 0 },
  { question: "PV=일정 은 어떤 법칙?", options: ["보일의 법칙", "샤를의 법칙", "아보가드로 법칙", "기체 확산 법칙"], answer: 0 },
  { question: "온도가 높을수록 기체 분자는?", options: ["느려진다", "빠르다", "변화 없음", "정지한다"], answer: 1 },
  { question: "V∝T 은 어떤 법칙?", options: ["샤를의 법칙", "보일의 법칙", "아보가드로 법칙", "달톤의 법칙"], answer: 0 },
  { question: "기체 압력이 일정할 때 부피는 온도에?", options: ["반비례", "비례", "무관", "감소"], answer: 1 },
  { question: "보일의 법칙에서 P가 3배면 V는?", options: ["3배", "1/3배", "2배", "변화 없음"], answer: 1 },
  { question: "샤를의 법칙에서 온도가 증가하면 부피는?", options: ["감소한다", "증가한다", "변화없음", "0이 된다"], answer: 1 },
  { question: "기체 압력 단위는?", options: ["℃", "L", "Pa", "g"], answer: 2 },
  { question: "온도 단위 변환시 절대온도는?", options: ["T=℃", "T=℃+273", "T=℃-273", "T=273-℃"], answer: 1 },
  { question: "보일의 법칙 실험에서 주로 사용하는 기구는?", options: ["유리관", "피스톤 실린더", "온도계", "비커"], answer: 1 },
  { question: "샤를의 법칙은 어떤 조건에서 성립?", options: ["압력 일정", "온도 일정", "부피 일정", "질량 일정"], answer: 0 },
  { question: "기체가 팽창할 때 부피는?", options: ["작아진다", "커진다", "변화 없음", "없어진다"], answer: 1 },
  { question: "기체 법칙의 공통점은?", options: ["온도 관련 없음", "압력·부피·온도 관계", "질량만 중요", "상태 변화 없음"], answer: 1 },
  { question: "절대영도란?", options: ["온도가 0°C일 때", "분자 운동이 멈춘 온도", "기체 부피가 2배일 때", "압력이 0일 때"], answer: 1 }
];

let quizData = [];
let currentQuiz = 0;
let attempts = [];
let resultData = [];

// 🔹 퀴즈 시작
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
    document.getElementById('nextBtn').disabled = false;
  } else {
    feedback.textContent = "❌ 틀렸어요! 다시 도전해봐요 💪";
    feedback.style.color = "#c0392b";
  }
}

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentQuiz < quizData.length - 1) {
    currentQuiz++;
    showQuiz();
    document.getElementById('nextBtn').disabled = true;
  } else {
    showResultChart();
  }
});

function showResultChart() {
  document.getElementById('quizBox').innerHTML = "<h3>🎉 모든 문제를 완료했습니다!</h3>";
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('feedback').style.display = 'none';
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
      responsive: true,
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      plugins: { legend: { display: false } }
    }
  });
}

// 🔹 퀴즈 초기화
function resetQuiz() {
  if (confirm('🔄 퀴즈를 처음부터 다시 시작하시겠습니까?')) {
    quizData = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
    currentQuiz = 0;
    attempts = Array(quizData.length).fill(0);
    resultData = [];
    
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('feedback').style.display = 'block';
    document.getElementById('nextBtn').disabled = true;
    
    showQuiz();
  }
}

// 📸 퀴즈 결과 저장
document.getElementById("saveResultBtn").addEventListener("click", () => {
  const resultArea = document.getElementById("resultSection");

  html2canvas(resultArea).then(canvas => {
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `퀴즈결과_${studentInfo.grade}학년${studentInfo.class}반${studentInfo.number}번_${studentInfo.name}.png`;
    link.click();

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4"
    });

    const imgWidth = 400;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(image, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save(`퀴즈결과_${studentInfo.grade}학년${studentInfo.class}반${studentInfo.number}번_${studentInfo.name}.pdf`);
  });
});

// 🧪 실험 결과 저장
let results = [];

function recordBoyleData(P, V) {
  results.push({
    law: "보일의 법칙",
    pressure: P.toFixed(2),
    volume: V.toFixed(2),
    temperature: "-",
    timestamp: new Date().toLocaleTimeString()
  });
}

function recordCharleData(T, V) {
  results.push({
    law: "샤를의 법칙",
    pressure: "-",
    volume: V.toFixed(2),
    temperature: T,
    timestamp: new Date().toLocaleTimeString()
  });
}

function exportToExcel() {
  if (results.length === 0) {
    alert("⚠️ 저장된 실험 데이터가 없습니다! 슬라이더를 움직여 실험을 먼저 해보세요.");
    return;
  }

  // 학생 정보 시트
  const studentSheet = XLSX.utils.json_to_sheet([{
    "학년": studentInfo.grade,
    "반": studentInfo.class,
    "번호": studentInfo.number,
    "이름": studentInfo.name,
    "실험 일시": new Date().toLocaleString()
  }]);

  // 실험 데이터 시트
  const dataSheet = XLSX.utils.json_to_sheet(results);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, studentSheet, "학생정보");
  XLSX.utils.book_append_sheet(wb, dataSheet, "실험결과");

  XLSX.writeFile(wb, `기체실험_${studentInfo.grade}학년${studentInfo.class}반${studentInfo.number}번_${studentInfo.name}.xlsx`);
  alert("✅ 엑셀 파일이 다운로드되었습니다!");
}

// 초기화
quizData = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
attempts = Array(quizData.length).fill(0);