const FlightMode = {
    aircrafts: new Map(),
    layer: null,
    updateInterval: null,
    
    init() {
        this.layer = MapEngine.getLayer('flight');
        this.fetchRealFlights();
        
        // Update data otomatis tiap 30 detik
        this.updateInterval = setInterval(() => this.fetchRealFlights(), 30000);
    },

    async fetchRealFlights() {
        try {
            console.log("[Flight] Mencoba mengambil data Live Radar asli...");
            
            // Area Indonesia & ASEAN API Request
            const response = await fetch('https://opensky-network.org/api/states/all?lamin=-15&lomin=90&lamax=15&lomax=140');
            
            if (!response.ok) throw new Error('API OpenSky sedang limit/sibuk');
            
            const data = await response.json();
            
            if (data && data.states && data.states.length > 0) {
                this.layer.clearLayers();
                this.aircrafts.clear();
                const markersToCluster = [];

                data.states.forEach(flight => {
                    const lat = flight[6];
                    const lng = flight[5];

                    if (lat && lng) {
                        const marker = this.createMarker({
                            id: flight[0],
                            flightNo: flight[1] ? flight[1].trim() : 'UNKNOWN',
                            type: 'Live Aircraft',
                            lat: lat,
                            lng: lng,
                            heading: flight[10] || 0,
                            alt: flight[7] ? Math.round(flight[7] * 3.28084) : 0,
                            speed: flight[9] ? Math.round(flight[9] * 1.94384) : 0,
                            origin: flight[2],
                            dest: 'Live Tracking'
                        });
                        markersToCluster.push(marker);
                    }
                });
                
                // Memasukkan array secara massal ke dalam sistem MarkerCluster
                this.layer.addLayers(markersToCluster);
                console.log(`[Flight] Berhasil memuat ${markersToCluster.length} pesawat asli.`);
            } else {
                throw new Error("Data pesawat kosong");
            }
        } catch (error) {
            console.warn("[Flight] API Gagal / Limit. Menjalankan radar global simulasi...");
            this.generateSimulatedGlobalFlights(50);
        }
    },

    generateSimulatedGlobalFlights(count) {
        this.layer.clearLayers();
        this.aircrafts.clear();
        const markersToCluster = [];
        const airlines = ['Garuda', 'Emirates', 'Qatar', 'Singapore Air', 'ANA', 'Cathay'];

        for (let i = 0; i < count; i++) {
            // Random area Indonesia & sekitarnya untuk simulasi
            const randomLat = (Math.random() * 20) - 10; 
            const randomLng = (Math.random() * 40) + 100;
            const randomHeading = Math.floor(Math.random() * 360);
            const randomSpeed = Math.floor(Math.random() * 300) + 200; 

            const marker = this.createMarker({
                id: `SIM-${i}`,
                flightNo: `${airlines[Math.floor(Math.random() * airlines.length)]} ${Math.floor(Math.random() * 999)}`,
                type: 'Boeing 777 / A350',
                lat: randomLat,
                lng: randomLng,
                heading: randomHeading,
                alt: 35000,
                speed: randomSpeed,
                origin: 'Simulated',
                dest: 'In Transit'
            });

            markersToCluster.push(marker);
        }

        this.layer.addLayers(markersToCluster);
    },

    createMarker(data) {
        const icon = L.divIcon({
            html: `<div class="custom-marker" style="transform: rotate(${data.heading}deg); font-size: 24px; color: var(--neon-purple);">✈</div>`,
            className: 'flight-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([data.lat, data.lng], { icon });
        
        // Memastikan parameter data sesuai dengan format Object Bottom Sheet
        marker.on('click', () => {
            if (typeof UI !== 'undefined') {
                UI.openBottomSheet({
                    "Callsign": data.flightNo,
                    "Country": data.origin,
                    "Altitude": `${data.alt} ft`,
                    "Speed": `${data.speed} kts`,
                    "Status": 'In Air',
                    "Aircraft": data.type
                });
            }
        });

        this.aircrafts.set(data.id, { marker, data });
        return marker;
    }
};
