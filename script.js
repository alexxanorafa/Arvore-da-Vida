// ========== SISTEMA DE DOIS MENUS SEPARADOS ==========
document.addEventListener("DOMContentLoaded", function() {
    // Menu do jogo (esquerda)
    const gameMenuIcon = document.getElementById("gameMenuIcon");
    const gameMenu = document.getElementById("gameMenu");
    
    // Menu de apps (direita)
    const appsMenuIcon = document.getElementById("appsMenuIcon");
    const appsMenu = document.getElementById("appsMenu");

    // Abrir/Fechar menu do jogo
    gameMenuIcon.addEventListener("click", function(e) {
        e.stopPropagation();
        gameMenu.classList.toggle("active");
        gameMenuIcon.classList.toggle("active");
        if (appsMenu.classList.contains("active")) {
            appsMenu.classList.remove("active");
            appsMenuIcon.classList.remove("active");
        }
    });

    // Abrir/Fechar menu de apps
    appsMenuIcon.addEventListener("click", function(e) {
        e.stopPropagation();
        appsMenu.classList.toggle("active");
        appsMenuIcon.classList.toggle("active");
        if (gameMenu.classList.contains("active")) {
            gameMenu.classList.remove("active");
            gameMenuIcon.classList.remove("active");
        }
    });

    // Fechar menus ao clicar fora
    document.addEventListener("click", function(e) {
        if (!gameMenu.contains(e.target) && !gameMenuIcon.contains(e.target)) {
            gameMenu.classList.remove("active");
            gameMenuIcon.classList.remove("active");
        }
        if (!appsMenu.contains(e.target) && !appsMenuIcon.contains(e.target)) {
            appsMenu.classList.remove("active");
            appsMenuIcon.classList.remove("active");
        }
    });

    // Fechar menus com Escape
    document.addEventListener("keydown", function(e) {
        if (e.key === 'Escape') {
            gameMenu.classList.remove("active");
            gameMenuIcon.classList.remove("active");
            appsMenu.classList.remove("active");
            appsMenuIcon.classList.remove("active");
        }
    });
});

// ========== JOGO KABBALAH (COM TODAS AS FUNÇÕES PEDIDAS) ==========
class KabbalahGame {
    constructor() {
        // ========== EXPANSÃO DE CONTEÚDO: 25 QUESTÕES ==========
        this.questions = [
            // 10 originais
            { letter: 'א', number: 1, sefirah: 'keter', meaning: 'Aleph - O Espírito Divino' },
            { letter: 'ב', number: 2, sefirah: 'chokhmah', meaning: 'Bet - Sabedoria Primordial' },
            { letter: 'ג', number: 3, sefirah: 'binah', meaning: 'Gimel - Entendimento Divino' },
            { letter: 'ד', number: 4, sefirah: 'chesed', meaning: 'Dalet - Amor e Misericórdia' },
            { letter: 'ה', number: 5, sefirah: 'gevurah', meaning: 'Hei - Julgamento e Restrição' },
            { letter: 'ו', number: 6, sefirah: 'tiferet', meaning: 'Vav - Beleza e Harmonia' },
            { letter: 'ז', number: 7, sefirah: 'netzach', meaning: 'Zayin - Vitória Eterna' },
            { letter: 'ח', number: 8, sefirah: 'hod', meaning: 'Chet - Esplendor Divino' },
            { letter: 'ט', number: 9, sefirah: 'yesod', meaning: 'Tet - Fundação do Mundo' },
            { letter: 'י', number: 10, sefirah: 'malkuth', meaning: 'Yod - Reino Material' },
            
            // 15 novas questões (total 25)
            { letter: 'כ', number: 20, sefirah: 'chokhmah', meaning: 'Kaf - Sabedoria Prática' },
            { letter: 'ל', number: 30, sefirah: 'chesed', meaning: 'Lamed - Coração Aprendiz' },
            { letter: 'מ', number: 40, sefirah: 'hod', meaning: 'Mem - Águas da Sabedoria' },
            { letter: 'נ', number: 50, sefirah: 'yesod', meaning: 'Nun - Peixe da Fundação' },
            { letter: 'ס', number: 60, sefirah: 'binah', meaning: 'Samekh - Suporte do Entendimento' },
            { letter: 'ע', number: 70, sefirah: 'netzach', meaning: 'Ayin - Olho da Vitória' },
            { letter: 'פ', number: 80, sefirah: 'hod', meaning: 'Pe - Boca do Esplendor' },
            { letter: 'צ', number: 90, sefirah: 'yesod', meaning: 'Tsade - Justiça da Fundação' },
            { letter: 'ק', number: 100, sefirah: 'keter', meaning: 'Qof - Santidade da Coroa' },
            { letter: 'ר', number: 200, sefirah: 'gevurah', meaning: 'Resh - Cabeça do Julgamento' },
            { letter: 'ש', number: 300, sefirah: 'tiferet', meaning: 'Shin - Dente da Harmonia' },
            { letter: 'ת', number: 400, sefirah: 'malkuth', meaning: 'Tav - Cruz do Reino' },
            { letter: 'ך', number: 500, sefirah: 'chokhmah', meaning: 'Kaf final - Sabedoria Completa' },
            { letter: 'ם', number: 600, sefirah: 'binah', meaning: 'Mem final - Entendimento Profundo' },
            { letter: 'ן', number: 700, sefirah: 'netzach', meaning: 'Nun final - Vitória Eterna' }
        ];

        // ========== SISTEMA DE ELIMINAÇÃO VISUAL ==========
        this.errorCount = new Map(); // sefirahId -> erros
        this.currentAttempts = 0; // Tentativas na questão atual
        
        // ========== SISTEMA DE PONTUAÇÃO PROGRESSIVA ==========
        this.visibleOptions = 10; // Inicia com todas 10 visíveis
        this.currentHelpUsed = false;
        
        // Estado do jogo
        this.state = {
            isPlaying: false,
            isPaused: false,
            currentQuestion: 0,
            score: 0,
            lives: 3,
            totalQuestions: 25,
            errors: 0,
            timer: null,
            mode: 'normal',
            difficulty: 'medium'
        };

        this.elements = {};
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.showWelcomeScreen();
        
        // Inicializar progresso
        this.loadProgress();
    }

    cacheElements() {
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
            
            // Help no jogo (25%/50%/75%)
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
            
            // Sefirot
            sefirot: document.querySelectorAll('.sefirah'),
            
            // Menu items
            gameModesBtn: document.getElementById('game-modes-btn'),
            difficultyBtn: document.getElementById('difficulty-btn'),
            statsBtn: document.getElementById('stats-btn'),
            practiceBtn: document.getElementById('practice-btn'),
            
            // Modal
            modal: document.getElementById('game-modal'),
            modalContent: document.querySelector('.modal-content')
        };
    }

    setupEventListeners() {
        // Botões principais
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.resetGame());
        this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
        this.elements.optionsBtn.addEventListener('click', () => this.showOptions());

        // Help geral
        this.elements.globalHelpBtn.addEventListener('click', () => this.showHelp());

        // Help no jogo
        this.elements.help25Btn.addEventListener('click', () => this.useHelp(25));
        this.elements.help50Btn.addEventListener('click', () => this.useHelp(50));
        this.elements.help75Btn.addEventListener('click', () => this.useHelp(75));
        this.elements.skipBtn.addEventListener('click', () => this.skipQuestion());

        // Menu do jogo - CORREÇÃO: ADICIONAR FUNÇÕES REAIS
        this.elements.gameModesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showGameModesModal();
        });
        this.elements.difficultyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDifficultyModal();
        });
        this.elements.statsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showStatsModal();
        });
        this.elements.practiceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.setMode('practice');
            this.startGame();
        });

        // Sefirot
        this.elements.sefirot.forEach(sefirah => {
            sefirah.addEventListener('click', (e) => {
                if (this.state.isPlaying && !this.state.isPaused) {
                    this.checkAnswer(e.currentTarget.id);
                }
            });
        });

        // Teclado (1-0 como pedido)
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Modal
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.hideModal();
            }
        });
    }

    // ========== CORREÇÃO: FUNÇÕES DOS MENUS ==========
    showGameModesModal() {
        const content = `
            <h3>🜁 Modos de Jogo</h3>
            <div class="modal-section">
                <button class="modal-btn" onclick="game.setMode('normal')">
                    <span class="modal-btn-icon">📖</span>
                    <span class="modal-btn-text">
                        <strong>Modo Normal</strong>
                        <small>3 vidas, sistema padrão de pontos</small>
                    </span>
                </button>
                
                <button class="modal-btn" onclick="game.setMode('practice')">
                    <span class="modal-btn-icon">🜃</span>
                    <span class="modal-btn-text">
                        <strong>Modo Prática</strong>
                        <small>Vidas infinitas, sem pontuação</small>
                    </span>
                </button>
                
                <button class="modal-btn" onclick="game.setMode('timed')">
                    <span class="modal-btn-icon">⏱️</span>
                    <span class="modal-btn-text">
                        <strong>Contra-Relógio</strong>
                        <small>2 minutos, bônus por velocidade</small>
                    </span>
                </button>
            </div>
            <div class="modal-actions">
                <button class="btn" onclick="game.hideModal()">Fechar</button>
            </div>
        `;
        this.showModal('modes', content);
    }

    showDifficultyModal() {
        const content = `
            <h3>⚚ Nível de Dificuldade</h3>
            <div class="modal-section">
                <button class="modal-btn" onclick="game.setDifficulty('easy')">
                    <span class="modal-btn-icon">🜂</span>
                    <span class="modal-btn-text">
                        <strong>Iniciante</strong>
                        <small>5 vidas, penalidades reduzidas</small>
                    </span>
                </button>
                
                <button class="modal-btn" onclick="game.setDifficulty('medium')">
                    <span class="modal-btn-icon">⚖️</span>
                    <span class="modal-btn-text">
                        <strong>Intermediário</strong>
                        <small>3 vidas, penalidades normais</small>
                    </span>
                </button>
                
                <button class="modal-btn" onclick="game.setDifficulty('hard')">
                    <span class="modal-btn-icon">🜄</span>
                    <span class="modal-btn-text">
                        <strong>Avançado</strong>
                        <small>2 vidas, penalidades aumentadas</small>
                    </span>
                </button>
                
                <button class="modal-btn" onclick="game.setDifficulty('expert')">
                    <span class="modal-btn-icon">👁️</span>
                    <span class="modal-btn-text">
                        <strong>Expert</strong>
                        <small>1 vida, penalidades máximas</small>
                    </span>
                </button>
            </div>
            <div class="modal-info">
                <p><strong>Atual:</strong> ${this.getDifficultyName(this.state.difficulty)}</p>
            </div>
            <div class="modal-actions">
                <button class="btn" onclick="game.hideModal()">Fechar</button>
            </div>
        `;
        this.showModal('difficulty', content);
    }

    showStatsModal() {
        const progress = this.loadProgress();
        const accuracy = progress.games > 0 ? 
            Math.round((progress.totalCorrect || 0) / (progress.games * 25) * 100) : 0;
        
        const content = `
            <h3>🜔 Estatísticas e Progresso</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${progress.games || 0}</div>
                    <div class="stat-label">Jogos Realizados</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${progress.bestScore || 0}</div>
                    <div class="stat-label">Melhor Pontuação</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${progress.totalCorrect || 0}</div>
                    <div class="stat-label">Acertos Totais</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${accuracy}%</div>
                    <div class="stat-label">Precisão</div>
                </div>
            </div>
            
            <div class="current-stats">
                <h4>Estatísticas da Sessão</h4>
                <div class="stat-row">
                    <span>Pontuação Atual:</span>
                    <span>${this.state.score}</span>
                </div>
                <div class="stat-row">
                    <span>Questão:</span>
                    <span>${this.state.currentQuestion + 1}/${this.state.totalQuestions}</span>
                </div>
                <div class="stat-row">
                    <span>Erros:</span>
                    <span>${this.state.errors}</span>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn danger" onclick="game.clearStats()">Limpar Estatísticas</button>
                <button class="btn" onclick="game.hideModal()">Fechar</button>
            </div>
        `;
        this.showModal('stats', content);
    }

    setDifficulty(level) {
        this.state.difficulty = level;
        const settings = {
            'easy': { lives: 5, helpPenalty: 10, skipPenalty: 25, errorPenalty: 0 },
            'medium': { lives: 3, helpPenalty: 25, skipPenalty: 50, errorPenalty: 5 },
            'hard': { lives: 2, helpPenalty: 50, skipPenalty: 75, errorPenalty: 10 },
            'expert': { lives: 1, helpPenalty: 100, skipPenalty: 150, errorPenalty: 25 }
        };
        
        if (settings[level]) {
            this.state.lives = settings[level].lives;
            this.updateUI();
            this.showToast(`Dificuldade alterada: ${this.getDifficultyName(level)}`, 'info');
            this.hideModal();
        }
    }

    getDifficultyName(level) {
        const names = {
            'easy': 'Iniciante',
            'medium': 'Intermediário',
            'hard': 'Avançado',
            'expert': 'Expert'
        };
        return names[level] || level;
    }

    clearStats() {
        if (confirm('Tem certeza que deseja limpar todas as estatísticas?')) {
            localStorage.removeItem('kabbalah_progress');
            this.showToast('Estatísticas limpas!', 'info');
            this.hideModal();
        }
    }

    // ========== TELAS ==========
    showWelcomeScreen() {
        this.elements.welcomeScreen.classList.remove('hidden');
        this.elements.gameArea.classList.add('hidden');
        this.elements.globalHelpBtn.classList.remove('hidden');
    }

    showGameScreen() {
        this.elements.welcomeScreen.classList.add('hidden');
        this.elements.gameArea.classList.remove('hidden');
        this.elements.globalHelpBtn.classList.add('hidden');
    }

    // ========== JOGO ==========
    startGame() {
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.state.score = 0;
        this.state.currentQuestion = 0;
        this.state.errors = 0;
        this.currentAttempts = 0;
        
        // Configurar vidas baseado na dificuldade
        const livesConfig = {
            'easy': 5,
            'medium': 3,
            'hard': 2,
            'expert': 1
        };
        this.state.lives = livesConfig[this.state.difficulty] || 3;
        
        this.resetVisualEffects();
        this.showGameScreen();
        this.shuffleQuestions();
        this.showQuestion();
        this.updateUI();
        
        this.showToast('Jogo iniciado! Use as teclas 1-0 para respostas rápidas.', 'info');
    }

    shuffleQuestions() {
        this.questions = [...this.questions].sort(() => Math.random() - 0.5);
    }

    showQuestion() {
        if (this.state.currentQuestion >= this.state.totalQuestions) {
            this.endGame();
            return;
        }

        const question = this.questions[this.state.currentQuestion];
        this.elements.currentQuestion.textContent = 
            `Associe "${question.letter}" (${question.number}) à Sefirah correspondente:`;
        this.elements.currentSymbol.textContent = question.letter;
        
        this.elements.progress.textContent = `${this.state.currentQuestion + 1}/${this.state.totalQuestions}`;
        
        this.currentHelpUsed = false;
        this.currentAttempts = 0;
        this.updateVisibleOptionsCount();
    }

    // ========== SISTEMA DE PONTUAÇÃO CORRIGIDO ==========
    calculatePoints() {
        // Sistema: 10 pontos na primeira tentativa, -1 por tentativa extra
        let points = Math.max(1, 10 - (this.currentAttempts - 1));
        
        // Penalidade por usar ajuda
        if (this.currentHelpUsed) {
            points = Math.floor(points * 0.5);
        }
        
        // Multiplicador do modo
        const modeMultiplier = {
            'normal': 1,
            'practice': 0, // Sem pontos no modo prática
            'timed': 2,
            'expert': 3
        }[this.state.mode] || 1;
        
        points *= modeMultiplier;
        
        return Math.max(1, points);
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

    // ========== SISTEMA DE ELIMINAÇÃO VISUAL CORRIGIDO ==========
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
        
        switch(errorCount) {
            case 1: // Primeiro erro
                element.style.opacity = '0.7';
                element.style.filter = 'grayscale(20%)';
                break;
                
            case 2: // Segundo erro
                element.style.opacity = '0.4';
                element.style.filter = 'grayscale(50%)';
                element.style.border = '2px dashed #e74c3c';
                break;
                
            case 3: // Terceiro erro - elimina
                element.classList.add('eliminated');
                element.style.opacity = '0.2';
                element.style.pointerEvents = 'none';
                element.style.filter = 'grayscale(100%)';
                // Adicionar símbolo ✗
                const originalContent = element.innerHTML;
                element.innerHTML = '✗<br><small style="opacity:0.5">' + 
                    this.getSefirahName(sefirahId) + '</small>';
                break;
        }
        
        this.updateVisibleOptionsCount();
        
        // Se só restar uma opção não eliminada, força o acerto
        const remaining = Array.from(this.elements.sefirot).filter(s => 
            !s.classList.contains('eliminated') && 
            !s.classList.contains('help-removed')
        ).length;
        
        if (remaining === 1) {
            const correctId = this.questions[this.state.currentQuestion].sefirah;
            const correctElement = document.getElementById(correctId);
            setTimeout(() => {
                correctElement.classList.add('correct');
                this.handleCorrectAnswer();
            }, 500);
        }
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
            // Restaurar conteúdo original
            const name = this.getSefirahName(sefirah.id);
            const number = sefirah.dataset.number;
            sefirah.innerHTML = `${name}<br><small>${number}</small>`;
        });
        this.visibleOptions = 10;
    }

    getSefirahName(id) {
        const names = {
            'keter': 'Keter', 'chokhmah': 'Chokhmah', 'binah': 'Binah',
            'chesed': 'Chesed', 'gevurah': 'Gevurah', 'tiferet': 'Tiferet',
            'netzach': 'Netzach', 'hod': 'Hod', 'yesod': 'Yesod', 'malkuth': 'Malkuth'
        };
        return names[id] || id;
    }

    // ========== VERIFICAÇÃO DE RESPOSTA CORRIGIDA ==========
    checkAnswer(sefirahId) {
        if (!this.state.isPlaying || this.state.isPaused) return;

        const question = this.questions[this.state.currentQuestion];
        const isCorrect = sefirahId === question.sefirah;
        const element = document.getElementById(sefirahId);

        element.classList.add(isCorrect ? 'correct' : 'incorrect');
        this.currentAttempts++;

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer(sefirahId);
        }
    }

    handleCorrectAnswer() {
        const points = this.calculatePoints();
        this.state.score += points;
        
        this.updateUI();
        this.showToast(`+${points} pontos! (${this.currentAttempts}ª tentativa)`, 'success');

        setTimeout(() => {
            this.state.currentQuestion++;
            this.currentAttempts = 0;
            this.resetVisualEffects();
            if (this.state.currentQuestion < this.state.totalQuestions) {
                this.showQuestion();
            } else {
                this.endGame();
            }
        }, 1000);
    }

    handleWrongAnswer(sefirahId) {
        // Penalidade por erro baseada na dificuldade
        const errorPenalty = {
            'easy': 0,
            'medium': 5,
            'hard': 10,
            'expert': 25
        }[this.state.difficulty] || 5;
        
        this.state.score = Math.max(0, this.state.score - errorPenalty);
        this.trackError(sefirahId);
        
        this.showToast(`Erro! -${errorPenalty} pontos`, 'error');
        this.updateUI();
    }

    clearAnswerEffects() {
        this.elements.sefirot.forEach(sefirah => {
            sefirah.classList.remove('correct', 'incorrect');
        });
    }

    // ========== SISTEMA DE AJUDA NO JOGO (25%/50%/75%) ==========
    useHelp(percentage) {
        if (!this.state.isPlaying || this.state.isPaused || this.currentHelpUsed) {
            return;
        }
        
        const question = this.questions[this.state.currentQuestion];
        const incorrectSefirot = Array.from(this.elements.sefirot)
            .filter(s => s.id !== question.sefirah && !s.classList.contains('eliminated'));
        
        if (incorrectSefirot.length === 0) return;
        
        // Penalidade de pontos baseada na dificuldade
        const basePenalty = percentage;
        const difficultyMultiplier = {
            'easy': 0.5,
            'medium': 1,
            'hard': 1.5,
            'expert': 2
        }[this.state.difficulty] || 1;
        
        const penalty = Math.floor(basePenalty * difficultyMultiplier);
        this.state.score = Math.max(0, this.state.score - penalty);
        this.currentHelpUsed = true;
        
        const shuffled = [...incorrectSefirot].sort(() => Math.random() - 0.5);
        const hideCount = Math.max(1, Math.floor(incorrectSefirot.length * (percentage / 100)));
        
        // Remover visualmente
        for (let i = 0; i < hideCount; i++) {
            setTimeout(() => {
                shuffled[i].classList.add('help-removed');
                shuffled[i].style.animation = 'fadeOut 0.5s forwards';
                shuffled[i].style.pointerEvents = 'none';
            }, i * 100);
        }
        
        this.updateVisibleOptionsCount();
        this.updateUI();
        this.showToast(`Ajuda ${percentage}% usada: -${penalty} pontos`, 'info');
    }

    // ========== CONTROLES ==========
    skipQuestion() {
        if (!this.state.isPlaying || this.state.isPaused) return;
        
        const skipPenalty = {
            'easy': 25,
            'medium': 50,
            'hard': 75,
            'expert': 150
        }[this.state.difficulty] || 75;
        
        this.state.score = Math.max(0, this.state.score - skipPenalty);
        this.updateUI();
        
        this.state.currentQuestion++;
        this.currentAttempts = 0;
        this.clearAnswerEffects();
        if (this.state.currentQuestion < this.state.totalQuestions) {
            this.showQuestion();
        } else {
            this.endGame();
        }
    }

    togglePause() {
        if (!this.state.isPlaying) return;
        
        this.state.isPaused = !this.state.isPaused;
        
        if (this.state.isPaused) {
            const content = `
                <h3>⏸️ Jogo Pausado</h3>
                <div class="pause-stats">
                    <div class="stat-item">
                        <span class="label">Pontuação:</span>
                        <span class="value">${this.state.score}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Vidas:</span>
                        <span class="value">${this.state.lives}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Questão:</span>
                        <span class="value">${this.state.currentQuestion + 1}/${this.state.totalQuestions}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn primary" onclick="game.togglePause()">▶️ Continuar</button>
                    <button class="btn" onclick="game.resetGame(); game.hideModal();">🔄 Reiniciar</button>
                    <button class="btn" onclick="game.endGame()">🏁 Terminar</button>
                </div>
            `;
            this.showModal('pause', content);
        } else {
            this.hideModal();
        }
    }

    resetGame() {
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.state.score = 0;
        this.state.currentQuestion = 0;
        this.state.errors = 0;
        this.currentAttempts = 0;
        
        // Reset para dificuldade padrão
        this.state.lives = 3;
        this.state.difficulty = 'medium';
        
        this.resetVisualEffects();
        this.showWelcomeScreen();
        this.updateUI();
        this.hideModal();
    }

    // ========== FIM DO JOGO ==========
    endGame() {
        this.state.isPlaying = false;
        clearInterval(this.state.timer);
        
        const accuracy = Math.round(((this.state.currentQuestion - this.state.errors) / this.state.totalQuestions) * 100);
        const grade = accuracy === 100 ? 'PERFEITO' :
                     accuracy >= 90 ? 'EXCELENTE' :
                     accuracy >= 80 ? 'MUITO BOM' :
                     accuracy >= 70 ? 'BOM' :
                     accuracy >= 60 ? 'SATISFATÓRIO' : 'CONTINUE PRATICANDO';
        
        this.updateProgress();
        
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
                    <span class="label">Erros Cometidos</span>
                    <span class="value">${this.state.errors}</span>
                </div>
                <div class="result-item">
                    <span class="label">Precisão</span>
                    <span class="value">${accuracy}%</span>
                </div>
            </div>
            <div class="grade">🏆 ${grade}</div>
            <div class="actions">
                <button class="btn primary" onclick="game.startGame()">🔄 Jogar Novamente</button>
                <button class="btn" onclick="game.resetGame(); game.hideModal();">🏠 Menu Principal</button>
            </div>
        `;
        
        this.showModal('results', results);
    }

    // ========== HELP GERAL (botão ?) ==========
    showHelp() {
        this.elements.helpModal.classList.remove('hidden');
    }

    hideHelp() {
        this.elements.helpModal.classList.add('hidden');
    }

    // ========== MODAIS ==========
    showModal(type, content) {
        this.elements.modalContent.innerHTML = content;
        this.elements.modal.classList.remove('hidden');
    }

    hideModal() {
        this.elements.modal.classList.add('hidden');
    }

    showOptions() {
        const content = `
            <h3>⚙️ Opções</h3>
            <div class="options">
                <button class="btn" onclick="game.setMode('normal')">🎮 Normal</button>
                <button class="btn" onclick="game.setMode('practice')">🎯 Prática</button>
                <button class="btn" onclick="game.setMode('timed')">⏱️ Contra-Relógio</button>
                <button class="btn" onclick="game.showStatsModal()">📊 Estatísticas</button>
                <button class="btn" onclick="game.hideModal()">❌ Fechar</button>
            </div>
        `;
        this.showModal('options', content);
    }

    setMode(mode) {
        const modes = {
            'normal': { lives: 3, timeLimit: null, combo: true },
            'practice': { lives: 999, timeLimit: null, combo: false },
            'timed': { lives: 3, timeLimit: 120, combo: true },
            'expert': { lives: 1, timeLimit: null, combo: true }
        };
        
        if (modes[mode]) {
            this.state.mode = mode;
            this.state.lives = modes[mode].lives;
            this.updateUI();
            this.hideModal();
            this.showToast(`Modo alterado: ${mode}`, 'info');
        }
    }

    // ========== TECLADO (1-0 como pedido) ==========
    handleKeyboard(e) {
        if (!this.state.isPlaying || this.state.isPaused) return;

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
            e.preventDefault();
            switch(e.key) {
                case '1': this.useHelp(25); break;
                case '2': this.useHelp(50); break;
                case '3': this.useHelp(75); break;
            }
        }
        
        // Controles
        else if (e.key === ' ') {
            e.preventDefault();
            this.togglePause();
        } else if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            this.skipQuestion();
        } else if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            this.showGameModesModal();
        } else if (e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            this.showDifficultyModal();
        } else if (e.key === 'o' || e.key === 'O') {
            e.preventDefault();
            this.showOptions();
        } else if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            this.showHelp();
        }
    }

    // ========== UI ==========
    updateUI() {
        this.elements.score.textContent = this.state.score;
        this.elements.errorsCount.textContent = this.state.errors;
        
        // Vidas
        let livesText = '';
        if (this.state.lives === 999) {
            livesText = '∞';
        } else {
            for (let i = 0; i < 5; i++) {
                livesText += i < this.state.lives ? '●' : '○';
            }
        }
        this.elements.lives.textContent = livesText;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
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
        
        // Calcula acertos (questões respondidas - erros)
        const correctAnswers = Math.max(0, this.state.currentQuestion - this.state.errors);
        progress.totalCorrect = (progress.totalCorrect || 0) + correctAnswers;
        
        try {
            localStorage.setItem('kabbalah_progress', JSON.stringify(progress));
        } catch (e) {
            console.warn('Não foi possível salvar o progresso:', e);
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.game = new KabbalahGame();
});
