const SearchController = {
    init() {
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 500), { passive: true });
        }
    },

    debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    },

    handleSearch(query) {
        if (query.length < 3) return;
        console.log(`[Search] Resolving query for: ${query}`);
        
        // Mock Search Result untuk demo
        UI.openBottomSheet({
            "Result": "Search Detected",
            "Keyword": query.toUpperCase(),
            "Action": "Ready to map coordinate",
            "Status": "API connected"
        });
    }
};
