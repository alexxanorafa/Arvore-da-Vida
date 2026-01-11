// ========== CÓDIGO DO MENU ORIGINAL (MANTIDO) ==========
document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.getElementById("menuIcon");
    const menu = document.getElementById("menu");

    // Abrir/Fechar menu
    menuIcon.addEventListener("click", function(e) {
        e.stopPropagation();
        menu.classList.toggle("active");
        menuIcon.classList.toggle("active");
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", function(e) {
        if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
            menu.classList.remove("active");
            menuIcon.classList.remove("active");
        }
    });

    // Animar itens do menu
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-3px)";
        });
        
        item.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0)";
        });
    });
});

class KabbalahGame {
    constructor() {
        // Dados originais mantidos
        this.questions = [
            { 
                letter: 'א', 
                number: 1, 
                sefirah: 'keter', 
                meaning: 'Aleph - O Espírito Divino',
                hint: 'Coroa / Ponto mais alto'
            },
            { 
                letter: 'ב', 
                number: 2, 
                sefirah: 'chokhmah', 
                meaning: 'Bet - Sabedoria Primordial',
                hint: 'Sabedoria / Insight divino'
            },
            { 
                letter: 'ג', 
                number: 3, 
                sefirah: 'binah', 
                meaning: 'Gimel - Entendimento Divino',
                hint: 'Entendimento / Compreensão'
            },
            { 
                letter: 'ד', 
                number: 4, 
                sefirah: 'chesed', 
                meaning: 'Dalet - Amor e Misericórdia',
                hint: 'Amor / Graça / Expansão'
            },
            { 
                letter: 'ה', 
                number: 5, 
                sefirah: 'gevurah', 
                meaning: 'Hei - Julgamento e Restrição',
                hint: 'Julgamento / Força / Limites'
            },
            { 
                letter: 'ו', 
                number: 6, 
                sefirah: 'tiferet', 
                meaning: 'Vav - Beleza e Harmonia',
                hint: 'Beleza / Harmonia / Equilíbrio'
            },
            { 
                letter: 'ז', 
                number: 7, 
                sefirah: 'netzach', 
                meaning: 'Zayin - Vitória Eterna',
                hint: 'Vitória / Eternidade / Persistência'
            },
            { 
                letter: 'ח', 
                number: 8, 
                sefirah: 'hod', 
                meaning: 'Chet - Esplendor Divino',
                hint: 'Esplendor / Majestade / Glória'
            },
            { 
                letter: 'ט', 
                number: 9, 
                sefirah: 'yesod', 
                meaning: 'Tet - Fundação do Mundo',
                hint: 'Fundação / Base / Conexão'
            },
            { 
                letter: 'י', 
                number: 10, 
                sefirah: 'malkuth', 
                meaning: 'Yod - Reino Material',
                hint: 'Reino / Manifestação / Mundo'
            }
        ];

        // Configurações expandidas
        this.config = {
            mode: 'normal', // normal, practice, timed, memory
            difficulty: 'medium', // easy, medium, hard
            lives: 3,
            timeLimit: null,
            comboEnabled: true,
            hintsEnabled: true,
            autoHideHUD: true,
            showFloatingHUD: true
        };

        // Estado do jogo
        this.state = {
            isPlaying: false,
            isPaused: false,
            currentQuestion: 0,
            score: 0,
            lives: this.config.lives,
            combo: 1,
            maxCombo: 1,
            correctAnswers: 0,
            totalQuestions: 10,
            timeElapsed: 0,
            timer: null,
            questionsHistory: [],
            mistakes: {}
        };

        // Progresso do usuário
        this.progress = {
            totalGames: 0,
            bestScore: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            accuracy: 0,
            playTime: 0
        };

        // Cache de elementos
        this.elements = {};

        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.loadProgress();
        this.resetGame();
        this.setupDragAndDrop();
        this.updateUI();
    }

    cacheElements() {
        // Elementos principais
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn'),
            questionPanel: document.getElementById('question-panel'),
            currentQuestion: document.getElementById('current-question'),
            currentSymbol: document.getElementById('current-symbol'),
            score: document.querySelector('#score span'),
            lives: document.getElementById('lives'),
            combo: document.querySelector('#combo span'),
            currentQ: document.getElementById('current-q'),
            
            // Novos botões
            hintBtn: document.getElementById('hint-btn'),
            skipBtn: document.getElementById('skip-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            modeBtn: document.getElementById('mode-btn'),
            
            // HUD flutuante
            floatingHUD: document.getElementById('floating-hud'),
            hudScore: document.getElementById('hud-score'),
            hudCombo: document.getElementById('hud-combo'),
            hudLives: document.getElementById('hud-lives'),
            
            // Modal
            modal: document.getElementById('game-modal'),
            modalContent: document.querySelector('.modal-content'),
            
            // Sefirot
            sefirot: document.querySelectorAll('.sefirah'),
            
            // Menu items
            gameModesBtn: document.getElementById('game-modes-btn'),
            difficultyBtn: document.getElementById('difficulty-btn'),
            statsBtn: document.getElementById('stats-btn'),
            practiceBtn: document.getElementById('practice-btn')
        };
    }

    setupEventListeners() {
        // Botões originais
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.resetGame());

        // Novos botões
        this.elements.hintBtn.addEventListener('click', () => this.useHint());
        this.elements.skipBtn.addEventListener('click', () => this.skipQuestion());
        this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
        this.elements.modeBtn.addEventListener('click', () => this.showModeSelector());

        // Menu items
        this.elements.gameModesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('modes');
        });
        
        this.elements.difficultyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('difficulty');
        });
        
        this.elements.statsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('stats');
        });
        
        this.elements.practiceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.setMode('practice');
            this.startGame();
        });

        // Sefirot (clique)
        this.elements.sefirot.forEach(sefirah => {
            sefirah.addEventListener('click', (e) => {
                if (this.state.isPlaying && !this.state.isPaused) {
                    this.checkAnswer(e.currentTarget.id);
                }
            });
        });

        // Teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Fechar modal com ESC ou clique fora
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.hideModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.modal.classList.contains('active')) {
                this.hideModal();
            }
        });
    }

    setupDragAndDrop() {
        this.elements.currentSymbol.setAttribute('draggable', 'true');
        
        this.elements.currentSymbol.addEventListener('dragstart', (e) => {
            if (!this.state.isPlaying) return;
            e.dataTransfer.setData('text/plain', 'symbol');
            this.elements.currentSymbol.style.opacity = '0.5';
        });

        this.elements.currentSymbol.addEventListener('dragend', () => {
            this.elements.currentSymbol.style.opacity = '1';
        });

        this.elements.sefirot.forEach(sefirah => {
            sefirah.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!this.state.isPlaying) return;
                sefirah.classList.add('highlight');
            });

            sefirah.addEventListener('dragleave', () => {
                sefirah.classList.remove('highlight');
            });

            sefirah.addEventListener('drop', (e) => {
                e.preventDefault();
                sefirah.classList.remove('highlight');
                if (!this.state.isPlaying) return;
                this.checkAnswer(sefirah.id);
            });
        });
    }

    // ========== JOGABILIDADE ==========
    startGame() {
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.elements.startBtn.classList.add('hidden');
        this.elements.questionPanel.classList.remove('hidden');
        
        if (this.config.showFloatingHUD) {
            this.elements.floatingHUD.classList.remove('hidden');
        }
        
        this.shuffleQuestions();
        this.showQuestion();
        this.startTimer();
        this.updateUI();
        this.showToast('Jogo iniciado! Use teclas 1-0 para jogar rápido.', 'info');
        
        // Auto-hide HUD após 5 segundos
        if (this.config.autoHideHUD) {
            setTimeout(() => {
                if (this.state.isPlaying && !this.state.isPaused) {
                    this.elements.floatingHUD.style.opacity = '0.3';
                }
            }, 5000);
        }
    }

    shuffleQuestions() {
        // Sistema de repetição de questões difíceis
        let weightedQuestions = [...this.questions];
        
        Object.keys(this.state.mistakes).forEach(sefirah => {
            const mistakeCount = this.state.mistakes[sefirah];
            const question = this.questions.find(q => q.sefirah === sefirah);
            
            if (question && mistakeCount > 0) {
                // Adiciona questões baseado no número de erros
                for (let i = 0; i < Math.min(mistakeCount, 3); i++) {
                    weightedQuestions.push({...question});
                }
            }
        });
        
        this.questions = weightedQuestions.sort(() => Math.random() - 0.5);
    }

    showQuestion() {
        if (this.state.currentQuestion >= this.state.totalQuestions) {
            this.endGame();
            return;
        }

        const question = this.questions[this.state.currentQuestion];
        this.elements.currentQuestion.textContent = 
            `Associe a letra ${question.letter} ao seu conceito correspondente:`;
        this.elements.currentSymbol.textContent = question.letter;
        
        // Atualizar contador de questões
        this.elements.currentQ.textContent = this.state.currentQuestion + 1;
        
        // Restaurar opacidade do HUD
        if (this.config.autoHideHUD) {
            this.elements.floatingHUD.style.opacity = '0.8';
            setTimeout(() => {
                if (this.state.isPlaying && !this.state.isPaused) {
                    this.elements.floatingHUD.style.opacity = '0.3';
                }
            }, 3000);
        }
    }

    checkAnswer(sefirahId) {
        if (!this.state.isPlaying || this.state.isPaused) return;

        const question = this.questions[this.state.currentQuestion];
        const isCorrect = sefirahId === question.sefirah;
        const element = document.getElementById(sefirahId);

        // Registrar tentativa
        this.state.questionsHistory.push({
            question: question.letter,
            answer: sefirahId,
            correct: isCorrect,
            time: new Date()
        });

        // Efeito visual
        element.classList.add(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer(sefirahId);
        }

        // Registrar estatísticas
        if (!isCorrect) {
            this.state.mistakes[question.sefirah] = (this.state.mistakes[question.sefirah] || 0) + 1;
        }
    }

    handleCorrectAnswer() {
        // Calcular pontos
        let points = 100;
        
        if (this.config.comboEnabled && this.state.combo > 1) {
            points += (this.state.combo - 1) * 15;
        }
        
        if (this.config.difficulty === 'hard') {
            points *= 1.5;
        } else if (this.config.difficulty === 'easy') {
            points *= 0.8;
        }

        this.state.score += Math.floor(points);
        this.state.correctAnswers++;
        this.state.combo++;
        this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo);

        // Atualizar UI
        this.updateUI();
        
        // Feedback
        let message = `+${Math.floor(points)} pontos`;
        if (this.state.combo > 2) {
            message += ` | Combo ${this.state.combo}x!`;
        }
        this.showToast(message, 'success');

        // Próxima questão
        setTimeout(() => {
            this.state.currentQuestion++;
            this.clearAnswerEffects();
            
            if (this.state.currentQuestion < this.state.totalQuestions) {
                this.showQuestion();
            } else {
                this.endGame();
            }
        }, 1000);
    }

    handleWrongAnswer(sefirahId) {
        this.state.combo = 1;
        this.state.lives--;
        
        // Penalidade
        this.state.score = Math.max(0, this.state.score - 50);

        // Mostrar resposta correta
        const correctId = this.questions[this.state.currentQuestion].sefirah;
        const correctElement = document.getElementById(correctId);
        correctElement.classList.add('correct');

        // Atualizar UI
        this.updateUI();
        this.showToast('Resposta incorreta! -50 pontos', 'error');

        // Verificar game over
        setTimeout(() => {
            this.clearAnswerEffects();
            
            if (this.state.lives <= 0) {
                this.endGame();
            } else {
                this.state.currentQuestion++;
                if (this.state.currentQuestion < this.state.totalQuestions) {
                    this.showQuestion();
                } else {
                    this.endGame();
                }
            }
        }, 1500);
    }

    clearAnswerEffects() {
        this.elements.sefirot.forEach(sefirah => {
            sefirah.classList.remove('correct', 'incorrect');
        });
    }

    // ========== NOVAS FUNCIONALIDADES ==========
    useHint() {
        if (!this.state.isPlaying || this.state.isPaused) return;
        
        const question = this.questions[this.state.currentQuestion];
        this.state.score = Math.max(0, this.state.score - 25);
        
        this.updateUI();
        this.showToast(`Dica: ${question.hint} (-25 pontos)`, 'info');
    }

    skipQuestion() {
        if (!this.state.isPlaying || this.state.isPaused) return;
        
        this.state.score = Math.max(0, this.state.score - 50);
        this.state.combo = 1;
        
        this.updateUI();
        this.showToast('Questão pulada! (-50 pontos)', 'warning');
        
        this.state.currentQuestion++;
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
            clearInterval(this.state.timer);
            this.showModal('pause');
        } else {
            this.startTimer();
            this.hideModal();
        }
        
        this.elements.floatingHUD.style.opacity = this.state.isPaused ? '1' : '0.8';
    }

    setMode(mode) {
        this.config.mode = mode;
        
        switch(mode) {
            case 'practice':
                this.config.lives = Infinity;
                this.config.comboEnabled = false;
                this.showToast('Modo Prática: Sem vidas limitadas', 'info');
                break;
            case 'timed':
                this.config.timeLimit = 60;
                this.showToast('Modo Contra-Relógio: 60 segundos', 'info');
                break;
            default:
                this.config.lives = 3;
                this.config.comboEnabled = true;
        }
        
        this.state.lives = this.config.lives;
        this.updateUI();
    }

    setDifficulty(difficulty) {
        this.config.difficulty = difficulty;
        this.showToast(`Dificuldade: ${difficulty === 'easy' ? 'Fácil' : 
                                      difficulty === 'hard' ? 'Difícil' : 'Médio'}`, 'info');
    }

    // ========== TIMER ==========
    startTimer() {
        if (this.state.timer) clearInterval(this.state.timer);
        
        this.state.timer = setInterval(() => {
            if (this.state.isPlaying && !this.state.isPaused) {
                this.state.timeElapsed++;
                
                // Verificar limite de tempo
                if (this.config.timeLimit && this.state.timeElapsed >= this.config.timeLimit) {
                    this.endGame();
                }
            }
        }, 1000);
    }

    // ========== FIM DO JOGO ==========
    endGame() {
        clearInterval(this.state.timer);
        this.state.isPlaying = false;
        
        // Calcular estatísticas
        const accuracy = (this.state.correctAnswers / this.state.totalQuestions) * 100;
        const grade = accuracy === 100 ? '🎉 PERFEITO!' :
                     accuracy >= 90 ? '🌟 EXCELENTE!' :
                     accuracy >= 70 ? '👍 MUITO BOM!' :
                     accuracy >= 50 ? '✅ BOM!' : '💪 CONTINUE PRATICANDO!';
        
        // Atualizar progresso
        this.progress.totalGames++;
        this.progress.totalCorrect += this.state.correctAnswers;
        this.progress.totalQuestions += this.state.totalQuestions;
        this.progress.playTime += this.state.timeElapsed;
        
        if (this.state.score > this.progress.bestScore) {
            this.progress.bestScore = this.state.score;
        }
        
        this.progress.accuracy = this.progress.totalQuestions > 0 
            ? Math.round((this.progress.totalCorrect / this.progress.totalQuestions) * 100)
            : 0;
        
        this.saveProgress();
        
        // Mostrar resultados
        const results = `
            <h3>Jogo Concluído!</h3>
            <div class="results">
                <div class="result-item">
                    <span class="label">Pontuação:</span>
                    <span class="value">${this.state.score}</span>
                </div>
                <div class="result-item">
                    <span class="label">Acertos:</span>
                    <span class="value">${this.state.correctAnswers}/${this.state.totalQuestions}</span>
                </div>
                <div class="result-item">
                    <span class="label">Precisão:</span>
                    <span class="value">${Math.round(accuracy)}%</span>
                </div>
                <div class="result-item">
                    <span class="label">Combo Máx:</span>
                    <span class="value">${this.state.maxCombo}x</span>
                </div>
                <div class="result-item">
                    <span class="label">Tempo:</span>
                    <span class="value">${this.formatTime(this.state.timeElapsed)}</span>
                </div>
            </div>
            <div class="grade">${grade}</div>
            <div class="actions">
                <button class="btn primary" onclick="game.resetGame(); game.startGame();">Jogar Novamente</button>
                <button class="btn" onclick="game.hideModal(); game.showWelcomeScreen();">Menu Principal</button>
            </div>
        `;
        
        this.showModal('results', results);
        this.elements.floatingHUD.classList.add('hidden');
    }

    // ========== UI & MODAIS ==========
    showModal(type, customContent = null) {
        let content = '';
        
        switch(type) {
            case 'modes':
                content = `
                    <h3>Modos de Jogo</h3>
                    <div class="mode-options">
                        <button class="mode-btn" data-mode="normal">
                            <span class="mode-icon">🔗</span>
                            <span class="mode-name">Normal</span>
                            <span class="mode-desc">10 questões, 3 vidas</span>
                        </button>
                        <button class="mode-btn" data-mode="practice">
                            <span class="mode-icon">📚</span>
                            <span class="mode-name">Prática Livre</span>
                            <span class="mode-desc">Sem vidas, sem pressão</span>
                        </button>
                        <button class="mode-btn" data-mode="timed">
                            <span class="mode-icon">⏱️</span>
                            <span class="mode-name">Contra-Relógio</span>
                            <span class="mode-desc">60 segundos, máximo acertos</span>
                        </button>
                    </div>
                `;
                break;
                
            case 'difficulty':
                content = `
                    <h3>Dificuldade</h3>
                    <div class="difficulty-options">
                        <button class="diff-btn" data-diff="easy">
                            <span class="diff-name">Fácil</span>
                            <span class="diff-desc">Nomes sempre visíveis</span>
                        </button>
                        <button class="diff-btn active" data-diff="medium">
                            <span class="diff-name">Médio</span>
                            <span class="diff-desc">Nomes por 5 segundos</span>
                        </button>
                        <button class="diff-btn" data-diff="hard">
                            <span class="diff-name">Difícil</span>
                            <span class="diff-desc">Apenas números, -50 por erro</span>
                        </button>
                    </div>
                `;
                break;
                
            case 'stats':
                content = `
                    <h3>Estatísticas</h3>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-label">Jogos Completos:</span>
                            <span class="stat-value">${this.progress.totalGames}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Melhor Pontuação:</span>
                            <span class="stat-value">${this.progress.bestScore}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Precisão Geral:</span>
                            <span class="stat-value">${this.progress.accuracy}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Tempo Total:</span>
                            <span class="stat-value">${this.formatTime(this.progress.playTime)}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'pause':
                content = `
                    <h3>Jogo Pausado</h3>
                    <div class="pause-stats">
                        <div>Pontuação: ${this.state.score}</div>
                        <div>Vidas: ${this.state.lives}</div>
                        <div>Combo: ${this.state.combo}x</div>
                        <div>Questão: ${this.state.currentQuestion + 1}/${this.state.totalQuestions}</div>
                    </div>
                    <div class="actions">
                        <button class="btn primary" onclick="game.togglePause()">Continuar</button>
                        <button class="btn" onclick="game.resetGame(); game.hideModal();">Reiniciar</button>
                        <button class="btn" onclick="game.endGame()">Terminar Jogo</button>
                    </div>
                `;
                break;
                
            default:
                if (customContent) {
                    content = customContent;
                }
        }
        
        this.elements.modalContent.innerHTML = content;
        this.elements.modal.classList.add('active');
        
        // Adicionar event listeners aos botões do modal
        setTimeout(() => {
            document.querySelectorAll('.mode-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const mode = e.currentTarget.dataset.mode;
                    this.setMode(mode);
                    this.hideModal();
                });
            });
            
            document.querySelectorAll('.diff-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const diff = e.currentTarget.dataset.diff;
                    this.setDifficulty(diff);
                    this.hideModal();
                });
            });
        }, 10);
    }

    hideModal() {
        this.elements.modal.classList.remove('active');
    }

    showModeSelector() {
        this.showModal('modes');
    }

    // ========== ATUALIZAÇÃO DE UI ==========
    updateUI() {
        // Atualizar elementos principais
        this.elements.score.textContent = this.state.score;
        this.elements.combo.textContent = `${this.state.combo}x`;
        
        // Atualizar vidas
        let livesHTML = '';
        const maxLives = this.config.mode === 'practice' ? 0 : 3;
        
        if (this.config.mode === 'practice') {
            livesHTML = '∞';
        } else {
            for (let i = 0; i < maxLives; i++) {
                livesHTML += i < this.state.lives ? '❤️' : '🤍';
            }
        }
        
        this.elements.lives.innerHTML = livesHTML;
        
        // Atualizar HUD flutuante
        if (this.elements.floatingHUD && !this.elements.floatingHUD.classList.contains('hidden')) {
            this.elements.hudScore.textContent = this.state.score;
            this.elements.hudCombo.textContent = `${this.state.combo}x`;
            this.elements.hudLives.innerHTML = livesHTML;
        }
    }

    // ========== TECLADO ==========
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
        
        // Teclas de controle
        else if (e.key === ' ' || e.key === 'h') {
            e.preventDefault();
            this.useHint();
        } else if (e.key === 's') {
            e.preventDefault();
            this.skipQuestion();
        } else if (e.key === 'p' || e.key === 'Escape') {
            e.preventDefault();
            this.togglePause();
        } else if (e.key === 'm') {
            e.preventDefault();
            this.showModeSelector();
        }
    }

    // ========== UTILITÁRIOS ==========
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

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    resetGame() {
        this.state = {
            isPlaying: false,
            isPaused: false,
            currentQuestion: 0,
            score: 0,
            lives: this.config.lives,
            combo: 1,
            maxCombo: 1,
            correctAnswers: 0,
            totalQuestions: 10,
            timeElapsed: 0,
            timer: null,
            questionsHistory: [],
            mistakes: {...this.state.mistakes}
        };
        
        this.elements.startBtn.classList.remove('hidden');
        this.elements.questionPanel.classList.add('hidden');
        this.elements.floatingHUD.classList.add('hidden');
        this.clearAnswerEffects();
        this.updateUI();
    }

    showWelcomeScreen() {
        this.resetGame();
        this.hideModal();
    }

    // ========== PROGRESSO ==========
    loadProgress() {
        const saved = localStorage.getItem('kabbalah_progress');
        if (saved) {
            this.progress = JSON.parse(saved);
        }
    }

    saveProgress() {
        localStorage.setItem('kabbalah_progress', JSON.stringify(this.progress));
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.game = new KabbalahGame();
});
