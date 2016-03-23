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

        // image cache
        ImgCacheProvider.setOption('debug', true);
        ImgCacheProvider.setOption('usePersistentCache', true);
        var quota =  73 * 1024 * 1024;
        console.log('set quota',quota);
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

    .run(function ($ionicPlatform , ImageCacheService, $rootScope, $q, $cordovaDevice) {




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
            console.log('runing ImageCacheHelperInit.');
            platformReady.resolve('done-plattform-ready');
        });

        document.addEventListener('deviceready', onDeviceReady, false);

        function onDeviceReady() {
            console.log(device.cordova);
            deviceReady.resolve();
        }


        $q.all(dependencies).then(function(){
            $rootScope.$apply( ImageCacheService.init);
            //ImageCacheService.init();
        });
    });
