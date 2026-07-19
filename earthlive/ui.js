const UI = {
    init() {
        this.bindModeSelectors();
        this.bindFAB();
        this.bindBottomSheet();
        
        // Memaksa mode default "flight" saat map pertama kali terbuka
        window.dispatchEvent(new CustomEvent('xaerisoft:modeChange', { detail: 'flight' }));
    },
    
    bindModeSelectors() {
        const modeBtns = document.querySelectorAll('.mode-btn');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Ubah style tombol aktif
                modeBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Trigger event untuk didengarkan oleh MapEngine
                const mode = e.currentTarget.getAttribute('data-mode');
                window.dispatchEvent(new CustomEvent('xaerisoft:modeChange', { detail: mode }));
            });
        });
    },
    
    bindFAB() {
        const fabMain = document.getElementById('fab-main');
        const fabMenu = document.getElementById('fab-menu');
        
        if (fabMain && fabMenu) {
            fabMain.addEventListener('click', () => {
                fabMenu.classList.toggle('open');
            });
        }

        document.querySelectorAll('.fab-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.executeFabAction(action);
                fabMenu.classList.remove('open');
            });
        });
    },
    
    executeFabAction(action) {
        switch(action) {
            case 'style':
            case 'layers':
                // Toggle mode gelap ke satelit
                const nextStyle = MapEngine.currentStyle === 'dark' ? 'satellite' : 'dark';
                MapEngine.setMapStyle(nextStyle);
                break;
            case 'locate':
                MapEngine.locateUser();
                break;
            case 'measure':
                alert('Fitur pengukuran jarak sedang dalam tahap pengembangan.');
                break;
            case 'fullscreen':
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.warn(`Fullscreen error: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
                break;
        }
    },
    
    bindBottomSheet() {
        const btnClose = document.getElementById('btn-close-sheet');
        if (btnClose) {
            btnClose.addEventListener('click', () => this.closeBottomSheet());
        }
    },
    
    openBottomSheet(data) {
        const sheet = document.getElementById('bottom-sheet');
        const content = document.getElementById('sheet-content');
        
        if (!sheet || !content) return;
        
        // Loop otomatis semua data menjadi Grid UI
        let html = '';
        for (const [key, value] of Object.entries(data)) {
            html += `
                <div class="data-card">
                    <div class="data-label">${key}</div>
                    <div class="data-value">${value}</div>
                </div>
            `;
        }
        
        content.innerHTML = html;
        sheet.classList.add('open');
    },
    
    closeBottomSheet() {
        const sheet = document.getElementById('bottom-sheet');
        if (sheet) sheet.classList.remove('open');
    }
};
