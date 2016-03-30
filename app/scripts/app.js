// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';

/*jslint
  browser: true
*/
/*global
    angular
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
    .config(function ($urlRouterProvider, $translateProvider, $showdownProvider, ImgCacheProvider) {

        // PREPARE IMG CACHE
        // as we deal with 2 hostnames for inner and outer network we provide a custom hash function
        var origHashFn = ImgCache.overridables.hash;
        var parser = document.createElement('a');


        ImgCache.overridables.hash = function(a){

            // so strip protocol host and port
            parser.href=a;
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
            var path = [parser.pathname,parser.search,parser.hash].join();

            var hashResult = origHashFn(path);
            return hashResult;
        };

        // PREPARE ANGULAR IMAGE CACHE WRAPPER
        // image cache
        ImgCacheProvider.setOption('debug', true);
        ImgCacheProvider.setOption('usePersistentCache', true);
        var quota =  73 * 1024 * 1024;
        ImgCacheProvider.setOption('chromeQuota',quota);

        ImgCacheProvider.manualInit = true;

        // markdown
        $showdownProvider.setOption('parseImgDimension', true);
        $showdownProvider.setOption('strikethrough', true);
        $showdownProvider.setOption('tables', true);

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/news');

        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/',
            suffix: '.json'
        });
        $translateProvider.fallbackLanguage(['en', 'de']);
        var discoveredLanguage = $translateProvider.determinePreferredLanguage();
        $translateProvider.registerAvailableLanguageKeys(['de', 'en'], {
            'de*': 'de',
            'en*': 'en'
        });
        function guessLanguage(lang) {
            console.log(lang);
            if (lang && lang.length >= 5 && lang.indexOf('_') !== -1) {
                var parts = lang.split('_');
                if (parts.length > 0) {
                    return parts[0];
                }
            }
            if (lang && lang.length === 2) {
                return lang;
            }
            return 'de';
        }
        var lang = guessLanguage(discoveredLanguage);
        $translateProvider.use(lang);

    }).constant('AVAILABLE_LANGUAGES', ['de', 'en'])

    .run(function ($ionicPlatform , ImageCacheService, $rootScope, $q) {

        function isMobile(){
            return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) &&
                !navigator.platform.match(/(Linux x86_64)/i); // required as chrome emulates agent string if device testing mode is enabled

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
