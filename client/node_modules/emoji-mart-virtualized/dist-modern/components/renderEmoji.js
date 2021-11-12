import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import NimbleEmoji from './emoji/nimble-emoji';
export default (({
  i18n,
  perLine = 9,
  emojis = [],
  emojiProps,
  data,
  activeCategory
}) => {
  const Emoji = ({
    style,
    rowIndex,
    columnIndex
  }) => {
    const currentIndex = perLine * rowIndex + columnIndex;
    const emoji = emojis[currentIndex] || null;
    if (!emoji) return null;
    const isCat = emoji.cat_id;

    const renderLabel = () => {
      if (!emoji.cat_id) return null;
      const label = i18n.categories[emoji.cat_id] || emoji.cat_name;
      let labelSpanStyles = {};

      if (activeCategory.id !== emoji.cat_id) {
        labelSpanStyles = {
          position: 'absolute'
        };
      }

      return React.createElement("div", {
        style: _objectSpread({}, style, {
          width: '100%'
        }),
        "data-name": label,
        className: "emoji-mart-category-label"
      }, React.createElement("span", {
        style: labelSpanStyles,
        "aria-hidden": true
        /* already labeled by the section aria-label */

      }, label));
    };

    return isCat ? renderLabel() : React.createElement("li", {
      style: style,
      key: emoji.short_names && emoji.short_names.join('_') || emoji
    }, NimbleEmoji(_objectSpread({
      emoji: emoji,
      data: data
    }, emojiProps)));
  };

  return Emoji;
});