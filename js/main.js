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
    //NP.home.render(); // render home template
  },

  campaign: function() {
    this.setDefaultStyle();
    // show capital campaign landing page

    NP.campaignView.render(); /*= new NP.CampaignView();*/
    //NP.showWebinarList('capital_campaigns'); 
  },
  marketing: function() {
    this.setDefaultStyle();
    // show cause marketing landing page
    NP.marketingView.render(); 
    //NP.showWebinarList('cause_marketing');
  },
  founders: function() {
    this.setDefaultStyle();
    // show founders syndrome landing page
    NP.foundersView.render(); 
    //NP.showWebinarList('founders_syndrome');
  },
  grant: function() {
    this.setDefaultStyle();
    // show grant writing landing page
    NP.grantView.render(); 
    //NP.showWebinarList('grant_writing');
  },
  fundraising: function() {
    this.setDefaultStyle();
    NP.fundraisingView.render();
    // show fundraising professionals landing page
    //NP.showWebinarList('fundraising_professionals');
  },
  showCampaign: function(id) {
    //this.navigate('#!capital_campaigns/' + id);
    //NP.videoModel.videoTitle = video_title;
    NP.setVideo(id, '/!capital_campaigns', 'Capital Campaigns', '#!capital_campaigns', NP.videoModel.videoTitle);
  },
  showMarketing: function(id) {
    //this.navigate('#!cause_marketing/' + id);
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
    //$('#content').empty();
    $('header, #wrapper h1').show();
    //$('#wrapper').css('max-width', '970px');
  }
});

NP.setDefaultStyle = function() {
  //$('#content').empty();
  $('header, #wrapper h1').show();
  //$('#wrapper').css('max-width', '970px');
};

NP.Home = Backbone.Layout.extend({
	template: 'home',
	el: '#content',
	events: {
		'mouseenter .np_slide': 'showOverlay',
		'mouseleave #overlay': 'hideOverlay'
    /*'click #capital_campaigns': 'campaign',
    'click #cause_marketing': 'marketing',
    'click #founders_syndrome': 'founders',
    'click #grant_writing': 'grant',
    'click #fundraising_professionals': 'fundraising'*/
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
    //NP.router.navigate("!capital_campaigns");
    NP.campaignView.render();
  },
  marketing: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    //NP.router.navigate("!cause_marketing");
    NP.marketingView.render(); 
  },
  founders: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    //NP.router.navigate("!founders_syndrome");
    NP.foundersView.render();
  },
  grant: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    //NP.router.navigate("!grant_writing");
    NP.grantView.render();
  },
  fundraising: function(e) {
    e.preventDefault();
    var webinar_title = $(e.currentTarget).attr('id');
    //NP.router.navigate("!fundraising_professionals");
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
      //'click #titles a': 'showPlayer'
    },
    initialize: function() {
      //NP.router.navigate("!capital_campaigns");
      //this.render();
    },
    showIcon: function(e) {
      e.preventDefault();
      $(e.currentTarget).before('<img src="images/play.png" class="play" />');
    },
    hideIcon: function(e) {
      e.preventDefault();
      $(e.currentTarget).parent().find('img').remove();
    }
    /*showPlayer: function(e) {
      //e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      //NP.router.navigate("!" + this.template + "/" + video_id);
      //NP.router.navigate("!capital_campaigns/" + video_id);
      // set video data to store in model
      NP.videoModel.videoTitle = video_title;
      NP.router.showCampaign(video_id);
      //NP.setVideo(video_id, '/!capital_campaigns', 'Capital Campaigns', '#!capital_campaigns', video_title);
    }*/
});

NP.setVideo = function(id, url_root, name, url, title) {
  $('header, #wrapper h1').hide();
  //$('#wrapper').css('max-width', '100%');
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
      //this.render();
    },
    showPlayer: function(e) {
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      //NP.router.navigate("!" + this.template + "/" + video_id);
      NP.videoModel.videoTitle = video_title;
      NP.router.showMarketing(video_id);
      //NP.setVideo(video_id, '/!cause_marketing', 'Cause Marketing', '#!cause_marketing', video_title);
    }
});

NP.FoundersView = Backbone.Layout.extend({
    template: 'founders_syndrome',
    el: '#content',
    /*events: {
      'click #titles a': 'showPlayer'
    },*/
    initialize: function() {
      //this.render();
    }/*,
    showPlayer: function(e) {
      e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      //NP.router.navigate("!founders_syndrome/" + video_id);
      //NP.router.navigate("!" + this.template + "/" + video_id);
      NP.videoModel.videoTitle = video_title;
      NP.router.showFounders(video_id);
      //NP.setVideo(video_id, '/!founders_symdrome', 'Founders Syndrome & Succession Planning', '#!founders_syndrome', video_title);
    }*/
});

NP.GrantView = Backbone.Layout.extend({
    template: 'grant_writing',
    el: '#content',
    /*events: {
      'mouseenter #titles a': 'showIcon',
      'mouseleave #titles a': 'hideIcon',
      'click #titles a': 'showPlayer'
    },*/
    initialize: function() {
      //this.render();
    },
    /*showPlayer: function(e) {
      e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.router.navigate("!grant_writing/" + video_id);
      // set video data to store in model
      NP.setVideo(video_id, '/!grant_writing', 'Grant Writing', '#!grant_writing', video_title);
    }*/
});

NP.FundraisingView = Backbone.Layout.extend({
    template: 'fundraising_professionals',
    el: '#content',
    /*events: {
      'click #titles a': 'showPlayer'
    },*/
    initialize: function() {
      //this.render();
    },
    /*showPlayer: function(e) {
      e.preventDefault();
      var video_id = $(e.currentTarget).attr('id');
      var video_title = $(e.currentTarget).attr('title');
      NP.router.navigate("!fundraising_professionals/" + video_id);
      // set video data to store in model
      NP.setVideo(video_id, '/!fundraising_professionals', 'Fundraising Professionals', '#!fundraising_professionals', video_title);
    }*/
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