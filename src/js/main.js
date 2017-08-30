const {PluginHelper} = window.marathonPluginInterface;

import SessionCheckerAction from "./actions/SessionCheckerAction";

PluginHelper.registerMe();
SessionCheckerAction.init();
