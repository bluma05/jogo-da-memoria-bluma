// Jogo da Memória BluMA
const board = document.getElementById('game-board');
const movesSpan = document.getElementById('moves');
const timerSpan = document.getElementById('timer');
const bestScoreSpan = document.getElementById('best-score');
const resetBtn = document.getElementById('reset');

const icons = [
  '🍎','🍌','🍇','🍉','🍒','🍋','🍓','🍍'
]; // 8 pares para 4x4
let cards = [];
let flippedCards = [];
let matched = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  // Reset
  board.innerHTML = '';
  moves = 0;
  matched = 0;
  timer = 0;
  gameStarted = false;
  movesSpan.textContent = moves;
  timerSpan.textContent = '00:00';
  clearInterval(timerInterval);
  flippedCards = [];

  // Gera pares e embaralha
  cards = shuffle([...icons, ...icons]);

  // Cria cartas
  cards.forEach((icon, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.icon = icon;
    card.dataset.index = idx;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${icon}</div>
        <div class="card-back">?</div>
      </div>
    `;
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
  });
}

function handleCardClick(e) {
  const card = e.currentTarget;
  if (
    card.classList.contains('flipped') ||
    card.classList.contains('matched') ||
    flippedCards.length === 2
  ) return;

  if (!gameStarted) {
    gameStarted = true;
    timerInterval = setInterval(() => {
      timer++;
      timerSpan.textContent = formatTime(timer);
    }, 1000);
  }

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesSpan.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.icon === card2.dataset.icon) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matched += 2;
    flippedCards = [];
    if (matched === cards.length) {
      endGame();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 900);
  }
}

function endGame() {
  clearInterval(timerInterval);
  // Salva recorde se for melhor
  const best = getBestScore();
  if (!best || moves < best.moves || (moves === best.moves && timer < best.time)) {
    setBestScore(moves, timer);
    renderBestScore();
  }
  setTimeout(() => {
    alert(`Parabéns! Você venceu em ${moves} tentativas e ${formatTime(timer)}.`);
  }, 400);
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function getBestScore() {
  const data = localStorage.getItem('memory-best');
  return data ? JSON.parse(data) : null;
}
function setBestScore(moves, time) {
  localStorage.setItem('memory-best', JSON.stringify({ moves, time }));
}
function renderBestScore() {
  const best = getBestScore();
  if (best) {
    bestScoreSpan.textContent = `${best.moves} mov. / ${formatTime(best.time)}`;
  } else {
    bestScoreSpan.textContent = '--';
  }
}

resetBtn.addEventListener('click', startGame);

document.addEventListener('DOMContentLoaded', () => {
  renderBestScore();
  startGame();
});
