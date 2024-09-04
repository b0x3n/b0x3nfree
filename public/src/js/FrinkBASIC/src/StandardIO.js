///////////////////////////////////////////////////////////
//  FrinkBASIC/src/StandardIO.js                         //
///////////////////////////////////////////////////////////
//
//
//


    import { Cursor } from "./StandardIO/Cursor.js";
    import { Print } from "./StandardIO/Print.js";
    import { Input } from "./StandardIO/Input.js";

    export const StandardIO = objConfigure => {

        const   __modules = [];
        let     _methods = {};


        const   __initialise = () => {

            __modules.push(Cursor(objConfigure));
            __modules.push(Print(objConfigure));
            __modules.push(Input(objConfigure));

            __modules.forEach(__module => {
                _methods = { ..._methods, ...__module };
            });

        };


        __initialise();


        return _methods;

    };
