import { useTranslation } from "react-i18next";

/**
 * Textos do microsite IdP BAITA.
 *
 * Ficam aqui, e não nos JSON de locale, porque a página é feita de listas
 * estruturadas (etapas, perguntas do diagnóstico, linhas de tabela) que o
 * componente percorre. Um objeto tipado mantém PT e EN com o mesmo formato:
 * o `en` precisa satisfazer o tipo derivado do `pt`.
 */

const pt = {
  meta: { title: "IdP BAITA" },
  /** Nome do produto: "IdP BAITA" em português, "BAITA IdP" em inglês. */
  brand: "IdP BAITA",
  hero: {
    title: "Um login para tudo na instituição. E acesso à CAFe incluso.",
    lead: "Login unificado gerenciado pelo BAITA e integrado à CAFe. Sem hospedagem local, sem Shibboleth e sem complicação.",
    primary: "Quero saber mais",
    secondary: "Conheça a solução",
    vizLabel:
      "Sistemas da instituição e serviços da CAFe convergindo em um único login institucional",
    // Mesma ordem de LABEL_NODES em hero-section.tsx.
    nodes: [
      "Sistema acadêmico",
      "Ambiente Virtual de Aprendizagem",
      "Biblioteca universitária",
      "Portal do servidor",
      "Serviços federados",
    ],
    center: "IdP BAITA",
  },
  problem: {
    kicker: "Problema",
    statement: "Base de usuários desorganizada, sistemas de login desconexos e trabalho duplicado.",
    body: [
      "Sem identidade institucional, cada serviço guarda seus próprios usuários e senhas.",
      "Com um IdP gerenciado pelo BAITA, a instituição passa a ter uma identidade única: um login para todos os sistemas e acesso aberto à CAFe.",
    ],
    vizLabel:
      "Antes, cada sistema com sua própria base de usuários; com o IdP BAITA, uma base unificada passa pelo IdP e chega a todos os sistemas",
    services: ["Sistema acadêmico", "Ambiente Virtual de Aprendizagem", "Biblioteca universitária", "Acesso à CAFe"],
    idp: "IdP BAITA",
    before: "Antes",
    after: "Com o IdP BAITA",
  },
  start: {
    kicker: "Qualquer ponto de partida",
    title:
      "Diretório estruturado ou planilha de Excel: para cada ponto de partida, o BAITA sabe o caminho.",
    sheet: {
      kicker: "Ponto de partida A",
      title: "Planilha",
      file: "usuarios.xlsx",
      head: ["nome", "vínculo", "e-mail"],
      rows: [
        ["Ana Souza", "aluna", "ana@…"],
        ["Bruno Lima", "servidor", "bruno@…"],
        ["Carla Reis", "docente", "vazio"],
        ["Ana Souza", "aluna", "ana.s@…"],
      ],
      foot: "Estruturação da base: duplicidades e lacunas tratadas antes do IdP.",
    },
    db: {
      kicker: "Ponto de partida B",
      title: "Banco de dados",
      file: "schema · pessoas",
      table: "pessoas",
      fields: [
        ["id", "int"],
        ["nome", "text"],
        ["vinculo", "text"],
        ["email", "text"],
        ["ativo", "bool"],
      ],
      foot: "Mapeamento de campos para os atributos usados na CAFe.",
    },
    dir: {
      kicker: "Ponto de partida C",
      title: "Diretório",
      file: "dc=[instituicao],dc=edu,dc=br",
      ous: ["alunos", "docentes", "servidores", "terceirizados"],
      foot: "Conexão direta do diretório ao IdP BAITA.",
    },
    less: "menos estruturado",
    more: "mais estruturado",
    dest: "Todos os caminhos chegam ao mesmo destino: um IdP federado à CAFe.",
  },
  how: {
    kicker: "Como funciona",
    title: "Fases da implantação",
    url: "baita · implantação",
    steps: [
      {
        t: "Diagnóstico",
        d: "Levantamento de onde estão os usuários, quais sistemas pedem login e quais vínculos existem na instituição.",
        tags: ["Origem dos dados", "Sistemas", "Vínculos"],
      },
      {
        t: "Preparação",
        d: "A base é organizada e os campos são mapeados para os atributos usados na CAFe.",
        tags: ["Limpeza da base", "Mapeamento de atributos"],
      },
      {
        t: "Configuração",
        d: "O BAITA provisiona o IdP na própria infraestrutura, conecta os sistemas internos e registra a instituição na federação.",
        tags: ["OIDC", "OpenID Federation", "CAFe"],
      },
      {
        t: "Acesso unificado",
        d: "A comunidade acadêmica entra nos sistemas da instituição e nos serviços da CAFe com uma só conta. O usuário interage com uma única interface de autenticação.",
        tags: ["Login único", "Serviços federados"],
      },
    ],
    survey: {
      title: "Diagnóstico",
      status: "a levantar",
      items: [
        ["Origem dos usuários", "planilha, banco ou diretório"],
        ["Sistemas com login próprio", "inventário de serviços"],
        ["Tipos de vínculo", "alunos, docentes, servidores, terceiros"],
        ["Contato técnico", "ponto focal na TI"],
      ],
    },
    mapping: {
      title: "Mapeamento de atributos",
      head: ["origem", "atributo"],
      rows: [
        { from: "nome", to: "displayName" },
        { from: "email", to: "mail" },
        { from: "vinculo", to: "eduPersonAffiliation" },
      ],
    },
    config: {
      title: "Configuração",
      items: [
        "IdP provisionado na infraestrutura do BAITA",
        "Sistemas internos conectados via OIDC",
        "Registro da instituição na federação CAFe",
      ],
    },
    access: {
      title: "Acesso unificado",
      institution: "[Nome da instituição]",
      prompt: "Entre para acessar o Ambiente Virtual de Aprendizagem",
      user: "Usuário",
      userHint: "nome.sobrenome",
      password: "Senha",
      submit: "Entrar",
      foot: "O mesmo login vale para todos os sistemas e para a CAFe.",
    },
  },
  piece: {
    kicker: "A peça que faltava",
    title:
      "Entre os sistemas da instituição e o ecossistema da CAFe, um único ponto de identidade.",
    left: "Sistemas da instituição",
    leftNodes: ["Sistema acadêmico", "Ambiente Virtual de Aprendizagem", "E-mail", "Biblioteca", "Portal do servidor"],
    right: "Serviços da RNP e da CAFe",
    rightNodes: [
      "Serviços federados da CAFe",
      "Portal de Benefícios",
      "Serviços de outras instituições",
      "Serviços da RNP",
      "Bases de pesquisa",
    ],
  },
  why: {
    kicker: "Por que o BAITA",
    title: "Identidade federada, entregue por quem está modernizando a CAFe.",
    cards: [
      {
        t: "Expertise como produto",
        d: "O conhecimento de identidade federada, hoje concentrado em poucos especialistas, entregue como serviço gerenciado.",
      },
      {
        t: "Conhecimento de dentro da RNP e da CAFe",
        d: "Desenvolvido pelo grupo de trabalho que está levando a CAFe ao OpenID Federation, com apoio da RNP.",
      },
      {
        t: "Suporte brasileiro",
        d: "Atendimento em português, no fuso e no contexto das instituições de ensino e pesquisa do país.",
      },
      {
        t: "Nativo da CAFe",
        d: "Nasce integrado à federação, sem adaptação de produto estrangeiro. Mesmo protocolo, mesmos atributos, mesma operação.",
      },
    ],
  },
  benefits: {
    kicker: "Benefícios",
    title: "Para quem decide e para quem opera.",
    tablist: "Benefícios por público",
    tabs: ["Gestão", "TI"],
    management: {
      items: [
        { t: "Menos risco", d: "O acesso à CAFe deixa de depender de uma única pessoa na instituição." },
        { t: "Continuidade", d: "Operação, atualizações e suporte sob responsabilidade do BAITA, com apoio da RNP." },
        {
          t: "Ecossistema nacional",
          d: "Estudantes, docentes e servidores acessam os serviços federados da CAFe com a conta institucional.",
        },
      ],
      before: "ANTES",
      after: "DEPOIS",
      owner: "1 responsável técnico",
      access: "Acesso à CAFe",
      spof: "ponto único de falha",
      operation: "Operação BAITA + RNP",
      continuous: "operação contínua",
    },
    it: {
      items: [
        { t: "Sem Shibboleth para operar", d: "Nenhum IdP para instalar, atualizar ou monitorar." },
        {
          t: "Nada rodando na infraestrutura da instituição",
          d: "O IdP roda na infraestrutura do BAITA. A TI conecta sistemas, não mantém servidores.",
        },
      ],
      label: "infraestrutura da instituição",
      rows: [
        ["Servidor de IdP", "não necessário"],
        ["Shibboleth", "não necessário"],
        ["Certificados e chaves", "com o BAITA"],
      ],
      integration: "Integração dos sistemas",
    },
  },
  quiz: {
    kicker: "Diagnóstico rápido",
    title: "A instituição está pronta para a CAFe?",
    intro: "Quatro perguntas indicam o caminho mais provável. O diagnóstico com a equipe confirma.",
    question: "Pergunta",
    of: "de",
    back: "Voltar",
    noSignup: "Sem cadastro",
    result: "Resultado",
    path: "caminho indicado",
    cta: "Quero saber mais",
    restart: "Refazer",
    disclaimer: "Resultado indicativo. O diagnóstico confirma o caminho.",
    questions: [
      {
        k: "Gestão de usuários",
        t: "Onde está hoje o cadastro de usuários da instituição?",
        o: ["Planilha (Excel ou similar)", "Banco de dados de um sistema", "Diretório (LDAP ou Active Directory)"],
      },
      {
        k: "Serviços",
        t: "Quantos sistemas internos pedem login hoje?",
        o: ["Até 5", "De 6 a 20", "Mais de 20", "Não há levantamento"],
      },
      {
        k: "Tipos de acesso",
        t: "Quantas formas de login diferentes convivem na instituição?",
        o: ["Uma só", "Duas ou três", "Mais de três"],
      },
      {
        k: "Shibboleth",
        t: "A instituição já opera um IdP Shibboleth?",
        o: ["Sim, em operação", "Já operou, mas parou", "Não"],
      },
    ],
    // Indexado pela resposta da primeira pergunta.
    paths: [
      {
        title: "Partindo da planilha",
        lead: "O primeiro passo é transformar a planilha em uma base estruturada. O BAITA conduz essa preparação antes de configurar o IdP.",
        mid: "Estruturação da base",
      },
      {
        title: "Partindo do banco de dados",
        lead: "O IdP é conectado à base existente, com os campos mapeados para os atributos usados na CAFe.",
        mid: "Mapeamento de atributos",
      },
      {
        title: "Partindo do diretório",
        lead: "Com LDAP ou AD em uso, o caminho é conectar o diretório ao IdP BAITA e revisar os atributos.",
        mid: "Conexão ao diretório",
      },
    ],
    stepNames: { first: "Diagnóstico", third: "Configuração", last: "Acesso unificado" },
    notes: {
      manySystems:
        "Muitos sistemas com login próprio: a conexão pode ser feita em etapas, começando pelos mais usados.",
      noInventory: "O diagnóstico inclui o levantamento dos sistemas que pedem login.",
      duplicates:
        "Formas de login diferentes indicam contas duplicadas: a preparação inclui a consolidação das identidades.",
      shibActive:
        "Com Shibboleth em operação, o diagnóstico planeja a transição do IdP atual para o IdP BAITA.",
      shibStopped: "Com o IdP fora de operação, o IdP BAITA assume o acesso à CAFe.",
      shibNone: "Sem Shibboleth, não há nada para instalar: o IdP roda na infraestrutura do BAITA.",
    },
  },
  faq: {
    kicker: "Perguntas frequentes",
    title: "O que a TI e a gestão costumam perguntar.",
    items: [
      {
        q: "Quem guarda as chaves criptográficas da instituição?",
        a: "No modelo gerenciado, as chaves são geradas e custodiadas na infraestrutura do BAITA, operada com apoio da RNP. A instituição não mantém certificados nem servidores de IdP.",
        ph: "[Detalhar política de custódia, rotação e acesso às chaves]",
      },
      {
        q: "Como fica a LGPD?",
        a: "O tratamento de dados pessoais segue a LGPD, com liberação de atributos limitada ao necessário para cada serviço.",
        ph: "[Confirmar papéis de controlador e operador, base legal e local de armazenamento]",
      },
      {
        q: "Qual o esforço de migração?",
        a: "Depende do ponto de partida. O diagnóstico dimensiona o esforço antes de qualquer mudança; a preparação da base e a configuração ficam com o BAITA, e a TI da instituição participa das validações.",
        ph: "",
      },
      {
        q: "Onde o IdP roda?",
        a: "Na infraestrutura do BAITA. Nada é instalado nos servidores da instituição.",
        ph: "",
      },
      {
        q: "E a continuidade do suporte?",
        a: "Operação, atualizações e suporte ficam com o BAITA, com apoio da RNP, em português. O acesso deixa de depender de uma pessoa específica na instituição.",
        ph: "[Confirmar modelo de suporte e níveis de atendimento]",
      },
      {
        q: "Qual o ponto de partida mínimo?",
        a: "Uma lista de usuários, mesmo em planilha. Diretório, banco de dados ou planilha: o diagnóstico define o caminho a partir do que a instituição já tem.",
        ph: "",
      },
    ],
  },
  proof: {
    kicker: "Prova",
    title: "Piloto validado em homologação, na infraestrutura da RNP.",
    body: "O BAITA roda em ambiente de homologação no testbed da RNP, com o fluxo de login validado de ponta a ponta entre instituições de protocolo moderno e legado.",
    status: "status do piloto",
    rows: [
      { k: "ambiente", v: "homologação · testbed RNP", pill: "ativo", live: true },
      { k: "fluxo", v: "login ponta a ponta", pill: "validado", live: false },
      { k: "protocolo", v: "OpenID Federation 1.0", pill: "OIDC", live: false },
      { k: "legado", v: "instituições SAML", pill: "validado", live: false },
    ],
  },
  cta: {
    kicker: "Próximo passo",
    title: "Vamos conversar sobre a sua instituição.",
    lead: "Deixe seu contato no formulário abaixo para mapearmos o ponto de partida da instituição e responder às dúvidas técnicas.",
    primary: "Quero saber mais",
    secondary: "Fazer o diagnóstico",
  },
};

export type IdpContent = typeof pt;

const en: IdpContent = {
  meta: { title: "BAITA IdP" },
  brand: "BAITA IdP",
  hero: {
    title: "One login for everything at your institution. CAFe access included.",
    lead: "Unified login managed by BAITA and integrated with CAFe. No local hosting, no Shibboleth, no hassle.",
    primary: "I want to know more",
    secondary: "Explore the solution",
    vizLabel:
      "The institution's systems and CAFe services converging on a single institutional login",
    nodes: [
      "Academic system",
      "Virtual Learning Environment",
      "University library",
      "Staff portal",
      "Federated services",
    ],
    center: "BAITA IdP",
  },
  problem: {
    kicker: "Problem",
    statement: "Disorganized user base, disconnected login systems and duplicated work.",
    body: [
      "Without an institutional identity, every service keeps its own users and passwords.",
      "With an IdP managed by BAITA, the institution gets a single identity: one login for every system and open access to CAFe.",
    ],
    vizLabel:
      "Before, every system with its own user database; with BAITA IdP, one unified database flows through the IdP to every system",
    services: ["Academic system", "Virtual Learning Environment", "University library", "CAFe access"],
    idp: "BAITA IdP",
    before: "Before",
    after: "With BAITA IdP",
  },
  start: {
    kicker: "Any starting point",
    title:
      "A structured directory or an Excel spreadsheet: whatever the starting point, BAITA knows the way.",
    sheet: {
      kicker: "Starting point A",
      title: "Spreadsheet",
      file: "users.xlsx",
      head: ["name", "affiliation", "email"],
      rows: [
        ["Ana Souza", "student", "ana@…"],
        ["Bruno Lima", "staff", "bruno@…"],
        ["Carla Reis", "faculty", "empty"],
        ["Ana Souza", "student", "ana.s@…"],
      ],
      foot: "Structuring the data: duplicates and gaps resolved before the IdP.",
    },
    db: {
      kicker: "Starting point B",
      title: "Database",
      file: "schema · people",
      table: "people",
      fields: [
        ["id", "int"],
        ["name", "text"],
        ["affiliation", "text"],
        ["email", "text"],
        ["active", "bool"],
      ],
      foot: "Fields mapped to the attributes used in CAFe.",
    },
    dir: {
      kicker: "Starting point C",
      title: "Directory",
      file: "dc=[institution],dc=edu,dc=br",
      ous: ["students", "faculty", "staff", "contractors"],
      foot: "Direct connection from the directory to BAITA IdP.",
    },
    less: "less structured",
    more: "more structured",
    dest: "Every path leads to the same destination: an IdP federated with CAFe.",
  },
  how: {
    kicker: "How it works",
    title: "Implementation phases",
    url: "baita · rollout",
    steps: [
      {
        t: "Assessment",
        d: "We map where your users live, which systems ask for a login and which affiliations exist at the institution.",
        tags: ["Data source", "Systems", "Affiliations"],
      },
      {
        t: "Preparation",
        d: "The user base is organised and fields are mapped to the attributes used in CAFe.",
        tags: ["Data clean-up", "Attribute mapping"],
      },
      {
        t: "Configuration",
        d: "BAITA provisions the IdP on its own infrastructure, connects internal systems and registers the institution in the federation.",
        tags: ["OIDC", "OpenID Federation", "CAFe"],
      },
      {
        t: "Unified access",
        d: "The academic community signs in to the institution's systems and to CAFe services with a single account. Users interact with a single sign-in screen.",
        tags: ["Single sign-on", "Federated services"],
      },
    ],
    survey: {
      title: "Assessment",
      status: "to survey",
      items: [
        ["User source", "spreadsheet, database or directory"],
        ["Systems with their own login", "service inventory"],
        ["Affiliation types", "students, faculty, staff, contractors"],
        ["Technical contact", "IT point of contact"],
      ],
    },
    mapping: {
      title: "Attribute mapping",
      head: ["source", "attribute"],
      rows: [
        { from: "name", to: "displayName" },
        { from: "email", to: "mail" },
        { from: "affiliation", to: "eduPersonAffiliation" },
      ],
    },
    config: {
      title: "Configuration",
      items: [
        "IdP provisioned on BAITA infrastructure",
        "Internal systems connected via OIDC",
        "Institution registered in the CAFe federation",
      ],
    },
    access: {
      title: "Unified access",
      institution: "[Institution name]",
      prompt: "Sign in to access the Virtual Learning Environment",
      user: "Username",
      userHint: "first.last",
      password: "Password",
      submit: "Sign in",
      foot: "The same login works for every system and for CAFe.",
    },
  },
  piece: {
    kicker: "The missing piece",
    title:
      "Between the institution's systems and the CAFe ecosystem, a single point of identity.",
    left: "Institution systems",
    leftNodes: ["Academic system", "Virtual Learning Environment", "Email", "Library", "Staff portal"],
    right: "RNP and CAFe services",
    rightNodes: [
      "CAFe federated services",
      "Benefits Portal",
      "Services from other institutions",
      "RNP services",
      "Research databases",
    ],
  },
  why: {
    kicker: "Why BAITA",
    title: "Federated identity, delivered by the team modernising CAFe.",
    cards: [
      {
        t: "Expertise as a product",
        d: "Federated identity know-how, today concentrated in a handful of specialists, delivered as a managed service.",
      },
      {
        t: "Insider knowledge of RNP and CAFe",
        d: "Built by the working group taking CAFe to OpenID Federation, with support from RNP.",
      },
      {
        t: "Brazilian support",
        d: "Support in Portuguese, in the time zone and context of Brazil's teaching and research institutions.",
      },
      {
        t: "CAFe-native",
        d: "Built into the federation from day one, not adapted from a foreign product. Same protocol, same attributes, same operation.",
      },
    ],
  },
  benefits: {
    kicker: "Benefits",
    title: "For those who decide and those who operate.",
    tablist: "Benefits by audience",
    tabs: ["Management", "IT"],
    management: {
      items: [
        { t: "Less risk", d: "CAFe access no longer depends on a single person at the institution." },
        { t: "Continuity", d: "Operation, updates and support are BAITA's responsibility, with support from RNP." },
        {
          t: "National ecosystem",
          d: "Students, faculty and staff use CAFe federated services with their institutional account.",
        },
      ],
      before: "BEFORE",
      after: "AFTER",
      owner: "1 technical lead",
      access: "CAFe access",
      spof: "single point of failure",
      operation: "BAITA + RNP operation",
      continuous: "continuous operation",
    },
    it: {
      items: [
        { t: "No Shibboleth to run", d: "No IdP to install, update or monitor." },
        {
          t: "Nothing running on the institution's infrastructure",
          d: "The IdP runs on BAITA's infrastructure. IT connects systems instead of maintaining servers.",
        },
      ],
      label: "institution infrastructure",
      rows: [
        ["IdP server", "not needed"],
        ["Shibboleth", "not needed"],
        ["Certificates and keys", "with BAITA"],
      ],
      integration: "System integration",
    },
  },
  quiz: {
    kicker: "Quick assessment",
    title: "Is your institution ready for CAFe?",
    intro: "Four questions point to the most likely path. An assessment with our team confirms it.",
    question: "Question",
    of: "of",
    back: "Back",
    noSignup: "No sign-up",
    result: "Result",
    path: "suggested path",
    cta: "I want to know more",
    restart: "Start over",
    disclaimer: "Indicative result. The assessment confirms the path.",
    questions: [
      {
        k: "User management",
        t: "Where is the institution's user registry today?",
        o: ["Spreadsheet (Excel or similar)", "A system's database", "Directory (LDAP or Active Directory)"],
      },
      {
        k: "Services",
        t: "How many internal systems ask for a login today?",
        o: ["Up to 5", "6 to 20", "More than 20", "Not surveyed yet"],
      },
      {
        k: "Access types",
        t: "How many different ways of logging in coexist at the institution?",
        o: ["Just one", "Two or three", "More than three"],
      },
      {
        k: "Shibboleth",
        t: "Does the institution already run a Shibboleth IdP?",
        o: ["Yes, in operation", "It used to, but stopped", "No"],
      },
    ],
    paths: [
      {
        title: "Starting from a spreadsheet",
        lead: "The first step is turning the spreadsheet into a structured user base. BAITA leads this preparation before configuring the IdP.",
        mid: "Structuring the data",
      },
      {
        title: "Starting from a database",
        lead: "The IdP connects to the existing database, with fields mapped to the attributes used in CAFe.",
        mid: "Attribute mapping",
      },
      {
        title: "Starting from a directory",
        lead: "With LDAP or AD in place, the path is connecting the directory to BAITA IdP and reviewing the attributes.",
        mid: "Directory connection",
      },
    ],
    stepNames: { first: "Assessment", third: "Configuration", last: "Unified access" },
    notes: {
      manySystems:
        "Many systems with their own login: they can be connected in stages, starting with the most used.",
      noInventory: "The assessment includes surveying which systems ask for a login.",
      duplicates:
        "Different ways of logging in point to duplicate accounts: preparation includes consolidating identities.",
      shibActive:
        "With Shibboleth in operation, the assessment plans the move from the current IdP to BAITA IdP.",
      shibStopped: "With the IdP out of operation, BAITA IdP takes over CAFe access.",
      shibNone: "Without Shibboleth, there is nothing to install: the IdP runs on BAITA's infrastructure.",
    },
  },
  faq: {
    kicker: "FAQ",
    title: "What IT and management usually ask.",
    items: [
      {
        q: "Who holds the institution's cryptographic keys?",
        a: "In the managed model, keys are generated and held on BAITA's infrastructure, operated with support from RNP. The institution maintains no certificates or IdP servers.",
        ph: "[Detail the key custody, rotation and access policy]",
      },
      {
        q: "What about the LGPD?",
        a: "Personal data is processed in line with the LGPD, Brazil's data protection law, with attribute release limited to what each service needs.",
        ph: "[Confirm controller and processor roles, legal basis and storage location]",
      },
      {
        q: "How much effort does migration take?",
        a: "It depends on the starting point. The assessment sizes the effort before anything changes; data preparation and configuration are handled by BAITA, and the institution's IT takes part in validation.",
        ph: "",
      },
      {
        q: "Where does the IdP run?",
        a: "On BAITA's infrastructure. Nothing is installed on the institution's servers.",
        ph: "",
      },
      {
        q: "What about long-term support?",
        a: "Operation, updates and support stay with BAITA, with support from RNP, in Portuguese. Access no longer depends on one specific person at the institution.",
        ph: "[Confirm the support model and service levels]",
      },
      {
        q: "What is the minimum starting point?",
        a: "A list of users, even in a spreadsheet. Directory, database or spreadsheet: the assessment defines the path from what the institution already has.",
        ph: "",
      },
    ],
  },
  proof: {
    kicker: "Proof",
    title: "Pilot validated in staging, on RNP infrastructure.",
    body: "BAITA runs in a staging environment on the RNP testbed, with the login flow validated end to end between institutions on modern and legacy protocols.",
    status: "pilot status",
    rows: [
      { k: "environment", v: "staging · RNP testbed", pill: "active", live: true },
      { k: "flow", v: "end-to-end login", pill: "validated", live: false },
      { k: "protocol", v: "OpenID Federation 1.0", pill: "OIDC", live: false },
      { k: "legacy", v: "SAML institutions", pill: "validated", live: false },
    ],
  },
  cta: {
    kicker: "Next step",
    title: "Let's talk about your institution.",
    lead: "Leave your contact in the form below so we can map your institution's starting point and answer your technical questions.",
    primary: "I want to know more",
    secondary: "Take the assessment",
  },
};

export function useIdpContent(): IdpContent {
  const { i18n } = useTranslation();
  return i18n.language?.startsWith("en") ? en : pt;
}
