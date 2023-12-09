import Taggier from './taggier.js';

const taggier = new Taggier('taggier');

const listTagsButton = document.querySelector('#btn-list-tags');
const tagsUl = document.querySelector('#ul-tags');

listTagsButton.addEventListener('click', () => {

    tagsUl.innerHTML = '';

    taggier.tags.forEach(tag => {

        const li = document.createElement('li');
        li.textContent = tag;
        tagsUl.appendChild(li);
    });
});


const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.github.com/repos/vikcch/taggier/releases/latest', true);

xhr.onload = function () {

    if (xhr.status === 200) {

        try {

            const response = JSON.parse(xhr.responseText);
            const tagName = response.tag_name;

            const els = Array.from(document.querySelectorAll('.latest-version'));
            els.forEach(el => el.textContent = tagName.replace('v', '').trim());

        } catch (error) {
            console.error(error);
        }
    }

    if (xhr.status === 404) { }
};

xhr.onerror = function () { };

xhr.send();