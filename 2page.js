// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function () {
  lucide.createIcons();
  initializeApp();
});

// Global state
let appState = {
  activePanel: 'dashboard',
  theme: 'dark',
  language: 'en',
  trains: [],
  issues: [],
  scenarios: [],
  recommendations: []
};

// Mock data
const mockTrains = [
  { id: "12034", name: "Shatabdi Express", currentStation: "New Delhi", nextStation: "Kanpur Central", status: "on-time", eta: "14:05", progress: 65, type: "express", platform: "12" },
  { id: "12951", name: "Rajdhani Express", currentStation: "Mumbai Central", nextStation: "Vadodara Junction", status: "delayed", eta: "14:20", delayMinutes: 18, progress: 45, type: "express", platform: "8" },
  { id: "22126", name: "Vande Bharat", currentStation: "Nagpur Junction", nextStation: "Mumbai CST", status: "on-time", eta: "14:40", progress: 78, type: "passenger", platform: "3" },
  { id: "14711", name: "Intercity Express", currentStation: "Bikaner Junction", nextStation: "Haridwar", status: "delayed", eta: "15:10", delayMinutes: 7, progress: 32, type: "passenger", platform: "15" },
  { id: "19301", name: "Freight Express", currentStation: "Indore Junction", nextStation: "Ujjain Junction", status: "on-time", eta: "15:25", progress: 89, type: "freight" },
  { id: "12002", name: "Duronto Express", currentStation: "Kolkata Howrah", nextStation: "New Delhi", status: "on-time", eta: "16:15", progress: 12, type: "express", platform: "23" },
  { id: "12650", name: "Karnataka Express", currentStation: "Bangalore City", nextStation: "Chennai Central", status: "delayed", eta: "16:45", delayMinutes: 25, progress: 67, type: "passenger", platform: "7" },
  { id: "18464", name: "Prasanthi Express", currentStation: "Hyderabad Deccan", nextStation: "Puttaparthi", status: "on-time", eta: "17:30", progress: 55, type: "passenger", platform: "11" },
  { id: "12423", name: "Dibrugarh Rajdhani", currentStation: "Guwahati", nextStation: "New Delhi", status: "delayed", eta: "18:00", delayMinutes: 42, progress: 25, type: "express", platform: "5" },
  { id: "20501", name: "Freight Special", currentStation: "Ahmedabad Junction", nextStation: "Mumbai Port", status: "on-time", eta: "18:30", progress: 85, type: "freight" },
  { id: "12617", name: "Mangala Express", currentStation: "Ernakulam Junction", nextStation: "Hazrat Nizamuddin", status: "on-time", eta: "19:15", progress: 15, type: "express", platform: "2" },
  { id: "16032", name: "Andaman Express", currentStation: "Chennai Egmore", nextStation: "Jammu Tawi", status: "delayed", eta: "20:00", delayMinutes: 15, progress: 8, type: "passenger", platform: "9" }
];

const mockIssues = [
  { id: 1, type: 'train', title: 'Rajdhani Express Engine Malfunction', description: 'Engine temperature sensor showing anomalous readings', severity: 'critical', status: 'in_progress', reportedAt: '2024-01-15 08:30:00', location: 'Delhi Junction - Platform 2', affectedTrains: ['12951', '12423'] },
  { id: 2, type: 'track', title: 'Track Inspection Required - Section 45A', description: 'Routine maintenance inspection due for high-speed section', severity: 'medium', status: 'open', reportedAt: '2024-01-15 10:15:00', location: 'Mumbai-Pune Route - KM 45', affectedTrains: ['22126', '12002'] },
  { id: 3, type: 'platform', title: 'Platform Overcrowding Alert', description: 'Passenger density exceeding safe limits during peak hours', severity: 'high', status: 'in_progress', reportedAt: '2024-01-15 17:45:00', location: 'Mumbai Central - Platform 7', affectedTrains: ['19301', '18030'] },
  { id: 4, type: 'signal', title: 'Signal Communication Delay', description: 'Intermittent delays in signal response, investigating network issues', severity: 'medium', status: 'open', reportedAt: '2024-01-15 12:20:00', location: 'Chennai Central - Signal Box 3', affectedTrains: ['22691'] },
  { id: 5, type: 'train', title: 'Air Conditioning System Failure', description: 'AC unit malfunction in coach B4, passenger comfort affected', severity: 'low', status: 'resolved', reportedAt: '2024-01-15 06:30:00', location: 'Shatabdi Express - Coach B4', affectedTrains: ['12034'] }
];

const mockRecommendations = [
  { id: "1", trainId: "12034", trainName: "Shatabdi Express", type: "route", action: "Switch to Track 2 at Delhi Junction", justification: "Avoid congestion on primary track", impact: "Reduce delay propagation", timeSaving: 8, priority: "high", status: "pending" },
  { id: "2", trainId: "12951", trainName: "Rajdhani Express", type: "speed", action: "Increase speed to 130 km/h", justification: "Clear track ahead for next 45km", impact: "Recover 12 minutes delay", timeSaving: 12, priority: "high", status: "applied" },
  { id: "3", trainId: "22126", trainName: "Vande Bharat", type: "priority", action: "Grant priority at next 3 signals", justification: "Maintain schedule for connecting services", impact: "Prevent cascade delays", timeSaving: 5, priority: "medium", status: "pending" },
  { id: "4", trainId: "14711", trainName: "Intercity Express", type: "platform", action: "Change to Platform 7 at Haridwar", justification: "Reduce passenger transfer time", impact: "Improve passenger experience", timeSaving: 3, priority: "low", status: "pending" },
  { id: "5", trainId: "19301", trainName: "Freight Express", type: "timing", action: "Delay departure by 15 minutes", justification: "Wait for priority passenger train", impact: "Optimize overall network flow", timeSaving: 25, priority: "medium", status: "applied" }
];

let mockScenarios = [
  { id: 1, name: 'Peak Hour Optimization - Morning', timestamp: '2024-01-15 09:30:00', type: 'AI Optimization', data: { throughput: 185, delay_saved: 45 } },
  { id: 2, name: 'Freight Priority Simulation', timestamp: '2024-01-15 14:22:00', type: 'What-If Scenario', data: { priority: 'freight', tracks: 3, efficiency: 92 } },
  { id: 3, name: 'Emergency Protocol Test', timestamp: '2024-01-15 16:45:00', type: 'Safety Drill', data: { response_time: 120, affected_services: 8 } }
];

// Initialize app
function initializeApp() {
  appState.trains = mockTrains;
  appState.issues = mockIssues;
  appState.scenarios = mockScenarios;
  appState.recommendations = mockRecommendations;

  setupEventListeners();
  updateClock();
  setInterval(updateClock, 1000);
  renderTrainList();
  renderIssuesList();
  renderScenariosList();
  renderRecommendationsList();
  initializeCharts();
  initializeDigitalTwin();
}

// Event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;
      switchPanel(panel);
    });
  });

  // Theme toggle
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // Language toggle
  document.getElementById('languageSelect').addEventListener('change', (e) => {
    switchLanguage(e.target.value);
  });

  // Voice summary
  document.getElementById('voiceBtn').addEventListener('click', speakSummary);

  // Train search and filter
  document.getElementById('trainSearch').addEventListener('input', filterTrains);
  document.getElementById('statusFilter').addEventListener('change', filterTrains);

  // AI Scheduler
  document.getElementById('runOptimization').addEventListener('click', runOptimization);
  document.getElementById('seedBaseline').addEventListener('click', seedBaseline);

  // What-If Simulator
  document.querySelectorAll('.simulate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      runSimulation(btn.dataset.mode);
    });
  });

  // Digital twin inputs
  ['tracks', 'distance', 'platforms', 'trains', 'priority', 'signal'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateDigitalTwin);
  });

  // Comparison
  document.getElementById('runComparison').addEventListener('click', runComparison);

  // Reports
  document.getElementById('saveScenario').addEventListener('click', saveScenario);
  document.getElementById('downloadReport').addEventListener('click', downloadReport);
  document.getElementById('clearSaved').addEventListener('click', clearSavedScenarios);
}

// Panel switching
function switchPanel(panelName) {
  // Update active panel state
  appState.activePanel = panelName;

  // Hide all panels
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.remove('active');
  });

  // Show selected panel
  document.getElementById(`${panelName}-panel`).classList.add('active');

  // Update navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.querySelector(`[data-panel="${panelName}"]`).classList.add('active');
}

// Theme management
function toggleTheme() {
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.classList.toggle('dark', appState.theme === 'dark');

  const themeIcon = document.querySelector('#themeBtn i');
  themeIcon.setAttribute('data-lucide', appState.theme === 'dark' ? 'sun' : 'moon');
  lucide.createIcons();
}

// Language management
function switchLanguage(lang) {
  appState.language = lang;

  // Update navigation text based on language
  const navTexts = {
    'dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
    'live': { en: 'Live Trains', hi: 'लाइव ट्रेनें' },
    'scheduler': { en: 'AI Scheduler', hi: 'एआई शेड्यूलर' },
    'whatif': { en: 'What-If Simulator', hi: 'व्हाट-इफ सिम्युलेटर' },
    'compare': { en: 'Judge vs Optimizer', hi: 'जज बनाम ऑप्टिमाइज़र' },
    'reports': { en: 'Reports', hi: 'रिपोर्ट्स' }
  };

  document.querySelectorAll('.nav-text').forEach((el, index) => {
    const panels = ['dashboard', 'live', 'scheduler', 'whatif', 'compare', 'reports'];
    const panel = panels[index];
    if (navTexts[panel]) {
      el.textContent = navTexts[panel][lang];
    }
  });
}

// Clock update
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('clock').textContent = timeString;
}

// Voice summary
function speakSummary() {
  const msg = new SpeechSynthesisUtterance(
    "RailVision Dashboard summary. System performance is optimal. All trains are being monitored in real-time."
  );
  msg.lang = appState.language === 'hi' ? 'hi-IN' : 'en-IN';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

// Train management
function renderTrainList() {
  const container = document.getElementById('trainList');
  const filteredTrains = getFilteredTrains();

  container.innerHTML = filteredTrains.map(train => `
        <div class="train-card" data-train-id="${train.id}">
            <div class="flex items-start justify-between mb-2">
                <div>
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="font-bold text-cyan-400">${train.id}</span>
                        <span class="badge badge-${train.type === 'express' ? 'purple' : train.type === 'passenger' ? 'blue' : 'orange'}">${train.type}</span>
                    </div>
                    <p class="text-sm text-slate-400">${train.name}</p>
                </div>
                <i data-lucide="train" class="h-6 w-6 ${train.status === 'on-time' ? 'text-green-400' : 'text-red-400'}"></i>
            </div>

            <div class="space-y-2 mb-4">
                <div class="flex items-center space-x-2">
                    <i data-lucide="map-pin" class="h-4 w-4 text-blue-400"></i>
                    <span class="text-sm">Current: ${train.currentStation}</span>
                    ${train.platform ? `<span class="badge badge-blue">Platform ${train.platform}</span>` : ''}
                </div>
                <div class="flex items-center space-x-2">
                    <i data-lucide="navigation" class="h-4 w-4 text-purple-400"></i>
                    <span class="text-sm">Next: ${train.nextStation}</span>
                </div>
            </div>

            <div class="space-y-2 mb-4">
                <div class="flex justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span>${train.progress}%</span>
                </div>
                <div class="progress-bg">
                    <div class="progress-fill ${train.status === 'on-time' ? 'progress-green' : 'progress-red'}" style="width: ${train.progress}%"></div>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <i data-lucide="${train.status === 'on-time' ? 'check-circle' : 'alert-circle'}" class="h-4 w-4 ${train.status === 'on-time' ? 'text-green-400' : 'text-red-400'}"></i>
                    <span class="badge badge-${train.status === 'on-time' ? 'green' : 'red'}">
                        ${train.status === 'delayed' && train.delayMinutes ? `Delayed ${train.delayMinutes} min` : train.status}
                    </span>
                </div>
                <div class="flex items-center space-x-1 text-sm font-mono">
                    <i data-lucide="clock" class="h-4 w-4 text-cyan-400"></i>
                    <span class="text-cyan-400">${train.eta}</span>
                </div>
            </div>
        </div>
    `).join('');

  // Update summary stats
  updateTrainStats(filteredTrains);

  // Re-initialize icons
  lucide.createIcons();
}

function getFilteredTrains() {
  const searchTerm = document.getElementById('trainSearch').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;

  return appState.trains.filter(train => {
    const matchesSearch = !searchTerm ||
      train.id.toLowerCase().includes(searchTerm) ||
      train.name.toLowerCase().includes(searchTerm) ||
      train.currentStation.toLowerCase().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || train.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}

function updateTrainStats(trains) {
  const onTime = trains.filter(t => t.status === 'on-time').length;
  const delayed = trains.filter(t => t.status === 'delayed').length;
  const total = trains.length;

  document.getElementById('onTimeCount').textContent = onTime;
  document.getElementById('delayedCount').textContent = delayed;
  document.getElementById('totalCount').textContent = total;
}

function filterTrains() {
  renderTrainList();
}

// AI Scheduler
function runOptimization() {
  const button = document.getElementById('runOptimization');
  const progressDiv = document.getElementById('optimizationProgress');
  const resultDiv = document.getElementById('optimizationResult');

  button.disabled = true;
  button.innerHTML = '<i data-lucide="loader" class="h-4 w-4 mr-2 inline animate-spin"></i>Optimizing...';
  progressDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');

  let progress = 0;
  const interval = setInterval(() => {
    progress += 2;
    document.getElementById('progressPercent').textContent = `${progress}%`;
    document.getElementById('progressBar').style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      button.disabled = false;
      button.innerHTML = '<i data-lucide="play" class="h-4 w-4 mr-2 inline"></i>Run AI Optimization';
      progressDiv.classList.add('hidden');
      resultDiv.classList.remove('hidden');
      lucide.createIcons();
    }
  }, 50);
}

function seedBaseline() {
  document.getElementById('optimizationResult').classList.add('hidden');
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('progressPercent').textContent = '0%';
}

function renderRecommendationsList() {
  const container = document.getElementById('recommendationsList');

  container.innerHTML = appState.recommendations.map(rec => `
        <div class="recommendation-card" data-rec-id="${rec.id}">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="font-bold text-cyan-400">${rec.trainId}</span>
                        <span class="badge badge-blue">${rec.type}</span>
                    </div>
                    <p class="text-sm text-slate-400">${rec.trainName}</p>
                </div>
                <div class="p-2 rounded-lg ${getPriorityBackground(rec.priority)}">
                    <i data-lucide="${getTypeIcon(rec.type)}" class="h-4 w-4"></i>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <h4 class="font-medium text-white mb-1">Recommended Action</h4>
                    <p class="text-sm text-cyan-300 bg-slate-800/50 p-3 rounded-lg">${rec.action}</p>
                </div>

                <div>
                    <h4 class="font-medium text-white mb-1">AI Reasoning</h4>
                    <p class="text-sm text-slate-400">${rec.justification}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-slate-400 mb-1">Expected Impact</p>
                        <p class="text-sm font-medium">${rec.impact}</p>
                    </div>
                    <div>
                        <p class="text-xs text-slate-400 mb-1">Time Saving</p>
                        <p class="text-sm font-medium text-green-400">
                            ${rec.timeSaving > 0 ? `+${rec.timeSaving} min` : 'Safety First'}
                        </p>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <span class="badge badge-${getPriorityColor(rec.priority)}">${rec.priority} priority</span>
                    <span class="badge badge-${getStatusColor(rec.status)}">${rec.status}</span>
                </div>
            </div>
        </div>
    `).join('');

  lucide.createIcons();
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'red';
    case 'medium': return 'yellow';
    case 'low': return 'green';
    default: return 'blue';
  }
}

function getPriorityBackground(priority) {
  switch (priority) {
    case 'high': return 'bg-red-500/20';
    case 'medium': return 'bg-yellow-500/20';
    case 'low': return 'bg-green-500/20';
    default: return 'bg-blue-500/20';
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'applied': return 'green';
    case 'pending': return 'blue';
    case 'rejected': return 'red';
    default: return 'blue';
  }
}

function getTypeIcon(type) {
  switch (type) {
    case 'route': return 'route';
    case 'speed': return 'zap';
    case 'priority': return 'trending-up';
    case 'platform': return 'arrow-right';
    case 'timing': return 'clock';
    default: return 'settings';
  }
}

// What-If Simulator
function initializeDigitalTwin() {
  updateDigitalTwin();
}

function updateDigitalTwin() {
  const canvas = document.getElementById('digitalTwin');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Get parameters
  const tracks = parseInt(document.getElementById('tracks').value);
  const distance = parseInt(document.getElementById('distance').value);
  const platforms = parseInt(document.getElementById('platforms').value);
  const trains = parseInt(document.getElementById('trains').value);

  // Clear canvas
  ctx.clearRect(0, 0, W, H);

  // Background grid
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Junctions
  const left = { x: 80, y: H / 2 };
  const right = { x: W - 80, y: H / 2 };

  ctx.fillStyle = '#60a5fa';
  ctx.beginPath();
  ctx.arc(left.x, left.y, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(right.x, right.y, 18, 0, Math.PI * 2);
  ctx.fill();

  // Labels
  ctx.fillStyle = '#fff';
  ctx.font = '12px Arial';
  ctx.fillText('Junction A', left.x - 30, left.y - 26);
  ctx.fillText('Junction B', right.x - 30, right.y - 26);
  ctx.fillText(`${distance} km`, W / 2 - 20, H / 2 - 26);

  // Tracks
  const spacing = 10;
  for (let i = 0; i < tracks; i++) {
    const yy = H / 2 - ((tracks - 1) * spacing) / 2 + i * spacing;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(left.x + 20, yy);
    ctx.lineTo(right.x - 20, yy);
    ctx.stroke();
  }

  // Platforms
  for (let i = 0; i < platforms; i++) {
    ctx.fillStyle = '#a78bfa';
    ctx.fillRect(left.x - 40, left.y - (platforms * 8) / 2 + i * 8, 30, 6);
    ctx.fillRect(right.x + 10, right.y - (platforms * 8) / 2 + i * 8, 30, 6);
  }

  // Train flow arrows
  const flow = Math.min(trains, 200);
  const arrows = Math.ceil(flow / 40);
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  for (let i = 0; i < arrows; i++) {
    const ay = H / 2 - 25 + i * 12;
    ctx.beginPath();
    ctx.moveTo(left.x + 30, ay);
    ctx.lineTo(right.x - 30, ay);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(right.x - 30, ay);
    ctx.lineTo(right.x - 40, ay - 5);
    ctx.moveTo(right.x - 30, ay);
    ctx.lineTo(right.x - 40, ay + 5);
    ctx.stroke();
  }
}

function runSimulation(mode) {
  const tracks = parseInt(document.getElementById('tracks').value);
  const distance = parseInt(document.getElementById('distance').value);
  const platforms = parseInt(document.getElementById('platforms').value);
  const trains = parseInt(document.getElementById('trains').value);
  const signal = document.getElementById('signal').value;

  // Calculate capacity estimate
  const blockEff = signal === 'moving' ? 1.35 : 1.0;
  const trackEff = Math.min(tracks * 0.95, 3.0);
  const platformEff = 0.6 + (platforms * 0.05);
  const capacity = Math.round(60 * blockEff * trackEff * platformEff / ((distance / 40) + 1));

  const pressure = Math.max(trains - capacity, 0);
  const delayMin = Math.round(pressure * (mode === 'passenger' ? 0.6 : mode === 'freight' ? 0.6 : 0.5));

  let message = '';
  if (mode === 'freight') message = 'Freight prioritized: Passenger trains may incur added dwell.';
  if (mode === 'passenger') message = 'Passenger prioritized: Freight crossing/paths may queue.';
  if (mode === 'balanced') message = 'Balanced plan: Minimizes total network delay.';

  const result = `Plan: ${message} | Capacity≈${capacity}/h Demand=${trains}/h -> Est. excess=${Math.max(trains - capacity, 0)}/h Delay≈${delayMin} min`;

  document.getElementById('simulationResult').textContent = result;
  document.getElementById('simulationOutput').classList.remove('hidden');

  // Generate recommendations
  const recommendations = [];
  if (trains > capacity) recommendations.push('Add one track or convert to moving-block signalling to increase headway.');
  if (platforms < 4 && trains > 80) recommendations.push('Increase platforms at peak junctions to reduce dwell conflicts.');
  if (signal === 'fixed' && trains > 100) recommendations.push('Upgrade to moving-block (ETCS-like) for ~35% higher capacity.');
  if (mode !== 'balanced') recommendations.push('Rebalance priority off-peak to recover cumulative freight/passenger delays.');
  recommendations.push('Ingest KAVACH, EI/RRI, TMS feeds; run DRL+OR hybrid for real-time re-pathing.');

  const recsContainer = document.getElementById('recommendations');
  recsContainer.innerHTML = `
        <h4 class="font-medium mb-3">System Recommendations</h4>
        <div class="space-y-2">
            ${recommendations.map((rec, index) => `
                <div class="flex items-start gap-2 p-2 bg-slate-700/50 rounded-lg">
                    <span class="badge badge-blue">${index + 1}</span>
                    <p class="text-sm">${rec}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Comparison
function runComparison() {
  const aiSaved = 25 + Math.floor(Math.random() * 12);
  const judgeSaved = 8 + Math.floor(Math.random() * 6);

  const result = `AI Optimizer saved ${aiSaved} minutes vs Manual Judge saved ${judgeSaved} minutes.`;
  document.getElementById('comparisonResult').textContent = result;
  document.getElementById('comparisonResult').classList.remove('hidden');

  // Show chart
  document.getElementById('comparisonChart').classList.remove('hidden');

  // Create comparison chart
  const ctx = document.getElementById('compareChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Manual Judge', 'AI Optimizer'],
      datasets: [{
        label: 'Minutes Saved',
        data: [judgeSaved, aiSaved],
        backgroundColor: ['#F59E0B', '#10B981'],
        borderColor: ['#D97706', '#059669'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#94a3b8'
          },
          grid: {
            color: '#334155'
          }
        },
        x: {
          ticks: {
            color: '#94a3b8'
          },
          grid: {
            color: '#334155'
          }
        }
      }
    }
  });
}

// Reports
function renderIssuesList() {
  const container = document.getElementById('issuesList');

  container.innerHTML = appState.issues.map(issue => `
        <div class="issue-card" data-issue-id="${issue.id}">
            <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                    <i data-lucide="${getIssueTypeIcon(issue.type)}" class="h-4 w-4"></i>
                    <span class="font-medium text-sm">${issue.title}</span>
                </div>
                <div class="flex gap-1">
                    <span class="badge ${getSeverityBadgeClass(issue.severity)}">${issue.severity}</span>
                    <span class="badge ${getStatusBadgeClass(issue.status)}">${issue.status.replace('_', ' ')}</span>
                </div>
            </div>
            
            <p class="text-xs text-slate-400 mb-2">${issue.description}</p>
            
            <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                    <i data-lucide="clock" class="h-3 w-3"></i>
                    <span>${new Date(issue.reportedAt).toLocaleString()}</span>
                </div>
                <span class="text-slate-400">${issue.location}</span>
            </div>
            
            ${issue.affectedTrains && issue.affectedTrains.length > 0 ? `
                <div class="mt-2 flex gap-1">
                    ${issue.affectedTrains.map(trainId => `<span class="badge badge-blue">${trainId}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');

  lucide.createIcons();
}

function renderScenariosList() {
  const container = document.getElementById('scenariosList');

  container.innerHTML = appState.scenarios.map(scenario => `
        <div class="issue-card" data-scenario-id="${scenario.id}">
            <div class="flex items-start justify-between">
                <div>
                    <h4 class="font-medium text-sm">${scenario.name}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="badge badge-blue">${scenario.type}</span>
                        <span class="text-xs text-slate-400">${new Date(scenario.timestamp).toLocaleString()}</span>
                    </div>
                </div>
                <button class="text-red-400 hover:text-red-300" onclick="removeScenario(${scenario.id})">
                    <i data-lucide="trash-2" class="h-3 w-3"></i>
                </button>
            </div>
            
            <div class="mt-2 p-2 bg-slate-700/50 rounded text-xs font-mono">
                ${JSON.stringify(scenario.data, null, 1)}
            </div>
        </div>
    `).join('');

  document.getElementById('scenarioCount').textContent = appState.scenarios.length;
  lucide.createIcons();
}

function getIssueTypeIcon(type) {
  switch (type) {
    case 'train': return 'train';
    case 'track': return 'zap';
    case 'platform': return 'check-circle';
    case 'signal': return 'alert-triangle';
    default: return 'file-text';
  }
}

function getSeverityBadgeClass(severity) {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'resolved': return 'badge-green';
    case 'in_progress': return 'badge-orange';
    case 'open': return 'badge-red';
    default: return 'badge-blue';
  }
}

function saveScenario() {
  const newScenario = {
    id: appState.scenarios.length + 1,
    name: `Scenario ${new Date().toLocaleDateString()}`,
    timestamp: new Date().toISOString(),
    type: 'Manual Save',
    data: { saved_at: Date.now() }
  };

  appState.scenarios.unshift(newScenario);
  renderScenariosList();
  showReportStatus('✅ Scenario saved successfully!');
}

function downloadReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalIssues: appState.issues.length,
      criticalIssues: appState.issues.filter(i => i.severity === 'critical').length,
      openIssues: appState.issues.filter(i => i.status === 'open').length,
      resolvedIssues: appState.issues.filter(i => i.status === 'resolved').length
    },
    issues: appState.issues,
    scenarios: appState.scenarios
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'railvision_report.json';
  a.click();
  URL.revokeObjectURL(url);

  showReportStatus('📥 Report downloaded successfully!');
}

function clearSavedScenarios() {
  appState.scenarios = [];
  renderScenariosList();
  showReportStatus('🗑️ Cleared all saved scenarios.');
}

function removeScenario(id) {
  appState.scenarios = appState.scenarios.filter(s => s.id !== id);
  renderScenariosList();
}

function showReportStatus(message) {
  const statusEl = document.getElementById('reportStatus');
  statusEl.textContent = message;
  statusEl.classList.remove('hidden');
  setTimeout(() => {
    statusEl.classList.add('hidden');
  }, 3000);
}

// Charts
function initializeCharts() {
  initializeTrafficChart();
  initializePerformanceChart();
}

function initializeTrafficChart() {
  const ctx = document.getElementById('trafficChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{
        label: 'Trains per Hour',
        data: [40, 65, 120, 150, 110, 80],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#94a3b8'
          },
          grid: {
            color: '#334155'
          }
        },
        x: {
          ticks: {
            color: '#94a3b8'
          },
          grid: {
            color: '#334155'
          }
        }
      }
    }
  });
}

function initializePerformanceChart() {
  const ctx = document.getElementById('performanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Throughput', 'Efficiency', 'Safety'],
      datasets: [
        {
          label: 'Current',
          data: [85, 92, 98],
          backgroundColor: '#8b5cf6'
        },
        {
          label: 'Target',
          data: [80, 85, 95],
          backgroundColor: '#64748b'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#94a3b8'
          },
          grid: {
            color: '#334155'
          }
        },
        x: {
          ticks: {
            color: '#94a3b8'
          },
          grid: {
            color: '#334155'
          }
        }
      }
    }
  });
}