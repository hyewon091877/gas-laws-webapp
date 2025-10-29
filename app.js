// ========================
// 1. 탭 전환
// ========================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ========================
// 2. 보일의 법칙
// ========================
const pSlider = document.getElementById('pressure');
const pValue = document.getElementById('pressureValue');
const vValue = document.getElementById('volumeValue');
const boyleBalloon = document.getElementById('boyleBalloonSVG');
const boyleConst = 100; // P*V=k

const ctx1 = document.getElementById('boyleChart').getContext('2d');
const boyleChart = new Chart(ctx1, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'P vs V', data: [], borderColor: '#007bff', borderWidth: 2 }] },
  options: { 
    scales: { 
      x: { title: { display: true, text: '압력 (atm)' } }, 
      y: { title: { display: true, text: '부피 (L)' } } 
    },
    plugins: { legend: { display: false } }
  }
});

pSlider.addEventListener('input', () => {
  const P = parseFloat(pSlider.value);
  const V = boyleConst / P;
  pValue.textContent = P.toFixed(1);
  vValue.textContent = V.toFixed(1);
  boyleBalloon.style.transform = `scale(${V / boyleConst})`;
  boyleBalloon.style.transformOrigin = 'center center';

  boyleChart.data.labels.push(P);
  boyleChart.data.datasets[0].data.push(V);
  boyleChart.update();
});

// ========================
// 3. 샤를의 법칙 (V = V0*(1+t/273))
// ========================
const tSlider = document.getElementById('temperature');
const tValue = document.getElementById('tempValue');
const vCharle = document.getElementById('charleVolumeValue');
const charleBalloon = document.getElementById('charleBalloonSVG');
const V0 = 50; // 0°C 기준 부피

const ctx2 = document.getElementById('charleChart').getContext('2d');
const charleChart = new Chart(ctx2, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'T vs V', data: [], borderColor: '#ff6600', borderWidth: 2 }] },
  options: { 
    scales: { 
      x: { title: { display: true, text: '온도 (°C)' } }, 
      y: { title: { display: true, text: '부피 (L)' } } 
    },
    plugins: { legend: { display: false } }
  }
});

tSlider.addEventListener('input', () => {
  const t = parseFloat(tSlider.value);
  const V = V0 * (1 + t / 273);
  tValue.textContent = t;
  vCharle.textContent = V.toFixed(1);

  // 풍선 크기 조절
  charleBalloon.style.transform = `scale(${V / V0})`;
  charleBalloon.style.transformOrigin = 'center center';

  // 풍선 색상 변경
  const ellipse = charleBalloon.querySelector('ellipse');
  // 온도에 따라 RGB 색상 변화 (0°C 파랑, 100°C 빨강)
  const r = Math.round(255 * (t / 100));       // 빨강 비율 증가
  const g = 50;                                // 약간 녹색 고정
  const b = Math.round(255 * (1 - t / 100));   // 파랑 비율 감소
  ellipse.setAttribute('fill', `rgb(${r},${g},${b})`);

  // 그래프 업데이트
  charleChart.data.labels.push(t);
  charleChart.data.datasets[0].data.push(V);
  charleChart.update();
});


// ========================
// 4. 퀴즈
// ========================
const quizBox = document.getElementById('quizBox');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');

const quizData = [
  { q: "보일의 법칙에서 일정한 것은?", options: ["온도","압력","부피","온도와 압력"], answer: "온도", explain: "보일의 법칙에서는 온도가 일정합니다." },
  { q: "샤를의 법칙에서 압력이 일정할 때, 온도가 올라가면 부피는?", options: ["작아진다","변하지 않는다","커진다","없어진다"], answer: "커진다", explain: "온도가 높아질수록 부피가 커집니다." },
  { q: "보일의 법칙의 식은?", options: ["P×V=일정","V/T=일정","P/T=일정","V×T=일정"], answer: "P×V=일정", explain: "압력과 부피의 곱이 일정합니다." },
  { q: "샤를의 법칙의 그래프는?", options: ["직선","곡선","점선","없다"], answer: "직선", explain: "온도와 부피가 비례하므로 직선 그래프입니다." },
  { q: "풍선이 추운 곳에서 작아지는 이유는?", options: ["보일의 법칙","샤를의 법칙","용해도 법칙","기화 법칙"], answer: "샤를의 법칙", explain: "온도가 낮아지면 부피도 줄어드는 샤를의 법칙 때문입니다." }
];

let currentQ = 0;
loadQuiz();

function loadQuiz() {
  const q = quizData[currentQ];
  quizBox.innerHTML = `<h3>${q.q}</h3>` + q.options.map(opt => 
    `<button class="optionBtn">${opt}</button>`).join("");
  feedback.textContent = "";
  const optionBtns = document.querySelectorAll('.optionBtn');
  optionBtns.forEach(btn => btn.onclick = () => checkAnswer(btn.textContent));
}

function checkAnswer(selected) {
  const correct = quizData[currentQ].answer;
  if (selected === correct) {
    feedback.style.color = "green";
    feedback.textContent = "정답! 🎉 " + quizData[currentQ].explain;
  } else {
    feedback.style.color = "red";
    feedback.textContent = "다시 풀어봅시다!";
  }
}

nextBtn.onclick = () => {
  currentQ++;
  if (currentQ < quizData.length) loadQuiz();
  else feedback.textContent = "모든 문제를 풀었습니다! 잘했어요 👏";
};
