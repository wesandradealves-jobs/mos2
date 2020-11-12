import React, {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import imageCompression from 'browser-image-compression';
import path from 'path';

import { toBase64 } from '../../utils/functions';

import { ReactComponent as Add } from '../../img/prod-icons/add_light.svg';

const defaultStyles = () => ({
  main: {
    display: 'flex',
    flex: '1',
    alignItems: 'center',
    border: 'solid 1px #cbe6e1',
    borderRadius: '5px',
    padding: '6px 8px 4px',
    '&.-filled': {
      borderColor: '#54BBAB',
    },
  },
  noFile: {
    padding: '6px 8px',
    width: '100%',
    color: '#4F7872',
    margin: 0,
    fontFamily: 'Arvo',
  },
  files: {
    '--gap': '12px',
    display: 'inline-flex',
    flexWrap: 'wrap',
    margin: 'calc(-1 * var(--gap)) 10px 0 calc(-1 * var(--gap))',
    width: 'calc(100% + var(--gap))',
    marginRight: '5px',
  },
  addFileButton: {
    width: '26px',
    height: '26px',
    maxWidth: 'unset',
    cursor: 'pointer',
  },
  fileDiv: {
    margin: 'var(--gap) 0 0 var(--gap)',
    position: 'relative',
    display: 'flex',
    background: '#F9F9F9 0% 0% no-repeat padding-box',
    boxShadow: '1px 2px 1px #00000045',
    borderRadius: '3px',
    padding: '5px',
  },
  filenameShort: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '180px',
    margin: 0,
  },
  filenameFull: {
    position: 'absolute',
    display: 'none',
    backgroundColor: 'white',
    padding: '2px',
    boxShadow: '0 0 4px 0 black',
    borderRadius: '1px',
    zIndex: '999',
    whiteSpace: 'normal',
    wordBreak: 'break-all',
  },
  imagePreview: {
    position: 'absolute',
    display: 'none',
    boxShadow: '0 0 4px 0 black',
    bottom: '28px',
    width: '185px',
    height: '185px',
    zIndex: '999',
  },
  deleteButton: {
    marginLeft: '5px',
    fontFamily: 'Arvo',
    fontWeight: 'bold',
    fontSize: '12px',
    backgroundColor: 'Transparent',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    outline: 'none',
    '&:focus': {
      boxShadow: 'none',
      outline: 'none',
    },
  },
});

const MyFileSelector = forwardRef((props, ref) => {
  const {
    classes,
    onChange,
    disabled = false,
    compress = false,
    compressOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    },
    defaultFiles = [],
  } = props;

  const [filesObject, setFilesObject] = useState(() =>
    defaultFiles.map(file => ({
      file: new File([file], file),
      name: `${path.basename(file).replace(/___.*/, '')}.${file
        .split('.')
        .pop()}`,
      src: file,
    }))
  );

  const addFiles = useCallback(
    async event => {
      const tempFiles = await Promise.all(
        Object.values(event.target.files).map(async file => ({
          ...(compress
            ? { file: await imageCompression(file, compressOptions) }
            : file),
          name: file.name,
          src: `data:image/jpeg;base64, ${await toBase64(file)}`,
        }))
      );

      const newFiles = [
        ...filesObject,
        ...tempFiles.filter(
          file => !filesObject.find(obj => obj.name === file.name)
        ),
      ];

      setFilesObject(newFiles);
      onChange && onChange(newFiles.map(obj => obj.file));
    },
    [compress, compressOptions, filesObject, onChange]
  );

  const handleFilenameMouseHover = useCallback(filename => {
    document.getElementById(`fullName${filename}`).style.display = 'flex';
    document.getElementById(`imagePreview${filename}`).style.display = 'flex';
  }, []);

  const handleFilenameMouseOut = useCallback(filename => {
    document.getElementById(`fullName${filename}`).style.display = 'none';
    document.getElementById(`imagePreview${filename}`).style.display = 'none';
  }, []);

  const handleDeleteFile = useCallback(
    filename => {
      const newFiles = filesObject.filter(obj => obj.name !== filename);
      setFilesObject(newFiles);

      onChange && onChange(newFiles.map(obj => obj.file));
    },
    [filesObject, onChange]
  );

  const clearFiles = useCallback(() => setFilesObject([]), []);

  useImperativeHandle(ref, () => ({
    clearFiles: () => clearFiles(),
  }));

  return (
    <div
      className={`${classes.main} ${filesObject.length > 0 ? '-filled' : ''}`}
    >
      {filesObject.length > 0 ? (
        <div className={classes.files}>
          {filesObject.map(file => {
            return (
              <div className={classes.fileDiv} key={file.name}>
                <p
                  className={classes.filenameShort}
                  onMouseOver={() => handleFilenameMouseHover(file.name)}
                  onFocus={() => handleFilenameMouseHover(file.name)}
                  onMouseOut={() => handleFilenameMouseOut(file.name)}
                  onBlur={() => handleFilenameMouseOut(file.name)}
                >
                  {file.name}
                </p>
                <span
                  id={`fullName${file.name}`}
                  className={classes.filenameFull}
                >
                  {file.name}
                </span>
                <span
                  id={`imagePreview${file.name}`}
                  className={classes.imagePreview}
                >
                  <img src={file.src} alt="Foto" />
                </span>
                <button
                  onClick={() => handleDeleteFile(file.name)}
                  className={classes.deleteButton}
                  style={{
                    ...(disabled ? { display: 'none' } : { display: 'block' }),
                  }}
                >
                  x
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className={classes.noFile}>
          {disabled ? 'Nenhum arquivo adicionado' : 'Selecionar Arquivo'}
        </p>
      )}
      {!disabled && (
        <label htmlFor="file-input">
          <Add alt="Returned" className={classes.addFileButton} />
          <input
            id="file-input"
            type="file"
            accept=".png,.jpg, .jpeg"
            multiple
            onChange={addFiles}
            style={{ display: 'none' }}
          />
        </label>
      )}
    </div>
  );
});

export default withStyles(defaultStyles)(MyFileSelector);
