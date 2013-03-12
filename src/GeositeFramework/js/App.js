﻿/*jslint nomen:true, devel:true */
/*global Geosite, $, _*/

(function (N) {
    "use strict";
    N.app = {
        // Model and View instances (see Geosite.js for "class" objects)
        models: {
            panes: []
        },
        views: {
            panes: []
        },
        templates: {},
        data: {},
        config: {
            paneDefinitions: [
                { selector: "#left-pane", index: 0 },
                { selector: "#right-pane", index: 1 }
            ]
        },
        hashModels: null,

        init: function initializeApp(version, regionData, pluginClasses) {
            N.app.version = version;
            N.app.data.region = regionData;
            N.plugins = pluginClasses;

            this.hashModels = Backbone.HashModels.init({
                updateOnChange: false
            });
            N.app.models.screen = new N.models.Screen();
            N.app.views.screen = new N.views.Screen({
                model: N.app.models.screen,
                el: $('body')
            });
            //this.hashModels.addModel(N.app.models.screen);

            // Only create the first visible pane at startup.  The
            // additional pane will be created when it is requested
            this.createPane(0);
            initializeMaps();

            // Setup a manager for synced maps.  As maps are created, 
            // they will be added to it.
            N.app.syncedMapManager = new N.SyncedMapManager(N.app.models.screen);
        },

        createPane: function createPane(paneIndex) {
            initializePane(N.app.data.region, N.app.config.paneDefinitions[paneIndex]);
        }
    };

    function initializeMaps() {

        function resizeMap() {
            // Calculate the new width of the map, which is the size of the
            // container - the size of the sidebar.  Take 1 pixel off that 
            // result to make sure there isn't a rounding problem which pushes
            // the map off the container by being 1 pixel to wide
            var sideWid = $('.sidebar').width(),
                fullWid = $('.content').width(),
                mapWid = fullWid - sideWid - 1;

            $('.map').width(mapWid);
            $(N).trigger('resize');
        }

        resizeMap();
        $(window).resize(_.debounce(resizeMap, 300));

    }

    function initializePane(regionData, paneConfig) {
        var pane = new N.models.Pane({
            paneNumber: paneConfig.index,
            regionData: regionData
        });

        N.app.models.panes[paneConfig.index] = pane;
        N.app.views.panes[paneConfig.index] = new N.views.Pane({
            model: pane,
            el: $(paneConfig.selector)
        });
    }

    new N.TemplateLoader().load(N.app.templates);

}(Geosite));
