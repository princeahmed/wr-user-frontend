/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/components/favorites.js":
/*!****************************************!*\
  !*** ./src/js/components/favorites.js ***!
  \****************************************/
/***/ (() => {

;

(function ($) {
  var app = {
    init: function init() {
      //init update favorites
      app.updateFavorites();
      $('.favorite-btn').on('click', app.toggleFavorite);
      wpRadioHooks.addAction('update_player_data', 'wp-radio', app.updateFavorites);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cEM7QUFFSCxDQWxJQSxFQWtJRWdELE1BbElGOzs7Ozs7VUNBRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kLy4vc3JjL2pzL2NvbXBvbmVudHMvZmF2b3JpdGVzLmpzIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvLi9zcmMvanMvY29tcG9uZW50cy9teS1hY2NvdW50LmpzIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvLi9zcmMvanMvY29tcG9uZW50cy9yZXBvcnQuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9jb21wb25lbnRzL3Jldmlld3MuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9mcm9udGVuZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkKSB7XG4gICAgY29uc3QgYXBwID0ge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vaW5pdCB1cGRhdGUgZmF2b3JpdGVzXG4gICAgICAgICAgICBhcHAudXBkYXRlRmF2b3JpdGVzKCk7XG5cbiAgICAgICAgICAgICQoJy5mYXZvcml0ZS1idG4nKS5vbignY2xpY2snLCBhcHAudG9nZ2xlRmF2b3JpdGUpO1xuXG4gICAgICAgICAgICB3cFJhZGlvSG9va3MuYWRkQWN0aW9uKCd1cGRhdGVfcGxheWVyX2RhdGEnLCAnd3AtcmFkaW8nLCBhcHAudXBkYXRlRmF2b3JpdGVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b2dnbGVGYXZvcml0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCFwYXJzZUludChXUlVGLmN1cnJlbnRVc2VySUQpKSB7XG4gICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGA8YSBocmVmPVwiJHtXUlVGLm15QWNjb3VudFVSTH1cIj5Mb2dpbjwvYT4gZmlyc3QgdG8gYWRkIHRoZSBzdGF0aW9uIHRvIHlvdXIgZmF2b3JpdGUgbGlzdC5gLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnT0snLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pZCcpO1xuXG4gICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX3RvZ2dsZV9mYXZvcml0ZScsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykgPyAncmVtb3ZlJyA6ICdhZGQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGZhdm9yaXRlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZhdm9yaXRlcyA9IEFycmF5LmlzQXJyYXkoZmF2b3JpdGVzKSA/IGZhdm9yaXRlcyA6IFtdO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZmF2b3JpdGVfc3RhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShmYXZvcml0ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwLnVwZGF0ZUZhdm9yaXRlcygpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNGYXZvcml0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gYXBwLmdldEZhdm9yaXRlcygpLmluY2x1ZGVzKHBhcnNlSW50KGlkKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RmF2b3JpdGVzOiAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmF2b3JpdGVzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Zhdm9yaXRlX3N0YXRpb25zJyk7XG4gICAgICAgICAgICBpZiAoIWZhdm9yaXRlcykgcmV0dXJuIFtdO1xuXG4gICAgICAgICAgICBmYXZvcml0ZXMgPSBKU09OLnBhcnNlKGZhdm9yaXRlcyk7XG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZmF2b3JpdGVzKSkgcmV0dXJuIFtdO1xuXG4gICAgICAgICAgICBmYXZvcml0ZXMgPSBmYXZvcml0ZXMubWFwKGZhdm9yaXRlID0+IHBhcnNlSW50KGZhdm9yaXRlKSk7XG4gICAgICAgICAgICByZXR1cm4gZmF2b3JpdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZUZhdm9yaXRlczogKCkgPT4ge1xuICAgICAgICAgICAgJCgnLmZhdm9yaXRlLWJ0bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICAgICAgaWYgKGFwcC5pc0Zhdm9yaXRlKGlkKSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShhcHAuaW5pdCk7XG4gICAgJChkb2N1bWVudCkub24oJ3BqYXg6Y29tcGxldGUnLCBhcHAuaW5pdCk7XG59KShqUXVlcnkpOyIsIjsoZnVuY3Rpb24gKCQpIHtcblxuICAgIGNvbnN0IGFwcCA9IHtcbiAgICAgICAgaW5pdDogKCkgPT4ge1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgbWVudSB0YWJzXG4gICAgICAgICAgICAkKCcud3AtcmFkaW8tbXktYWNjb3VudC1uYXZpZ2F0aW9uIGFbaHJlZj0jXScpLm9uKCdjbGljaycsIGFwcC5oYW5kbGVUYWJzKTtcblxuICAgICAgICAgICAgLy8gUGFzc3dvcmQgZmllbGRzIHRvZ2dsZVxuICAgICAgICAgICAgJCgnLmNoYW5nZS1wYXNzd29yZC1idXR0b24nKS5vbignY2xpY2snLCBhcHAucGFzc3dvcmRGaWVsZHNUb2dnbGUpO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgZWRpdC1hY2NvdW50IGZvcm1cbiAgICAgICAgICAgICQoJy53cC1yYWRpby1mb3JtLWVkaXQtYWNjb3VudCcpLm9uKCdzdWJtaXQnLCBhcHAuaGFuZGxlRWRpdEFjY291bnQpO1xuXG4gICAgICAgICAgICAvLyBzZXQgZmF2b3JpdGVzIGFjdGl2ZSB0YWIgaWYgcGFnaW5hdGlvblxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAgICAgICAgIGNvbnN0IGlzRmF2b3JpdGVzID0gc2VhcmNoUGFyYW1zLmhhcygncGFnaW5hdGUnKTtcbiAgICAgICAgICAgIGlmIChpc0Zhdm9yaXRlcykge1xuICAgICAgICAgICAgICAgICQoYC53cC1yYWRpby1teS1hY2NvdW50LW5hdmlnYXRpb24gYVtkYXRhLXRhcmdldD1mYXZvcml0ZXNdYCkudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVFZGl0QWNjb3VudDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcblxuICAgICAgICAgICAgY29uc3QgZm9ybV9tZXNzYWdlID0gZm9ybS5maW5kKCcuZm9ybS1tZXNzYWdlJyk7XG5cbiAgICAgICAgICAgIGZvcm1fbWVzc2FnZS5odG1sKCcnKTtcblxuICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb19lZGl0X2FjY291bnQnLCB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1fbWVzc2FnZS5odG1sKGA8cCBjbGFzcz1cInN1Y2Nlc3NcIj4ke3Jlc3BvbnNlLnN1Y2Nlc3N9PC9wPmApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLmZvckVhY2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1fbWVzc2FnZS5hcHBlbmQoYDxwIGNsYXNzPVwiZXJyb3JcIj4ke2Vycm9yfTwvcD5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlVGFiczogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gJCh0aGlzKS5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICQoJy53cC1yYWRpby1teS1hY2NvdW50LW5hdmlnYXRpb24gYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcuYWNjb3VudC1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJChgLmNvbnRlbnQtJHt0YXJnZXR9YCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhc3N3b3JkRmllbGRzVG9nZ2xlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkKCcuY2hhbmdlLXBhc3N3b3JkLWZpZWxkcycpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbigncmVhZHknLCBhcHAuaW5pdCk7XG4gICAgJChkb2N1bWVudCkub24oJ3BqYXg6Y29tcGxldGUnLCBhcHAuaW5pdCk7XG5cbn0pKGpRdWVyeSk7IiwiOyhmdW5jdGlvbiAoJCkge1xuICAgIGNvbnN0IGFwcCA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnJlcG9ydC1idG4nKS5vbignY2xpY2snLCBhcHAuSGFuZGxlUmVwb3J0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBIYW5kbGVSZXBvcnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHtpZCwgdGl0bGUsIGxpbmssIHRodW1ibmFpbH0gPSAkKHRoaXMpLmRhdGEoJ3N0YXRpb24nKTtcblxuICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JlcG9ydCBhIHByb2JsZW0gd2l0aCBzdGF0aW9uJyxcbiAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ1N1Ym1pdCByZXBvcnQnLFxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbCcsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uQ29sb3I6ICcjZDMzJyxcbiAgICAgICAgICAgICAgICByZXZlcnNlQnV0dG9uczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93TG9hZGVyT25Db25maXJtOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZUNvbmZpcm06ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW1haWwgPSAkKCcjcmVwb3J0LWVtYWlsJykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzc3VlID0gJCgnI3JlcG9ydC1pc3N1ZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJCgnI3JlcG9ydC1tZXNzYWdlJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBlbXB0eSBhbnkgZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3dhbC5zaG93VmFsaWRhdGlvbk1lc3NhZ2UoJ0VtYWlsIGlzIG1pc3NpbmchJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc3N1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN3YWwuc2hvd1ZhbGlkYXRpb25NZXNzYWdlKCdObyBpc3N1ZSBpcyBzZWxlY3RlZCEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX3JlcG9ydCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlOiBpc3N1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciksXG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGh0bWw6XG4gICAgICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJyZXBvcnQtZm9ybVwiPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RlZC1zdGF0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RodW1ibmFpbH1cIiBhbHQ9XCIke3RpdGxlfVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7bGlua31cIj4ke3RpdGxlfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJyZXBvcnQtZW1haWxcIj5Zb3VyIEVtYWlsOiA8c3BhbiBjbGFzcz1cInJlcXVpcmVkXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBpZD1cInJlcG9ydC1lbWFpbFwiIG5hbWU9XCJlbWFpbFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicmVwb3J0LWlzc3VlXCI+U2VsZWN0IElzc3VlOiA8c3BhbiBjbGFzcz1cInJlcXVpcmVkXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgbmFtZT1cImlzc3VlXCIgaWQ9XCJyZXBvcnQtaXNzdWVcIiByZXF1aXJlZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCB0aGUgaXNzdWU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5UaGUgcGFnZSBpcyBub3Qgd29ya2luZzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlBsYXliYWNrIGlzIG5vdCB3b3JraW5nPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+QWRkcmVzcyBvciByYWRpbyBkYXRhIGlzIGluY29ycmVjdDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlRoZSBzaXRlIGlzIHVzaW5nIGFuIGluY29ycmVjdCBzdHJlYW0gbGluazwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInJlcG9ydC1lbWFpbFwiPllvdXIgTWVzc2FnZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwibWVzc2FnZVwiIGlkPVwicmVwb3J0LW1lc3NhZ2VcIiByb3dzPVwiNFwiIGNvbHM9XCIzMFwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwic3RhdGlvbi1pZFwiIHZhbHVlPVwiJHtpZH1cIj4gICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaXNDb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVwb3J0IHNlbnQgc3VjY2Vzc2Z1bGx5IScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShhcHAuaW5pdCk7XG4gICAgJChkb2N1bWVudCkub24oJ3BqYXg6Y29tcGxldGUnLCBhcHAuaW5pdCk7XG5cbn0pKGpRdWVyeSk7IiwiOyhmdW5jdGlvbiAoJCkge1xuICAgIGNvbnN0IGFwcCA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgcmV2aWV3IGZvcm0gc3VibWl0XG4gICAgICAgICAgICAkKCcjcmV2aWV3X3N1Ym1pdCcpLm9uKCdjbGljaycsIGFwcC5oYW5kbGVTdWJtaXQpO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgZGVsZXRlXG4gICAgICAgICAgICAkKCcjZGVsZXRlX3JldmlldycpLm9uKCdjbGljaycsIGFwcC5oYW5kbGVEZWxldGUpO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgcmV2aWV3IHNlbGVjdGlvblxuICAgICAgICAgICAgJCgnLnN0YXInKS5vbignY2xpY2snLCBhcHAuaGFuZGxlU2VsZWN0aW9uKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZURlbGV0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgcmV2aWV3SWQgPSAkKHRoaXMpLmRhdGEoJ3Jldmlld19pZCcpO1xuXG4gICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnQXJlIHlvdSBzdXJlPycsXG4gICAgICAgICAgICAgICAgdGV4dDogXCJZb3Ugd29uJ3QgYmUgYWJsZSB0byByZXZlcnQgdGhpcyFcIixcbiAgICAgICAgICAgICAgICBpY29uOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ1llcywgZGVsZXRlIGl0IScsXG4gICAgICAgICAgICAgICAgcmV2ZXJzZUJ1dHRvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd0xvYWRlck9uQ29uZmlybTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcmVDb25maXJtOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNyYXRpbmcnKS52YWwoJycpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjcmV2aWV3JykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN0YXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cblxuICAgICAgICAgICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX2RlbGV0ZV9yZXZpZXcnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJldmlld0lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbigoe2lzQ29uZmlybWVkfSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbmZpcm1lZCkge1xuICAgICAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGBZb3VyIHJldmlldyBoYXMgYmVlbiBkZWxldGVkLmAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcjogMzAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNpbmdsZS1yZXZpZXcuY3VycmVudC11c2VyLXJldmlldycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cblxuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCFwYXJzZUludChXUlVGLmN1cnJlbnRVc2VySUQpKSB7XG4gICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGBQbGVhc2UsIDxhIGhyZWY9XCIke1dSVUYubXlBY2NvdW50VVJMfVwiPmxvZ2luPC9hPiBmaXJzdCB0byBhZGQgYSByZXZpZXcuYCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ09LJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0X2lkID0gJCgnI29iamVjdF9pZCcpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgcmF0aW5nID0gJCgnI3JhdGluZycpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgcmV2aWV3ID0gJCgnI3JldmlldycpLnZhbCgpO1xuXG4gICAgICAgICAgICBpZiAoIXJhdGluZykge1xuICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGxlYXNlLCBzZWxlY3QgdGhlIHJhdGluZy4nLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnT0snLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXJldmlldykge1xuICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGxlYXNlLCB3cml0ZSBhIHJldmlldy4nLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnT0snLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX2FkZF9yZXZpZXcnLCB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RfaWQsXG4gICAgICAgICAgICAgICAgICAgIHJhdGluZyxcbiAgICAgICAgICAgICAgICAgICAgcmV2aWV3LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYFlvdXIgcmV2aWV3IGhhcyBiZWVuICR7cmVzcG9uc2UudXBkYXRlID8gJ3VwZGF0ZWQnIDogJ2FkZGVkJ30uYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyOiAzMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXJQcm9ncmVzc0JhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbm8tcmV2aWV3LW1zZycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnJldmlldy1saXN0aW5nJykuYXBwZW5kKHJlc3BvbnNlLmh0bWwpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlU2VsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykucHJldkFsbCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykubmV4dEFsbCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI3JhdGluZycpLnZhbCgkKHRoaXMpLmRhdGEoJ3JhdGUnKSk7XG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xuXG59KShqUXVlcnkpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vY29tcG9uZW50cy9mYXZvcml0ZXMnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvbXktYWNjb3VudCc7XG5pbXBvcnQgJy4vY29tcG9uZW50cy9yZXBvcnQnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvcmV2aWV3cyc7Il0sIm5hbWVzIjpbIiQiLCJhcHAiLCJpbml0IiwidXBkYXRlRmF2b3JpdGVzIiwib24iLCJ0b2dnbGVGYXZvcml0ZSIsIndwUmFkaW9Ib29rcyIsImFkZEFjdGlvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInBhcnNlSW50IiwiV1JVRiIsImN1cnJlbnRVc2VySUQiLCJTd2FsIiwiZmlyZSIsInRpdGxlIiwibXlBY2NvdW50VVJMIiwiaWNvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiaWQiLCJhdHRyIiwid3AiLCJhamF4Iiwic2VuZCIsImRhdGEiLCJ0eXBlIiwiaGFzQ2xhc3MiLCJzdWNjZXNzIiwiZmF2b3JpdGVzIiwiQXJyYXkiLCJpc0FycmF5IiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJpc0Zhdm9yaXRlIiwiZ2V0RmF2b3JpdGVzIiwiaW5jbHVkZXMiLCJnZXRJdGVtIiwicGFyc2UiLCJtYXAiLCJmYXZvcml0ZSIsImVhY2giLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZG9jdW1lbnQiLCJyZWFkeSIsImpRdWVyeSIsImhhbmRsZVRhYnMiLCJwYXNzd29yZEZpZWxkc1RvZ2dsZSIsImhhbmRsZUVkaXRBY2NvdW50Iiwic2VhcmNoUGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJpc0Zhdm9yaXRlcyIsImhhcyIsInRyaWdnZXIiLCJmb3JtIiwic2VyaWFsaXplIiwiZm9ybV9tZXNzYWdlIiwiZmluZCIsImh0bWwiLCJyZXNwb25zZSIsImZvckVhY2giLCJhcHBlbmQiLCJ0YXJnZXQiLCJ0b2dnbGVDbGFzcyIsIkhhbmRsZVJlcG9ydCIsIiR0aGlzIiwibGluayIsInRodW1ibmFpbCIsInNob3dDYW5jZWxCdXR0b24iLCJjYW5jZWxCdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uQ29sb3IiLCJyZXZlcnNlQnV0dG9ucyIsInNob3dMb2FkZXJPbkNvbmZpcm0iLCJwcmVDb25maXJtIiwiZW1haWwiLCJ2YWwiLCJpc3N1ZSIsIm1lc3NhZ2UiLCJzaG93VmFsaWRhdGlvbk1lc3NhZ2UiLCJ0aGVuIiwicmVzdWx0IiwiaXNDb25maXJtZWQiLCJ0aW1lciIsInRpbWVyUHJvZ3Jlc3NCYXIiLCJoYW5kbGVTdWJtaXQiLCJoYW5kbGVEZWxldGUiLCJoYW5kbGVTZWxlY3Rpb24iLCJyZXZpZXdJZCIsInRleHQiLCJyZW1vdmUiLCJvYmplY3RfaWQiLCJyYXRpbmciLCJyZXZpZXciLCJ1cGRhdGUiLCJwcmV2QWxsIiwibmV4dEFsbCJdLCJzb3VyY2VSb290IjoiIn0=