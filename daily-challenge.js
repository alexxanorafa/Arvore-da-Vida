// daily-challenge.js - VERSÃO CORRIGIDA
class DailyChallenge {
    constructor() {
        this.challenges = {
            '0': { // Domingo
                theme: 'Letras Iniciais',
                description: 'Associe as primeiras letras do alfabeto hebraico',
                letters: ['א', 'ב', 'ג', 'ד', 'ה'],
                difficulty: 'easy',
                reward: 150,
                timeLimit: 300 // 5 minutos
            },
            '1': { // Segunda
                theme: 'Letras Finais',
                description: 'Associe as letras finais (sofiot)',
                letters: ['ך', 'ם', 'ן', 'ף', 'ץ'],
                difficulty: 'medium',
                reward: 200,
                timeLimit: 300
            },
            '2': { // Terça
                theme: 'Letras Místicas',
                description: 'Letras associadas à criação divina',
                letters: ['ו', 'י', 'ה', 'א', 'מ'],
                difficulty: 'hard',
                reward: 250,
                timeLimit: 300
            },
            '3': { // Quarta
                theme: 'Numerologia Cabalística',
                description: 'Letras com valores numéricos especiais',
                letters: ['ק', 'ר', 'ש', 'ת', 'ך'],
                difficulty: 'medium',
                reward: 200,
                timeLimit: 300
            },
            '4': { // Quinta
                theme: 'Caminho da Sabedoria',
                description: 'Letras do pilar da sabedoria',
                letters: ['א', 'ב', 'ח', 'כ', 'ר'],
                difficulty: 'hard',
                reward: 250,
                timeLimit: 300
            },
            '5': { // Sexta
                theme: 'Caminho do Entendimento',
                description: 'Letras do pilar do entendimento',
                letters: ['ג', 'ד', 'ט', 'ל', 'ש'],
                difficulty: 'hard',
                reward: 250,
                timeLimit: 300
            },
            '6': { // Sábado
                theme: 'Shabbat - União Divina',
                description: 'Letras que unem os pilares',
                letters: ['ה', 'ו', 'ז', 'ס', 'ע'],
                difficulty: 'expert',
                reward: 300,
                timeLimit: 300
            }
        };
        
        this.loadProgress();
        this.initializeDailyReset();
    }
    
    getTodayChallenge() {
        const dayOfWeek = new Date().getDay();
        return this.challenges[dayOfWeek.toString()];
    }
    
    getCurrentDateKey() {
        const now = new Date();
        // Usar data normalizada (YYYY-MM-DD) para evitar problemas de fuso horário
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    
    hasPlayedToday() {
        const lastPlayed = localStorage.getItem('daily_challenge_last_played');
        const todayKey = this.getCurrentDateKey();
        
        return lastPlayed === todayKey;
    }
    
    completeChallenge(score, time) {
        const challenge = this.getTodayChallenge();
        const stars = this.calculateStars(score, time, challenge.difficulty);
        const todayKey = this.getCurrentDateKey();
        
        // Atualizar progresso
        this.progress.completed++;
        this.progress.totalScore += score;
        
        // Atualizar streak
        const lastPlayed = localStorage.getItem('daily_challenge_last_played');
        if (lastPlayed) {
            // Calcular diferença em dias
            const lastDate = new Date(lastPlayed);
            const today = new Date();
            
            // Normalizar datas para meia-noite
            lastDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            
            const diffTime = today - lastDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Jogou ontem, manter streak
                this.progress.streak++;
            } else if (diffDays > 1) {
                // Perdeu um ou mais dias, resetar streak
                this.progress.streak = 1;
            } else {
                // Mesmo dia, não alterar streak
            }
        } else {
            // Primeiro jogo
            this.progress.streak = 1;
        }
        
        // Verificar streak mais longo
        if (this.progress.streak > this.progress.longestStreak) {
            this.progress.longestStreak = this.progress.streak;
        }
        
        // Salvar progresso diário
        this.progress.daily[todayKey] = {
            score,
            time,
            stars,
            challenge: challenge.theme,
            difficulty: challenge.difficulty,
            reward: challenge.reward,
            streakBonus: this.getStreakBonus()
        };
        
        // Marcar como jogado hoje
        localStorage.setItem('daily_challenge_last_played', todayKey);
        this.saveProgress();
        
        return {
            stars,
            reward: challenge.reward,
            streakBonus: this.getStreakBonus(),
            totalReward: challenge.reward + this.getStreakBonus(),
            streak: this.progress.streak,
            nextReward: this.getNextReward()
        };
    }
    
    calculateStars(score, time, difficulty) {
        // Baseado na dificuldade
        const thresholds = {
            easy: { 3: 200, 2: 150, 1: 100 },
            medium: { 3: 180, 2: 140, 1: 100 },
            hard: { 3: 160, 2: 120, 1: 80 },
            expert: { 3: 140, 2: 100, 1: 60 }
        };
        
        const threshold = thresholds[difficulty] || thresholds.medium;
        
        if (score >= threshold[3]) return 3;
        if (score >= threshold[2]) return 2;
        return 1;
    }
    
    getStreakBonus() {
        const streak = this.progress.streak;
        
        // Bônus progressivo por streak
        if (streak >= 7) return 100;
        if (streak >= 5) return 75;
        if (streak >= 3) return 50;
        return 25;
    }
    
    getNextReward() {
        const streak = this.progress.streak;
        
        // Próximo bônus de streak
        if (streak < 3) return { at: 3, bonus: 50 };
        if (streak < 5) return { at: 5, bonus: 75 };
        if (streak < 7) return { at: 7, bonus: 100 };
        return { at: 'max', bonus: 100 }; // Mantém 100 após 7 dias
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('daily_challenge_progress_v2');
            if (saved) {
                const data = JSON.parse(saved);
                this.progress = {
                    completed: data.completed || 0,
                    totalScore: data.totalScore || 0,
                    streak: data.streak || 0,
                    longestStreak: data.longestStreak || 0,
                    daily: data.daily || {}
                };
                
                // Verificar e corrigir streak se necessário
                this.validateStreak();
            } else {
                this.progress = {
                    completed: 0,
                    totalScore: 0,
                    streak: 0,
                    longestStreak: 0,
                    daily: {}
                };
            }
        } catch (e) {
            console.warn('Não foi possível carregar progresso:', e);
            this.progress = {
                completed: 0,
                totalScore: 0,
                streak: 0,
                longestStreak: 0,
                daily: {}
            };
        }
    }
    
    validateStreak() {
        const lastPlayed = localStorage.getItem('daily_challenge_last_played');
        if (!lastPlayed) {
            this.progress.streak = 0;
            return;
        }
        
        const lastDate = new Date(lastPlayed);
        const today = new Date();
        
        // Normalizar para meia-noite
        lastDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffTime = today - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
            // Perdeu streak
            this.progress.streak = 0;
            this.saveProgress();
        }
    }
    
    saveProgress() {
        try {
            localStorage.setItem('daily_challenge_progress_v2', JSON.stringify(this.progress));
        } catch (e) {
            console.warn('Não foi possível salvar progresso:', e);
            // Tentar limpar espaço
            try {
                localStorage.removeItem('daily_challenge_progress_v2');
                this.saveProgress();
            } catch (e2) {
                console.error('Falha completa ao salvar progresso:', e2);
            }
        }
    }
    
    initializeDailyReset() {
        // Verificar se é um novo dia
        const lastReset = localStorage.getItem('daily_challenge_last_reset');
        const todayKey = this.getCurrentDateKey();
        
        if (lastReset !== todayKey) {
            // Novo dia, resetar contadores diários se necessário
            localStorage.setItem('daily_challenge_last_reset', todayKey);
        }
    }
    
    showDailyChallengeModal() {
        const challenge = this.getTodayChallenge();
        const playedToday = this.hasPlayedToday();
        const todayKey = this.getCurrentDateKey();
        const todayResult = this.progress.daily[todayKey];
        
        let html = `
            <h3>🌅 Desafio Diário</h3>
            
            <div class="daily-header">
                <div class="daily-date">${new Date().toLocaleDateString('pt-PT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</div>
                <div class="daily-streak">
                    <span class="streak-icon">🔥</span>
                    <span class="streak-value">${this.progress.streak} dias</span>
                    ${this.progress.streak > 0 ? `<span class="streak-bonus">+${this.getStreakBonus()} pts</span>` : ''}
                </div>
            </div>
            
            <div class="daily-challenge-card ${challenge.difficulty}">
                <div class="daily-theme">${challenge.theme}</div>
                <div class="daily-desc">${challenge.description}</div>
                
                <div class="daily-difficulty">
                    <span class="difficulty-label">Dificuldade:</span>
                    <span class="difficulty-value ${challenge.difficulty}">${this.getDifficultyName(challenge.difficulty)}</span>
                    <span class="time-limit">⏱️ ${Math.floor(challenge.timeLimit / 60)}:${String(challenge.timeLimit % 60).padStart(2, '0')}</span>
                </div>
                
                <div class="daily-letters">
                    <h4>Letras do Desafio:</h4>
                    <div class="letters-grid">
        `;
        
        challenge.letters.forEach(letter => {
            html += `<span class="daily-letter">${letter}</span>`;
        });
        
        html += `
                    </div>
                </div>
                
                <div class="daily-rewards">
                    <h4>🎁 Recompensas:</h4>
                    <div class="rewards-grid">
                        <div class="reward-item">
                            <span class="reward-icon">⭐</span>
                            <div class="reward-details">
                                <span class="reward-text">Pontuação Base</span>
                                <span class="reward-value">${challenge.reward} pontos</span>
                            </div>
                        </div>
                        <div class="reward-item">
                            <span class="reward-icon">🔥</span>
                            <div class="reward-details">
                                <span class="reward-text">Bônus de Streak</span>
                                <span class="reward-value">+${this.getStreakBonus()} pontos</span>
                            </div>
                        </div>
                        <div class="reward-item">
                            <span class="reward-icon">🏆</span>
                            <div class="reward-details">
                                <span class="reward-text">Total Potencial</span>
                                <span class="reward-value">${challenge.reward + this.getStreakBonus()} pontos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (playedToday && todayResult) {
            html += `
                <div class="daily-completed">
                    <h4>✅ Já completou hoje!</h4>
                    <div class="completion-stats">
                        <div class="completion-stat">
                            <span>Pontuação:</span>
                            <span class="stat-value">${todayResult.score}</span>
                        </div>
                        <div class="completion-stat">
                            <span>Estrelas:</span>
                            <span class="stat-value stars">${'★'.repeat(todayResult.stars)}${'☆'.repeat(3 - todayResult.stars)}</span>
                        </div>
                        <div class="completion-stat">
                            <span>Tempo:</span>
                            <span class="stat-value">${todayResult.time}s</span>
                        </div>
                        <div class="completion-stat">
                            <span>Recompensa:</span>
                            <span class="stat-value">${todayResult.reward + (todayResult.streakBonus || 0)} pts</span>
                        </div>
                    </div>
                    <div class="completion-message">
                        Volte amanhã para um novo desafio!
                    </div>
                </div>
            `;
        }
        
        html += `
            <div class="daily-stats">
                <h4>📊 Estatísticas do Desafio</h4>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${this.progress.completed}</div>
                        <div class="stat-label">Desafios Completos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.progress.longestStreak}</div>
                        <div class="stat-label">Maior Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.progress.totalScore}</div>
                        <div class="stat-label">Pontos Totais</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Object.keys(this.progress.daily).length}</div>
                        <div class="stat-label">Dias Ativos</div>
                    </div>
                </div>
                
                <div class="streak-progress">
                    <h5>Próximo Bônus de Streak:</h5>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, (this.progress.streak / 7) * 100)}%"></div>
                    </div>
                    <div class="progress-text">
                        ${this.progress.streak < 7 ? 
                            `${this.progress.streak}/7 dias (bônus de +${this.getNextReward().bonus} pts em ${this.getNextReward().at - this.progress.streak} dias)` : 
                            'Streak máxima alcançada! +100 pts/dia'}
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
        `;
        
        if (playedToday) {
            html += '<button class="btn" onclick="window.modalManager.hideAll()">Fechar</button>';
        } else {
            html += `
                <button class="btn primary" onclick="game.startDailyChallenge()">🎮 Iniciar Desafio</button>
                <button class="btn" onclick="window.modalManager.hideAll()">Cancelar</button>
            `;
        }
        
        html += `</div>`;
        
        if (window.modalManager) {
            window.modalManager.show('game-modal', html);
        } else if (window.game && window.game.showModal) {
            window.game.showModal('daily-challenge', html);
        }
    }
    
    getDifficultyName(level) {
        const names = {
            'easy': 'Fácil',
            'medium': 'Médio',
            'hard': 'Difícil',
            'expert': 'Expert'
        };
        return names[level] || level;
    }
}

// Instância global
window.dailyChallenge = new DailyChallenge();