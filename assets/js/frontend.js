(() => {
    var e = {
        861: () => {
            function e(t) {
                return e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }, e(t)
            }

            var t, n;
            t = jQuery, n = {
                init: function (e) {
                    var a = "pjax:complete" === e.type;
                    n.updateFavorites(), a || (t(document).on("click", ".favorite-btn", n.toggleFavorite), wpRadioHooks.addAction("update_player_data", "wp-radio", n.updateFavorites))
                }, toggleFavorite: function (a) {
                    if (a.preventDefault(), parseInt(WRUF.currentUserID)) {
                        var o = t(this).attr("data-id"), i = t(this).hasClass("active");
                        wp.ajax.send("wp_radio_toggle_favorite", {
                            data: {id: o, type: i ? "remove" : "add"},
                            success: function (t) {
                                "object" === e(t) && (t = Object.values(t)), t = Array.isArray(t) ? t : [], localStorage.setItem("favorite_stations", JSON.stringify(t)), Swal.fire({
                                    toast: !0,
                                    title: i ? "Station removed from favorites." : "Station added to favorites",
                                    icon: "success",
                                    timer: 2500,
                                    position: "bottom",
                                    timerProgressBar: !0,
                                    showConfirmButton: !1
                                }).then((function () {
                                    n.updateFavorites()
                                }))
                            },
                            error: function (e) {
                                return console.log(e)
                            }
                        })
                    } else Swal.fire({
                        title: '<a href="'.concat(WRUF.myAccountURL, '">Login</a> first to add the station to your favorite list.'),
                        icon: "warning",
                        confirmButtonText: "OK"
                    })
                }, isFavorite: function (e) {
                    return n.getFavorites().includes(parseInt(e))
                }, getFavorites: function () {
                    var e = localStorage.getItem("favorite_stations");
                    return e ? (e = JSON.parse(e), Array.isArray(e) ? e = e.map((function (e) {
                        return parseInt(e)
                    })) : []) : []
                }, updateFavorites: function () {
                    t(".favorite-btn").each((function () {
                        var e = t(this).attr("data-id");
                        n.isFavorite(e) ? t(this).addClass("active") : t(this).removeClass("active")
                    }))
                }
            }, t(document).ready(n.init), t(document).on("pjax:complete", n.init)
        }, 654: () => {
            var e, t;
            e = jQuery, t = {
                init: function (n) {
                    n.type, new URLSearchParams(window.location.search).has("paginate") && e(".wp-radio-my-account-navigation a[data-target=favorites]").trigger("click"), e(".wp-radio-my-account-navigation a[href=#]").on("click", t.handleTabs), e(".change-password-button").on("click", t.passwordFieldsToggle), e(".wp-radio-form-edit-account").on("submit", t.handleEditAccount)
                }, handleEditAccount: function (t) {
                    t.preventDefault();
                    var n = e(this), a = n.serialize(), o = n.find(".form-message");
                    o.html(""), wp.ajax.send("wp_radio_edit_account", {
                        data: {data: a}, success: function (e) {
                            e.success && o.html('<p class="success">'.concat(e.success, "</p>"))
                        }, error: function (e) {
                            Array.isArray(e) ? e.forEach((function (e) {
                                o.append('<p class="error">'.concat(e, "</p>"))
                            })) : console.log(e)
                        }
                    })
                }, handleTabs: function (t) {
                    t.preventDefault();
                    var n = e(this).data("target");
                    e(".wp-radio-my-account-navigation a").removeClass("active"), e(this).addClass("active"), e(".account-content").removeClass("active"), e(".content-".concat(n)).addClass("active")
                }, passwordFieldsToggle: function (t) {
                    t.preventDefault(), e(".change-password-fields").toggleClass("active")
                }
            }, e(document).ready(t.init), e(document).on("pjax:complete", t.init)
        }, 222: () => {
            var e, t;
            e = jQuery, t = {
                init: function () {
                    e(".report-btn").on("click", t.HandleReport)
                }, HandleReport: function (t) {
                    t.preventDefault();
                    var n = e(this).data("station"), a = n.id, o = n.title, i = n.link, r = n.thumbnail;
                    Swal.fire({
                        title: "Report a problem with station",
                        confirmButtonText: "Submit report",
                        showCancelButton: !0,
                        cancelButtonText: "Cancel",
                        cancelButtonColor: "#d33",
                        reverseButtons: !0,
                        showLoaderOnConfirm: !0,
                        preConfirm: function () {
                            var t = e("#report-email").val(), n = e("#report-issue").val(),
                                o = e("#report-message").val();
                            "" !== t ? "" !== n ? wp.ajax.send("wp_radio_report", {
                                data: {
                                    id: a,
                                    email: t,
                                    issue: n,
                                    message: o
                                }, error: function (e) {
                                    return console.log(e)
                                }
                            }) : Swal.showValidationMessage("No issue is selected!") : Swal.showValidationMessage("Email is missing!")
                        },
                        html: '\n                    <form id="report-form">\n                    \n                        <div class="selected-station">\n                            <img src="'.concat(r, '" alt="').concat(o, '" />\n                            <a href="').concat(i, '">').concat(o, '</a>\n                        </div>\n                        \n                        <div class="form-group">\n                            <label for="report-email">Your Email: <span class="required">*</span></label>\n                            <input type="email" id="report-email" name="email" />\n                        </div>\n                        \n                        <div class="form-group">\n                            <label for="report-issue">Select Issue: <span class="required">*</span></label>\n                            <select name="issue" id="report-issue" required>\n                                <option value="">Select the issue</option>\n                                <option>The page is not working</option>\n                                <option>Playback is not working</option>\n                                <option>Address or radio data is incorrect</option>\n                                <option>The site is using an incorrect stream link</option>\n                            </select>\n                        </div>\n                        \n                        <div class="form-group">\n                            <label for="report-email">Your Message:</label>\n                            <textarea name="message" id="report-message" rows="4" cols="30"></textarea>\n                        </div>\n                        \n                        <input type="hidden" name="station-id" value="').concat(a, '">                       \n                    </form>\n                    ')
                    }).then((function (e) {
                        e.isConfirmed && Swal.fire({
                            title: "Report sent successfully!",
                            icon: "success",
                            timer: 2500,
                            timerProgressBar: !0
                        })
                    }))
                }
            }, e(document).on("ready", t.init), e(document).on('pjax:complete', t.init)
        }, 313: () => {
            var e, t;
            e = jQuery, t = {
                init: function () {
                    e("#review_submit").on("click", t.handleSubmit), e("#delete_review").on("click", t.handleDelete), e(".star").on("click", t.handleSelection)
                }, handleDelete: function (t) {
                    t.preventDefault();
                    var n = e(this).data("review_id");
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: !0,
                        confirmButtonText: "Yes, delete it!",
                        reverseButtons: !0,
                        showLoaderOnConfirm: !0,
                        preConfirm: function () {
                            e("#rating").val(""), e("#review").val(""), e(".star").removeClass("active"), wp.ajax.send("wp_radio_delete_review", {
                                data: {id: n},
                                success: function (e) {
                                },
                                error: function (e) {
                                    return console.log(e)
                                }
                            })
                        }
                    }).then((function (t) {
                        t.isConfirmed && Swal.fire({
                            title: "Your review has been deleted.",
                            icon: "success",
                            timer: 3e3,
                            timerProgressBar: !0
                        }).then((function () {
                            e(".single-review.current-user-review").remove()
                        }))
                    }))
                }, handleSubmit: function (t) {
                    if (t.preventDefault(), parseInt(WRUF.currentUserID)) {
                        var n = e("#object_id").val(), a = e("#rating").val(), o = e("#review").val();
                        a ? o ? wp.ajax.send("wp_radio_add_review", {
                            data: {object_id: n, rating: a, review: o},
                            success: function (t) {
                                Swal.fire({
                                    title: "Your review has been ".concat(t.update ? "updated" : "added", "."),
                                    icon: "success",
                                    timer: 3e3,
                                    timerProgressBar: !0
                                }).then((function () {
                                    e("#no-review-msg").remove(), t.update && e(".single-review.current-user-review").remove(), e(".review-listing").append(t.html)
                                }))
                            },
                            error: function (e) {
                                return console.log(e)
                            }
                        }) : Swal.fire({
                            title: "Please, write a review.",
                            icon: "warning",
                            confirmButtonText: "OK"
                        }) : Swal.fire({title: "Please, select the rating.", icon: "warning", confirmButtonText: "OK"})
                    } else Swal.fire({
                        title: 'Please, <a href="'.concat(WRUF.myAccountURL, '">login</a> first to add a review.'),
                        icon: "warning",
                        confirmButtonText: "OK"
                    })
                }, handleSelection: function () {
                    e(this).addClass("active"), e(this).prevAll().addClass("active"), e(this).nextAll().removeClass("active"), e("#rating").val(e(this).data("rate"))
                }
            }, e(document).ready(t.init)
        }, 33: () => {
            var e, t;
            e = jQuery, t = {
                init: function () {
                    e(document).on("click", ".share-btn", t.openShare), e(document).on("click", ".share-item.embed", t.handleEmbed), e(document).on("click", ".share-item.link", t.copyLink), e(document).on("focus", ".embed-code textarea", t.copyEmbedCode), e(document).on("click", ".embed-code button", t.copyEmbedCode)
                }, openShare: function (t) {
                    t.preventDefault();
                    var n = e(this).data("station"), a = n.id, o = n.link, i = n.title;
                    Swal.fire({
                        title: "Share",
                        html: '\n                    <div class="embed-code">\n                        <textarea readonly><iframe src="'.concat(wpRadio.siteUrl, "/wp-radio/?player=popup&station_id=").concat(a, '" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></textarea>\n                        \n                        <button type="submit" class="wp-radio-button">Copy Code</button>\n                    </div>\n\n                    <div class="share-links">\n                    \n                        <div class="share-item link">\n                            <i class="dashicons dashicons-admin-links"></i>\n                            <span>Copy link</span>\n                            <input type="text" value="').concat(o, '" readonly>\n                        </div>\n                        \n                        <div class="share-item embed">\n                            <i class="dashicons dashicons-editor-code"></i>\n                            <span>Embed</span>\n                        </div>\n                            \n                        <a class="share-item facebook" href="https://www.facebook.com/sharer/sharer.php?u=').concat(o, '" target="_blank">\n                            <i class="dashicons dashicons-facebook"></i>\n                            <span>Facebook</span>\n                        </a>\n                        \n                        <a class="share-item twitter" href="https://twitter.com/intent/tweet?text=').concat(i, " Listen Live &url=").concat(o, '" target="_blank" >\n                            <i class="dashicons dashicons-twitter"></i>\n                            <span>Twitter</span>\n                        </a>\n                        \n                        <a class="share-item whatsapp" href="https://wa.me/?text=').concat(o, '" target="_blank" >\n                            <i class="dashicons dashicons-whatsapp"></i>\n                            <span>WhatsApp</span>\n                        </a>\n                        \n                    </div>\n                '),
                        showCloseButton: !0,
                        showConfirmButton: !1,
                        showCancelButton: !1,
                        customClass: "share-modal"
                    })
                }, handleEmbed: function () {
                    var t = e(".share-modal");
                    t.addClass("embed"), t.find(".swal2-title").text("Embed Player")
                }, copyLink: function () {
                    e(this).find("input").select(), document.execCommand("copy"), Swal.fire({
                        title: "Link copied to clipboard",
                        icon: "success",
                        showConfirmButton: !1,
                        toast: !0,
                        timer: 2e3,
                        timerProgressBar: !0,
                        position: "center"
                    })
                }, copyEmbedCode: function () {
                    e(".embed-code textarea").select(), document.execCommand("copy"), setTimeout((function () {
                        Swal.fire({
                            title: "Embed code copied to clipboard",
                            icon: "success",
                            showConfirmButton: !1,
                            toast: !0,
                            timer: 2e3,
                            timerProgressBar: !0,
                            position: "center"
                        })
                    }), 500)
                }
            }, e(document).ready(t.init)
        }
    }, t = {};

    function n(a) {
        var o = t[a];
        if (void 0 !== o) return o.exports;
        var i = t[a] = {exports: {}};
        return e[a](i, i.exports, n), i.exports
    }

    n.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return n.d(t, {a: t}), t
    }, n.d = (e, t) => {
        for (var a in t) n.o(t, a) && !n.o(e, a) && Object.defineProperty(e, a, {enumerable: !0, get: t[a]})
    }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
        "use strict";
        n(861), n(654), n(222), n(313), n(33)
    })()
})();