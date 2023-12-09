const Taggier = class Taggier {

    /**
     * @constructor
     * @param {string | HTMLDivElement} div Div `id` or the div itself
     * @param {{gap: number, forbiddenPattern: false | RegExp, hashtag: boolean, border: boolean, focus: boolean }} options default values:  
     * * gap: `16`;  
     * * forbiddenPattern: `/[^\w]+/g`; (set to `false` to have none);  
     * * hashtag: `false`;
     * * border: `true`;  
     * * focus: `true`;  
     */
    constructor(div, options = {}) {

        const gap = options.gap || 16;
        const pattern = options.forbiddenPattern === false
            ? null
            : options.pattern || /[^\w]+/g;
        const hashtag = options.hashtag;
        const border = options.border ?? true;
        const focus = options.focus ?? true;

        this.fixedOptions = {
            gap, pattern, hashtag, border, focus
        };

        const errorMessagePrefix = 'The first paremeter (div) of the object Taggier';

        if (typeof div === 'string' || div instanceof String) {

            this.container = document.querySelector(`#${div}`);

            const errorMessage = `${errorMessagePrefix} was not found`;
            if (this.container === null) throw Error(errorMessage);
        }

        if (div instanceof HTMLDivElement) this.container = div;

        if (this.container === undefined) {

            const errorMessage = `${errorMessagePrefix} is not a HTMLDivElement`;
            throw Error(errorMessage);
        }

        if (border) {

            const borders = ['top', 'right', 'bottom', 'left'];
            const hasBorder = borders.some(side => {

                const style = getComputedStyle(this.container, null);
                const width = style.getPropertyValue(`border-${side}-width`);
                return width !== '0px';
            });

            if (!hasBorder) {
                this.container.style.border = '1px solid gray';
            }
        }

        this.container.style.cursor = 'text';
        this.container.style.padding = `${gap / 2}px`;
        this.container.addEventListener('click', (e) => {

            if (e.target.tagName.toLowerCase() === 'span') {

                this.container.removeChild(e.target);
            }
            this.input.focus();
        });

        this.input = document.createElement('input');
        this.input.style.border = 'none';
        this.input.style.flex = 1;
        this.input.style.padding = '8px';
        this.container.appendChild(this.input);

        this.input.addEventListener('focus', (e) => {

            e.currentTarget.style.outline = 'none';

            if (focus) this.container.style.outline = 'auto';
        });

        if (focus) {

            this.input.addEventListener('focusout', (e) => {

                this.container.style.outline = 'none';
            });
        }

        this.input.addEventListener('input', (e) => {

            const value = this.input.value.replace(',', '');

            this.input.value = value.replace(pattern, '');

            const createTag = e.data === ',' && value.trim();

            if (createTag) taggierCreateTag.call(this, this.input.value);
        });

        this.input.addEventListener('keydown', (e) => {

            const remove = e.key === "Backspace" && this.input.value === '';
            if (remove) {
                const spans = this.container.querySelectorAll('span');
                if (!spans.length) return;
                const lastSpan = spans[spans.length - 1];
                this.container.removeChild(lastSpan);
            }
        });

        this.container.style.display = 'flex';
        this.container.style.flexWrap = 'wrap';
    }

    /**
     * @type {Array} Array of strings
     */
    get tags() {

        const spans = this.container.querySelectorAll('span');

        return Array.from(spans).map(x => x.textContent);
    }

    set tags(values) {

        this.removeAll();

        taggierAddTags.call(this, values);
    }

    /**
     * @returns {Array} Array of strings
     */
    getTags() {

        return this.tags;
    }

    /**
     * @param {Array} values Array of strings
     */
    setTags(values) {

        this.tags = values;
    }

    /**
     * @param {Array} values Array of strings
     */
    addTags(values) {

        taggierAddTags.call(this, values);
    }

    /**
     * Remove all tags
     */
    removeAll() {

        const spans = this.container.querySelectorAll('span');

        Array.from(spans).forEach(x => this.container.removeChild(x));
    }

    /**
     * @returns {boolean} Has pending text in the element
     */
    hasPendingText() {

        return !!this.input.value.trim();
    }

    /**
     * @returns {string} The pending text in the element
     */
    pendingText() {

        return this.input.value;
    }

    /**
     * Makes a Tag from pending text in the element
     */
    makeTagFromPendingText() {

        taggierCreateTag.call(this, this.input.value);
    }

};

const taggierAddTags = function (values) {

    if (!Array.isArray(values)) throw Error('Must be an Array');

    values.forEach(x => {

        const errorMessage = 'The Array must contain strings';
        if (typeof x !== 'string') throw Error(errorMessage);

        const fixed = x.replace(this.fixedOptions.pattern, '');
        taggierCreateTag.call(this, fixed);
    });
};

const taggierCreateTag = function (value) {

    if (value.trim() === '') return;

    const { hashtag, gap } = this.fixedOptions;

    const prefix = hashtag ? '#' : '';
    const tagText = `${prefix}${value.trim()}`;
    this.input.value = '';

    const duplicate = this.getTags().find(x => {

        return x.toLowerCase() === tagText.toLowerCase();
    });

    if (duplicate) return;

    const span = document.createElement('span');
    span.innerHTML = tagText;
    span.classList.add('tag');
    span.style.margin = `${gap / 2}px`;
    this.container.insertBefore(span, this.input);
};

export default Taggier;