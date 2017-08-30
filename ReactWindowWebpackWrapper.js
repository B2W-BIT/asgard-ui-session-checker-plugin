// This is a direct replacement for React and used to automatically substitute
// React with the injected instance.
// This is necessary, as using a different React instance will result in
// various "Invariant Violation" errors.
// It's getting the injected instance from the marathon plugin interface and
// provide it to the plugin using the CommonJS syntax export for greater
// compatibility with old modules.
const {React} = window.marathonPluginInterface;
module.exports = React;
