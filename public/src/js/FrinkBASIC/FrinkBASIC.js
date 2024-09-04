///////////////////////////////////////////////////////////
//  FrinkBASIC/FrinkBASIC.js                             //
///////////////////////////////////////////////////////////
//
//
//

    import * as Timer from "./src/Timer.js";

    import { LoadScript } from "./src/LoadScript.js";
    import { Namespaces } from "./src/Namespaces.js";
    import { Tokeniser } from "./src/Tokeniser.js";
    import { TokenFilters } from "./src/TokenFilters.js";
    import { Resolver } from "./src/Resolver.js";
    import { StandardIO } from "./src/StandardIO.js";

    import { Display } from "./src/Display.js";


    export const FrinkBASIC = (

        objConfigure = {}

    ) => {

        const   __namespaces = Namespaces();
        const   __tokeniser = Tokeniser();
        const   __tokenFilters = TokenFilters(__namespaces);
        const   __resolver = Resolver();
    
        const   __script_name = [];
        const   __script_data = [];

        const   __script_code = {};
        let     __script_line = 0;

        let     __el = false;

        let     __exec_timeout_id = false;

        let     __standardIO = false;
        
        const   __if_stack = [];

        let     __last_instruction = '';
        let     __system_timeslice = 1;


///////////////////////////////////////////////////////////
//  __check_config()                                     //
///////////////////////////////////////////////////////////
//
        const   __check_config = (
            option,
            value = false
        ) => {

            if (! objConfigure.hasOwnProperty(option)) {
                if (value === false) 
                    throw new Error(`Error: The objConfigure object requires a ${option} property`);
                objConfigure[option] = value;
            }

        };


///////////////////////////////////////////////////////////
//  __standard_env()                                     //
///////////////////////////////////////////////////////////
//
        const   __standard_env = () => {

            __namespaces.set_value('display.rows', objConfigure['display']['rows']);
            __namespaces.set_value('display.cols', objConfigure['display']['cols']);
            __namespaces.set_value('display.width', objConfigure['width']);
            __namespaces.set_value('display.height', objConfigure['height']);
            __namespaces.set_value('display.cell_width', objConfigure['display']['cell_width']);
            __namespaces.set_value('display.cell_height', objConfigure['display']['cell_height']);
            __namespaces.set_value('display.font', objConfigure['font_family']);
            __namespaces.set_value('display.font_size', objConfigure['font_size']);
            __namespaces.set_value('display.color', '#FFF');
            __namespaces.set_value('display.backgroundColor', objConfigure['display_background']);
            __namespaces.set_value('display.cell_color', objConfigure['cell_color']);
            __namespaces.set_value('display.cell_background', objConfigure['cell_background']);

            __namespaces.set_value('system.timeslice', objConfigure['timeslice']);
            __namespaces.set_value('system.print_timer', objConfigure['print_timer']);

        };


///////////////////////////////////////////////////////////
//  __build_display()                                    //
///////////////////////////////////////////////////////////
//
        const   __build_display = () => {

            __el = document.getElementById(objConfigure['target_id']);

            if (__el === null)
                throw new Error(`Error: Target element ${objConfigure['target_id']} doesn't exist`);

            objConfigure['element'] = __el;
            const   __display = Display(objConfigure);

            objConfigure['display'] = __display.display;

            __standard_env();

        };


///////////////////////////////////////////////////////////
//  __load_scripts()                                     //
///////////////////////////////////////////////////////////
//
        const   __load_scripts = () => {

            for (let script_no = 0; script_no < objConfigure['scripts'].length; script_no++) {
                const   script_name = objConfigure['scripts'][script_no];

                if (__script_name.includes(script_name))
                    throw new Error(`Error: Script ${script_name} included more than once`);

                __script_name.push(script_name);

                const   __load_script = LoadScript(
                    window.__base_url,
                    objConfigure['path'],
                    script_name,
                    script_data => {
                        __script_data.push(script_data);

                        if ((script_no + 1) === objConfigure['scripts'].length)
                            __compile_scripts();
                    }
                );
            }

        };


///////////////////////////////////////////////////////////
//  __handle_assignment()                                //
///////////////////////////////////////////////////////////
//
        const   __handle_assignment = (
            tokens,
            token_start
        ) => {

            if ((token_start + 2) >= tokens.length)
                window.__file_error(tokens, `Unexpected '=' token`);

            console.log(`ASSIGNMNET = ${tokens}`)
            const   __params = tokens[token_start].split(':');

            let     __namespace = false;
            let     __label = false;

            if (__params.length === 1)
                __label = __params[0];
            else {
                if (__params.length > 2)
                    window.__file_error(tokens, `Unexpected token '${__params[2]}'`);
                __namespace = __params[0];
                __label = __params[1];
            }

            if (typeof tokens[(token_start + 2)] === 'number')
                tokens[(token_start + 2)] = tokens[(token_start + 2)].toString();
            const   __result = __namespaces.set_value(
                __label,
                tokens[(token_start + 2)],
                __namespace
            );

            if (typeof __result === 'string')
                window.__file_error(tokens, __result);

        };


///////////////////////////////////////////////////////////
//  __create_namespace()                                 //
///////////////////////////////////////////////////////////
//
        const   __create_namespace = (
            tokens,
            token_start
        ) => {

            const   __result = __namespaces.new_namespace(
                tokens[token_start]
            );

            if (typeof __result === 'string')
                window.__file_error(tokens, __result);

        };


///////////////////////////////////////////////////////////
//  __use_namespace()                                    //
///////////////////////////////////////////////////////////
//
        const   __use_namespace = (
            tokens,
            token_start
        ) => {

            const   __result = __namespaces.use_namespace(
                tokens[token_start]
            );

            if (typeof __result === 'string')
                window.__file_error(tokens, __result);

            return true;

        };


///////////////////////////////////////////////////////////
//  __delete_namespace()                                 //
///////////////////////////////////////////////////////////
//
        const   __delete_namespace = (
            tokens,
            token_start
        ) => {

            let     __result;
            const   __params = tokens[token_start].split(':');

            if (__params.length > 2)
                return `Unexpected token '${__params[2]}'`;

            if (__params.length === 1) {
                __result = __namespaces.delete_namespace(
                    tokens[token_start]
                );
            }
            else {
                __result = __namespaces.delete_value(
                    __params[1],
                    __params[0]
                );
            }

            if (typeof __result === 'string')
                window.__file_error(tokens, __result);

            return true;

        };


///////////////////////////////////////////////////////////
//  __evaluate_if()                                      //
///////////////////////////////////////////////////////////
//
        const   __evaluate_if = tokens => {

            if (tokens.length < 5)
                return `The if instruction expects at least two parameters, hmm-hey!`;

            if (typeof tokens[3] === 'string')
                tokens[3] = parseInt(tokens[3]);

            if (tokens[3] === 0)
                return false;

            return true;

        };


///////////////////////////////////////////////////////////
//  __exec_line()                                        //
///////////////////////////////////////////////////////////
//
        const   __exec_line = (
            lines,
            line_no
        ) => {

            if (line_no >= lines.length) {
                clearInterval(__exec_timeout_id);
                __exec_timeout_id = false;
                window.__log(`+ Why-y-y, the application appears to have terminated normally, good glayvin!`);
                return;
            }

            let     __tokens = [];

            __script_code[lines[line_no]].forEach(line => {
                __tokens.push(line);
            });

            let     __result = __tokenFilters.filter_all(objConfigure, __tokens);

            if (typeof __result === 'string')
                window.__file_error(__tokens, __result);

            const   __resolved = __resolver.parse_expr(__tokens);
            if (typeof __resolved === 'string')
                window.__file_error(__tokens, __resolved)
            __tokens = __resolved;

            window.__log(`+- Executing line ${lines[line_no]}: ${__script_code[lines[line_no]]}`);

            if (__tokens.length > 3 && __tokens[3] === '=') {
                const   __result = __handle_assignment(__tokens, 2);
                if (typeof __result === 'string')
                    window.__file_error(__tokens, __result);
                __last_instruction = 'assignment';
                return;
            }

            if (__tokens[2] === 'if') {
                const   __result = __evaluate_if(__tokens);
                if (typeof __result === 'string')
                    window.__file_error(__tokens, __result);
                __tokens.splice(2, 2);
                __if_stack.push(__result);
                __last_instruction = 'if';
                if (! __result)
                    return;
            }

            if (__tokens[2] === 'else') {
                if (__last_instruction !== 'if')
                    window.__file_error(__tokens, `Seems we have an 'else' with no if!`);
                __tokens.splice(2, 1);
                if (__if_stack.pop())
                    return;
            }

            if (__tokens[2] === 'goto') {
                if (__tokens.length !== 4)
                    window.__file_error(__tokens, `The goto instruction expects a single parameter`);
                if (! /^[0-9]+$/.test(__tokens[3]) || ! lines.includes(__tokens[3]))
                    window.__file_error(__tokens, `'${__tokens[3]}' is not a valid line number`);
                __last_instruction = 'goto';
                return __tokens[3];
            }

            if (__tokens[2] === 'new') {
                if (__tokens.length != 4)
                    window.__file_error(__tokens, "The 'new' keyword expects exactly one parameter for crying out glayvin!");
                __last_instruction = 'new';
                return __create_namespace(__tokens, 3);
            }

            if (__tokens[2] === 'use') {
                if (__tokens.length != 4)
                    window.__file_error(__tokens, "The 'use' keyword expects exactly one parameter for crying out glayvin!");
                __last_instruction = 'use';
                return __use_namespace(__tokens, 3);
            }

            if (__tokens[2] === 'delete') {
                if (__tokens[2] === 'standard')
                    window.__file_error(__tokens, "You can't just delete the standard namespace - a concept so ridiculous it makes me want to laugh out glayvin!");
                if (__tokens.length != 4)
                    window.__file_error(__tokens, "The 'delete' keyword expects exactly one parameter for crying out glayvin!");
                __last_instruction = 'delete';
                return __delete_namespace(__tokens, 3);
            }

            if (__tokens[2] === 'sleep') {
                if (__tokens.length !== 4)
                    window.__file_error(__tokens, `The sleep instruction requires exactly one parameter`);
                if (! /^[0-9]+$/.test(__tokens[3]))
                    window.__file_error(__tokens, `The sleep instruction requires a numeric value, I have no idea what '${__tokens[3]}' even is, maybe you forgot to carry the one!`);
                objConfigure['sleep_cycles'] = parseInt(__tokens[3]);
                __last_instruction = 'sleep';
                return true;
            }

            if (__tokens[2] === 'exit') {
                clearInterval(__exec_timeout_id);
                __exec_timeout_id = false;
                objConfigure['system_status'] = 'terminated';
                window.__log(`+ Why-y-y, the application appears to have terminated normally, good glayvin!`);
                return;
            }

            if (! __standardIO.hasOwnProperty(__tokens[2]))
                window.__file_error(__tokens, `'${__tokens[2]}' is not a known instruction or function`);

            __result = __standardIO[__tokens[2]](__standardIO, __tokens);
        
            if (typeof __result === 'string')
                return __result;

            if (objConfigure.hasOwnProperty('error_message'))
                window.__file_error(__tokens, objConfigure['error_message']);

            return true;

        };


///////////////////////////////////////////////////////////
//  __exec_code()                                        //
///////////////////////////////////////////////////////////
//
        const   __exec_code = (
            line = false
        ) => {

            const   __lines = Object.keys(__script_code);
            let     __line = 0;

            if (line !== false)
                __line = line;

            if (! objConfigure.hasOwnProperty('namespaces'))
                objConfigure['namespaces'] = __namespaces;
            if (! objConfigure.hasOwnProperty('standardIO'))
                objConfigure['standardIO'] = __standardIO;
            if (__standardIO === false)
                __standardIO = StandardIO(objConfigure);

            window.__log(`Wel-l-l, it would appear that we have a script to run with the parsing and the executing and the outputting, and so on!`);
            window.__log(`+ We've got ${__lines.length} lines of FrinkBASIC to run, let's roll...`)
            
            __exec_timeout_id = setInterval(() => {
                const   __timeslice = __namespaces.get_value('system.timeslice');
                
                if (typeof __timeslice === 'string')
                    __system_timeslice = 1;
                else {
                    if (__timeslice.value !== __system_timeslice) {
                        __system_timeslice = __timeslice.value;
                        clearInterval(__exec_timeout_id);
                        return __exec_code(__line++);
                    }
                }

                const   __target = document.getElementById(objConfigure['page_id']);

                if (objConfigure.hasOwnProperty('sleep_cycles')) {
                    if (objConfigure['sleep_cycles'] > 0) {
                        objConfigure['sleep_cycles']--;
                        return;
                    }
                }

                if (
                    objConfigure['system_status'] === 'running' &&
                    __target.style.display !== "none" && 
                    __target.style.opacity === '0.99'
                ) {
                    const   __result = __exec_line(__lines, __line++);

                    if (typeof __result === 'string' && __last_instruction === 'goto') {
                        __line = parseInt(__lines.indexOf(__result));
                        console.log(`Going to line ${__line}`);
                    }
                }
            }, __system_timeslice);

        };


///////////////////////////////////////////////////////////
//  __compile_scripts()                                  //
///////////////////////////////////////////////////////////
//
        const   __compile_scripts = () => {

            __script_line = 0;

            for (let script_no = 0; script_no < __script_data.length; script_no++) {
                const   __lines = __tokeniser.parse_lines(
                    __script_name[script_no],
                    __script_data[script_no]
                );

                if (typeof __lines === 'string')
                    throw new Error(__lines);

                for (let line_no = 0; line_no < __lines.length; line_no++) {
                    const   __tokens = __lines[line_no];

                    if (__tokens.length < 3)
                        continue;

                    if (/^[0-9]+$/.test(__tokens[2])) {
                        __script_line = parseInt(__tokens[2]);
                        __tokens.splice(2, 1);
                    }

                    __script_code[__script_line++] = __tokens;
                }
            }

            if (objConfigure['run_mode'] === 'onload') {
                __exec_code();
            }

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise = () => {

            __check_config('scripts');
            __check_config('target_id');

            __check_config('base', 'localhost:3000');
            __check_config('path', '/public/projects/FrinkScripts');

            __check_config('font_family', 'VT323, monospace');
            __check_config('font_size', '22px');

            __check_config('display_color', 'rgba(64, 220, 140, 1)');
            __check_config('display_background', 'rgba(0, 0, 0, 0.25)');

            __check_config('cell_class', 'frink_cell');
            __check_config('cell_color', 'rgba(64, 220, 140, 1);');
            __check_config('cell_background', 'rgba(0, 0, 0, 0.25)');

            __check_config('system_status', 'running');
            __check_config('timeslice', 1);
            __check_config('run_mode', 'onload');
            __check_config('verbose', true);
            __check_config('print_timer', 1);

            console.log(objConfigure);
            window.__file_error = (
                tokens,
                error_message
            ) => {
                clearInterval(__exec_timeout_id);
                __exec_timeout_id = false;                
                throw new Error(`Good glayvin, there was an error in script ${tokens[0]} on line ${tokens[1]}: ${error_message}`);
            };

            window.__log = message => {
                if (objConfigure['verbose'])
                    console.log(message);
            };

            document.getElementById(objConfigure['target_id']).addEventListener(
                'click', (e) => {
                    objConfigure['print_timer'] = 0;
                    objConfigure['sleep_cycles'] = 0;
                }
            );

            __build_display();
            __load_scripts();

        };


        __initialise();


        return {

        };

    };

