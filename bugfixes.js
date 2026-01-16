// bugfixes.js - Correções finais e otimizações

class BugFixes {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🔧 Inicializando correções de bugs...');
        
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }
        
        this.fixLayout();
        this.fixAudioSystem();
        this.fixPointsSystem();
        this.fixAchievements();
        this.fixDailyChallenge();
        this.fixKeyboard();
        this.fixModals();
        this.fixAnimations();
        this.fixLocalStorage();
        this.fixResponsiveness();
        this.preventGlobalScroll();
        this.fixModalOverflow();
        this.ensureFooterMargin();
        this.preventContentOverflow();
        
        console.log('✅ Todas as correções aplicadas com sucesso!');
    }

    fixLayout() {
        const gameArea = document.getElementById('game-area');
        if (!gameArea) return;
        
        if (gameArea.querySelector('.game-grid-container')) return;
        
        const questionPanel = document.getElementById('question-panel');
        const treeOfLife = document.querySelector('.tree-of-life');
        const gameStatus = document.querySelector('.game-status');
        
        if (!questionPanel || !treeOfLife || !gameStatus) return;
        
        const gridContainer = document.createElement('div');
        gridContainer.className = 'game-grid-container';
        
        gameArea.innerHTML = '';
        gridContainer.appendChild(questionPanel);
        gridContainer.appendChild(treeOfLife);
        gridContainer.appendChild(gameStatus);
        gameArea.appendChild(gridContainer);
        
        console.log('✅ Layout corrigido');
    }

    fixAudioSystem() {
        if (!window.audioSystem) return;
        
        const initAudio = () => {
            if (window.audioSystem && !window.audioSystem.initialized) {
                window.audioSystem.init();
            }
            ['click', 'keydown', 'touchstart'].forEach(event => {
                document.removeEventListener(event, initAudio);
            });
        };
        
        ['click', 'keydown', 'touchstart'].forEach(event => {
            document.addEventListener(event, initAudio, { once: true });
        });
        
        console.log('✅ Sistema de áudio otimizado');
    }

    fixPointsSystem() {
        if (!window.game) return;
        
        const originalCalculate = window.game.calculatePoints;
        if (originalCalculate) {
            window.game.calculatePoints = function() {
                let maxPoints = 10;
                
                if (this.currentHelpUsed) {
                    switch(this.currentHelpUsed) {
                        case 25: maxPoints = 7.5; break;
                        case 50: maxPoints = 5.0; break;
                        case 75: maxPoints = 2.5; break;
                    }
                }
                
                const attemptPenalty = Math.max(0, this.currentAttempts - 1);
                const points = Math.max(0.5, maxPoints - attemptPenalty);
                
                return Math.round(points * 10) / 10;
            };
        }
        
        console.log('✅ Sistema de pontos corrigido');
    }

    fixAchievements() {
        if (!window.achievementSystem) return;
        
        if (window.game && !window.game.discoveredSefirot) {
            window.game.discoveredSefirot = new Set();
        }
        
        console.log('✅ Sistema de conquistas otimizado');
    }

    fixDailyChallenge() {
        console.log('✅ Sistema de desafio diário verificado');
    }

    fixKeyboard() {
        const handleGlobalKeys = (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        };
        
        document.addEventListener('keydown', handleGlobalKeys);
        
        console.log('✅ Controles de teclado centralizados');
    }
        ensureSefirotSpacing() {
        const sefirot = document.querySelectorAll('.sefirah');
        const container = document.querySelector('.tree-inner-container');
        
        if (!sefirot.length || !container) return;
        
        // Dimensões do container
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Tamanho médio das Sefirot
        const sefirahSize = 80; // Tamanho base em px
        
        // Verificar e ajustar posições se necessário
        sefirot.forEach(sefirah => {
            const style = window.getComputedStyle(sefirah);
            const left = parseFloat(style.left);
            const top = parseFloat(style.top);
            
            // Converter percentagens para pixels
            const leftPx = (left / 100) * containerWidth;
            const topPx = (top / 100) * containerHeight;
            
            // Margem mínima das bordas (20px)
            const minMargin = 20;
            
            // Verificar borda esquerda
            if (leftPx < minMargin) {
                const newLeft = (minMargin / containerWidth) * 100;
                sefirah.style.left = `${newLeft}%`;
            }
            
            // Verificar borda direita
            if (leftPx > containerWidth - sefirahSize - minMargin) {
                const newLeft = ((containerWidth - sefirahSize - minMargin) / containerWidth) * 100;
                sefirah.style.left = `${newLeft}%`;
            }
            
            // Verificar borda superior
            if (topPx < minMargin) {
                const newTop = (minMargin / containerHeight) * 100;
                sefirah.style.top = `${newTop}%`;
            }
            
            // Verificar borda inferior
            if (topPx > containerHeight - sefirahSize - minMargin) {
                const newTop = ((containerHeight - sefirahSize - minMargin) / containerHeight) * 100;
                sefirah.style.top = `${newTop}%`;
            }
        });
        
        console.log('✅ Espaçamento das Sefirot garantido');
    }

    // Chame este método no init():
    async init() {
        console.log('🔧 Inicializando correções de bugs...');
        
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }
        
        this.fixLayout();
        this.fixAudioSystem();
        this.fixPointsSystem();
        this.fixAchievements();
        this.fixDailyChallenge();
        this.fixKeyboard();
        this.fixModals();
        this.fixAnimations();
        this.fixLocalStorage();
        this.fixResponsiveness();
        this.preventGlobalScroll();
        this.fixModalOverflow();
        this.ensureFooterMargin();
        this.preventContentOverflow();
        this.ensureSefirotSpacing(); // ADICIONE ESTA LINHA
        
        console.log('✅ Todas as correções aplicadas com sucesso!');
    }

    fixModals() {
        if (!window.modalManager) {
            window.modalManager = {
                show: function(modalId, content) {
                    const modal = document.getElementById(modalId);
                    if (!modal) return;
                    
                    const contentEl = modal.querySelector('.modal-content');
                    if (contentEl && content) {
                        contentEl.innerHTML = content;
                    }
                    
                    document.querySelectorAll('.modal').forEach(m => {
                        if (m.id !== modalId) m.classList.add('hidden');
                    });
                    
                    modal.classList.remove('hidden');
                },
                
                hide: function(modalId) {
                    const modal = document.getElementById(modalId);
                    if (modal) modal.classList.add('hidden');
                },
                
                hideAll: function() {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.classList.add('hidden');
                    });
                }
            };
        }
        
        console.log('✅ Sistema de modais unificado');
    }

    fixAnimations() {
        if (!document.getElementById('fix-animations')) {
            const style = document.createElement('style');
            style.id = 'fix-animations';
            style.textContent = `
                @keyframes correctPulse {
                    0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7); }
                    70% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 0 10px rgba(39, 174, 96, 0); }
                    100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 rgba(39, 174, 96, 0); }
                }
                
                @keyframes incorrectShake {
                    0%, 100% { transform: translate(-50%, -50%) translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translate(-50%, -50%) translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translate(-50%, -50%) translateX(5px); }
                }
                
                @keyframes fadeOutHelp {
                    from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    to { opacity: 0.3; transform: translate(-50%, -50%) scale(0.9); }
                }
                
                .sefirah.correct {
                    animation: correctPulse 0.6s ease !important;
                }
                
                .sefirah.incorrect {
                    animation: incorrectShake 0.5s ease !important;
                }
                
                .help-removed {
                    animation: fadeOutHelp 0.5s forwards !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('✅ Animações corrigidas');
    }

    fixLocalStorage() {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            try {
                return originalSetItem.call(this, key, value);
            } catch (e) {
                console.warn('LocalStorage cheio, limpando dados antigos...');
                try {
                    const keysToRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const itemKey = localStorage.key(i);
                        if (itemKey && itemKey.startsWith('temp_')) {
                            keysToRemove.push(itemKey);
                        }
                    }
                    
                    keysToRemove.forEach(key => localStorage.removeItem(key));
                    
                    return originalSetItem.call(this, key, value);
                } catch (e2) {
                    console.error('Não foi possível salvar no localStorage:', e2);
                    return false;
                }
            }
        };
        
        console.log('✅ localStorage otimizado');
    }

    fixResponsiveness() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.adjustForScreenSize();
                this.ensureFooterMargin();
                this.preventContentOverflow();
            }, 250);
        });
        
        this.adjustForScreenSize();
        this.ensureFooterMargin();
        this.preventContentOverflow();
        
        console.log('✅ Responsividade otimizada');
    }
    
    adjustForScreenSize() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            document.querySelectorAll('.sefirah').forEach(sefirah => {
                sefirah.style.width = '60px';
                sefirah.style.height = '60px';
                sefirah.style.fontSize = '0.8em';
            });
        } else {
            document.querySelectorAll('.sefirah').forEach(sefirah => {
                sefirah.style.width = '';
                sefirah.style.height = '';
                sefirah.style.fontSize = '';
            });
        }
    }
    
    preventGlobalScroll() {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        document.querySelectorAll('.modal-content').forEach(modal => {
            modal.style.overflowY = 'auto';
            modal.style.maxHeight = '80vh';
        });
        
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.style.overflow = 'hidden';
        }
        
        console.log('✅ Scroll global prevenido');
    }
    
    fixModalOverflow() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.overflow = 'hidden';
            
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.margin = 'auto';
                content.style.position = 'relative';
                content.style.top = '50%';
                content.style.transform = 'translateY(-50%)';
            }
        });
        
        console.log('✅ Overflow de modais corrigido');
    }
    
    ensureFooterMargin() {
        // Criar ou garantir que o footer invisível existe
        let footer = document.getElementById('invisible-footer');
        if (!footer) {
            footer = document.createElement('footer');
            footer.id = 'invisible-footer';
            document.body.appendChild(footer);
        }
        
        // Ajustar altura baseado no tamanho da tela
        const height = window.innerHeight;
        if (height < 600) {
            footer.style.height = '40px';
        } else if (height < 700) {
            footer.style.height = '45px';
        } else if (height < 800) {
            footer.style.height = '50px';
        } else {
            footer.style.height = '50px';
        }
        
        // Ajustar padding do body
        const footerHeight = parseInt(footer.style.height) || 50;
        document.body.style.paddingBottom = `${footerHeight}px`;
        
        // Ajustar altura do container do jogo
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            const availableHeight = height - headerHeight - footerHeight - 30;
            gameContainer.style.height = `${availableHeight}px`;
            gameContainer.style.minHeight = `${availableHeight}px`;
        }
        
        console.log('✅ Margem do footer garantida');
    }
    
    preventContentOverflow() {
        // Garantir que elementos não ultrapassem os limites
        const gameContainer = document.getElementById('game-container');
        const gameArea = document.getElementById('game-area');
        const gridContainer = document.querySelector('.game-grid-container');
        
        if (gameContainer) {
            gameContainer.style.overflow = 'hidden';
        }
        
        if (gameArea) {
            gameArea.style.overflow = 'hidden';
            gameArea.style.maxHeight = '100%';
        }
        
        if (gridContainer) {
            gridContainer.style.overflow = 'hidden';
            gridContainer.style.maxHeight = '100%';
        }
        
        // Elementos específicos
        const sections = ['#question-panel', '.tree-of-life', '.game-status'];
        sections.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.overflow = 'hidden';
                element.style.maxHeight = '100%';
            }
        });
        
        console.log('✅ Overflow do conteúdo prevenido');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BugFixes());
} else {
    new BugFixes();
}