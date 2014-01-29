"use strict";

var fopen = Module.cwrap('fopen', 'number', ['string','string']);

var xmp_create_context = Module.cwrap('xmp_create_context', 'number', []);
var xmp_load_module = Module.cwrap('xmp_load_module', 'number', ['number', 'string']);
var xmp_start_player = Module.cwrap('xmp_start_player', 'number', ['number', 'number', 'number']);
var xmp_play_frame = Module.cwrap('xmp_play_frame', 'number', ['number']);
var xmp_end_player = Module.cwrap('xmp_end_player', 'number', ['number']);
var xmp_release_module = Module.cwrap('xmp_release_module', 'number', ['number']);
var xmp_end_player = Module.cwrap('xmp_end_player', 'number', ['number']);


var malloc = Module.cwrap('malloc', 'number', ['number']);
var c_free = Module.cwrap('free', 'number', ['number']);

function wrap_mi_p(name) {
    return Module.cwrap(name, 'number', ['number']);
}

var xmp_js__mi_get_loop_count = wrap_mi_p('xmp_js__mi_get_loop_count');
var xmp_js__mi_get_buffer  = wrap_mi_p('xmp_js__mi_get_buffer');
var xmp_js__mi_get_buffer_size  = wrap_mi_p('xmp_js__mi_get_buffer_size');

function my_xmp_play(append_cb) {
    var c = xmp_create_context();

    if (xmp_load_module(c, '/mods/yonqatan.mod') != 0) {
        return 1;
    }

    xmp_start_player(c, 44100, 0);

    var mi_p = malloc(1024);

    function as_hex(i) {
        return "0123456789ABCDEF".substring(i, i+1);
    }

    (function () {
        while (xmp_play_frame(c) == 0) {
            xmp_get_frame_info(c, mi_p);

            if (xmp_js__mi_get_loop_count(mi_p) > 0)
            {
                return;
            }

            var buf = xmp_js__mi_get_buffer(mi_p);
            var buf_size = xmp_js__mi_get_buffer_size(mi_p);

            var out_s = '';
            for (var i = 0 ; i < buf_size ; i++) {
                var mychar = getValue(buf + i, 'i8');
                out_s += "\\x" + as_hex(mychar >> 4) + as_hex(my_char & 0xF);
            }
            append_cb(out_s);
        }
    })();
    xmp_end_player(c);
    xmp_release_module(c);
    xmp_free_context(c);

    c_free( mi_p );
    return 0;
}

var xmp_out = $('#xmp_output');
my_xmp_play(function (s) {
    xmp_out.val(xmp_out.val() + s);

    return;
});
