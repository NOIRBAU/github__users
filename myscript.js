// OBTENER FORMULARIO
const form = document.getElementById("form");

// OBTENER BARRA DE BÚSQUEDA
const search = document.getElementById("search");

// OBTENER DATOS DEL USUARIO WIDGET
const userCard = document.getElementById("usercard");

// ESCUCHAR EVENTO SUBMIT DEL FORM
form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const username = search.value;
    getUserData(username);
    search.value = "";
});

// OBTENER LA INFO DE USUARIO EN GITHUB
async function getUserData(username) {
    const API = "https://api.github.com/users/"

    try {
        const userRequest = await fetch(API + username);

        if (!userRequest.ok) {
            throw new Error(userRequest.status);
        }
    
        const userData = await userRequest.json();
    
        if (userData.public_repos) {
            const reposRequest = await fetch(API + username + "/repos");
            const reposData = await reposRequest.json();
            userData.repos = reposData;
        }
        showUserData(userData);
    } catch (error) {
        showError(error.message);
    }    
}

// FUNCION PARA COMPONER HTML
function showUserData(userData) {
    let userContent = `
        <div class="usercard__container">
        <div class="container__top">
            <section class="container__left">
                <img src=${userData.avatar_url} class="profile">
            </section>
            <section class="container__right">
                <article class="container__user">
                    <div>
                        <h1>${ userData.name }</h1>
                        <h2>@ ${userData.login}</h2>
                    </div>
                    <p>${userData.created_at}</p>
                </article>
                <p class="bios">${ userData.bio }</p>
                <article class="container__follow">
                    <div>
                        <p>#Repos</p>
                        <h3>${ userData.public_repos }</h3>
                    </div>
                    <div>
                        <p>#Followers</p>
                        <h3>${ userData.followers}</h3>
                    </div>
                    <div>
                        <p>#Following</p>
                        <h3>${ userData.following}</h3>
                    </div>
                </article>
                <article class="extra__container">
                    <div>
                        <div class="display__row">
                            <img src="assets/location.png" class="icon">
                            <p>${ userData.location }</p>
                        </div>
                        <div class="display__row">
                            <img src="assets/link.png" class="icon">
                            <a>${ userData.blog }</a>
                        </div>
                    </div>
                    <div>
                        <div class="display__row">
                            <img src="assets/twitter.png" class="icon">
                            <p>${ userData.twitter_username}</p>
                        </div>
                        <div class="display__row">
                            <img src="assets/company.png" class="icon">
                            <p>${ userData.company}</p>
                        </div>
                    </div>
                </article>
            </section>
        </div>
        <div class="container__bottom">
    `;

    if (userData.repos) {
        userContent += `
            <section class="repos">`
            userData.repos.slice(0, 10).forEach(repo => {
            userContent += `<a href="${repo.html_url} target="_blank">${repo.name}</a>`
        })
        userContent += `</div>`;
    }
    userCard.innerHTML = userContent;
}

// FUNCION PARA GESTIONAR ERRORES

function showError(error) {
    const errorContent = `<h1 class="error">ERROR 😥 ${error}</h1>`
    userCard.innerHTML = errorContent;
}