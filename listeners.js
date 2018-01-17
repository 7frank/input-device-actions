
import MutationSummary from 'mutation-summary';

/**
 *
 * @param {(HTMLElement|undefined)} node - the root node on which to listen for changes. defaults to window.document
 * @param {string} elem - a selector string
 * @param {function} handler - a callback if the element was changed
 * @returns {MutationSummary}
 */
export function onElementChange (node = window.document, elem, handler) {
    var observer = new MutationSummary({
        callback: handler, // required
        rootNode: node, // optional, defaults to window.document
        //  observeOwnChanges: // optional, defaults to false
        // oldPreviousSibling: // optional, defaults to false
        queries: [
            {
                element: elem // '[' + elem + ']'

            }
        ]
    });

    // If/when change report callbacks are no longer desired
    // var summaries = observer.disconnect();
    // if (summaries)
    //     handleChangesUpToHere(summaries);
    return observer;
}
