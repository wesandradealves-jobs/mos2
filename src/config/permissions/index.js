import coalition from './modules/coalition';
import loan from './modules/loan';
import lostfound from './modules/lostfound';
import storekeeper from './modules/storekeeper';

const permissions = {
  ...coalition,
  ...loan,
  ...lostfound,
  ...storekeeper,
};

export default permissions;
