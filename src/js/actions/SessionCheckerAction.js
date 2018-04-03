const {
  PluginActions,
  PluginHelper,
  Sieve,
  MarathonService,
} = window.marathonPluginInterface;

var acceptDialog = function (dialog) {
  if (dialog.myid === "session-expired") {
    Sieve.navigateTo("/login");
  }
};

function checkStatusCode(statusCode) {
  if (statusCode === 401) {
    PluginHelper.callAction(PluginActions.DIALOG_ALERT, [{
      title: "Sua sessão expirou",
      message: "Por favor faça login novamente",
      actionButtonLabel: "Login",
      myid: "session-expired"
    }]);
  }
}

Sieve.DialogStore.on("DIALOG_EVENTS_ACCEPT_DIALOG", acceptDialog);

function checkSession() {
  MarathonService.request({
    resource: "v2/deployments",
    concurrent: true
  })
  .success(response => {

  })
  .error(function (error) {
    checkStatusCode(error.status);
  });
}

var SessionCheckerAction = {
  init: () => {
    setInterval(checkSession, 5000);
  },
};

export default SessionCheckerAction;
