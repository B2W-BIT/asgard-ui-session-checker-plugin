import React from "react/addons";
/* eslint-disable camelcase */
import jwt_decode from "jwt-decode";
/* eslint-enable camelcase */

const {
  PluginActions,
  PluginHelper,
  Bridge,
  MarathonService,
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
      MarathonService.request({
        resource: "hollow/account/next",
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
      Bridge.navigateTo("/#/apps");
    }
  },

  componentDidMount: function () {
    this.startPolling();
  },

  whoAmI: function () {
    /* eslint-disable no-unused-vars */
    MarathonService.request({resource: "hollow/account/me", method: "GET"})
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
    /* eslint-enable no-unused-vars */
  },

  componentWillMount: function () {
    Bridge.DialogStore.on(
      "DIALOG_EVENTS_ACCEPT_DIALOG",
      this.acceptChangeAccountDialog
    );
    this.whoAmI();
  },

  render: function () {
    return (
      <div className="help-menu active"
          onClick={this.handleMenuClick}>
        <span> {this.state.User.name}@{this.state.CurrentAccount.name} </span>
      </div>
    );
  },

  reReadToken: function () {
    /* eslint-disable no-empty */
    try {
      var token = jwt_decode(localStorage.getItem("auth_token"));
      this.setState({
        User: token.user,
        CurrentAccount: token.current_account
      });
    } catch (e) {

    }
    /* eslint-enable no-empty */
  },

  startPolling: function () {
    if (this.interval == null) {
      this.interval = setInterval(this.reReadToken, 5000);
    }
  }
});

export default ChangeAccountComponent;
