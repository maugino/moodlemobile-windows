﻿var templates = [
    "root/externallib/text!root/plugins/page/view.html",
    "root/externallib/text!root/plugins/page/dialog.html"
];

define(templates, function (viewTpl, dialogTpl) {
    var plugin = {
        settings: {
            name: "page",
            type: "mod",
            component: "mod_page",
            lang: {
                component: "core"
            }
        },

        render: function(courseId, sectionId, section, module) {
            var data = {
                "courseId": courseId,
                "sectionId": sectionId,
                "section": section,
                "module": module
            };

            return MM.tpl.render(MM.plugins.page.templates.view.html, data);
        },

        /**
         * Callback executed when the contents page is rendered.
         */
        contentsPageRendered: function() {

            $(".page-downloaded").on(MM.clickType, function(e) {
                e.preventDefault();
                var path = $(this).data("path");
                path = path.substring(0, path.lastIndexOf("/") + 1) + "index.html";
                path = MM.fs.getRoot() + "/" + path;

                MM.plugins.page._showPage(path);
            });

            $(".page-download-all").on(MM.clickType, function(e) {
                e.preventDefault();

                var contentId = $(this).data("content");
                var courseId = $(this).data("course");
                var sectionId = $(this).data("section");

                var downloadIcon = $("#download-all-" + contentId);
                if (downloadIcon) {
                    downloadIcon.attr("src", "img/loadingblack.gif");
                }

                var that = $(this);

                var errorFn = function() {
                    downloadIcon.attr("src", "img/download.png");
                    MM.popErrorMessage(MM.lang.s("errordownloading"));
                };

                // Download all the page images, css, etc...
                MM.plugins.contents.downloadAll(courseId, sectionId, contentId,
                    // Success.
                    function(paths) {
                        downloadIcon.remove();
                        var path = paths[0].filePath;
                        path = path.substring(0, path.lastIndexOf("/") + 1);
                        var link = $("#page-" + contentId);
                        link.attr("data-path", path);
                        link.removeClass("page-download-all").addClass("page-downloaded");

                        var indexFileURL = MM.fs.getRoot() + "/" + path + "index.html";

                        MM.plugins.page._showPage(indexFileURL);
                    },
                    // Error.
                    errorFn
                );
            });
        },

        _showPage: function(path) {

           // We solve path problem
            var pathFile = path.split('LocalState//');
            var file = pathFile[1];
            file = file.replace('\/', '\\');
            file = file.replace('/', '\\');
            var newpath = MM.fs.getRoot() + file;
            MM._openFile(newpath);
            return;

        },

        templates: {
            "view": {
                html: viewTpl
            },
            "dialog": {
                html: dialogTpl
            }
        }

    };

    MM.registerPlugin(plugin);

});