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
      "Com um provedor de identidade (IdP) gerenciado pelo BAITA, a instituição passa a ter uma identidade única: um login para todos os sistemas e com acesso à CAFe.",
    ],
    vizLabel:
      "Antes, cada sistema com sua própria base de usuários; com o IdP BAITA, uma base unificada passa pelo IdP e chega a todos os sistemas",
    services: ["Sistema acadêmico", "Ambiente Virtual de Aprendizagem", "Biblioteca universitária", "Acesso à CAFe"],
    idp: "IdP BAITA",
    before: "Antes",
    after: "Com o IdP BAITA",
  },
  role: {
    kicker: "O que é um IdP",
    title: "Provedor de identidade (IdP): autentica usuários e garante sua identidade.",
    lead: "O IdP é o serviço que guarda e confirma a identidade dos usuários da organização. Os sistemas deixam de autenticar o usuário por conta própria e delegam a autenticação ao IdP.",
    services: "Serviços",
    // A confirmar com a equipe: quais serviços da CAFe citar.
    serviceNodes: ["Ambiente Virtual de Aprendizagem", "Sistema acadêmico", "Periódicos CAPES", "Conferência web"],
    base: "Base de usuários da instituição",
    // Versão compacta do diagrama, no celular.
    mini: { service: "Serviço", base: "Base de usuários" },
    controls: { prev: "Passo anterior", next: "Próximo passo", play: "Reproduzir", pause: "Pausar", label: "Passos do login" },
    vizLabel:
      "Fluxo de login: o serviço encaminha o usuário ao IdP, o IdP confere a identidade na base de usuários e devolve a confirmação ao serviço.",
    steps: [
      { t: "Acesso", d: "O usuário abre um serviço da instituição ou da CAFe." },
      { t: "Login no IdP", d: "O serviço não pede senha: encaminha o usuário para o login da instituição, no IdP." },
      { t: "Verificação", d: "O IdP confirma a identidade na base de usuários da instituição." },
      { t: "Resposta", d: "O IdP envia ao serviço apenas os dados necessários." },
    ],
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
        d: "Levantamos onde estão os usuários da instituição, quais sistemas pedem login e quais vínculos existem.",
        tags: ["Origem dos dados", "Sistemas", "Vínculos"],
      },
      {
        t: "Preparação",
        d: "Organizamos a base de usuários e mapeamos os campos para os atributos usados na CAFe.",
        tags: ["Limpeza da base", "Mapeamento de atributos"],
      },
      {
        t: "Configuração",
        d: "Provisionamos o IdP na infraestrutura do BAITA, conectamos os sistemas internos e registramos a instituição na federação.",
        tags: ["OIDC", "OpenID Federation", "CAFe"],
      },
      {
        t: "Acesso unificado",
        d: "Entregamos o acesso: a comunidade acadêmica entra nos sistemas da instituição e nos serviços da CAFe com uma só conta, por uma única tela de login.",
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
      label: "Várias telas de login, uma para cada sistema, se juntam em uma só.",
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
        t: "Especialistas em identidade",
        d: "Uma equipe de especialistas e pesquisadores em gestão de identidade federada, que une prática e pesquisa acadêmica para cuidar do IdP da instituição.",
      },
      {
        t: "Conhecimento de dentro da RNP e da CAFe",
        d: "Desenvolvido pelo grupo de trabalho que está levando a CAFe ao OpenID Federation, com apoio da RNP.",
      },
      {
        t: "Soberania nacional",
        d: "Feita no Brasil para as instituições do país: dados tratados conforme a LGPD, suporte em português e um entendimento profundo da realidade brasileira.",
      },
      {
        t: "Adoção de protocolos modernos",
        d: "O IdP nasce integrado à federação CAFe e suporta protocolos de autenticação modernos, como o OAuth e o OIDC.",
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
        { t: "Continuidade", d: "Operação, atualizações e suporte sob responsabilidade do BAITA." },
        {
          t: "Ecossistema nacional",
          d: "Estudantes, docentes e servidores acessam os serviços federados da CAFe com a conta institucional.",
        },
      ],
      // Diagrama da aba (stability-diagram.tsx).
      nodes: { base: "Base de usuários", services: "Serviços institucionais" },
      vizLabel:
        "Antes, a base de usuários e os serviços institucionais ficam soltos; com o IdP BAITA, os dois se conectam a ele.",
    },
    it: {
      items: [
        { t: "Sem Shibboleth para operar", d: "Nenhum IdP para instalar, atualizar ou monitorar." },
        {
          t: "Nada rodando na infraestrutura da instituição",
          d: "O IdP roda na infraestrutura do BAITA. A TI só conecta os sistemas e opcionalmente mantém o diretório de usuários.",
        },
      ],
      // Diagrama da aba (stability-diagram.tsx): o que deixa de ser preciso.
      nodes: {
        ldap: "Diretório LDAP",
        shib: "Shibboleth",
        server: "IdP institucional",
        certs: "Certificados e chaves",
        service: "Serviço",
      },
      vizLabel:
        "Antes, o serviço depende de diretório LDAP, Shibboleth, IdP institucional e certificados; com o IdP BAITA, nada disso é preciso e só ele se liga ao serviço.",
    },
  },
  quiz: {
    kicker: "Diagnóstico",
    title: "A instituição está pronta para a CAFe?",
    intro:
      "Responda nosso questionário de diagnóstico pra entender melhor o momento da sua instituição. As respostas também nos ajudam a chegar em uma solução que faça sentido para você.",
    skip: "Prefere falar direto? Entre em contato",
    question: "Pergunta",
    of: "de",
    back: "Voltar",
    send: "Enviar resultados para a equipe",
    restart: "Refazer",
    // `sum` é o rótulo da pergunta no resumo enviado ao formulário.
    questions: [
      {
        k: "Gestão de usuários",
        sum: "Cadastro de usuários",
        t: "Onde está hoje o cadastro de usuários da instituição?",
        o: ["Planilha (Excel ou similar)", "Banco de dados de um sistema", "Diretório (LDAP ou Active Directory)"],
      },
      {
        k: "Serviços",
        sum: "Sistemas com login",
        t: "Quantos sistemas da instituição necessitam de login hoje?",
        o: ["Até 5", "De 6 a 20", "Mais de 20", "Não há levantamento"],
      },
      {
        k: "Tipos de acesso",
        sum: "Telas de login por pessoa",
        t: "Com quantas telas de login um usuário da instituição interage hoje?",
        o: ["Uma só", "Duas ou três", "Mais de três"],
      },
      {
        k: "Shibboleth",
        sum: "Shibboleth",
        t: "A instituição já opera um IdP Shibboleth?",
        o: ["Sim, em operação", "Já operou, mas parou", "Não"],
      },
    ],
    // Resultado: o Shibboleth (4ª pergunta) decide; sem ele, a base (1ª).
    results: {
      active: {
        v: "Já está na CAFe",
        t: "O acesso existe, mas custa caro para manter.",
        d: "Manter um Shibboleth exige servidor, atualizações e alguém que conheça bem a ferramenta. Com o IdP BAITA, a instituição continua na CAFe e essa manutenção deixa de ser da TI.",
      },
      stopped: {
        v: "Acesso interrompido",
        t: "A comunidade está sem acesso aos serviços da CAFe.",
        d: "Quando o IdP local para, quem depende dele fica de fora. O IdP BAITA devolve esse acesso sem que a instituição precise reerguer um servidor.",
      },
      directory: {
        v: "Mais perto do que parece",
        t: "O diretório que a instituição já usa é o ponto de partida.",
        d: "Com LDAP ou Active Directory em uso, falta pouco para entrar na CAFe. O IdP BAITA se conecta a ele, sem servidor novo na instituição.",
      },
      database: {
        v: "Quase lá",
        t: "Os usuários já estão organizados em um sistema.",
        d: "O IdP BAITA usa essa base para dar a cada pessoa um login único e o acesso à CAFe, sem servidor novo na instituição.",
      },
      spreadsheet: {
        v: "Dá para começar com o que já tem",
        t: "Uma planilha de usuários já é suficiente para começar.",
        d: "O BAITA ajuda a organizar essa base e, a partir dela, a instituição ganha um login único e o acesso à CAFe.",
      },
    },
    // No máximo uma: as telas de login (3ª) têm prioridade sobre os sistemas (2ª).
    pains: {
      moreThanThree: "Hoje cada pessoa lida com mais de três telas de login. Com o IdP BAITA, passa a ser uma só.",
      twoOrThree: "Hoje cada pessoa lida com duas ou três telas de login. Com o IdP BAITA, passa a ser uma só.",
      manySystems: "Com tantos sistemas pedindo login, a conexão pode começar pelos mais usados.",
      noInventory: "Ainda não sabe quantos sistemas pedem login? Esse levantamento faz parte do começo.",
    },
    // Mensagem que o resultado preenche no formulário de contato.
    summary: {
      hello: "Olá! Fiz o diagnóstico rápido do IdP BAITA.",
      result: "Resultado",
      bye: "Gostaria de conversar sobre a nossa situação.",
    },
  },
  faq: {
    kicker: "Perguntas frequentes",
    title: "O que a TI e a gestão costumam perguntar.",
    items: [
      {
        q: "Quem guarda as chaves criptográficas da instituição?",
        a: "No modelo gerenciado, as chaves são geradas e custodiadas na infraestrutura do BAITA, operada com apoio da RNP. A instituição não mantém certificados nem servidores de IdP.",
      },
      {
        q: "Como fica a LGPD?",
        a: "O tratamento de dados pessoais segue a LGPD, com liberação de atributos limitada ao necessário para cada serviço.",
      },
      {
        q: "Qual o esforço de migração?",
        a: "Depende do ponto de partida. O diagnóstico dimensiona o esforço antes de qualquer mudança; a preparação da base e a configuração ficam com o BAITA, e a TI da instituição participa das validações.",
      },
      {
        q: "Onde o IdP roda?",
        a: "Na infraestrutura do BAITA. Nada é instalado nos servidores da instituição.",
      },
      {
        q: "E a continuidade do suporte?",
        a: "Operação, atualizações e suporte ficam com o BAITA, com apoio da RNP. O acesso deixa de depender de uma pessoa específica na instituição.",
      },
      {
        q: "Qual o ponto de partida mínimo?",
        a: "Uma lista de usuários. Diretório, banco de dados ou planilha: o diagnóstico define o caminho a partir do que a instituição já tem.",
      },
      {
        q: "Onde encontro os detalhes técnicos?",
        a: "Os slides técnicos reúnem os detalhes da solução para a equipe de TI.",
        link: { label: "Ver os slides técnicos", href: "https://drive.google.com/file/d/1Ee-rq1FxYanYe9W5dVmWKoR6FVd2z8gx/view?usp=sharing" },
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
      "With an identity provider (IdP) managed by BAITA, the institution gets a single identity: one login for every system, with access to CAFe.",
    ],
    vizLabel:
      "Before, every system with its own user database; with BAITA IdP, one unified database flows through the IdP to every system",
    services: ["Academic system", "Virtual Learning Environment", "University library", "CAFe access"],
    idp: "BAITA IdP",
    before: "Before",
    after: "With BAITA IdP",
  },
  role: {
    kicker: "What is an IdP",
    title: "Identity provider (IdP): authenticates users and guarantees their identity.",
    lead: "The IdP is the service that keeps and confirms the identity of the organisation's users. Systems stop authenticating users on their own and delegate authentication to the IdP.",
    services: "Services",
    serviceNodes: ["Virtual Learning Environment", "Academic system", "CAPES journals", "Web conferencing"],
    base: "Institution user base",
    mini: { service: "Service", base: "User base" },
    controls: { prev: "Previous step", next: "Next step", play: "Play", pause: "Pause", label: "Login steps" },
    vizLabel:
      "Login flow: the service sends the user to the IdP, the IdP checks the identity against the user base and returns the confirmation to the service.",
    steps: [
      { t: "Access", d: "The user opens a service from the institution or from CAFe." },
      { t: "Sign in at the IdP", d: "The service doesn't ask for a password: it sends the user to the institution's sign-in, at the IdP." },
      { t: "Verification", d: "The IdP confirms the identity against the institution's user base." },
      { t: "Response", d: "The IdP sends the service only the data it needs." },
    ],
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
        d: "We map where the institution's users are, which systems ask for a login and which affiliations exist.",
        tags: ["Data source", "Systems", "Affiliations"],
      },
      {
        t: "Preparation",
        d: "We organise the user base and map its fields to the attributes used in CAFe.",
        tags: ["Data clean-up", "Attribute mapping"],
      },
      {
        t: "Configuration",
        d: "We provision the IdP on BAITA's infrastructure, connect the internal systems and register the institution in the federation.",
        tags: ["OIDC", "OpenID Federation", "CAFe"],
      },
      {
        t: "Unified access",
        d: "We deliver access: the academic community signs in to the institution's systems and to CAFe services with a single account, through one sign-in screen.",
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
      label: "Several login screens, one per system, merge into one.",
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
        t: "Identity experts",
        d: "A team of experts and scholars in federated identity management, combining hands-on practice and academic research to run your institution's IdP.",
      },
      {
        t: "Insider knowledge of RNP and CAFe",
        d: "Built by the working group taking CAFe to OpenID Federation, with support from RNP.",
      },
      {
        t: "National sovereignty",
        d: "Built in Brazil for the country's institutions: data handled under the LGPD, support in Portuguese and a deep understanding of the Brazilian context.",
      },
      {
        t: "Modern protocols",
        d: "The IdP is integrated with the CAFe federation from day one and supports modern authentication protocols such as OAuth and OIDC.",
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
        { t: "Continuity", d: "Operation, updates and support are BAITA's responsibility." },
        {
          t: "National ecosystem",
          d: "Students, faculty and staff use CAFe federated services with their institutional account.",
        },
      ],
      nodes: { base: "User base", services: "Institutional services" },
      vizLabel: "Before, the user base and the institutional services drift apart; with BAITA IdP, both connect to it.",
    },
    it: {
      items: [
        { t: "No Shibboleth to run", d: "No IdP to install, update or monitor." },
        {
          t: "Nothing running on the institution's infrastructure",
          d: "The IdP runs on BAITA's infrastructure. IT only connects the systems and, optionally, maintains the user directory.",
        },
      ],
      nodes: {
        ldap: "LDAP directory",
        shib: "Shibboleth",
        server: "Institutional IdP",
        certs: "Certificates and keys",
        service: "Service",
      },
      vizLabel:
        "Before, the service depends on an LDAP directory, Shibboleth, an institutional IdP and certificates; with BAITA IdP, none of that is needed and only it connects to the service.",
    },
  },
  quiz: {
    kicker: "Assessment",
    title: "Is your institution ready for CAFe?",
    intro:
      "Answer our assessment questionnaire to better understand where your institution stands. Your answers also help us reach a solution that makes sense for you.",
    skip: "Rather talk to us directly? Get in touch",
    question: "Question",
    of: "of",
    back: "Back",
    send: "Send results to the team",
    restart: "Start over",
    questions: [
      {
        k: "User management",
        sum: "User registry",
        t: "Where is the institution's user registry today?",
        o: ["Spreadsheet (Excel or similar)", "A system's database", "Directory (LDAP or Active Directory)"],
      },
      {
        k: "Services",
        sum: "Systems with a login",
        t: "How many of the institution's systems require a login today?",
        o: ["Up to 5", "6 to 20", "More than 20", "No inventory yet"],
      },
      {
        k: "Access types",
        sum: "Login screens per person",
        t: "How many different login screens does a user at the institution deal with today?",
        o: ["Just one", "Two or three", "More than three"],
      },
      {
        k: "Shibboleth",
        sum: "Shibboleth",
        t: "Does the institution already run a Shibboleth IdP?",
        o: ["Yes, in operation", "It did, but stopped", "No"],
      },
    ],
    results: {
      active: {
        v: "Already in CAFe",
        t: "Access is there, but it's costly to keep up.",
        d: "Running Shibboleth takes a server, updates and someone who knows the tool well. With BAITA IdP, the institution stays in CAFe and that upkeep is no longer IT's job.",
      },
      stopped: {
        v: "Access interrupted",
        t: "The community has lost access to CAFe services.",
        d: "When the local IdP stops, everyone who depends on it is left out. BAITA IdP restores that access without the institution having to bring a server back up.",
      },
      directory: {
        v: "Closer than it seems",
        t: "The directory the institution already uses is the starting point.",
        d: "With LDAP or Active Directory in place, joining CAFe is within reach. BAITA IdP connects to it, with no new server at the institution.",
      },
      database: {
        v: "Almost there",
        t: "Users are already organised in a system.",
        d: "BAITA IdP uses that base to give each person a single login and access to CAFe, with no new server at the institution.",
      },
      spreadsheet: {
        v: "Start with what you have",
        t: "A spreadsheet of users is enough to get started.",
        d: "BAITA helps organise that base and, from it, the institution gets a single login and access to CAFe.",
      },
    },
    pains: {
      moreThanThree: "Today each person deals with more than three login screens. With BAITA IdP, it becomes just one.",
      twoOrThree: "Today each person deals with two or three login screens. With BAITA IdP, it becomes just one.",
      manySystems: "With this many systems asking for a login, the connection can start with the most used ones.",
      noInventory: "Not sure how many systems ask for a login? Mapping them is part of getting started.",
    },
    summary: {
      hello: "Hi! I took the BAITA IdP quick assessment.",
      result: "Result",
      bye: "I'd like to talk about our situation.",
    },
  },
  faq: {
    kicker: "FAQ",
    title: "What IT and management usually ask.",
    items: [
      {
        q: "Who holds the institution's cryptographic keys?",
        a: "In the managed model, keys are generated and held on BAITA's infrastructure, operated with support from RNP. The institution maintains no certificates or IdP servers.",
      },
      {
        q: "What about the LGPD?",
        a: "Personal data is processed in line with the LGPD, Brazil's data protection law, with attribute release limited to what each service needs.",
      },
      {
        q: "How much effort does migration take?",
        a: "It depends on the starting point. The assessment sizes the effort before anything changes; data preparation and configuration are handled by BAITA, and the institution's IT takes part in validation.",
      },
      {
        q: "Where does the IdP run?",
        a: "On BAITA's infrastructure. Nothing is installed on the institution's servers.",
      },
      {
        q: "What about long-term support?",
        a: "Operation, updates and support stay with BAITA, with support from RNP. Access no longer depends on one specific person at the institution.",
      },
      {
        q: "What is the minimum starting point?",
        a: "A list of users. Directory, database or spreadsheet: the assessment defines the path from what the institution already has.",
      },
      {
        q: "Where can I find the technical details?",
        a: "The technical slides gather the details of the solution for the IT team.",
        link: { label: "View the technical slides", href: "https://drive.google.com/file/d/1Ee-rq1FxYanYe9W5dVmWKoR6FVd2z8gx/view?usp=sharing" },
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
