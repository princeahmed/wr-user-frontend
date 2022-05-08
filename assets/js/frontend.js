/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/components/favorites.js":
/*!****************************************!*\
  !*** ./src/js/components/favorites.js ***!
  \****************************************/
/***/ (() => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

;

(function ($) {
  var app = {
    init: function init() {
      //init update favorites
      app.updateFavorites();
      $('.favorite-btn').on('click', app.toggleFavorite); //wpRadioHooks.addAction('update_player_data', 'wp-radio', app.updateFavorites);
    },
    toggleFavorite: function toggleFavorite(e) {
      e.preventDefault();

      if (!parseInt(WRUF.currentUserID)) {
        Swal.fire({
          title: "<a href=\"".concat(WRUF.myAccountURL, "\">Login</a> first to add the station to your favorite list."),
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      var id = $(this).attr('data-id');
      wp.ajax.send('wp_radio_toggle_favorite', {
        data: {
          id: id,
          type: $(this).hasClass('active') ? 'remove' : 'add'
        },
        success: function success(favorites) {
          if (_typeof(favorites) === 'object') {
            favorites = Object.values(favorites);
          }

          favorites = Array.isArray(favorites) ? favorites : [];
          localStorage.setItem('favorite_stations', JSON.stringify(favorites));
          app.updateFavorites();
        },
        error: function error(_error) {
          return console.log(_error);
        }
      });
    },
    isFavorite: function isFavorite(id) {
      return app.getFavorites().includes(parseInt(id));
    },
    getFavorites: function getFavorites() {
      var favorites = localStorage.getItem('favorite_stations');
      if (!favorites) return [];
      favorites = JSON.parse(favorites);
      if (!Array.isArray(favorites)) return [];
      favorites = favorites.map(function (favorite) {
        return parseInt(favorite);
      });
      return favorites;
    },
    updateFavorites: function updateFavorites() {
      $('.favorite-btn').each(function () {
        var id = $(this).attr('data-id');

        if (app.isFavorite(id)) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    }
  };
  $(document).ready(app.init);
  $(document).on('pjax:complete', app.init);
})(jQuery);

/***/ }),

/***/ "./src/js/components/my-account.js":
/*!*****************************************!*\
  !*** ./src/js/components/my-account.js ***!
  \*****************************************/
/***/ (() => {

;

(function ($) {
  var app = {
    init: function init() {
      // Handle menu tabs
      $('.wp-radio-my-account-navigation a[href=#]').on('click', app.handleTabs); // Password fields toggle

      $('.change-password-button').on('click', app.passwordFieldsToggle); // Handle edit-account form

      $('.wp-radio-form-edit-account').on('submit', app.handleEditAccount); // set favorites active tab if pagination

      var searchParams = new URLSearchParams(window.location.search);
      var isFavorites = searchParams.has('paginate');

      if (isFavorites) {
        $(".wp-radio-my-account-navigation a[data-target=favorites]").trigger('click');
      }
    },
    handleEditAccount: function handleEditAccount(e) {
      e.preventDefault();
      var form = $(this);
      var data = form.serialize();
      var form_message = form.find('.form-message');
      form_message.html('');
      wp.ajax.send('wp_radio_edit_account', {
        data: {
          data: data
        },
        success: function success(response) {
          if (response.success) {
            form_message.html("<p class=\"success\">".concat(response.success, "</p>"));
          }
        },
        error: function error(_error) {
          if (Array.isArray(_error)) {
            _error.forEach(function (error) {
              form_message.append("<p class=\"error\">".concat(error, "</p>"));
            });
          } else {
            console.log(_error);
          }
        }
      });
    },
    handleTabs: function handleTabs(e) {
      e.preventDefault();
      var target = $(this).data('target');
      $('.wp-radio-my-account-navigation a').removeClass('active');
      $(this).addClass('active');
      $('.account-content').removeClass('active');
      $(".content-".concat(target)).addClass('active');
    },
    passwordFieldsToggle: function passwordFieldsToggle(e) {
      e.preventDefault();
      $('.change-password-fields').toggleClass('active');
    }
  };
  $(document).on('ready', app.init);
  $(document).on('pjax:complete', app.init);
})(jQuery);

/***/ }),

/***/ "./src/js/components/report.js":
/*!*************************************!*\
  !*** ./src/js/components/report.js ***!
  \*************************************/
/***/ (() => {

;

(function ($) {
  var app = {
    init: function init() {
      $('.report-btn').on('click', app.HandleReport);
    },
    HandleReport: function HandleReport(e) {
      e.preventDefault();
      var $this = $(this);

      var _$$data = $(this).data('station'),
          id = _$$data.id,
          title = _$$data.title,
          link = _$$data.link,
          thumbnail = _$$data.thumbnail;

      Swal.fire({
        title: 'Report a problem with station',
        confirmButtonText: 'Submit report',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: function preConfirm() {
          var email = $('#report-email').val();
          var issue = $('#report-issue').val();
          var message = $('#report-message').val(); //check empty any field

          if (email === '') {
            Swal.showValidationMessage('Email is missing!');
            return;
          }

          if (issue === '') {
            Swal.showValidationMessage('No issue is selected!');
            return;
          }

          wp.ajax.send('wp_radio_report', {
            data: {
              id: id,
              email: email,
              issue: issue,
              message: message
            },
            error: function error(_error) {
              return console.log(_error);
            }
          });
        },
        html: "\n                    <form id=\"report-form\">\n                    \n                        <div class=\"selected-station\">\n                            <img src=\"".concat(thumbnail, "\" alt=\"").concat(title, "\" />\n                            <a href=\"").concat(link, "\">").concat(title, "</a>\n                        </div>\n                        \n                        <div class=\"form-group\">\n                            <label for=\"report-email\">Your Email: <span class=\"required\">*</span></label>\n                            <input type=\"email\" id=\"report-email\" name=\"email\" />\n                        </div>\n                        \n                        <div class=\"form-group\">\n                            <label for=\"report-issue\">Select Issue: <span class=\"required\">*</span></label>\n                            <select name=\"issue\" id=\"report-issue\" required>\n                                <option value=\"\">Select the issue</option>\n                                <option>The page is not working</option>\n                                <option>Playback is not working</option>\n                                <option>Address or radio data is incorrect</option>\n                                <option>The site is using an incorrect stream link</option>\n                            </select>\n                        </div>\n                        \n                        <div class=\"form-group\">\n                            <label for=\"report-email\">Your Message:</label>\n                            <textarea name=\"message\" id=\"report-message\" rows=\"4\" cols=\"30\"></textarea>\n                        </div>\n                        \n                        <input type=\"hidden\" name=\"station-id\" value=\"").concat(id, "\">                       \n                    </form>\n                    ")
      }).then(function (result) {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Report sent successfully!',
            icon: 'success',
            timer: 2500,
            timerProgressBar: true
          });
        }
      });
    }
  };
  $(document).ready(app.init);
  $(document).on('pjax:complete', app.init);
})(jQuery);

/***/ }),

/***/ "./src/js/components/reviews.js":
/*!**************************************!*\
  !*** ./src/js/components/reviews.js ***!
  \**************************************/
/***/ (() => {

;

(function ($) {
  var app = {
    init: function init() {
      // Handle review form submit
      $('#review_submit').on('click', app.handleSubmit); // Handle delete

      $('#delete_review').on('click', app.handleDelete); // Handle review selection

      $('.star').on('click', app.handleSelection);
    },
    handleDelete: function handleDelete(e) {
      e.preventDefault();
      var reviewId = $(this).data('review_id');
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: function preConfirm() {
          $('#rating').val('');
          $('#review').val('');
          $('.star').removeClass('active');
          wp.ajax.send('wp_radio_delete_review', {
            data: {
              id: reviewId
            },
            success: function success(response) {},
            error: function error(_error) {
              return console.log(_error);
            }
          });
        }
      }).then(function (_ref) {
        var isConfirmed = _ref.isConfirmed;

        if (isConfirmed) {
          Swal.fire({
            title: "Your review has been deleted.",
            icon: 'success',
            timer: 3000,
            timerProgressBar: true
          }).then(function () {
            $('.single-review.current-user-review').remove();
          });
        }
      });
    },
    handleSubmit: function handleSubmit(e) {
      e.preventDefault();

      if (!parseInt(WRUF.currentUserID)) {
        Swal.fire({
          title: "Please, <a href=\"".concat(WRUF.myAccountURL, "\">login</a> first to add a review."),
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      var object_id = $('#object_id').val();
      var rating = $('#rating').val();
      var review = $('#review').val();

      if (!rating) {
        Swal.fire({
          title: 'Please, select the rating.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      if (!review) {
        Swal.fire({
          title: 'Please, write a review.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      wp.ajax.send('wp_radio_add_review', {
        data: {
          object_id: object_id,
          rating: rating,
          review: review
        },
        success: function success(response) {
          Swal.fire({
            title: "Your review has been ".concat(response.update ? 'updated' : 'added', "."),
            icon: 'success',
            timer: 3000,
            timerProgressBar: true
          }).then(function () {
            $('#no-review-msg').remove();
            $('.review-listing').append(response.html);
          });
        },
        error: function error(_error2) {
          return console.log(_error2);
        }
      });
    },
    handleSelection: function handleSelection() {
      $(this).addClass('active');
      $(this).prevAll().addClass('active');
      $(this).nextAll().removeClass('active');
      $('#rating').val($(this).data('rate'));
    }
  };
  $(document).ready(app.init);
  $(document).on('pjax:complete', app.init);
})(jQuery);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************!*\
  !*** ./src/js/frontend.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_favorites__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/favorites */ "./src/js/components/favorites.js");
/* harmony import */ var _components_favorites__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_favorites__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_my_account__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/my-account */ "./src/js/components/my-account.js");
/* harmony import */ var _components_my_account__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_components_my_account__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_report__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/report */ "./src/js/components/report.js");
/* harmony import */ var _components_report__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_components_report__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_reviews__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/reviews */ "./src/js/components/reviews.js");
/* harmony import */ var _components_reviews__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_components_reviews__WEBPACK_IMPORTED_MODULE_3__);




})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVk1QyxFQUFaLENBQWUsZUFBZixFQUFnQ0gsR0FBRyxDQUFDQyxJQUFwQztBQUVILENBbElBLEVBa0lFZ0QsTUFsSUY7Ozs7OztVQ0FEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvLi9zcmMvanMvY29tcG9uZW50cy9mYXZvcml0ZXMuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9jb21wb25lbnRzL215LWFjY291bnQuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9jb21wb25lbnRzL3JlcG9ydC5qcyIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kLy4vc3JjL2pzL2NvbXBvbmVudHMvcmV2aWV3cy5qcyIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kLy4vc3JjL2pzL2Zyb250ZW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24gKCQpIHtcbiAgICBjb25zdCBhcHAgPSB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy9pbml0IHVwZGF0ZSBmYXZvcml0ZXNcbiAgICAgICAgICAgIGFwcC51cGRhdGVGYXZvcml0ZXMoKTtcblxuICAgICAgICAgICAgJCgnLmZhdm9yaXRlLWJ0bicpLm9uKCdjbGljaycsIGFwcC50b2dnbGVGYXZvcml0ZSk7XG5cbiAgICAgICAgICAgIC8vd3BSYWRpb0hvb2tzLmFkZEFjdGlvbigndXBkYXRlX3BsYXllcl9kYXRhJywgJ3dwLXJhZGlvJywgYXBwLnVwZGF0ZUZhdm9yaXRlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlRmF2b3JpdGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICghcGFyc2VJbnQoV1JVRi5jdXJyZW50VXNlcklEKSkge1xuICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBgPGEgaHJlZj1cIiR7V1JVRi5teUFjY291bnRVUkx9XCI+TG9naW48L2E+IGZpcnN0IHRvIGFkZCB0aGUgc3RhdGlvbiB0byB5b3VyIGZhdm9yaXRlIGxpc3QuYCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ09LJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaWQnKTtcblxuICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb190b2dnbGVfZmF2b3JpdGUnLCB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpID8gJ3JlbW92ZScgOiAnYWRkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChmYXZvcml0ZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZhdm9yaXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhdm9yaXRlcyA9IE9iamVjdC52YWx1ZXMoZmF2b3JpdGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZhdm9yaXRlcyA9IEFycmF5LmlzQXJyYXkoZmF2b3JpdGVzKSA/IGZhdm9yaXRlcyA6IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdmYXZvcml0ZV9zdGF0aW9ucycsIEpTT04uc3RyaW5naWZ5KGZhdm9yaXRlcykpO1xuICAgICAgICAgICAgICAgICAgICBhcHAudXBkYXRlRmF2b3JpdGVzKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBpc0Zhdm9yaXRlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBhcHAuZ2V0RmF2b3JpdGVzKCkuaW5jbHVkZXMocGFyc2VJbnQoaWQpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRGYXZvcml0ZXM6ICgpID0+IHtcbiAgICAgICAgICAgIGxldCBmYXZvcml0ZXMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZmF2b3JpdGVfc3RhdGlvbnMnKTtcbiAgICAgICAgICAgIGlmICghZmF2b3JpdGVzKSByZXR1cm4gW107XG5cbiAgICAgICAgICAgIGZhdm9yaXRlcyA9IEpTT04ucGFyc2UoZmF2b3JpdGVzKTtcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShmYXZvcml0ZXMpKSByZXR1cm4gW107XG5cbiAgICAgICAgICAgIGZhdm9yaXRlcyA9IGZhdm9yaXRlcy5tYXAoZmF2b3JpdGUgPT4gcGFyc2VJbnQoZmF2b3JpdGUpKTtcbiAgICAgICAgICAgIHJldHVybiBmYXZvcml0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlRmF2b3JpdGVzOiAoKSA9PiB7XG4gICAgICAgICAgICAkKCcuZmF2b3JpdGUtYnRuJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgICAgICBpZiAoYXBwLmlzRmF2b3JpdGUoaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGFwcC5pbml0KTtcbiAgICAkKGRvY3VtZW50KS5vbigncGpheDpjb21wbGV0ZScsIGFwcC5pbml0KTtcbn0pKGpRdWVyeSk7IiwiOyhmdW5jdGlvbiAoJCkge1xuXG4gICAgY29uc3QgYXBwID0ge1xuICAgICAgICBpbml0OiAoKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBtZW51IHRhYnNcbiAgICAgICAgICAgICQoJy53cC1yYWRpby1teS1hY2NvdW50LW5hdmlnYXRpb24gYVtocmVmPSNdJykub24oJ2NsaWNrJywgYXBwLmhhbmRsZVRhYnMpO1xuXG4gICAgICAgICAgICAvLyBQYXNzd29yZCBmaWVsZHMgdG9nZ2xlXG4gICAgICAgICAgICAkKCcuY2hhbmdlLXBhc3N3b3JkLWJ1dHRvbicpLm9uKCdjbGljaycsIGFwcC5wYXNzd29yZEZpZWxkc1RvZ2dsZSk7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBlZGl0LWFjY291bnQgZm9ybVxuICAgICAgICAgICAgJCgnLndwLXJhZGlvLWZvcm0tZWRpdC1hY2NvdW50Jykub24oJ3N1Ym1pdCcsIGFwcC5oYW5kbGVFZGl0QWNjb3VudCk7XG5cbiAgICAgICAgICAgIC8vIHNldCBmYXZvcml0ZXMgYWN0aXZlIHRhYiBpZiBwYWdpbmF0aW9uXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICAgICAgY29uc3QgaXNGYXZvcml0ZXMgPSBzZWFyY2hQYXJhbXMuaGFzKCdwYWdpbmF0ZScpO1xuICAgICAgICAgICAgaWYgKGlzRmF2b3JpdGVzKSB7XG4gICAgICAgICAgICAgICAgJChgLndwLXJhZGlvLW15LWFjY291bnQtbmF2aWdhdGlvbiBhW2RhdGEtdGFyZ2V0PWZhdm9yaXRlc11gKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZUVkaXRBY2NvdW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBmb3JtX21lc3NhZ2UgPSBmb3JtLmZpbmQoJy5mb3JtLW1lc3NhZ2UnKTtcblxuICAgICAgICAgICAgZm9ybV9tZXNzYWdlLmh0bWwoJycpO1xuXG4gICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX2VkaXRfYWNjb3VudCcsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9tZXNzYWdlLmh0bWwoYDxwIGNsYXNzPVwic3VjY2Vzc1wiPiR7cmVzcG9uc2Uuc3VjY2Vzc308L3A+YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IuZm9yRWFjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9tZXNzYWdlLmFwcGVuZChgPHAgY2xhc3M9XCJlcnJvclwiPiR7ZXJyb3J9PC9wPmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVUYWJzOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICAgICAgJCgnLndwLXJhZGlvLW15LWFjY291bnQtbmF2aWdhdGlvbiBhJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJy5hY2NvdW50LWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKGAuY29udGVudC0ke3RhcmdldH1gKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFzc3dvcmRGaWVsZHNUb2dnbGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICQoJy5jaGFuZ2UtcGFzc3dvcmQtZmllbGRzJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLm9uKCdyZWFkeScsIGFwcC5pbml0KTtcbiAgICAkKGRvY3VtZW50KS5vbigncGpheDpjb21wbGV0ZScsIGFwcC5pbml0KTtcblxufSkoalF1ZXJ5KTsiLCI7KGZ1bmN0aW9uICgkKSB7XG4gICAgY29uc3QgYXBwID0ge1xuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucmVwb3J0LWJ0bicpLm9uKCdjbGljaycsIGFwcC5IYW5kbGVSZXBvcnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIEhhbmRsZVJlcG9ydDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgY29uc3Qge2lkLCB0aXRsZSwgbGluaywgdGh1bWJuYWlsfSA9ICQodGhpcykuZGF0YSgnc3RhdGlvbicpO1xuXG4gICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVwb3J0IGEgcHJvYmxlbSB3aXRoIHN0YXRpb24nLFxuICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnU3VibWl0IHJlcG9ydCcsXG4gICAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnQ2FuY2VsJyxcbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25Db2xvcjogJyNkMzMnLFxuICAgICAgICAgICAgICAgIHJldmVyc2VCdXR0b25zOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNob3dMb2FkZXJPbkNvbmZpcm06IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlQ29uZmlybTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbWFpbCA9ICQoJyNyZXBvcnQtZW1haWwnKS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNzdWUgPSAkKCcjcmVwb3J0LWlzc3VlJykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAkKCcjcmVwb3J0LW1lc3NhZ2UnKS52YWwoKTtcblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGVtcHR5IGFueSBmaWVsZFxuICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWwgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTd2FsLnNob3dWYWxpZGF0aW9uTWVzc2FnZSgnRW1haWwgaXMgbWlzc2luZyEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzc3VlID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3dhbC5zaG93VmFsaWRhdGlvbk1lc3NhZ2UoJ05vIGlzc3VlIGlzIHNlbGVjdGVkIScpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIHdwLmFqYXguc2VuZCgnd3BfcmFkaW9fcmVwb3J0Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWU6IGlzc3VlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSxcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaHRtbDpcbiAgICAgICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cInJlcG9ydC1mb3JtXCI+XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNlbGVjdGVkLXN0YXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7dGh1bWJuYWlsfVwiIGFsdD1cIiR7dGl0bGV9XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHtsaW5rfVwiPiR7dGl0bGV9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInJlcG9ydC1lbWFpbFwiPllvdXIgRW1haWw6IDxzcGFuIGNsYXNzPVwicmVxdWlyZWRcIj4qPC9zcGFuPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJlbWFpbFwiIGlkPVwicmVwb3J0LWVtYWlsXCIgbmFtZT1cImVtYWlsXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJyZXBvcnQtaXNzdWVcIj5TZWxlY3QgSXNzdWU6IDxzcGFuIGNsYXNzPVwicmVxdWlyZWRcIj4qPC9zcGFuPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBuYW1lPVwiaXNzdWVcIiBpZD1cInJlcG9ydC1pc3N1ZVwiIHJlcXVpcmVkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0IHRoZSBpc3N1ZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlRoZSBwYWdlIGlzIG5vdCB3b3JraW5nPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+UGxheWJhY2sgaXMgbm90IHdvcmtpbmc8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5BZGRyZXNzIG9yIHJhZGlvIGRhdGEgaXMgaW5jb3JyZWN0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+VGhlIHNpdGUgaXMgdXNpbmcgYW4gaW5jb3JyZWN0IHN0cmVhbSBsaW5rPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicmVwb3J0LWVtYWlsXCI+WW91ciBNZXNzYWdlOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJtZXNzYWdlXCIgaWQ9XCJyZXBvcnQtbWVzc2FnZVwiIHJvd3M9XCI0XCIgY29scz1cIjMwXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJzdGF0aW9uLWlkXCIgdmFsdWU9XCIke2lkfVwiPiAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgfSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5pc0NvbmZpcm1lZCkge1xuICAgICAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZXBvcnQgc2VudCBzdWNjZXNzZnVsbHkhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyOiAyNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXJQcm9ncmVzc0JhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGFwcC5pbml0KTtcbiAgICAkKGRvY3VtZW50KS5vbigncGpheDpjb21wbGV0ZScsIGFwcC5pbml0KTtcblxufSkoalF1ZXJ5KTsiLCI7KGZ1bmN0aW9uICgkKSB7XG4gICAgY29uc3QgYXBwID0ge1xuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSByZXZpZXcgZm9ybSBzdWJtaXRcbiAgICAgICAgICAgICQoJyNyZXZpZXdfc3VibWl0Jykub24oJ2NsaWNrJywgYXBwLmhhbmRsZVN1Ym1pdCk7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBkZWxldGVcbiAgICAgICAgICAgICQoJyNkZWxldGVfcmV2aWV3Jykub24oJ2NsaWNrJywgYXBwLmhhbmRsZURlbGV0ZSk7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSByZXZpZXcgc2VsZWN0aW9uXG4gICAgICAgICAgICAkKCcuc3RhcicpLm9uKCdjbGljaycsIGFwcC5oYW5kbGVTZWxlY3Rpb24pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlRGVsZXRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCByZXZpZXdJZCA9ICQodGhpcykuZGF0YSgncmV2aWV3X2lkJyk7XG5cbiAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdBcmUgeW91IHN1cmU/JyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIllvdSB3b24ndCBiZSBhYmxlIHRvIHJldmVydCB0aGlzIVwiLFxuICAgICAgICAgICAgICAgIGljb246ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnWWVzLCBkZWxldGUgaXQhJyxcbiAgICAgICAgICAgICAgICByZXZlcnNlQnV0dG9uczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93TG9hZGVyT25Db25maXJtOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZUNvbmZpcm06ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3JhdGluZycpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNyZXZpZXcnKS52YWwoJycpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuc3RhcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHdwLmFqYXguc2VuZCgnd3BfcmFkaW9fZGVsZXRlX3JldmlldycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcmV2aWV3SWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS50aGVuKCh7aXNDb25maXJtZWR9KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ29uZmlybWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYFlvdXIgcmV2aWV3IGhhcyBiZWVuIGRlbGV0ZWQuYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyOiAzMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXJQcm9ncmVzc0JhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuc2luZ2xlLXJldmlldy5jdXJyZW50LXVzZXItcmV2aWV3JykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlU3VibWl0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoIXBhcnNlSW50KFdSVUYuY3VycmVudFVzZXJJRCkpIHtcbiAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogYFBsZWFzZSwgPGEgaHJlZj1cIiR7V1JVRi5teUFjY291bnRVUkx9XCI+bG9naW48L2E+IGZpcnN0IHRvIGFkZCBhIHJldmlldy5gLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnT0snLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBvYmplY3RfaWQgPSAkKCcjb2JqZWN0X2lkJykudmFsKCk7XG4gICAgICAgICAgICBjb25zdCByYXRpbmcgPSAkKCcjcmF0aW5nJykudmFsKCk7XG4gICAgICAgICAgICBjb25zdCByZXZpZXcgPSAkKCcjcmV2aWV3JykudmFsKCk7XG5cbiAgICAgICAgICAgIGlmICghcmF0aW5nKSB7XG4gICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UsIHNlbGVjdCB0aGUgcmF0aW5nLicsXG4gICAgICAgICAgICAgICAgICAgIGljb246ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcmV2aWV3KSB7XG4gICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UsIHdyaXRlIGEgcmV2aWV3LicsXG4gICAgICAgICAgICAgICAgICAgIGljb246ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdwLmFqYXguc2VuZCgnd3BfcmFkaW9fYWRkX3JldmlldycsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdF9pZCxcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nLFxuICAgICAgICAgICAgICAgICAgICByZXZpZXcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBgWW91ciByZXZpZXcgaGFzIGJlZW4gJHtyZXNwb25zZS51cGRhdGUgPyAndXBkYXRlZCcgOiAnYWRkZWQnfS5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDMwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lclByb2dyZXNzQmFyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNuby1yZXZpZXctbXNnJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucmV2aWV3LWxpc3RpbmcnKS5hcHBlbmQocmVzcG9uc2UuaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVTZWxlY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5uZXh0QWxsKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcjcmF0aW5nJykudmFsKCQodGhpcykuZGF0YSgncmF0ZScpKTtcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShhcHAuaW5pdCk7XG4gICAgJChkb2N1bWVudCkub24oJ3BqYXg6Y29tcGxldGUnLCBhcHAuaW5pdCk7XG5cbn0pKGpRdWVyeSk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9jb21wb25lbnRzL2Zhdm9yaXRlcyc7XG5pbXBvcnQgJy4vY29tcG9uZW50cy9teS1hY2NvdW50JztcbmltcG9ydCAnLi9jb21wb25lbnRzL3JlcG9ydCc7XG5pbXBvcnQgJy4vY29tcG9uZW50cy9yZXZpZXdzJzsiXSwibmFtZXMiOlsiJCIsImFwcCIsImluaXQiLCJ1cGRhdGVGYXZvcml0ZXMiLCJvbiIsInRvZ2dsZUZhdm9yaXRlIiwiZSIsInByZXZlbnREZWZhdWx0IiwicGFyc2VJbnQiLCJXUlVGIiwiY3VycmVudFVzZXJJRCIsIlN3YWwiLCJmaXJlIiwidGl0bGUiLCJteUFjY291bnRVUkwiLCJpY29uIiwiY29uZmlybUJ1dHRvblRleHQiLCJpZCIsImF0dHIiLCJ3cCIsImFqYXgiLCJzZW5kIiwiZGF0YSIsInR5cGUiLCJoYXNDbGFzcyIsInN1Y2Nlc3MiLCJmYXZvcml0ZXMiLCJPYmplY3QiLCJ2YWx1ZXMiLCJBcnJheSIsImlzQXJyYXkiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImlzRmF2b3JpdGUiLCJnZXRGYXZvcml0ZXMiLCJpbmNsdWRlcyIsImdldEl0ZW0iLCJwYXJzZSIsIm1hcCIsImZhdm9yaXRlIiwiZWFjaCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJkb2N1bWVudCIsInJlYWR5IiwialF1ZXJ5IiwiaGFuZGxlVGFicyIsInBhc3N3b3JkRmllbGRzVG9nZ2xlIiwiaGFuZGxlRWRpdEFjY291bnQiLCJzZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsImlzRmF2b3JpdGVzIiwiaGFzIiwidHJpZ2dlciIsImZvcm0iLCJzZXJpYWxpemUiLCJmb3JtX21lc3NhZ2UiLCJmaW5kIiwiaHRtbCIsInJlc3BvbnNlIiwiZm9yRWFjaCIsImFwcGVuZCIsInRhcmdldCIsInRvZ2dsZUNsYXNzIiwiSGFuZGxlUmVwb3J0IiwiJHRoaXMiLCJsaW5rIiwidGh1bWJuYWlsIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNhbmNlbEJ1dHRvblRleHQiLCJjYW5jZWxCdXR0b25Db2xvciIsInJldmVyc2VCdXR0b25zIiwic2hvd0xvYWRlck9uQ29uZmlybSIsInByZUNvbmZpcm0iLCJlbWFpbCIsInZhbCIsImlzc3VlIiwibWVzc2FnZSIsInNob3dWYWxpZGF0aW9uTWVzc2FnZSIsInRoZW4iLCJyZXN1bHQiLCJpc0NvbmZpcm1lZCIsInRpbWVyIiwidGltZXJQcm9ncmVzc0JhciIsImhhbmRsZVN1Ym1pdCIsImhhbmRsZURlbGV0ZSIsImhhbmRsZVNlbGVjdGlvbiIsInJldmlld0lkIiwidGV4dCIsInJlbW92ZSIsIm9iamVjdF9pZCIsInJhdGluZyIsInJldmlldyIsInVwZGF0ZSIsInByZXZBbGwiLCJuZXh0QWxsIl0sInNvdXJjZVJvb3QiOiIifQ==