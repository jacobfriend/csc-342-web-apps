import api from './APIClient_mock.js';

const countiesSelect = document.querySelector('#counties-select');
countiesSelect.addEventListener('change', e => {
  updateParks()
});



/*****************************/
/*  TASK 2: COUNTY DROPDOWN  */
/*****************************/

const countyOptionTemplate = document.getElementById('countyOptionTemplate');
api.getCounties().then((counties) => {
  counties.forEach(county => {
    const countyOptionInstance = countyOptionTemplate.content.cloneNode(true);
    const countyOption = countyOptionInstance.querySelector('option');
  
    countyOption.value = county.id;
    countyOption.textContent = county.name;
  
    countiesSelect.appendChild(countyOption);
  });
  updateParks();
});

/*******************/
/*  END OF TASK 2  */
/*******************/

function updateParks() {
  const cIndex = countiesSelect.selectedIndex;
  const countyId = countiesSelect[cIndex].value;
  api.getParksByCountyId(countyId).then(parks => {
    resetParks();
    fillParksHTML(parks);
  });
}

/**
 * Clear current parks
 */
function resetParks(parks) {
  const parkList = document.querySelector('#parks-list');
  parkList.innerHTML = '';
}

/**
 * Create all parks HTML and add them to the webpage.
 */
function fillParksHTML(parks) {
  const parkList = document.querySelector('#parks-list');
  parks.forEach(park => {
    parkList.append(createParkHTML(park));
  });
}



/******************************/
/*  TASK 3: DISPLAYING PARKS  */
/******************************/

const parkTemplate = document.querySelector('#parkTemplate');
const countyChipTemplate = document.querySelector('#countyChipTemplate');

function createParkHTML(park) {
  const parkInstance = parkTemplate.content.cloneNode(true);
  const parkElement = parkInstance.querySelector('.park');

  parkElement.href = '/park?id=' + park.id;

  const parkName = parkElement.querySelector('h2');
  parkName.textContent = park.name;

  park.counties.forEach(county => {
    const countyInstance = countyChipTemplate.content.cloneNode(true);
    const countyElement = countyInstance.querySelector('.county');

    countyElement.textContent = county.name;
    parkElement.appendChild(countyElement);
  });
  return parkElement;
}