let uid = -1;

export const UID_PREFIX = '_ui.';

export const nextUid = (prefix = UID_PREFIX) => prefix + (++uid);

const uiManager = {
    UID_PREFIX,
    nextUid
};


export default uiManager;


/** WEBPACK FOOTER **
 ** ./base/ui-manager.js
 **/