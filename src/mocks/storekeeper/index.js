import transferences from './transferences.json';
import accounts from './accounts.json';
import transactions from './transactions.json';

class StorekeeperMock {
  constructor() {
    this.transactions = transactions;
    this.transferences = transferences;
    this.accounts = accounts;
    this.balance = 50836.15;
  }
}

export default StorekeeperMock;
