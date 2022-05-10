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
      var isFavorite = $(this).hasClass('active');
      wp.ajax.send('wp_radio_toggle_favorite', {
        data: {
          id: id,
          type: isFavorite ? 'remove' : 'add'
        },
        success: function success(favorites) {
          if (_typeof(favorites) === 'object') {
            favorites = Object.values(favorites);
          }

          favorites = Array.isArray(favorites) ? favorites : [];
          localStorage.setItem('favorite_stations', JSON.stringify(favorites)); //sweetalert toast

          throw Swal.fire({
            toast: true,
            title: isFavorite ? 'Station removed from favorites.' : 'Station added to favorites',
            icon: 'success',
            timer: 2500,
            position: 'bottom',
            timerProgressBar: true,
            showConfirmButton: false
          }).then(function () {
            app.updateFavorites();
          });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cy9mYXZvcml0ZXMuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9jb21wb25lbnRzL215LWFjY291bnQuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9jb21wb25lbnRzL3JlcG9ydC5qcyIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kLy4vc3JjL2pzL2NvbXBvbmVudHMvcmV2aWV3cy5qcyIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kLy4vc3JjL2pzL2Zyb250ZW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24gKCQpIHtcbiAgICBjb25zdCBhcHAgPSB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy9pbml0IHVwZGF0ZSBmYXZvcml0ZXNcbiAgICAgICAgICAgIGFwcC51cGRhdGVGYXZvcml0ZXMoKTtcblxuICAgICAgICAgICAgJCgnLmZhdm9yaXRlLWJ0bicpLm9uKCdjbGljaycsIGFwcC50b2dnbGVGYXZvcml0ZSk7XG5cbiAgICAgICAgICAgIHdwUmFkaW9Ib29rcy5hZGRBY3Rpb24oJ3VwZGF0ZV9wbGF5ZXJfZGF0YScsICd3cC1yYWRpbycsIGFwcC51cGRhdGVGYXZvcml0ZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZUZhdm9yaXRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoIXBhcnNlSW50KFdSVUYuY3VycmVudFVzZXJJRCkpIHtcbiAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogYDxhIGhyZWY9XCIke1dSVUYubXlBY2NvdW50VVJMfVwiPkxvZ2luPC9hPiBmaXJzdCB0byBhZGQgdGhlIHN0YXRpb24gdG8geW91ciBmYXZvcml0ZSBsaXN0LmAsXG4gICAgICAgICAgICAgICAgICAgIGljb246ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICBjb25zdCBpc0Zhdm9yaXRlID0gJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHdwLmFqYXguc2VuZCgnd3BfcmFkaW9fdG9nZ2xlX2Zhdm9yaXRlJywge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBpc0Zhdm9yaXRlID8gJ3JlbW92ZScgOiAnYWRkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChmYXZvcml0ZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZhdm9yaXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhdm9yaXRlcyA9IE9iamVjdC52YWx1ZXMoZmF2b3JpdGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZhdm9yaXRlcyA9IEFycmF5LmlzQXJyYXkoZmF2b3JpdGVzKSA/IGZhdm9yaXRlcyA6IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdmYXZvcml0ZV9zdGF0aW9ucycsIEpTT04uc3RyaW5naWZ5KGZhdm9yaXRlcykpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc3dlZXRhbGVydCB0b2FzdFxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogaXNGYXZvcml0ZSA/ICdTdGF0aW9uIHJlbW92ZWQgZnJvbSBmYXZvcml0ZXMuJyA6ICdTdGF0aW9uIGFkZGVkIHRvIGZhdm9yaXRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnVwZGF0ZUZhdm9yaXRlcygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNGYXZvcml0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gYXBwLmdldEZhdm9yaXRlcygpLmluY2x1ZGVzKHBhcnNlSW50KGlkKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RmF2b3JpdGVzOiAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmF2b3JpdGVzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Zhdm9yaXRlX3N0YXRpb25zJyk7XG4gICAgICAgICAgICBpZiAoIWZhdm9yaXRlcykgcmV0dXJuIFtdO1xuXG4gICAgICAgICAgICBmYXZvcml0ZXMgPSBKU09OLnBhcnNlKGZhdm9yaXRlcyk7XG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZmF2b3JpdGVzKSkgcmV0dXJuIFtdO1xuXG4gICAgICAgICAgICBmYXZvcml0ZXMgPSBmYXZvcml0ZXMubWFwKGZhdm9yaXRlID0+IHBhcnNlSW50KGZhdm9yaXRlKSk7XG4gICAgICAgICAgICByZXR1cm4gZmF2b3JpdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZUZhdm9yaXRlczogKCkgPT4ge1xuICAgICAgICAgICAgJCgnLmZhdm9yaXRlLWJ0bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICAgICAgaWYgKGFwcC5pc0Zhdm9yaXRlKGlkKSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShhcHAuaW5pdCk7XG4gICAgJChkb2N1bWVudCkub24oJ3BqYXg6Y29tcGxldGUnLCBhcHAuaW5pdCk7XG59KShqUXVlcnkpOyIsIjsoZnVuY3Rpb24gKCQpIHtcblxuICAgIGNvbnN0IGFwcCA9IHtcbiAgICAgICAgaW5pdDogKCkgPT4ge1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgbWVudSB0YWJzXG4gICAgICAgICAgICAkKCcud3AtcmFkaW8tbXktYWNjb3VudC1uYXZpZ2F0aW9uIGFbaHJlZj0jXScpLm9uKCdjbGljaycsIGFwcC5oYW5kbGVUYWJzKTtcblxuICAgICAgICAgICAgLy8gUGFzc3dvcmQgZmllbGRzIHRvZ2dsZVxuICAgICAgICAgICAgJCgnLmNoYW5nZS1wYXNzd29yZC1idXR0b24nKS5vbignY2xpY2snLCBhcHAucGFzc3dvcmRGaWVsZHNUb2dnbGUpO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgZWRpdC1hY2NvdW50IGZvcm1cbiAgICAgICAgICAgICQoJy53cC1yYWRpby1mb3JtLWVkaXQtYWNjb3VudCcpLm9uKCdzdWJtaXQnLCBhcHAuaGFuZGxlRWRpdEFjY291bnQpO1xuXG4gICAgICAgICAgICAvLyBzZXQgZmF2b3JpdGVzIGFjdGl2ZSB0YWIgaWYgcGFnaW5hdGlvblxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAgICAgICAgIGNvbnN0IGlzRmF2b3JpdGVzID0gc2VhcmNoUGFyYW1zLmhhcygncGFnaW5hdGUnKTtcbiAgICAgICAgICAgIGlmIChpc0Zhdm9yaXRlcykge1xuICAgICAgICAgICAgICAgICQoYC53cC1yYWRpby1teS1hY2NvdW50LW5hdmlnYXRpb24gYVtkYXRhLXRhcmdldD1mYXZvcml0ZXNdYCkudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVFZGl0QWNjb3VudDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcblxuICAgICAgICAgICAgY29uc3QgZm9ybV9tZXNzYWdlID0gZm9ybS5maW5kKCcuZm9ybS1tZXNzYWdlJyk7XG5cbiAgICAgICAgICAgIGZvcm1fbWVzc2FnZS5odG1sKCcnKTtcblxuICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb19lZGl0X2FjY291bnQnLCB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1fbWVzc2FnZS5odG1sKGA8cCBjbGFzcz1cInN1Y2Nlc3NcIj4ke3Jlc3BvbnNlLnN1Y2Nlc3N9PC9wPmApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlcnJvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLmZvckVhY2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1fbWVzc2FnZS5hcHBlbmQoYDxwIGNsYXNzPVwiZXJyb3JcIj4ke2Vycm9yfTwvcD5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlVGFiczogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gJCh0aGlzKS5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICQoJy53cC1yYWRpby1teS1hY2NvdW50LW5hdmlnYXRpb24gYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAkKCcuYWNjb3VudC1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJChgLmNvbnRlbnQtJHt0YXJnZXR9YCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhc3N3b3JkRmllbGRzVG9nZ2xlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkKCcuY2hhbmdlLXBhc3N3b3JkLWZpZWxkcycpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeSggYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xuXG59KShqUXVlcnkpOyIsIjsoZnVuY3Rpb24gKCQpIHtcbiAgICBjb25zdCBhcHAgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5yZXBvcnQtYnRuJykub24oJ2NsaWNrJywgYXBwLkhhbmRsZVJlcG9ydCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgSGFuZGxlUmVwb3J0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBjb25zdCB7aWQsIHRpdGxlLCBsaW5rLCB0aHVtYm5haWx9ID0gJCh0aGlzKS5kYXRhKCdzdGF0aW9uJyk7XG5cbiAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZXBvcnQgYSBwcm9ibGVtIHdpdGggc3RhdGlvbicsXG4gICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdTdWJtaXQgcmVwb3J0JyxcbiAgICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdDYW5jZWwnLFxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvbkNvbG9yOiAnI2QzMycsXG4gICAgICAgICAgICAgICAgcmV2ZXJzZUJ1dHRvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd0xvYWRlck9uQ29uZmlybTogdHJ1ZSxcblxuICAgICAgICAgICAgICAgIHByZUNvbmZpcm06ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW1haWwgPSAkKCcjcmVwb3J0LWVtYWlsJykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzc3VlID0gJCgnI3JlcG9ydC1pc3N1ZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJCgnI3JlcG9ydC1tZXNzYWdlJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBlbXB0eSBhbnkgZmllbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgU3dhbC5zaG93VmFsaWRhdGlvbk1lc3NhZ2UoJ0VtYWlsIGlzIG1pc3NpbmchJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc3N1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN3YWwuc2hvd1ZhbGlkYXRpb25NZXNzYWdlKCdObyBpc3N1ZSBpcyBzZWxlY3RlZCEnKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICB3cC5hamF4LnNlbmQoJ3dwX3JhZGlvX3JlcG9ydCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlOiBpc3N1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciksXG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGh0bWw6XG4gICAgICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJyZXBvcnQtZm9ybVwiPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RlZC1zdGF0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke3RodW1ibmFpbH1cIiBhbHQ9XCIke3RpdGxlfVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7bGlua31cIj4ke3RpdGxlfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJyZXBvcnQtZW1haWxcIj5Zb3VyIEVtYWlsOiA8c3BhbiBjbGFzcz1cInJlcXVpcmVkXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBpZD1cInJlcG9ydC1lbWFpbFwiIG5hbWU9XCJlbWFpbFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicmVwb3J0LWlzc3VlXCI+U2VsZWN0IElzc3VlOiA8c3BhbiBjbGFzcz1cInJlcXVpcmVkXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgbmFtZT1cImlzc3VlXCIgaWQ9XCJyZXBvcnQtaXNzdWVcIiByZXF1aXJlZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCB0aGUgaXNzdWU8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5UaGUgcGFnZSBpcyBub3Qgd29ya2luZzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlBsYXliYWNrIGlzIG5vdCB3b3JraW5nPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+QWRkcmVzcyBvciByYWRpbyBkYXRhIGlzIGluY29ycmVjdDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlRoZSBzaXRlIGlzIHVzaW5nIGFuIGluY29ycmVjdCBzdHJlYW0gbGluazwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInJlcG9ydC1lbWFpbFwiPllvdXIgTWVzc2FnZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwibWVzc2FnZVwiIGlkPVwicmVwb3J0LW1lc3NhZ2VcIiByb3dzPVwiNFwiIGNvbHM9XCIzMFwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwic3RhdGlvbi1pZFwiIHZhbHVlPVwiJHtpZH1cIj4gICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaXNDb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVwb3J0IHNlbnQgc3VjY2Vzc2Z1bGx5IScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcjogMjUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeSggYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xuXG59KShqUXVlcnkpOyIsIjsoZnVuY3Rpb24gKCQpIHtcbiAgICBjb25zdCBhcHAgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIHJldmlldyBmb3JtIHN1Ym1pdFxuICAgICAgICAgICAgJCgnI3Jldmlld19zdWJtaXQnKS5vbignY2xpY2snLCBhcHAuaGFuZGxlU3VibWl0KTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIGRlbGV0ZVxuICAgICAgICAgICAgJCgnI2RlbGV0ZV9yZXZpZXcnKS5vbignY2xpY2snLCBhcHAuaGFuZGxlRGVsZXRlKTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIHJldmlldyBzZWxlY3Rpb25cbiAgICAgICAgICAgICQoJy5zdGFyJykub24oJ2NsaWNrJywgYXBwLmhhbmRsZVNlbGVjdGlvbik7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVEZWxldGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJldmlld0lkID0gJCh0aGlzKS5kYXRhKCdyZXZpZXdfaWQnKTtcblxuICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0FyZSB5b3Ugc3VyZT8nLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwiWW91IHdvbid0IGJlIGFibGUgdG8gcmV2ZXJ0IHRoaXMhXCIsXG4gICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdZZXMsIGRlbGV0ZSBpdCEnLFxuICAgICAgICAgICAgICAgIHJldmVyc2VCdXR0b25zOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNob3dMb2FkZXJPbkNvbmZpcm06IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlQ29uZmlybTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKCcjcmF0aW5nJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3JldmlldycpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zdGFyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb19kZWxldGVfcmV2aWV3Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByZXZpZXdJZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oKHtpc0NvbmZpcm1lZH0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNDb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBgWW91ciByZXZpZXcgaGFzIGJlZW4gZGVsZXRlZC5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDMwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lclByb2dyZXNzQmFyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zaW5nbGUtcmV2aWV3LmN1cnJlbnQtdXNlci1yZXZpZXcnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgfSxcblxuICAgICAgICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICghcGFyc2VJbnQoV1JVRi5jdXJyZW50VXNlcklEKSkge1xuICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBgUGxlYXNlLCA8YSBocmVmPVwiJHtXUlVGLm15QWNjb3VudFVSTH1cIj5sb2dpbjwvYT4gZmlyc3QgdG8gYWRkIGEgcmV2aWV3LmAsXG4gICAgICAgICAgICAgICAgICAgIGljb246ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG9iamVjdF9pZCA9ICQoJyNvYmplY3RfaWQnKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IHJhdGluZyA9ICQoJyNyYXRpbmcnKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldmlldyA9ICQoJyNyZXZpZXcnKS52YWwoKTtcblxuICAgICAgICAgICAgaWYgKCFyYXRpbmcpIHtcbiAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BsZWFzZSwgc2VsZWN0IHRoZSByYXRpbmcuJyxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ09LJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFyZXZpZXcpIHtcbiAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BsZWFzZSwgd3JpdGUgYSByZXZpZXcuJyxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ09LJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb19hZGRfcmV2aWV3Jywge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0X2lkLFxuICAgICAgICAgICAgICAgICAgICByYXRpbmcsXG4gICAgICAgICAgICAgICAgICAgIHJldmlldyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGBZb3VyIHJldmlldyBoYXMgYmVlbiAke3Jlc3BvbnNlLnVwZGF0ZSA/ICd1cGRhdGVkJyA6ICdhZGRlZCd9LmAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcjogMzAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyUHJvZ3Jlc3NCYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI25vLXJldmlldy1tc2cnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS51cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuc2luZ2xlLXJldmlldy5jdXJyZW50LXVzZXItcmV2aWV3JykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucmV2aWV3LWxpc3RpbmcnKS5hcHBlbmQocmVzcG9uc2UuaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlU2VsZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykucHJldkFsbCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykubmV4dEFsbCgpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnI3JhdGluZycpLnZhbCgkKHRoaXMpLmRhdGEoJ3JhdGUnKSk7XG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xuXG59KShqUXVlcnkpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vY29tcG9uZW50cy9mYXZvcml0ZXMnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvbXktYWNjb3VudCc7XG5pbXBvcnQgJy4vY29tcG9uZW50cy9yZXBvcnQnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvcmV2aWV3cyc7Il0sIm5hbWVzIjpbIiQiLCJhcHAiLCJpbml0IiwidXBkYXRlRmF2b3JpdGVzIiwib24iLCJ0b2dnbGVGYXZvcml0ZSIsIndwUmFkaW9Ib29rcyIsImFkZEFjdGlvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInBhcnNlSW50IiwiV1JVRiIsImN1cnJlbnRVc2VySUQiLCJTd2FsIiwiZmlyZSIsInRpdGxlIiwibXlBY2NvdW50VVJMIiwiaWNvbiIsImNvbmZpcm1CdXR0b25UZXh0IiwiaWQiLCJhdHRyIiwiaXNGYXZvcml0ZSIsImhhc0NsYXNzIiwid3AiLCJhamF4Iiwic2VuZCIsImRhdGEiLCJ0eXBlIiwic3VjY2VzcyIsImZhdm9yaXRlcyIsIk9iamVjdCIsInZhbHVlcyIsIkFycmF5IiwiaXNBcnJheSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwidG9hc3QiLCJ0aW1lciIsInBvc2l0aW9uIiwidGltZXJQcm9ncmVzc0JhciIsInNob3dDb25maXJtQnV0dG9uIiwidGhlbiIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImdldEZhdm9yaXRlcyIsImluY2x1ZGVzIiwiZ2V0SXRlbSIsInBhcnNlIiwibWFwIiwiZmF2b3JpdGUiLCJlYWNoIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImRvY3VtZW50IiwicmVhZHkiLCJqUXVlcnkiLCJoYW5kbGVUYWJzIiwicGFzc3dvcmRGaWVsZHNUb2dnbGUiLCJoYW5kbGVFZGl0QWNjb3VudCIsInNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwiaXNGYXZvcml0ZXMiLCJoYXMiLCJ0cmlnZ2VyIiwiZm9ybSIsInNlcmlhbGl6ZSIsImZvcm1fbWVzc2FnZSIsImZpbmQiLCJodG1sIiwicmVzcG9uc2UiLCJmb3JFYWNoIiwiYXBwZW5kIiwidGFyZ2V0IiwidG9nZ2xlQ2xhc3MiLCJIYW5kbGVSZXBvcnQiLCIkdGhpcyIsImxpbmsiLCJ0aHVtYm5haWwiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2FuY2VsQnV0dG9uVGV4dCIsImNhbmNlbEJ1dHRvbkNvbG9yIiwicmV2ZXJzZUJ1dHRvbnMiLCJzaG93TG9hZGVyT25Db25maXJtIiwicHJlQ29uZmlybSIsImVtYWlsIiwidmFsIiwiaXNzdWUiLCJtZXNzYWdlIiwic2hvd1ZhbGlkYXRpb25NZXNzYWdlIiwicmVzdWx0IiwiaXNDb25maXJtZWQiLCJoYW5kbGVTdWJtaXQiLCJoYW5kbGVEZWxldGUiLCJoYW5kbGVTZWxlY3Rpb24iLCJyZXZpZXdJZCIsInRleHQiLCJyZW1vdmUiLCJvYmplY3RfaWQiLCJyYXRpbmciLCJyZXZpZXciLCJ1cGRhdGUiLCJwcmV2QWxsIiwibmV4dEFsbCJdLCJzb3VyY2VSb290IjoiIn0=