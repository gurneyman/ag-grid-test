module.exports = fakeRowDataService;

fakeRowDataService.$inject = ['$timeout'];
function fakeRowDataService($timeout) {
  var nextEmpNum = 10;
  var firstNames = ['Sophie', 'Isabelle', 'Emily', 'Olivia', 'Lily', 'Chloe', 'Isabella', 'Amelia', 'Jessica', 'Sophia', 'Ava', 'Charlotte', 'Mia', 'Lucy', 'Grace', 'Ruby', 'Ella', 'Evie', 'Freya', 'Isla', 'Poppy', 'Daisy', 'Layla'];
  var lastNames = ['Beckham', 'Black', 'Braxton', 'Brennan', 'Brock', 'Bryson', 'Cadwell', 'Cage', 'Carson', 'Chandler', 'Cohen', 'Cole', 'Corbin', 'Dallas', 'Dalton', 'Dane', 'Donovan', 'Easton', 'Fisher', 'Fletcher', 'Grady', 'Greyson', 'Griffin', 'Gunner', 'Hayden', 'Hudson', 'Hunter', 'Jacoby', 'Jagger', 'Jaxon', 'Jett', 'Kade', 'Kane', 'Keating', 'Keegan', 'Kingston', 'Kobe'];
  var payTypes = ['Hourly', 'Salary'];

  return {
    createRow: createRow,
    generateRows: generateRows,
    getInfiniteScrollDataSource: getInfiniteScrollDataSource
  };

  // For creating one row with random data
  function createRow() {
    var empNum = nextEmpNum;
    nextEmpNum += 1;

    var payType = payTypes[Math.floor(Math.random() * 2)];
    var salary = getRandomSalary(payType);

    return {
      eeNum: 'B' + empNum,
      payNum: Math.floor(Math.random() * 6),
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      payType: payType,
      salary: salary,
      blockAutoPay: (Math.floor(Math.random() * 2) === 1),
      date: ''
    };

    function getRandomSalary(payType) {
      if (payType === 'Hourly') {
        return ((Math.random() * 20) + 10).toFixed(2);
      }
      return ((Math.random() * 100000) + 50000).toFixed(2);
    }
  }

  function generateRows() {
    var fakeData = [];
    for (var i = 0; i <= 100000; i += 1) {
      fakeData.push(createRow());
    }
    return fakeData;
  }

  /* 
    ag-grid datasource implementation
    See https://www.ag-grid.com/javascript-grid-infinite-scrolling/ for details
  */
  function getInfiniteScrollDataSource() {
    var DATA = generateRows(); // Fake some data

    return {
      rowCount: null,
      getRows: function (params) {
        $timeout( function () {
          var rowsThisPage = DATA.slice(params.startRow, params.endRow); // Get a slice of it

          var lastRow = -1;
          if (DATA.length <= params.endRow) { // Are we at the last row?
            lastRow = DATA.length;
          }

          params.successCallback(rowsThisPage, lastRow); // return data
        }, 500);
      }
    };
  }
}