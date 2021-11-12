"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactWindow = require("react-window");

var icons = _interopRequireWildcard(require("../../svgs"));

var _store = _interopRequireDefault(require("../../utils/store"));

var _frequently = _interopRequireDefault(require("../../utils/frequently"));

var _utils = require("../../utils");

var _data = require("../../utils/data");

var _sharedProps = require("../../utils/shared-props");

var _anchors = _interopRequireDefault(require("../anchors"));

var _renderEmoji = _interopRequireDefault(require("../renderEmoji"));

var _preview = _interopRequireDefault(require("../preview"));

var _search = _interopRequireDefault(require("../search"));

var _sharedDefaultProps = require("../../utils/shared-default-props");

var _notFound = _interopRequireDefault(require("../not-found"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var gridRef = _react["default"].createRef();

var I18N = {
  search: 'Search',
  clear: 'Clear',
  // Accessible label on "clear" button
  notfound: 'No Emoji Found',
  skintext: 'Choose your default skin tone',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
    custom: 'Custom'
  },
  categorieslabel: 'Emoji categories',
  // Accessible title for the list of categories
  skintones: {
    1: 'Default Skin Tone',
    2: 'Light Skin Tone',
    3: 'Medium-Light Skin Tone',
    4: 'Medium Skin Tone',
    5: 'Medium-Dark Skin Tone',
    6: 'Dark Skin Tone'
  }
};

var NimblePicker =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(NimblePicker, _React$PureComponent);

  function NimblePicker(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, NimblePicker);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NimblePicker).call(this, props));
    _this.CUSTOM = [];
    _this.RECENT_CATEGORY = {
      id: 'recent',
      name: 'Recent',
      emojis: null
    };
    _this.SEARCH_CATEGORY = {
      id: 'search',
      name: 'Search',
      emojis: null,
      anchor: false
    };

    if (props.data.compressed) {
      (0, _data.uncompress)(props.data);
    }

    _this.data = props.data;
    _this.i18n = (0, _utils.deepMerge)(I18N, props.i18n);
    _this.icons = (0, _utils.deepMerge)(icons, props.icons);
    _this.state = {
      firstRender: true
    };
    _this.categories = [];
    _this.activeCategory = {};
    var allCategories = [].concat(_this.data.categories);

    if (props.custom.length > 0) {
      var customCategories = {};
      var customCategoriesCreated = 0;
      props.custom.forEach(function (emoji) {
        if (!customCategories[emoji.customCategory]) {
          customCategories[emoji.customCategory] = {
            id: emoji.customCategory ? "custom-".concat(emoji.customCategory) : 'custom',
            name: emoji.customCategory || 'Custom',
            emojis: [],
            anchor: customCategoriesCreated === 0
          };
          customCategoriesCreated++;
        }

        var category = customCategories[emoji.customCategory];

        var customEmoji = _objectSpread({}, emoji, {
          // `<Category />` expects emoji to have an `id`.
          id: emoji.short_names[0],
          custom: true
        });

        category.emojis.push(customEmoji);

        _this.CUSTOM.push(customEmoji);
      });
      allCategories = allCategories.concat(Object.keys(customCategories).map(function (key) {
        return customCategories[key];
      }));
    }

    _this.hideRecent = true;

    if (props.include != undefined) {
      allCategories.sort(function (a, b) {
        if (props.include.indexOf(a.id) > props.include.indexOf(b.id)) {
          return 1;
        }

        return -1;
      });
    }

    for (var categoryIndex = 0; categoryIndex < allCategories.length; categoryIndex++) {
      var category = allCategories[categoryIndex];
      var isIncluded = props.include && props.include.length ? props.include.indexOf(category.id) > -1 : true;
      var isExcluded = props.exclude && props.exclude.length ? props.exclude.indexOf(category.id) > -1 : false;

      if (!isIncluded || isExcluded) {
        continue;
      }

      if (props.emojisToShowFilter) {
        var newEmojis = [];
        var emojis = category.emojis;

        for (var emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
          var emoji = emojis[emojiIndex];

          if (props.emojisToShowFilter(_this.data.emojis[emoji] || emoji)) {
            newEmojis.push(emoji);
          }
        }

        if (newEmojis.length) {
          var newCategory = {
            emojis: newEmojis,
            name: category.name,
            id: category.id
          };

          _this.categories.push(newCategory);
        }
      } else {
        _this.categories.push(category);
      }
    }

    var includeRecent = props.include && props.include.length ? props.include.indexOf(_this.RECENT_CATEGORY.id) > -1 : true;
    var excludeRecent = props.exclude && props.exclude.length ? props.exclude.indexOf(_this.RECENT_CATEGORY.id) > -1 : false;

    if (includeRecent && !excludeRecent) {
      _this.hideRecent = false;

      _this.categories.unshift(_this.RECENT_CATEGORY);
    }

    if (_this.categories[0]) {
      _this.categories[0].first = true;
    }

    _this.categories.unshift(_this.SEARCH_CATEGORY);

    _this.setAnchorsRef = _this.setAnchorsRef.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleAnchorClick = _this.handleAnchorClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setSearchRef = _this.setSearchRef.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSearch = _this.handleSearch.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleScrollPaint = _this.handleScrollPaint.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleEmojiOver = _this.handleEmojiOver.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleEmojiLeave = _this.handleEmojiLeave.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleEmojiClick = _this.handleEmojiClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleEmojiSelect = _this.handleEmojiSelect.bind((0, _assertThisInitialized2["default"])(_this));
    _this.setPreviewRef = _this.setPreviewRef.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleSkinChange = _this.handleSkinChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleDarkMatchMediaChange = _this.handleDarkMatchMediaChange.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(NimblePicker, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.firstRender) {
        this.testStickyPosition();
        this.firstRenderTimeout = setTimeout(function () {
          _this2.setState({
            firstRender: false
          });
        }, 60);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.SEARCH_CATEGORY.emojis = null;
      clearTimeout(this.leaveTimeout);
      clearTimeout(this.firstRenderTimeout);

      if (this.darkMatchMedia) {
        this.darkMatchMedia.removeListener(this.handleDarkMatchMediaChange);
      }
    }
  }, {
    key: "testStickyPosition",
    value: function testStickyPosition() {
      var stickyTestElement = document.createElement('div');
      var prefixes = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
      prefixes.forEach(function (prefix) {
        return stickyTestElement.style.position = "".concat(prefix, "sticky");
      });
      this.hasStickyPosition = !!stickyTestElement.style.position.length;
    }
  }, {
    key: "getPreferredTheme",
    value: function getPreferredTheme() {
      if (this.props.theme != 'auto') return this.props.theme;
      if (this.state.theme) return this.state.theme;
      if (typeof matchMedia !== 'function') return _sharedDefaultProps.PickerDefaultProps.theme;

      if (!this.darkMatchMedia) {
        this.darkMatchMedia = matchMedia('(prefers-color-scheme: dark)');
        this.darkMatchMedia.addListener(this.handleDarkMatchMediaChange);
      }

      if (this.darkMatchMedia.media.match(/^not/)) return _sharedDefaultProps.PickerDefaultProps.theme;
      return this.darkMatchMedia.matches ? 'dark' : 'light';
    }
  }, {
    key: "handleDarkMatchMediaChange",
    value: function handleDarkMatchMediaChange() {
      this.setState({
        theme: this.darkMatchMedia.matches ? 'dark' : 'light'
      });
    }
  }, {
    key: "handleEmojiOver",
    value: function handleEmojiOver(emoji) {
      var preview = this.preview;

      if (!preview) {
        return;
      } // Use Array.prototype.find() when it is more widely supported.


      var emojiData = this.CUSTOM.filter(function (customEmoji) {
        return customEmoji.id === emoji.id;
      })[0];

      for (var key in emojiData) {
        if (emojiData.hasOwnProperty(key)) {
          emoji[key] = emojiData[key];
        }
      }

      preview.setState({
        emoji: emoji
      });
      clearTimeout(this.leaveTimeout);
    }
  }, {
    key: "handleEmojiLeave",
    value: function handleEmojiLeave(emoji) {
      var preview = this.preview;

      if (!preview) {
        return;
      }

      this.leaveTimeout = setTimeout(function () {
        preview.setState({
          emoji: null
        });
      }, 16);
    }
  }, {
    key: "handleEmojiClick",
    value: function handleEmojiClick(emoji, e) {
      this.props.onClick(emoji, e);
      this.handleEmojiSelect(emoji);
    }
  }, {
    key: "handleEmojiSelect",
    value: function handleEmojiSelect(emoji) {
      this.props.onSelect(emoji);
      if (!this.hideRecent && !this.props.recent) _frequently["default"].add(emoji); // var component = this.categoryRefs['category-1']
      // if (component) {
      //   let maxMargin = component.maxMargin
      //   if (this.props.enableFrequentEmojiSort) {
      //     component.forceUpdate()
      //   }
      //
      //   requestAnimationFrame(() => {
      //     if (!this.scroll) return
      //     component.memoizeSize()
      //     if (maxMargin == component.maxMargin) return
      //
      //     this.updateCategoriesSize()
      //     this.handleScrollPaint()
      //
      //     if (this.SEARCH_CATEGORY.emojis) {
      //       component.updateDisplay('none')
      //     }
      //   })
      // }
    }
  }, {
    key: "handleScrollPaint",
    value: function handleScrollPaint(titleIndexes) {
      var _this3 = this;

      return function (_ref) {
        var scrollTop = _ref.scrollTop;
        var activeCategory = null;

        if (_this3.SEARCH_CATEGORY.emojis) {
          activeCategory = _this3.SEARCH_CATEGORY;
        } else {
          var scrolledItem = Math.ceil(scrollTop / 36);
          Object.keys(titleIndexes).sort(function (a, b) {
            return titleIndexes[a].row - titleIndexes[b].row;
          }).some(function (key, index) {
            var category = _this3.categories[index + 1];

            if (titleIndexes[category.id] && titleIndexes[category.id].row < scrolledItem + 2) {
              activeCategory = category;
            }
          });
        }

        if (activeCategory) {
          var anchors = _this3.anchors,
              _activeCategory = activeCategory,
              categoryName = _activeCategory.name;

          if (anchors.state.selected !== categoryName) {
            anchors.setState({
              selected: categoryName
            });
          }
        }

        _this3.activeCategory = activeCategory;
        _this3.scrollTop = scrollTop;
      };
    }
  }, {
    key: "handleSearch",
    value: function handleSearch(emojis) {
      this.SEARCH_CATEGORY.emojis = emojis;
      this.forceUpdate();
      gridRef.current.scrollToItem({
        columnIndex: 0,
        rowIndex: 0
      });
    }
  }, {
    key: "handleAnchorClick",
    value: function handleAnchorClick(category, i, itemPosition) {
      var scrollToComponent = function scrollToComponent() {
        gridRef.current.scrollToItem({
          columnIndex: itemPosition.col,
          rowIndex: itemPosition.row ? itemPosition.row + 6 : 0
        });
      };

      if (this.SEARCH_CATEGORY.emojis) {
        this.handleSearch(null);
        this.search.clear();
        requestAnimationFrame(scrollToComponent);
      } else {
        scrollToComponent();
      }
    }
  }, {
    key: "handleSkinChange",
    value: function handleSkinChange(skin) {
      var newState = {
        skin: skin
      },
          onSkinChange = this.props.onSkinChange;
      this.setState(newState);

      _store["default"].update(newState);

      onSkinChange(skin);
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      var handled = false;

      switch (e.keyCode) {
        case 13:
          var emoji;

          if (this.SEARCH_CATEGORY.emojis && this.SEARCH_CATEGORY.emojis.length && (emoji = (0, _utils.getSanitizedData)(this.SEARCH_CATEGORY.emojis[0], this.state.skin, this.props.set, this.props.data))) {
            this.handleEmojiSelect(emoji);
            handled = true;
          }

          break;
      }

      if (handled) {
        e.preventDefault();
      }
    }
  }, {
    key: "getCategories",
    value: function getCategories() {
      return this.state.firstRender ? this.categories.slice(0, 3) : this.categories;
    }
  }, {
    key: "setAnchorsRef",
    value: function setAnchorsRef(c) {
      this.anchors = c;
    }
  }, {
    key: "setSearchRef",
    value: function setSearchRef(c) {
      this.search = c;
    }
  }, {
    key: "setPreviewRef",
    value: function setPreviewRef(c) {
      this.preview = c;
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          perLine = _this$props.perLine,
          emojiSize = _this$props.emojiSize,
          set = _this$props.set,
          sheetSize = _this$props.sheetSize,
          sheetColumns = _this$props.sheetColumns,
          sheetRows = _this$props.sheetRows,
          style = _this$props.style,
          title = _this$props.title,
          emoji = _this$props.emoji,
          color = _this$props.color,
          _native = _this$props["native"],
          backgroundImageFn = _this$props.backgroundImageFn,
          emojisToShowFilter = _this$props.emojisToShowFilter,
          showPreview = _this$props.showPreview,
          showSkinTones = _this$props.showSkinTones,
          emojiTooltip = _this$props.emojiTooltip,
          useButton = _this$props.useButton,
          include = _this$props.include,
          exclude = _this$props.exclude,
          recent = _this$props.recent,
          autoFocus = _this$props.autoFocus,
          skinEmoji = _this$props.skinEmoji,
          notFound = _this$props.notFound,
          notFoundEmoji = _this$props.notFoundEmoji;
      var width = perLine * (emojiSize + 12) + 12 + 2 + (0, _utils.measureScrollbar)();
      var theme = this.getPreferredTheme();
      var skin = this.props.skin || this.state.skin || _store["default"].get('skin') || this.props.defaultSkin;
      var emojiProps = {
        "native": _native,
        skin: skin,
        size: emojiSize,
        set: set,
        sheetSize: sheetSize,
        sheetColumns: sheetColumns,
        sheetRows: sheetRows,
        forceSize: _native,
        tooltip: emojiTooltip,
        backgroundImageFn: backgroundImageFn,
        useButton: useButton,
        onOver: this.handleEmojiOver,
        onLeave: this.handleEmojiLeave,
        onClick: this.handleEmojiClick
      };
      var allEmojis = [];
      var titleIndexes = {};
      this.getCategories().map(function (category, i) {
        var emojis = category.emojis || [];

        if (Array.isArray(_this4.SEARCH_CATEGORY.emojis)) {
          if (category.name !== 'Search') return null;
        } else if (category.name === 'Search') {
          return null;
        }

        var recent = category.id === _this4.RECENT_CATEGORY.id ? recent : undefined;
        var custom = category.id === _this4.RECENT_CATEGORY.id ? _this4.CUSTOM : undefined;

        if (category.name === 'Recent') {
          var frequentlyUsed = recent || _frequently["default"].get(perLine);

          if (frequentlyUsed.length) {
            emojis = frequentlyUsed.map(function (id) {
              var emoji = custom.filter(function (e) {
                return e.id === id;
              })[0];

              if (emoji) {
                return emoji;
              }

              return id;
            }).filter(function (id) {
              return !!(0, _utils.getData)(id, null, null, _this4.data);
            });
          }

          if (emojis.length === 0 && frequentlyUsed.length > 0) {
            return null;
          }
        } else if (category.name === 'Search') {
          emojis = _this4.SEARCH_CATEGORY.emojis;
        }

        if (emojis) {
          emojis = emojis.slice(0);
        }

        var catObj = {
          cat_id: category.id,
          cat_name: category.name
        };
        titleIndexes[catObj.cat_id] = _objectSpread({}, catObj, {
          row: Math.ceil(allEmojis.length / perLine),
          col: allEmojis.length % perLine
        });
        var missing = perLine - allEmojis.length % perLine;

        var makeGap = function makeGap(count) {
          return Array.from({
            length: count
          });
        };

        allEmojis = [].concat((0, _toConsumableArray2["default"])(allEmojis), (0, _toConsumableArray2["default"])(makeGap(allEmojis.length === 0 ? 0 : missing)), [catObj], (0, _toConsumableArray2["default"])(makeGap(perLine - 1)), (0, _toConsumableArray2["default"])(emojis));
      });
      var rowCount = Array.isArray(allEmojis) ? Math.ceil(allEmojis.length / perLine) : 0;
      return _react["default"].createElement("section", {
        style: _objectSpread({
          width: width
        }, style),
        className: "emoji-mart emoji-mart-".concat(theme),
        "aria-label": title,
        onKeyDown: this.handleKeyDown
      }, _react["default"].createElement("div", {
        className: "emoji-mart-bar"
      }, _react["default"].createElement(_anchors["default"], {
        ref: this.setAnchorsRef,
        data: this.data,
        i18n: this.i18n,
        color: color,
        categories: this.categories,
        onAnchorClick: this.handleAnchorClick,
        icons: this.icons,
        titleIndexes: titleIndexes
      })), _react["default"].createElement(_search["default"], {
        ref: this.setSearchRef,
        onSearch: this.handleSearch,
        data: this.data,
        i18n: this.i18n,
        emojisToShowFilter: emojisToShowFilter,
        include: include,
        exclude: exclude,
        custom: this.CUSTOM,
        autoFocus: autoFocus
      }), _react["default"].createElement("div", {
        className: "emoji-mart-scroll"
      }, _react["default"].createElement(_reactWindow.FixedSizeGrid, {
        ref: gridRef,
        columnCount: perLine,
        columnWidth: emojiSize + 12,
        rowHeight: emojiSize + 12,
        height: 264,
        width: perLine * 36 + 10,
        rowCount: rowCount,
        onScroll: this.handleScrollPaint(titleIndexes)
      }, (0, _renderEmoji["default"])({
        activeCategory: this.activeCategory,
        i18n: this.i18n,
        data: this.data,
        emojis: allEmojis || [],
        perLine: perLine,
        emojiProps: emojiProps
      })), allEmojis && !allEmojis.filter(function (a) {
        return a && !a.cat_id;
      }).length && _react["default"].createElement(_notFound["default"], {
        i18n: this.i18n,
        notFound: notFound,
        notFoundEmoji: notFoundEmoji,
        data: this.data,
        emojiProps: emojiProps
      })), (showPreview || showSkinTones) && _react["default"].createElement("div", {
        className: "emoji-mart-bar"
      }, _react["default"].createElement(_preview["default"], {
        ref: this.setPreviewRef,
        data: this.data,
        title: title,
        emoji: emoji,
        showSkinTones: showSkinTones,
        showPreview: showPreview,
        emojiProps: {
          "native": _native,
          size: 38,
          skin: skin,
          set: set,
          sheetSize: sheetSize,
          sheetColumns: sheetColumns,
          sheetRows: sheetRows,
          backgroundImageFn: backgroundImageFn
        },
        skinsProps: {
          skin: skin,
          onChange: this.handleSkinChange,
          skinEmoji: skinEmoji
        },
        i18n: this.i18n
      })));
    }
  }]);
  return NimblePicker;
}(_react["default"].PureComponent);

exports["default"] = NimblePicker;
NimblePicker.propTypes
/* remove-proptypes */
= _objectSpread({}, _sharedProps.PickerPropTypes, {
  data: _propTypes["default"].object.isRequired
});
NimblePicker.defaultProps = _objectSpread({}, _sharedDefaultProps.PickerDefaultProps);