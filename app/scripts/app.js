// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';

/*jslint
  browser: true
*/
/* global
    angular, ionic
*/

angular.module('fsMobile.states', []);
angular.module('fsMobile.services', []);
    angular.module('fsMobile', ['ionic', 'ngCordova',
    'tabSlideBox',
    'pascalprecht.translate',
    'LocalForageModule',
    'fsMobile.controllers',
    'fsMobile.states',
    'fsMobile.rest',
    'fsMobile.services',
    'fsMobile.filters',
    'fsMobile.directives',
    'ui.bootstrap.datetimepicker',
    'config',
    'ng-showdown',
    'ImgCache'
])
    .config(function ($translateProvider, $urlRouterProvider, $showdownProvider, ImgCacheProvider, $ionicConfigProvider) {

        //######### PREPARE ImgCache
        // as we deal with 2 hostnames for inner and outer network we provide a custom hash function
        var origHashFn = ImgCache.overridables.hash;
        var parser = document.createElement('a');


        ImgCache.overridables.hash = function (a) {

            // so strip protocol host and port
            parser.href = a;
            /*
             //parser.href = "http://example.com:3000/pathname/?search=test#hash";
             parser.protocol; // => "http:"
             parser.hostname; // => "example.com"
             parser.port;     // => "3000"
             parser.pathname; // => "/pathname/"
             parser.search;   // => "?search=test"
             parser.hash;     // => "#hash"
             parser.host;     // => "example.com:3000"
             */
            var path = [parser.pathname, parser.search, parser.hash].join();

            var hashResult = origHashFn(path);
            return hashResult;
        };

        //######### PREPARE ANGULAR IMAGE CACHE WRAPPER
        ImgCacheProvider.setOption('debug', true);
        ImgCacheProvider.setOption('usePersistentCache', true);
        var quota = 73 * 1024 * 1024;
        ImgCacheProvider.setOption('chromeQuota', quota);

        ImgCacheProvider.manualInit = true;

        //######### MARKDOWN
        $showdownProvider.setOption('parseImgDimension', true);
        $showdownProvider.setOption('strikethrough', true);
        $showdownProvider.setOption('tables', true);

        //######### DEFAULT ROUTE
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/news');

        //######### LANG: moved to language-service

        $ionicConfigProvider.backButton.text('').previousTitleText('').icon('ion-chevron-left');
        $ionicConfigProvider.views.forwardCache(true);
        $ionicConfigProvider.views.maxCache(50);

    })

    .run(function ($ionicPlatform , ImageCacheService, $rootScope, $q, $ionicHistory, $filter) {

        function isMobile(){

            return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) &&
                !navigator.platform.match(/(Linux x86_64)|(Win32)/i); // required as chrome emulates agent string if device testing mode is enabled

        }

        // initialize different ready-states we depend on.
        var platformReady = $q.defer();
        var deviceReady = $q.defer();

        var dependencies = [];
        dependencies.push(platformReady.promise);
        dependencies.push(deviceReady.promise);

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default
            // (remove this to show the accessory bar above the keyboard for form inputs)
            if (window.cordova  && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                //window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleDefault();
            }
            platformReady.resolve('done-plattform-ready');
        });

        $ionicPlatform.registerBackButtonAction(function(e){

            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            }
            else if ($ionicHistory.backView()) {
                $ionicHistory.goBack(-1000);
            }
            else {
                $rootScope.backButtonPressedOnceToExit = true;
                window.plugins.toast.showShortBottom(
                    $filter('translate')('app.general.backButton.exit.toast'),function(){},function(){}
                );
                setTimeout(function(){
                    $rootScope.backButtonPressedOnceToExit = false;
                },2000);
            }
            e.preventDefault();
            return false;
        },101);

        function onDeviceReady() {
            deviceReady.resolve();
        }
        if(isMobile()) {
            document.addEventListener('deviceready', onDeviceReady, false);
        }else{
            deviceReady.resolve();
        }

        $q.all(dependencies).then(function(){
            ImageCacheService.init();
        });
    });
