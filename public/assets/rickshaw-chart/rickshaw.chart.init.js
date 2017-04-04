/**
* Theme: Velonic Admin Template
* Author: Coderthemes
* Module/App: RickshawChart Application
*/

!function($) {
    "use strict";

    var RickshawChart = function() {
        this.$body = $("body")
    };

    RickshawChart.prototype.createLinetoggleGraph = function(selector, height, colors, names) {
      // set up our controller series with 50 random controller points

      var seriesData = [ [], [] ];
      var random = new Rickshaw.Fixtures.RandomData(150);

      for (var i = 0; i < 150; i++) {
        random.addData(seriesData);
      }

      // instantiate our graph!

      var graph = new Rickshaw.Graph( {
        element: document.getElementById(selector),
        height: height,
        renderer: 'line',
        series: [
          {
            color: colors[0],
            data: seriesData[0],
            name: names[0]
          }, {
            color: colors[1],
            data: seriesData[1],
            name: names[1]
          }
        ]
      } );

        graph.render();


      var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph,
        formatter: function(series, x, y) {
          var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
          var swatch = '<span class="detail_swatch" style="background-color: #000' + series.color + '"></span>';
          var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
          return content;
        }
      } );
    },

    //initializing various charts and components
    RickshawChart.prototype.init = function() {
      //live statics
      var seriesData = [ [], [], [], [], [], [], [], [], [] ];
      var random = new Rickshaw.Fixtures.RandomData(200);

      for (var i = 0; i < 100; i++) {
          random.addData(seriesData);
      }


      //create Line-Toggle graph
      var height = [250];
      var LineTcolors = ['#34c73b', '#3960d1'];
      var names = ['New York', 'London'];
      //this.createLinetoggleGraph("linetoggle", height, LineTcolors, names);
      this.createLinetoggleGraph("linetoggle2", height, LineTcolors, names);
    },

    //init dashboard
    $.RickshawChart = new RickshawChart, $.RickshawChart.Constructor = RickshawChart
    
}(window.jQuery),

//initializing dashboad2
function($) {
    "use strict";
    $.RickshawChart.init()
}(window.jQuery);







