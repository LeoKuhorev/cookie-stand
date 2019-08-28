'use  strict';

//GLOBAL VARIABLES
var salesEl = document.getElementById('sales');
var staffEl = document.getElementById('staff');
var dailyLocationCookiesTotal;
var dailyLocationTossersTotal;
var trEl;
var thEl;
var tdEl;

//FUNCTIONS
//function that generates a random number between two numbers (including min and max values)
function generateRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//function for rendering <tr> element
function renderTr(parentElement) {
  trEl = document.createElement('tr');
  parentElement.appendChild(trEl);
}

//function for rendering <th> element
function renderTh(textContent, parentElement){
  thEl = document.createElement('th');
  thEl.textContent = textContent;
  parentElement.appendChild(thEl);
}

//function for rendering <td> element
function renderTd(textContent, parentElement) {
  tdEl = document.createElement('td');
  tdEl.textContent = textContent;
  parentElement.appendChild(tdEl);
}

//store object constructor function
function Store(name, minCustomers, maxCustomers, avgCookiesPerCustomer) {
  this.name = name;
  this.minCustomers = minCustomers;
  this.maxCustomers = maxCustomers;
  this.avgCookiesPerCustomer = avgCookiesPerCustomer;
  this.customersPerHourArr = [];
  this.tossersPerHourArr = [];
  this.cookiesSoldPerHourArr = [];
  this.totalPerLocation = 0;
  this.maxTossers = 0;
  this.randomCustomers = function () {
    for (var i = 0; i < operationHoursArr.length; i++){
      var randomCustomersPerHour = generateRandom(this.minCustomers, this.maxCustomers) * correctionArr[i];
      this.customersPerHourArr.push(randomCustomersPerHour);
      var tossersPerHour = Math.ceil(randomCustomersPerHour/20);
      if (tossersPerHour < 2) {
        this.tossersPerHourArr.push(2);
      } else {
        this.tossersPerHourArr.push(tossersPerHour);
      }
    }
    this.maxTossers = Math.max.apply(null, this.tossersPerHourArr);
  };
  this.randomCookies = function() {
    this.randomCustomers();
    for (var i = 0; i < operationHoursArr.length; i++){
      var cookiesSold = Math.floor(this.customersPerHourArr[i] * this.avgCookiesPerCustomer);
      this.cookiesSoldPerHourArr.push(cookiesSold);
      this.totalPerLocation += cookiesSold;
    }
  };
  this.renderSales = function() {
    this.randomCookies();
    renderTr(salesEl);
    renderTd(this.name, salesEl);
    for (var i = 0; i < operationHoursArr.length; i++) {
      renderTd(this.cookiesSoldPerHourArr[i], salesEl);
    }
    renderTd(this.totalPerLocation, salesEl);
  };
  this.renderTossers = function() {
    renderTr(staffEl);
    renderTd(this.name, staffEl);
    for (var i = 0; i < operationHoursArr.length; i++) {
      renderTd(this.tossersPerHourArr[i], staffEl);
    }
    renderTd(this.maxTossers, staffEl);
  };
  storesArr.push(this);
}

//function for rendering table header row
function renderHeader(totalRowName, parentElement) {
  renderTr(parentElement);
  renderTh('LOCATON / TIME', parentElement);
  for (var i = 0; i < operationHoursArr.length; i++) {
    renderTh(operationHoursArr[i], parentElement);
  }
  renderTh(totalRowName, parentElement);
}

//function for getting hourly total
function hourlyTotal() {
  for (var i = 0; i < operationHoursArr.length; i++) {
    var totalCookiesPerHour = 0;
    var totalTossersPerHour = 0;
    dailyLocationCookiesTotal = 0;
    dailyLocationTossersTotal = 0;
    for (var k = 0; k < storesArr.length; k++) {
      totalCookiesPerHour += storesArr[k].cookiesSoldPerHourArr[i];
      totalTossersPerHour += storesArr[k].tossersPerHourArr[i];
      dailyLocationCookiesTotal += storesArr[k].totalPerLocation;
      dailyLocationTossersTotal += storesArr[k].maxTossers;
    }
    totalCookiesPerHourArr.push(totalCookiesPerHour);
    totalTossersPerHourArr.push(totalTossersPerHour);
  }
}

//function for rendering footer (hourly total) row
function renderFooter(hourlyValueArr, dailyValue, parentElement) {
  // hourlyTotal();
  renderTr(parentElement);
  renderTd('TOTALS', parentElement);
  for (var i = 0; i < operationHoursArr.length; i++) {
    renderTd(hourlyValueArr[i], parentElement);
  }
  renderTd(dailyValue, parentElement);
}

//function for rendering the entire sales table
function renderSalesTable() {
  renderHeader('DAILY LOCATION TOTAL', salesEl);
  for (var i = 0; i < storesArr.length; i++) {
    storesArr[i].renderSales();
  }
  hourlyTotal();
  renderFooter(totalCookiesPerHourArr, dailyLocationCookiesTotal, salesEl);
}

//function for rendering staffing table
function renderStaffTable() {
  renderHeader('DAILY LOCATION MAX', staffEl);
  for (var i = 0; i < storesArr.length; i++) {
    storesArr[i].renderTossers();
  }
  hourlyTotal();
  renderFooter(totalTossersPerHourArr, dailyLocationTossersTotal, staffEl);
}

//STORES INFORMATION
// hours of operation
var operationHoursArr = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

// adjustments for foot traffic based on research
var correctionArr = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];

//arrays with hourly totals of cookies sold and tossers needed
var totalCookiesPerHourArr = [];
var totalTossersPerHourArr = [];

//array with store objects
var storesArr = [];

//creating stores using Store constructor function
new Store ('1st and Pike', 23, 65, 6.3);
new Store ('SeaTac Airport', 3, 24, 1.2);
new Store ('Seattle Center', 11, 38, 3.7);
new Store ('Capitol Hill', 20, 38, 2.3);
new Store ('Alki', 2, 16, 4.6);

//RENDERING
renderSalesTable();
renderStaffTable();
