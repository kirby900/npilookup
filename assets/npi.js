angular.module("app", ['ui.grid', 'ui.grid.resizeColumns'])
.controller("MyController", function($scope, $http, $q) {
  console.log("Entered MyController");

  $scope.npiList = "";

  $scope.gridOptions = {
    enableSorting: true,
    enableColumnResizing: true,
    data: [],
    columnDefs: [{
      field: 'number',
      displayName: 'NPI #',
      width: "10%",
      minWidth: 100
    }, {
      field: 'name',
      displayName: 'Name',
      width: "30%",
      minWidth: 125
    }, {
      field: 'credential',
      displayName: 'Credential',
      width: "10%",
      minWidth: 50
    }, {
      field: 'city',
      displayName: 'City',
      width: "30%",
      minWidth: 125
    }, {
      field: 'state',
      displayName: 'State',
      width: "10%",
      minWidth: 50
    }, {
      field: 'enumeration_type',
      displayName: 'Type',
      width: "10%",
      minWidth: 50
    }]
  };

  $scope.isLoading = false;

  $scope.lookup = function() {
    console.log("Entered lookup()");
    if (!$scope.npiList || $scope.npiList.length === 0) return;

    // Split input list on commas or whitespace
    var npiNumbers = $scope.npiList.split(/[,\s]+/);
    console.log('Number of list elements: ' + npiNumbers.length);

    $scope.gridOptions.data = [];     // Clear the grid
    $scope.isLoading = true;          // Flag loading

    var promises = [];

    // Spawn separate requests for each NPI
    npiNumbers.forEach(function(npiNumber) {
      var p = $http({
        method: "GET",
        url: "http://localhost:1337/Proxy/LookupByNPI",
        responseType: "json",
        params: {
          npi: npiNumber
        }
      });

      promises.push(p);
    });


    var displayRecs = [];

    $q.all(promises)
      .then(function(responses) {
        console.log('$q.all success');
        console.log('Number of responses: ' + responses.length);

        responses.forEach(function(response) {
          //var data = response.data;

          if (response.data.Errors) {
            //console.log('Error returned for NPI ' + npiNumber);
            //console.log(data.Errors.number);
            var msg = response.data.Errors.number.split('.');

            displayRecs.push({
              number: -1,
              name: msg[0],
              credential: "",
              city: "",
              state: "",
              enumeration_type: ""
            });

          } else {
            var results = response.data.results;

            results.forEach(function(row) {
              displayRecs.push({
                number: row.number,
                name: row.basic.name || "",
                credential: row.basic.credential ?  row.basic.credential.replace(/\./g, '') : "",
                city: row.addresses[0].city || "",
                state: row.addresses[0].state || "",
                enumeration_type: row.enumeration_type === 'NPI-1' ? 'Individual' : 'Organization'
              });
            });

            $scope.gridOptions.data = displayRecs;
          }

        }, function(response) {
          console.log("Error");
        });

        $scope.isLoading = false;

      });
  };

});
