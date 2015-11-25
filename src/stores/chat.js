'use strict';

module.exports = {
  store: {
    mention: null,
  },
  actions: {
    setMention: function (mention) {
      this.store.mention = mention;
      this.setState({
        mention: this.store.mention
      });
    },
  },
}
