var Instagram = require('instagram-web-api');
var bigInt = require('big-integer');

Instagram.prototype.getHashtag = async function (hashtag) {
  var result = await this.getPhotosByHashtag({ hashtag });
  var i;
  if (result.hashtag.edge_hashtag_to_media.edges.length > 2) i = 2;
  else i = 0;
  var info = result.hashtag.edge_hashtag_to_media.edges[i].node;
  //console.log(result.hashtag.edge_hashtag_to_media.edges[i]);
  return {id:info.id, code: info.shortcode}
}

Instagram.prototype.getShortcodeFromId = function (tag) {
  if (typeof tag === 'object') return tag.id;
  let id = bigInt(tag.split('_', 1)[0]);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let remainder;
  let shortcode = '';

  while (id.greater(0)) {
    let division = id.divmod(64);
    id = division.quotient;
    shortcode = `${alphabet.charAt(division.remainder)}${shortcode}`;
  }

  return shortcode;
}

Instagram.prototype.isLogin = function () {
  if (!this._sharedData) return false;
  return (this._sharedData.config.viewerId !== null);
}

module.exports = Instagram;