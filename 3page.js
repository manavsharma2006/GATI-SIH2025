// Global state
let currentRoute = null;
let trains = [];
let stations = [];
let tracks = [];
let animationFrame = null;
let mapZoom = 1;
let mapPan = { x: 0, y: 0 };

// Route data
const routes = [
    {
        id: 'mum-del',
        from: 'Mumbai Central',
        to: 'New Delhi',
        distance: 1384,
        estimatedTime: '16h 25m',
        majorStations: ['Mumbai Central', 'Bharuch', 'Vadodara', 'Ratlam', 'Kota', 'Sawai Madhopur', 'Bharatpur', 'Mathura', 'New Delhi'],
        trainCount: 12,
        difficulty: 'Complex',
        description: 'High-traffic corridor with mixed operations',
        constraints: ['Peak hour congestion', 'Freight coordination', 'Express priority routing']
    },
    {
        id: 'del-kol',
        from: 'New Delhi',
        to: 'Kolkata',
        distance: 1441,
        estimatedTime: '17h 05m',
        majorStations: ['New Delhi', 'Ghaziabad', 'Aligarh', 'Kanpur', 'Allahabad', 'Varanasi', 'Gaya', 'Asansol', 'Kolkata'],
        trainCount: 15,
        difficulty: 'Complex',
        description: 'Dense network with multiple crossings',
        constraints: ['Platform limitations', 'Signal coordination', 'Weather dependencies']
    },
    {
        id: 'mum-che',
        from: 'Mumbai Central',
        to: 'Chennai Central',
        distance: 1279,
        estimatedTime: '21h 15m',
        majorStations: ['Mumbai Central', 'Pune', 'Solapur', 'Gulbarga', 'Secunderabad', 'Vijayawada', 'Chennai Central'],
        trainCount: 8,
        difficulty: 'Medium',
        description: 'Southern corridor with moderate traffic',
        constraints: ['Junction capacity', 'Maintenance windows', 'Regional coordination']
    },
    {
        id: 'del-ban',
        from: 'New Delhi',
        to: 'Bangalore',
        distance: 2444,
        estimatedTime: '34h 45m',
        majorStations: ['New Delhi', 'Bhopal', 'Nagpur', 'Secunderabad', 'Guntakal', 'Bangalore'],
        trainCount: 6,
        difficulty: 'Complex',
        description: 'Long-distance route with diverse priorities',
        constraints: ['Long transit times', 'Multi-zonal coordination', 'Resource optimization']
    },
    {
        id: 'che-ban',
        from: 'Chennai Central',
        to: 'Bangalore',
        distance: 362,
        estimatedTime: '4h 45m',
        majorStations: ['Chennai Central', 'Katpadi', 'Jolarpettai', 'Bangalore'],
        trainCount: 18,
        difficulty: 'Easy',
        description: 'Short-haul high-frequency corridor',
        constraints: ['Rapid turnover', 'Platform utilization', 'Suburban integration']
    },
    {
        id: 'pun-goa',
        from: 'Pune',
        to: 'Goa',
        distance: 492,
        estimatedTime: '11h 30m',
        majorStations: ['Pune', 'Satara', 'Kolhapur', 'Belgaum', 'Londa', 'Madgaon'],
        trainCount: 4,
        difficulty: 'Medium',
        description: 'Scenic route with terrain challenges',
        constraints: ['Ghat section limits', 'Weather restrictions', 'Tourist season peaks']
    }
];

// Route-specific train data
const routeTrainData = {
    'mum-del': [
        { id: '12951', name: 'Mumbai Rajdhani', type: 'superfast', currentLocation: 'Bharuch', destination: 'New Delhi', speed: 95, status: 'on-time', delay: 0, nextStation: 'Vadodara', eta: '14:30', capacity: 1200, occupancy: 85, priority: 1 },
        { id: '12952', name: 'Delhi Rajdhani', type: 'superfast', currentLocation: 'Kota', destination: 'Mumbai Central', speed: 0, status: 'delayed', delay: 25, nextStation: 'Sawai Madhopur', eta: '16:45', capacity: 1200, occupancy: 92, priority: 1 },
        { id: '19033', name: 'Gujarat Mail', type: 'express', currentLocation: 'Ratlam', destination: 'Mumbai Central', speed: 72, status: 'normal', delay: 5, nextStation: 'Vadodara', eta: '18:20', capacity: 1800, occupancy: 76, priority: 2 },
        { id: '12903', name: 'Golden Temple Mail', type: 'express', currentLocation: 'Mathura', destination: 'Mumbai Central', speed: 68, status: 'normal', delay: 0, nextStation: 'Bharatpur', eta: '19:15', capacity: 1600, occupancy: 68, priority: 2 },
        { id: '12137', name: 'Punjab Mail', type: 'express', currentLocation: 'New Delhi', destination: 'Mumbai Central', speed: 78, status: 'normal', delay: 10, nextStation: 'Mathura', eta: '08:30', capacity: 1500, occupancy: 82, priority: 2 },
        { id: 'FR001', name: 'Freight Container', type: 'freight', currentLocation: 'Mumbai Central', destination: 'New Delhi', speed: 35, status: 'normal', delay: 0, nextStation: 'Bharuch', eta: '22:30', capacity: 2000, occupancy: 95, priority: 4 },
        { id: 'FR002', name: 'Coal Transport', type: 'freight', currentLocation: 'Bharatpur', destination: 'Mumbai Central', speed: 42, status: 'normal', delay: 15, nextStation: 'Mathura', eta: '03:20', capacity: 2200, occupancy: 88, priority: 4 },
        { id: '12009', name: 'Shatabdi Express', type: 'superfast', currentLocation: 'Sawai Madhopur', destination: 'New Delhi', speed: 88, status: 'on-time', delay: 0, nextStation: 'Bharatpur', eta: '20:15', capacity: 800, occupancy: 95, priority: 1 }
    ],
    'del-kol': [
        { id: '12301', name: 'Howrah Rajdhani', type: 'superfast', currentLocation: 'Kanpur', destination: 'Kolkata', speed: 92, status: 'on-time', delay: 0, nextStation: 'Allahabad', eta: '15:20', capacity: 1200, occupancy: 88, priority: 1 },
        { id: '12302', name: 'Kolkata Rajdhani', type: 'superfast', currentLocation: 'Gaya', destination: 'New Delhi', speed: 89, status: 'normal', delay: 12, nextStation: 'Varanasi', eta: '17:35', capacity: 1200, occupancy: 94, priority: 1 },
        { id: '12273', name: 'Howrah Duronto', type: 'express', currentLocation: 'Varanasi', destination: 'New Delhi', speed: 75, status: 'delayed', delay: 35, nextStation: 'Allahabad', eta: '19:45', capacity: 1600, occupancy: 82, priority: 2 },
        { id: '12381', name: 'Poorva Express', type: 'express', currentLocation: 'Allahabad', destination: 'New Delhi', speed: 68, status: 'normal', delay: 8, nextStation: 'Kanpur', eta: '21:10', capacity: 1500, occupancy: 76, priority: 2 },
        { id: '13483', name: 'Farakka Express', type: 'express', currentLocation: 'Asansol', destination: 'New Delhi', speed: 62, status: 'normal', delay: 0, nextStation: 'Gaya', eta: '23:30', capacity: 1700, occupancy: 69, priority: 2 },
        { id: '12311', name: 'Kalka Mail', type: 'express', currentLocation: 'Ghaziabad', destination: 'Kolkata', speed: 71, status: 'normal', delay: 5, nextStation: 'Aligarh', eta: '08:15', capacity: 1400, occupancy: 73, priority: 2 }
    ],
    'mum-che': [
        { id: '12163', name: 'Chennai Express', type: 'superfast', currentLocation: 'Pune', destination: 'Chennai Central', speed: 87, status: 'on-time', delay: 0, nextStation: 'Solapur', eta: '16:45', capacity: 1300, occupancy: 91, priority: 1 },
        { id: '12164', name: 'Mumbai Express', type: 'superfast', currentLocation: 'Vijayawada', destination: 'Mumbai Central', speed: 84, status: 'normal', delay: 15, nextStation: 'Secunderabad', eta: '14:20', capacity: 1300, occupancy: 88, priority: 1 },
        { id: '17031', name: 'Hyderabad Express', type: 'express', currentLocation: 'Secunderabad', destination: 'Mumbai Central', speed: 69, status: 'delayed', delay: 28, nextStation: 'Gulbarga', eta: '18:35', capacity: 1650, occupancy: 79, priority: 2 },
        { id: '11013', name: 'Coimbatore Express', type: 'express', currentLocation: 'Solapur', destination: 'Chennai Central', speed: 72, status: 'normal', delay: 5, nextStation: 'Gulbarga', eta: '20:10', capacity: 1550, occupancy: 73, priority: 2 }
    ]
};

// Route-specific station data
const routeStations = {
    'mum-del': [
        { id: 's1', name: 'Mumbai Central', x: 100, y: 300, type: 'major', platforms: 12, capacity: 15000, currentOccupancy: 8500 },
        { id: 's2', name: 'Bharuch', x: 200, y: 300, type: 'major', platforms: 6, capacity: 5000, currentOccupancy: 2800 },
        { id: 's3', name: 'Vadodara', x: 300, y: 300, type: 'major', platforms: 8, capacity: 8000, currentOccupancy: 4200 },
        { id: 's4', name: 'Ratlam', x: 450, y: 300, type: 'major', platforms: 5, capacity: 4000, currentOccupancy: 2100 },
        { id: 's5', name: 'Kota', x: 600, y: 300, type: 'major', platforms: 7, capacity: 6000, currentOccupancy: 3800 },
        { id: 's6', name: 'Sawai Madhopur', x: 680, y: 300, type: 'minor', platforms: 4, capacity: 2500, currentOccupancy: 1200 },
        { id: 's7', name: 'Bharatpur', x: 750, y: 300, type: 'minor', platforms: 3, capacity: 2000, currentOccupancy: 900 },
        { id: 's8', name: 'Mathura', x: 820, y: 300, type: 'major', platforms: 6, capacity: 5500, currentOccupancy: 3200 },
        { id: 's9', name: 'New Delhi', x: 900, y: 300, type: 'major', platforms: 16, capacity: 25000, currentOccupancy: 18000 }
    ],
    'del-kol': [
        { id: 's1', name: 'New Delhi', x: 100, y: 300, type: 'major', platforms: 16, capacity: 25000, currentOccupancy: 18000 },
        { id: 's2', name: 'Ghaziabad', x: 180, y: 300, type: 'minor', platforms: 4, capacity: 3000, currentOccupancy: 1800 },
        { id: 's3', name: 'Aligarh', x: 300, y: 300, type: 'major', platforms: 6, capacity: 4500, currentOccupancy: 2600 },
        { id: 's4', name: 'Kanpur', x: 450, y: 300, type: 'major', platforms: 10, capacity: 12000, currentOccupancy: 7200 },
        { id: 's5', name: 'Allahabad', x: 550, y: 300, type: 'major', platforms: 8, capacity: 8000, currentOccupancy: 4800 },
        { id: 's6', name: 'Varanasi', x: 650, y: 300, type: 'major', platforms: 7, capacity: 6500, currentOccupancy: 4100 },
        { id: 's7', name: 'Gaya', x: 750, y: 300, type: 'minor', platforms: 4, capacity: 3000, currentOccupancy: 1900 },
        { id: 's8', name: 'Asansol', x: 820, y: 300, type: 'major', platforms: 6, capacity: 5000, currentOccupancy: 3200 },
        { id: 's9', name: 'Kolkata', x: 900, y: 300, type: 'major', platforms: 14, capacity: 20000, currentOccupancy: 15000 }
    ],
    'mum-che': [
        { id: 's1', name: 'Mumbai Central', x: 100, y: 300, type: 'major', platforms: 12, capacity: 15000, currentOccupancy: 8500 },
        { id: 's2', name: 'Pune', x: 250, y: 300, type: 'major', platforms: 8, capacity: 8000, currentOccupancy: 4500 },
        { id: 's3', name: 'Solapur', x: 400, y: 300, type: 'major', platforms: 6, capacity: 5000, currentOccupancy: 2800 },
        { id: 's4', name: 'Gulbarga', x: 520, y: 300, type: 'minor', platforms: 4, capacity: 3000, currentOccupancy: 1600 },
        { id: 's5', name: 'Secunderabad', x: 650, y: 300, type: 'major', platforms: 10, capacity: 12000, currentOccupancy: 7500 },
        { id: 's6', name: 'Vijayawada', x: 750, y: 300, type: 'major', platforms: 8, capacity: 7000, currentOccupancy: 4200 },
        { id: 's7', name: 'Chennai Central', x: 900, y: 300, type: 'major', platforms: 12, capacity: 18000, currentOccupancy: 12000 }
    ]
};

// Initialize the application
function init() {
    renderRoutes();
    setupEventListeners();
    updateTime();
    setInterval(updateTime, 1000);
}

// Render route cards
function renderRoutes() {
    const routesGrid = document.getElementById('routesGrid');
    routesGrid.innerHTML = '';

    routes.forEach(route => {
        const routeCard = createRouteCard(route);
        routesGrid.appendChild(routeCard);
    });
}

// Create a route card element
function createRouteCard(route) {
    const card = document.createElement('div');
    card.className = 'route-card';
    card.dataset.routeId = route.id;

    const difficultyClass = `badge-${route.difficulty.toLowerCase()}`;

    card.innerHTML = `
        <div class="route-header">
            <div>
                <div class="route-title">${route.from} → ${route.to}</div>
                <div class="route-subtitle">${route.distance} km • ${route.estimatedTime}</div>
            </div>
            <span class="badge ${difficultyClass}">${route.difficulty}</span>
        </div>
        <div class="route-stats">
            <div class="stat-row">
                <span class="stat-label">Active Trains:</span>
                <span class="stat-value">${route.trainCount}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Major Stations:</span>
                <span class="stat-value">${route.majorStations.length}</span>
            </div>
        </div>
        <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">${route.description}</p>
        <div class="constraints">
            <div class="constraints-label">Key Constraints:</div>
            <div class="constraints-list">
                ${route.constraints.slice(0, 2).map(constraint =>
        `<span class="constraint-badge">${constraint}</span>`
    ).join('')}
                ${route.constraints.length > 2 ?
            `<span class="constraint-badge">+${route.constraints.length - 2} more</span>` : ''
        }
            </div>
        </div>
    `;

    card.addEventListener('click', () => selectRoute(route));
    return card;
}

// Select a route
function selectRoute(route) {
    // Remove previous selection
    document.querySelectorAll('.route-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to clicked card
    document.querySelector(`[data-route-id="${route.id}"]`).classList.add('selected');

    currentRoute = route;
    document.getElementById('proceedBtn').classList.remove('hidden');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const fromInput = document.getElementById('fromStation');
    const toInput = document.getElementById('toStation');

    fromInput.addEventListener('input', filterRoutes);
    toInput.addEventListener('input', filterRoutes);

    // Proceed button
    document.getElementById('proceedBtn').addEventListener('click', openDigitalTwin);

    // Back button
    document.getElementById('backBtn').addEventListener('click', backToRoutes);

    // Tab switching
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // Map controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        mapZoom = Math.min(mapZoom * 1.2, 3);
        updateMapTransform();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        mapZoom = Math.max(mapZoom / 1.2, 0.5);
        updateMapTransform();
    });

    document.getElementById('resetView').addEventListener('click', () => {
        mapZoom = 1;
        mapPan = { x: 0, y: 0 };
        updateMapTransform();
    });

    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('trainModal').addEventListener('click', (e) => {
        if (e.target.id === 'trainModal') closeModal();
    });
}

// Filter routes based on search
function filterRoutes() {
    const fromValue = document.getElementById('fromStation').value.toLowerCase();
    const toValue = document.getElementById('toStation').value.toLowerCase();

    document.querySelectorAll('.route-card').forEach(card => {
        const routeId = card.dataset.routeId;
        const route = routes.find(r => r.id === routeId);

        const matchesFrom = route.from.toLowerCase().includes(fromValue);
        const matchesTo = route.to.toLowerCase().includes(toValue);

        if (matchesFrom && matchesTo) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Open digital twin interface
function openDigitalTwin() {
    if (!currentRoute) return;

    document.getElementById('routeSelector').classList.add('hidden');
    document.getElementById('digitalTwin').classList.remove('hidden');

    // Update header info
    document.getElementById('routeInfo').textContent =
        `${currentRoute.from} → ${currentRoute.to} • ${currentRoute.distance} km`;
    document.getElementById('trainCountBadge').textContent =
        `${currentRoute.trainCount} Active Trains`;

    // Generate route data
    generateRouteData();
    renderDigitalTwin();
    startAnimation();
}

// Back to routes
function backToRoutes() {
    document.getElementById('digitalTwin').classList.add('hidden');
    document.getElementById('routeSelector').classList.remove('hidden');

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    // Reset map view
    mapZoom = 1;
    mapPan = { x: 0, y: 0 };
}

// Generate route-specific data
function generateRouteData() {
    const routeStationsData = routeStations[currentRoute.id] || routeStations['mum-del'];
    const routeTrains = routeTrainData[currentRoute.id] || routeTrainData['mum-del'];

    // Generate tracks between stations
    tracks = [];
    for (let i = 0; i < routeStationsData.length - 1; i++) {
        const station1 = routeStationsData[i];
        const station2 = routeStationsData[i + 1];

        // Up track
        tracks.push({
            id: `t${i * 2 + 1}`,
            x1: station1.x,
            y1: station1.y - 20,
            x2: station2.x,
            y2: station2.y - 20,
            status: Math.random() > 0.7 ? 'occupied' : 'clear',
            capacity: 1,
            currentLoad: Math.random() > 0.7 ? 1 : 0,
        });

        // Down track
        tracks.push({
            id: `t${i * 2 + 2}`,
            x1: station1.x,
            y1: station1.y + 20,
            x2: station2.x,
            y2: station2.y + 20,
            status: Math.random() > 0.8 ? 'occupied' : Math.random() > 0.95 ? 'problem' : 'clear',
            capacity: 1,
            currentLoad: Math.random() > 0.8 ? 1 : 0,
        });
    }

    // Position trains on map
    trains = routeTrains.map((train, index) => {
        const station = routeStationsData.find(s => s.name === train.currentLocation);
        return {
            ...train,
            x: station ? station.x + (Math.random() - 0.5) * 120 : 150 + index * 100,
            y: station ? station.y + (Math.random() - 0.5) * 60 : 280 + (Math.random() - 0.5) * 40,
            direction: Math.random() * 360,
            targetX: station ? station.x : 150 + index * 100,
            targetY: station ? station.y : 300
        };
    });

    stations = routeStationsData;
}

// Render digital twin interface
function renderDigitalTwin() {
    renderMap();
    renderStatusCards();
    renderTrainsList();
    renderJunctionsList();
    renderAnalytics();
    updatePerformanceMetrics();
}

// Render the railway map
function renderMap() {
    const svg = document.getElementById('railwayMap');

    // Clear existing content except defs
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    svg.appendChild(defs);

    // Add grid background
    const gridRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    gridRect.setAttribute('width', '100%');
    gridRect.setAttribute('height', '100%');
    gridRect.setAttribute('fill', 'url(#grid)');
    svg.appendChild(gridRect);

    // Render tracks
    tracks.forEach(track => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', track.x1);
        line.setAttribute('y1', track.y1);
        line.setAttribute('x2', track.x2);
        line.setAttribute('y2', track.y2);
        line.setAttribute('class', `track track-${track.status}`);
        line.setAttribute('data-track-id', track.id);

        // Add tooltip functionality
        line.addEventListener('mouseover', (e) => showTrackTooltip(e, track));
        line.addEventListener('mouseout', hideTooltip);

        svg.appendChild(line);
    });

    // Render stations
    stations.forEach(station => {
        // Station circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', station.x);
        circle.setAttribute('cy', station.y);
        circle.setAttribute('r', station.type === 'major' ? 8 : 5);
        circle.setAttribute('class', `station-${station.type}`);
        circle.setAttribute('data-station-id', station.id);

        // Add click functionality
        circle.addEventListener('click', () => showStationInfo(station));
        circle.addEventListener('mouseover', (e) => showStationTooltip(e, station));
        circle.addEventListener('mouseout', hideTooltip);

        svg.appendChild(circle);

        // Station label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', station.x);
        text.setAttribute('y', station.y - 15);
        text.setAttribute('class', 'station-label');
        text.textContent = station.name;
        svg.appendChild(text);

        // Capacity indicator
        const capacityBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        capacityBg.setAttribute('x', station.x - 15);
        capacityBg.setAttribute('y', station.y + 12);
        capacityBg.setAttribute('width', 30);
        capacityBg.setAttribute('height', 4);
        capacityBg.setAttribute('fill', '#e5e7eb');
        capacityBg.setAttribute('rx', 2);
        svg.appendChild(capacityBg);

        const capacityFill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const utilization = station.currentOccupancy / station.capacity;
        capacityFill.setAttribute('x', station.x - 15);
        capacityFill.setAttribute('y', station.y + 12);
        capacityFill.setAttribute('width', utilization * 30);
        capacityFill.setAttribute('height', 4);
        capacityFill.setAttribute('fill', utilization > 0.8 ? '#ef4444' : '#10b981');
        capacityFill.setAttribute('rx', 2);
        svg.appendChild(capacityFill);
    });

    // Render trains
    trains.forEach(train => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'train-group');
        group.setAttribute('data-train-id', train.id);

        // Train circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', train.x);
        circle.setAttribute('cy', train.y);
        circle.setAttribute('r', 12);
        circle.setAttribute('class', `train-dot train-${train.type} ${train.speed > 0 ? 'train-moving' : ''}`);

        // Add click functionality
        circle.addEventListener('click', () => showTrainDetails(train));
        circle.addEventListener('mouseover', (e) => showTrainTooltip(e, train));
        circle.addEventListener('mouseout', hideTooltip);

        group.appendChild(circle);

        // Train icon/emoji
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', train.x);
        text.setAttribute('y', train.y + 1);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', 'white');
        text.setAttribute('pointer-events', 'none');
        text.textContent = getTrainIcon(train.type);
        group.appendChild(text);

        // Speed indicator (direction arrow)
        if (train.speed > 0) {
            const speedLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const angle = train.direction * Math.PI / 180;
            const arrowLength = Math.min(train.speed * 0.5, 30);
            speedLine.setAttribute('x1', train.x);
            speedLine.setAttribute('y1', train.y);
            speedLine.setAttribute('x2', train.x + Math.cos(angle) * arrowLength);
            speedLine.setAttribute('y2', train.y + Math.sin(angle) * arrowLength);
            speedLine.setAttribute('stroke', getTrainColor(train.type));
            speedLine.setAttribute('stroke-width', 2);
            speedLine.setAttribute('marker-end', 'url(#arrowhead)');
            speedLine.setAttribute('opacity', 0.7);
            group.appendChild(speedLine);
        }

        svg.appendChild(group);
    });
}

// Helper functions for train rendering
function getTrainIcon(type) {
    switch (type) {
        case 'superfast': return '🚄';
        case 'express': return '🚅';
        case 'passenger': return '🚆';
        case 'freight': return '🚛';
        default: return '🚂';
    }
}

function getTrainColor(type) {
    switch (type) {
        case 'superfast': return '#8b5cf6';
        case 'express': return '#3b82f6';
        case 'passenger': return '#10b981';
        case 'freight': return '#6b7280';
        default: return '#6b7280';
    }
}

// Update map transform
function updateMapTransform() {
    const svg = document.getElementById('railwayMap');
    const transform = `scale(${mapZoom}) translate(${mapPan.x}, ${mapPan.y})`;
    svg.style.transform = transform;
}

// Render status cards
function renderStatusCards() {
    document.getElementById('totalTrains').textContent = trains.length;
    document.getElementById('clearTracks').textContent =
        tracks.filter(t => t.status === 'clear').length;
    document.getElementById('occupiedTracks').textContent =
        tracks.filter(t => t.status === 'occupied').length;
    document.getElementById('problemAreas').textContent =
        tracks.filter(t => t.status === 'problem').length;
}

// Update performance metrics
function updatePerformanceMetrics() {
    const avgSpeed = trains.length > 0 ? Math.round(trains.reduce((sum, t) => sum + t.speed, 0) / trains.length) : 0;
    const onTimeTrains = trains.filter(t => t.delay === 0).length;
    const onTimePercentage = trains.length > 0 ? Math.round((onTimeTrains / trains.length) * 100) : 0;
    const trackUtilization = tracks.length > 0 ? Math.round((tracks.filter(t => t.status === 'occupied').length / tracks.length) * 100) : 0;

    document.getElementById('avgSpeed').textContent = `${avgSpeed} km/h`;
    document.getElementById('onTimePercent').textContent = `${onTimePercentage}%`;
    document.getElementById('trackUtil').textContent = `${trackUtilization}%`;
}

// Render trains list
function renderTrainsList() {
    const trainsList = document.getElementById('trainsList');
    trainsList.innerHTML = '';

    trains.forEach(train => {
        const trainItem = createTrainItem(train);
        trainsList.appendChild(trainItem);
    });
}

// Create train item element
function createTrainItem(train) {
    const item = document.createElement('div');
    item.className = 'train-item';
    item.dataset.trainId = train.id;

    item.innerHTML = `
        <div class="train-header">
            <div>
                <div class="train-name">${train.name}</div>
                <div class="train-id">${train.id}</div>
            </div>
            <div class="train-badges">
                <span class="badge badge-${train.type}">${train.type}</span>
                <span class="badge badge-${train.status.replace('-', '')}">${train.status}</span>
            </div>
        </div>
        <div class="train-details">
            <div>
                <div class="detail-label">Location:</div>
                <div class="detail-value">${train.currentLocation}</div>
            </div>
            <div>
                <div class="detail-label">Speed:</div>
                <div class="detail-value">${train.speed} km/h</div>
            </div>
            <div>
                <div class="detail-label">Next:</div>
                <div class="detail-value">${train.nextStation}</div>
            </div>
            <div>
                <div class="detail-label">ETA:</div>
                <div class="detail-value">${train.eta}</div>
            </div>
        </div>
        ${train.delay > 0 ? `<div class="delay-warning">Delayed by ${train.delay} minutes</div>` : ''}
    `;

    item.addEventListener('click', () => showTrainDetails(train));
    return item;
}

// Render junctions list
function renderJunctionsList() {
    const junctionsList = document.getElementById('junctionsList');

    const junctions = [
        {
            id: 'J001',
            name: 'Central Junction',
            type: 'major',
            status: 'occupied',
            trainsWaiting: 3,
            avgWaitTime: 12,
            capacity: 6,
            utilization: 75
        },
        {
            id: 'J002',
            name: 'East Crossing',
            type: 'minor',
            status: 'clear',
            trainsWaiting: 0,
            avgWaitTime: 5,
            capacity: 4,
            utilization: 25
        },
        {
            id: 'J003',
            name: 'West Junction',
            type: 'major',
            status: 'conflict',
            trainsWaiting: 5,
            avgWaitTime: 18,
            capacity: 8,
            utilization: 90
        }
    ];

    junctionsList.innerHTML = junctions.map(junction => `
        <div class="train-item">
            <div class="train-header">
                <div>
                    <div class="train-name">${junction.name}</div>
                    <div class="train-id">${junction.id}</div>
                </div>
                <span class="badge badge-${junction.status === 'clear' ? 'on-time' : junction.status === 'conflict' ? 'delayed' : 'normal'}">${junction.status}</span>
            </div>
            <div class="train-details">
                <div>
                    <div class="detail-label">Waiting:</div>
                    <div class="detail-value">${junction.trainsWaiting} trains</div>
                </div>
                <div>
                    <div class="detail-label">Avg Wait:</div>
                    <div class="detail-value">${junction.avgWaitTime} min</div>
                </div>
                <div>
                    <div class="detail-label">Capacity:</div>
                    <div class="detail-value">${junction.capacity} tracks</div>
                </div>
                <div>
                    <div class="detail-label">Utilization:</div>
                    <div class="detail-value">${junction.utilization}%</div>
                </div>
            </div>
            ${junction.status === 'conflict' ? '<div class="delay-warning">⚠️ Priority conflict detected</div>' : ''}
        </div>
    `).join('');
}

// Render analytics
function renderAnalytics() {
    const analyticsContent = document.getElementById('analyticsContent');
    const onTimeTrains = trains.filter(t => t.delay === 0).length;
    const onTimePercentage = trains.length > 0 ? Math.round((onTimeTrains / trains.length) * 100) : 0;
    const avgSpeed = trains.length > 0 ? Math.round(trains.reduce((sum, t) => sum + t.speed, 0) / trains.length) : 0;
    const avgOccupancy = trains.length > 0 ? Math.round(trains.reduce((sum, t) => sum + t.occupancy, 0) / trains.length) : 0;
    const trackUtilization = tracks.length > 0 ? Math.round((tracks.filter(t => t.status === 'occupied').length / tracks.length) * 100) : 0;

    analyticsContent.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h4 style="font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                📊 Performance Metrics
            </h4>
            <div style="space-y: 1rem;">
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; color: #6b7280;">On-Time Performance</span>
                        <span style="font-size: 0.875rem; font-weight: 500;">${onTimePercentage}%</span>
                    </div>
                    <div style="background: #f3f4f6; height: 8px; border-radius: 4px;">
                        <div style="background: #10b981; height: 8px; border-radius: 4px; width: ${onTimePercentage}%;"></div>
                    </div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; color: #6b7280;">Average Speed</span>
                        <span style="font-size: 0.875rem; font-weight: 500;">${avgSpeed} km/h</span>
                    </div>
                    <div style="background: #f3f4f6; height: 8px; border-radius: 4px;">
                        <div style="background: #3b82f6; height: 8px; border-radius: 4px; width: ${Math.min(avgSpeed, 100)}%;"></div>
                    </div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; color: #6b7280;">Track Utilization</span>
                        <span style="font-size: 0.875rem; font-weight: 500;">${trackUtilization}%</span>
                    </div>
                    <div style="background: #f3f4f6; height: 8px; border-radius: 4px;">
                        <div style="background: #f59e0b; height: 8px; border-radius: 4px; width: ${trackUtilization}%;"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h4 style="font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                🤖 AI Decision Support
            </h4>
            <div style="space-y: 0.75rem;">
                <div style="padding: 0.75rem; background: #eff6ff; border-radius: 6px; border-left: 4px solid #3b82f6;">
                    <div style="font-weight: 500; font-size: 0.875rem; color: #1e40af; margin-bottom: 0.25rem;">Priority Optimization</div>
                    <div style="font-size: 0.75rem; color: #6b7280;">
                        Superfast trains prioritized on main line. Freight rerouted to avoid conflicts.
                    </div>
                </div>
                <div style="padding: 0.75rem; background: #f0fdf4; border-radius: 6px; border-left: 4px solid #10b981;">
                    <div style="font-weight: 500; font-size: 0.875rem; color: #166534; margin-bottom: 0.25rem;">Conflict Resolution</div>
                    <div style="font-size: 0.75rem; color: #6b7280;">
                        Junction conflicts resolved. 3 trains cleared from queue automatically.
                    </div>
                </div>
                <div style="padding: 0.75rem; background: #fffbeb; border-radius: 6px; border-left: 4px solid #f59e0b;">
                    <div style="font-weight: 500; font-size: 0.875rem; color: #92400e; margin-bottom: 0.25rem;">Maintenance Window</div>
                    <div style="font-size: 0.75rem; color: #6b7280;">
                        Track maintenance scheduled for 02:00-04:00. Routes optimized accordingly.
                    </div>
                </div>
            </div>
        </div>
        
        <div>
            <h4 style="font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                ⚡ System Health
            </h4>
            <div style="space-y: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.875rem;">Signal Systems</span>
                    <span class="badge badge-on-time">Operational</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.875rem;">Communication</span>
                    <span class="badge badge-on-time">Active</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.875rem;">Track Sensors</span>
                    <span class="badge badge-normal">3 Offline</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.875rem;">AI Engine</span>
                    <span class="badge badge-on-time">Learning</span>
                </div>
            </div>
        </div>
    `;
}

// Switch tabs
function switchTab(tabName) {
    // Update tab triggers
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
        trigger.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tabName}Tab`).classList.remove('hidden');
}

// Show train details modal
function showTrainDetails(train) {
    const modal = document.getElementById('trainModal');
    const modalName = document.getElementById('modalTrainName');
    const modalDetails = document.getElementById('modalTrainDetails');

    modalName.textContent = train.name;
    modalDetails.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Train ID</div>
                <div style="font-weight: 500;">${train.id}</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Type</div>
                <div style="font-weight: 500;">${train.type}</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Current Speed</div>
                <div style="font-weight: 500;">${train.speed} km/h</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Status</div>
                <span class="badge badge-${train.status.replace('-', '')}">${train.status}</span>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Current Location</div>
                <div style="font-weight: 500;">${train.currentLocation}</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Destination</div>
                <div style="font-weight: 500;">${train.destination}</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Next Station</div>
                <div style="font-weight: 500;">${train.nextStation}</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">ETA</div>
                <div style="font-weight: 500;">${train.eta}</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Capacity</div>
                <div style="font-weight: 500;">${train.capacity} passengers</div>
            </div>
            <div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Occupancy</div>
                <div style="font-weight: 500;">${train.occupancy}%</div>
            </div>
        </div>
        ${train.delay > 0 ? `
            <div style="padding: 0.75rem; background: #fee2e2; border-radius: 6px; margin-top: 1rem;">
                <div style="font-weight: 500; color: #991b1b;">⚠️ Train is delayed by ${train.delay} minutes</div>
            </div>
        ` : ''}
    `;

    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('trainModal').classList.add('hidden');
}

// Tooltip functions
function showTrainTooltip(event, train) {
    // Implementation for train tooltip
    console.log('Train tooltip:', train.name);
}

function showStationTooltip(event, station) {
    // Implementation for station tooltip
    console.log('Station tooltip:', station.name);
}

function showTrackTooltip(event, track) {
    // Implementation for track tooltip
    console.log('Track tooltip:', track.id, track.status);
}

function hideTooltip() {
    // Implementation for hiding tooltip
}

function showStationInfo(station) {
    // Implementation for station info
    console.log('Station info:', station.name);
}

// Update current time
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
}

// Start train animation
function startAnimation() {
    function animate() {
        if (!currentRoute) return;

        // Update train positions and track status
        trains.forEach((train, index) => {
            if (train.speed > 0) {
                // Calculate movement along track
                const stations = routeStations[currentRoute.id] || routeStations['mum-del'];
                const currentStationIndex = stations.findIndex(s => s.name === train.currentLocation);
                const nextStationIndex = stations.findIndex(s => s.name === train.nextStation);

                if (currentStationIndex >= 0 && nextStationIndex >= 0) {
                    const currentStation = stations[currentStationIndex];
                    const nextStation = stations[nextStationIndex];

                    // Move towards next station
                    const dx = nextStation.x - train.x;
                    const dy = nextStation.y - train.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 5) {
                        const speed = train.speed * 0.02; // Scale movement
                        train.x += (dx / distance) * speed;
                        train.y += (dy / distance) * speed;
                    } else {
                        // Reached station, potentially move to next
                        if (Math.random() > 0.98) { // 2% chance per frame
                            const nextIndex = (nextStationIndex + 1) % stations.length;
                            if (nextIndex !== currentStationIndex) {
                                train.currentLocation = train.nextStation;
                                train.nextStation = stations[nextIndex].name;
                            }
                        }
                    }
                }

                // Update direction for speed indicator
                train.direction = Math.atan2(
                    train.targetY - train.y,
                    train.targetX - train.x
                ) * 180 / Math.PI;
            }
        });

        // Randomly update track status to simulate dynamic conditions
        if (Math.random() > 0.99) { // 1% chance per frame
            const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
            const statuses = ['clear', 'occupied', 'problem'];
            randomTrack.status = statuses[Math.floor(Math.random() * statuses.length)];
        }

        // Re-render map with updated positions
        renderMap();
        updatePerformanceMetrics();
        renderStatusCards();

        animationFrame = requestAnimationFrame(animate);
    }

    animate();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);