// script.js - VERSÃO CORRIGIDA
// ========== MENU DE APPS INDEPENDENTE ==========
class AppsMenu {
    constructor() {
        this.icon = document.getElementById("appsMenuIcon");
        this.menu = document.getElementById("appsMenu");
        if (this.icon && this.menu) {
            this.init();
        }
    }
    
    init() {
        // Abrir/Fechar menu
        this.icon.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // Fechar ao clicar fora
        document.addEventListener("click", (e) => {
            if (!this.menu.contains(e.target) && !this.icon.contains(e.target)) {
                this.close();
            }
        });
        
        // Fechar com Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
        
        // Fechar ao clicar em link
        this.menu.addEventListener("click", (e) => {
            if (e.target.closest('a')) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.menu.classList.toggle("active");
        this.icon.classList.toggle("active");
    }
    
    close() {
        this.menu.classList.remove("active");
        this.icon.classList.remove("active");
    }
}

// ========== JOGO KABBALAH (COM TODAS CORREÇÕES) ==========
class KabbalahGame {
    constructor() {
        // Questões (25 no total)
        this.questions = [
            // 10 originais
            { letter: 'א', sefirah: 'keter', meaning: 'Aleph - O Espírito Divino' },
            { letter: 'ב', sefirah: 'chokhmah', meaning: 'Bet - Sabedoria Primordial' },
            { letter: 'ג', sefirah: 'binah', meaning: 'Gimel - Entendimento Divino' },
            { letter: 'ד', sefirah: 'chesed', meaning: 'Dalet - Amor e Misericórdia' },
            { letter: 'ה', sefirah: 'gevurah', meaning: 'Hei - Julgamento e Restrição' },
            { letter: 'ו', sefirah: 'tiferet', meaning: 'Vav - Beleza e Harmonia' },
            { letter: 'ז', sefirah: 'netzach', meaning: 'Zayin - Vitória Eterna' },
            { letter: 'ח', sefirah: 'hod', meaning: 'Chet - Esplendor Divino' },
            { letter: 'ט', sefirah: 'yesod', meaning: 'Tet - Fundação do Mundo' },
            { letter: 'י', sefirah: 'malkuth', meaning: 'Yod - Reino Material' },
            
            // 15 novas questões
            { letter: 'כ', sefirah: 'chokhmah', meaning: 'Kaf - Sabedoria Prática' },
            { letter: 'ל', sefirah: 'chesed', meaning: 'Lamed - Coração Aprendiz' },
            { letter: 'מ', sefirah: 'hod', meaning: 'Mem - Águas da Sabedoria' },
            { letter: 'נ', sefirah: 'yesod', meaning: 'Nun - Peixe da Fundação' },
            { letter: 'ס', sefirah: 'binah', meaning: 'Samekh - Suporte do Entendimento' },
            { letter: 'ע', sefirah: 'netzach', meaning: 'Ayin - Olho da Vitória' },
            { letter: 'פ', sefirah: 'hod', meaning: 'Pe - Boca do Esplendor' },
            { letter: 'צ', sefirah: 'yesod', meaning: 'Tsade - Justiça da Fundação' },
            { letter: 'ק', sefirah: 'keter', meaning: 'Qof - Santidade da Coroa' },
            { letter: 'ר', sefirah: 'gevurah', meaning: 'Resh - Cabeça do Julgamento' },
            { letter: 'ש', sefirah: 'tiferet', meaning: 'Shin - Dente da Harmonia' },
            { letter: 'ת', sefirah: 'malkuth', meaning: 'Tav - Cruz do Reino' },
            { letter: 'ך', sefirah: 'chokhmah', meaning: 'Kaf final - Sabedoria Completa' },
            { letter: 'ם', sefirah: 'binah', meaning: 'Mem final - Entendimento Profundo' },
            { letter: 'ן', sefirah: 'netzach', meaning: 'Nun final - Vitória Eterna' }
        ];

        // Sistema de erros
        this.errorCount = new Map();
        this.currentAttempts = 0;
        
        // Sistema de pontos
        this.visibleOptions = 10;
        this.currentHelpUsed = false; // false ou 25, 50, 75
        
        // Sistemas externos
        this.achievementSystem = window.achievementSystem;
        this.audioSystem = window.audioSystem;
        this.dailyChallenge = window.dailyChallenge;
        
        // Estatísticas
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.totalHelpUsed = 0;
        this.gameStartTime = null;
        this.gameTimer = null;
        this.elapsedTime = 0;
        
        // Tracking de Sefirot descobertas
        this.discoveredSefirot = new Set();
        
        // Estado do jogo
        this.state = {
            isPlaying: false,
            isPaused: false,
            currentQuestion: 0,
            score: 0,
            lives: 3,
            totalQuestions: 25,
            errors: 0
        };

        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.showWelcomeScreen();
        
        // Inicializar sistema de modais se existir
        if (!window.modalManager && document.getElementById('help-modal')) {
            this.initModalManager();
        }
    }

    cacheElements() {
        // Apenas elementos que existem no HTML
        this.elements = {
            // Telas
            welcomeScreen: document.getElementById('welcome-screen'),
            gameArea: document.getElementById('game-area'),
            
            // Botões principais
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            optionsBtn: document.getElementById('options-btn'),
            
            // Help geral
            globalHelpBtn: document.getElementById('global-help-btn'),
            helpModal: document.getElementById('help-modal'),
            
            // Help no jogo
            help25Btn: document.getElementById('help-25-btn'),
            help50Btn: document.getElementById('help-50-btn'),
            help75Btn: document.getElementById('help-75-btn'),
            skipBtn: document.getElementById('skip-btn'),
            
            // Questão
            questionPanel: document.getElementById('question-panel'),
            currentQuestion: document.getElementById('current-question'),
            currentSymbol: document.getElementById('current-symbol'),
            
            // Status
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            progress: document.getElementById('progress'),
            errorsCount: document.getElementById('errors-count'),
            streakCount: document.getElementById('streak-count'),
            timeCount: document.getElementById('time-count'),
            
            // Sefirot
            sefirot: document.querySelectorAll('.sefirah'),
            
            // Modal
            modal: document.getElementById('game-modal'),
            modalContent: document.querySelector('#game-modal .modal-content')
        };
    }

    setupEventListeners() {
        // Botões principais
        this.elements.startBtn?.addEventListener('click', () => this.startGame());
        this.elements.restartBtn?.addEventListener('click', () => this.resetGame());
        this.elements.pauseBtn?.addEventListener('click', () => this.togglePause());
        this.elements.optionsBtn?.addEventListener('click', () => this.showOptions());

        // Help geral
        this.elements.globalHelpBtn?.addEventListener('click', () => this.showHelp());

        // Help no jogo
        this.elements.help25Btn?.addEventListener('click', () => this.useHelp(25));
        this.elements.help50Btn?.addEventListener('click', () => this.useHelp(50));
        this.elements.help75Btn?.addEventListener('click', () => this.useHelp(75));
        this.elements.skipBtn?.addEventListener('click', () => this.skipQuestion());

        // Sefirot
        this.elements.sefirot.forEach(sefirah => {
            sefirah.addEventListener('click', (e) => {
                if (this.state.isPlaying && !this.state.isPaused) {
                    this.checkAnswer(e.currentTarget.id);
                }
            });
        });

        // Teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Botões flutuantes
        document.getElementById('daily-challenge-btn')?.addEventListener('click', () => {
            if (this.dailyChallenge) {
                this.dailyChallenge.showDailyChallengeModal();
            } else {
                this.showToast('Sistema de desafio diário não disponível', 'error');
            }
        });
        
        document.getElementById('achievements-btn')?.addEventListener('click', () => {
            if (this.achievementSystem) {
                this.achievementSystem.showAchievementsModal();
            } else {
                this.showToast('Sistema de conquistas não disponível', 'error');
            }
        });
        
        document.getElementById('audio-toggle-btn')?.addEventListener('click', () => {
            if (this.audioSystem) {
                const enabled = this.audioSystem.toggle();
                this.showToast(`Áudio ${enabled ? '✅ ativado' : '🔇 desativado'}`, 'info');
            } else {
                this.showToast('Sistema de áudio não disponível', 'error');
            }
        });
    }

    initModalManager() {
        // Sistema simples de gerenciamento de modais
        window.modalManager = {
            show: (modalId, content) => {
                if (modalId === 'game-modal' && this.elements.modalContent) {
                    this.elements.modalContent.innerHTML = content;
                    this.elements.modal.classList.remove('hidden');
                } else {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        const contentEl = modal.querySelector('.modal-content');
                        if (contentEl) contentEl.innerHTML = content;
                        modal.classList.remove('hidden');
                    }
                }
            },
            
            hide: (modalId) => {
                const modal = document.getElementById(modalId);
                if (modal) modal.classList.add('hidden');
            },
            
            hideAll: () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        };
        
        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.modalManager.hideAll();
            }
        });
        
        // Fechar modais ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    // ========== SISTEMA DE PONTOS CORRIGIDO ==========
    calculatePoints() {
        // Valor base: 10 pontos
        let maxPoints = 10;
        
        // Redução por ajuda usada
        if (this.currentHelpUsed) {
            switch(this.currentHelpUsed) {
                case 25: maxPoints = 7.5; break;  // 25% de redução
                case 50: maxPoints = 5.0; break;  // 50% de redução
                case 75: maxPoints = 2.5; break;  // 75% de redução
            }
        }
        
        // Penalidade por tentativas extras: -1 ponto por tentativa além da primeira
        const attemptPenalty = Math.max(0, this.currentAttempts - 1);
        
        // Calcular pontos finais (mínimo 0.5 pontos)
        let points = Math.max(0.5, maxPoints - attemptPenalty);
        
        return Math.round(points * 10) / 10; // Arredondar para 1 casa decimal
    }

    // ========== TELAS ==========
    showWelcomeScreen() {
        this.elements.welcomeScreen?.classList.remove('hidden');
        this.elements.gameArea?.classList.add('hidden');
        this.elements.globalHelpBtn?.classList.remove('hidden');
    }

    showGameScreen() {
        this.elements.welcomeScreen?.classList.add('hidden');
        this.elements.gameArea?.classList.remove('hidden');
        this.elements.globalHelpBtn?.classList.add('hidden');
    }

    // ========== JOGO PRINCIPAL ==========
    startGame() {
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.state.score = 0;
        this.state.currentQuestion = 0;
        this.state.errors = 0;
        this.state.lives = 3;
        
        this.currentAttempts = 0;
        this.currentStreak = 0;
        this.currentHelpUsed = false;
        this.totalHelpUsed = 0;
        this.gameStartTime = Date.now();
        this.elapsedTime = 0;
        this.discoveredSefirot.clear();
        
        // Iniciar timer
        this.startTimer();
        
        this.resetVisualEffects();
        this.showGameScreen();
        this.shuffleQuestions();
        this.showQuestion();
        this.updateUI();
        
        this.showToast('Jogo iniciado! Use as teclas 1-0 para respostas rápidas.', 'info');
        
        // Tocar som
        if (this.audioSystem) {
            this.audioSystem.play('click');
        }
    }
    
    startTimer() {
        if (this.gameTimer) clearInterval(this.gameTimer);
        
        this.gameTimer = setInterval(() => {
            if (this.state.isPlaying && !this.state.isPaused) {
                this.elapsedTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
                this.elements.timeCount.textContent = `${this.elapsedTime}s`;
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    shuffleQuestions() {
        // Embaralhar as 25 questões
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    showQuestion() {
        if (this.state.currentQuestion >= this.state.totalQuestions) {
            this.endGame();
            return;
        }

        const question = this.questions[this.state.currentQuestion];
        this.elements.currentQuestion.textContent = 
            `Associe a letra "${question.letter}" à Sefirah correspondente:`;
        this.elements.currentSymbol.textContent = question.letter;
        this.elements.currentSymbol.title = question.meaning;
        
        this.elements.progress.textContent = `${this.state.currentQuestion + 1}/${this.state.totalQuestions}`;
        
        this.currentHelpUsed = false;
        this.currentAttempts = 0;
        this.updateVisibleOptionsCount();
    }

    updateVisibleOptionsCount() {
        let count = 0;
        this.elements.sefirot.forEach(sefirah => {
            if (!sefirah.classList.contains('eliminated')) {
                count++;
            }
        });
        this.visibleOptions = count;
    }

    // ========== SISTEMA DE ELIMINAÇÃO VISUAL ==========
    trackError(sefirahId) {
        const errors = this.errorCount.get(sefirahId) || 0;
        const newErrors = errors + 1;
        this.errorCount.set(sefirahId, newErrors);
        
        this.applyErrorEffect(sefirahId, newErrors);
        this.state.errors++;
        this.elements.errorsCount.textContent = this.state.errors;
    }

    applyErrorEffect(sefirahId, errorCount) {
        const element = document.getElementById(sefirahId);
        if (!element) return;
        
        switch(errorCount) {
            case 1:
                element.style.opacity = '0.7';
                element.style.filter = 'grayscale(20%)';
                break;
                
            case 2:
                element.style.opacity = '0.4';
                element.style.filter = 'grayscale(50%)';
                element.style.border = '2px dashed #e74c3c';
                break;
                
            case 3:
                element.classList.add('eliminated');
                element.style.opacity = '0.2';
                element.style.pointerEvents = 'none';
                element.style.filter = 'grayscale(100%)';
                const originalContent = element.innerHTML;
                element.innerHTML = '✗<br><small style="opacity:0.5">' + 
                    this.getSefirahName(sefirahId) + '</small>';
                break;
        }
        
        this.updateVisibleOptionsCount();
    }

    resetVisualEffects() {
        this.errorCount.clear();
        this.elements.sefirot.forEach(sefirah => {
            sefirah.classList.remove('eliminated', 'correct', 'incorrect', 'help-removed');
            sefirah.style.opacity = '1';
            sefirah.style.filter = 'none';
            sefirah.style.border = '';
            sefirah.style.pointerEvents = 'auto';
            sefirah.style.animation = '';
            sefirah.style.transition = 'all 0.3s ease';
            const name = this.getSefirahName(sefirah.id);
            const number = sefirah.dataset.number;
            sefirah.innerHTML = `${name}<br><small>${number}</small>`;
        });
        this.visibleOptions = 10;
        this.currentHelpUsed = false;
    }

    getSefirahName(id) {
        const names = {
            'keter': 'Keter', 'chokhmah': 'Chokhmah', 'binah': 'Binah',
            'chesed': 'Chesed', 'gevurah': 'Gevurah', 'tiferet': 'Tiferet',
            'netzach': 'Netzach', 'hod': 'Hod', 'yesod': 'Yesod', 'malkuth': 'Malkuth'
        };
        return names[id] || id;
    }

    // ========== VERIFICAÇÃO DE RESPOSTA ==========
    checkAnswer(sefirahId) {
        if (!this.state.isPlaying || this.state.isPaused) return;

        const question = this.questions[this.state.currentQuestion];
        const isCorrect = sefirahId === question.sefirah;
        const element = document.getElementById(sefirahId);

        element.classList.add(isCorrect ? 'correct' : 'incorrect');
        this.currentAttempts++;

        if (isCorrect) {
            this.handleCorrectAnswer(question.sefirah);
        } else {
            this.handleWrongAnswer(sefirahId);
        }
    }

    handleCorrectAnswer(sefirahId) {
        const points = this.calculatePoints();
        this.state.score += points;
        
        // Registrar Sefirah descoberta
        this.discoveredSefirot.add(sefirahId);
        
        // Mostrar cálculo detalhado
        let pointsDetail = `+${points.toFixed(1)} pontos`;
        if (this.currentAttempts > 1) {
            pointsDetail += ` (${this.currentAttempts}ª tentativa)`;
        }
        if (this.currentHelpUsed) {
            pointsDetail += ` (ajuda ${this.currentHelpUsed}%)`;
        }
        
        // Atualizar streak
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
        
        // Verificar conquista de streak
        if (this.currentStreak >= 10 && this.achievementSystem) {
            this.achievementSystem.unlock('perfectionist');
        }
        
        this.updateUI();
        
        // Tocar som correto
        if (this.audioSystem) {
            this.audioSystem.play('correct');
        }
        
        this.showToast(`${pointsDetail} | Streak: ${this.currentStreak}`, 'success');

        setTimeout(() => {
            this.state.currentQuestion++;
            this.currentAttempts = 0;
            this.currentHelpUsed = false;
            this.resetVisualEffects();
            if (this.state.currentQuestion < this.state.totalQuestions) {
                this.showQuestion();
            } else {
                this.endGame();
            }
        }, 1000);
    }

    handleWrongAnswer(sefirahId) {
        // Penalidade por erro: 2 pontos
        const errorPenalty = 2;
        this.state.score = Math.max(0, this.state.score - errorPenalty);
        this.trackError(sefirahId);
        
        // Resetar streak
        this.currentStreak = 0;
        
        // Tocar som incorreto
        if (this.audioSystem) {
            this.audioSystem.play('incorrect');
        }
        
        this.showToast(`Erro! -${errorPenalty} pontos`, 'error');
        this.updateUI();
    }

    // ========== SISTEMA DE AJUDA CORRIGIDO ==========
    useHelp(percentage) {
        if (!this.state.isPlaying || this.state.isPaused || this.currentHelpUsed) {
            return;
        }
        
        const question = this.questions[this.state.currentQuestion];
        const incorrectSefirot = Array.from(this.elements.sefirot)
            .filter(s => s.id !== question.sefirah && !s.classList.contains('eliminated'));
        
        if (incorrectSefirot.length === 0) return;
        
        // Registrar ajuda usada
        this.currentHelpUsed = percentage;
        this.totalHelpUsed++;
        
        // Registrar no sistema de conquistas
        if (this.achievementSystem) {
            this.achievementSystem.recordHelpUsage();
        }
        
        const shuffled = [...incorrectSefirot].sort(() => Math.random() - 0.5);
        const hideCount = Math.max(1, Math.floor(incorrectSefirot.length * (percentage / 100)));
        
        // Tocar som de ajuda
        if (this.audioSystem) {
            this.audioSystem.play('help');
        }
        
        // Remover visualmente
        for (let i = 0; i < hideCount; i++) {
            setTimeout(() => {
                if (shuffled[i]) {
                    shuffled[i].classList.add('help-removed');
                    shuffled[i].style.animation = 'fadeOut 0.5s forwards';
                    shuffled[i].style.pointerEvents = 'none';
                }
            }, i * 100);
        }
        
        this.updateVisibleOptionsCount();
        const maxPoints = 10 * (1 - percentage/100);
        this.showToast(`Ajuda ${percentage}% usada. Questão vale no máximo ${maxPoints.toFixed(1)} pontos`, 'info');
    }

    skipQuestion() {
        if (!this.state.isPlaying || this.state.isPaused) return;
        
        // Penalidade por pular: 5 pontos
        const skipPenalty = 5;
        this.state.score = Math.max(0, this.state.score - skipPenalty);
        this.updateUI();
        
        this.state.currentQuestion++;
        this.currentAttempts = 0;
        this.currentStreak = 0;
        this.currentHelpUsed = false;
        this.resetVisualEffects();
        if (this.state.currentQuestion < this.state.totalQuestions) {
            this.showQuestion();
        } else {
            this.endGame();
        }
        
        this.showToast(`Questão pulada: -${skipPenalty} pontos`, 'error');
    }

    togglePause() {
        if (!this.state.isPlaying) return;
        
        this.state.isPaused = !this.state.isPaused;
        
        if (this.state.isPaused) {
            this.stopTimer();
            const content = `
                <h3>⏸️ Jogo Pausado</h3>
                <div class="pause-stats">
                    <div class="stat-item">
                        <span class="label">Pontuação:</span>
                        <span class="value">${this.state.score}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Questão:</span>
                        <span class="value">${this.state.currentQuestion + 1}/${this.state.totalQuestions}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Streak:</span>
                        <span class="value">${this.currentStreak}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Tempo:</span>
                        <span class="value">${this.elapsedTime}s</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Erros:</span>
                        <span class="value">${this.state.errors}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn primary" onclick="game.togglePause()">▶️ Continuar</button>
                    <button class="btn" onclick="game.resetGame(); window.modalManager.hideAll();">🔄 Reiniciar</button>
                    <button class="btn" onclick="game.endGame()">🏁 Terminar Jogo</button>
                </div>
            `;
            this.showModal('pause', content);
        } else {
            this.startTimer();
            if (window.modalManager) {
                window.modalManager.hideAll();
            }
        }
    }

    resetGame() {
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.state.score = 0;
        this.state.currentQuestion = 0;
        this.state.errors = 0;
        this.state.lives = 3;
        
        this.currentAttempts = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.currentHelpUsed = false;
        this.totalHelpUsed = 0;
        this.gameStartTime = null;
        this.elapsedTime = 0;
        this.discoveredSefirot.clear();
        
        this.stopTimer();
        this.resetVisualEffects();
        this.showWelcomeScreen();
        this.updateUI();
        
        if (window.modalManager) {
            window.modalManager.hideAll();
        }
    }

    // ========== FIM DO JOGO ==========
    endGame() {
        this.state.isPlaying = false;
        this.stopTimer();
        
        const gameTime = this.elapsedTime;
        const accuracy = this.state.totalQuestions > 0 ? 
            Math.round(((this.state.currentQuestion - this.state.errors) / this.state.totalQuestions) * 100) : 0;
        const grade = accuracy === 100 ? '🎖️ PERFEITO' :
                     accuracy >= 90 ? '🏅 EXCELENTE' :
                     accuracy >= 80 ? '🥇 MUITO BOM' :
                     accuracy >= 70 ? '🥈 BOM' :
                     accuracy >= 60 ? '🥉 SATISFATÓRIO' : '📚 CONTINUE PRATICANDO';
        
        // Atualizar estatísticas
        if (this.achievementSystem) {
            this.achievementSystem.updateStats({
                score: this.state.score,
                totalQuestions: this.state.totalQuestions,
                errors: this.state.errors,
                time: gameTime,
                streak: this.bestStreak,
                discoveredSefirot: Array.from(this.discoveredSefirot)
            });
        }
        
        // Tocar som de vitória
        if (this.audioSystem && accuracy > 70) {
            this.audioSystem.play('victory');
        }
        
        const results = `
            <h3>🎉 Jogo Concluído</h3>
            <div class="results">
                <div class="result-item">
                    <span class="label">Pontuação Final</span>
                    <span class="value">${this.state.score}</span>
                </div>
                <div class="result-item">
                    <span class="label">Questões Respondidas</span>
                    <span class="value">${this.state.currentQuestion}/${this.state.totalQuestions}</span>
                </div>
                <div class="result-item">
                    <span class="label">Precisão</span>
                    <span class="value">${accuracy}%</span>
                </div>
                <div class="result-item">
                    <span class="label">Erros Cometidos</span>
                    <span class="value">${this.state.errors}</span>
                </div>
                <div class="result-item">
                    <span class="label">Tempo Total</span>
                    <span class="value">${gameTime}s</span>
                </div>
                <div class="result-item">
                    <span class="label">Melhor Streak</span>
                    <span class="value">${this.bestStreak}</span>
                </div>
                <div class="result-item">
                    <span class="label">Sefirot Descobertas</span>
                    <span class="value">${this.discoveredSefirot.size}/10</span>
                </div>
            </div>
            <div class="grade">${grade}</div>
            <div class="actions">
                <button class="btn primary" onclick="game.startGame()">🔄 Jogar Novamente</button>
                <button class="btn" onclick="game.showAchievements()">🏆 Conquistas</button>
                <button class="btn" onclick="game.showOptions()">⚙️ Opções</button>
                <button class="btn" onclick="game.resetGame(); window.modalManager.hideAll();">🏠 Menu Principal</button>
            </div>
        `;
        
        this.showModal('results', results);
    }

    // ========== HELP GERAL ==========
    showHelp() {
        if (window.modalManager) {
            window.modalManager.show('help-modal');
        } else {
            this.elements.helpModal?.classList.remove('hidden');
        }
    }

    // ========== MODAIS ==========
    showModal(type, content) {
        if (this.elements.modalContent) {
            this.elements.modalContent.innerHTML = content;
            this.elements.modal?.classList.remove('hidden');
        }
    }

    showOptions() {
        const content = `
            <h3>⚙️ Opções</h3>
            <div class="options-grid">
                <button class="btn option-btn" onclick="game.showAchievements()">
                    <span class="option-icon">🏆</span>
                    <span class="option-text">Conquistas</span>
                </button>
                
                <button class="btn option-btn" onclick="window.audioSystem?.showAudioSettings()">
                    <span class="option-icon">🔊</span>
                    <span class="option-text">Configurações de Áudio</span>
                </button>
                
                <button class="btn option-btn" onclick="window.dailyChallenge?.showDailyChallengeModal()">
                    <span class="option-icon">🌅</span>
                    <span class="option-text">Desafio Diário</span>
                </button>
                
                <button class="btn option-btn" onclick="game.resetGame(); window.modalManager?.hideAll();">
                    <span class="option-icon">🔄</span>
                    <span class="option-text">Reiniciar Jogo</span>
                </button>
                
                <button class="btn option-btn" onclick="game.showHelp()">
                    <span class="option-icon">❓</span>
                    <span class="option-text">Como Jogar</span>
                </button>
                
                <button class="btn option-btn" onclick="game.togglePause()">
                    <span class="option-icon">⏸️</span>
                    <span class="option-text">${this.state.isPaused ? 'Continuar' : 'Pausar'}</span>
                </button>
            </div>
            <div class="modal-actions">
                <button class="btn" onclick="window.modalManager?.hideAll()">❌ Fechar</button>
            </div>
        `;
        this.showModal('options', content);
    }

    // ========== TECLADO ==========
    handleKeyboard(e) {
        if (!this.state.isPlaying || this.state.isPaused) return;

        // Prevenir comportamento padrão para teclas de controle
        if (e.key === ' ' || 
            (e.ctrlKey && ['1', '2', '3'].includes(e.key)) ||
            ['s', 'S', 'o', 'O', 'h', 'H', 'a', 'A', 'c', 'C'].includes(e.key)) {
            e.preventDefault();
        }

        // Teclas 1-0 para Sefirot
        if (e.key >= '1' && e.key <= '9') {
            const index = parseInt(e.key) - 1;
            const sefirot = ['keter', 'chokhmah', 'binah', 'chesed', 'gevurah', 
                           'tiferet', 'netzach', 'hod', 'yesod'];
            if (sefirot[index]) {
                this.checkAnswer(sefirot[index]);
            }
        } else if (e.key === '0') {
            this.checkAnswer('malkuth');
        }
        
        // Ajuda (Ctrl + número)
        else if (e.ctrlKey) {
            switch(e.key) {
                case '1': this.useHelp(25); break;
                case '2': this.useHelp(50); break;
                case '3': this.useHelp(75); break;
            }
        }
        
        // Controles
        else {
            switch(e.key.toLowerCase()) {
                case ' ':
                    this.togglePause();
                    break;
                case 's':
                    this.skipQuestion();
                    break;
                case 'o':
                    this.showOptions();
                    break;
                case 'h':
                    this.showHelp();
                    break;
                case 'a':
                    if (this.achievementSystem) {
                        this.achievementSystem.showAchievementsModal();
                    }
                    break;
                case 'c':
                    if (this.dailyChallenge) {
                        this.dailyChallenge.showDailyChallengeModal();
                    }
                    break;
                case 'escape':
                    if (window.modalManager) {
                        window.modalManager.hideAll();
                    }
                    break;
            }
        }
    }

    // ========== UI ==========
    updateUI() {
        if (this.elements.score) this.elements.score.textContent = this.state.score;
        if (this.elements.errorsCount) this.elements.errorsCount.textContent = this.state.errors;
        if (this.elements.streakCount) this.elements.streakCount.textContent = this.currentStreak;
        
        // Vidas
        if (this.elements.lives) {
            let livesText = '';
            for (let i = 0; i < 3; i++) {
                livesText += i < this.state.lives ? '●' : '○';
            }
            this.elements.lives.textContent = livesText;
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode === container) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // ========== PROGRESSO ==========
    loadProgress() {
        try {
            const saved = localStorage.getItem('kabbalah_progress');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Não foi possível carregar o progresso:', e);
        }
        return { games: 0, bestScore: 0, totalCorrect: 0 };
    }

    updateProgress() {
        const progress = this.loadProgress();
        progress.games = (progress.games || 0) + 1;
        
        if (this.state.score > (progress.bestScore || 0)) {
            progress.bestScore = this.state.score;
        }
        
        const correctAnswers = Math.max(0, this.state.currentQuestion - this.state.errors);
        progress.totalCorrect = (progress.totalCorrect || 0) + correctAnswers;
        
        try {
            localStorage.setItem('kabbalah_progress', JSON.stringify(progress));
        } catch (e) {
            console.warn('Não foi possível salvar o progresso:', e);
        }
    }
    
    showAchievements() {
        if (this.achievementSystem) {
            this.achievementSystem.showAchievementsModal();
        } else {
            this.showToast('Sistema de conquistas não disponível', 'error');
        }
    }
    
    startDailyChallenge() {
        // Método para iniciar desafio diário
        this.showToast('Desafio diário iniciado!', 'info');
        // Aqui você implementaria a lógica específica do desafio diário
    }
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    // Menu de apps independente
    new AppsMenu();
    
    // Jogo principal
    window.game = new KabbalahGame();
    
    // Inicializar áudio após interação
    document.addEventListener('click', () => {
        if (window.audioSystem && !window.audioSystem.initialized) {
            window.audioSystem.init();
        }
    }, { once: true });
});
