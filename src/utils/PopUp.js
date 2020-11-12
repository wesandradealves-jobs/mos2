import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

class PopUp {
  constructor() {
    this.popUp = withReactContent(Swal);
  }

  showConfirmation(
    message,
    callback,
    confirmButtonText = 'SIM',
    cancelButtonText = 'NÃO'
  ) {
    this.popUp
      .fire({
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
      })
      .then(result => result.value && callback());
  }

  showWarning(message) {
    this.popUp.fire({
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK',
    });
  }

  showSuccess(message) {
    this.popUp.fire({
      text: message,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  async processPromises(
    loadingTitle,
    promises,
    { successCallback = null, successMsg = null, successMsgTime = 1500 } = {},
    errorCallback = null
  ) {
    this.popUp.fire({
      title: loadingTitle,
      html: '<img style={margin-top: 100px} src="/icons/loader.svg">',
      allowEscapeKey: false,
      allowOutsideClick: false,
      customClass: {
        title: 'loading-title',
        actions: 'loading-actions',
        content: 'loading-content',
      },
      onBeforeOpen: () => {
        this.popUp.showLoading();
      },
    });
    promises
      .then(result => {
        successCallback && successCallback(result);
        successMsg
          ? this.popUp.fire({
              text: successMsg,
              icon: 'success',
              showConfirmButton: false,
              timer: successMsgTime,
            })
          : this.popUp.close();
      })
      .catch(error => {
        this.popUp.fire({
          icon: error.type,
          text: error.message,
          title: error.title,
          showConfirmButton: true,
        });
        errorCallback && errorCallback();
      });
  }
}

export default PopUp;
