import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import AsyncSelect from 'react-select/async';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import MaskedInput from 'react-text-mask';

import MyFileSelector from '../../../components/my-fileselector';
import loanTerm from '../../../assets/docs/LoanTerm.pdf';

import {
  cpf as cpfMask,
  cep as cepMask,
  phone as phoneMask,
} from '../../../utils/masks';

import { itemStatus } from '../../../config/lostfound';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';

import {
  validateCpf,
  validateMobileNumber,
  validateCep,
} from '../../../utils/validators';
import {
  getCpfNumbers,
  getMobileNumbers,
  getCepNumbers,
  fillCepMask,
  fillMobileMask,
} from '../../../utils/functions';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const api = new ApiClient();
const popUp = new PopUp();

const identification = ['Cliente', 'Funcionário', 'Não Identificado'];

const ValidationSchema = Yup.object().shape({
  mall: Yup.string().required(),
  cpf: Yup.string().when('foundBy', {
    is: foundBy => foundBy !== 'Não Identificado',
    then: Yup.string().test('validate cpf', '', validateCpf),
  }),
  zipCode: Yup.string().when('foundBy', {
    is: 'Cliente',
    then: Yup.string().test('min cep', '', validateCep),
  }),
  sex: Yup.string().when('foundBy', {
    is: 'Cliente',
    then: Yup.string()
      .required()
      .oneOf(['F', 'M', 'O']),
  }),
  birthday: Yup.string().when('foundBy', {
    is: 'Cliente',
    then: Yup.string().required(),
  }),
  fullName: Yup.string().when('foundBy', {
    is: foundBy => foundBy !== 'Não Identificado',
    then: Yup.string().required(),
  }),
  email: Yup.string().when('foundBy', {
    is: 'Cliente',
    then: Yup.string()
      .email()
      .required(),
  }),
  mobileNumber: Yup.string().when('foundBy', {
    is: 'Cliente',
    then: Yup.string().test('validate mobile', '', validateMobileNumber),
  }),
  dataUsageAcceptanceChannel: Yup.string().when('foundBy', {
    is: 'Cliente',
    then: Yup.string().oneOf(['email', 'sms', 'print']),
  }),
  store: Yup.object().when('foundBy', {
    is: 'Funcionário',
    then: Yup.object().required(),
  }),
  observation: Yup.string(),
  item: Yup.string().test('not default', '', item => item !== 'DEFAULT'),
  itemName: Yup.string().when('item', {
    is: 'other',
    then: Yup.string().required(),
  }),
  description: Yup.string().required(),
  status: Yup.string()
    .required()
    .oneOf(['excellent', 'good', 'damaged']),
  location: Yup.number().required(),
  photos: Yup.array().required(),
});

const NewOccurrence = () => {
  const fileSelectorRef = useRef(null);

  const { malls, employee } = useSession();
  const { mallId, setMallId, isMallWithClub } = useMall();

  const [customerSearch, setCustomerSearch] = useState('');
  const [newCustomer, setNewCustomer] = useState('');

  const [clubCategory, setClubCategory] = useState(false);
  const [cluster, setCluster] = useState(false);

  const [itens, setItens] = useState([]);
  const [locations, setLocations] = useState([]);
  const [foundBy, setFoundBy] = useState('Cliente');
  const [photoFiles, setPhotoFiles] = useState([]);

  const [item, setItem] = useState();

  const [acceptanceTermId, setAcceptanceTermId] = useState('');

  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    control,
    clearError,
    setError,
  } = useForm({
    validationSchema: ValidationSchema,
    mode: 'onBlur',
    defaultValues: {
      store: null,
      dataUsageAcceptanceChannel: 'DEFAULT',
    },
  });

  useEffect(() => register({ name: 'photos' }), [register]);

  const clearCustomerInputs = useCallback(() => {
    setValue('zipCode', '');
    setValue('fullName', '');
    setValue('sex', 'DEFAULT');
    setValue('birthday', '');
    setValue('email', '');
    setValue('mobileNumber', '');

    setClubCategory(false);
    setCluster(false);
    setValue('dataUsageAcceptanceChannel', 'DEFAULT');
  }, [setValue]);

  const clearFields = useCallback(() => {
    setValue('cpf', '');
    clearCustomerInputs();
    setValue('store', null);
    setValue('observation', '');
    setValue('item', 'DEFAULT');
    setValue('description', '');
    setValue('location', 'DEFAULT');
    setValue('status', 'DEFAULT');

    fileSelectorRef.current.clearFiles();
    setValue('photos', []);
    clearError('photos');
  }, [clearCustomerInputs, clearError, setValue]);

	// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
	const top100Films = [
	  { title: 'The Shawshank Redemption', year: 1994 },
	  { title: 'The Godfather', year: 1972 },
	  { title: 'The Godfather: Part II', year: 1974 },
	  { title: 'The Dark Knight', year: 2008 },
	  { title: '12 Angry Men', year: 1957 },
	  { title: "Schindler's List", year: 1993 },
	  { title: 'Pulp Fiction', year: 1994 },
	  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
	  { title: 'The Good, the Bad and the Ugly', year: 1966 },
	  { title: 'Fight Club', year: 1999 },
	  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
	  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
	  { title: 'Forrest Gump', year: 1994 },
	  { title: 'Inception', year: 2010 },
	  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
	  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
	  { title: 'Goodfellas', year: 1990 },
	  { title: 'The Matrix', year: 1999 },
	  { title: 'Seven Samurai', year: 1954 },
	  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
	  { title: 'City of God', year: 2002 },
	  { title: 'Se7en', year: 1995 },
	  { title: 'The Silence of the Lambs', year: 1991 },
	  { title: "It's a Wonderful Life", year: 1946 },
	  { title: 'Life Is Beautiful', year: 1997 },
	  { title: 'The Usual Suspects', year: 1995 },
	  { title: 'Léon: The Professional', year: 1994 },
	  { title: 'Spirited Away', year: 2001 },
	  { title: 'Saving Private Ryan', year: 1998 },
	  { title: 'Once Upon a Time in the West', year: 1968 },
	  { title: 'American History X', year: 1998 },
	  { title: 'Interstellar', year: 2014 },
	  { title: 'Casablanca', year: 1942 },
	  { title: 'City Lights', year: 1931 },
	  { title: 'Psycho', year: 1960 },
	  { title: 'The Green Mile', year: 1999 },
	  { title: 'The Intouchables', year: 2011 },
	  { title: 'Modern Times', year: 1936 },
	  { title: 'Raiders of the Lost Ark', year: 1981 },
	  { title: 'Rear Window', year: 1954 },
	  { title: 'The Pianist', year: 2002 },
	  { title: 'The Departed', year: 2006 },
	  { title: 'Terminator 2: Judgment Day', year: 1991 },
	  { title: 'Back to the Future', year: 1985 },
	  { title: 'Whiplash', year: 2014 },
	  { title: 'Gladiator', year: 2000 },
	  { title: 'Memento', year: 2000 },
	  { title: 'The Prestige', year: 2006 },
	  { title: 'The Lion King', year: 1994 },
	  { title: 'Apocalypse Now', year: 1979 },
	  { title: 'Alien', year: 1979 },
	  { title: 'Sunset Boulevard', year: 1950 },
	  { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
	  { title: 'The Great Dictator', year: 1940 },
	  { title: 'Cinema Paradiso', year: 1988 },
	  { title: 'The Lives of Others', year: 2006 },
	  { title: 'Grave of the Fireflies', year: 1988 },
	  { title: 'Paths of Glory', year: 1957 },
	  { title: 'Django Unchained', year: 2012 },
	  { title: 'The Shining', year: 1980 },
	  { title: 'WALL·E', year: 2008 },
	  { title: 'American Beauty', year: 1999 },
	  { title: 'The Dark Knight Rises', year: 2012 },
	  { title: 'Princess Mononoke', year: 1997 },
	  { title: 'Aliens', year: 1986 },
	  { title: 'Oldboy', year: 2003 },
	  { title: 'Once Upon a Time in America', year: 1984 },
	  { title: 'Witness for the Prosecution', year: 1957 },
	  { title: 'Das Boot', year: 1981 },
	  { title: 'Citizen Kane', year: 1941 },
	  { title: 'North by Northwest', year: 1959 },
	  { title: 'Vertigo', year: 1958 },
	  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
	  { title: 'Reservoir Dogs', year: 1992 },
	  { title: 'Braveheart', year: 1995 },
	  { title: 'M', year: 1931 },
	  { title: 'Requiem for a Dream', year: 2000 },
	  { title: 'Amélie', year: 2001 },
	  { title: 'A Clockwork Orange', year: 1971 },
	  { title: 'Like Stars on Earth', year: 2007 },
	  { title: 'Taxi Driver', year: 1976 },
	  { title: 'Lawrence of Arabia', year: 1962 },
	  { title: 'Double Indemnity', year: 1944 },
	  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
	  { title: 'Amadeus', year: 1984 },
	  { title: 'To Kill a Mockingbird', year: 1962 },
	  { title: 'Toy Story 3', year: 2010 },
	  { title: 'Logan', year: 2017 },
	  { title: 'Full Metal Jacket', year: 1987 },
	  { title: 'Dangal', year: 2016 },
	  { title: 'The Sting', year: 1973 },
	  { title: '2001: A Space Odyssey', year: 1968 },
	  { title: "Singin' in the Rain", year: 1952 },
	  { title: 'Toy Story', year: 1995 },
	  { title: 'Bicycle Thieves', year: 1948 },
	  { title: 'The Kid', year: 1921 },
	  { title: 'Inglourious Basterds', year: 2009 },
	  { title: 'Snatch', year: 2000 },
	  { title: '3 Idiots', year: 2009 },
	  { title: 'Monty Python and the Holy Grail', year: 1975 },
	];  

  useEffect(() => {
    const loadCustomer = async () => {
      clearCustomerInputs();
      clearError();

      if (!customerSearch || customerSearch.length !== 11) {
        return;
      }

      let customerFound;
      try {
        customerFound = await api.getCustomer(mallId, customerSearch);
        setNewCustomer(false);
      } catch {
        setNewCustomer(true);
        return;
      }

      customerFound.zipCode &&
        setValue('zipCode', fillCepMask(customerFound.zipCode));
      setValue('fullName', customerFound.fullName);
      setValue('sex', customerFound.sex);
      setValue('birthday', customerFound.birthday);
      setValue('email', customerFound.email);
      customerFound.mobileNumber &&
        setValue('mobileNumber', fillMobileMask(customerFound.mobileNumber));

      isMallWithClub
        ? setClubCategory(customerFound.category)
        : setCluster(customerFound.cluster);
    };
    loadCustomer();
  }, [
    clearCustomerInputs,
    clearError,
    customerSearch,
    isMallWithClub,
    mallId,
    setValue,
  ]);

  const getTextWidth = (el) => {
	  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	  var context = canvas.getContext("2d");
	  var font = window.getComputedStyle(el, null).getPropertyValue('font');
	  var text = el.value;
	  context.font = font;
	  var textMeasurement = context.measureText(text);
	  return textMeasurement.width;
  };     

  useEffect(() => {
  	let i = document.getElementsByClassName('MuiAutocomplete-inputRoot')[0];
  	let x = document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];

  	x.style.visibility = item ? "visible" : "hidden";
	i.style.boxShadow = item ? "1px 2px 1px #00000045" : '';
	i.style.backgroundColor = item ? "white" : '';  	

	i.addEventListener('input', function(e) {
	  var width = Math.floor(getTextWidth(e.target));
	  var widthInPx = (width + 10) + "px";
	  e.target.style.width = widthInPx;
	}, false);
  }, [item]);  

  useEffect(() => {
    if (mallId) {
      api
        .getLostFoundLocation(mallId)
        .then(data => setLocations(data))
        .catch(() => setLocations([]));
    }
  }, [mallId]);

  useEffect(() => {
    if (mallId) {
      api
        .getLostFoundItem(mallId)
        .then(data => setItens(data))
        .catch(() => setItens([]));
    }
  }, [mallId]);

  const handleFoundByChange = useCallback(
    event => {
      setFoundBy(event.target.value);
      setCustomerSearch('');
      setValue('cpf', '');
      clearError();
    },
    [clearError, setValue]
  );

  const handleCpfChange = useCallback(
    event => setCustomerSearch(getCpfNumbers(event.target.value)),
    []
  );

  const handleCpfLostFocus = useCallback(
    event => {
      if (watch('fullName') === '') {
        setCustomerSearch(getCpfNumbers(event.target.value));
      }
    },
    [watch]
  );

  const handleMallChange = useCallback(event => setMallId(event.target.value), [
    setMallId,
  ]);

  const storeOptions = useCallback(
    (inputValue, callback) => {
      if (mallId && inputValue.length >= 1) {
        api.searchStores(mallId, inputValue).then(response => {
          callback(response);
        });
        return true;
      }
      callback([]);
      return true;
    },
    [mallId]
  );

  const handleDataUsageAcceptanceChannelChange = useCallback(event => {
    if (event.target.value === 'print') {
      window.open(loanTerm);
    }
  }, []);

  const handleSendDataUsageAcceptanceTermClick = useCallback(() => {
    const channel = watch('dataUsageAcceptanceChannel');
    const email = watch('email') || '';
    const mobileNumber = watch('mobileNumber') || '';

    if (channel === 'email' && email === '') {
      setError('email', 'required');
      return;
    }
    if (channel === 'sms' && mobileNumber === '') {
      setError('mobileNumber', 'required');
      return;
    }

    popUp.processPromises(
      'Enviando termo...',
      api.sendDataUsageAcceptanceTerm(mallId, {
        channel,
        ...(channel === 'email' && { email }),
        ...(channel === 'sms' && {
          mobileNumber: getMobileNumbers(mobileNumber),
        }),
      }),
      {
        successCallback: ({ id }) => {
          setAcceptanceTermId(id);
        },
        successMsg: `Termo enviado com sucesso. Aguarde o aceite do cliente para liberar o registro do item.`,
        successMsgTime: 3000,
      }
    );
  }, [watch, mallId, setError]);

  const getAvatar = useCallback(name => {
    if (name) {
      const fullNameSplitted = name.split(' ');
      const firstLetter = fullNameSplitted[0].charAt(0);
      const secontLetter = fullNameSplitted[fullNameSplitted.length - 1].charAt(
        0
      );
      return firstLetter + secontLetter;
    }
    return '--';
  }, []);

  const handleObservationChange = useCallback(element => {
    element.target.style.height = '45px';
    element.target.style.height = `${element.target.scrollHeight}px`;
  }, []);

  const handleFilesChange = useCallback(
    files => {
      setPhotoFiles(files);
      setValue('photos', files);
      files.length > 0 ? clearError('photos') : setError('photos', 'required');
    },
    [clearError, setError, setValue]
  );

  const printLostFound = useCallback(
    async lostFoundId => {
      const result = await api.exportLostFound(mallId, lostFoundId);
      const retrievedPDF = new Blob([result], {
        type: 'application/pdf',
      });
      const url = window.URL.createObjectURL(retrievedPDF);
      window.open(url);
    },
    [mallId]
  );

  const saveLostFound = useCallback(
    async (formData, termId, dataUsageChannel) => {
      const save = async () => {
        const photos = await api.uploadAttachments(photoFiles, mallId);

        const lostFound = {
          ...(watch('item') !== 'other' && {
            itemId: parseInt(formData.item, 10),
          }),
          ...(watch('item') === 'other' && { itemName: formData.itemName }),
          observation: formData.observation,
          locationId: parseInt(formData.location, 10),
          description: formData.description,
          status: formData.status,
          photos: photos.map(photo => photo.url),
          employeeId: employee.id,
        };

        let customer = null;
        let employeeWhoFound = null;

        if (formData.foundBy === 'Cliente') {
          customer = {
            cpf: getCpfNumbers(formData.cpf),
            mobileNumber: getMobileNumbers(formData.mobileNumber),
            fullName: formData.fullName,
            sex: formData.sex,
            birthday: formData.birthday,
            zipCode: getCepNumbers(formData.zipCode),
            email: formData.email,
            ...(formData.clubDesire === 'yes' && {
              clubAcceptanceChannel:
                dataUsageChannel === 'print' ? 'email' : dataUsageChannel,
            }),
            ...(termId && { dataAcceptanceTermId: termId }),
          };
        }

        if (formData.foundBy === 'Funcionário') {
          employeeWhoFound = {
            companyName: formData.store.name,
            cpf: getCpfNumbers(formData.cpf),
            fullName: formData.fullName,
          };
        }

        const occurrence = {
          lostFound,
          ...(customer && { customer }),
          ...(employeeWhoFound && {
            employee: employeeWhoFound,
          }),
        };

        return api.createLostFound(mallId, occurrence);
      };

      popUp.processPromises('Salvando registro...', save(), {
        successCallback: ({ id }) => {
          clearFields();
          setTimeout(
            () =>
              popUp.showConfirmation(
                `Protocolo nº${id} salvo. Deseja imprimir?`,
                () => popUp.processPromises('Imprimindo...', printLostFound(id))
              ),
            1500
          );
        },
        successMsg: 'REGISTRO CONCLUÍDO COM SUCESSO',
      });
    },
    [clearFields, employee.id, mallId, photoFiles, printLostFound, watch]
  );

  const saveLostFoundClick = useCallback(
    async formData => {
      if (formData.dataUsageAcceptanceChannel === 'print') {
        const { id } = await api.sendDataUsageAcceptanceTerm(mallId, {
          channel: 'print',
        });
        saveLostFound(formData, id, 'print');
        return;
      }

      let termId = acceptanceTermId;
      let accepted = false;

      if (termId) {
        ({ accepted } = await api.checkDataUsageAcceptanceTerm(mallId, termId));
      }

      if (accepted || !newCustomer) {
        saveLostFound(formData, termId, formData.dataUsageAcceptanceChannel);
      } else {
        popUp.showConfirmation(
          'Cliente não aceitou os termos. Aguarde sua aceitação via E-mail/SMS ou imprima para uma aprovação manual.',
          async () => {
            ({ id: termId } = await api.sendDataUsageAcceptanceTerm(mallId, {
              channel: 'print',
            }));
            saveLostFound(formData, termId, 'print');
          },
          'IMPRIMIR',
          'AGUARDAR'
        );
      }
    },
    [acceptanceTermId, mallId, newCustomer, saveLostFound]
  );

  const ClubChoice = useMemo(() => {
    let text;
    let src;

    if (clubCategory || cluster) {
      if (cluster) {
        switch (cluster) {
          case 'suspect':
            src = '/icons/customer-category-icons/suspect.svg';
            text = 'Cliste Suspect';
            break;
          case 'prospect':
            src = '/icons/customer-category-icons/prospect.svg';
            text = 'Cliente Prospect';
            break;
          case 'active':
            src = '/icons/customer-category-icons/active.svg';
            text = 'Cliente Ativo';
            break;
          default:
            src = '';
            text = '';
        }
      }
      if (clubCategory) {
        src = clubCategory.uri;
        text = `Cliente ${clubCategory.name}`;
      }

      return (
        <div className="form-input already-client">
          {isMallWithClub && (
            <label className="label-input">Cliente já faz parte do clube</label>
          )}
          <div>
            <img src={src} alt="Category" />
            <label className="label-input">{text}</label>
          </div>
        </div>
      );
    }

    if (isMallWithClub) {
      return (
        <>
          <label className="label-input club-desire form-input active">
            Cliente deseja fazer parte do clube?
          </label>
          <Row className="radio-buttons-container">
            <Col
              md={3}
              className="radio-button-container"
              id="club-desire-choice"
            >
              <label className="checkbox">
                <input
                  type="radio"
                  name="clubDesire"
                  ref={register}
                  value="yes"
                  defaultChecked
                />
                <span className="checkmark" />
                <span className="radio-label-text">Sim</span>
              </label>
            </Col>

            <Col md={3} className="radio-button-container">
              <label className="checkbox">
                <input
                  type="radio"
                  name="clubDesire"
                  ref={register}
                  value="no"
                />
                <span className="checkmark" />
                <span className="radio-label-text">Não</span>
              </label>
            </Col>
          </Row>
        </>
      );
    }
    return <></>;
  }, [clubCategory, cluster, isMallWithClub, register]);

  const employeeForm = useMemo(() => {
    return (
      <>
        <Row>
          <Col lg={6} xs={12}>
            <label className="label-input form-input">CPF*</label>
            <MaskedInput
              name="cpf"
              mask={cpfMask}
              ref={t => t && register(t.inputElement)}
              onChange={handleCpfChange}
              type="text"
              className={`${errors.cpf ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
          <Col lg={6} xs={12}>
            <label className="label-input form-input">Nome da Loja*</label>
            <Controller
              as={<AsyncSelect />}
              control={control}
              name="store"
              className="basic-multi-select"
              loadOptions={_.debounce(storeOptions, 500)}
              getOptionLabel={option => option.name}
              getOptionValue={option => option}
              loadingMessage={() => 'Carregando'}
              noOptionsMessage={() => 'Sem opção'}
              cacheOptions
              isClearable
              styles={{
                control: base => ({
                  ...base,
                  borderColor: errors.store
                    ? '#c53030 !important'
                    : watch('store') && '#54bbab !important',
                }),
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} xs={12}>
            <label className="label-input form-input">
              Nome do Funcionário*
            </label>
            <input
              type="text"
              name="fullName"
              ref={register}
              className={`${errors.fullName ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
      </>
    );
  }, [
    control,
    errors.store,
    errors.cpf,
    errors.fullName,
    handleCpfChange,
    register,
    storeOptions,
    watch,
  ]);

  const clientOrUnidentifiedForm = useMemo(() => {
    return (
      <>
          <Row>
            <Col md={12} xs={12}>
              	<label className="label-input form-input">ITEM*</label>
			    <Autocomplete
	               className={`${
	                  errors.item
	                    ? 'coaliton-form-error'
	                    : watch('item') &&
	                      watch('item') !== 'DEFAULT' &&
	                      ' -selected'
	                }`}			    
			      name="item"
			      onChange={(event, val) => {
			        setItem(val);
			      }}
			      autoSelect={true}
			      autoComplete={true}
			      options={itens}
			      getOptionLabel={(option) => option.name}
			      renderInput={(params) => <TextField {...params} />}
			    />              
            </Col>
          </Row>          
          <Row>
            <Col lg={6} md={6}>
              <label className="label-input form-input">STATUS DO ITEM*</label>
              <select
                ref={register}
                name="status"
                className={`${
                  errors.status
                    ? 'coaliton-form-error'
                    : watch('status') !== 'DEFAULT' && ' -selected'
                }`}
                defaultValue="DEFAULT"
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>
                {Object.entries(itemStatus).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value}
                  </option>
                ))}
              </select>
            </Col>
            <Col lg={6} md={6}>
              <label className="label-input form-input">LOCAL ACHADO*</label>
              <select
                ref={register}
                defaultValue="DEFAULT"
                name="location"
                className={`${
                  errors.location
                    ? 'coaliton-form-error'
                    : watch('location') !== 'DEFAULT' && ' -selected'
                }`}
              >
                <option disabled value="DEFAULT">
                  -- Selecione --
                </option>
                {locations.map(location => (
                  <option value={location.id} key={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
      </>
    );
  }, [
    handleCpfChange,
    handleCpfLostFocus,
    errors.cpf,
    errors.zipCode,
    errors.fullName,
    errors.sex,
    errors.birthday,
    errors.email,
    errors.mobileNumber,
    errors.dataUsageAcceptanceChannel,
    foundBy,
    register,
    watch,
    ClubChoice,
    newCustomer,
    isMallWithClub,
    clubCategory,
    handleDataUsageAcceptanceChannelChange,
    handleSendDataUsageAcceptanceTermClick,
  ]);  

  const ClientForm = useMemo(() => {
    return (
      <>
        <Row>
          <Col lg={6} xs={12}>
            <label className="label-input form-input">CPF*</label>
            <MaskedInput
              name="cpf"
              mask={cpfMask}
              ref={t => t && register(t.inputElement)}
              onChange={handleCpfChange}
              onBlur={handleCpfLostFocus}
              type="text"
              className={`${errors.cpf ? 'coaliton-form-error' : ''}`}
              required
              disabled={foundBy === 'Não Identificado'}
            />
          </Col>
          <Col>
            <label className="label-input form-input">CEP*</label>
            <MaskedInput
              ref={t => t && register(t.inputElement)}
              defaultValue=""
              mask={cepMask}
              disabled={foundBy === 'Não Identificado'}
              type="text"
              name="zipCode"
              className={`${errors.zipCode ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} xs={12}>
            <label className="label-input form-input">
              {foundBy === 'Funcionário' ? 'Nome do Funcionário*' : 'Nome*'}
            </label>
            <input
              type="text"
              name="fullName"
              disabled={foundBy === 'Não Identificado'}
              ref={register}
              className={`${errors.fullName ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row lg={12} md={12}>
          <Col lg={6} xs={12}>
            <label className="label-input form-input">Gênero*</label>
            <select
              name="sex"
              disabled={foundBy === 'Não Identificado'}
              ref={register}
              defaultValue="DEFAULT"
              className={`${
                errors.sex
                  ? 'coaliton-form-error'
                  : watch('sex') && watch('sex') !== 'DEFAULT' && ' -selected'
              }`}
            >
              <option value="DEFAULT" disabled>
                -- Selecione --
              </option>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
              <option value="O">Outros</option>
            </select>
          </Col>
          <Col lg={6} xs={12}>
            <label className="label-input form-input">
              Data de Nascimento*
            </label>
            <input
              type="date"
              name="birthday"
              disabled={foundBy === 'Não Identificado'}
              ref={register}
              className={`${errors.birthday ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row lg={12} md={12}>
          <Col lg={6} xs={12}>
            <label className="label-input form-input">E-mail*</label>
            <input
              type="text"
              name="email"
              disabled={foundBy === 'Não Identificado'}
              ref={register}
              className={`${errors.email ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
          <Col lg={6} xs={12}>
            <label className="label-input form-input">Telefone*</label>
            <MaskedInput
              ref={t => t && register(t.inputElement)}
              mask={phoneMask}
              disabled={foundBy === 'Não Identificado'}
              type="text"
              name="mobileNumber"
              className={`${errors.mobileNumber ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            {ClubChoice}
          </Col>
          <Col lg={6} xs={12}>
            {(newCustomer || (isMallWithClub && !clubCategory)) && (
              <>
                <label className="label-input form-input">ENVIAR TERMOS*</label>
                <div className="lostfound-acceptance-channel">
                  <select
                    name="dataUsageAcceptanceChannel"
                    ref={register}
                    defaultValue="DEFAULT"
                    disabled={foundBy === 'Não Identificado'}
                    className={`${
                      errors.dataUsageAcceptanceChannel
                        ? 'coaliton-form-error'
                        : watch('dataUsageAcceptanceChannel') &&
                          watch('dataUsageAcceptanceChannel') !== 'DEFAULT' &&
                          ' -selected'
                    }`}
                    onChange={handleDataUsageAcceptanceChannelChange}
                  >
                    <option value="DEFAULT" disabled>
                      -- Selecione --
                    </option>
                    <option value="email">E-mail</option>
                    <option value="sms">SMS</option>
                    <option value="print">Impresso</option>
                  </select>
                  {['sms', 'email'].indexOf(
                    watch('dataUsageAcceptanceChannel')
                  ) !== -1 && (
                    <button
                      className="button-default -small"
                      onClick={handleSendDataUsageAcceptanceTermClick}
                    >
                      ENVIAR
                    </button>
                  )}
                </div>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  }, [
    handleCpfChange,
    handleCpfLostFocus,
    errors.cpf,
    errors.zipCode,
    errors.fullName,
    errors.sex,
    errors.birthday,
    errors.email,
    errors.mobileNumber,
    errors.dataUsageAcceptanceChannel,
    foundBy,
    register,
    watch,
    ClubChoice,
    newCustomer,
    isMallWithClub,
    clubCategory,
    handleDataUsageAcceptanceChannelChange,
    handleSendDataUsageAcceptanceTermClick,
  ]);

  const newItem = useMemo(() => {
    return (
      <Row>
        <Col md={12} lg={12} xs={12}>
          <label className="label-input form-input">Nome do item*</label>
          <input
            type="text"
            name="itemName"
            className={`${
              errors.itemName
                ? 'coaliton-form-error'
                : watch('itemName') !== 'DEFAULT' && ' -selected'
            }`}
            ref={register}
            required
          />
        </Col>
      </Row>
    );
  }, [errors.itemName, register, watch]);

  return (
    <div className="lostfound-new-register">
      <Row className="columns">
        <Col md={6} style={{ marginBottom: '15px' }}>
          <Row>
            <Col xs={6}>
              <label className="label-input form-input">Shopping*</label>
              <select
                name="mall"
                ref={register}
                defaultValue={mallId || 'DEFAULT'}
                className={`${
                  errors.mall
                    ? 'coaliton-form-error'
                    : watch('mall') && ' -selected'
                }`}
                onChange={handleMallChange}
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>
                {malls ? (
                  malls.map(mall => (
                    <option value={mall.id} key={mall.id}>
                      {mall.name}
                    </option>
                  ))
                ) : (
                  <option>Loading</option>
                )}
              </select>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <label className="label-input form-input">QUEM ENCONTROU</label>
              <Col md={12}>
                <Row className="radio-buttons-container">
                  {identification.map(element => (
                    <Col
                      lg={4}
                      className="radio-button-container"
                      key={element}
                    >
                      <label className="checkbox">
                        <input
                          type="radio"
                          name="foundBy"
                          ref={register}
                          onClick={handleFoundByChange}
                          value={element}
                          defaultChecked={element === 'Cliente'}
                        />
                        <span className="checkmark" />
                        <span className="radio-label-text">{element}</span>
                      </label>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Col>
          </Row>
          {foundBy === 'Funcionário' ? employeeForm : (foundBy === 'Cliente' ? ClientForm : clientOrUnidentifiedForm)}
        </Col>
        <Col md={6}>
          {foundBy !== 'Não Identificado' ? <Row>
            <Col md={12} xs={12}>
              	<label className="label-input form-input">ITEM*</label>
			    <Autocomplete
	               className={`${
	                  errors.item
	                    ? 'coaliton-form-error'
	                    : watch('item') &&
	                      watch('item') !== 'DEFAULT' &&
	                      ' -selected'
	                }`}			    
			      name="item"
			      onChange={(event, val) => {
			        setItem(val);
			      }}
			      autoSelect={true}
			      autoComplete={true}
			      options={itens}
			      getOptionLabel={(option) => option.name}
			      renderInput={(params) => <TextField {...params} />}
			    />              
            </Col>
          </Row> : null}

          {watch('item') === 'other' && newItem}
          <Row>
            <Col md={12} xs={12}>
              <label className="label-input form-input">
                DESCRIÇÃO DO ITEM*
              </label>
              <textarea
                ref={register}
                name="description"
                className={`description ${
                  errors.description
                    ? 'coaliton-form-error'
                    : watch('description') && ' -filled'
                }
                }`}
              />
            </Col>
          </Row>

          {foundBy !== 'Não Identificado' ?           <Row>
            <Col lg={6} md={6}>
              <label className="label-input form-input">STATUS DO ITEM*</label>
              <select
                ref={register}
                name="status"
                className={`${
                  errors.status
                    ? 'coaliton-form-error'
                    : watch('status') !== 'DEFAULT' && ' -selected'
                }`}
                defaultValue="DEFAULT"
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>
                {Object.entries(itemStatus).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value}
                  </option>
                ))}
              </select>
            </Col>
            <Col lg={6} md={6}>
              <label className="label-input form-input">LOCAL ACHADO*</label>
              <select
                ref={register}
                defaultValue="DEFAULT"
                name="location"
                className={`${
                  errors.location
                    ? 'coaliton-form-error'
                    : watch('location') !== 'DEFAULT' && ' -selected'
                }`}
              >
                <option disabled value="DEFAULT">
                  -- Selecione --
                </option>
                {locations.map(location => (
                  <option value={location.id} key={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row> : null}

          <Row>
            <Col md={12} lg={12}>
              <label className="label-input form-input">FOTOS DO ITEM</label>
            </Col>
            <Col lg={12} md={12}>
              <MyFileSelector
                onChange={handleFilesChange}
                classes={{
                  ...(errors.photos && { main: 'coaliton-form-error' }),
                }}
                compress
                ref={fileSelectorRef}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="observation">
            <h2>OBSERVAÇÕES</h2>
            <div className="comment">
              <div className="avatar">
                {employee && getAvatar(employee.name)}
              </div>
              <textarea
                name="observation"
                ref={register}
                className={`textComment ${watch('observation') && ' -filled'}`}
                placeholder="Adicionar observação..."
                onKeyDown={handleObservationChange}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="button-disclaimer-row">
        <Col className="input-fields-container">
          <span className="span-fields-required">*Campos obrigatórios</span>
          <button
            className="button-default -action align-center"
            onClick={handleSubmit(saveLostFoundClick)}
          >
            Salvar
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default NewOccurrence;
