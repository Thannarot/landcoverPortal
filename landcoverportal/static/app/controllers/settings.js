(function() {

    'use strict';
    angular.module('landcoverportal')
        .controller('settingsCtrl', function($scope, appSettings) {

            $scope.menus = appSettings.menus;
            $scope.applicationName = appSettings.applicationName;
            $scope.footerLinks = appSettings.footerLinks;
            $scope.partnersHeader = appSettings.partnersHeader;
            $scope.partnersFooter = appSettings.partnersFooter;
            $scope.serviceApplicationsCards = appSettings.serviceApplicationsCards;
            $scope.descriptionModalBody = '';
            $scope.descriptionModalTitle = '';

            $scope.trimDescription = function(description) {
                return String(description).substring(0, 220);
            };

            // Modal Close Function
            $scope.closeModal = function() {
                $('#descriptionModal').addClass('display-none-imp');
            };

            // Modal Open Function
            $scope.showModal = function(title, description) {
                $scope.descriptionModalTitle = title;
                $scope.descriptionModalBody = description;
                $('#descriptionModal').removeClass('display-none-imp');
            };

            // Close the Modal
            $('.modal-close').click(function() {
                $scope.closeModal();
            });

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target === $('#descriptionModal')[0]) {
                    $scope.closeModal();
                }
            };

            $('#carousel').carousel({
                interval: 2000
            });

        });

})();