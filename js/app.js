// For Global Use
const messageTag = document.getElementById('message');
const cardContainer = document.getElementById('card-container');

//Controls spinner visibility
const spinnerDisplay = display => {
    const spinnerContainer = document.getElementById('spinner');
    spinnerContainer.style.display = display;
}

//Controls result container visibility
const resultContainerDisplay = display => {
    const resultContainer = document.getElementById('result-container');
    resultContainer.style.display = display;
}

// Searches the Archive using API
const searchArchive = () => {
    //clear dom message 
    messageTag.innerText = '';
    resultContainerDisplay('none');
    const searchInput = document.getElementById('serch-input');
    if (searchInput.value === '') {
        messageTag.innerText = 'Search cannot be empty! Try again with valid query.'
        messageTag.style.color = 'red';
        return;
    }
    //toggle spinner on
    spinnerDisplay('block');
    const url = `https://openlibrary.org/search.json?q=${searchInput.value}`
    //sends request to archive, response in json
    fetch(url)
        .then(response => response.json())
        .then(data => displayBooks(data));
    searchInput.value = '';
};

//populates dom with response from api
const displayBooks = data => {
    //toggle spinner off
    spinnerDisplay('none');
    if (data.numFound === 0) {
        messageTag.innerText = 'No results found! Please try again with valid keywords.'
        messageTag.style.color = 'red';
        return;
    }
    messageTag.innerText = `${data.numFound} results found within the archive. Showing the first ${data.docs.length} results.`
    messageTag.style.color = '#6c757d';
    resultContainerDisplay('block');
    //clear previous child results inside card container 
    cardContainer.textContent = '';
    data.docs.forEach(element => {
        const div = document.createElement('div')
        div.innerHTML = `
        <div class="card h-100 book-shadow">
            <img src="https://covers.openlibrary.org/b/id/${element.cover_i}-M.jpg" class="card-img-top h-50" alt="No image found">
            <div class="card-body">
                <h5 class="card-title py-3 font-monospace fw-bold">${element.title ? element.title : ''}</h5>
                <p class="card-text text-secondary">By <span class="fst-italic fw-bold text-success"> ${element.author_name ? element.author_name : 'Unknown Author'}</span></p>
                <p class="card-text">Publisher: <span class="text-info">${element.publisher ? element.publisher[0] : ''}</span></p>
            </div>
            <div class="card-footer border-0 py-4">
                <p class="card-text text-secondary">First Published: ${element.first_publish_year ? element.first_publish_year : ''}</p>
            </div>
        </div>`;
        div.classList.add('col');
        cardContainer.appendChild(div);
    });
};