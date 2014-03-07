var NP = NP || {}; // main app object
var JST = JST || {};

NP.data = {};

// configure backbone layouts
Backbone.Layout.configure({
  manage: true,

  // where are the HTML templates:
  prefix: "templates/",

  fetchTemplate: function(path) {
    // Concatenate the file extension.
    path = path + ".html";

    // If cached, use the compiled template.
    if (JST[path]) {
      return JST[path];
    }

    // Put fetch into `async-mode`.
    var done = this.async();

    // Seek out the template asynchronously.
    $.ajax({
    	cache: false, // set cache to false for IE
    	type: 'GET',
    	url: path,
    	dataType: 'text',
    	success: function(contents) {
      		done(_.template(contents));
    	}
    });
  }
});

NP.VideoModel = Backbone.Model.extend({});
NP.videoModel = new NP.VideoModel();

// Backbone router for nav links and deep linking to videos
NP.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    '!index': 'index',
    '!capital_campaigns': 'campaign',
    '!cause_marketing': 'marketing',
    '!founders_syndrome': 'founders',
    '!grant_writing': 'grant',
    '!fundraising_professionals': 'fundraising',
    '!capital_campaigns/:videoId': 'showCampaign',
    '!cause_marketing/:videoId': 'showMarketing',
    '!founders_syndrome/:videoId': 'showFounders',
    '!grant_writing/:videoId': 'showGrant',
    '!fundraising_professionals/:videoId': 'showFundraising'
  },

  index: function() {
    console.log('router home');
    this.setDefaultStyle();
    NP.home = new NP.Home();
    //NP.home.render(); // render home template
  },

  campaign: function() {
    this.setDefaultStyle();
    // show capital campaign landing page
    NP.showWebinarList('capital_campaigns'); 
  },
  marketing: function() {
    this.setDefaultStyle();
    // show cause marketing landing page
    NP.showWebinarList('cause_marketing');
  },
  founders: function() {
    this.setDefaultStyle();
    // show founders syndrome landing page
    NP.showWebinarList('founders_syndrome');
  },
  grant: function() {
    this.setDefaultStyle();
    // show grant writing landing page
    NP.showWebinarList('grant_writing');
  },
  fundraising: function() {
    this.setDefaultStyle();
    // show fundraising professionals landing page
    NP.showWebinarList('fundraising_professionals');
  },
  showCampaign: function(id) {
    NP.setVideo(id, '/!capital_campaigns', 'Capital Campaigns', '#!capital_campaigns', NP.videoModel.videoTitle);
  },
  showMarketing: function(id) {
    NP.setVideo(id, '/!cause_marketing', 'Cause Marketing', '#!cause_marketing', NP.videoModel.videoTitle);
  },
  showFounders: function(id) {
    NP.setVideo(id, '/!founders_symdrome', 'Founders Syndrome & Succession Planning', '#!founders_syndrome', NP.videoModel.videoTitle);
  },
  showGrant: function(id) {
    NP.setVideo(id, '/!grant_writing', 'Grant Writing', '#!grant_writing', NP.videoModel.videoTitle);
  },
  showFundraising: function(id) {
    NP.setVideo(id, '/!fundraising_professionals', 'Fundraising Professionals', '#!fundraising_professionals', NP.videoModel.videoTitle);
  },
  setDefaultStyle: function() {
    $('header, #wrapper h1').show();
  }
});

NP.setDefaultStyle = function() {
  $('header, #wrapper h1').show();
};

NP.Home = Backbone.Layout.extend({
	template: 'home',
	el: '#content',
	events: {
		'mouseenter .np_slide': 'showOverlay',
		'mouseleave #overlay': 'hideOverlay',
    'click .np_slide': 'webinar'
	},
	initialize: function() {
    this.render();
	},
	showOverlay: function(e) {
    var webinar_title = $(e.currentTarget).attr('id');
		$(e.currentTarget).parent('section').find('#overlay').show();
	},
	hideOverlay: function(e) {
		e.preventDefault();
		$(e.currentTarget).hide();
	},
  webinar: function(e) {
    console.log('showing webinar');
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    // pass webinar name into ajax call to json data
    NP.showWebinarList(webinar_title);
  }
});

NP.showWebinarList = function(webinarTitle) {
    $.getJSON('data/' + webinarTitle + '.json', function(data) {
        $.extend(NP.data, data);
        model = data[webinarTitle];
        switch (webinarTitle) {
          case 'capital_campaigns':
            // render capital campaign template
            NP.campaignView = new NP.CampaignView({data: model});
            break;
          case 'cause_marketing':
            // render cause marketing template
            NP.marketingView = new NP.MarketingView({data: model});
            break;
          case 'founders_syndrome':
            // render founders syndrome template
            NP.foundersView = new NP.FoundersView({data: model});
            break;
          case 'grant_writing':
            // render grant writing template
            NP.grantView = new NP.GrantView({data: model});
            break;
          case 'fundraising_professionals':
            // render fundraising professionals template
            NP.fundraisingView = new NP.FundraisingView({data: model});
            break;
        }
    });
};

NP.CampaignView = Backbone.Layout.extend({
    template: 'cc_list',
    el: '#content',
    events: {
      'mouseenter #titles a': 'showIcon',
      'mouseleave #titles a': 'hideIcon'
    },
    initialize: function() {
      NP.router.navigate("!capital_campaigns");
      this.render();
    },
    showIcon: function(e) {
      e.preventDefault();
      $('#titles img').remove();
      $(e.currentTarget).before('<img src="images/play.png" class="play" />');
    },
    hideIcon: function(e) {
      e.preventDefault();
      $(e.currentTarget).parent().find('img').remove();
    }
});

NP.setVideo = function(id, url_root, name, url, title) {
  $('header, #wrapper h1').hide();
  //NP.videoModel = new NP.VideoModel();
  NP.videoModel.videoId = id;
  NP.videoModel.videoTitle = title;
  NP.videoModel.urlRoot = url_root;
  NP.videoModel.sectionName = name;
  NP.videoModel.href = url;
  // pass video model to webinar template
  NP.showVideo = new NP.ShowVideo({model: NP.videoModel});
};

NP.MarketingView = Backbone.Layout.extend({
    template: 'cc_list',
    el: '#content',
    events: {
      'click #titles a': 'showPlayer'
    },
    initialize: function() {
      NP.router.navigate("!cause_marketing");
      this.render();
    },
    showPlayer: function(e) {
      //e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      //NP.router.navigate("!capital_campaigns/" + video_id);
      // set video data to store in model
      NP.videoModel.videoTitle = video_title;
      NP.router.showMarketing(video_id);
      //NP.setVideo(video_id, '/!capital_campaigns', 'Capital Campaigns', '#!capital_campaigns', video_title);
    }
});

NP.FoundersView = Backbone.Layout.extend({
    template: 'cc_list',
    el: '#content',
    events: {
      'click #titles a': 'showPlayer'
    },
    initialize: function() {
      NP.router.navigate("!founders_syndrome");
      this.render();
    },
    showPlayer: function(e) {
      //e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.videoModel.videoTitle = video_title;
      NP.router.showFounders(video_id);
    }
});

NP.GrantView = Backbone.Layout.extend({
    template: 'cc_list',
    el: '#content',
    events: {
      'click #titles a': 'showPlayer'
    },
    initialize: function() {
      NP.router.navigate("!grant_writing");
      this.render();
    },
    showPlayer: function(e) {
      //e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.videoModel.videoTitle = video_title;
      NP.router.showGrant(video_id);
    }
});

NP.FundraisingView = Backbone.Layout.extend({
    template: 'cc_list',
    el: '#content',
    events: {
      'click #titles a': 'showPlayer'
    },
    initialize: function() {
      NP.router.navigate("!fundraising_professionals");
      this.render();
    },
    showPlayer: function(e) {
      //e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.videoModel.videoTitle = video_title;
      NP.router.showFundraising(video_id);
    }
});

NP.ShowVideo = Backbone.Layout.extend({
    template: 'webinar',
    el: '#content',
    initialize: function() {
      // render webinar template
      this.render();
    }
});

$(document).ready(function() {
  
  
  NP.router = new NP.Router();

  // start router
  Backbone.history.start();
  
});