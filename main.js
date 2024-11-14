import confetti from 'canvas-confetti';

function getNextChineseNewYear() {
  // Chinese New Year dates for upcoming years (dates in Beijing time UTC+8)
  const chineseNewYearDates = {
    2024: '2024-02-10',
    2025: '2025-01-29',
    2026: '2026-02-17',
    2027: '2027-02-06',
    2028: '2028-01-26',
    2029: '2029-02-13',
    2030: '2030-02-03'
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  let targetYear = currentYear;

  // Convert current time to Beijing time for comparison
  const beijingOffset = 8 * 60; // UTC+8 in minutes
  const localOffset = now.getTimezoneOffset();
  const totalOffset = beijingOffset + localOffset;
  const beijingTime = new Date(now.getTime() + totalOffset * 60000);

  // If we've passed this year's CNY, look for next year's date
  const thisYearCNY = new Date(`${chineseNewYearDates[currentYear]}T00:00:00+08:00`);
  if (beijingTime > thisYearCNY) {
    targetYear = currentYear + 1;
  }

  // If date isn't in our list, use Feb 1st as approximation
  if (!chineseNewYearDates[targetYear]) {
    return new Date(`${targetYear}-02-01T00:00:00+08:00`);
  }

  return new Date(`${chineseNewYearDates[targetYear]}T00:00:00+08:00`);
}

function updateCountdown() {
  const now = new Date();
  const targetDate = getNextChineseNewYear();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    celebrateNewYear();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

  // Update the year in the title
  const targetYear = targetDate.getFullYear();
  document.getElementById('targetYear').textContent = targetYear;
}

function celebrateNewYear() {
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 30 * (timeLeft / duration);
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 500);
}

// Social sharing functionality
window.share = function(platform) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Countdown to Chinese New Year! 🧧 Join the celebration! 🎊');
  
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    tumblr: `https://www.tumblr.com/share/link?url=${url}&description=${text}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`,
    reddit: `https://reddit.com/submit?url=${url}&title=${text}`
  };

  window.open(shareUrls[platform], '_blank');
};

// Random fireworks with reduced density
function launchRandomFirework() {
  const colors = ['#ff0000', '#ffd700', '#ff6b6b'];
  
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { x: Math.random(), y: Math.random() },
    colors: colors,
    startVelocity: 30,
    gravity: 0.5,
    shapes: ['circle'],
    ticks: 150
  });
}

// Launch random fireworks with reduced frequency
setInterval(launchRandomFirework, 3000);

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();