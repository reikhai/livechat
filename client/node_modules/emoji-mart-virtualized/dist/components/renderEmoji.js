"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _nimbleEmoji = _interopRequireDefault(require("./emoji/nimble-emoji"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _default = function _default(_ref) {
  var i18n = _ref.i18n,
      _ref$perLine = _ref.perLine,
      perLine = _ref$perLine === void 0 ? 9 : _ref$perLine,
      _ref$emojis = _ref.emojis,
      emojis = _ref$emojis === void 0 ? [] : _ref$emojis,
      emojiProps = _ref.emojiProps,
      data = _ref.data,
      activeCategory = _ref.activeCategory;

  var Emoji = function Emoji(_ref2) {
    var style = _ref2.style,
        rowIndex = _ref2.rowIndex,
        columnIndex = _ref2.columnIndex;
    var currentIndex = perLine * rowIndex + columnIndex;
    var emoji = emojis[currentIndex] || null;
    if (!emoji) return null;
    var isCat = emoji.cat_id;

    var renderLabel = function renderLabel() {
      if (!emoji.cat_id) return null;
      var label = i18n.categories[emoji.cat_id] || emoji.cat_name;
      var labelSpanStyles = {};

      if (activeCategory.id !== emoji.cat_id) {
        labelSpanStyles = {
          position: 'absolute'
        };
      }

      return _react["default"].createElement("div", {
        style: _objectSpread({}, style, {
          width: '100%'
        }),
        "data-name": label,
        className: "emoji-mart-category-label"
      }, _react["default"].createElement("span", {
        style: labelSpanStyles,
        "aria-hidden": true
        /* already labeled by the section aria-label */

      }, label));
    };

    return isCat ? renderLabel() : _react["default"].createElement("li", {
      style: style,
      key: emoji.short_names && emoji.short_names.join('_') || emoji
    }, (0, _nimbleEmoji["default"])(_objectSpread({
      emoji: emoji,
      data: data
    }, emojiProps)));
  };

  return Emoji;
};

exports["default"] = _default;