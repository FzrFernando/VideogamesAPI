document.addEventListener("DOMContentLoaded", function () {

    const videogameEl = document.querySelector('#name');
    const developerEl = document.querySelector('#developer');
    const releaseDateEl = document.querySelector('#releaseDate');
    const form = document.querySelector('#videogamesForm');
    const videogameList = document.querySelector('#videogamesList');

    function addUserToList(videogame) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${videogame.name} : ${videogame.developer} : ${videogame.releaseDate}`;
        videogameList.appendChild(listItem);
    }

    function getUsersFromAPI() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET','http://localhost:3000/videogames',true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const videogames = JSON.parse(xhr.responseText);
                videogames.forEach(videogame => {
                    addUserToList(videogame);
                })
            }
        }
        xhr.send();
    }

    getUsersFromAPI();

    const isRequired = value => value === '' ? false : true;
        
    const isBetween = (length, min, max) => length < min || length > max ? false : true;

    const showError = (input, message) => {
        const formField = input.parentElement;

        formField.classList.remove('success');
        formField.classList.add('error');

        const error = formField.querySelector('small');
        error.textContent = message;
    };

    const showSuccess = (input) => {
        const formField = input.parentElement;

        formField.classList.remove('error');
        formField.classList.add('success');

        const error = formField.querySelector('small');
        error.textContent = '';
    };

    const checkVideogame = () => {
        let valid = false;
        const min = 2, max = 70;
        const videogame = videogameEl.value.trim();
        if (!isRequired(videogame)) {
            showError(videogameEl, 'El nombre del videojuego no puede estar en blanco.');
        } else if (!isBetween(videogame.length, min, max)) {
            showError(videogameEl, `El nombre del videojuego debe tener entre ${min} y ${max} caracteres.`);
        } else {
            showSuccess(videogameEl),
            valid = true;
        }
        return valid;
    };

    const checkDeveloper = () => {
        let valid = false;
        const min = 2, max = 50;
        const developer = developerEl.value.trim();
        if (!isRequired(developer)) {
            showError(developerEl, 'El nombre del videojuego no puede estar en blanco.');
        } else if (!isBetween(developer.length, min, max)) {
            showError(developerEl, `El nombre del videojuego debe tener entre ${min} y ${max} caracteres.`);
        } else {
            showSuccess(developerEl),
            valid = true;
        }
        return valid;
    };

    const checkDate = () => {
        let valid = false;
        const releaseDate = new Date (releaseDateEl.value);
        const fechaAntigua = new Date('1960-01-01');
        if (releaseDate < fechaAntigua) {
            showError(releaseDateEl,`Debes de poner una fecha válida`)
        }
        else if (!isRequired(releaseDate)) {
            showError(releaseDateEl,'La fecha no puede estar en blanco.');
        }
        else {
            showSuccess(releaseDateEl),
            valid = true;
        }
        return valid;
    }

    const debounce = (fn, delay = 500) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn.apply(null, args)
            }, delay)
        };
    };

    form.addEventListener('input', debounce( function (e) {
        switch (e.target.id) {
            case 'name':
                checkVideogame();
                break;
            case 'developer':
                checkDeveloper();
                break;
            case 'releaseDate':
                checkDate();
                break;
        }
    }));

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (checkVideogame() && checkDeveloper() && checkDate()){
            const newVideogame = {
                name : videogameEl.value.trim(),
                developer : developerEl.value.trim(),
                releaseDate : releaseDateEl.value
            }
            const peticion = new XMLHttpRequest();
            peticion.open('POST','http://localhost:3000/videogames');
            peticion.setRequestHeader('Content-type','application/json');
            peticion.send(JSON.stringify(newVideogame));
        }
        form.reset();
    })
})