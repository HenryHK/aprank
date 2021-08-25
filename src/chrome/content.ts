/* global chrome */
import { ChromeMessage, Sender } from "../types";


declare global {
    interface Window {
        AP3_JWT: any;
    }
}

type MessageResponse = (response?: any) => void

/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
const injectScript = (file_path: any, tag: any) => {
    const s = document.createElement('script');
    console.log("file path", chrome.extension.getURL('static/js/inject.js'))
    s.src = chrome.extension.getURL('static/js/inject.js');
    (document.head || document.documentElement).appendChild(s);
}

const validateSender = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender
) => {
    return sender.id === chrome.runtime.id && message.from === Sender.React;
}

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: MessageResponse
) => {

    const isValidated = validateSender(message, sender);

    if (isValidated && message.message === 'Hello from React') {
        response('Hello from content.js'+ window.AP3_JWT);
    }

    if (isValidated && message.message === "delete logo") {
        const logo = document.getElementById('hplogo');
        logo?.parentElement?.removeChild(logo)
    }
}

const main = () => {
    console.log('[content.ts] Main')
    injectScript(chrome.extension.getURL('./static/js/inject.js'), 'body');
    /**
     * Fired when a message is sent from either an extension process or a content script.
     */
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
}

main();
