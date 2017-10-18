const {
  PluginHelper,
  PluginMountPoints,
} = window.marathonPluginInterface;

import SessionCheckerAction from "./actions/SessionCheckerAction";
import ChangeAccountComponent from "./components/ChangeAccountComponent";

PluginHelper.registerMe();
SessionCheckerAction.init();

PluginHelper.injectComponent(
  ChangeAccountComponent,
  PluginMountPoints.NAVBAR_TOP_RIGHT
);
