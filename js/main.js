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
    this.setDefaultStyle();
    NP.home = new NP.Home();
  },

  campaign: function() {
    this.setDefaultStyle();
    // show capital campaign landing page
    NP.campaignView.render();
  },
  marketing: function() {
    this.setDefaultStyle();
    // show cause marketing landing page
    NP.marketingView.render(); 
  },
  founders: function() {
    this.setDefaultStyle();
    // show founders syndrome landing page
    NP.foundersView.render(); 
  },
  grant: function() {
    this.setDefaultStyle();
    // show grant writing landing page
    NP.grantView.render(); 
  },
  fundraising: function() {
    this.setDefaultStyle();
    NP.fundraisingView.render();
    // show fundraising professionals landing page
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
		'mouseleave #overlay': 'hideOverlay'
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
  campaign: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    NP.campaignView.render();
  },
  marketing: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    NP.marketingView.render(); 
  },
  founders: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    NP.foundersView.render();
  },
  grant: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    NP.grantView.render();
  },
  fundraising: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    NP.fundraisingView.render();
  },
  webinar: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    // pass webinar name into ajax call to json data
    NP.showWebinarList(webinar_title);
  }
});

NP.showWebinarList = function(webinarTitle) {
  $.support.cors = true;
  $.ajax({
    crosDomain:true,    
    url: 'data/' + webinarTitle + '.json',
    success: function(data) {
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
    },
    //error: jqueryError,
    dataType:'json'
  });
    /*$.getJSON('data/' + webinarTitle + '.json', function(data) {
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
    });*/
};

NP.CampaignView = Backbone.Layout.extend({
    template: 'capital_campaigns',
    el: '#content',
    events: {
      'mouseenter #titles a': 'showIcon',
      'mouseleave #titles a': 'hideIcon'
    },
    initialize: function() {
    },
    showIcon: function(e) {
      e.preventDefault();
      $(e.currentTarget).before('<img src="images/play.png" class="play" />');
    },
    hideIcon: function(e) {
      e.preventDefault();
      $(e.currentTarget).parent().find('img').remove();
    }
});

NP.setVideo = function(id, url_root, name, url, title) {
  $('header, #wrapper h1').hide();
  NP.videoModel.videoId = id;
  NP.videoModel.videoTitle = title;
  NP.videoModel.urlRoot = url_root;
  NP.videoModel.sectionName = name;
  NP.videoModel.href = url;
  // pass video model to webinar template
  NP.showVideo = new NP.ShowVideo({model: NP.videoModel});
};

NP.MarketingView = Backbone.Layout.extend({
    template: 'cause_marketing',
    el: '#content',
    events: {
      'click #titles a': 'showPlayer'
    },
    initialize: function() {
    },
    showPlayer: function(e) {
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.videoModel.videoTitle = video_title;
      NP.router.showMarketing(video_id);
    }
});

NP.FoundersView = Backbone.Layout.extend({
    template: 'founders_syndrome',
    el: '#content',
    initialize: function() {
    }
});

NP.GrantView = Backbone.Layout.extend({
    template: 'grant_writing',
    el: '#content',
    initialize: function() {
      //this.render();
    },
});

NP.FundraisingView = Backbone.Layout.extend({
    template: 'fundraising_professionals',
    el: '#content',
    initialize: function() {
    },
});

NP.ShowVideo = Backbone.Layout.extend({
    template: 'webinar',
    el: '#content',
    events: {
      'click .webinar_landing': 'routeLanding'
    },
    initialize: function() {
      // render webinar template
      this.render();
    },
    routeLanding: function(e) {
      e.preventDefault();
      var sliceUrl = $(e.currentTarget).attr('href').slice(1, $(e.currentTarget).attr('href').length);
      NP.router.navigate(sliceUrl);
      switch (sliceUrl) {
          case '!capital_campaigns':
            // render capital campaign template
            NP.campaignView.render();
            break;
          case '!cause_marketing':
            // render cause marketing template
            NP.marketingView.render();
            break;
          case '!founders_syndrome':
            // render founders syndrome template
            NP.foundersView.render();
            break;
          case '!grant_writing':
            // render grant writing template
            NP.grantView.render();
            break;
          case '!fundraising_professionals':
            // render fundraising professionals template
            NP.fundraisingView.render();
            break;
        }
      
      NP.setDefaultStyle();
    }
});

$(document).ready(function() {
  
  NP.campaignView = new NP.CampaignView();
  NP.marketingView = new NP.MarketingView();
  NP.foundersView = new NP.FoundersView();
  NP.grantView = new NP.GrantView();
  NP.fundraisingView = new NP.FundraisingView();
  NP.router = new NP.Router();

  // start router
  Backbone.history.start();
  
});