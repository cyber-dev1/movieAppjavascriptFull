movies = movies.slice(0, 100);

const elMoviesList = document.querySelector('.js-movie-list');
const elMoviesTemplate = document.querySelector('.js-movie-template').content;
const elMovieLoader = document.querySelector('.loading-svg');
const elModalBody = document.querySelector('.js-modal-body');
const elModal = document.querySelector('.js-movie-modal');
const elModalIframe = document.querySelector('.js-movie-iframe');
const elForm = document.querySelector('.js-form');
const elSearchInput = document.querySelector('.js-search-input');
const elCategoriesSelect = document.querySelector('.js-categories-select');
const elMinYearInput = document.querySelector('.js-min-year-input');
const ElMaxYearInput = document.querySelector('.js-max-year-input');
const elMovieSortSelect = document.querySelector('.js-sort-select');
const elAlertBookmark = document.querySelector('.js-alert-bookmark');
const elBookmarkMovi = document.querySelector('.js-bookmark-movie');
const elBookmarCount = document.querySelector('.js-count');
const elBookmarkTemplate = document.querySelector('.js-movies-bookmark-temp').content;
const elSavedMoviesRender = document.querySelector('.js-render-bookmark');
let elAlldeleteMovies = document.querySelector('.js-delete-all-movies') ;
let delMovies = document.querySelector('.js-material-symbols-outlined');

let bookmarks = window.localStorage.getItem('bookmark') ? JSON.parse(window.localStorage.getItem('bookmark')) : [];

const handleMovieDate = (runtime) => {
    let hours = Math.floor(runtime / 60) !== 0 ? Math.floor(runtime / 60) : 3;
    let minute = runtime % 6 !== 0 ? Math.floor(runtime % 6) : 35;
    return `${hours} hr ${minute} min`;
};

const handleRenderMovies = (arr) => {
    const docFragment = document.createDocumentFragment();
    if (arr.length) { elMovieLoader.classList.add('d-none') } else { return elMovieLoader.classList.remove("d-none") };
    elMoviesList.innerHTML = '';
    arr.forEach((movie) => {
        let clone = elMoviesTemplate.cloneNode(true);
        clone.querySelector('.js-movie-title').textContent = movie.title.split(' ').length > 3 ? movie.title.split(' ').slice(0, 3).join(' ').concat('...') : movie.title;
        clone.querySelector('.js-movie-year').textContent = movie.movie_year;
        clone.querySelector('.js-movie-runtime').textContent = handleMovieDate(movie.runtime);
        clone.querySelector('.js-movie-categories').textContent = movie.categories.length > 3 ? movie.categories.slice(0, 3).join(', ').concat('...') : movie.categories.join(', ');
        clone.querySelector('.js-movie-image').src = movie.img_url;
        clone.querySelector('.js-movie-rating').textContent = movie.imdb_rating;
        clone.querySelector('.js-more-info').dataset.id = movie.imdb_id;
        clone.querySelector('.js-add-bookmark').dataset.id = movie.imdb_id;
        clone.querySelector('.js-material-symbols-outlined').dataset.id = movie.imdb_id;
        docFragment.append(clone);
    });
    elMoviesList.append(docFragment);
};
handleRenderMovies(movies);

const handleRenderModal = (movie) => {
    elModalBody.querySelector('.js-movie-iframe').src = movie.movie_frame;
    elModalBody.querySelector('.js-movie-modal-title').textContent = movie.fulltitle;
    elModalBody.querySelector('.js-movie-rating').textContent = movie.imdb_rating;
    elModalBody.querySelector('.js-movie-year').textContent = movie.movie_year;
    elModalBody.querySelector('.js-movie-runtime').textContent = handleMovieDate(movie.runtime);
    elModalBody.querySelector('.js-movie-categori').textContent = movie.categories.join(', ');
    elModalBody.querySelector('.js-movie-imdb').href = movie.imdb_link;
    elModalBody.querySelector('.js-movie-summary').textContent = movie.summary.split(' ').length > 90 ? movie.summary.split(' ').slice(0, 90).join(' ').concat(' . . .') : movie.summary;
};

function handleFilterCategories(arr) {
    let store = [];
    for (const movie of arr) {
        const categories = movie.categories;
        for (const categorie of categories) {
            if (!(store.includes(categorie))) {
                store.push(categorie);
            }
        }
    }
    handleRenderOptions(store);
}
handleFilterCategories(movies);

function handleRenderOptions(categories) {
    categories.forEach((categorie) => {
        let newOption = document.createElement('option');
        newOption.value = categorie;
        newOption.textContent = categorie;
        elCategoriesSelect.append(newOption);
    })
}
const handleSearchMovies = (regex, searchVal, sortMovies) => {
    let searchFilter;
    let result = sortMovies.filter((movie) => {
        searchFilter = (searchVal == '' || movie.title.match(regex)) &&
            (elMinYearInput.value == '' || movie.movie_year >= elMinYearInput.value) &&
            (ElMaxYearInput.value == '' || movie.movie_year <= ElMaxYearInput.value) &&
            (elCategoriesSelect.value == 'all' || movie.categories.includes(elCategoriesSelect.value))
        return searchFilter;
    });
    return result;
};

const sortedObj = {
    ['a-z']: function (a, b) {
        const moviesTitleCode = a.title.toLowerCase().charCodeAt(0);
        const moviesTitleCharCode = b.title.toLowerCase().charCodeAt(0);
        if (moviesTitleCode > moviesTitleCharCode) { return 1 } else { return -1 };
    },
    ['z-a']: function (a, b) {
        const moviesTitleCode = a.title.toLowerCase().charCodeAt(0);
        const moviesTitleCharCode = b.title.toLowerCase().charCodeAt(0);
        if (moviesTitleCode < moviesTitleCharCode) { return 1 } else { return -1 };
    },
    ['old-year']: function (a, b) {
        const movieYear = new Date(a.movie_year);
        const movieYearTue = new Date(b.movie_year);
        if (movieYear > movieYearTue) { return 1 } else { return -1 };
    },
    ['new-year']: function (a, b) {
        const movieYear = new Date(a.movie_year);
        const movieYearTue = new Date(b.movie_year);
        if (movieYear < movieYearTue) { return 1 } else { return -1 };
    },
};

function handleRenderSavedMovies(savedMovies) {
    let renderFragment = document.createDocumentFragment();
    elSavedMoviesRender.innerHTML = '';
    if (!(savedMovies.length == 0)) {
        savedMovies.forEach((saved) => {
            let bookmarkClone = elBookmarkTemplate.cloneNode(true);
            bookmarkClone.querySelector('.js-bookmark-movie-title').textContent = saved.title.split(' ').length > 2 ? saved.title.split(' ').slice(0, 2).concat('...') : saved.title;
            bookmarkClone.querySelector('.js-bookmark-movie-image').src = saved.img_url;
            bookmarkClone.querySelector('.js-bookmark-movie-imdb').href = saved.imdb_link;
            renderFragment.append(bookmarkClone);
        });
        elSavedMoviesRender.append(renderFragment);

    };
};
handleRenderSavedMovies(bookmarks);

function handleBookmarkCount(count) {
    if (!(count == 0)) {
        elBookmarCount.classList.remove('d-none');
        elBookmarCount.textContent = bookmarks.length;
        elAlertBookmark.classList.add('d-none');
    } else {
        elAlertBookmark.classList.remove('d-none');
    }
}
handleBookmarkCount(bookmarks.length);

const handleDeleteBookmark = (deleteMovie) => {
    let filtersDel = bookmarks.filter((item) => item.imdb_id !== deleteMovie);
    window.localStorage.setItem('bookmark', JSON.stringify(filtersDel));
    handleRenderSavedMovies(bookmarks);
    window.location.reload();

}

elMoviesList.addEventListener('click', (evt) => {
    if (evt.target.matches('.js-more-info')) {
        let movieId = evt.target.dataset.id;
        const findMovie = movies.find((movie) => movie.imdb_id == movieId);
        handleRenderModal(findMovie);
    };
    if (evt.target.matches('.js-add-bookmark')) {
        let movieAddId = evt.target.dataset.id;
        let addMovies = movies.find((movie) => movie.imdb_id == movieAddId);
        if (bookmarks.length) {
            if (!(bookmarks.some(item => item.imdb_id == movieAddId))) {
                bookmarks.push(addMovies);
                window.localStorage.setItem('bookmark', JSON.stringify(bookmarks));
                handleBookmarkCount(bookmarks.length);
                handleRenderSavedMovies(bookmarks);
            };
        } else {
            bookmarks.push(addMovies);
            window.localStorage.setItem('bookmark', JSON.stringify(bookmarks));
            handleBookmarkCount(bookmarks.length);
            handleRenderSavedMovies(bookmarks);
        };
    };
    if (evt.target.matches('.js-material-symbols-outlined')) {
        let addedMovies = evt.target.dataset.id;
        handleDeleteBookmark(addedMovies)
    }
});

elModal.addEventListener('hide.bs.modal', () => {
    elModalIframe.src = '';
});
elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let searchValue = elSearchInput.value.trim();
    const regex = new RegExp(searchValue, 'gi');
    let sortMovies = movies;
    if (elMovieSortSelect.value) {
        sortMovies = movies.sort(sortedObj[elMovieSortSelect.value]);
    };
    let searchMovies = handleSearchMovies(regex, searchValue, sortMovies);
    handleRenderMovies(searchMovies);
});

elAlldeleteMovies.addEventListener('click', () => {
    window.localStorage.clear(); 
    window.location.reload();
})


