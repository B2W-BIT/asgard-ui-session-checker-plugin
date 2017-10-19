import React from "react/addons";

const {
  PluginActions,
  PluginHelper,
  Sieve,
  ajaxWrapper,
  config,
} = window.marathonPluginInterface;

function showErrorDialog(title, message) {

  PluginHelper.callAction(PluginActions.DIALOG_ALERT, [{
    title: title,
    message: message,
    actionButtonLabel: "OK",
  }]);

}

var ChangeAccountComponent = React.createClass({
  displayName: "ChangeAccountComponent",

  handleMenuClick: function () {
    PluginHelper.callAction(PluginActions.DIALOG_ALERT, [{
      title: "Trocar de conta",
      message: "Por favor escolha a conta",
      actionButtonLabel: "OK",
      myid: "session-account-change"
    }]);
  },

  getInitialState: function () {
    return {
      User: {},
      CurrentAccount: {}
    };
  },

  acceptChangeAccountDialog: function (dialog) {
    if (dialog.myid === "session-account-change") {
      ajaxWrapper({
        url: `${config.apiURL}hollow/account/next`,
        method: "POST"
      })
      .error(error => {
        showErrorDialog("Erro ao trocar de conta", error.body.msg);
      })
      .success(response => {
        this.setState({
          User: response.body.user,
          CurrentAccount: response.body.current_account
        });
        localStorage.setItem("auth_token", response.body.jwt_token);
      });
      Sieve.navigateTo("/#/apps");
    }
  },

  componentWillMount: function () {
    Sieve.DialogStore.on(
      "DIALOG_EVENTS_ACCEPT_DIALOG",
      this.acceptChangeAccountDialog
    );

    ajaxWrapper({url: `${config.apiURL}hollow/account/me`, method: "GET"})
    .error(error => {
      /* Não temos muito o que fazer aqui. Se retornar erro,
       * já estamos deslogados e isso já é tratado por outra
       * parte desse plugin. E se estamos deslogados,
       * não temos o que exiibir nesse componente.
       */
    })
    .success(response => {
      this.setState({
        User: response.body.user,
        CurrentAccount: response.body.current_account
      });
    });
  },

  render: function () {
    return (
      <div className="help-menu active"
          onClick={this.handleMenuClick}>
        <span> {this.state.User.name}@{this.state.CurrentAccount.name} </span>
      </div>
    );
  }

});

export default ChangeAccountComponent;
