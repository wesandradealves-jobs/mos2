import axios from 'axios';

import ApiError from '../errors/ApiError';

const urls = {
  sacProperty: (propertyName, mallId) =>
    `/mos/v1/facility-management/ticket-property/${propertyName}?mallId=${mallId}`,
  customerData: (clientCpf, mallId) =>
    `/mos/v1/facility-management/customers/${clientCpf}?mallId=${mallId}`,
  uploadAttachment: mallId =>
    `/mos/v1/facility-management/tickets/upload-attachment?mallId=${mallId}`,
  sendTicket: mallId => `/mos/v1/facility-management/tickets?mallId=${mallId}`,
  patchTicket: (ticketId, mallId) =>
    `/mos/v1/facility-management/tickets/${ticketId}?mallId=${mallId}`,
  sendShortTicket: mallId =>
    `/mos/v1/facility-management/short-tickets?mallId=${mallId}`,
  printTicket: (ticketId, mallId) =>
    `mos/v1/facility-management/tickets/${ticketId}/export?mallId=${mallId}`,
  getTickets: mallId => `mos/v1/facility-management/tickets?mallId=${mallId}`,
  getReasons: (mallId, parentId) =>
    `mos/v1/facility-management/ticket-property/reasons?mallId=${mallId}&parentId=${parentId}`,
  getTicket: (ticketId, mallId) =>
    `/mos/v1/facility-management/tickets/${ticketId}?mallId=${mallId}`,
};

const defaultMallId = 6;

class ApiClient {
  static backendUrl() {
    switch (process.env.REACT_APP_MODE) {
      case 'production':
        return 'https://api.spotmetrics.com';
      case 'staging':
        return 'https://staging.spotmetrics.com';
      case 'demo':
        return 'https://demo.spotmetrics.com';
      case 'localhost':
        return `http://localhost:${process.env.REACT_APP_API_PORT}`;
      default:
        return 'https://dev.spotmetrics.com';
    }
  }

  constructor() {
    this.axios = axios.create({
      baseURL: ApiClient.backendUrl(),
      headers: {
        'x-access-token': '',
      },
    });
  }

  async callApi(
    callback,
    error = {
      title: 'Requisição negada',
      message: '',
      separator: '',
    },
    genericError = {
      title: 'ATENÇÃO',
      message: 'Verifique a conexão de rede',
    }
  ) {
    try {
      const response = await callback(this);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.code) {
        let errorMessage = error.message
          ? error.message
          : err.response.data.message;
        if (error.separator) {
          errorMessage = err.response.data.message
            .split('\n')
            .reduce((acc, curr) => {
              if (curr) {
                if (acc) {
                  return `${acc}, ${curr}`;
                }
                return curr;
              }
              return acc;
            }, '');
        }
        throw new ApiError('error', error.title, errorMessage);
      }
      throw new ApiError('warning', genericError.title, genericError.message);
    }
  }

  async getData(property, mallId = defaultMallId) {
    const response = await this.axios.get(urls.sacProperty(property, mallId));
    return response.data;
  }

  /**
   *
   * @param {String} clientCpf
   * @param {Integer} mallId
   * @return {Object|false|null} dados do cliente; null se cliente inexistente; false se CPF inválido
   */
  async getCustomerData(clientCpf, mallId = defaultMallId) {
    let response;
    try {
      response = await this.axios.get(urls.customerData(clientCpf, mallId));
    } catch (error) {
      if (error.response.status === 422) {
        return false;
      }
      if (error.response.status === 404) {
        return null;
      }
      throw error;
    }
    return response.data;
  }

  async sendTicket(mallId, ticketContent) {
    let response;
    try {
      response = await this.axios.post(urls.sendTicket(mallId), ticketContent);
    } catch (error) {
      throw new Error('Error sending ticket');
    }
    return response.data.id;
  }

  async patchTicket(ticketId, mallId, ticketContent) {
    // eslint-disable-next-line no-unused-vars
    let response;
    try {
      response = await this.axios.patch(
        urls.patchTicket(ticketId, mallId),
        ticketContent
      );
    } catch (error) {
      throw new Error('Error sending ticket');
    }
    return ticketId;
  }

  async getTickets(mallId = defaultMallId) {
    let response;
    try {
      response = await this.axios.get(urls.getTickets(mallId));
    } catch (error) {
      return false;
    }
    return response.data;
  }

  async getTicket(ticketId, mallId) {
    let response;
    try {
      response = await this.axios.get(urls.getTicket(ticketId, mallId));
    } catch (error) {
      return false;
    }
    return response.data;
  }

  async sendShortTicket(mallId, ticketContent) {
    let response;
    try {
      response = await this.axios.post(
        urls.sendShortTicket(mallId),
        ticketContent
      );
    } catch (error) {
      throw new Error('Error sending ticket');
    }
    return response.data.id;
  }

  /*

  NOVOS ENDPOINTS - DANIEL

  * */

  // UTILITIES

  async uploadAttachments(files, mallId) {
    const data = new FormData();
    files.map(upload => data.append('attachments', upload, upload.name));

    return this.callApi(
      () =>
        this.axios.post(`mos/v1/facility-management/upload-attachment`, data, {
          params: {
            mallId,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
      { title: 'UPLOAD NEGADO' }
    );
  }

  // CUSTOMERS

  async searchCustomers(mallId, search) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/facility-management/customers/search`, {
          params: {
            mallId,
            search,
          },
        }),
      { title: 'BUSCA POR CLIENTES NEGADA' }
    );
  }

  async getCustomer(mallId, cpf) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/facility-management/customers/${cpf}`, {
          params: {
            mallId,
          },
        }),
      { title: 'BUSCA POR CLIENTE NEGADA' }
    );
  }

  async createCustomer(mallId, requestBody) {
    try {
      const response = await this.axios.post(
        `mos/v1/facility-management/customers`,
        requestBody,
        {
          params: {
            mallId,
          },
        }
      );
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.code) {
        throw new ApiError(
          'error',
          'CADASTRO DE CLIENTE NEGADO',
          err.response.data.message
        );
      }
      throw new ApiError('warning', 'ATENÇÃO', 'Verifique a conexão de rede');
    }
  }

  async updateCustomer(mallId, cpf, requestBody) {
    return this.callApi(
      () =>
        this.axios.patch(
          `mos/v1/facility-management/customers/${cpf}`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      { title: 'ATUALIZAÇÃO DE CLIENTE NEGADA' }
    );
  }

  // COALITION

  async listCategories(mallId) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/coalition-management/list-categories`, {
          params: {
            mallId,
          },
        }),
      { title: 'BUSCA POR CATEGORIAS NEGADA' }
    );
  }

  async searchStores(mallId, storeName) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/coalition-management/stores/search`, {
          params: {
            mallId,
            storeName,
          },
        }),
      { title: 'BUSCA POR LOJA NEGADA' }
    );
  }

  async createTag(mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.post(`mos/v1/coalition-management/tags`, requestBody, {
          params: {
            mallId,
          },
        }),
      { title: 'CADASTRO DE MULTIPLICADOR NEGADO' }
    );
  }

  async getTags(
    mallId,
    optionalParams = {
      search: null,
      page: null,
      limit: null,
      column: null,
      order: null,
      isEnabled: null,
      isExpired: null,
    }
  ) {
    return this.callApi(
      () =>
        this.axios.get('mos/v1/coalition-management/tags', {
          params: { mallId, ...optionalParams },
        }),
      { title: 'BUSCA POR MULTIPLICADORES NEGADA' }
    );
  }

  async getTag(mallId, id) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/coalition-management/tags/${id}`, {
          params: {
            mallId,
          },
        }),
      { title: 'BUSCA POR MULTIPLICADOR NEGADA' }
    );
  }

  async patchTag(mallId, id, requestBody) {
    return this.callApi(
      () =>
        this.axios.patch(
          `mos/v1/coalition-management/tags/${id}`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      { title: 'OPERAÇÃO NEGADA' }
    );
  }

  async createTransactions(mallId, cpf, requestBody) {
    return this.callApi(
      () =>
        this.axios.post(
          `mos/v1/coalition-management/transactions/clients/${cpf}`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      { title: 'CADASTRO DE NOTA NEGADO' }
    );
  }

  async createBenefit(mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.post('mos/v1/coalition-management/benefits', requestBody, {
          params: {
            mallId,
          },
        }),
      { title: 'CADASTRO DE BENEFÍCIO NEGADO' }
    );
  }

  async getRechargeableBenefitHistoricalData(id, cpf, mallId) {
    return this.callApi(
      () =>
        this.axios.get(
          `mos/v1/coalition-management/benefits/${id}/historical-data/${cpf}`,
          {
            params: {
              mallId,
            },
          }
        ),
      { title: 'BUSCA POR CARTÕES NEGADA' }
    );
  }

  async getBenefits(
    mallId,
    optionalParams = {
      search: null,
      page: null,
      limit: null,
      column: null,
      order: null,
      cpf: null,
      isEnabled: null,
    }
  ) {
    return this.callApi(
      () =>
        this.axios.get('mos/v1/coalition-management/benefits/', {
          params: {
            mallId,
            ...optionalParams,
          },
        }),
      { title: 'BUSCA POR BENEFÍCIOS NEGADA' }
    );
  }

  async getBenefit(mallId, id) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/coalition-management/benefits/${id}`, {
          params: { mallId },
        }),
      { title: 'BUSCA POR BENEFÍCIO NEGADA' }
    );
  }

  async patchBenefit(mallId, id, requestBody) {
    return this.callApi(
      () =>
        this.axios.patch(
          `mos/v1/coalition-management/benefits/${id}`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      { title: 'OPERAÇÃO NEGADA' }
    );
  }

  async redeemBenefit(mallId, benefitId, requestBody) {
    return this.callApi(
      () =>
        this.axios.post(
          `mos/v1/coalition-management/benefits/${benefitId}/redeem`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      { title: 'RESGATE NEGADO', separator: '\n' }
    );
  }

  async getStatement(
    mallId,
    cpf,
    optionalParams = { startDate: null, endDate: null }
  ) {
    return this.callApi(
      () =>
        this.axios.get(
          `mos/v1/coalition-management/customers/${cpf}/view-statement`,
          {
            params: { mallId, ...optionalParams },
          }
        ),
      { title: 'BUSCA POR EXTRATO NEGADA' }
    );
  }

  async creditOrDebitPoints(mallId, cpf, requestBody) {
    return this.callApi(
      () =>
        this.axios.post(
          `mos/v1/coalition-management/customers/${cpf}/credit-debit-points`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      { title: 'CRÉDITO/DÉBITO NEGADO' }
    );
  }

  // EMAIL BUILDER

  async getEmail(id) {
    return this.callApi(() => this.axios.get(`api/channels/email/${id}`), {
      title: 'BUSCA POR EMAILS NEGADA',
    });
  }

  async createEmail(requestBody) {
    return this.callApi(
      () => this.axios.post('api/channels/email', requestBody),
      {
        title: 'CADASTRO DE E-MAIL NEGADO',
      }
    );
  }

  async updateEmail(id, requestBody) {
    return this.callApi(
      () => this.axios.put(`api/channels/email/${id}`, requestBody),
      {
        title: 'ATUALIZACAO DE E-MAIL NEGADA',
      }
    );
  }

  async deleteEmail(id) {
    return this.callApi(
      () => this.axios.delete(`api/channels/email/undefined/${id}`),
      {
        title: 'EXCLUSAO DE E-MAIL NEGADA',
      }
    );
  }

  // LOAN

  async createLoan(mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.post('mos/v1/facility-management/loans', requestBody, {
          params: {
            mallId,
          },
        }),
      {
        title: 'CADASTRO DE EMPRÉSTIMO NEGADO',
      }
    );
  }

  async exportLoan(mallId, id, timezone) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/facility-management/loans/${id}/export`, {
          params: {
            mallId,
            timezone,
          },
          responseType: 'blob',
        }),
      {
        title: 'EXPORTAR EMPRESTIMO NEGADO',
      }
    );
  }

  async sendLoanAcceptanceTerm(mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.post(
          'mos/v1/facility-management/loans/acceptance-terms/send',
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      {
        title: 'ENVIO DE TERMO DE ACEITE NEGADO',
      }
    );
  }

  async checkLoanAcceptanceTerm(mallId, id) {
    return this.callApi(
      () =>
        this.axios.get(
          `mos/v1/facility-management/loans/acceptance-terms/${id}/check`,
          {
            params: {
              mallId,
            },
          }
        ),
      {
        title: 'BUSCA POR TERMO DE ACEITE NEGADA',
      }
    );
  }

  async getLoans(
    mallId,
    optionalParams = {
      search: null,
      page: null,
      limit: null,
      column: null,
      order: null,
      startDate: null,
      endDate: null,
    }
  ) {
    return this.callApi(
      () =>
        this.axios.get('mos/v1/facility-management/loans', {
          params: {
            mallId,
            ...optionalParams,
          },
        }),
      {
        title: 'BUSCA POR EMPRETIMOS NEGADA',
      }
    );
  }

  async getLoan(id, mallId) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/facility-management/loans/${id}`, {
          params: {
            mallId,
          },
        }),
      {
        title: 'BUSCA POR EMPRETIMO NEGADA',
      }
    );
  }

  async updateLoan(id, mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.patch(
          `mos/v1/facility-management/loans/${id}`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      {
        title: 'BUSCA POR EMPRETIMO NEGADA',
      }
    );
  }

  async getLoanItems(mallId) {
    return this.callApi(
      () =>
        this.axios.get('mos/v1/facility-management/loan-items', {
          params: {
            mallId,
          },
        }),
      {
        title: 'BUSCA POR ITENS NEGADA',
      }
    );
  }

  async getLoanItem(mallId, itemId) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/facility-management/loan-items/${itemId}`, {
          params: {
            mallId,
          },
        }),
      {
        title: 'BUSCA POR ITEM NEGADA',
      }
    );
  }

  async createLoanItem(mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.post(`mos/v1/facility-management/loan-items/`, requestBody, {
          params: {
            mallId,
          },
        }),
      {
        title: 'ATUALIZAÇÃO DE ITEM NEGADA',
      }
    );
  }

  async updateLoanItem(mallId, itemId, requestBody) {
    return this.callApi(
      () =>
        this.axios.patch(
          `mos/v1/facility-management/loan-items/${itemId}`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      {
        title: 'ATUALIZAÇÃO DE ITEM NEGADA',
      }
    );
  }

  async createLoanItemType(mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.post(
          'mos/v1/facility-management/loan-items/types',
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      {
        title: 'CADASTRO DE TIPO DE ITEM NEGADO',
      }
    );
  }

  async getLoanItemTypes(mallId) {
    return this.callApi(
      () =>
        this.axios.get('mos/v1/facility-management/loan-items/types', {
          params: {
            mallId,
          },
        }),
      {
        title: 'BUSCA POR TIPO DE ITEM NEGADA',
      }
    );
  }

  async getAvaibleLoanItemsIds(amount, mallId, typeId) {
    return this.callApi(
      () =>
        this.axios.get('mos/v1/facility-management/loan-items/available-ids', {
          params: {
            mallId,
            typeId,
            amount,
          },
        }),
      {
        title: 'BUSCA POR IDS DE ITEM DISPONIVEIS NEGADA',
      }
    );
  }

  async getLoanItemStock(mallId, typeId) {
    return this.callApi(
      () =>
        this.axios.get('mos/v1/facility-management/loan-items/stock', {
          params: {
            mallId,
            typeId,
          },
        }),
      {
        title: 'BUSCA POR ESTOQUE DE ITEM DISPONIVEIS NEGADA',
      }
    );
  }

  async deleteLoanItem(mallId, id, typeId) {
    return this.callApi(
      () =>
        this.axios.delete(`mos/v1/facility-management/loan-items/${id}`, {
          params: {
            mallId,
            typeId,
          },
        }),
      {
        title: 'EXCLUSAO DE ITEM NEGADA',
      }
    );
  }

  async getTotalLoansByDay(mallId, period, mode, typeId = null) {
    if (!mode.match(/^(stacked|grouped-sorted)$/)) {
      mode = 'stacked';
    }
    if (!period.match(/^(year|month|week|day)$/)) {
      period = 'day';
    }
    return this.callApi(() =>
      this.axios.get(
        'mos/v1/facility-management/loans/graphics/total-daily-loans',
        {
          params: {
            mallId,
            period,
            ...(typeId && { typeId }),
            mode,
          },
        }
      )
    );
  }

  async getUsagePerPeriod(mallId, period, typeId = null) {
    if (!period.match(/^(year|month|week|day)$/)) {
      period = 'day';
    }
    return this.callApi(() =>
      this.axios.get(
        'mos/v1/facility-management/loans/graphics/usage-per-period',
        {
          params: {
            mallId,
            period,
            ...(typeId && { typeId }),
          },
        }
      )
    );
  }

  async getAverageLoanTime(mallId, period, typeId = null) {
    if (!period.match(/^(year|month|week|day)$/)) {
      period = 'day';
    }
    return this.callApi(() =>
      this.axios.get(
        'mos/v1/facility-management/loans/graphics/average-loan-time',
        {
          params: {
            mallId,
            period,
            ...(typeId && { typeId }),
          },
        }
      )
    );
  }

  async getLoanStatistics(mallId, period, typeId = null) {
    if (!period.match(/^(year|month|week|day)$/)) {
      period = 'day';
    }
    return this.callApi(() =>
      this.axios.get(
        'mos/v1/facility-management/loans/graphics/loan-statistics',
        {
          params: {
            mallId,
            period,
            ...(typeId && { typeId }),
          },
        }
      )
    );
  }

  // -------------- LOST AND FOUND --------------------------

  async getLostFounds(mallId) {
    return this.callApi(
      () =>
        this.axios.get('mos/v1/facility-management/lost-founds', {
          params: {
            mallId,
          },
        }),
      {
        title: 'BUSCA POR REGISTROS NEGADA',
      }
    );
  }

  async getLostFound(id, mallId) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/facility-management/lost-founds/${id}`, {
          params: {
            mallId,
          },
        }),
      {
        title: 'BUSCA POR REGISTRO NEGADA',
      }
    );
  }

  async getLostFoundLocation(mallId) {
    return this.callApi(
      () =>
        this.axios.get(
          `mos/v1/facility-management/lost-founds/location?mallId=${mallId}`
        ),
      {
        title: 'BUSCA POR LOCALIZACOES NEGADA',
      }
    );
  }

  async getLostFoundItem(mallId) {
    return this.callApi(
      () =>
        this.axios.get(
          `mos/v1/facility-management/lost-founds/item?mallId=${mallId}`
        ),
      {
        title: 'BUSCA POR ITEM NEGADA',
      }
    );
  }

  async createLostFound(mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.post('mos/v1/facility-management/lost-founds', requestBody, {
          params: {
            mallId,
          },
        }),
      {
        title: 'CADASTRO DE REGISTRO NEGADO',
      }
    );
  }

  async updateLostFound(id, mallId, requestBody) {
    return this.callApi(
      () =>
        this.axios.patch(
          `mos/v1/facility-management/lost-founds/${id}`,
          requestBody,
          {
            params: {
              mallId,
            },
          }
        ),
      {
        title: 'ATUALIZACAO NEGADA',
      }
    );
  }

  async exportLostFound(mallId, id) {
    return this.callApi(
      () =>
        this.axios.get(`mos/v1/facility-management/lost-founds/${id}/export`, {
          params: {
            mallId,
          },
          responseType: 'blob',
        }),
      {
        title: 'EXPORTAR REGISTRO DE ACHADOS E PERDIDOS NEGADO',
      }
    );
  }

  async getLostFoundMostLostItems(mallId, period, itemId = null) {
    return this.callApi(() =>
      this.axios.get(
        'mos/v1/facility-management/lost-founds/graphics/top-item',
        {
          params: {
            mallId,
            startDate: period.startDate,
            endDate: period.endDate,
            ...(itemId && { itemId }),
          },
        }
      )
    );
  }

  async getLostFoundAverageWeeklyUsage(mallId, period, itemId = null) {
    return this.callApi(() =>
      this.axios.get(
        'mos/v1/facility-management/lost-founds/graphics/weekly-attendance',
        {
          params: {
            mallId,
            startDate: period.startDate,
            endDate: period.endDate,
            ...(itemId && { itemId }),
          },
        }
      )
    );
  }

  async getLostFoundNotWithdrawnItems(mallId, period, itemId = null) {
    return this.callApi(() =>
      this.axios.get(
        'mos/v1/facility-management/lost-founds/graphics/not-withdrawn-items',
        {
          params: {
            mallId,
            startDate: period.startDate,
            endDate: period.endDate,
            ...(itemId && { itemId }),
          },
        }
      )
    );
  }

  async getLostFoundBasicsStatistics(mallId, period, itemId = null) {
    return this.callApi(() =>
      this.axios.get('mos/v1/facility-management/lost-founds/graphics/cards', {
        params: {
          mallId,
          startDate: period.startDate,
          endDate: period.endDate,
          ...(itemId && { itemId }),
        },
      })
    );
  }

  /**
   *
   *
   * @param {Integer} mallId
   * @param {Integer} parentId
   * @return {Object|false|null} arvora de razoes;
   */
  async getReasons(mallId = defaultMallId, parentId) {
    const response = await this.axios.get(urls.getReasons(mallId, parentId));
    return response.data;
  }

  async printTicket(ticketId, mallId) {
    let response;
    try {
      response = await this.axios({
        url: urls.printTicket(ticketId, mallId),
        method: 'GET',
        responseType: 'blob',
      });
    } catch (error) {
      return false;
    }
    return response;
  }
}

export default ApiClient;
