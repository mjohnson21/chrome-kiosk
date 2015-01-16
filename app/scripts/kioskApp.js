/**
* kioskAPP Module
*
* Description
*/
'use strict';
angular.module('KioskApp', ['chromeStorage', 'ngAnimate', 'angular-md5'])

.controller('kioskCtrl', ['$scope', '$sce', '$timeout', 'md5', function ($scope, $sce, $timeout, md5) {

	// Keep power on, run fullscreen
	chrome.power.requestKeepAwake('display');
	// chrome.app.window.current().fullscreen();

	$scope.user = {};
	$scope.authenticated = false;
	$scope.showAuth = false;
	$scope.loading = false;
	$scope.error = false;

	$scope.setWebviewSrc = function() {
		$scope.safeWebviewSrc = $sce.trustAsResourceUrl($scope.currentWebviewSrc);
		$scope.showAdmin=false;

		// Set the url to currentWebViewSrc
		chrome.storage.local.set({'currentWebviewSrc': $scope.currentWebviewSrc}, function() {
			console.log('Settings saved');
        });

		return;
	};

	$scope.showAdminPanel = function() {
		if ($scope.authenticated){
			$scope.showAdmin = true;
		}
		else {
			$scope.showAuth = true;
		}
	};

	// Authenticate a user based on user/pw they provide
	$scope.auth = function() {
		// Reject if we have empty values
		if (!$scope.user.username || !$scope.user.password){
			return;
		}

		// Set appropriate flags
		$scope.loading = true;
		var didPass = false;

		// Create request 
		var USERS = 'https://chrome-kiosk.firebaseio.com/users';
		Firebase.INTERNAL.forceWebSockets(); // Prevent blocked frames and enable long polling
		var ref = new Firebase(USERS);
		ref.orderByKey().equalTo($scope.user.username).limitToFirst(1).on('value', function(snapshot){
			var returnData = snapshot.val();
			for (var userObj in returnData){
				var user = returnData[userObj];

				// Check to see if user and pw match
				if (user.username === $scope.user.username && user.password === md5.createHash($scope.user.password)){
					didPass = true;
				}
			}

			// Ensure we hit the next digest cycle
			$timeout(function(){
				$scope.authenticated = didPass;
				$scope.showAdmin = didPass;
				$scope.error = !didPass;
				$scope.loading = false;
			}, 500);
		});
	};

	// Cancel authentication
	$scope.cancel = function() {
		$scope.showAdmin = $scope.showAuth = false;
	};

	// Logout
	$scope.logout = function() {
		$scope.user = {};
		$scope.authenticated = $scope.showAdmin = $scope.showAuth = false;
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