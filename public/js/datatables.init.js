/**
* Theme: Flacto Admin Template
* Author: Coderthemes
* Component: Datatable
* 
*/

var handleDataTableButtons = function () {
    "use strict";
    0 !== $("#table_networks").length && $("#table_networks").DataTable({
        dom: "Bfrtip",
        buttons: [{extend: "copy", className: "btn-sm"}, {extend: "csv", className: "btn-sm"}, {
            extend: "excel",
            className: "btn-sm"
        }, {extend: "pdf", className: "btn-sm"}, {extend: "print", className: "btn-sm"}],
        responsive: !0
    });

},
handleDataTableButtons2 = function () {
    "use strict";
    0 !== $("#table_sensors").length && $("#table_sensors").DataTable({
        retrieve: true,
        dom: "Bfrtip",
        buttons: [{extend: "copy", className: "btn-sm"}, {extend: "csv", className: "btn-sm"}, {
            extend: "excel",
            className: "btn-sm"
        }, {extend: "pdf", className: "btn-sm"}, {extend: "print", className: "btn-sm"}],
        responsive: !0
    })
}, TableManageButtons = function () {
    "use strict";
    return {
        table_network: function () {
            handleDataTableButtons()
        },
        table_sensor: function () {
            handleDataTableButtons2()
        }
    }
}();