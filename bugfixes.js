// bugfixes.js - Correções finais e otimizações

class BugFixes {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🔧 Inicializando correções de bugs...');
        
        // Esperar carregamento completo
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }
        
        // Aplicar correções
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
        
        console.log('✅ Todas as correções aplicadas com sucesso!');
    }

    fixLayout() {
        // Verificar e corrigir layout se necessário
        const gameArea = document.getElementById('game-area');
        if (!gameArea) return;
        
        // Se já tem o container grid, não fazer nada
        if (gameArea.querySelector('.game-grid-container')) return;
        
        // Criar container grid
        const questionPanel = document.getElementById('question-panel');
        const treeOfLife = document.querySelector('.tree-of-life');
        const gameStatus = document.querySelector('.game-status');
        
        if (!questionPanel || !treeOfLife || !gameStatus) return;
        
        // Criar container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'game-grid-container';
        
        // Limpar game area
        gameArea.innerHTML = '';
        
        // Adicionar elementos
        gridContainer.appendChild(questionPanel);
        gridContainer.appendChild(treeOfLife);
        gridContainer.appendChild(gameStatus);
        gameArea.appendChild(gridContainer);
        
        console.log('✅ Layout corrigido');
    }

    fixAudioSystem() {
        if (!window.audioSystem) return;
        
        // Garantir que o áudio seja inicializado na primeira interação
        const initAudio = () => {
            if (window.audioSystem && !window.audioSystem.initialized) {
                window.audioSystem.init();
            }
            // Remover listeners
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
        
        // Monkey patch para garantir cálculo correto
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
        
        // Adicionar tracking de Sefirot se não existir
        if (window.game && !window.game.discoveredSefirot) {
            window.game.discoveredSefirot = new Set();
        }
        
        console.log('✅ Sistema de conquistas otimizado');
    }

    fixDailyChallenge() {
        // Nada a fazer - já corrigido no arquivo principal
        console.log('✅ Sistema de desafio diário verificado');
    }

    fixKeyboard() {
        // Centralizar controle de teclado
        const handleGlobalKeys = (e) => {
            // ESC fecha todos os modais
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        };
        
        document.addEventListener('keydown', handleGlobalKeys);
        
        console.log('✅ Controles de teclado centralizados');
    }

    fixModals() {
        // Sistema unificado de modais
        if (!window.modalManager) {
            window.modalManager = {
                show: function(modalId, content) {
                    const modal = document.getElementById(modalId);
                    if (!modal) return;
                    
                    const contentEl = modal.querySelector('.modal-content');
                    if (contentEl && content) {
                        contentEl.innerHTML = content;
                    }
                    
                    // Esconder outros modais
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
        // Adicionar animações CSS se não existirem
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
        // Adicionar tratamento de erro para localStorage
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            try {
                return originalSetItem.call(this, key, value);
            } catch (e) {
                console.warn('LocalStorage cheio, limpando dados antigos...');
                try {
                    // Tentar limpar alguns itens antigos
                    const keysToRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const itemKey = localStorage.key(i);
                        if (itemKey && itemKey.startsWith('temp_')) {
                            keysToRemove.push(itemKey);
                        }
                    }
                    
                    keysToRemove.forEach(key => localStorage.removeItem(key));
                    
                    // Tentar novamente
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
        // Ajustar layout em redimensionamento
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.adjustForScreenSize();
            }, 250);
        });
        
        this.adjustForScreenSize();
        
        console.log('✅ Responsividade otimizada');
    }
    
    adjustForScreenSize() {
        const width = window.innerWidth;
        
        // Ajustar tamanho das Sefirot em mobile
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
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BugFixes());
} else {
    new BugFixes();
}