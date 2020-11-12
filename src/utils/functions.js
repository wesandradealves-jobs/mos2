import moment from 'moment-timezone';

export const bindAll = (context, funcNames) => {
  funcNames.forEach(name => {
    context[name] = context[name].bind(context);
  });
};

export const convertUTCtoTimeZone = (date, timezone = null) => {
  const dateMoment = moment.utc(date);
  return timezone
    ? dateMoment.tz(timezone).toDate()
    : dateMoment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).toDate();
};

export const getDayOfWeek = day => {
  switch (day) {
    case 0: {
      return 'Sábado';
    }
    case 1: {
      return 'Domingo';
    }
    case 2: {
      return 'Segunda-feira';
    }
    case 3: {
      return 'Terça-feira';
    }
    case 4: {
      return 'Quarta-feira';
    }
    case 5: {
      return 'Quinta-feira';
    }
    case 6: {
      return 'Sexta-feira';
    }
    default:
      return '';
  }
};

export const getCpfNumbers = cpf =>
  cpf
    .replace(/_/g, '')
    .replace(/\./g, '')
    .replace(/-/g, '');

export const fillCpfMask = cpf =>
  `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;

export const getMobileNumbers = mobile =>
  mobile
    .replace(/_/g, '')
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/ /g, '');

export const fillMobileMask = mobile =>
  `(${mobile.slice(0, 2)}) ${mobile.slice(2, 7)}-${mobile.slice(7)}`;

export const getCepNumbers = cep => cep.replace(/_/g, '').replace(/-/g, '');

export const fillCepMask = cep => `${cep.slice(0, 5)}-${cep.slice(5)}`;

export const getMoneyFloat = value =>
  parseFloat(
    value
      .replace('R$ ', '')
      .replace('.', '')
      .replace(',', '.')
  );

export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });

export const downloadAsBlob = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';

  xhr.onload = () => {
    callback(xhr.response);
  };

  xhr.send(null);
};
