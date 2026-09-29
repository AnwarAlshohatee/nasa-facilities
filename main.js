document.querySelector('button').addEventListener('click', getSites);


function getSites(){
    fetch('https://cors.io/?url=https://data.nasa.gov/docs/legacy/gvk9-iz74.json')
        .then(res => res.json())
        .then(data => {
            const getData = JSON.parse(data.body)
            console.log(getData)

            const container = document.querySelector('#facilities-container');

            container.innerHTML = '';

            const facilities = getData;

            facilities.forEach(site => {
                
                const card = document.createElement('section');
                card.classList.add('facility-card');

                const title = document.createElement('h2');
                title.classList.add('facility-title');
                title.innerText = site.facility;

                const center = document.createElement('p');
                center.innerText = site.center;

                const location = document.createElement('p');
                location.innerText = `${site.city}, ${site.state}`;

                const weather =document.createElement('p');
                weather.classList.add('facility-weather');
                weather.innerText = 'Loadingweather...'

                card.appendChild(title);
                card.appendChild(center);
                card.appendChild(location);
                card.appendChild(weather);

                container.appendChild(card);

                const lat = site.location?.latitude;
                const lon = site.location?.longitude;

                if(lat == null || lon == null){
                    weather.innerText = 'Weater unavailable';
                    return;
                }

                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;

                fetch(weatherUrl)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);

                        const temp = data.current.temperature_2m;

                        weather.innerText = `Temperature: ${temp}°F`
                    })
                    .catch(error =>{
                        console.error(error);
                        weather.innerText = 'Weather unavailable';
                    })
            });

        })
        .catch(error => {
            console.error(error);
            document.querySelector('#facilities-container').innerText = 'Could not load NASA facilities.';
        })
}

