function setFlashMessageFadeOut (flashMessageElement) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        const timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashMessageElement.remove();
            }
            currentOpacity = currentOpacity - 0.05;
            flashMessageElement.style.opacity = currentOpacity;
        }, 50);
    }, 4000);
}

function addFlashFromFrontEnd (message) {
    const flashMessageDiv = document.createElement('div');
    const innerFlashDiv = document.createElement('div');
    const innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute('id', 'flash-message');
    innerFlashDiv.setAttribute('class', 'alert alert-info');
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}

function createCard (postData) {
    return `<div id="post-${postData.id}" class="card">
    <div class = "card-body">
        <div class = "thumbnail">
            <img class = "card-image" src="${postData.thumbnail}" alt="Missing Image">
        </div>
        <p class = "card-title">${postData.title}</p>
        <p class = "card-text">${postData.description}</p>
        <a href= "/post/${postData.id}}" class="anchor-buttons">Post Details</a>
    </div>
</div>`;
}

function executeSearch () {
    const searchTerm = document.getElementById('search-text').value;
    if (!searchTerm) {
        location.replace('/');
        return;
    }
    const mainContent = document.getElementById('main-content');
    const searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
        .then((data) => {
            return data.json();
        })
        .then((data_json) => {
            let newMainContentHTML = '';
            data_json.results.forEach((row) => {
                newMainContentHTML += createCard(row);
            });
            mainContent.innerHTML = newMainContentHTML;
            if (data_json.message) {
                addFlashFromFrontEnd(data_json.message);
            }
        })
        .catch((err) => console.log(err));
}

const flashElement = document.getElementById('flash-message');
if (flashElement) {
    setFlashMessageFadeOut(flashElement);
}

const searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.onclick = executeSearch;
}
