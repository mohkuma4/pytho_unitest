function update_log_table_from_form_element(form_element){
    var test_id = get_test_id_from_element($(form_element).closest('form'), '_form');
    var corresponding_table_element = $('#' + test_id + '_log_table_content');
    update_log_table(corresponding_table_element);
}

function update_log_table(log_table_element){
    // Update the given log table on the results page
    var test_id = get_test_id_from_element(log_table_element, '_log_table_content');
    var start = parseFloat(log_table_element.attr('data-start'));
    var stop = parseFloat(log_table_element.attr('data-stop'));
    var levels = get_levels_from_select($('#' + test_id + '_level_select'));
    var loggers = get_loggers_from_checked_boxes($('#' + test_id + '_logger_buttons'));
    var filename = "run_data/log_info.json";
    var d = MochiKit.Async.loadJSONDoc(filename);
    var fail = function(err){
        alert("Failed to load " + file + ": " + err);
    }
    var success = function(data){
        var ranges = data["ranges"];
        var candidate_log_files = [];
        var j;
        for (j=0; j < ranges.length; j++){
            var log_start = ranges[j][1];
            var log_stop = ranges[j][2];
            if (start >= log_start && start <= log_stop ||
                stop >= log_start && stop <= log_stop ||
                start <= log_start && stop >= log_stop){
                candidate_log_files.push(ranges[j][0]);
            }
        }
        return parse_logs(candidate_log_files, start, stop, levels, loggers);
    }
    d.addCallbacks(success, fail);
    d.addCallback(function(log_lines){
        write_log_table(log_lines, log_table_element);
        });
}

function parse_logs(candidate_log_files, start, stop, levels, loggers){
    // Parse the given log files to retrieve relevant log lines
    var deferreds = [];
    var j;
    for (j=0; j < candidate_log_files.length; j++){
        var filename = 'run_data/' + candidate_log_files[j]
        if (!filename){continue;}
        var d = MochiKit.Async.loadJSONDoc(filename);
        d.addErrback(function(err){
                alert("Failed to load " + filename + ": " + err);
                return err;
            });
        deferreds.push(d)
    }
    var dl = new MochiKit.Async.DeferredList(deferreds, false, false, true);
    var filter_log_data = function(json_blocks){
        var filtered_log_lines = [];
        var block;
        for (block=0; block < json_blocks.length; block++){
            var result = parse_json_block(json_blocks[block], start, stop,
                levels, loggers);
            // Extend filtered_log_lines with relevant log lines:
            filtered_log_lines.push.apply(filtered_log_lines, result);
        }
        //filtered_log_lines.sort(function(a, b){return compare(a[0], b[0]);});
        return filtered_log_lines;
    }
    dl.addCallback(filter_log_data);
    return dl;
}

function parse_json_block(json_block, start, stop, levels, loggers){
    // Parses a single block of json (from single file) containing log lines
    var filtered_log_lines = []
    if (json_block[0]){
        var log_lines = json_block[1];
        var line;
        for (line=0; line < log_lines.length; line++){
            if (log_lines[line][0] >= start && log_lines[line][0] <= stop &&
                include_log_line(log_lines[line], levels, loggers)){
                filtered_log_lines.push(log_lines[line]);
            }
        }
    }
    return filtered_log_lines;
}

function include_log_line(line, levels, loggers){
    // Whether or not to include the given line based on the levels and loggers
    // criteria
    var level, logger;
    for (level=0; level < levels.length; level++){
        if (levels[level] === line[2]){
            for (logger=0; logger < loggers.length; logger++){
                if (loggers[logger] === line[1]){
                    return true;
                }
            }
        }
    }
    return false;
}

function write_log_table(log_lines, log_table_element){
    var row_list = [];
    var TR = MochiKit.DOM.TR;
    var TD = MochiKit.DOM.TD;
    var BR = MochiKit.DOM.BR;
    var make_line_item = function(single_line_of_text){
        single_line_of_text = single_line_of_text.replace(" ", '\xa0');
        return [single_line_of_text, BR(null)];
    }
    var line;
    for (line=0; line < log_lines.length; line++){
        var level = log_lines[line][2];
        if (level == 'CRITICAL' || level == 'ERROR'){
            var class_json = {'class': 'error'};
        } else if (level == 'WARNING'){
            var class_json = {'class': 'warning'};
        } else {
            var class_json = null;
        }
        var tr = TR(class_json,
            TD(null, log_lines[line][1]),
            TD(null, level),
            TD(null, log_lines[line][3]),
            TD(null, MochiKit.Iter.imap(
                make_line_item, log_lines[line][4].split(/\r|\r\n|\n/g))));
        row_list.push(tr)
    }
    if (row_list.length == 0){
        var tr = TR(null,
            TD({'colspan': '4'}, "There are no ranges to show..."));
        row_list.push(tr);
    }
    $('tbody', log_table_element).empty();
    $('tbody', log_table_element).append(row_list);
}

function get_loggers_from_checked_boxes(button_group_element){
    var loggers = [];
    $('.btn', button_group_element).each(
        function(i, element){
            if ($(element).hasClass('active')){
                loggers.push($(element).val());
            }
        });
    return loggers;
}

function get_levels_from_select(select_element){
    return get_levels($(select_element).val());
}

function get_levels(most_verbose_level){
    var loglevels = ["CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"];
    var ret = [];
    var j;
    for (j=0; j < loglevels.length; j++){
        ret.push(loglevels[j]);
        if (loglevels[j] === most_verbose_level){
            return ret;
        }
    }
    return ret;
}

function on_log_level_change(select_element){
    // Make all log level selects the same value
    var loglevel = $(select_element).val();
    $('select.loglevel').val(loglevel);
    // Update the local log table
    update_log_table_from_form_element(select_element);
}

function on_logger_button_click(log_checkbox_element){
    // Do bootstrap's button toggle (manual so we can be sure of state)
    $(log_checkbox_element).button('toggle');
    // Make all log checkbox elements of this name the same state
    var logger_name = $(log_checkbox_element).val();
    var all_named_logger_buttons = $('.logger_button[value="' + logger_name + '"]');
    var checked = $(log_checkbox_element).hasClass('active');
    if (checked){
        all_named_logger_buttons.addClass('active');
    } else {
        all_named_logger_buttons.removeClass('active');
    }
    // Update the local log table
    update_log_table_from_form_element(log_checkbox_element);
}

function on_all_click(logger_control_button){
    // For now, update all the logger buttons in the document. We might want to
    // do this differently in future if we want to have separate state for
    // each test result.
    $('.logger_button').addClass('active');
    update_log_table_from_form_element(logger_control_button);
}

function on_none_click(logger_control_button){
    // For now, update all the logger buttons in the document. We might want to
    // do this differently in future if we want to have separate state for
    // each test result.
    $('.logger_button').removeClass('active');
    update_log_table_from_form_element(logger_control_button);
}

function on_accordion_heading_click(accordion_heading_element){
    var test_id = get_test_id_from_element(accordion_heading_element, '_accordion_heading'); 
    var corresponding_table_element = $('#' + test_id + '_log_table_content');
    update_log_table(corresponding_table_element);
}

function on_page_load(){
    var test_id = get_test_id_from_element($('.accordion-body.collapse.in'), '_content');
    var corresponding_table_element = $('#' + test_id + '_log_table_content');
    update_log_table(corresponding_table_element);
}

function get_test_id_from_element(element, suffix){
    var element_id = $(element).attr('id');
    return element_id.substring(0, element_id.indexOf(suffix));
}

