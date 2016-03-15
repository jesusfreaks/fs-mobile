/**
 * image cache handling
 * see app.js for init & settings
 * <p/>
 * Created by Benjamin Jacob on 23.02.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile')
    .service('ImageCacheService', function (ImgCache, ConnectionState, DYNENV) {

        var svc = {
            /**
             * the url. to cache the image
             * @param relativeUrl
             */
            cacheImage: function (relativeUrl) {
                if(!relativeUrl){
                    return;
                }
                ConnectionState.checkOnline().then(function (isOnline) {
                    if (isOnline) {
                        var absoluteUri = (DYNENV.apiEndpoint || '') + relativeUrl;
                        if(!ImgCache.isCached(absoluteUri,function(cached){
                                if(!cached){
                                    ImgCache.cacheFile(absoluteUri);
                                }
                            })){
                        }
                    }
                });
            }
        };
        return svc;
    });