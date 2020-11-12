const sessionSpot = {
  malls: [
    {
      id: 6,
      name: 'Plaza Niteroi',
      club: false,
    },
    {
      id: 1,
      name: 'Barra Shopping',
      club: true,
    },
  ],
  user: {
    id: 8,
    registerDate: '2019-12-11 18:08:32',
    name: 'Paulo Stohler',
    cpf: '00000000000',
    email: 'paulo.stohler@spotmetrics.com',
    area: null,
    phone: null,
    malls: [
      {
        id: 6,
        name: 'Plaza Niteroi',
        club: false,
        logo:
          'https://elephant-file-storage.nyc3.digitaloceanspaces.com/public/logos/malls/barbacena.svg',
        administration: {
          name: 'Plaza Niteroi',
          logo:
            'https://elephant-file-storage.nyc3.digitaloceanspaces.com/public/logos/mall-adms/barbacena.svg',
        },
        alternativeLogo:
          'https://elephant-file-storage.nyc3.digitaloceanspaces.com/public/logos/malls/barbacena2.svg',
        roleId: 7,
        role: {
          id: 7,
          name: 'Administrador',
          permissions: [
            {
              id: 1,
              code: 'CREATE-ROLES',
              name: 'Criar novos papéis de usuários',
            },
            {
              id: 2,
              code: 'CREATE-USER',
              name: 'Criar novos usuários',
            },
            {
              id: 3,
              code: 'ACCESS-INMALVIEW',
              name: 'Visualizar área InMall View',
            },
            {
              id: 4,
              code: 'ACCESS-CUSTOMERVIEW',
              name: 'Visualizar área Customer View',
            },
            {
              id: 5,
              code: 'ACCESS-FLASH',
              name: 'Visualizar área de Flashs',
            },
            {
              id: 6,
              code: 'CREATE-FLASH',
              name: 'Criar novos Flashs',
            },
            {
              id: 7,
              code: 'REPORT-FLASH',
              name: 'Visualizar relatórios de Flash',
            },
            { id: 8, code: 'LIST-FLASH', name: 'Listar Flash' },
            { id: 9, code: 'PUBLISH-FLASH', name: 'Publicar Flash' },
            {
              id: 14,
              code: 'ACCESS-BABYCARE',
              name: 'Visualizar área de Fraldário',
            },
            {
              id: 15,
              code: 'CREATE-BABYCARE',
              name: 'Registrar nova entrada no Fraldário',
            },
            {
              id: 16,
              code: 'REPORT-BABYCARE',
              name: 'Visualizar relatórios de Fraldário',
            },
            {
              id: 17,
              code: 'LIST-BABYCARE',
              name: 'Listar Fraldário',
            },
            {
              id: 18,
              code: 'ACCESS-VIPROOM',
              name: 'Visualizar área de Sala Vip',
            },
            {
              id: 19,
              code: 'CREATE-VIPROOM',
              name: 'Registrar nova entrada na Sala Vip',
            },
            {
              id: 20,
              code: 'REPORT-VIPROOM',
              name: 'Visualizar relatórios de Sala Vip',
            },
            { id: 21, code: 'LIST-VIPROOM', name: 'Listar Sala Vip' },
            {
              id: 22,
              code: 'ACCESS-CAMPAIGN',
              name: 'Visualizar área de Campanhas',
            },
            {
              id: 23,
              code: 'CREATE-CAMPAIGN',
              name: 'Criar novas Campanhas',
            },
            {
              id: 24,
              code: 'REPORT-CAMPAIGN',
              name: 'Visualizar relatórios de Campanhas',
            },
            {
              id: 25,
              code: 'LIST-CAMPAIGN',
              name: 'Listar Campanhas',
            },
            {
              id: 26,
              code: 'PUBLISH-CAMPAIGN',
              name: 'Publicar Campanha',
            },
            {
              id: 27,
              code: 'ACCESS-SETTINGS',
              name: 'Visualizar área de Configuração',
            },
            {
              id: 28,
              code: 'SETTINGS-STORES',
              name: 'Gerenciar Lojas',
            },
            {
              id: 29,
              code: 'SETTINGS-TARGETINGS',
              name: 'Gerenciar Segmentos do Clube',
            },
            {
              id: 30,
              code: 'ACCESS-COUPONS',
              name: 'Visualizar a área de aprovação de cupons',
            },
            {
              id: 31,
              code: 'APPROVE-COUPONS',
              name: 'Aprovar/Negar cupons',
            },
            {
              id: 32,
              code: 'ACCESS-INSTOREVIEW',
              name: 'Visualizar Área InStore View',
            },
            {
              id: 10,
              code: 'ACCESS-CUSTOMERSERVICE',
              name: 'Visualizar área de SAC',
            },
            {
              id: 11,
              code: 'CREATE-CUSTOMERSERVICE',
              name: 'Registrar nova entrada do SAC',
            },
            {
              id: 12,
              code: 'REPORT-CUSTOMERSERVICE',
              name: 'Visualizar relatórios de SAC',
            },
            {
              id: 13,
              code: 'LIST-CUSTOMERSERVICE',
              name: 'Listar SAC',
            },
            {
              id: 58,
              code: 'ACCESS-COALITION',
              name: 'Visualizar a área de coalizão',
            },
            {
              id: 59,
              code: 'CREATE-TRANSACTION-COALITION',
              name: 'Criar transação',
            },
            {
              id: 60,
              code: 'REDEEM-BENEFIT-COALITION',
              name: 'Resgatar benefício',
            },
            {
              id: 61,
              code: 'CREDIT-DEBIT-POINTS-COALITION',
              name: 'Creditar ou Debitar pontos do saldo de coalizão',
            },
            {
              id: 62,
              code: 'VIEW-CUSTOMER-STATEMENT-COALITION',
              name: 'Visualizar extrato da carteira de coalizão',
            },
            {
              id: 63,
              code: 'CREATE-CUSTOMER-COALITION',
              name: 'Cadastrar cliente',
            },
            {
              id: 64,
              code: 'CONFIG-COALITION',
              name: 'Configurar coalizão',
            },
            {
              id: 64,
              code: 'CREATE-LOST-FOUND',
              name: 'Criar achados e perdidos',
            },
            {
              id: 65,
              code: 'REPORT-LOST-FOUND',
              name: 'Relatorio de coalizão',
            },
            {
              id: 66,
              code: 'LIST-LOST-FOUND',
              name: 'Listar coalizão',
            },
            {
              id: 67,
              code: 'STATEMENT-STORE-AREA',
              name: 'Transacoes lojista',
            },
            {
              id: 68,
              code: 'CONCILIATION-STORE-AREA',
              name: 'Concialiacao lojista',
            },
            {
              id: 69,
              code: 'TRANSFER-STORE-AREA',
              name: 'Transferencia lojista',
            },
            {
              id: 66,
              code: 'CREATE-LOAN',
              name: 'Criar emprestimo',
            },
            {
              id: 67,
              code: 'REPORT-LOAN',
              name: 'Relatorio de emprestimo',
            },
            {
              id: 68,
              code: 'LIST-LOAN',
              name: 'Listar emprestimo',
            },
            {
              id: 69,
              code: 'CREATE-LOAN-ITEM',
              name: 'Criar item de emprestimo',
            },
          ],
        },
      },
      {
        id: 1,
        name: 'Barra Shopping',
        club: true,
        role: {
          id: 7,
          name: 'Administrador',
          permissions: [
            {
              id: 1,
              code: 'CREATE-ROLES',
              name: 'Criar novos papéis de usuários',
            },
            {
              id: 2,
              code: 'CREATE-USER',
              name: 'Criar novos usuários',
            },
            {
              id: 3,
              code: 'ACCESS-INMALVIEW',
              name: 'Visualizar área InMall View',
            },
            {
              id: 4,
              code: 'ACCESS-CUSTOMERVIEW',
              name: 'Visualizar área Customer View',
            },
            {
              id: 5,
              code: 'ACCESS-FLASH',
              name: 'Visualizar área de Flashs',
            },
            {
              id: 6,
              code: 'CREATE-FLASH',
              name: 'Criar novos Flashs',
            },
            {
              id: 7,
              code: 'REPORT-FLASH',
              name: 'Visualizar relatórios de Flash',
            },
            { id: 8, code: 'LIST-FLASH', name: 'Listar Flash' },
            { id: 9, code: 'PUBLISH-FLASH', name: 'Publicar Flash' },
            {
              id: 14,
              code: 'ACCESS-BABYCARE',
              name: 'Visualizar área de Fraldário',
            },
            {
              id: 15,
              code: 'CREATE-BABYCARE',
              name: 'Registrar nova entrada no Fraldário',
            },
            {
              id: 16,
              code: 'REPORT-BABYCARE',
              name: 'Visualizar relatórios de Fraldário',
            },
            {
              id: 17,
              code: 'LIST-BABYCARE',
              name: 'Listar Fraldário',
            },
            {
              id: 18,
              code: 'ACCESS-VIPROOM',
              name: 'Visualizar área de Sala Vip',
            },
            {
              id: 19,
              code: 'CREATE-VIPROOM',
              name: 'Registrar nova entrada na Sala Vip',
            },
            {
              id: 20,
              code: 'REPORT-VIPROOM',
              name: 'Visualizar relatórios de Sala Vip',
            },
            { id: 21, code: 'LIST-VIPROOM', name: 'Listar Sala Vip' },
            {
              id: 22,
              code: 'ACCESS-CAMPAIGN',
              name: 'Visualizar área de Campanhas',
            },
            {
              id: 23,
              code: 'CREATE-CAMPAIGN',
              name: 'Criar novas Campanhas',
            },
            {
              id: 24,
              code: 'REPORT-CAMPAIGN',
              name: 'Visualizar relatórios de Campanhas',
            },
            {
              id: 25,
              code: 'LIST-CAMPAIGN',
              name: 'Listar Campanhas',
            },
            {
              id: 26,
              code: 'PUBLISH-CAMPAIGN',
              name: 'Publicar Campanha',
            },
            {
              id: 27,
              code: 'ACCESS-SETTINGS',
              name: 'Visualizar área de Configuração',
            },
            {
              id: 28,
              code: 'SETTINGS-STORES',
              name: 'Gerenciar Lojas',
            },
            {
              id: 29,
              code: 'SETTINGS-TARGETINGS',
              name: 'Gerenciar Segmentos do Clube',
            },
            {
              id: 30,
              code: 'ACCESS-COUPONS',
              name: 'Visualizar a área de aprovação de cupons',
            },
            {
              id: 31,
              code: 'APPROVE-COUPONS',
              name: 'Aprovar/Negar cupons',
            },
            {
              id: 32,
              code: 'ACCESS-INSTOREVIEW',
              name: 'Visualizar Área InStore View',
            },
            {
              id: 10,
              code: 'ACCESS-CUSTOMERSERVICE',
              name: 'Visualizar área de SAC',
            },
            {
              id: 11,
              code: 'CREATE-CUSTOMERSERVICE',
              name: 'Registrar nova entrada do SAC',
            },
            {
              id: 12,
              code: 'REPORT-CUSTOMERSERVICE',
              name: 'Visualizar relatórios de SAC',
            },
            {
              id: 13,
              code: 'LIST-CUSTOMERSERVICE',
              name: 'Listar SAC',
            },
            {
              id: 58,
              code: 'ACCESS-COALITION',
              name: 'Visualizar a área de coalizão',
            },
            {
              id: 59,
              code: 'CREATE-TRANSACTION-COALITION',
              name: 'Criar transação',
            },
            {
              id: 60,
              code: 'REDEEM-BENEFIT-COALITION',
              name: 'Resgatar benefício',
            },
            {
              id: 61,
              code: 'CREDIT-DEBIT-POINTS-COALITION',
              name: 'Creditar ou Debitar pontos do saldo de coalizão',
            },
            {
              id: 62,
              code: 'VIEW-CUSTOMER-STATEMENT-COALITION',
              name: 'Visualizar extrato da carteira de coalizão',
            },
            {
              id: 63,
              code: 'CREATE-CUSTOMER-COALITION',
              name: 'Cadastrar cliente',
            },
            {
              id: 64,
              code: 'CONFIG-COALITION',
              name: 'Configurar coalizão',
            },
          ],
        },
      },
    ],
  },
};

export default sessionSpot;
