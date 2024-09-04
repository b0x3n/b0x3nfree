///////////////////////////////////////////////////////////
//  FrinkBASIC/src/TokenFilters.js                       //
///////////////////////////////////////////////////////////
//
//
//


    export const TokenFilters = namespaces => {


///////////////////////////////////////////////////////////
//  __translate_var()                                    //
///////////////////////////////////////////////////////////
//
        const   __translate_var = (
            tokens,
            token_no
        ) => {

            let     __params = tokens[token_no].split(':');

            let     __namespace = false;
            let     __label = '';

            if (__params.length === 1)
                __label = __params[0];
            else {
                __namespace = __params[0];
                for (let param_no = 1; param_no < __params.length; param_no++)
                    __label += __params[1];
            }

            if (
                __namespace !== false && 
                (__namespace.substring(0, 1) === '$' || __namespace.substring(0, 1) === '#')
            )
                __namespace = __namespace.substring(1);

            if (
                __label !== false && 
                (__label.substring(0, 1) === '$' || __label.substring(0, 1) === '#')
            )
                __label = __label.substring(1);

            const   __result = namespaces.get_value(
                __label,
                __namespace
            );

            if (typeof __result === 'string')
                return __result;

            console.log(`>>> >>> >>> >>> >>> >>> >>> WRITING RESULT ${__result['value']}`)
            tokens[token_no] = __result['value'];

            return true;

        };


        const   __strip_strings = tokens => {

            for (let token_no = 0; token_no < tokens.length; token_no++) {
                if (
                    tokens[token_no].substring(0, 1) === '"' ||
                    tokens[token_no].substring(0, 1) === "'"
                ) 
                    tokens[token_no] = tokens[token_no].substring(1, (tokens[token_no].length - 1));
                    
                if (tokens[token_no].substring(0, 1) === '$') {
                    const   __result = __translate_var(tokens, token_no);
                    if (typeof __result === 'string')
                        return __result;
                }

                if (typeof tokens[token_no] !== 'string')
                    continue;

                if (tokens[token_no].substring(0, 1) === '#') {
                    const   __result = __translate_var(tokens, token_no);
                    if (typeof __result === 'string')
                        return __result;
                    if (typeof tokens[token_no] === 'string')
                        tokens[token_no] = tokens[token_no].length;
                }
            }

        };


///////////////////////////////////////////////////////////
//  _filter_all()                                        //
///////////////////////////////////////////////////////////
//
        const   _filter_all = (
            objConfigure,
            tokens
        ) => {

            let     __brace = 0;

            namespaces = objConfigure['namespaces'];

            __strip_strings(tokens);

            for (let token_no = (tokens.length - 1); token_no >= 0; token_no--) {
                if (tokens[token_no] === ')')
                    __brace++;
                if (tokens[token_no] === '(')
                    __brace--;

                // if (
                //     tokens[token_no].substring(0, 1) === '"' ||
                //     tokens[token_no].substring(0, 1) === "'"
                // ) 
                //     tokens[token_no] = tokens[token_no].substring(1, (tokens[token_no].length - 1));
                    

                if (tokens[token_no] === '.') {
                    if ((token_no - 1) > 2 && (token_no + 1) < tokens.length) {
                        tokens[(token_no - 1)] += `.${tokens[(token_no + 1)]}`;
                        tokens.splice(token_no, 2);
                        console.log(`Build string ${tokens[(token_no - 1)]}`);
                    }
                }

                if (tokens[token_no] === '+' && ! __brace) {
                    if ((token_no - 1) > 2 && (token_no + 1) < tokens.length) {
                        tokens[(token_no - 1)] += tokens[(token_no + 1)];
                        tokens.splice(token_no, 2);
                        console.log(`Build string ${tokens[(token_no - 1)]}`);
                    }
                }
            }

            return tokens;

        };


        return {

            filter_all: _filter_all

        };

    };

