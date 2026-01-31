// ========== DADOS INICIAIS DOS TRABALHADORES ==========
window.defaultWorkers = [
  {
    id: 'worker_001',
    name: 'João Fernandes',
    code: 'F001',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'manha',
    active: true,
    createdAt: '2024-01-01',
    skills: ['carpintaria', 'montagem']
  },
  {
    id: 'worker_002',
    name: 'Maria Santos',
    code: 'F002',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'manha',
    active: true,
    createdAt: '2024-01-01',
    skills: ['pintura', 'acabamentos']
  },
  {
    id: 'worker_003',
    name: 'Carlos Mendes',
    code: 'F003',
    position: 'mestre',
    hourlyRate: 15.00,
    turn: 'manha',
    active: true,
    createdAt: '2024-01-01',
    skills: ['supervisao', 'qualidade']
  },
  {
    id: 'worker_004',
    name: 'Ana Rodrigues',
    code: 'F004',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'tarde',
    active: true,
    createdAt: '2024-01-01',
    skills: ['cortes', 'preparacao']
  },
  {
    id: 'worker_005',
    name: 'Pedro Alves',
    code: 'F005',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'tarde',
    active: true,
    createdAt: '2024-01-01',
    skills: ['montagem', 'embalagem']
  },
  {
    id: 'worker_006',
    name: 'Sofia Costa',
    code: 'F006',
    position: 'supervisor',
    hourlyRate: 18.00,
    turn: 'manha',
    active: true,
    createdAt: '2024-01-01',
    skills: ['gestao', 'planeamento']
  },
  {
    id: 'worker_007',
    name: 'Miguel Pereira',
    code: 'F007',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'noite',
    active: true,
    createdAt: '2024-01-01',
    skills: ['manutencao', 'reparos']
  },
  {
    id: 'worker_008',
    name: 'Inês Martins',
    code: 'F008',
    position: 'auxiliar',
    hourlyRate: 10.50,
    turn: 'manha',
    active: true,
    createdAt: '2024-01-01',
    skills: ['limpeza', 'organizacao']
  },
  {
    id: 'worker_009',
    name: 'Rui Sousa',
    code: 'F009',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'tarde',
    active: true,
    createdAt: '2024-01-01',
    skills: ['soldadura', 'metal']
  },
  {
    id: 'worker_010',
    name: 'Beatriz Ferreira',
    code: 'F010',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'manha',
    active: true,
    createdAt: '2024-01-01',
    skills: ['costura', 'estofos']
  },
  {
    id: 'worker_011',
    name: 'Hugo Gomes',
    code: 'F011',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'tarde',
    active: false,
    createdAt: '2024-01-01',
    skills: ['carpintaria'],
    inactiveReason: 'licenca'
  },
  {
    id: 'worker_012',
    name: 'Laura Monteiro',
    code: 'F012',
    position: 'operario',
    hourlyRate: 12.50,
    turn: 'manha',
    active: true,
    createdAt: '2024-01-01',
    skills: ['qualidade', 'inspecao']
  }
];

console.log(`👥 ${window.defaultWorkers.length} trabalhadores padrão carregados`);