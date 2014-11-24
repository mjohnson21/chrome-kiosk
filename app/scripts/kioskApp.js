/**
* kioskAPP Module
*
* Description
*/
'use strict';
angular.module('KioskApp', ['chromeStorage'])

.controller('kioskCtrl', ['$scope', '$sce', function ($scope, $sce) {

	$scope.currentWebviewSrc='http://google.com';
	$scope.defaultWebviewSrc='http://webmj.net';
	$scope.setWebviewSrc = function() {
		$scope.safeWebviewSrc = $sce.trustAsResourceUrl($scope.currentWebviewSrc);
		$scope.showAdmin=false;
		// Set the url to currentWebViewSrc
		chrome.storage.local.set({'currentWebviewSrc': $scope.currentWebviewSrc}, function() {
			console.log('Settings saved');
        });
        var localWebviewSrc = chrome.storage.local.get('currentWebviewSrc', function(){
			console.log('getting localWebviewSrc');
        });
        console.log(localWebviewSrc);
		return;
	};

	$scope.init = function() {
		console.log('init has fired');
		chrome.storage.local.set({'test':'this is a test'});


		$scope.setWebviewSrc();
	};




	// =====================================================
	// Local Storage Functionality
	// =====================================================
	// function lsSubmit(key, val) {
	// 	return chrome.storage.local.set(key, val);
	// }
	// function lsGetItem(key) {
	// 	return chrome.storage.local.get(key);
	// }
}]);