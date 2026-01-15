// achievements.js - VERSÃO CORRIGIDA
class AchievementSystem {
    constructor() {
        this.achievements = {
            'first_blood': {
                id: 'first_blood',
                name: 'Primeiro Sangue',
                description: 'Completar o primeiro jogo',
                icon: '🩸',
                unlocked: false,
                date: null,
                points: 100
            },
            'perfectionist': {
                id: 'perfectionist',
                name: 'Perfeccionista',
                description: 'Acertar 10 questões seguidas',
                icon: '⭐',
                unlocked: false,
                date: null,
                points: 250
            },
            'speed_demon': {
                id: 'speed_demon',
                name: 'Demônio da Velocidade',
                description: 'Completar 25 questões em menos de 2 minutos',
                icon: '⚡',
                unlocked: false,
                date: null,
                points: 300
            },
            'kabbalist_master': {
                id: 'kabbalist_master',
                name: 'Mestre Cabalista',
                description: 'Pontuação acima de 1000',
                icon: '👁️',
                unlocked: false,
                date: null,
                points: 500
            },
            'flawless': {
                id: 'flawless',
                name: 'Impecável',
                description: 'Completar um jogo sem erros',
                icon: '✨',
                unlocked: false,
                date: null,
                points: 400
            },
            'explorer': {
                id: 'explorer',
                name: 'Explorador',
                description: 'Descobrir todas as Sefirot',
                icon: '🧭',
                unlocked: false,
                date: null,
                points: 200
            },
            'helper': {
                id: 'helper',
                name: 'Ajudante',
                description: 'Usar ajuda 10 vezes',
                icon: '🆘',
                unlocked: false,
                date: null,
                points: 150
            },
            'persistent': {
                id: 'persistent',
                name: 'Persistente',
                description: 'Completar 10 jogos',
                icon: '🏆',
                unlocked: false,
                date: null,
                points: 350
            },
            'streak_master': {
                id: 'streak_master',
                name: 'Mestre da Sequência',
                description: 'Alcançar streak de 15 acertos',
                icon: '🔥',
                unlocked: false,
                date: null,
                points: 200
            },
            'quick_learner': {
                id: 'quick_learner',
                name: 'Aprendiz Rápido',
                description: 'Completar 5 jogos em um dia',
                icon: '🚀',
                unlocked: false,
                date: null,
                points: 180
            }
        };
        
        this.stats = {
            gamesCompleted: 0,
            totalScore: 0,
            totalCorrect: 0,
            totalErrors: 0,
            totalHelpUsed: 0,
            bestStreak: 0,
            totalTimePlayed: 0,
            fastestGame: null,
            sefirotDiscovered: new Set(),
            lastPlayDate: null,
            gamesToday: 0
        };
        
        this.load();
    }
    
    load() {
        try {
            const saved = localStorage.getItem('kabbalah_achievements_v2');
            if (saved) {
                const data = JSON.parse(saved);
                this.achievements = data.achievements || this.achievements;
                this.stats = { ...this.stats, ...data.stats };
                
                // Converter array para Set se necessário
                if (Array.isArray(this.stats.sefirotDiscovered)) {
                    this.stats.sefirotDiscovered = new Set(this.stats.sefirotDiscovered);
                }
            }
        } catch (e) {
            console.warn('Não foi possível carregar conquistas:', e);
            this.resetCorruptedData();
        }
    }
    
    resetCorruptedData() {
        // Reset apenas os dados corrompidos, mantendo conquistas desbloqueadas
        const unlockedAchievements = {};
        Object.values(this.achievements).forEach(ach => {
            if (ach.unlocked) unlockedAchievements[ach.id] = ach;
        });
        
        // Manter stats básicos mas resetar collections
        this.stats = {
            ...this.stats,
            sefirotDiscovered: new Set(),
            gamesToday: 0
        };
    }
    
    save() {
        try {
            // Converter Set para array para serialização
            const saveData = {
                achievements: this.achievements,
                stats: {
                    ...this.stats,
                    sefirotDiscovered: Array.from(this.stats.sefirotDiscovered)
                }
            };
            
            localStorage.setItem('kabbalah_achievements_v2', JSON.stringify(saveData));
        } catch (e) {
            console.warn('Não foi possível salvar conquistas:', e);
            // Tentar limpar espaço se estiver cheio
            try {
                localStorage.removeItem('kabbalah_achievements_v2');
                this.save();
            } catch (e2) {
                console.error('Falha completa ao salvar:', e2);
            }
        }
    }
    
    updateStats(gameData) {
        this.stats.gamesCompleted++;
        this.stats.totalScore += gameData.score;
        this.stats.totalCorrect += (gameData.totalQuestions - gameData.errors);
        this.stats.totalErrors += gameData.errors;
        this.stats.totalTimePlayed += gameData.time;
        this.stats.bestStreak = Math.max(this.stats.bestStreak, gameData.streak || 0);
        
        // Atualizar data do último jogo
        const today = new Date().toDateString();
        if (this.stats.lastPlayDate !== today) {
            this.stats.lastPlayDate = today;
            this.stats.gamesToday = 1;
        } else {
            this.stats.gamesToday++;
        }
        
        if (!this.stats.fastestGame || gameData.time < this.stats.fastestGame) {
            this.stats.fastestGame = gameData.time;
        }
        
        // Adicionar Sefirot descobertas
        if (gameData.discoveredSefirot) {
            gameData.discoveredSefirot.forEach(sefirah => {
                this.stats.sefirotDiscovered.add(sefirah);
            });
        }
        
        this.checkAchievements(gameData);
        this.save();
    }
    
    checkAchievements(gameData) {
        const unlocked = [];
        
        // Primeiro jogo
        if (this.stats.gamesCompleted === 1 && !this.achievements.first_blood.unlocked) {
            this.unlock('first_blood');
            unlocked.push('first_blood');
        }
        
        // Pontuação alta
        if (gameData.score >= 1000 && !this.achievements.kabbalist_master.unlocked) {
            this.unlock('kabbalist_master');
            unlocked.push('kabbalist_master');
        }
        
        // Sem erros
        if (gameData.errors === 0 && !this.achievements.flawless.unlocked) {
            this.unlock('flawless');
            unlocked.push('flawless');
        }
        
        // Jogos completos
        if (this.stats.gamesCompleted >= 10 && !this.achievements.persistent.unlocked) {
            this.unlock('persistent');
            unlocked.push('persistent');
        }
        
        // Velocidade (25 questões em < 2 minutos)
        if (gameData.totalQuestions >= 25 && gameData.time < 120 && !this.achievements.speed_demon.unlocked) {
            this.unlock('speed_demon');
            unlocked.push('speed_demon');
        }
        
        // Streak alto
        if (gameData.streak >= 10 && !this.achievements.perfectionist.unlocked) {
            this.unlock('perfectionist');
            unlocked.push('perfectionist');
        }
        
        if (gameData.streak >= 15 && !this.achievements.streak_master.unlocked) {
            this.unlock('streak_master');
            unlocked.push('streak_master');
        }
        
        // Aprendiz rápido (5 jogos em um dia)
        if (this.stats.gamesToday >= 5 && !this.achievements.quick_learner.unlocked) {
            this.unlock('quick_learner');
            unlocked.push('quick_learner');
        }
        
        // Explorador (todas Sefirot)
        if (this.stats.sefirotDiscovered.size >= 10 && !this.achievements.explorer.unlocked) {
            this.unlock('explorer');
            unlocked.push('explorer');
        }
        
        return unlocked;
    }
    
    recordHelpUsage() {
        this.stats.totalHelpUsed++;
        if (this.stats.totalHelpUsed >= 10 && !this.achievements.helper.unlocked) {
            this.unlock('helper');
        }
        this.save();
    }
    
    unlock(achievementId) {
        if (this.achievements[achievementId] && !this.achievements[achievementId].unlocked) {
            this.achievements[achievementId].unlocked = true;
            this.achievements[achievementId].date = new Date().toISOString();
            this.showNotification(achievementId);
            return true;
        }
        return false;
    }
    
    showNotification(achievementId) {
        const achievement = this.achievements[achievementId];
        
        // Verificar se já existe uma notificação
        const existing = document.querySelector('.achievement-notification');
        if (existing) existing.remove();
        
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">🏆 Conquista Desbloqueada!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
                <div class="achievement-points">+${achievement.points} pontos</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animação
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Tocar som
        if (window.audioSystem) {
            window.audioSystem.play('achievement');
        }
        
        // Remover após 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }, 5000);
    }
    
    getUnlockedCount() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }
    
    getTotalPoints() {
        return Object.values(this.achievements)
            .filter(a => a.unlocked)
            .reduce((sum, a) => sum + a.points, 0);
    }
    
    showAchievementsModal() {
        const unlockedCount = this.getUnlockedCount();
        const totalCount = Object.keys(this.achievements).length;
        const percentage = Math.round((unlockedCount / totalCount) * 100);
        
        let html = `
            <h3>🏆 Conquistas</h3>
            <div class="achievements-header">
                <div class="achievements-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="progress-text">${unlockedCount}/${totalCount} (${percentage}%)</div>
                </div>
                <div class="achievements-points">
                    <span class="points-icon">✨</span>
                    <span class="points-value">${this.getTotalPoints()} pontos</span>
                </div>
            </div>
            
            <div class="achievements-grid">
        `;
        
        Object.values(this.achievements).forEach(achievement => {
            html += `
                <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-card-icon">${achievement.icon}</div>
                    <div class="achievement-card-content">
                        <div class="achievement-card-title">${achievement.name}</div>
                        <div class="achievement-card-desc">${achievement.description}</div>
                        <div class="achievement-card-meta">
                            <span class="achievement-card-points">${achievement.points} pts</span>
                            ${achievement.unlocked ? 
                                `<span class="achievement-card-date">${new Date(achievement.date).toLocaleDateString('pt-PT')}</span>` :
                                `<span class="achievement-card-locked">🔒 Bloqueada</span>`
                            }
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
            </div>
            
            <div class="achievements-stats">
                <h4>📊 Estatísticas Detalhadas</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Jogos Completos</span>
                        <span class="stat-value">${this.stats.gamesCompleted}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Pontuação Total</span>
                        <span class="stat-value">${this.stats.totalScore}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Acertos Totais</span>
                        <span class="stat-value">${this.stats.totalCorrect}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Erros Totais</span>
                        <span class="stat-value">${this.stats.totalErrors}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tempo Total</span>
                        <span class="stat-value">${Math.floor(this.stats.totalTimePlayed / 60)}min</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Melhor Tempo</span>
                        <span class="stat-value">${this.stats.fastestGame ? Math.floor(this.stats.fastestGame) + 's' : 'N/A'}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Melhor Streak</span>
                        <span class="stat-value">${this.stats.bestStreak}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Sefirot Descobertas</span>
                        <span class="stat-value">${this.stats.sefirotDiscovered.size}/10</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn" onclick="window.modalManager.hideAll()">Fechar</button>
            </div>
        `;
        
        // Usar sistema centralizado de modais
        if (window.modalManager) {
            window.modalManager.show('game-modal', html);
        } else {
            // Fallback
            if (window.game && window.game.showModal) {
                window.game.showModal('achievements', html);
            }
        }
    }
}

// Instância global
window.achievementSystem = new AchievementSystem();