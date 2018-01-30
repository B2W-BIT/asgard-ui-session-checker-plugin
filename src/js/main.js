const {
  PluginHelper,
  PluginMountPoints,
  PipelineNames,
  PipelineStore,
} = window.marathonPluginInterface;

import SessionCheckerAction from "./actions/SessionCheckerAction";
import ChangeAccountComponent from "./components/ChangeAccountComponent";

PluginHelper.registerMe();
SessionCheckerAction.init();

PluginHelper.injectComponent(
  ChangeAccountComponent,
  PluginMountPoints.NAVBAR_TOP_RIGHT
);

if (PipelineNames && PipelineStore) {
  console.log("Registering PRE_AJAX_REQUEST callback");
  PipelineStore.registerOperator(
    PipelineNames.PRE_AJAX_REQUEST,
    (data) => {
      const currentHeaders = data.headers;

      var token = localStorage.getItem("auth_token");
      currentHeaders["Authorization"] = "JWT " + token;
      return Object.assign({}, data, {headers: currentHeaders});
    }
  );
} else {
  console.log("Request Pipelines feature not found...");
}

