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
  $(document).ready(app.init);
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

            if (response.update) {
              $('.single-review.current-user-review').remove();
            }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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d0IsSUFBUixDQUFhLE1BQWIsQ0FBakI7SUFDSDtFQTlITyxDQUFaO0VBaUlBeEIsQ0FBQyxDQUFDa0QsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0JsRCxHQUFHLENBQUNDLElBQXRCO0VBQ0FGLENBQUMsQ0FBQ2tELFFBQUQsQ0FBRCxDQUFZOUMsRUFBWixDQUFlLGVBQWYsRUFBZ0NILEdBQUcsQ0FBQ0MsSUFBcEM7QUFFSCxDQXJJQSxFQXFJRWtELE1BcklGOzs7Ozs7VUNBRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kLy4vc3JjL2pzL2NvbXBvbmVudHMvZmF2b3JpdGVzLmpzIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvLi9zcmMvanMvY29tcG9uZW50cy9teS1hY2NvdW50LmpzIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvLi9zcmMvanMvY29tcG9uZW50cy9yZXBvcnQuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9jb21wb25lbnRzL3Jldmlld3MuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9mcm9udGVuZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgkKSB7XG4gICAgY29uc3QgYXBwID0ge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vaW5pdCB1cGRhdGUgZmF2b3JpdGVzXG4gICAgICAgICAgICBhcHAudXBkYXRlRmF2b3JpdGVzKCk7XG5cbiAgICAgICAgICAgICQoJy5mYXZvcml0ZS1idG4nKS5vbignY2xpY2snLCBhcHAudG9nZ2xlRmF2b3JpdGUpO1xuXG4gICAgICAgICAgICB3cFJhZGlvSG9va3MuYWRkQWN0aW9uKCd1cGRhdGVfcGxheWVyX2RhdGEnLCAnd3AtcmFkaW8nLCBhcHAudXBkYXRlRmF2b3JpdGVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b2dnbGVGYXZvcml0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCFwYXJzZUludChXUlVGLmN1cnJlbnRVc2VySUQpKSB7XG4gICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGA8YSBocmVmPVwiJHtXUlVGLm15QWNjb3VudFVSTH1cIj5Mb2dpbjwvYT4gZmlyc3QgdG8gYWRkIHRoZSBzdGF0aW9uIHRvIHlvdXIgZmF2b3JpdGUgbGlzdC5gLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnT0snLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pZCcpO1xuXG4gICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX3RvZ2dsZV9mYXZvcml0ZScsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykgPyAncmVtb3ZlJyA6ICdhZGQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGZhdm9yaXRlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmF2b3JpdGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmF2b3JpdGVzID0gT2JqZWN0LnZhbHVlcyhmYXZvcml0ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZmF2b3JpdGVzID0gQXJyYXkuaXNBcnJheShmYXZvcml0ZXMpID8gZmF2b3JpdGVzIDogW107XG5cbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Zhdm9yaXRlX3N0YXRpb25zJywgSlNPTi5zdHJpbmdpZnkoZmF2b3JpdGVzKSk7XG4gICAgICAgICAgICAgICAgICAgIGFwcC51cGRhdGVGYXZvcml0ZXMoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciksXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIGlzRmF2b3JpdGU6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFwcC5nZXRGYXZvcml0ZXMoKS5pbmNsdWRlcyhwYXJzZUludChpZCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZhdm9yaXRlczogKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZhdm9yaXRlcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmYXZvcml0ZV9zdGF0aW9ucycpO1xuICAgICAgICAgICAgaWYgKCFmYXZvcml0ZXMpIHJldHVybiBbXTtcblxuICAgICAgICAgICAgZmF2b3JpdGVzID0gSlNPTi5wYXJzZShmYXZvcml0ZXMpO1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGZhdm9yaXRlcykpIHJldHVybiBbXTtcblxuICAgICAgICAgICAgZmF2b3JpdGVzID0gZmF2b3JpdGVzLm1hcChmYXZvcml0ZSA9PiBwYXJzZUludChmYXZvcml0ZSkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhdm9yaXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVGYXZvcml0ZXM6ICgpID0+IHtcbiAgICAgICAgICAgICQoJy5mYXZvcml0ZS1idG4nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pZCcpO1xuICAgICAgICAgICAgICAgIGlmIChhcHAuaXNGYXZvcml0ZShpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoIGFwcC5pbml0KTtcbiAgICAkKGRvY3VtZW50KS5vbigncGpheDpjb21wbGV0ZScsIGFwcC5pbml0KTtcbn0pKGpRdWVyeSk7IiwiOyhmdW5jdGlvbiAoJCkge1xuXG4gICAgY29uc3QgYXBwID0ge1xuICAgICAgICBpbml0OiAoKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBtZW51IHRhYnNcbiAgICAgICAgICAgICQoJy53cC1yYWRpby1teS1hY2NvdW50LW5hdmlnYXRpb24gYVtocmVmPSNdJykub24oJ2NsaWNrJywgYXBwLmhhbmRsZVRhYnMpO1xuXG4gICAgICAgICAgICAvLyBQYXNzd29yZCBmaWVsZHMgdG9nZ2xlXG4gICAgICAgICAgICAkKCcuY2hhbmdlLXBhc3N3b3JkLWJ1dHRvbicpLm9uKCdjbGljaycsIGFwcC5wYXNzd29yZEZpZWxkc1RvZ2dsZSk7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBlZGl0LWFjY291bnQgZm9ybVxuICAgICAgICAgICAgJCgnLndwLXJhZGlvLWZvcm0tZWRpdC1hY2NvdW50Jykub24oJ3N1Ym1pdCcsIGFwcC5oYW5kbGVFZGl0QWNjb3VudCk7XG5cbiAgICAgICAgICAgIC8vIHNldCBmYXZvcml0ZXMgYWN0aXZlIHRhYiBpZiBwYWdpbmF0aW9uXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICAgICAgY29uc3QgaXNGYXZvcml0ZXMgPSBzZWFyY2hQYXJhbXMuaGFzKCdwYWdpbmF0ZScpO1xuICAgICAgICAgICAgaWYgKGlzRmF2b3JpdGVzKSB7XG4gICAgICAgICAgICAgICAgJChgLndwLXJhZGlvLW15LWFjY291bnQtbmF2aWdhdGlvbiBhW2RhdGEtdGFyZ2V0PWZhdm9yaXRlc11gKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZUVkaXRBY2NvdW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBmb3JtX21lc3NhZ2UgPSBmb3JtLmZpbmQoJy5mb3JtLW1lc3NhZ2UnKTtcblxuICAgICAgICAgICAgZm9ybV9tZXNzYWdlLmh0bWwoJycpO1xuXG4gICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX2VkaXRfYWNjb3VudCcsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9tZXNzYWdlLmh0bWwoYDxwIGNsYXNzPVwic3VjY2Vzc1wiPiR7cmVzcG9uc2Uuc3VjY2Vzc308L3A+YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IuZm9yRWFjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybV9tZXNzYWdlLmFwcGVuZChgPHAgY2xhc3M9XCJlcnJvclwiPiR7ZXJyb3J9PC9wPmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVUYWJzOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICAgICAgJCgnLndwLXJhZGlvLW15LWFjY291bnQtbmF2aWdhdGlvbiBhJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICQoJy5hY2NvdW50LWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKGAuY29udGVudC0ke3RhcmdldH1gKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFzc3dvcmRGaWVsZHNUb2dnbGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICQoJy5jaGFuZ2UtcGFzc3dvcmQtZmllbGRzJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KCBhcHAuaW5pdCk7XG4gICAgJChkb2N1bWVudCkub24oJ3BqYXg6Y29tcGxldGUnLCBhcHAuaW5pdCk7XG5cbn0pKGpRdWVyeSk7IiwiOyhmdW5jdGlvbiAoJCkge1xuICAgIGNvbnN0IGFwcCA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnJlcG9ydC1idG4nKS5vbignY2xpY2snLCBhcHAuSGFuZGxlUmVwb3J0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBIYW5kbGVSZXBvcnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHtpZCwgdGl0bGUsIGxpbmssIHRodW1ibmFpbH0gPSAkKHRoaXMpLmRhdGEoJ3N0YXRpb24nKTtcblxuICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JlcG9ydCBhIHByb2JsZW0gd2l0aCBzdGF0aW9uJyxcbiAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ1N1Ym1pdCByZXBvcnQnLFxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbCcsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uQ29sb3I6ICcjZDMzJyxcbiAgICAgICAgICAgICAgICByZXZlcnNlQnV0dG9uczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93TG9hZGVyT25Db25maXJtOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZUNvbmZpcm06ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW1haWwgPSAkKCcjcmVwb3J0LWVtYWlsJykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzc3VlID0gJCgnI3JlcG9ydC1pc3N1ZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJCgnI3JlcG9ydC1tZXNzYWdlJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBlbXB0eSBhbnkgZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3dhbC5zaG93VmFsaWRhdGlvbk1lc3NhZ2UoJ0VtYWlsIGlzIG1pc3NpbmchJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc3N1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN3YWwuc2hvd1ZhbGlkYXRpb25NZXNzYWdlKCdObyBpc3N1ZSBpcyBzZWxlY3RlZCEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX3JlcG9ydCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlOiBpc3N1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciksXG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGh0bWw6XG4gICAgICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJyZXBvcnQtZm9ybVwiPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RlZC1zdGF0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RodW1ibmFpbH1cIiBhbHQ9XCIke3RpdGxlfVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7bGlua31cIj4ke3RpdGxlfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJyZXBvcnQtZW1haWxcIj5Zb3VyIEVtYWlsOiA8c3BhbiBjbGFzcz1cInJlcXVpcmVkXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBpZD1cInJlcG9ydC1lbWFpbFwiIG5hbWU9XCJlbWFpbFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicmVwb3J0LWlzc3VlXCI+U2VsZWN0IElzc3VlOiA8c3BhbiBjbGFzcz1cInJlcXVpcmVkXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgbmFtZT1cImlzc3VlXCIgaWQ9XCJyZXBvcnQtaXNzdWVcIiByZXF1aXJlZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCB0aGUgaXNzdWU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5UaGUgcGFnZSBpcyBub3Qgd29ya2luZzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlBsYXliYWNrIGlzIG5vdCB3b3JraW5nPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+QWRkcmVzcyBvciByYWRpbyBkYXRhIGlzIGluY29ycmVjdDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlRoZSBzaXRlIGlzIHVzaW5nIGFuIGluY29ycmVjdCBzdHJlYW0gbGluazwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInJlcG9ydC1lbWFpbFwiPllvdXIgTWVzc2FnZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwibWVzc2FnZVwiIGlkPVwicmVwb3J0LW1lc3NhZ2VcIiByb3dzPVwiNFwiIGNvbHM9XCIzMFwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwic3RhdGlvbi1pZFwiIHZhbHVlPVwiJHtpZH1cIj4gICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaXNDb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVwb3J0IHNlbnQgc3VjY2Vzc2Z1bGx5IScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeSggYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xuXG59KShqUXVlcnkpOyIsIjsoZnVuY3Rpb24gKCQpIHtcbiAgICBjb25zdCBhcHAgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIHJldmlldyBmb3JtIHN1Ym1pdFxuICAgICAgICAgICAgJCgnI3Jldmlld19zdWJtaXQnKS5vbignY2xpY2snLCBhcHAuaGFuZGxlU3VibWl0KTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIGRlbGV0ZVxuICAgICAgICAgICAgJCgnI2RlbGV0ZV9yZXZpZXcnKS5vbignY2xpY2snLCBhcHAuaGFuZGxlRGVsZXRlKTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIHJldmlldyBzZWxlY3Rpb25cbiAgICAgICAgICAgICQoJy5zdGFyJykub24oJ2NsaWNrJywgYXBwLmhhbmRsZVNlbGVjdGlvbik7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVEZWxldGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJldmlld0lkID0gJCh0aGlzKS5kYXRhKCdyZXZpZXdfaWQnKTtcblxuICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0FyZSB5b3Ugc3VyZT8nLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwiWW91IHdvbid0IGJlIGFibGUgdG8gcmV2ZXJ0IHRoaXMhXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdZZXMsIGRlbGV0ZSBpdCEnLFxuICAgICAgICAgICAgICAgIHJldmVyc2VCdXR0b25zOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNob3dMb2FkZXJPbkNvbmZpcm06IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlQ29uZmlybTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKCcjcmF0aW5nJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3JldmlldycpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zdGFyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb19kZWxldGVfcmV2aWV3Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByZXZpZXdJZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oKHtpc0NvbmZpcm1lZH0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNDb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBgWW91ciByZXZpZXcgaGFzIGJlZW4gZGVsZXRlZC5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDMwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lclByb2dyZXNzQmFyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zaW5nbGUtcmV2aWV3LmN1cnJlbnQtdXNlci1yZXZpZXcnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICghcGFyc2VJbnQoV1JVRi5jdXJyZW50VXNlcklEKSkge1xuICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBgUGxlYXNlLCA8YSBocmVmPVwiJHtXUlVGLm15QWNjb3VudFVSTH1cIj5sb2dpbjwvYT4gZmlyc3QgdG8gYWRkIGEgcmV2aWV3LmAsXG4gICAgICAgICAgICAgICAgICAgIGljb246ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG9iamVjdF9pZCA9ICQoJyNvYmplY3RfaWQnKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IHJhdGluZyA9ICQoJyNyYXRpbmcnKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldmlldyA9ICQoJyNyZXZpZXcnKS52YWwoKTtcblxuICAgICAgICAgICAgaWYgKCFyYXRpbmcpIHtcbiAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BsZWFzZSwgc2VsZWN0IHRoZSByYXRpbmcuJyxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ09LJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFyZXZpZXcpIHtcbiAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BsZWFzZSwgd3JpdGUgYSByZXZpZXcuJyxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ09LJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb19hZGRfcmV2aWV3Jywge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0X2lkLFxuICAgICAgICAgICAgICAgICAgICByYXRpbmcsXG4gICAgICAgICAgICAgICAgICAgIHJldmlldyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGBZb3VyIHJldmlldyBoYXMgYmVlbiAke3Jlc3BvbnNlLnVwZGF0ZSA/ICd1cGRhdGVkJyA6ICdhZGRlZCd9LmAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcjogMzAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI25vLXJldmlldy1tc2cnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS51cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuc2luZ2xlLXJldmlldy5jdXJyZW50LXVzZXItcmV2aWV3JykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucmV2aWV3LWxpc3RpbmcnKS5hcHBlbmQocmVzcG9uc2UuaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlU2VsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykucHJldkFsbCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykubmV4dEFsbCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI3JhdGluZycpLnZhbCgkKHRoaXMpLmRhdGEoJ3JhdGUnKSk7XG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xuXG59KShqUXVlcnkpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vY29tcG9uZW50cy9mYXZvcml0ZXMnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvbXktYWNjb3VudCc7XG5pbXBvcnQgJy4vY29tcG9uZW50cy9yZXBvcnQnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvcmV2aWV3cyc7Il0sIm5hbWVzIjpbIiQiLCJhcHAiLCJpbml0IiwidXBkYXRlRmF2b3JpdGVzIiwib24iLCJ0b2dnbGVGYXZvcml0ZSIsIndwUmFkaW9Ib29rcyIsImFkZEFjdGlvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInBhcnNlSW50IiwiV1JVRiIsImN1cnJlbnRVc2VySUQiLCJTd2FsIiwiZmlyZSIsInRpdGxlIiwibXlBY2NvdW50VVJMIiwiaWNvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiaWQiLCJhdHRyIiwid3AiLCJhamF4Iiwic2VuZCIsImRhdGEiLCJ0eXBlIiwiaGFzQ2xhc3MiLCJzdWNjZXNzIiwiZmF2b3JpdGVzIiwiT2JqZWN0IiwidmFsdWVzIiwiQXJyYXkiLCJpc0FycmF5IiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJpc0Zhdm9yaXRlIiwiZ2V0RmF2b3JpdGVzIiwiaW5jbHVkZXMiLCJnZXRJdGVtIiwicGFyc2UiLCJtYXAiLCJmYXZvcml0ZSIsImVhY2giLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZG9jdW1lbnQiLCJyZWFkeSIsImpRdWVyeSIsImhhbmRsZVRhYnMiLCJwYXNzd29yZEZpZWxkc1RvZ2dsZSIsImhhbmRsZUVkaXRBY2NvdW50Iiwic2VhcmNoUGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJpc0Zhdm9yaXRlcyIsImhhcyIsInRyaWdnZXIiLCJmb3JtIiwic2VyaWFsaXplIiwiZm9ybV9tZXNzYWdlIiwiZmluZCIsImh0bWwiLCJyZXNwb25zZSIsImZvckVhY2giLCJhcHBlbmQiLCJ0YXJnZXQiLCJ0b2dnbGVDbGFzcyIsIkhhbmRsZVJlcG9ydCIsIiR0aGlzIiwibGluayIsInRodW1ibmFpbCIsInNob3dDYW5jZWxCdXR0b24iLCJjYW5jZWxCdXR0b25UZXh0IiwiY2FuY2VsQnV0dG9uQ29sb3IiLCJyZXZlcnNlQnV0dG9ucyIsInNob3dMb2FkZXJPbkNvbmZpcm0iLCJwcmVDb25maXJtIiwiZW1haWwiLCJ2YWwiLCJpc3N1ZSIsIm1lc3NhZ2UiLCJzaG93VmFsaWRhdGlvbk1lc3NhZ2UiLCJ0aGVuIiwicmVzdWx0IiwiaXNDb25maXJtZWQiLCJ0aW1lciIsInRpbWVyUHJvZ3Jlc3NCYXIiLCJoYW5kbGVTdWJtaXQiLCJoYW5kbGVEZWxldGUiLCJoYW5kbGVTZWxlY3Rpb24iLCJyZXZpZXdJZCIsInRleHQiLCJyZW1vdmUiLCJvYmplY3RfaWQiLCJyYXRpbmciLCJyZXZpZXciLCJ1cGRhdGUiLCJwcmV2QWxsIiwibmV4dEFsbCJdLCJzb3VyY2VSb290IjoiIn0=