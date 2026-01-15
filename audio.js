// audio.js - VERSÃO CORRIGIDA
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.music = null;
        this.enabled = true;
        this.musicVolume = 0.3;
        this.soundVolume = 0.5;
        this.currentMusic = null;
        this.initialized = false;
        
        this.loadSettings();
        this.init();
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            // Criar contexto de áudio com fallback
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Configurar para auto-resume
            this.setupAudioContext();
            
            // Criar sons básicos
            this.createSounds();
            
            // Marcar como inicializado
            this.initialized = true;
            
            // Aguardar interação do usuário para ativar áudio
            this.setupUserInteraction();
            
            console.log('✅ Sistema de áudio inicializado');
            
        } catch (e) {
            console.warn('Áudio não suportado, usando modo silencioso:', e);
            this.enabled = false;
            this.initialized = true;
        }
    }
    
    setupAudioContext() {
        // Configurar contexto para auto-resume
        if (this.audioContext) {
            // Adicionar evento para manter contexto ativo
            document.addEventListener('click', () => {
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            }, { once: true });
            
            // Prevenir suspensão automática
            this.audioContext.onstatechange = () => {
                console.log('Áudio context state:', this.audioContext.state);
                if (this.audioContext.state === 'suspended') {
                    setTimeout(() => {
                        if (this.audioContext.state === 'suspended') {
                            this.audioContext.resume();
                        }
                    }, 100);
                }
            };
        }
    }
    
    setupUserInteraction() {
        // Ativar áudio na primeira interação do usuário
        const activateAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('Áudio ativado por interação do usuário');
                });
            }
            // Remover listeners após ativação
            ['click', 'keydown', 'touchstart'].forEach(event => {
                document.removeEventListener(event, activateAudio);
            });
        };
        
        // Adicionar listeners para múltiplos eventos
        ['click', 'keydown', 'touchstart'].forEach(event => {
            document.addEventListener(event, activateAudio, { once: true });
        });
    }
    
    createSounds() {
        // Som correto (frequências agradáveis)
        this.sounds.correct = this.createBellSound([523.25, 659.25, 783.99]); // C5, E5, G5
        
        // Som incorreto (frequências dissonantes)
        this.sounds.incorrect = this.createBellSound([440, 466.16, 493.88]); // A4, A#4, B4
        
        // Som de clique/hover
        this.sounds.click = this.createClickSound();
        
        // Som de conquista
        this.sounds.achievement = this.createAchievementSound();
        
        // Som de erro crítico
        this.sounds.critical = this.createCriticalSound();
        
        // Som de ajuda
        this.sounds.help = this.createHelpSound();
        
        // Som de vitória
        this.sounds.victory = this.createVictorySound();
        
        // Som de notificação
        this.sounds.notification = this.createNotificationSound();
    }
    
    createBellSound(frequencies) {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            this.ensureAudioContext();
            
            const now = this.audioContext.currentTime;
            
            frequencies.forEach((freq, index) => {
                try {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, now);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.3, now + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1 + (index * 0.1));
                    
                    oscillator.start(now + (index * 0.05));
                    oscillator.stop(now + 1 + (index * 0.1));
                } catch (e) {
                    console.warn('Erro ao criar som de sino:', e);
                }
            });
        };
    }
    
    createClickSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            this.ensureAudioContext();
            
            const now = this.audioContext.currentTime;
            
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.1, now + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                
                oscillator.start(now);
                oscillator.stop(now + 0.1);
            } catch (e) {
                console.warn('Erro ao criar som de clique:', e);
            }
        };
    }
    
    createAchievementSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            this.ensureAudioContext();
            
            const now = this.audioContext.currentTime;
            const frequencies = [523.25, 659.25, 783.99, 1046.50]; // Escala ascendente
            
            frequencies.forEach((freq, index) => {
                try {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, now);
                    oscillator.type = 'triangle';
                    
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.4, now + 0.1 + (index * 0.1));
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + (index * 0.1));
                    
                    oscillator.start(now + (index * 0.1));
                    oscillator.stop(now + 0.5 + (index * 0.1));
                } catch (e) {
                    console.warn('Erro ao criar som de conquista:', e);
                }
            });
        };
    }
    
    createCriticalSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            this.ensureAudioContext();
            
            const now = this.audioContext.currentTime;
            
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(220, now);
                oscillator.frequency.exponentialRampToValueAtTime(55, now + 0.5);
                oscillator.type = 'sawtooth';
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.3, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                
                oscillator.start(now);
                oscillator.stop(now + 0.5);
            } catch (e) {
                console.warn('Erro ao criar som crítico:', e);
            }
        };
    }
    
    createHelpSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            this.ensureAudioContext();
            
            const now = this.audioContext.currentTime;
            
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(392, now);
                oscillator.frequency.setValueAtTime(440, now + 0.1);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.2, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                
                oscillator.start(now);
                oscillator.stop(now + 0.3);
            } catch (e) {
                console.warn('Erro ao criar som de ajuda:', e);
            }
        };
    }
    
    createVictorySound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            this.ensureAudioContext();
            
            const now = this.audioContext.currentTime;
            const notes = [
                { freq: 523.25, duration: 0.2 }, // C5
                { freq: 587.33, duration: 0.2 }, // D5
                { freq: 659.25, duration: 0.2 }, // E5
                { freq: 698.46, duration: 0.2 }, // F5
                { freq: 783.99, duration: 0.4 }, // G5
                { freq: 880.00, duration: 0.4 }, // A5
                { freq: 987.77, duration: 0.4 }, // B5
                { freq: 1046.50, duration: 0.6 }  // C6
            ];
            
            let currentTime = now;
            
            notes.forEach((note, index) => {
                try {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(note.freq, currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.3, currentTime + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);
                    
                    oscillator.start(currentTime);
                    oscillator.stop(currentTime + note.duration);
                    
                    currentTime += note.duration * 0.8;
                } catch (e) {
                    console.warn('Erro ao criar nota de vitória:', e);
                }
            });
        };
    }
    
    createNotificationSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            this.ensureAudioContext();
            
            const now = this.audioContext.currentTime;
            
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(880, now);
                oscillator.frequency.setValueAtTime(1046.50, now + 0.1);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.2, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                
                oscillator.start(now);
                oscillator.stop(now + 0.3);
            } catch (e) {
                console.warn('Erro ao criar som de notificação:', e);
            }
        };
    }
    
    ensureAudioContext() {
        if (!this.audioContext) return;
        
        // Garantir que o contexto esteja rodando
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(e => {
                console.warn('Não foi possível retomar contexto de áudio:', e);
            });
        }
    }
    
    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) {
            console.warn(`Som "${soundName}" não disponível`);
            return;
        }
        
        try {
            this.ensureAudioContext();
            
            // Pequeno delay para garantir estabilidade
            setTimeout(() => {
                try {
                    this.sounds[soundName]();
                } catch (e) {
                    console.warn(`Erro ao tocar som "${soundName}":`, e);
                }
            }, 10);
            
        } catch (e) {
            console.warn('Erro no sistema de áudio:', e);
        }
    }
    
    toggle() {
        this.enabled = !this.enabled;
        this.saveSettings();
        
        // Forçar estado do contexto de áudio
        if (this.enabled && this.audioContext) {
            this.audioContext.resume();
        } else if (!this.enabled && this.currentMusic) {
            this.currentMusic.stop();
        }
        
        return this.enabled;
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('kabbalah_audio_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.enabled = settings.enabled !== false;
                this.musicVolume = settings.musicVolume || 0.3;
                this.soundVolume = settings.soundVolume || 0.5;
            }
        } catch (e) {
            console.warn('Não foi possível carregar configurações de áudio:', e);
            // Usar valores padrão
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('kabbalah_audio_settings', JSON.stringify({
                enabled: this.enabled,
                musicVolume: this.musicVolume,
                soundVolume: this.soundVolume
            }));
        } catch (e) {
            console.warn('Não foi possível salvar configurações de áudio:', e);
        }
    }
    
    showAudioSettings() {
        const html = `
            <h3>🔊 Configurações de Áudio</h3>
            
            <div class="audio-settings">
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="audio-enabled" ${this.enabled ? 'checked' : ''}
                               onchange="audioSystem.enabled = this.checked; audioSystem.saveSettings();">
                        Ativar Áudio
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>Volume da Música: <span id="music-volume-value">${Math.round(this.musicVolume * 100)}%</span></label>
                    <input type="range" id="music-volume" min="0" max="100" value="${this.musicVolume * 100}" 
                           oninput="audioSystem.setMusicVolume(this.value / 100); 
                                    document.getElementById('music-volume-value').textContent = this.value + '%';">
                </div>
                
                <div class="setting-item">
                    <label>Volume dos Efeitos: <span id="sound-volume-value">${Math.round(this.soundVolume * 100)}%</span></label>
                    <input type="range" id="sound-volume" min="0" max="100" value="${this.soundVolume * 100}" 
                           oninput="audioSystem.setSoundVolume(this.value / 100); 
                                    document.getElementById('sound-volume-value').textContent = this.value + '%';">
                </div>
                
                <div class="audio-test">
                    <h4>🎵 Testar Sons:</h4>
                    <div class="audio-test-buttons">
                        <button class="btn small" onclick="audioSystem.play('click')">Clique</button>
                        <button class="btn small" onclick="audioSystem.play('correct')">Correto</button>
                        <button class="btn small" onclick="audioSystem.play('incorrect')">Incorreto</button>
                        <button class="btn small" onclick="audioSystem.play('achievement')">Conquista</button>
                        <button class="btn small" onclick="audioSystem.play('notification')">Notificação</button>
                    </div>
                </div>
                
                <div class="audio-status">
                    <h4>📊 Status do Áudio:</h4>
                    <div class="status-info">
                        <div>Estado: <span class="${this.enabled ? 'status-on' : 'status-off'}">${this.enabled ? '✅ Ativo' : '❌ Inativo'}</span></div>
                        <div>Contexto: <span class="${this.audioContext && this.audioContext.state === 'running' ? 'status-on' : 'status-off'}">${this.audioContext ? this.audioContext.state : 'Não disponível'}</span></div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn" onclick="audioSystem.toggle(); 
                         document.getElementById('audio-enabled').checked = audioSystem.enabled;">
                         ${this.enabled ? '🔇 Desativar Áudio' : '🔊 Ativar Áudio'}
                </button>
                <button class="btn" onclick="window.modalManager.hideAll()">Fechar</button>
            </div>
        `;
        
        if (window.modalManager) {
            window.modalManager.show('game-modal', html);
        }
    }
}

// Instância global
window.audioSystem = new AudioSystem();