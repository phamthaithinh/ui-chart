/**
 * Binds a Google Chart iframe to <div> elements.
 */
angular.module('ui.chart', [])
  .value('uiChartConfig', {})
  .factory('$chart', ['uiChartConfig', '$rootScope', function (uiChartConfig, $rootScope) {
    var charts = [];
    return {
      convertArrayToTable: function (type, data) {
        if (type === 'PieChart') {
          return google.visualization.arrayToDataTable(data);
        }
      },
      drawChart: function (chart) {
        var type = chart.type,
          target = chart.target,
          data = this.convertArrayToTable(type, chart.data),
          options = chart.options;

        $rootScope.$broadcast('$draw:chart', [type, target, data, options]);
      },
      setChart: function (obj) {
        for (var i = 0; i < charts.length; i++) {
          if (charts[i].pd.id === obj.pd.id) {
            charts[i] = obj;
            return;
          }
        }

        charts.push(obj);
      }
    }
  }])
  .directive('uiChart', ['uiChartConfig', function (uiChartConfig) {
    var generatedIds = 0;
    return {
      replace: true,
      restrict: 'EAC',
      template: '<div></div>',
      link: function (scope, elem, attrs) {
        var chart;

        if (!attrs.id) {
          attrs.$set('id', 'uiChart' + generatedIds++);
        }

        scope.$on('$draw:chart', function (e, obj) {
          var type = obj[0],
            target = obj[1],
            data = obj[2],
            options = obj[3];

          if (target === attrs.id) {
            chart = new google.visualization[type](elem[0]);
            chart.draw(data, options);
          }
        });
      }
    };
  }]);