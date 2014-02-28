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

NP.videoModel = Backbone.Model.extend({});

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
    NP.home.render(); // render home template
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
    NP.setVideo(id, '/!capital_campaigns', 'Capital Campaigns', '#!capital_campaigns');
  },
  showMarketing: function(id) {
    NP.setVideo(id, '/!cause_marketing', 'Cause Marketing', '#!cause_marketing');
  },
  showFounders: function(id) {
    NP.setVideo(id, '/!founders_symdrome', 'Founders Syndrome & Succession Planning', '#!founders_syndrome');
  },
  showGrant: function(id) {
    NP.setVideo(id, '/!grant_writing', 'Grant Writing', '#!grant_writing');
  },
  showFundraising: function(id) {
    NP.setVideo(id, '/!fundraising_professionals', 'Fundraising Professionals', '#!fundraising_professionals');
  },
  setDefaultStyle: function() {
    $('#content').empty();
    $('header, #wrapper h1').show();
    $('#wrapper').css('max-width', '970px');
  }
});

NP.setDefaultStyle = function() {
  $('#content').empty();
  $('header, #wrapper h1').show();
  $('#wrapper').css('max-width', '970px');
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
	},
	showOverlay: function(e) {
    var webinar_title = $(e.currentTarget).attr('id');
		$(e.currentTarget).parent('section').find('#overlay').show();
    /*$(e.currentTarget).on('click', function(e) {
      e.preventDefault();
      console.log('clicked image');
      NP.showWebinarList(webinar_title);
    });*/
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
      'click #titles a': 'showPlayer'
    },
    initialize: function() {
      NP.router.navigate("!capital_campaigns");
      this.render();
    },
    showPlayer: function(e) {
      e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.router.navigate("!capital_campaigns/" + video_id);
      // set video data to store in model
      NP.setVideo(video_id, '/!capital_campaigns', 'Capital Campaigns', '#!capital_campaigns', video_title);
    }
});

NP.setVideo = function(id, url_root, name, url, title) {
  $('header, #wrapper h1').hide();
  $('#wrapper').css('max-width', '100%');
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
      e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.router.navigate("!cause_marketing/" + video_id);
      // set video data to store in model
      NP.setVideo(video_id, '/!cause_marketing', 'Cause Marketing', '#!cause_marketing', video_title);
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
      e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.router.navigate("!founders_syndrome/" + video_id);
      // set video data to store in model
      NP.setVideo(video_id, '/!founders_symdrome', 'Founders Syndrome & Succession Planning', '#!founders_syndrome', video_title);
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
      e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.router.navigate("!grant_writing/" + video_id);
      // set video data to store in model
      NP.setVideo(video_id, '/!grant_writing', 'Grant Writing', '#!grant_writing', video_title);
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
      e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.router.navigate("!fundraising_professionals/" + video_id);
      // set video data to store in model
      NP.setVideo(video_id, '/!fundraising_professionals', 'Fundraising Professionals', '#!fundraising_professionals', video_title);
    }
});

NP.ShowVideo = Backbone.Layout.extend({
    template: 'webinar',
    el: '#content',
    initialize: function() {
      // render webinar template
      this.render();
      /*$.getJSON('http://www.vimeo.com/api/oembed.json?url=http://vimeo.com/' + NP.videoModel.videoId + '&api=1&width=960&callback=?', function(data){
        $('#fluid_video').html(data.html); //puts an iframe embed from vimeo's json
        $('#fluid_video iframe').load(function(){
          player = document.querySelectorAll('iframe')[0];
          $('#fluid_video iframe').attr('id', NP.videoModel.videoId);
          $f(player).addEvent('ready', function(id){
            var vimeoVideo = $f(id);
          });
        });
      });*/
    }
});

$(document).ready(function() {
  
  NP.home = new NP.Home();
  NP.router = new NP.Router();

  // start router
  Backbone.history.start();
  
});