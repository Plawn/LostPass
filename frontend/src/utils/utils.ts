
export function range(size:number, startAt:number = 0):ReadonlyArray<number> {
    return [...Array<number>(size).keys()].map(i => i + startAt);
}

// alternative kept here

type EditableInput = HTMLTextAreaElement | HTMLInputElement;

const selectText = (editableEl: EditableInput, selectionStart: number, selectionEnd: number) => {
    const isIOS = navigator.userAgent.match(/ipad|ipod|iphone/i);
    if (isIOS) {
        const range = document.createRange();
        range.selectNodeContents(editableEl);

        const selection = window.getSelection()!; // current text selection
        selection.removeAllRanges();
        selection.addRange(range);
        editableEl.setSelectionRange(selectionStart, selectionEnd);
    } else {
        editableEl.select();
    }
};

export const copyToClipboard = (value: string): void => {
    const el = document.createElement('textarea'); // temporary element
    el.value = value;

    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.readOnly = true; // avoid iOs keyboard opening
    el.contentEditable = 'true';

    document.body.appendChild(el);

    selectText(el, 0, value.length);

    document.execCommand('copy');
    document.body.removeChild(el);

};