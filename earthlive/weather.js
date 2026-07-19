const WeatherMode = {
    init() {
        this.layerGroup = MapEngine.getLayer('weather');
        this.setupWeatherLayers();
    },

    setupWeatherLayers() {
        // Menggunakan tile gratis (CyclOSM) sebagai mock radar untuk mendemonstrasikan perpindahan Map Layer berjalan
        const mockRadarLayer = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
            opacity: 0.5,
            attribution: 'Mock Weather Overlay © OpenStreetMap'
        });

        mockRadarLayer.addTo(this.layerGroup);
    }
};
