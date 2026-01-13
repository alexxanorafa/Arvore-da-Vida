// ========== CÓDIGO DO MENU ORIGINAL ==========
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
});

class KabbalahGame {
    constructor() {
        // Dados das Sefirot
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

        // Configurações do jogo
        this.config = {
            mode: 'normal',
            difficulty: 'medium',
            lives: 3,
            helpLevel: 0, // 0 = sem ajuda, 1 = 25%, 2 = 50%, 3 = 75%
            timeLimit: null,
            comboEnabled: true,
            showAnimations: true
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
            mistakes: {},
            helpUsed: false,
            currentHelpLevel: 0,
            helpAvailable: true
        };

        // Progresso do jogador
        this.progress = {
            totalGames: 0,
            bestScore: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            accuracy: 0,
            playTime: 0,
            helpUsage: { 25: 0, 50: 0, 75: 0 }
        };

        // Cache de elementos DOM
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
            lives: document.querySelector('#lives span'),
            combo: document.querySelector('#combo span'),
            currentQ: document.getElementById('current-q'),
            helpLevel: document.querySelector('#help-level span'),
            
            // Botões de ajuda
            help25Btn: document.getElementById('help-25-btn'),
            help50Btn: document.getElementById('help-50-btn'),
            help75Btn: document.getElementById('help-75-btn'),
            skipBtn: document.getElementById('skip-btn'),
            
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
            practiceBtn: document.getElementById('practice-btn'),
            
            // Elementos de árvore
            treeOfLife: document.querySelector('.tree-of-life')
        };
    }

    setupEventListeners() {
        // Botões principais
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.resetGame());

        // Botões de ajuda com feedback visual
        this.elements.help25Btn.addEventListener('click', () => this.useHelp(25));
        this.elements.help50Btn.addEventListener('click', () => this.useHelp(50));
        this.elements.help75Btn.addEventListener('click', () => this.useHelp(75));
        this.elements.skipBtn.addEventListener('click', () => this.skipQuestion());

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

        // Eventos das Sefirot
        this.elements.sefirot.forEach(sefirah => {
            sefirah.addEventListener('click', (e) => {
                if (this.state.isPlaying && !this.state.isPaused) {
                    this.checkAnswer(e.currentTarget.id);
                }
            });
        });

        // Teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Fechar modal
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.hideModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.elements.modal.classList.contains('active')) {
                    this.hideModal();
                } else if (this.state.isPlaying && !this.state.isPaused) {
                    this.togglePause();
                }
            }
        });

        // Pause no jogo quando janela perde foco
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.state.isPlaying && !this.state.isPaused) {
                this.togglePause();
            }
        });
    }

    setupDragAndDrop() {
        this.elements.currentSymbol.setAttribute('draggable', 'true');
        
        this.elements.currentSymbol.addEventListener('dragstart', (e) => {
            if (!this.state.isPlaying) return;
            e.dataTransfer.setData('text/plain', 'symbol');
            this.elements.currentSymbol.style.opacity = '0.7';
            this.elements.currentSymbol.style.transform = 'scale(1.1)';
        });

        this.elements.currentSymbol.addEventListener('dragend', () => {
            this.elements.currentSymbol.style.opacity = '1';
            this.elements.currentSymbol.style.transform = 'scale(1)';
        });

        this.elements.sefirot.forEach(sefirah => {
            sefirah.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!this.state.isPlaying || sefirah.classList.contains('hidden-option')) return;
                sefirah.classList.add('highlight');
            });

            sefirah.addEventListener('dragleave', () => {
                sefirah.classList.remove('highlight');
            });

            sefirah.addEventListener('drop', (e) => {
                e.preventDefault();
                sefirah.classList.remove('highlight');
                if (!this.state.isPlaying || sefirah.classList.contains('hidden-option')) return;
                this.checkAnswer(sefirah.id);
            });
        });
    }

    // ========== SISTEMA DE AJUDA MELHORADO ==========
    useHelp(percentage) {
        if (!this.state.isPlaying || this.state.isPaused || this.state.helpUsed || !this.state.helpAvailable) {
            return;
        }
        
        const question = this.questions[this.state.currentQuestion];
        const incorrectSefirot = Array.from(this.elements.sefirot)
            .filter(s => s.id !== question.sefirah);
        
        if (incorrectSefirot.length === 0) return;
        
        // Criar efeito visual
        this.createHelpEffect(percentage);
        
        // Embaralhar opções incorretas
        const shuffled = [...incorrectSefirot].sort(() => Math.random() - 0.5);
        
        // Calcular quantas opções esconder
        const hideCount = Math.max(1, Math.floor(incorrectSefirot.length * (percentage / 100)));
        
        // Esconder opções com animação
        for (let i = 0; i < hideCount; i++) {
            setTimeout(() => {
                shuffled[i].classList.add('hidden-option');
                shuffled[i].style.animation = 'fadeOut 0.5s ease';
            }, i * 100);
        }
        
        // Destacar opções restantes
        const remaining = Array.from(this.elements.sefirot)
            .filter(s => !s.classList.contains('hidden-option') && s.id !== question.sefirah);
        
        remaining.forEach(sefirah => {
            sefirah.classList.add('help-highlight');
            setTimeout(() => sefirah.classList.remove('help-highlight'), 2000);
        });
        
        // Registrar ajuda usada
        this.state.helpUsed = true;
        this.state.currentHelpLevel = percentage;
        this.progress.helpUsage[percentage]++;
        
        // Atualizar botões de ajuda
        this.updateHelpButtons();
        
        // Feedback visual e sonoro
        this.showToast(`Ajuda ativada: ${percentage}% das opções incorretas removidas`, 'info');
        this.playSound('help');
    }

    createHelpEffect(percentage) {
        const effect = document.createElement('div');
        effect.className = 'help-effect';
        effect.style.width = '100px';
        effect.style.height = '100px';
        effect.style.left = '50%';
        effect.style.top = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        
        this.elements.treeOfLife.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
    }

    resetHelpOptions() {
        this.elements.sefirot.forEach(sefirah => {
            sefirah.classList.remove('hidden-option', 'help-highlight');
            sefirah.style.animation = '';
        });
        this.state.helpUsed = false;
        this.state.currentHelpLevel = 0;
        this.updateHelpButtons();
    }

    updateHelpButtons() {
        const helpButtons = [
            this.elements.help25Btn,
            this.elements.help50Btn,
            this.elements.help75Btn
        ];
        
        helpButtons.forEach(btn => {
            if (this.state.helpUsed || !this.state.helpAvailable) {
                btn.classList.add('disabled');
                btn.style.cursor = 'not-allowed';
                btn.title = this.state.helpUsed ? 'Ajuda já usada nesta questão' : 'Ajuda não disponível';
            } else {
                btn.classList.remove('disabled');
                btn.style.cursor = 'pointer';
                btn.title = '';
            }
        });
    }

    // ========== JOGABILIDADE ==========
    startGame() {
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.state.helpAvailable = true;
        
        this.elements.startBtn.classList.add('hidden');
        this.elements.questionPanel.classList.remove('hidden');
        
        if (this.config.showAnimations) {
            this.elements.floatingHUD.classList.remove('hidden');
        }
        
        this.shuffleQuestions();
        this.showQuestion();
        this.startTimer();
        this.updateUI();
        
        this.showToast('Jogo iniciado!', 'info');
        this.playSound('start');
    }

    shuffleQuestions() {
        let weightedQuestions = [...this.questions];
        
        // Adicionar questões baseadas em erros anteriores
        Object.keys(this.state.mistakes).forEach(sefirah => {
            const mistakeCount = this.state.mistakes[sefirah];
            const question = this.questions.find(q => q.sefirah === sefirah);
            
            if (question && mistakeCount > 0) {
                for (let i = 0; i < Math.min(mistakeCount, 2); i++) {
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
            `Associe a letra ${question.letter} à Sefirah correspondente:`;  // CORRIGIDO: removido número
        this.elements.currentSymbol.textContent = question.letter;
        
        this.elements.currentQ.textContent = this.state.currentQuestion + 1;
        
        // Resetar opções de ajuda
        this.resetHelpOptions();
        
        // Aplicar configurações de dificuldade
        this.applyDifficulty();
        
        // Animar entrada da questão
        if (this.config.showAnimations) {
            this.elements.currentSymbol.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.elements.currentSymbol.style.animation = '';
            }, 500);
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
            time: new Date(),
            helpUsed: this.state.helpUsed,
            helpLevel: this.state.currentHelpLevel
        });

        // Efeitos visuais
        if (this.config.showAnimations) {
            element.classList.add(isCorrect ? 'correct' : 'incorrect');
            this.playSound(isCorrect ? 'correct' : 'incorrect');
        }

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
        // Calcular pontos base
        let basePoints = 100;
        
        // Modificar por dificuldade
        switch(this.config.difficulty) {
            case 'easy':
                basePoints = 80;
                break;
            case 'hard':
                basePoints = 150;
                break;
        }
        
        // Reduzir pontos se usou ajuda
        let helpMultiplier = 1;
        if (this.state.helpUsed) {
            switch(this.state.currentHelpLevel) {
                case 25:
                    helpMultiplier = 0.75;
                    break;
                case 50:
                    helpMultiplier = 0.5;
                    break;
                case 75:
                    helpMultiplier = 0.25;
                    break;
            }
        }
        
        // Aplicar combo
        let points = Math.floor(basePoints * helpMultiplier);
        if (this.config.comboEnabled && this.state.combo > 1) {
            points += Math.floor((this.state.combo - 1) * 25 * helpMultiplier);
        }

        this.state.score += points;
        this.state.correctAnswers++;
        this.state.combo++;
        this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo);

        // Atualizar UI
        this.updateUI();
        
        // Feedback
        let message = `+${points} pontos`;
        if (this.state.helpUsed) {
            message += ` (com ${this.state.currentHelpLevel}% de ajuda)`;
        }
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
        }, 1200);
    }

    handleWrongAnswer(sefirahId) {
        this.state.combo = 1;
        this.state.lives--;
        
        // Penalidade base
        let penalty = 50;
        if (this.state.helpUsed) {
            penalty = Math.floor(penalty * (1 - (this.state.currentHelpLevel / 100)));
        }
        
        this.state.score = Math.max(0, this.state.score - penalty);

        // Mostrar resposta correta
        const correctId = this.questions[this.state.currentQuestion].sefirah;
        const correctElement = document.getElementById(correctId);
        correctElement.classList.add('correct');

        // Atualizar UI
        this.updateUI();
        this.showToast(`Resposta incorreta! -${penalty} pontos`, 'error');

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

    skipQuestion() {
        if (!this.state.isPlaying || this.state.isPaused) return;
        
        this.state.score = Math.max(0, this.state.score - 75);
        this.state.combo = 1;
        
        this.updateUI();
        this.showToast('Questão pulada! -75 pontos', 'warning');
        
        this.state.currentQuestion++;
        if (this.state.currentQuestion < this.state.totalQuestions) {
            this.showQuestion();
        } else {
            this.endGame();
        }
    }

    clearAnswerEffects() {
        this.elements.sefirot.forEach(sefirah => {
            sefirah.classList.remove('correct', 'incorrect');
        });
    }

    // ========== DIFICULDADE ==========
    applyDifficulty() {
        // Remover classes anteriores
        document.body.classList.remove('difficulty-easy', 'difficulty-medium', 'difficulty-hard');
        
        // Adicionar classe atual
        document.body.classList.add(`difficulty-${this.config.difficulty}`);
        
        // Ajustar visibilidade baseado na dificuldade
        this.elements.sefirot.forEach(sefirah => {
            const name = this.getSefirahName(sefirah.id);
            
            switch(this.config.difficulty) {
                case 'easy':
                    // Apenas nomes
                    sefirah.innerHTML = `${name}`;
                    sefirah.style.fontSize = '0.9em';
                    sefirah.classList.remove('faded');
                    break;
                case 'hard':
                    // Nomes menores ou esmaecidos (sem números)
                    sefirah.innerHTML = name;
                    sefirah.style.fontSize = '0.8em';
                    sefirah.classList.add('faded');
                    break;
                default:
                    // Apenas nomes
                    sefirah.innerHTML = `${name}`;
                    sefirah.style.fontSize = '0.85em';
                    sefirah.classList.remove('faded');
            }
        });
    }

    getSefirahName(id) {
        const names = {
            'keter': 'Keter',
            'chokhmah': 'Chokhmah',
            'binah': 'Binah',
            'chesed': 'Chesed',
            'gevurah': 'Gevurah',
            'tiferet': 'Tiferet',
            'netzach': 'Netzach',
            'hod': 'Hod',
            'yesod': 'Yesod',
            'malkuth': 'Malkuth'
        };
        return names[id] || id;
    }

    // Função removida pois não é mais usada
    // getSefirahNumber(id) {
    //     const numbers = {
    //         'keter': '1',
    //         'chokhmah': '2',
    //         'binah': '3',
    //         'chesed': '4',
    //         'gevurah': '5',
    //         'tiferet': '6',
    //         'netzach': '7',
    //         'hod': '8',
    //         'yesod': '9',
    //         'malkuth': '10'
    //     };
    //     return numbers[id] || '';
    // }

    setMode(mode) {
        this.config.mode = mode;
        
        switch(mode) {
            case 'practice':
                this.config.lives = Infinity;
                this.config.comboEnabled = false;
                this.showToast('Modo Prática ativado', 'info');
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
        this.applyDifficulty();
        const diffNames = {
            'easy': 'Fácil',
            'medium': 'Médio', 
            'hard': 'Difícil'
        };
        this.showToast(`Dificuldade: ${diffNames[difficulty]}`, 'info');
    }

    // ========== TIMER ==========
    startTimer() {
        if (this.state.timer) clearInterval(this.state.timer);
        
        this.state.timer = setInterval(() => {
            if (this.state.isPlaying && !this.state.isPaused) {
                this.state.timeElapsed++;
                
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
        const grade = accuracy === 100 ? 'PERFEITO' :
                     accuracy >= 90 ? 'EXCELENTE' :
                     accuracy >= 70 ? 'MUITO BOM' :
                     accuracy >= 50 ? 'BOM' : 'CONTINUE PRATICANDO';
        
        // Atualizar progresso
        this.updateProgress(accuracy);
        
        // Mostrar resultados
        this.showResults(accuracy, grade);
        
        this.elements.floatingHUD.classList.add('hidden');
        this.playSound('gameOver');
    }

    updateProgress(accuracy) {
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
    }

    showResults(accuracy, grade) {
        const results = `
            <h3>Jogo Concluído</h3>
            <div class="results">
                <div class="result-item">
                    <span class="label">Pontuação Final</span>
                    <span class="value">${this.state.score}</span>
                </div>
                <div class="result-item">
                    <span class="label">Acertos</span>
                    <span class="value">${this.state.correctAnswers}/${this.state.totalQuestions}</span>
                </div>
                <div class="result-item">
                    <span class="label">Precisão</span>
                    <span class="value">${Math.round(accuracy)}%</span>
                </div>
                <div class="result-item">
                    <span class="label">Combo Máximo</span>
                    <span class="value">${this.state.maxCombo}x</span>
                </div>
                <div class="result-item">
                    <span class="label">Tempo</span>
                    <span class="value">${this.formatTime(this.state.timeElapsed)}</span>
                </div>
                <div class="result-item">
                    <span class="label">Dificuldade</span>
                    <span class="value">${this.config.difficulty === 'easy' ? 'Fácil' : this.config.difficulty === 'hard' ? 'Difícil' : 'Médio'}</span>
                </div>
            </div>
            <div class="grade">${grade}</div>
            <div class="actions">
                <button class="btn primary" onclick="game.resetGame(); game.startGame();">Jogar Novamente</button>
                <button class="btn" onclick="game.hideModal(); game.showWelcomeScreen();">Menu Principal</button>
            </div>
        `;
        
        this.showModal('results', results);
    }

    // ========== UI & MODAIS ==========
    showModal(type, customContent = null) {
        let content = '';
        
        switch(type) {
            case 'modes':
                content = `
                    <h3>Modos de Jogo</h3>
                    <div class="mode-options">
                        <button class="mode-btn ${this.config.mode === 'normal' ? 'active' : ''}" data-mode="normal">
                            <span class="mode-name">Normal</span>
                            <span class="mode-desc">10 questões, 3 vidas, sistema de combos</span>
                        </button>
                        <button class="mode-btn ${this.config.mode === 'practice' ? 'active' : ''}" data-mode="practice">
                            <span class="mode-name">Prática Livre</span>
                            <span class="mode-desc">Sem vidas limitadas, sem pressão</span>
                        </button>
                        <button class="mode-btn ${this.config.mode === 'timed' ? 'active' : ''}" data-mode="timed">
                            <span class="mode-name">Contra-Relógio</span>
                            <span class="mode-desc">60 segundos para máximo de acertos</span>
                        </button>
                    </div>
                `;
                break;
                
            case 'difficulty':
                content = `
                    <h3>Nível de Dificuldade</h3>
                    <div class="difficulty-options">
                        <button class="diff-btn ${this.config.difficulty === 'easy' ? 'active' : ''}" data-diff="easy">
                            <span class="diff-name">Fácil</span>
                            <span class="diff-desc">Nomes visíveis</span>
                        </button>
                        <button class="diff-btn ${this.config.difficulty === 'medium' ? 'active' : ''}" data-diff="medium">
                            <span class="diff-name">Médio</span>
                            <span class="diff-desc">Equilíbrio entre desafio e pontuação</span>
                        </button>
                        <button class="diff-btn ${this.config.difficulty === 'hard' ? 'active' : ''}" data-diff="hard">
                            <span class="diff-name">Difícil</span>
                            <span class="diff-desc">Nomes menores e esmaecidos</span>
                        </button>
                    </div>
                `;
                break;
                
            case 'stats':
                const help25Usage = this.progress.helpUsage[25] || 0;
                const help50Usage = this.progress.helpUsage[50] || 0;
                const help75Usage = this.progress.helpUsage[75] || 0;
                const totalHelp = help25Usage + help50Usage + help75Usage;
                
                content = `
                    <h3>Estatísticas</h3>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-label">Jogos Completos</span>
                            <span class="stat-value">${this.progress.totalGames}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Melhor Pontuação</span>
                            <span class="stat-value">${this.progress.bestScore}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Precisão Geral</span>
                            <span class="stat-value">${this.progress.accuracy}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Tempo Total</span>
                            <span class="stat-value">${this.formatTime(this.progress.playTime)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Ajuda Usada</span>
                            <span class="stat-value">${totalHelp}x</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Erros Mais Comuns</span>
                            <span class="stat-value">${Object.keys(this.state.mistakes).length}</span>
                        </div>
                    </div>
                    ${totalHelp > 0 ? `
                        <div class="help-info">
                            <p><strong>Uso de ajuda:</strong> 25%: ${help25Usage}x | 50%: ${help50Usage}x | 75%: ${help75Usage}x</p>
                        </div>
                    ` : ''}
                `;
                break;
                
            case 'pause':
                content = `
                    <h3>Jogo Pausado</h3>
                    <div class="pause-stats">
                        <div class="stat-item">
                            <span class="label">Pontuação Atual</span>
                            <span class="value">${this.state.score}</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">Vidas Restantes</span>
                            <span class="value">${this.state.lives}</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">Combo Atual</span>
                            <span class="value">${this.state.combo}x</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">Questão</span>
                            <span class="value">${this.state.currentQuestion + 1}/${this.state.totalQuestions}</span>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="btn primary" onclick="game.togglePause()">Continuar Jogo</button>
                        <button class="btn" onclick="game.resetGame(); game.hideModal();">Reiniciar Jogo</button>
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
    }

    // ========== ATUALIZAÇÃO DE UI ==========
    updateUI() {
        // Pontuação
        this.elements.score.textContent = this.state.score;
        this.elements.combo.textContent = `${this.state.combo}x`;
        
        // Vidas
        let livesText = '';
        if (this.config.mode === 'practice') {
            livesText = '∞';
        } else {
            for (let i = 0; i < 3; i++) {
                livesText += i < this.state.lives ? '●' : '○';
            }
        }
        this.elements.lives.textContent = livesText;
        
        // Nível de ajuda atual
        this.elements.helpLevel.textContent = this.state.helpUsed ? `${this.state.currentHelpLevel}%` : '0%';
        
        // HUD flutuante
        if (this.elements.floatingHUD && !this.elements.floatingHUD.classList.contains('hidden')) {
            this.elements.hudScore.textContent = this.state.score;
            this.elements.hudCombo.textContent = `${this.state.combo}x`;
            this.elements.hudLives.textContent = livesText;
        }
    }

    // ========== TECLADO ==========
    handleKeyboard(e) {
        if (!this.state.isPlaying || this.state.isPaused) return;

        // Teclas para Sefirot (opcional, pode remover se não quiser)
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
        
        // Teclas de ajuda (Ctrl + número)
        else if (e.ctrlKey) {
            e.preventDefault();
            switch(e.key) {
                case '1':
                    this.useHelp(25);
                    break;
                case '2':
                    this.useHelp(50);
                    break;
                case '3':
                    this.useHelp(75);
                    break;
            }
        }
        
        // Teclas de controle
        else if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            this.skipQuestion();
        } else if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            this.togglePause();
        } else if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            this.showModal('modes');
        } else if (e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            this.showModal('difficulty');
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

    playSound(type) {
        // Implementação básica de sons (pode ser expandida)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'correct':
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                case 'incorrect':
                    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.5);
                    break;
                case 'help':
                    oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
                    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
            }
        } catch (e) {
            // Fallback silencioso se Web Audio API não estiver disponível
        }
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
            mistakes: {...this.state.mistakes},
            helpUsed: false,
            currentHelpLevel: 0,
            helpAvailable: true
        };
        
        // Resetar Sefirot - APENAS NOMES, SEM NÚMEROS
        this.elements.sefirot.forEach(sefirah => {
            const name = this.getSefirahName(sefirah.id);
            sefirah.innerHTML = `${name}`;  // CORRIGIDO: apenas nome, sem número
            sefirah.style.fontSize = '';
            sefirah.classList.remove('hidden-option', 'help-highlight', 'faded');
            sefirah.style.animation = '';
        });
        
        this.elements.startBtn.classList.remove('hidden');
        this.elements.questionPanel.classList.add('hidden');
        this.elements.floatingHUD.classList.add('hidden');
        this.clearAnswerEffects();
        this.updateUI();
        this.updateHelpButtons();
        
        // Resetar configurações visuais
        document.body.classList.remove('difficulty-easy', 'difficulty-medium', 'difficulty-hard');
        document.body.classList.add(`difficulty-${this.config.difficulty}`);
    }

    showWelcomeScreen() {
        this.resetGame();
        this.hideModal();
        this.showToast('Bem-vindo à Kabbalah Interativa!', 'info');
    }

    // ========== PROGRESSO ==========
    loadProgress() {
        try {
            const saved = localStorage.getItem('kabbalah_progress_v2');
            if (saved) {
                this.progress = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Não foi possível carregar o progresso:', e);
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('kabbalah_progress_v2', JSON.stringify(this.progress));
        } catch (e) {
            console.warn('Não foi possível salvar o progresso:', e);
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.game = new KabbalahGame();
    
    // Adicionar informações de ajuda
    const helpInfo = document.createElement('div');
    helpInfo.className = 'help-info';
    helpInfo.innerHTML = `
        <p><strong>Como jogar:</strong> Arraste o símbolo para a Sefirah correta ou clique nela.</p>
        <p><strong>Ajuda:</strong> Use os botões para remover opções incorretas (ganha menos pontos).</p>
        <p><strong>Teclas:</strong> Espaço para pausar | Ctrl+1/2/3 para ajuda</p>
    `;
    
    const gameContainer = document.getElementById('game-container');
    const controls = document.querySelector('.game-controls');
    if (gameContainer && controls) {
        gameContainer.insertBefore(helpInfo, controls.nextSibling);
    }
});
