/**
* kioskAPP Module
*
* Description
*/
'use strict';
angular.module('KioskApp', ['chromeStorage', 'ngAnimate'])

.controller('kioskCtrl', ['$scope', '$sce', '$timeout', function ($scope, $sce, $timeout) {

	// Keep power on, run fullscreen
	chrome.power.requestKeepAwake('display');
	// chrome.app.window.current().fullscreen();

	$scope.setWebviewSrc = function() {
		$scope.safeWebviewSrc = $sce.trustAsResourceUrl($scope.currentWebviewSrc);
		$scope.showAdmin=false;

		// Set the url to currentWebViewSrc
		chrome.storage.local.set({'currentWebviewSrc': $scope.currentWebviewSrc}, function() {
			console.log('Settings saved');
        });

		return;
	};


	$scope.init = function() {
		chrome.storage.local.get('currentWebviewSrc', function (result) {
			if (result === 'undefined') {
				$scope.currentWebviewSrc = 'http://news.google.com';
			} else {
				$scope.currentWebviewSrc = result.currentWebviewSrc;
			}
			$timeout(function(){
				$scope.setWebviewSrc();
			}, 100);
		});

	};


}]);