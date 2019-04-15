var MenuBaseView = BaseView.extend({
  el: '#popup',
  templateUrl: '/popup/templates/menu.html',
  addMenuItem: function (obj, parent) {
    if (!(obj instanceof MenuItem)) obj = new MenuItem(obj);
    var item = new MenuItemView({model: obj});
    parent.append(item.$el);
  },
  components: function () {
    var $el = this.$el;
    var children = $el.children();
    return {
      top: children.first(),
      bot: children.last(),
      plh: $el.children('.placeholder'),
    };
  },
  fixStyles: function (div, plh) {
    plh.html(div.html());
    var pad = div[0].offsetWidth - div[0].clientWidth + 2;
    plh.css('padding-right', pad + 'px');
  },
});

var MenuItem = Backbone.Model.extend({});

var Menu = Backbone.Collection.extend({
  model: MenuItem,
});

var scriptsMenu = new Menu;
var commandsMenu = new Menu;

var CommandsView = MenuBaseView.extend({
  initialize: function () {
    MenuBaseView.prototype.initialize.call(this);
    this.listenTo(commandsMenu, 'reset', this.render);
  },
  _render: function () {
    if (!commandsMenu.length)
      return app.navigate('', {trigger: true, replace: true});
    var _this = this;
    _this.$el.html(_this.templateFn({
      hasSep: true
    }));
    var comp = _this.components();
    var top = comp.top;
    var bot = comp.bot;
    _this.addMenuItem({
      name: _.i18n('menuBack'),
      symbol: 'fa-arrow-left',
      onClick: function (e) {
        app.navigate('', {trigger: true});
      },
    }, top);
    commandsMenu.each(function (item) {
      _this.addMenuItem(item, bot);
    });
    setTimeout(function () {
      _this.fixStyles(bot, comp.plh);
    });
  },
});

var MenuItemView = BaseView.extend({
  className: 'menu-item',
  templateUrl: '/popup/templates/menuitem.html',
  events: {
    'click': 'onClick',
  },
  initialize: function () {
    BaseView.prototype.initialize.call(this);
    this.listenTo(this.model, 'change', this.render);
  },
  _render: function () {
    var it = this.model.toJSON();
    if (typeof it.symbol === 'function')
      it.symbol = it.symbol(it.data);
    this.$el.html(this.templateFn(it))
    .attr('title', it.title === true ? it.name : it.title);
    if (it.data === false) this.$el.addClass('disabled');
    else this.$el.removeClass('disabled');
    if (it.className) this.$el.addClass(it.className);
  },
  onClick: function (e) {
    var onClick = this.model.get('onClick');
    onClick && onClick(e, this.model);
  },
})

var MenuView = MenuBaseView.extend({
  initialize: function () {
    MenuBaseView.prototype.initialize.call(this);
    this.listenTo(scriptsMenu, 'reset', this.render);
    this.listenTo(commandsMenu, 'reset', this.render);
  },
  _render: function () {
    var _this = this;
    _this.$el.html(_this.templateFn({
      hasSep: !!scriptsMenu.length
    }));
    var comp = _this.components();
    var top = comp.top;
    var bot = comp.bot;
    _this.addMenuItem({
      name: _.i18n('menuManageScripts'),
      symbol: 'fa-cog',
      onClick: function (e) {
        var url = chrome.extension.getURL(chrome.app.getDetails().options_page);
        chrome.tabs.query({
          currentWindow: true,
          url: url,
        }, function (tabs) {
          var tab = _.find(tabs, function (tab) {
            var hash = tab.url.match(/#(\w+)/);
            return !hash || !_.includes(['confirm'], hash[1]);
          });
          if (tab) chrome.tabs.update(tab.id, {active: true});
          else chrome.tabs.create({url: url});
        });
      },
    }, top);
    if (app.currentTab && /^https?:\/\//i.test(app.currentTab.url))
      _this.addMenuItem({
        name: _.i18n('menuFindScripts'),
        symbol: 'fa-search',
        onClick: function (e) {
          var matches = app.currentTab.url.match(/:\/\/(?:www\.)?([^\/]*)/);
          chrome.tabs.create({
            url: 'https://greasyfork.org/scripts/search?q=' + matches[1],
          });
        },
      }, top);
    if (commandsMenu.length) _this.addMenuItem({
      name: _.i18n('menuCommands'),
      symbol: 'fa-arrow-right',
      onClick: function (e) {
        app.navigate('commands', {trigger: true});
      },
    }, top);
    _this.addMenuItem({
      name: _.i18n('menuScriptEnabled'),
      data: _.options.get('isApplied'),
      symbol: function (data) {
        return data ? 'fa-check' : 'fa-times';
      },
      onClick: function (e, model) {
        var isApplied = !model.get('data');
        _.options.set('isApplied', isApplied);
        model.set({data: isApplied});
        chrome.browserAction.setIcon({
          path: {
            19: '/images/icon19' + (isApplied ? '' : 'w') + '.png',
            38: '/images/icon38' + (isApplied ? '' : 'w') + '.png'
          },
        });
      },
    }, top);
    scriptsMenu.each(function (item) {
      _this.addMenuItem(item, bot);
    });
    setTimeout(function () {
      _this.fixStyles(bot, comp.plh);
    });
  },
});

var App = Backbone.Router.extend({
  routes: {
    '': 'renderMenu',
    'commands': 'renderCommands',
  },
  renderMenu: function () {
    this.view = new MenuView;
  },
  renderCommands: function () {
    this.view = new CommandsView;
  },
});
var app = new App();
if (!Backbone.history.start())
  app.navigate('', {trigger: true, replace: true});

BaseView.prototype.initI18n.call(window);

!function () {
  function commandClick(e, model) {
    chrome.tabs.sendMessage(app.currentTab.id, {
      cmd: 'Command',
      data: model.get('name'),
    });
  }
  function scriptSymbol(data) {
    return data ? 'fa-check' : 'fa-times';
  }
  function scriptClick(e, model) {
    var data = !model.get('data');
    _.sendMessage({
      cmd: 'UpdateScriptInfo',
      data: {
        id: model.get('id'),
        enabled: data,
      },
    }).then(function () {
      model.set({data: data});
      _.options.get('autoReload') && chrome.tabs.reload(app.currentTab.id);
    });
  }
  function init() {
    chrome.tabs.sendMessage(app.currentTab.id, {cmd: 'GetPopup'});
  }

  var commands = {
    SetPopup: function (data, src, callback) {
      if (app.currentTab.id !== src.tab.id) return;
      commandsMenu.reset(data.menus.map(function (menu) {
        return new MenuItem({
          name: menu[0],
          symbol: 'fa-hand-o-right',
          title: true,
          className: 'ellipsis',
          onClick: commandClick,
        });
      }));
      _.sendMessage({
        cmd: 'GetMetas',
        data: data.ids,
      }).then(function (scripts) {
        scriptsMenu.reset(scripts.map(function (script) {
          return new MenuItem({
            id: script.id,
            name: script.custom.name || _.getLocaleString(script.meta, 'name'),
            data: script.enabled,
            symbol: scriptSymbol,
            title: true,
            className: 'ellipsis',
            onClick: scriptClick,
          });
        }));
      });
    },
  };
  chrome.runtime.onMessage.addListener(function (req, src, callback) {
    var func = commands[req.cmd];
    if (func) func(req.data, src, callback);
  });

  chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    app.currentTab = tabs[0];
    init();
  });
}();
