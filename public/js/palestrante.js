// MÓDULO PALESTRANTE - INTEGRA
class PalestranteApp {
    constructor() {
        this.palestras = [];
        this.empresas = [];
        this.inscricoes = [];
        this.init();
    }

    init() {
        this.carregarDados();
        this.setupEventListeners();
        this.renderizarConteudo();
    }

    // Dados mockados - substituir por API real depois
    carregarDados() {
        this.palestras = [
            {
                id: 1,
                titulo: "Inteligência Artificial: Tendências e Aplicações",
                empresa: "TechSolutions",
                data: new Date(2025, 5, 15),
                horario: "19:00 - 21:00",
                local: "Online",
                descricao: "Palestra sobre as tendências e aplicações da Inteligência Artificial no mercado atual.",
                vagas: 50,
                vagasDisponiveis: 35,
                setor: "Tecnologia"
            },
            {
                id: 2,
                titulo: "Design Thinking para Desenvolvedores",
                empresa: "Inovação Digital",
                data: new Date(2025, 5, 22),
                horario: "18:00 - 20:00",
                local: "São Paulo, SP",
                descricao: "Como aplicar o Design Thinking no desenvolvimento de software para criar produtos mais centrados no usuário.",
                vagas: 30,
                vagasDisponiveis: 15,
                setor: "Design"
            },
            {
                id: 3,
                titulo: "Carreira em Desenvolvimento Web",
                empresa: "WebDev Solutions",
                data: new Date(2025, 6, 5),
                horario: "19:00 - 21:00",
                local: "Online",
                descricao: "Dicas e estratégias para construir uma carreira sólida em desenvolvimento web.",
                vagas: 100,
                vagasDisponiveis: 78,
                setor: "Tecnologia"
            }
        ];

        this.empresas = [
            {
                id: 1,
                nome: "TechSolutions",
                setor: "Tecnologia",
                descricao: "Empresa líder em soluções tecnológicas para o mercado corporativo.",
                endereco: "São Paulo, SP",
                site: "www.techsolutions.com",
                contato: "contato@techsolutions.com",
                telefone: "(11) 9999-8888",
                vagasPalestrantes: true
            },
            {
                id: 2,
                nome: "Inovação Digital",
                setor: "Marketing Digital",
                descricao: "Agência especializada em marketing digital e transformação digital para empresas.",
                endereco: "São Paulo, SP",
                site: "www.inovacaodigital.com",
                contato: "contato@inovacaodigital.com",
                telefone: "(11) 9999-7777",
                vagasPalestrantes: true
            },
            {
                id: 3,
                nome: "Construtech",
                setor: "Construção Civil",
                descricao: "Empresa de tecnologia para o setor de construção civil.",
                endereco: "São Paulo, SP",
                site: "www.construtech.com",
                contato: "contato@construtech.com",
                telefone: "(11) 9999-6666",
                vagasPalestrantes: false
            }
        ];

        this.inscricoes = [
            {
                id: 1,
                palestraId: 1,
                tipo: "palestra",
                titulo: "Inteligência Artificial: Tendências e Aplicações",
                empresa: "TechSolutions",
                data: new Date(2025, 5, 15),
                horario: "19:00 - 21:00",
                local: "Online",
                status: "confirmado",
                dataInscricao: new Date(2025, 4, 10)
            },
            {
                id: 2,
                empresaId: 2,
                tipo: "empresa",
                empresa: "Inovação Digital",
                status: "pendente",
                dataInscricao: new Date(2025, 4, 12)
            }
        ];
    }

    setupEventListeners() {
        // Busca de palestras
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filtrarPalestras(e.target.value);
            });
        }

        // Busca de empresas
        const searchEmpresas = document.getElementById('searchEmpresas');
        if (searchEmpresas) {
            searchEmpresas.addEventListener('input', (e) => {
                this.filtrarEmpresas(e.target.value);
            });
        }

        // Modais
        this.setupModais();
        
        // Tabs
        this.setupTabs();
    }

    setupModais() {
        // Modal de inscrição em palestra
        const inscricaoModal = document.getElementById('inscricaoModal');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');

        if (closeModal) closeModal.addEventListener('click', () => this.fecharModal('inscricaoModal'));
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.fecharModal('inscricaoModal'));

        const confirmInscricao = document.getElementById('confirmInscricao');
        if (confirmInscricao) {
            confirmInscricao.addEventListener('click', () => this.confirmarInscricao());
        }

        // Modal de candidatura em empresa
        const candidaturaModal = document.getElementById('candidaturaModal');
        const closeCandidaturaModal = document.getElementById('closeCandidaturaModal');
        const cancelCandidatura = document.getElementById('cancelCandidatura');

        if (closeCandidaturaModal) closeCandidaturaModal.addEventListener('click', () => this.fecharModal('candidaturaModal'));
        if (cancelCandidatura) cancelCandidatura.addEventListener('click', () => this.fecharModal('candidaturaModal'));

        const confirmCandidatura = document.getElementById('confirmCandidatura');
        if (confirmCandidatura) {
            confirmCandidatura.addEventListener('click', () => this.confirmarCandidatura());
        }

        // Fechar modal ao clicar fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.ativarTab(tabId);
            });
        });
    }

    ativarTab(tabId) {
        // Desativar todas as tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Ativar tab selecionada
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');

        // Renderizar conteúdo específico da tab
        this.renderizarTabContent(tabId);
    }

    renderizarConteudo() {
        this.renderizarPalestras();
        this.renderizarEmpresas();
        this.renderizarInscricoes();
    }

    renderizarPalestras() {
        const container = document.getElementById('palestrasGrid');
        if (!container) return;

        if (this.palestras.length === 0) {
            container.innerHTML = this.criarEmptyState('Nenhuma palestra disponível no momento.');
            return;
        }

        container.innerHTML = this.palestras.map(palestra => `
            <div class="palestra-card" data-id="${palestra.id}">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${palestra.titulo}</h3>
                        <p class="card-company">${palestra.empresa}</p>
                    </div>
                    <span class="card-badge badge-secondary">${palestra.setor}</span>
                </div>
                <p class="card-description">${palestra.descricao}</p>
                <div class="card-details">
                    <div class="card-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatarData(palestra.data)}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-clock"></i>
                        <span>${palestra.horario}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${palestra.local}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-users"></i>
                        <span>${palestra.vagasDisponiveis} vagas de ${palestra.vagas}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" onclick="app.inscreverPalestra(${palestra.id})">
                        <i class="fas fa-user-plus"></i>
                        Inscrever-se
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderizarEmpresas() {
        const container = document.getElementById('empresasGrid');
        if (!container) return;

        if (this.empresas.length === 0) {
            container.innerHTML = this.criarEmptyState('Nenhuma empresa parceira no momento.');
            return;
        }

        container.innerHTML = this.empresas.map(empresa => `
            <div class="empresa-card" data-id="${empresa.id}">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${empresa.nome}</h3>
                        <p class="card-company">${empresa.setor}</p>
                    </div>
                    ${empresa.vagasPalestrantes ? 
                        '<span class="card-badge badge-success">Contratando</span>' : 
                        '<span class="card-badge badge-secondary">Sem vagas</span>'
                    }
                </div>
                <p class="card-description">${empresa.descricao}</p>
                <div class="card-details">
                    <div class="card-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${empresa.endereco}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-globe"></i>
                        <span>${empresa.site}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-envelope"></i>
                        <span>${empresa.contato}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-phone"></i>
                        <span>${empresa.telefone}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" 
                            onclick="app.candidatarEmpresa(${empresa.id})"
                            ${!empresa.vagasPalestrantes ? 'disabled' : ''}>
                        <i class="fas fa-briefcase"></i>
                        ${empresa.vagasPalestrantes ? 'Candidatar-se' : 'Sem Vagas'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderizarInscricoes() {
        this.renderizarInscricoesConfirmadas();
        this.renderizarInscricoesPendentes();
        this.renderizarHistorico();
    }

    renderizarInscricoesConfirmadas() {
        const container = document.getElementById('inscricoesConfirmadas');
        if (!container) return;

        const confirmadas = this.inscricoes.filter(insc => insc.status === 'confirmado');
        
        if (confirmadas.length === 0) {
            container.innerHTML = this.criarEmptyState('Nenhuma inscrição confirmada.');
            return;
        }

        container.innerHTML = confirmadas.map(inscricao => `
            <div class="inscricao-card">
                <div class="card-header">
                    <h3 class="card-title">${inscricao.titulo || inscricao.empresa}</h3>
                    <span class="card-badge badge-success">Confirmada</span>
                </div>
                <div class="card-details">
                    ${inscricao.tipo === 'palestra' ? `
                        <div class="card-detail">
                            <i class="fas fa-building"></i>
                            <span>${inscricao.empresa}</span>
                        </div>
                        <div class="card-detail">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatarData(inscricao.data)} • ${inscricao.horario}</span>
                        </div>
                        <div class="card-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${inscricao.local}</span>
                        </div>
                    ` : `
                        <div class="card-detail">
                            <i class="fas fa-briefcase"></i>
                            <span>Candidatura para ${inscricao.empresa}</span>
                        </div>
                    `}
                    <div class="card-detail">
                        <i class="fas fa-clock"></i>
                        <span>Inscrito em: ${this.formatarData(inscricao.dataInscricao)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderizarInscricoesPendentes() {
        const container = document.getElementById('inscricoesPendentes');
        if (!container) return;

        const pendentes = this.inscricoes.filter(insc => insc.status === 'pendente');
        
        if (pendentes.length === 0) {
            container.innerHTML = this.criarEmptyState('Nenhuma inscrição pendente.');
            return;
        }

        container.innerHTML = pendentes.map(inscricao => `
            <div class="inscricao-card">
                <div class="card-header">
                    <h3 class="card-title">${inscricao.titulo || inscricao.empresa}</h3>
                    <span class="card-badge badge-warning">Pendente</span>
                </div>
                <div class="card-details">
                    <div class="card-detail">
                        <i class="fas fa-briefcase"></i>
                        <span>Candidatura para ${inscricao.empresa}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-clock"></i>
                        <span>Enviado em: ${this.formatarData(inscricao.dataInscricao)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderizarHistorico() {
        const container = document.getElementById('inscricoesHistorico');
        if (!container) return;

        container.innerHTML = this.criarEmptyState('Histórico de participações em desenvolvimento.');
    }

    renderizarTabContent(tabId) {
        switch(tabId) {
            case 'confirmadas':
                this.renderizarInscricoesConfirmadas();
                break;
            case 'pendentes':
                this.renderizarInscricoesPendentes();
                break;
            case 'historico':
                this.renderizarHistorico();
                break;
        }
    }

    // Métodos de interação
    inscreverPalestra(palestraId) {
        const palestra = this.palestras.find(p => p.id === palestraId);
        if (!palestra) return;

        // Abrir modal de inscrição
        const modal = document.getElementById('inscricaoModal');
        const infoContainer = document.getElementById('modalPalestraInfo');

        infoContainer.innerHTML = `
            <div class="palestra-info">
                <h4>${palestra.titulo}</h4>
                <p><strong>Empresa:</strong> ${palestra.empresa}</p>
                <p><strong>Data:</strong> ${this.formatarData(palestra.data)} • ${palestra.horario}</p>
                <p><strong>Local:</strong> ${palestra.local}</p>
            </div>
        `;

        modal.classList.add('active');
        modal.setAttribute('data-palestra-id', palestraId);
    }

    candidatarEmpresa(empresaId) {
        const empresa = this.empresas.find(e => e.id === empresaId);
        if (!empresa || !empresa.vagasPalestrantes) return;

        const modal = document.getElementById('candidaturaModal');
        const infoContainer = document.getElementById('modalEmpresaInfo');

        infoContainer.innerHTML = `
            <div class="empresa-info">
                <h4>${empresa.nome}</h4>
                <p><strong>Setor:</strong> ${empresa.setor}</p>
                <p><strong>Localização:</strong> ${empresa.endereco}</p>
            </div>
        `;

        modal.classList.add('active');
        modal.setAttribute('data-empresa-id', empresaId);
    }

    confirmarInscricao() {
        const modal = document.getElementById('inscricaoModal');
        const palestraId = parseInt(modal.getAttribute('data-palestra-id'));
        const observacoes = document.getElementById('observacoes').value;

        const palestra = this.palestras.find(p => p.id === palestraId);
        if (!palestra) return;

        // Simular inscrição
        const novaInscricao = {
            id: Date.now(),
            palestraId: palestraId,
            tipo: "palestra",
            titulo: palestra.titulo,
            empresa: palestra.empresa,
            data: palestra.data,
            horario: palestra.horario,
            local: palestra.local,
            status: "confirmado",
            dataInscricao: new Date(),
            observacoes: observacoes
        };

        this.inscricoes.push(novaInscricao);
        
        // Atualizar vagas
        palestra.vagasDisponiveis--;

        this.fecharModal('inscricaoModal');
        this.mostrarNotificacao('Inscrição confirmada com sucesso!', 'success');
        this.renderizarConteudo();
    }

    confirmarCandidatura() {
        const modal = document.getElementById('candidaturaModal');
        const empresaId = parseInt(modal.getAttribute('data-empresa-id'));
        const cartaMotivacao = document.getElementById('cartaMotivacao').value;
        const experiencia = document.getElementById('experiencia').value;
        const disponibilidade = document.getElementById('disponibilidade').value;

        if (!cartaMotivacao || !experiencia || !disponibilidade) {
            this.mostrarNotificacao('Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        const empresa = this.empresas.find(e => e.id === empresaId);
        if (!empresa) return;

        // Simular candidatura
        const novaCandidatura = {
            id: Date.now(),
            empresaId: empresaId,
            tipo: "empresa",
            empresa: empresa.nome,
            status: "pendente",
            dataInscricao: new Date(),
            cartaMotivacao: cartaMotivacao,
            experiencia: experiencia,
            disponibilidade: disponibilidade
        };

        this.inscricoes.push(novaCandidatura);

        this.fecharModal('candidaturaModal');
        this.mostrarNotificacao('Candidatura enviada com sucesso!', 'success');
        this.renderizarConteudo();
    }

    // Métodos utilitários
    filtrarPalestras(termo) {
        const palestrasFiltradas = this.palestras.filter(palestra => 
            palestra.titulo.toLowerCase().includes(termo.toLowerCase()) ||
            palestra.empresa.toLowerCase().includes(termo.toLowerCase()) ||
            palestra.descricao.toLowerCase().includes(termo.toLowerCase()) ||
            palestra.setor.toLowerCase().includes(termo.toLowerCase())
        );

        const container = document.getElementById('palestrasGrid');
        if (!container) return;

        if (palestrasFiltradas.length === 0) {
            container.innerHTML = this.criarEmptyState('Nenhuma palestra encontrada com esse termo.');
            return;
        }

        // Re-renderizar apenas as palestras filtradas
        container.innerHTML = palestrasFiltradas.map(palestra => `
            <div class="palestra-card" data-id="${palestra.id}">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${palestra.titulo}</h3>
                        <p class="card-company">${palestra.empresa}</p>
                    </div>
                    <span class="card-badge badge-secondary">${palestra.setor}</span>
                </div>
                <p class="card-description">${palestra.descricao}</p>
                <div class="card-details">
                    <div class="card-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatarData(palestra.data)}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-clock"></i>
                        <span>${palestra.horario}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${palestra.local}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-users"></i>
                        <span>${palestra.vagasDisponiveis} vagas de ${palestra.vagas}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" onclick="app.inscreverPalestra(${palestra.id})">
                        <i class="fas fa-user-plus"></i>
                        Inscrever-se
                    </button>
                </div>
            </div>
        `).join('');
    }

    filtrarEmpresas(termo) {
        const empresasFiltradas = this.empresas.filter(empresa => 
            empresa.nome.toLowerCase().includes(termo.toLowerCase()) ||
            empresa.setor.toLowerCase().includes(termo.toLowerCase()) ||
            empresa.descricao.toLowerCase().includes(termo.toLowerCase())
        );

        const container = document.getElementById('empresasGrid');
        if (!container) return;

        if (empresasFiltradas.length === 0) {
            container.innerHTML = this.criarEmptyState('Nenhuma empresa encontrada com esse termo.');
            return;
        }

        container.innerHTML = empresasFiltradas.map(empresa => `
            <div class="empresa-card" data-id="${empresa.id}">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${empresa.nome}</h3>
                        <p class="card-company">${empresa.setor}</p>
                    </div>
                    ${empresa.vagasPalestrantes ? 
                        '<span class="card-badge badge-success">Contratando</span>' : 
                        '<span class="card-badge badge-secondary">Sem vagas</span>'
                    }
                </div>
                <p class="card-description">${empresa.descricao}</p>
                <div class="card-details">
                    <div class="card-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${empresa.endereco}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-globe"></i>
                        <span>${empresa.site}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-envelope"></i>
                        <span>${empresa.contato}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-phone"></i>
                        <span>${empresa.telefone}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" 
                            onclick="app.candidatarEmpresa(${empresa.id})"
                            ${!empresa.vagasPalestrantes ? 'disabled' : ''}>
                        <i class="fas fa-briefcase"></i>
                        ${empresa.vagasPalestrantes ? 'Candidatar-se' : 'Sem Vagas'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            
            // Limpar formulários
            const forms = modal.querySelectorAll('input, textarea');
            forms.forEach(form => form.value = '');
        }
    }

    formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    criarEmptyState(mensagem) {
        return `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>${mensagem}</h3>
                <p>Tente novamente mais tarde ou entre em contato com o suporte.</p>
            </div>
        `;
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        // Criar notificação simples
        alert(mensagem); // Substituir por sistema de notificação mais elaborado
        
        // Em produção, implementar um sistema de toast notifications
        console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
    }
}

// Inicializar aplicação
const app = new PalestranteApp();

// Exportar para uso global (se necessário)
window.app = app;