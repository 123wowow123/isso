var $ = require("app/dom");
var utils = require("app/utils");

"use strict";

module.exports = function getThreadConfig() {
    var isso_thread = $('#isso-thread');
    var selected = isso_thread && isso_thread.getAttribute;
    var thread_config = {
        "has_author": selected && isso_thread.hasAttribute("data-isso-author"),
        "author": selected && isso_thread.getAttribute("data-isso-author"),
        "has_email": selected && isso_thread.hasAttribute("data-isso-email"),
        "email": selected && isso_thread.getAttribute("data-isso-email"),
        "has_website": selected && isso_thread.hasAttribute("data-isso-website"),
        "website": selected && isso_thread.getAttribute("data-isso-website"),
        "has_vote": selected && isso_thread.hasAttribute("data-isso-vote"),
        "vote": selected && utils.isTrue(isso_thread.getAttribute("data-isso-vote")),
        "has_modify": selected && isso_thread.hasAttribute("data-isso-modify"),
        "modify": selected && utils.isTrue(isso_thread.getAttribute("data-isso-modify")),
    };
    return thread_config;
}
