/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.viewuser')
        .controller('ViewCtrl', ViewCtrl);

    /** @ngInject */
    function ViewCtrl($scope, $http, $uibModal, toastr) {

        $scope.smartTablePageSize = 10;

        $scope.dataInterviewee = [];

        var interviewed = {
            'id': "interviewed"
        };
        var getInterviewed = function() {
            $http.post('https://ezh9ingj6l.execute-api.us-east-1.amazonaws.com/dev/getInterns', interviewed).then(function(response) {
                console.log(response);
                $scope.dataInterviewee = (response.data.data.Items);
                //console.log($scope.dataInterviewee);

            });
            $scope.Interviewee = [].concat($scope.dataInterviewee);
            //console.log($scope.Interviewee);
        }
        getInterviewed();
        $scope.selectedIntern = {};

        var internSelected = function(index) {
          console.log($scope.selectedIntern);
            $http.post('https://ezh9ingj6l.execute-api.us-east-1.amazonaws.com/dev/createUser', $scope.selectedIntern).then(function(response) {
                console.log(response.data);
                if ((response.data.status) == 'success') {
                    toastr.success("New Intern added successfully");
                    $scope.Interviewee.splice(index, 1);
                } else {
                    toastr.error("Unable to add new intern");
                }

            });
        }
        $scope.viewdata = function(row) {
            $scope.selectedIntern = angular.copy(row);
            var index = $scope.Interviewee.indexOf(row);
            //console.log($scope.selectedIntern);
            //console.log(row);
            $uibModal.open({
                animation: true,
                controller: 'ViewModalCtrl',
                templateUrl: 'app/pages/viewuser/viewusermodal/viewusermodal.html'
            }).result.then(function(data) {
                //console.log(data);
                var status = {
                    'status': 'active'
                };
                $scope.selectedIntern = angular.merge($scope.selectedIntern, data, status);
                //$scope.selectedIntern=angular.merge($scope.selectedIntern,status);
                //console.log($scope.selectedIntern);
                internSelected(index);


            });
        };



    }


})();
