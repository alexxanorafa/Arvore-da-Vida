// script.js - VERSÃO COMPLETA COM 90+ QUESTÕES ALEATÓRIAS E SIGNIFICADOS

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

// ========== JOGO KABBALAH (VERSÃO COMPLETA) ==========
class KabbalahGame {
    constructor() {
        // ========== BANCO DE 90+ QUESTÕES ==========
this.questions = [
    // GRUPO 1: Letras básicas
    { letter: 'א', sefirah: 'Coroa', meaning: 'O Primeiro, Unidade Divina, Princípio de Tudo' },
    { letter: 'ב', sefirah: 'Sabedoria', meaning: 'Palácio do Insight, Início da Criação' },
    { letter: 'ג', sefirah: 'Entendimento', meaning: 'Recompensa, Benevolência que Retorna' },
    { letter: 'ד', sefirah: 'Bondade / Misericórdia', meaning: 'Porta da Generosidade, Pobre que Recebe' },
    { letter: 'ה', sefirah: 'Força / Rigor', meaning: 'Revelação, Sopro Divino, Existência' },
    { letter: 'ו', sefirah: 'Beleza / Harmonia', meaning: 'União, Conexão entre Céu e Terra' },
    { letter: 'ז', sefirah: 'Vitória / Persistência', meaning: 'Armamento, Força Espiritual' },
    { letter: 'ח', sefirah: 'Glória / Intelecto Analítico', meaning: 'Vida, Graça, Unidade Transcendente' },
    { letter: 'ט', sefirah: 'Fundação', meaning: 'Bem Ocultado, Serpente Transformada' },
    { letter: 'י', sefirah: 'Reino / Manifestação', meaning: 'Mão que Abençoa, Ponto de Partida' },
    
    // GRUPO 2: Letras intermediárias
    { letter: 'כ', sefirah: 'Sabedoria', meaning: 'Palma da Mão que Sustenta o Insight' },
    { letter: 'ל', sefirah: 'Bondade / Misericórdia', meaning: 'Coração que Aprende, Aspiração ao Divino' },
    { letter: 'מ', sefirah: 'Glória / Intelecto Analítico', meaning: 'Águas Maternas, Fluidez Mental' },
    { letter: 'נ', sefirah: 'Fundação', meaning: 'Peixe que Nada nas Profundezas' },
    { letter: 'ס', sefirah: 'Entendimento', meaning: 'Círculo Protetor da Matriz Formadora' },
    { letter: 'ע', sefirah: 'Vitória / Persistência', meaning: 'Olho que Vê Além, Visão Espiritual' },
    { letter: 'פ', sefirah: 'Glória / Intelecto Analítico', meaning: 'Boca que Fala a Verdade do Esplendor' },
    { letter: 'צ', sefirah: 'Fundação', meaning: 'Retidão Divina, Integridade da Base' },
    { letter: 'ק', sefirah: 'Coroa', meaning: 'Sagrado, Separado do Mundo' },
    { letter: 'ר', sefirah: 'Força / Rigor', meaning: 'Cabeça que Julga com Retidão' },
    
    // GRUPO 3: Letras finais
    { letter: 'ך', sefirah: 'Sabedoria', meaning: 'Insight que se Conclui, Fim da Iluminação' },
    { letter: 'ם', sefirah: 'Entendimento', meaning: 'Águas da Compreensão que se Estagnam' },
    { letter: 'ן', sefirah: 'Vitória / Persistência', meaning: 'Triunfo que Persiste, Eternidade Realizada' },
    { letter: 'ף', sefirah: 'Glória / Intelecto Analítico', meaning: 'Boca do Esplendor que se Cala' },
    { letter: 'ץ', sefirah: 'Fundação', meaning: 'Justiça que se Torna Alicerce' },
    
    // GRUPO 4: Letras especiais
    { letter: 'ש', sefirah: 'Beleza / Harmonia', meaning: 'Dente que Consome o Mal, Fogo Transformador' },
    { letter: 'ת', sefirah: 'Reino / Manifestação', meaning: 'Sinal, Cruz, Assinatura Divina' },
    
    // GRUPO 5: Letras com daguesh
    { letter: 'אּ', sefirah: 'Coroa', meaning: 'Espírito Divino Intensificado' },
    { letter: 'בּ', sefirah: 'Sabedoria', meaning: 'Insight com Ponto de Força' },
    { letter: 'כּ', sefirah: 'Sabedoria', meaning: 'Conhecimento que Conquista' },
    { letter: 'פּ', sefirah: 'Glória / Intelecto Analítico', meaning: 'Esplendor que se Pronuncia' },
    
    // GRUPO 6: Letras com vogais
    { letter: 'אָ', sefirah: 'Coroa', meaning: 'Espírito com Luz Plena' },
    { letter: 'אֵ', sefirah: 'Coroa', meaning: 'Espírito que Brilha' },
    { letter: 'אִ', sefirah: 'Coroa', meaning: 'Espírito com Faísca Interior' },
    { letter: 'אֹ', sefirah: 'Coroa', meaning: 'Espírito que se Eleva' },
    { letter: 'אֻ', sefirah: 'Coroa', meaning: 'Espírito Fixado' },
    { letter: 'בָ', sefirah: 'Sabedoria', meaning: 'Iluminação Primal' },
    { letter: 'גִ', sefirah: 'Entendimento', meaning: 'Compreensão Interna' },
    { letter: 'דֵ', sefirah: 'Bondade / Misericórdia', meaning: 'Dádiva Brilhante' },
    { letter: 'הֹ', sefirah: 'Força / Rigor', meaning: 'Julgamento Elevado' },
    { letter: 'וּ', sefirah: 'Beleza / Harmonia', meaning: 'União Estabelecida' },
    
    // GRUPO 7: Combinações de 2 letras
    { letter: 'יה', sefirah: 'Beleza / Harmonia', meaning: 'Força Criativa Ativa, Início da Manifestação' },
    { letter: 'וה', sefirah: 'Beleza / Harmonia', meaning: 'União com a Existência' },
    { letter: 'אה', sefirah: 'Coroa', meaning: 'Espírito e Forma Unificados' },
    { letter: 'בן', sefirah: 'Sabedoria', meaning: 'Filho do Insight' },
    { letter: 'אב', sefirah: 'Coroa', meaning: 'Pai, Origem Primordial' },
    { letter: 'אם', sefirah: 'Entendimento', meaning: 'Mãe, Origem Material' },
    { letter: 'אל', sefirah: 'Bondade / Misericórdia', meaning: 'Deus, Poder Benevolente' },
    { letter: 'רה', sefirah: 'Força / Rigor', meaning: 'Espírito que Vê, Consciência Expandida' },
    { letter: 'מה', sefirah: 'Glória / Intelecto Analítico', meaning: 'O Quê? Questionamento do Esplendor' },
    { letter: 'לא', sefirah: 'Bondade / Misericórdia', meaning: 'Não, Limite da Expansão' },
    { letter: 'כן', sefirah: 'Sabedoria', meaning: 'Sim, Afirmação do Insight' },
    { letter: 'פה', sefirah: 'Glória / Intelecto Analítico', meaning: 'Boca que Declara' },
    { letter: 'שם', sefirah: 'Beleza / Harmonia', meaning: 'Nome, Essência Identificada' },
    { letter: 'זה', sefirah: 'Vitória / Persistência', meaning: 'Este, Identificação do Triunfo' },
    { letter: 'כי', sefirah: 'Sabedoria', meaning: 'Porque, Razão do Insight' },
    
    // GRUPO 8: Combinações de 3 letras
    { letter: 'אבg', sefirah: 'Coroa', meaning: 'Alfa-Beta-Gama, ABC da Criação' },
    { letter: 'דהא', sefirah: 'Bondade / Misericórdia', meaning: 'Conhecimento da Porta Divina' },
    { letter: 'זחט', sefirah: 'Vitória / Persistência', meaning: 'Força-Vida-Bem Oculto' },
    { letter: 'יכל', sefirah: 'Reino / Manifestação', meaning: 'Capacidade, Poder Realizado' },
    { letter: 'מן', sefirah: 'Glória / Intelecto Analítico', meaning: 'De, Separação das Águas' },
    { letter: 'סער', sefirah: 'Entendimento', meaning: 'Tempestade da Compreensão' },
    { letter: 'עבר', sefirah: 'Vitória / Persistência', meaning: 'Passado do Triunfo' },
    { letter: 'צהר', sefirah: 'Fundação', meaning: 'Meio-dia da Retidão' },
    { letter: 'קרח', sefirah: 'Coroa', meaning: 'Gelo Sagrado' },
    { letter: 'רשע', sefirah: 'Força / Rigor', meaning: 'Mau no Julgamento' },
    
    // GRUPO 9: Palavras cabalísticas (Saneadas para não dar a resposta)
    { letter: 'כתר', sefirah: 'Coroa', meaning: 'Vértice Supremo, Ponto Mais Elevado' },
    { letter: 'חכמה', sefirah: 'Sabedoria', meaning: 'Insight Primordial, Semente da Ideia' },
    { letter: 'בינה', sefirah: 'Entendimento', meaning: 'Matriz Formadora, Ventre da Compreensão' },
    { letter: 'חסد', sefirah: 'Bondade / Misericórdia', meaning: 'Amor Incondicional, Expansão Infinita' },
    { letter: 'גבורה', sefirah: 'Força / Rigor', meaning: 'Poder da Contenção, Severidade Necessária' },
    { letter: 'תפארת', sefirah: 'Beleza / Harmonia', meaning: 'Equilíbrio Estético, Eixo Central' },
    { letter: 'נצח', sefirah: 'Vitória / Persistência', meaning: 'Resiliência Ativa, Triunfo Perpétuo' },
    { letter: 'הוד', sefirah: 'Glória / Intelecto Analítico', meaning: 'Reverberação Mental, Louvor Sincero' },
    { letter: 'יסוד', sefirah: 'Fundação', meaning: 'Alicerce Místico, Suporte Estável' },
    { letter: 'מלכות', sefirah: 'Reino / Manifestação', meaning: 'Domínio Material, Realidade Concreta' },
    
    // GRUPO 10: Nomes divinos
    { letter: 'יהוה', sefirah: 'Beleza / Harmonia', meaning: 'Tetragrama Sagrado, Nome Inefável' },
    { letter: 'אהיה', sefirah: 'Coroa', meaning: 'EU SOU, Auto-Existência' },
    { letter: 'אדני', sefirah: 'Reino / Manifestação', meaning: 'Senhor, Soberania Terrena' },
    { letter: 'שדי', sefirah: 'Fundação', meaning: 'Todo-Poderoso, Sustento da Natureza' },
    { letter: 'צבאות', sefirah: 'Vitória / Persistência', meaning: 'Exércitos, Ordem do Triunfo' },
    
    // GRUPO 11: Letras com shva
    { letter: 'בּ', sefirah: 'Sabedoria', meaning: 'Insight que Repousa' },
    { letter: 'כּ', sefirah: 'Sabedoria', meaning: 'Recetáculo que Descansa' },
    { letter: 'פּ', sefirah: 'Glória / Intelecto Analítico', meaning: 'Boca que Silencia' },
    
    // GRUPO 12: Números em hebraico
    { letter: 'י״א', sefirah: 'Coroa', meaning: 'Onze - Transição Mística' },
    { letter: 'י״ב', sefirah: 'Sabedoria', meaning: 'Doze - Governo Superior' },
    { letter: 'י״ג', sefirah: 'Entendimento', meaning: 'Treze - Atributos de Piedade' },
    { letter: 'י״ד', sefirah: 'Bondade / Misericórdia', meaning: 'Catorze - Amor Manifestado' },
    { letter: 'ט״ו', sefirah: 'Força / Rigor', meaning: 'Quinze - Poder Oculto' },
    
    // GRUPO 13: Conceitos místicos
    { letter: 'אור', sefirah: 'Coroa', meaning: 'Luz Primordial' },
    { letter: 'חיים', sefirah: 'Glória / Intelecto Analítico', meaning: 'Vitalidade Eterna' },
    { letter: 'שלום', sefirah: 'Beleza / Harmonia', meaning: 'Plenitude, Ausência de Conflito' },
    { letter: 'אمت', sefirah: 'Fundação', meaning: 'Verdade Absoluta' },
    { letter: 'רחמים', sefirah: 'Bondade / Misericórdia', meaning: 'Compaixão Profunda' },
    { letter: 'חן', sefirah: 'Glória / Intelecto Analítico', meaning: 'Charme Espiritual, Encanto Interior' },
    { letter: 'כבוד', sefirah: 'Glória / Intelecto Analítico', meaning: 'Honra Divina, Peso da Luz' },
    { letter: 'תורה', sefirah: 'Beleza / Harmonia', meaning: 'Instrução, Lei do Equilíbrio' },
    { letter: 'משה', sefirah: 'Vitória / Persistência', meaning: 'Aquele que foi Extraído' },
    { letter: 'אהרון', sefirah: 'Glória / Intelecto Analítico', meaning: 'Montanha de Resplandecência' },
    
    // GRUPO 14: Mais conceitos
    { letter: 'סוד', sefirah: 'Entendimento', meaning: 'Mistério Oculto, Camada Profunda' },
    { letter: 'רז', sefirah: 'Sabedoria', meaning: 'Enigma do Insight' },
    { letter: 'קבלה', sefirah: 'Entendimento', meaning: 'Recepção da Tradição Mística' },
    { letter: 'ספר', sefirah: 'Glória / Intelecto Analítico', meaning: 'Manuscrito, Enumeração' },
    { letter: 'معشه', sefirah: 'Reino / Manifestação', meaning: 'Ação, Obra Finalizada' },
    { letter: 'דעת', sefirah: 'Entendimento', meaning: 'Conhecimento, Ponte Invisível' },
    { letter: 'שכינה', sefirah: 'Reino / Manifestação', meaning: 'Habitação da Presença Divina' }
];
        // Sistema de erros
        this.errorCount = new Map();
        this.currentAttempts = 0;
        
        // Sistema de pontos
        this.visibleOptions = 10;
        this.currentHelpUsed = false;
        
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
        
        // Sistema de aleatoriedade
        this.usedQuestions = new Set();
        this.currentQuestionIndex = 0;
        
        // Estado do jogo
        this.state = {
            isPlaying: false,
            isPaused: false,
            currentQuestion: 0,
            score: 0,
            lives: 3,
            totalQuestions: this.questions.length, // Usa todas as questões
            errors: 0
        };

        // Estado de layout e ajuda
        this.currentLayout = 'desktop';
        this.helpVisible = false;
        
        this.elements = {};
        this.init();
        
        // Inicializar margens
        setTimeout(() => this.ensureGameMargins(), 100);
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.showWelcomeScreen();
        
        // Inicializar sistema básico de modais
        this.initModalSystem();
        
        this.setupResponsiveLayout();
        this.initializeHelpSystem();
    }

    cacheElements() {
        this.elements = {
            welcomeScreen: document.getElementById('welcome-screen'),
            gameArea: document.getElementById('game-area'),
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            optionsBtn: document.getElementById('options-btn'),
            globalHelpBtn: document.getElementById('quick-help-btn'),
            helpModal: document.getElementById('help-modal'),
            help25Btn: document.getElementById('help-25-btn'),
            help50Btn: document.getElementById('help-50-btn'),
            help75Btn: document.getElementById('help-75-btn'),
            skipBtn: document.getElementById('skip-btn'),
            helpToggleBtn: document.getElementById('help-toggle-btn'),
            helpButtons: document.querySelector('.help-buttons'),
            questionPanel: document.getElementById('question-panel'),
            currentQuestion: document.getElementById('current-question'),
            currentSymbol: document.getElementById('current-symbol'),
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            progress: document.getElementById('progress'),
            errorsCount: document.getElementById('errors-count'),
            streakCount: document.getElementById('streak-count'),
            timeCount: document.getElementById('time-count'),
            sefirot: document.querySelectorAll('.sefirah'),
            modal: document.getElementById('game-modal'),
            modalContent: document.querySelector('#game-modal .modal-content')
        };
    }

    // MÉTODO ADICIONADO: Sistema simples de modais
    initModalSystem() {
        // Fechar modais ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('close-modal')) {
                    modal.classList.add('hidden');
                }
            });
        });
        
        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        });
    }

    // MÉTODO ADICIONADO: Mostrar ajuda
    showHelp() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.remove('hidden');
        }
    }

    setupEventListeners() {
        // Event listeners existentes
        this.elements.startBtn?.addEventListener('click', () => this.startGame());
        this.elements.restartBtn?.addEventListener('click', () => this.resetGame());
        this.elements.pauseBtn?.addEventListener('click', () => this.togglePause());
        this.elements.optionsBtn?.addEventListener('click', () => this.showOptions());
        this.elements.globalHelpBtn?.addEventListener('click', () => this.showHelp());
        this.elements.help25Btn?.addEventListener('click', () => this.useHelp(25));
        this.elements.help50Btn?.addEventListener('click', () => this.useHelp(50));
        this.elements.help75Btn?.addEventListener('click', () => this.useHelp(75));
        this.elements.skipBtn?.addEventListener('click', () => this.skipQuestion());
        this.elements.helpToggleBtn?.addEventListener('click', () => this.toggleHelp());

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

    setupResponsiveLayout() {
        this.checkAndUpdateLayout();
        
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.checkAndUpdateLayout();
                this.adjustGameElements();
                this.preventScroll();
            }, 250);
        });
        
        this.preventScroll();
    }
    
    checkAndUpdateLayout() {
        const width = window.innerWidth;
        
        let newLayout;
        if (width >= 1100) {
            newLayout = 'desktop';
        } else if (width >= 768) {
            newLayout = 'tablet';
        } else {
            newLayout = 'mobile';
        }
        
        if (newLayout !== this.currentLayout) {
            this.currentLayout = newLayout;
            this.applyLayout(newLayout);
        }
    }
    
    applyLayout(layout) {
        const container = document.querySelector('.game-grid-container');
        if (!container) return;
        
        switch(layout) {
            case 'desktop':
                container.style.gridTemplateColumns = '320px 1fr 250px';
                container.style.gridTemplateRows = '1fr';
                container.style.gap = '20px';
                container.style.maxWidth = '1200px';
                container.style.margin = '0 auto';
                break;
                
            case 'tablet':
                container.style.gridTemplateColumns = '300px 1fr';
                container.style.gridTemplateRows = '1fr auto';
                container.style.gap = '15px';
                container.style.maxWidth = '900px';
                
                const tree = document.querySelector('.tree-of-life');
                const status = document.querySelector('.game-status');
                if (tree && status) {
                    tree.style.gridColumn = '2';
                    tree.style.gridRow = '1';
                    status.style.gridColumn = '1 / span 2';
                    status.style.gridRow = '2';
                }
                break;
                
            case 'mobile':
                container.style.gridTemplateColumns = '1fr';
                container.style.gridTemplateRows = 'auto auto auto';
                container.style.gap = '10px';
                container.style.maxWidth = '100%';
                
                const elements = ['#question-panel', '.tree-of-life', '.game-status'];
                elements.forEach((selector, index) => {
                    const el = document.querySelector(selector);
                    if (el) {
                        el.style.gridColumn = '1';
                        el.style.gridRow = `${index + 1}`;
                    }
                });
                break;
        }
    }
    
    preventScroll() {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const footerHeight = document.getElementById('invisible-footer')?.offsetHeight || 50;
        const availableHeight = window.innerHeight - headerHeight - footerHeight - 20;
        
        const gameContainer = document.getElementById('game-container');
        const gridContainer = document.querySelector('.game-grid-container');
        
        if (gameContainer) {
            gameContainer.style.height = `${availableHeight}px`;
            gameContainer.style.overflow = 'hidden';
        }
        
        if (gridContainer) {
            gridContainer.style.height = `${availableHeight}px`;
            gridContainer.style.overflow = 'hidden';
        }
    }
    
    adjustGameElements() {
        const height = window.innerHeight;
        
        const sefirahElements = document.querySelectorAll('.sefirah');
        let sefirahSize;
        
        if (height < 600) {
            sefirahSize = 50;
        } else if (height < 700) {
            sefirahSize = 60;
        } else if (height < 800) {
            sefirahSize = 70;
        } else {
            sefirahSize = 80;
        }
        
        sefirahElements.forEach(sefirah => {
            sefirah.style.width = `${sefirahSize}px`;
            sefirah.style.height = `${sefirahSize}px`;
            sefirah.style.fontSize = `${Math.max(10, sefirahSize / 10)}px`;
        });
        
        const symbol = document.getElementById('current-symbol');
        if (symbol) {
            if (height < 600) {
                symbol.style.width = '60px';
                symbol.style.height = '60px';
                symbol.style.fontSize = '2em';
            } else if (height < 700) {
                symbol.style.width = '80px';
                symbol.style.height = '80px';
                symbol.style.fontSize = '2.5em';
            } else {
                symbol.style.width = '100px';
                symbol.style.height = '100px';
                symbol.style.fontSize = '3em';
            }
        }
    }
    
    initializeHelpSystem() {
        this.hideHelpButtons();
    }
    
    hideHelpButtons() {
        const helpButtons = this.elements.helpButtons;
        if (helpButtons) {
            helpButtons.style.display = 'none';
        }
    }
    
    toggleHelp() {
        const helpButtons = this.elements.helpButtons;
        const toggleBtn = this.elements.helpToggleBtn;
        
        if (!helpButtons || !toggleBtn) return;
        
        if (helpButtons.style.display === 'none' || !helpButtons.style.display) {
            helpButtons.style.display = 'grid';
            helpButtons.classList.add('visible');
            toggleBtn.innerHTML = '🆘 Ocultar Ajudas';
            toggleBtn.classList.add('active');
            this.helpVisible = true;
            
            if (window.audioSystem) {
                window.audioSystem.play('help');
            }
        } else {
            helpButtons.style.display = 'none';
            helpButtons.classList.remove('visible');
            toggleBtn.innerHTML = '🆘 Mostrar Ajudas';
            toggleBtn.classList.remove('active');
            this.helpVisible = false;
        }
    }

    calculatePoints() {
        let maxPoints = 10;
        
        if (this.currentHelpUsed) {
            switch(this.currentHelpUsed) {
                case 25: maxPoints = 7.5; break;
                case 50: maxPoints = 5.0; break;
                case 75: maxPoints = 2.5; break;
            }
        }
        
        const attemptPenalty = Math.max(0, this.currentAttempts - 1);
        let points = Math.max(0.5, maxPoints - attemptPenalty);
        
        return Math.round(points * 10) / 10;
    }

    // ========== SISTEMA DE ALEATORIEDADE ==========
    
    // Embaralhar questões de forma robusta
    shuffleQuestions() {
        // Reset do conjunto de questões usadas
        this.usedQuestions.clear();
        
        // Embaralha todas as questões usando algoritmo Fisher-Yates
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
        
        console.log(`✅ ${this.questions.length} questões embaralhadas`);
    }
    
    // Obter questão aleatória única
    getRandomQuestion() {
        // Se já usamos todas as questões, reiniciamos
        if (this.usedQuestions.size >= this.questions.length) {
            console.log('🔄 Todas as questões usadas, reiniciando...');
            this.usedQuestions.clear();
            // Reembaralha para nova rodada
            this.shuffleQuestions();
        }
        
        // Encontra uma questão não usada
        let availableQuestions = [];
        for (let i = 0; i < this.questions.length; i++) {
            if (!this.usedQuestions.has(i)) {
                availableQuestions.push(i);
            }
        }
        
        // Escolhe aleatoriamente entre as disponíveis
        if (availableQuestions.length === 0) {
            // Fallback: recomeça
            this.usedQuestions.clear();
            availableQuestions = Array.from({length: this.questions.length}, (_, i) => i);
        }
        
        const randomIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        this.usedQuestions.add(randomIndex);
        this.currentQuestionIndex = randomIndex;
        
        return this.questions[randomIndex];
    }

    showWelcomeScreen() {
        this.elements.welcomeScreen?.classList.remove('hidden');
        this.elements.gameArea?.classList.add('hidden');
    }

    showGameScreen() {
        this.elements.welcomeScreen?.classList.add('hidden');
        this.elements.gameArea?.classList.remove('hidden');
        
        setTimeout(() => {
            this.preventScroll();
            this.adjustGameElements();
        }, 100);
    }

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
        
        // RESET DA ALEATORIEDADE - Embaralha todas as questões
        this.usedQuestions.clear();
        this.shuffleQuestions();
        
        this.startTimer();
        this.resetVisualEffects();
        this.showGameScreen();
        this.showQuestion(); // Já chama getRandomQuestion()
        this.updateUI();
        
        this.showToast('Jogo iniciado! 110+ questões aleatórias aguardam você.', 'info');
        
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

    // MÉTODO MODIFICADO: Mostrar questão com letter e meaning
        showQuestion() {
            if (this.state.currentQuestion >= 150) {
                this.endGame();
                return;
            }

            const question = this.getRandomQuestion();
            
            // VERSÃO LIMPA E ALINHADA:
            this.elements.currentQuestion.innerHTML = `
                <div class="question-context">
                    <span class="question-counter">Questão ${this.state.currentQuestion + 1}</span>
                    <span class="streak-indicator">🔥 ${this.currentStreak}</span>
                </div>
                <div class="concept-meaning">
                    ${question.meaning}
                </div>
                <div class="action-prompt">
                    Selecione a Sefirah correspondente
                </div>
            `;
            
            // Apenas a letra no símbolo
            this.elements.currentSymbol.textContent = question.letter;
            this.elements.currentSymbol.title = `Significado: ${question.meaning}`;
            
            // Atualiza progresso no status
            this.elements.progress.textContent = `${this.state.currentQuestion + 1}`;
            
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
            // APENAS O NOME, SEM NÚMERO
            sefirah.innerHTML = name;
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

    checkAnswer(sefirahId) {
        if (!this.state.isPlaying || this.state.isPaused) return;

        const question = this.questions[this.currentQuestionIndex];
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
        
        this.discoveredSefirot.add(sefirahId);
        
        let pointsDetail = `+${points.toFixed(1)} pontos`;
        if (this.currentAttempts > 1) {
            pointsDetail += ` (${this.currentAttempts}ª tentativa)`;
        }
        if (this.currentHelpUsed) {
            pointsDetail += ` (ajuda ${this.currentHelpUsed}%)`;
        }
        
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
        
        // Verifica conquistas de streak
        if (this.achievementSystem) {
            if (this.currentStreak >= 10) {
                this.achievementSystem.unlock('perfectionist');
            }
            if (this.currentStreak >= 15) {
                this.achievementSystem.unlock('streak_master');
            }
        }
        
        this.updateUI();
        
        if (this.audioSystem) {
            this.audioSystem.play('correct');
        }
        
        this.showToast(`${pointsDetail} | Streak: ${this.currentStreak}`, 'success');

        setTimeout(() => {
            this.state.currentQuestion++;
            this.currentAttempts = 0;
            this.currentHelpUsed = false;
            this.resetVisualEffects();
            
            // Continua sempre com nova questão aleatória
            this.showQuestion();
            
        }, 1000);
    }

    handleWrongAnswer(sefirahId) {
        const errorPenalty = 2;
        this.state.score = Math.max(0, this.state.score - errorPenalty);
        this.trackError(sefirahId);
        
        this.currentStreak = 0;
        
        if (this.audioSystem) {
            this.audioSystem.play('incorrect');
        }
        
        this.showToast(`Erro! -${errorPenalty} pontos`, 'error');
        this.updateUI();
    }

    useHelp(percentage) {
        if (!this.state.isPlaying || this.state.isPaused || this.currentHelpUsed) {
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        const incorrectSefirot = Array.from(this.elements.sefirot)
            .filter(s => s.id !== question.sefirah && !s.classList.contains('eliminated'));
        
        if (incorrectSefirot.length === 0) return;
        
        this.currentHelpUsed = percentage;
        this.totalHelpUsed++;
        
        if (this.achievementSystem) {
            this.achievementSystem.recordHelpUsage();
        }
        
        const shuffled = [...incorrectSefirot].sort(() => Math.random() - 0.5);
        const hideCount = Math.max(1, Math.floor(incorrectSefirot.length * (percentage / 100)));
        
        if (this.audioSystem) {
            this.audioSystem.play('help');
        }
        
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
        
        if (this.currentLayout !== 'mobile') {
            this.toggleHelp();
        }
    }

    skipQuestion() {
        if (!this.state.isPlaying || this.state.isPaused) return;
        
        const skipPenalty = 5;
        this.state.score = Math.max(0, this.state.score - skipPenalty);
        this.updateUI();
        
        this.state.currentQuestion++;
        this.currentAttempts = 0;
        this.currentStreak = 0;
        this.currentHelpUsed = false;
        this.resetVisualEffects();
        
        // Continua sempre com nova questão
        this.showQuestion();
        
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
                        <span class="label">Questões Respondidas:</span>
                        <span class="value">${this.state.currentQuestion}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Streak Atual:</span>
                        <span class="value">${this.currentStreak}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Melhor Streak:</span>
                        <span class="value">${this.bestStreak}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Tempo:</span>
                        <span class="value">${this.elapsedTime}s</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Erros:</span>
                        <span class="value">${this.state.errors}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Questões Restantes:</span>
                        <span class="value">${this.questions.length - this.usedQuestions.size}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn primary" onclick="game.togglePause()">▶️ Continuar</button>
                    <button class="btn" onclick="game.resetGame(); this.closest('.modal').classList.add('hidden');">🔄 Reiniciar Jogo</button>
                    <button class="btn" onclick="game.endGame()">🏁 Terminar Sessão</button>
                </div>
            `;
            this.showModal('pause', content);
        } else {
            this.startTimer();
            // Fechar modal de pausa
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
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
        
        // Limpa aleatoriedade
        this.usedQuestions.clear();
        
        this.stopTimer();
        this.resetVisualEffects();
        this.showWelcomeScreen();
        this.updateUI();
        
        // Fechar todos os modais
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    endGame() {
        this.state.isPlaying = false;
        this.stopTimer();
        
        const gameTime = this.elapsedTime;
        const accuracy = this.state.currentQuestion > 0 ? 
            Math.round(((this.state.currentQuestion - this.state.errors) / this.state.currentQuestion) * 100) : 0;
        const grade = accuracy === 100 ? '🎖️ PERFEITO' :
                     accuracy >= 90 ? '🏅 EXCELENTE' :
                     accuracy >= 80 ? '🥇 MUITO BOM' :
                     accuracy >= 70 ? '🥈 BOM' :
                     accuracy >= 60 ? '🥉 SATISFATÓRIO' : '📚 CONTINUE PRATICANDO';
        
        // Atualiza estatísticas
        if (this.achievementSystem) {
            this.achievementSystem.updateStats({
                score: this.state.score,
                totalQuestions: this.state.currentQuestion,
                errors: this.state.errors,
                time: gameTime,
                streak: this.bestStreak,
                discoveredSefirot: Array.from(this.discoveredSefirot)
            });
        }
        
        if (this.audioSystem) {
            if (accuracy > 70) {
                this.audioSystem.play('victory');
            } else if (accuracy > 50) {
                this.audioSystem.play('achievement');
            }
        }
        
        const results = `
            <h3>🎉 Sessão Concluída</h3>
            <div class="results">
                <div class="result-item">
                    <span class="label">Pontuação Final</span>
                    <span class="value">${this.state.score}</span>
                </div>
                <div class="result-item">
                    <span class="label">Questões Respondidas</span>
                    <span class="value">${this.state.currentQuestion}</span>
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
                <div class="result-item">
                    <span class="label">Questões Únicas</span>
                    <span class="value">${this.usedQuestions.size}/${this.questions.length}</span>
                </div>
            </div>
            <div class="grade">${grade}</div>
            <div class="actions">
                <button class="btn primary" onclick="game.startGame()">🔄 Nova Sessão</button>
                <button class="btn" onclick="game.showAchievements()">🏆 Conquistas</button>
                <button class="btn" onclick="game.showOptions()">⚙️ Opções</button>
                <button class="btn" onclick="game.resetGame(); this.closest('.modal').classList.add('hidden');">🏠 Menu Principal</button>
            </div>
        `;
        
        this.showModal('results', results);
    }

    showModal(type, content) {
        if (this.elements.modalContent) {
            this.elements.modalContent.innerHTML = content;
            this.elements.modal?.classList.remove('hidden');
        }
    }

    showOptions() {
        const content = `
            <h3>⚙️ Opções do Jogo</h3>
            <div class="options-grid">
                <button class="btn option-btn" onclick="game.showAchievements()">
                    <span class="option-icon">🏆</span>
                    <span class="option-text">Conquistas</span>
                    <small>${this.achievementSystem ? this.achievementSystem.getUnlockedCount() : 0}/10</small>
                </button>
                
                <button class="btn option-btn" onclick="window.audioSystem?.showAudioSettings()">
                    <span class="option-icon">🔊</span>
                    <span class="option-text">Áudio</span>
                    <small>${window.audioSystem?.enabled ? '✅' : '🔇'}</small>
                </button>
                
                <button class="btn option-btn" onclick="window.dailyChallenge?.showDailyChallengeModal()">
                    <span class="option-icon">🌅</span>
                    <span class="option-text">Desafio Diário</span>
                    <small>${window.dailyChallenge?.progress?.streak || 0} dias</small>
                </button>
                
                <button class="btn option-btn" onclick="game.resetGame(); this.closest('.modal').classList.add('hidden');">
                    <span class="option-icon">🔄</span>
                    <span class="option-text">Reiniciar</span>
                    <small>Começar de novo</small>
                </button>
                
                <button class="btn option-btn" onclick="game.showHelp()">
                    <span class="option-icon">❓</span>
                    <span class="option-text">Como Jogar</span>
                    <small>Instruções</small>
                </button>
                
                <button class="btn option-btn" onclick="game.togglePause()">
                    <span class="option-icon">${this.state.isPaused ? '▶️' : '⏸️'}</span>
                    <span class="option-text">${this.state.isPaused ? 'Continuar' : 'Pausar'}</span>
                    <small>Jogo</small>
                </button>
            </div>
            
            <div class="current-stats">
                <h4>📊 Estatísticas Atuais</h4>
                <div class="stat-row">
                    <span>Questões na Sessão:</span>
                    <span class="stat-value">${this.state.currentQuestion}</span>
                </div>
                <div class="stat-row">
                    <span>Pontuação:</span>
                    <span class="stat-value">${this.state.score}</span>
                </div>
                <div class="stat-row">
                    <span>Streak Atual:</span>
                    <span class="stat-value">${this.currentStreak}</span>
                </div>
                <div class="stat-row">
                    <span>Questões Restantes:</span>
                    <span class="stat-value">${this.questions.length - this.usedQuestions.size}</span>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn close-modal">❌ Fechar</button>
            </div>
        `;
        this.showModal('options', content);
    }

    handleKeyboard(e) {
        if (!this.state.isPlaying || this.state.isPaused) return;

        if (e.key === ' ' || 
            (e.ctrlKey && ['1', '2', '3'].includes(e.key)) ||
            ['s', 'S', 'o', 'O', 'h', 'H', 'a', 'A', 'c', 'C'].includes(e.key)) {
            e.preventDefault();
        }

        // Teclas 1-9 para Sefirot (1=Keter...9=Yesod)
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
        
        // Ctrl + 1/2/3 para ajuda
        else if (e.ctrlKey) {
            switch(e.key) {
                case '1': this.useHelp(25); break;
                case '2': this.useHelp(50); break;
                case '3': this.useHelp(75); break;
            }
        }
        
        // Teclas de função
        else {
            switch(e.key.toLowerCase()) {
                case ' ': // Espaço para pausar
                    this.togglePause();
                    break;
                case 's': // S para pular
                    this.skipQuestion();
                    break;
                case 'o': // O para opções
                    this.showOptions();
                    break;
                case 'h': // H para ajuda
                    this.toggleHelp();
                    break;
                case 'a': // A para conquistas
                    if (this.achievementSystem) {
                        this.achievementSystem.showAchievementsModal();
                    }
                    break;
                case 'c': // C para desafio diário
                    if (this.dailyChallenge) {
                        this.dailyChallenge.showDailyChallengeModal();
                    }
                    break;
                case 'escape': // ESC para fechar modais
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.classList.add('hidden');
                    });
                    break;
            }
        }
    }

    updateUI() {
        if (this.elements.score) this.elements.score.textContent = this.state.score;
        if (this.elements.errorsCount) this.elements.errorsCount.textContent = this.state.errors;
        if (this.elements.streakCount) this.elements.streakCount.textContent = this.currentStreak;
        
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

    loadProgress() {
        try {
            const saved = localStorage.getItem('kabbalah_progress_v3');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Não foi possível carregar o progresso:', e);
        }
        return { games: 0, bestScore: 0, totalCorrect: 0, questionsSeen: 0 };
    }

    updateProgress() {
        const progress = this.loadProgress();
        progress.games = (progress.games || 0) + 1;
        
        if (this.state.score > (progress.bestScore || 0)) {
            progress.bestScore = this.state.score;
        }
        
        const correctAnswers = Math.max(0, this.state.currentQuestion - this.state.errors);
        progress.totalCorrect = (progress.totalCorrect || 0) + correctAnswers;
        progress.questionsSeen = (progress.questionsSeen || 0) + this.usedQuestions.size;
        
        try {
            localStorage.setItem('kabbalah_progress_v3', JSON.stringify(progress));
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
        this.showToast('Desafio diário iniciado!', 'info');
    }
    
    ensureGameMargins() {
        // Garantir que o footer invisível existe
        let footer = document.getElementById('invisible-footer');
        if (!footer) {
            footer = document.createElement('footer');
            footer.id = 'invisible-footer';
            document.body.appendChild(footer);
        }
        
        // Ajustar alturas dinamicamente
        this.adjustGameHeights();
        
        // Adicionar listener para resize
        window.addEventListener('resize', () => {
            setTimeout(() => this.adjustGameHeights(), 100);
        });
    }
    
    adjustGameHeights() {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const footer = document.getElementById('invisible-footer');
        const footerHeight = footer ? parseInt(window.getComputedStyle(footer).height) || 50 : 50;
        const windowHeight = window.innerHeight;
        
        const availableHeight = windowHeight - headerHeight - footerHeight - 20;
        
        // Ajustar container principal
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.height = `${availableHeight}px`;
            gameContainer.style.minHeight = `${availableHeight}px`;
        }
        
        // Ajustar área do jogo
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.style.height = `${availableHeight}px`;
            gameArea.style.maxHeight = `${availableHeight}px`;
        }
        
        // Ajustar grid container
        const gridContainer = document.querySelector('.game-grid-container');
        if (gridContainer) {
            gridContainer.style.height = `${availableHeight}px`;
            gridContainer.style.maxHeight = `${availableHeight}px`;
        }
        
        // Ajustar seções individuais
        const sections = ['#question-panel', '.tree-of-life', '.game-status'];
        sections.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.maxHeight = `${availableHeight}px`;
            }
        });
    }
}

// ========== INICIALIZAÇÃO DO JOGO ==========
document.addEventListener('DOMContentLoaded', () => {
    new AppsMenu();
    window.game = new KabbalahGame();
    
    // Ativar áudio na primeira interação
    document.addEventListener('click', () => {
        if (window.audioSystem && !window.audioSystem.initialized) {
            window.audioSystem.init();
        }
    }, { once: true });
});