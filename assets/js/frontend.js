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
      // set favorites active tab if pagination
      var searchParams = new URLSearchParams(window.location.search);
      var isFavorites = searchParams.has('paginate');

      if (isFavorites) {
        $(".wp-radio-my-account-navigation a[data-target=favorites]").trigger('click');
      } // Handle menu tabs


      $('.wp-radio-my-account-navigation a[href=#]').on('click', app.handleTabs); // Password fields toggle

      $('.change-password-button').on('click', app.passwordFieldsToggle); // Handle edit-account form

      $('.wp-radio-form-edit-account').on('submit', app.handleEditAccount);
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



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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b0UsSUFyRUgsQ0FxRVEsVUFBQ0MsTUFBRCxFQUFZO1FBQ2hCLElBQUlBLE1BQU0sQ0FBQ0MsV0FBWCxFQUF3QjtVQUNwQjVFLElBQUksQ0FBQ0MsSUFBTCxDQUFVO1lBQ05DLEtBQUssRUFBRSwyQkFERDtZQUVORSxJQUFJLEVBQUUsU0FGQTtZQUdOeUUsS0FBSyxFQUFFLElBSEQ7WUFJTkMsZ0JBQWdCLEVBQUU7VUFKWixDQUFWO1FBTUg7TUFDSixDQTlFRDtJQStFSDtFQTFGTyxDQUFaO0VBNkZBekYsQ0FBQyxDQUFDOEMsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0I5QyxHQUFHLENBQUNDLElBQXRCO0VBQ0FGLENBQUMsQ0FBQzhDLFFBQUQsQ0FBRCxDQUFZMUMsRUFBWixDQUFlLGVBQWYsRUFBZ0NILEdBQUcsQ0FBQ0MsSUFBcEM7QUFFSCxDQWpHQSxFQWlHRThDLE1BakdGOzs7Ozs7VUNBRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvLi9zcmMvanMvY29tcG9uZW50cy9mYXZvcml0ZXMuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9jb21wb25lbnRzL215LWFjY291bnQuanMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC8uL3NyYy9qcy9jb21wb25lbnRzL3JlcG9ydC5qcyIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd3AtcmFkaW8tdXNlci1mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dwLXJhZGlvLXVzZXItZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93cC1yYWRpby11c2VyLWZyb250ZW5kLy4vc3JjL2pzL2Zyb250ZW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24gKCQpIHtcbiAgICBjb25zdCBhcHAgPSB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy9pbml0IHVwZGF0ZSBmYXZvcml0ZXNcbiAgICAgICAgICAgIGFwcC51cGRhdGVGYXZvcml0ZXMoKTtcblxuICAgICAgICAgICAgJCgnLmZhdm9yaXRlLWJ0bicpLm9uKCdjbGljaycsIGFwcC50b2dnbGVGYXZvcml0ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlRmF2b3JpdGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICghcGFyc2VJbnQoV1JVRi5jdXJyZW50VXNlcklEKSkge1xuICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBgPGEgaHJlZj1cIiR7V1JVRi5teUFjY291bnRVUkx9XCI+TG9naW48L2E+IGZpcnN0IHRvIGFkZCB0aGUgc3RhdGlvbiB0byB5b3VyIGZhdm9yaXRlIGxpc3QuYCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ09LJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaWQnKTtcblxuICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb190b2dnbGVfZmF2b3JpdGUnLCB7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpID8gJ3JlbW92ZScgOiAnYWRkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChmYXZvcml0ZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBmYXZvcml0ZXMgPSBBcnJheS5pc0FycmF5KGZhdm9yaXRlcykgPyBmYXZvcml0ZXMgOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Zhdm9yaXRlX3N0YXRpb25zJywgSlNPTi5zdHJpbmdpZnkoZmF2b3JpdGVzKSk7XG4gICAgICAgICAgICAgICAgICAgIGFwcC51cGRhdGVGYXZvcml0ZXMoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciksXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIGlzRmF2b3JpdGU6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFwcC5nZXRGYXZvcml0ZXMoKS5pbmNsdWRlcyhwYXJzZUludChpZCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZhdm9yaXRlczogKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZhdm9yaXRlcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmYXZvcml0ZV9zdGF0aW9ucycpO1xuICAgICAgICAgICAgaWYgKCFmYXZvcml0ZXMpIHJldHVybiBbXTtcblxuICAgICAgICAgICAgZmF2b3JpdGVzID0gSlNPTi5wYXJzZShmYXZvcml0ZXMpO1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGZhdm9yaXRlcykpIHJldHVybiBbXTtcblxuICAgICAgICAgICAgZmF2b3JpdGVzID0gZmF2b3JpdGVzLm1hcChmYXZvcml0ZSA9PiBwYXJzZUludChmYXZvcml0ZSkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhdm9yaXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVGYXZvcml0ZXM6ICgpID0+IHtcbiAgICAgICAgICAgICQoJy5mYXZvcml0ZS1idG4nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pZCcpO1xuICAgICAgICAgICAgICAgIGlmIChhcHAuaXNGYXZvcml0ZShpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xufSkoalF1ZXJ5KTsiLCI7KGZ1bmN0aW9uICgkKSB7XG5cbiAgICBjb25zdCBhcHAgPSB7XG4gICAgICAgIGluaXQ6ICgpID0+IHtcblxuICAgICAgICAgICAgLy8gc2V0IGZhdm9yaXRlcyBhY3RpdmUgdGFiIGlmIHBhZ2luYXRpb25cbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgICAgICBjb25zdCBpc0Zhdm9yaXRlcyA9IHNlYXJjaFBhcmFtcy5oYXMoJ3BhZ2luYXRlJyk7XG4gICAgICAgICAgICBpZiAoaXNGYXZvcml0ZXMpIHtcbiAgICAgICAgICAgICAgICAkKGAud3AtcmFkaW8tbXktYWNjb3VudC1uYXZpZ2F0aW9uIGFbZGF0YS10YXJnZXQ9ZmF2b3JpdGVzXWApLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBtZW51IHRhYnNcbiAgICAgICAgICAgICQoJy53cC1yYWRpby1teS1hY2NvdW50LW5hdmlnYXRpb24gYVtocmVmPSNdJykub24oJ2NsaWNrJywgYXBwLmhhbmRsZVRhYnMpO1xuXG4gICAgICAgICAgICAvLyBQYXNzd29yZCBmaWVsZHMgdG9nZ2xlXG4gICAgICAgICAgICAkKCcuY2hhbmdlLXBhc3N3b3JkLWJ1dHRvbicpLm9uKCdjbGljaycsIGFwcC5wYXNzd29yZEZpZWxkc1RvZ2dsZSk7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBlZGl0LWFjY291bnQgZm9ybVxuICAgICAgICAgICAgJCgnLndwLXJhZGlvLWZvcm0tZWRpdC1hY2NvdW50Jykub24oJ3N1Ym1pdCcsIGFwcC5oYW5kbGVFZGl0QWNjb3VudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFuZGxlRWRpdEFjY291bnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm1fbWVzc2FnZSA9IGZvcm0uZmluZCgnLmZvcm0tbWVzc2FnZScpO1xuXG4gICAgICAgICAgICBmb3JtX21lc3NhZ2UuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIHdwLmFqYXguc2VuZCgnd3BfcmFkaW9fZWRpdF9hY2NvdW50Jywge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtX21lc3NhZ2UuaHRtbChgPHAgY2xhc3M9XCJzdWNjZXNzXCI+JHtyZXNwb25zZS5zdWNjZXNzfTwvcD5gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci5mb3JFYWNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtX21lc3NhZ2UuYXBwZW5kKGA8cCBjbGFzcz1cImVycm9yXCI+JHtlcnJvcn08L3A+YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIGhhbmRsZVRhYnM6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9ICQodGhpcykuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAkKCcud3AtcmFkaW8tbXktYWNjb3VudC1uYXZpZ2F0aW9uIGEnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgJCgnLmFjY291bnQtY29udGVudCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoYC5jb250ZW50LSR7dGFyZ2V0fWApLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXNzd29yZEZpZWxkc1RvZ2dsZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgJCgnLmNoYW5nZS1wYXNzd29yZC1maWVsZHMnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkub24oJ3JlYWR5JywgYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xuXG59KShqUXVlcnkpOyIsIjsoZnVuY3Rpb24gKCQpIHtcbiAgICBjb25zdCBhcHAgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5yZXBvcnQtYnRuJykub24oJ2NsaWNrJywgYXBwLkhhbmRsZVJlcG9ydCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgSGFuZGxlUmVwb3J0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBjb25zdCB7aWQsIHRpdGxlLCBsaW5rLCB0aHVtYm5haWx9ID0gJCh0aGlzKS5kYXRhKCdzdGF0aW9uJyk7XG5cbiAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZXBvcnQgYSBwcm9ibGVtIHdpdGggc3RhdGlvbicsXG4gICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdTdWJtaXQgcmVwb3J0JyxcbiAgICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdDYW5jZWwnLFxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvbkNvbG9yOiAnI2QzMycsXG4gICAgICAgICAgICAgICAgcmV2ZXJzZUJ1dHRvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgc2hvd0xvYWRlck9uQ29uZmlybTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcmVDb25maXJtOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVtYWlsID0gJCgnI3JlcG9ydC1lbWFpbCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc3N1ZSA9ICQoJyNyZXBvcnQtaXNzdWUnKS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICQoJyNyZXBvcnQtbWVzc2FnZScpLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgZW1wdHkgYW55IGZpZWxkXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFN3YWwuc2hvd1ZhbGlkYXRpb25NZXNzYWdlKCdFbWFpbCBpcyBtaXNzaW5nIScpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNzdWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTd2FsLnNob3dWYWxpZGF0aW9uTWVzc2FnZSgnTm8gaXNzdWUgaXMgc2VsZWN0ZWQhJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgd3AuYWpheC5zZW5kKCd3cF9yYWRpb19yZXBvcnQnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZTogaXNzdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpLFxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBodG1sOlxuICAgICAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwicmVwb3J0LWZvcm1cIj5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VsZWN0ZWQtc3RhdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHt0aHVtYm5haWx9XCIgYWx0PVwiJHt0aXRsZX1cIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIke2xpbmt9XCI+JHt0aXRsZX08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicmVwb3J0LWVtYWlsXCI+WW91ciBFbWFpbDogPHNwYW4gY2xhc3M9XCJyZXF1aXJlZFwiPio8L3NwYW4+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImVtYWlsXCIgaWQ9XCJyZXBvcnQtZW1haWxcIiBuYW1lPVwiZW1haWxcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInJlcG9ydC1pc3N1ZVwiPlNlbGVjdCBJc3N1ZTogPHNwYW4gY2xhc3M9XCJyZXF1aXJlZFwiPio8L3NwYW4+PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IG5hbWU9XCJpc3N1ZVwiIGlkPVwicmVwb3J0LWlzc3VlXCIgcmVxdWlyZWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QgdGhlIGlzc3VlPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+VGhlIHBhZ2UgaXMgbm90IHdvcmtpbmc8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5QbGF5YmFjayBpcyBub3Qgd29ya2luZzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPkFkZHJlc3Mgb3IgcmFkaW8gZGF0YSBpcyBpbmNvcnJlY3Q8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5UaGUgc2l0ZSBpcyB1c2luZyBhbiBpbmNvcnJlY3Qgc3RyZWFtIGxpbms8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJyZXBvcnQtZW1haWxcIj5Zb3VyIE1lc3NhZ2U6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cIm1lc3NhZ2VcIiBpZD1cInJlcG9ydC1tZXNzYWdlXCIgcm93cz1cIjRcIiBjb2xzPVwiMzBcIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInN0YXRpb24taWRcIiB2YWx1ZT1cIiR7aWR9XCI+ICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmlzQ29uZmlybWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIFN3YWwuZmlyZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1JlcG9ydCBzZW50IHN1Y2Nlc3NmdWxseSEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDI1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lclByb2dyZXNzQmFyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoYXBwLmluaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdwamF4OmNvbXBsZXRlJywgYXBwLmluaXQpO1xuXG59KShqUXVlcnkpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vY29tcG9uZW50cy9mYXZvcml0ZXMnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvbXktYWNjb3VudCc7XG5pbXBvcnQgJy4vY29tcG9uZW50cy9yZXBvcnQnOyJdLCJuYW1lcyI6WyIkIiwiYXBwIiwiaW5pdCIsInVwZGF0ZUZhdm9yaXRlcyIsIm9uIiwidG9nZ2xlRmF2b3JpdGUiLCJlIiwicHJldmVudERlZmF1bHQiLCJwYXJzZUludCIsIldSVUYiLCJjdXJyZW50VXNlcklEIiwiU3dhbCIsImZpcmUiLCJ0aXRsZSIsIm15QWNjb3VudFVSTCIsImljb24iLCJjb25maXJtQnV0dG9uVGV4dCIsImlkIiwiYXR0ciIsIndwIiwiYWpheCIsInNlbmQiLCJkYXRhIiwidHlwZSIsImhhc0NsYXNzIiwic3VjY2VzcyIsImZhdm9yaXRlcyIsIkFycmF5IiwiaXNBcnJheSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiaXNGYXZvcml0ZSIsImdldEZhdm9yaXRlcyIsImluY2x1ZGVzIiwiZ2V0SXRlbSIsInBhcnNlIiwibWFwIiwiZmF2b3JpdGUiLCJlYWNoIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImRvY3VtZW50IiwicmVhZHkiLCJqUXVlcnkiLCJzZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsImlzRmF2b3JpdGVzIiwiaGFzIiwidHJpZ2dlciIsImhhbmRsZVRhYnMiLCJwYXNzd29yZEZpZWxkc1RvZ2dsZSIsImhhbmRsZUVkaXRBY2NvdW50IiwiZm9ybSIsInNlcmlhbGl6ZSIsImZvcm1fbWVzc2FnZSIsImZpbmQiLCJodG1sIiwicmVzcG9uc2UiLCJmb3JFYWNoIiwiYXBwZW5kIiwidGFyZ2V0IiwidG9nZ2xlQ2xhc3MiLCJIYW5kbGVSZXBvcnQiLCIkdGhpcyIsImxpbmsiLCJ0aHVtYm5haWwiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2FuY2VsQnV0dG9uVGV4dCIsImNhbmNlbEJ1dHRvbkNvbG9yIiwicmV2ZXJzZUJ1dHRvbnMiLCJzaG93TG9hZGVyT25Db25maXJtIiwicHJlQ29uZmlybSIsImVtYWlsIiwidmFsIiwiaXNzdWUiLCJtZXNzYWdlIiwic2hvd1ZhbGlkYXRpb25NZXNzYWdlIiwidGhlbiIsInJlc3VsdCIsImlzQ29uZmlybWVkIiwidGltZXIiLCJ0aW1lclByb2dyZXNzQmFyIl0sInNvdXJjZVJvb3QiOiIifQ==