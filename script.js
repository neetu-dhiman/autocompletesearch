const searchEl = document.getElementById("search");
const countrylistEl = document.getElementById("countrylist");

let searchCounter = 0;
// const controller = new AbortController();

const getData = (query) => {
    const countBefore = ++searchCounter;
    if (query.trim().length > 0) {
        fetch("https://api.first.org/data/v1/countries?" + new URLSearchParams({
            q: query
        }))
            .then((res) => {
                return res.json()
            })
            .then(res => {
                if (countBefore !== searchCounter) {
                    console.log("cancelled");
                    return; 
                }
                removeChildren(countrylistEl);
                let countries = Object.values(res.data);
                countrylistEl.style.display = "block";
                if (countries.length > 0) {
                    for (let countryObj of countries) {
                        let list = document.createElement('li');
                        list.innerHTML = countryObj.country;
                        countrylistEl.appendChild(list);
                    }
                } else {
                    let list = document.createElement('li');
                    list.innerHTML = "No Items Found";
                    countrylistEl.appendChild(list);
                }
            });
    } else {
        removeChildren(countrylistEl);
    }
}


// to remove list items
function removeChildren(domElement) {
    while (domElement.firstChild) {
        domElement.removeChild(domElement.lastChild);
    }
    countrylistEl.style.display = "none";
}

// to update value in search field
countrylist.addEventListener("click", (event) => {
    if(event.target.tagName === "LI") {
        searchEl.value = event.target.innerHTML;
        countrylistEl.style.display = "none";
        removeChildren(countrylist);
    }
});

const debounce = function (fn, delay) {
    let timer;
    return function (...args) {
        let context = this;
        clearInterval(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    }
}

const debouncedFn = debounce(getData, 500);
searchEl.addEventListener("keyup", (event) => {
    debouncedFn(event.target.value);
})