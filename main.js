// const apiKey = '7e44ec0b87e04b5a9ca94435232210';
const apiKey = '62faf77ce986422eaaa145715232410';

const header = document.querySelector('#header');
const input = document.querySelector('#inputCity');
const button = document.querySelector('#btn');
const result = document.getElementById("result");

let cityData = window.localStorage.getItem('city');
showCard(JSON.parse(cityData));

button.addEventListener('click', async (e) => {
    e.preventDefault();

    let city = input.value.trim();
    const jsonData = await getWeather(city);

    showCard(jsonData);

    window.localStorage.setItem('city', JSON.stringify(jsonData));
})


function showCard(jsonData){
    if (jsonData.error) {
        removeCard();
        showError(jsonData);
    } else {
        removeCard();
        showWeather(jsonData);
    }
}

async function getWeather (city) {
    const query = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    const response = await fetch(query);
    return await response.json();
}

function showWeather(jsonData) {
    const city = jsonData.location.name;
    const county = jsonData.location.country;
    const temperature = jsonData.current.temp_c;
    const textMassage= jsonData.current.condition.text;
    const icon = jsonData.current.condition.icon;

    const htmlCard = `<div class="card">
                             <h2 class="card__city">${city}<span class="card__city-country">${county}</span></h2>
                             <div class="card__weather">
                                <div class="card__value">${temperature}<sup>&deg;C</sup></div>
                                <img class="card__img" src="${icon}" alt="Weather">
                             </div>
                             <div class="card__description">${textMassage}</div>
                             <button type="button" class="card__btn" id="card-btn">SHOW MORE</button>
                          </div>`;
    header.insertAdjacentHTML('afterend', htmlCard);

    const showBtn = document.getElementById("card-btn");

    let executed = false;
    showBtn.addEventListener('click', () => {

        if (!executed) {
            const fellsLike = jsonData.current.feelslike_c;
            const humidity = jsonData.current.humidity;
            const wind = jsonData.current.wind_kph;

            const htmlMore = `<div class="card__info" id="card-info">
                                    <p>Feels like: ${fellsLike}<sup>&deg;C</sup></p>
                                    <p>Humidity: ${humidity}%</p>
                                    <p>Wind: ${wind} km/h</p>
                                </div>`;

            showBtn.insertAdjacentHTML('afterend', htmlMore);
            showBtn.innerHTML = "HIDE";

            executed = true;
        } else {
            const cardInfo = document.getElementById("card-info");
            cardInfo.remove();
            showBtn.innerHTML = "SHOW MORE";

            executed = false;
        }
    });
}

function showError(jsonData) {
    const errorMessage = jsonData.error.message
    const html = `<div class="card">${errorMessage}</div>`;

    header.insertAdjacentHTML('afterend', html);
}

function removeCard() {
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
}
