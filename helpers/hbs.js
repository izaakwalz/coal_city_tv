const moment = require('moment');

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' ';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  stripTags: function (input) {
    if (input === null || input === '') return false;
    else input = input.toString();
    return input.replace(/<[^>]*>/g, '');
    // if (input) {
    //   return input.replace(/<(?:.|\n)*?>/gm, '');
    // }
  },
  trim: function (input) {
    return input.replace(/s/g, '-');
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      );
  },
};
