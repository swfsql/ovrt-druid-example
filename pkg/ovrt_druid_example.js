
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_24(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h634b3bf1cbbcbf98(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_27(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h634b3bf1cbbcbf98(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_30(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h634b3bf1cbbcbf98(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_33(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h634b3bf1cbbcbf98(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_36(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h884d61234f53f2a1(arg0, arg1);
}

/**
*/
export function wasm_main() {
    wasm.wasm_main();
}

/**
* Spawn a new overlay.
*
* This is private/hidden for safety. See `spawn_overlay` for more info.
*
* Returns an uid.
* @param {number} uid
*/
export function SpawnOverlayOvrtSysCallback(uid) {
    wasm.SpawnOverlayOvrtSysCallback(uid);
}

/**
* Returns a list of open windows and their handles.
* (If user has this option enabled).
*
* Returns `windowTitles`.
* @param {string} window_titles
*/
export function GetWindowTitlesOvrtSysCallback(window_titles) {
    var ptr0 = passStringToWasm0(window_titles, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.GetWindowTitlesOvrtSysCallback(ptr0, len0);
}

/**
* (Used for SetContents monitorId).
*
* Returns `monitorCount` (how many monitors are connected).
* @param {number} monitor_count
*/
export function GetMonitorCountOvrtSysCallback(monitor_count) {
    wasm.GetMonitorCountOvrtSysCallback(monitor_count);
}

/**
* Get `OVROverlayTransform` of a specified overlay.
*
* Returns `transformInfo`.
* @param {string} transform_info
*/
export function GetOverlayTransformOvrtSysCallback(transform_info) {
    var ptr0 = passStringToWasm0(transform_info, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.GetOverlayTransformOvrtSysCallback(ptr0, len0);
}

/**
* Get type of overlay.
* (Browser, window capture, desktop capture).
*
* Returns `type`.
* @param {number} type_
*/
export function GetOverlayTypeOvrtSysCallback(type_) {
    wasm.GetOverlayTypeOvrtSysCallback(type_);
}

/**
* Get bounds of overlay bounding box.
* (Refer to Unity documentation 'Bounds' section).
*
* Returns `bounds`.
* @param {string} bounds
*/
export function GetOverlayBoundsOvrtSysCallback(bounds) {
    var ptr0 = passStringToWasm0(bounds, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.GetOverlayBoundsOvrtSysCallback(ptr0, len0);
}

/**
* Get finger curl positions.
*
* Returns `curls`.
* (Returns 0 for all values if user is in Simulator Mode).
* @param {string} curls
*/
export function GetFingerCurlsOvrtSysCallback(curls) {
    var ptr0 = passStringToWasm0(curls, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.GetFingerCurlsOvrtSysCallback(ptr0, len0);
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}
/**
* Sends HMD and left/right controller position and rotation, also shows the active controller.
* (Needs to be enabled per overlay, refer to API above).
* @param {string} device_info
*/
export function DevicePositionUpdate(device_info) {
    var ptr0 = passStringToWasm0(device_info, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.DevicePositionUpdate(ptr0, len0);
}

/**
* Receives messages from other browser instances.
* @param {string} message
*/
export function ReceiveMessage(message) {
    var ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.ReceiveMessage(ptr0, len0);
}

/**
* If the user is interacting with the current overlay.
* (Mouse over).
* @param {boolean} is_interacting
*/
export function InteractionStateChanged(is_interacting) {
    wasm.InteractionStateChanged(is_interacting);
}

/**
* Called when an overlay is spawned.
* @param {number} uid
*/
export function OverlayOpened(uid) {
    wasm.OverlayOpened(uid);
}

/**
* Called when an overlay is closed.
* @param {number} uid
*/
export function OverlayClosed(uid) {
    wasm.OverlayClosed(uid);
}

/**
* Called when an overlay is moved or its size changes.
* (Needs to be enabled per overlay, refer to API above).
* @param {number} uid
* @param {string} data
*/
export function OverlayTransformChanged(uid, data) {
    var ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.OverlayTransformChanged(uid, ptr0, len0);
}

/**
* Called when the API has finished injecting into the browser and the API can now be used.
*/
export function APIInit() {
    wasm.APIInit();
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbg_SpawnOverlay_5a62e5431d83345e = function(arg0, arg1) {
        try {
            var ret = window.SpawnOverlay(getStringFromWasm0(arg0, arg1));
            return ret;
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbg_CloseOverlay_df021ff6a8c0d74f = function(arg0, arg1) {
        try {
            window.CloseOverlay(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        var ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_SetContents_f58ae13fbb05fa0f = function(arg0, arg1, arg2, arg3, arg4) {
        try {
            window.SetContents(getStringFromWasm0(arg0, arg1), arg2, getStringFromWasm0(arg3, arg4));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
            wasm.__wbindgen_free(arg3, arg4);
        }
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_e8f84259147dce74 = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_document_d3b6d86af1c5d199 = function(arg0) {
        var ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_innerWidth_2a084ee2fb8c0457 = handleError(function(arg0) {
        var ret = getObject(arg0).innerWidth;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_innerHeight_4676de3f9d6f79be = handleError(function(arg0) {
        var ret = getObject(arg0).innerHeight;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_devicePixelRatio_8e0818d196b8e065 = function(arg0) {
        var ret = getObject(arg0).devicePixelRatio;
        return ret;
    };
    imports.wbg.__wbg_requestAnimationFrame_e5d576010b9bc3a3 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
        return ret;
    });
    imports.wbg.__wbg_setTimeout_d0eb4368d101bd72 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        return ret;
    });
    imports.wbg.__wbg_getElementById_71dfbba1688677b0 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_width_cd7de7ed7645a7bf = function(arg0) {
        var ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_keyCode_d74097d530e093a8 = function(arg0) {
        var ret = getObject(arg0).keyCode;
        return ret;
    };
    imports.wbg.__wbg_altKey_501212f36ae811a4 = function(arg0) {
        var ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_e2778fe941bb5156 = function(arg0) {
        var ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_072ed91b9a400bcb = function(arg0) {
        var ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_ab904088bd961450 = function(arg0) {
        var ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_location_24c8efd2d32443fb = function(arg0) {
        var ret = getObject(arg0).location;
        return ret;
    };
    imports.wbg.__wbg_repeat_eaeda1f764d30355 = function(arg0) {
        var ret = getObject(arg0).repeat;
        return ret;
    };
    imports.wbg.__wbg_key_0b3d2c7a78af4571 = function(arg0, arg1) {
        var ret = getObject(arg1).key;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_d2d7786f00856e0a = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLCanvasElement;
        return ret;
    };
    imports.wbg.__wbg_setwidth_8d33dd91eeeee87d = function(arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    };
    imports.wbg.__wbg_setheight_757ff0f25240fd75 = function(arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_59043a63a2f9266b = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_preventDefault_7670dc6ff59bc226 = function(arg0) {
        getObject(arg0).preventDefault();
    };
    imports.wbg.__wbg_addColorStop_18c5c63316d56992 = handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).addColorStop(arg1, getStringFromWasm0(arg2, arg3));
    });
    imports.wbg.__wbg_setProperty_4a05a7c81066031f = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    });
    imports.wbg.__wbg_addEventListener_116c561435e7160d = handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    });
    imports.wbg.__wbg_deltaX_d3527e144ad7b020 = function(arg0) {
        var ret = getObject(arg0).deltaX;
        return ret;
    };
    imports.wbg.__wbg_deltaY_382e72a682f18515 = function(arg0) {
        var ret = getObject(arg0).deltaY;
        return ret;
    };
    imports.wbg.__wbg_deltaMode_afd49f429e5a6a7f = function(arg0) {
        var ret = getObject(arg0).deltaMode;
        return ret;
    };
    imports.wbg.__wbg_debug_ef2b78738889619f = function(arg0) {
        console.debug(getObject(arg0));
    };
    imports.wbg.__wbg_error_7dcc755846c00ef7 = function(arg0) {
        console.error(getObject(arg0));
    };
    imports.wbg.__wbg_info_43f70b84e943346e = function(arg0) {
        console.info(getObject(arg0));
    };
    imports.wbg.__wbg_log_61ea781bd002cc41 = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_log_375c12c7011d4864 = function(arg0, arg1) {
        console.log(getObject(arg0), getObject(arg1));
    };
    imports.wbg.__wbg_log_8d2d5532935a7ef7 = function(arg0, arg1, arg2) {
        console.log(getObject(arg0), getObject(arg1), getObject(arg2));
    };
    imports.wbg.__wbg_warn_502e53bc79de489a = function(arg0) {
        console.warn(getObject(arg0));
    };
    imports.wbg.__wbg_settitle_c01937bdf0aac5a6 = function(arg0, arg1, arg2) {
        getObject(arg0).title = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_style_ae2bb40204a83a34 = function(arg0) {
        var ret = getObject(arg0).style;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_offsetWidth_8aafad7364e8d4d7 = function(arg0) {
        var ret = getObject(arg0).offsetWidth;
        return ret;
    };
    imports.wbg.__wbg_offsetHeight_e2c43534e500f941 = function(arg0) {
        var ret = getObject(arg0).offsetHeight;
        return ret;
    };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_967775b24c689b32 = function(arg0) {
        var ret = getObject(arg0) instanceof CanvasRenderingContext2D;
        return ret;
    };
    imports.wbg.__wbg_setstrokeStyle_3630e4f599202231 = function(arg0, arg1) {
        getObject(arg0).strokeStyle = getObject(arg1);
    };
    imports.wbg.__wbg_setfillStyle_c05ba2508c693321 = function(arg0, arg1) {
        getObject(arg0).fillStyle = getObject(arg1);
    };
    imports.wbg.__wbg_setlineWidth_653e5b54ced349b7 = function(arg0, arg1) {
        getObject(arg0).lineWidth = arg1;
    };
    imports.wbg.__wbg_setlineCap_417ba9129bba9a3f = function(arg0, arg1, arg2) {
        getObject(arg0).lineCap = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlineJoin_530e610ffcf85bbc = function(arg0, arg1, arg2) {
        getObject(arg0).lineJoin = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmiterLimit_d75a22f27935d78e = function(arg0, arg1) {
        getObject(arg0).miterLimit = arg1;
    };
    imports.wbg.__wbg_setlineDashOffset_de7cb67277246b12 = function(arg0, arg1) {
        getObject(arg0).lineDashOffset = arg1;
    };
    imports.wbg.__wbg_setfont_9cf33ea1b6845b91 = function(arg0, arg1, arg2) {
        getObject(arg0).font = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_beginPath_562895fec2243bbd = function(arg0) {
        getObject(arg0).beginPath();
    };
    imports.wbg.__wbg_clip_2448de591c457647 = function(arg0, arg1) {
        getObject(arg0).clip(takeObject(arg1));
    };
    imports.wbg.__wbg_fill_b5ece3e6384cc347 = function(arg0, arg1) {
        getObject(arg0).fill(takeObject(arg1));
    };
    imports.wbg.__wbg_stroke_b60b281027593a65 = function(arg0) {
        getObject(arg0).stroke();
    };
    imports.wbg.__wbg_createLinearGradient_325b0d04b59ffd2b = function(arg0, arg1, arg2, arg3, arg4) {
        var ret = getObject(arg0).createLinearGradient(arg1, arg2, arg3, arg4);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createRadialGradient_f11e35fbc96bb08c = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        var ret = getObject(arg0).createRadialGradient(arg1, arg2, arg3, arg4, arg5, arg6);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_setLineDash_5459bde21e5245fe = handleError(function(arg0, arg1) {
        getObject(arg0).setLineDash(getObject(arg1));
    });
    imports.wbg.__wbg_bezierCurveTo_204b5b58a5b481b1 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).bezierCurveTo(arg1, arg2, arg3, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_closePath_932dac3dc951538b = function(arg0) {
        getObject(arg0).closePath();
    };
    imports.wbg.__wbg_lineTo_0fec630f79103f90 = function(arg0, arg1, arg2) {
        getObject(arg0).lineTo(arg1, arg2);
    };
    imports.wbg.__wbg_moveTo_49c22502e4fd37d6 = function(arg0, arg1, arg2) {
        getObject(arg0).moveTo(arg1, arg2);
    };
    imports.wbg.__wbg_quadraticCurveTo_d7e5edb6b180a56e = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).quadraticCurveTo(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_restore_d988b330ea639f94 = function(arg0) {
        getObject(arg0).restore();
    };
    imports.wbg.__wbg_save_018993a5d7ab8a73 = function(arg0) {
        getObject(arg0).save();
    };
    imports.wbg.__wbg_fillText_b644be549ccc6696 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
    });
    imports.wbg.__wbg_measureText_35ebbd3112c2189c = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).measureText(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getTransform_a9cf34bbcd3d8f95 = handleError(function(arg0) {
        var ret = getObject(arg0).getTransform();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_scale_4a52e222e7168660 = handleError(function(arg0, arg1, arg2) {
        getObject(arg0).scale(arg1, arg2);
    });
    imports.wbg.__wbg_transform_9ea69a045959ff92 = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).transform(arg1, arg2, arg3, arg4, arg5, arg6);
    });
    imports.wbg.__wbg_a_94bf7eb4cf9e7cc1 = function(arg0) {
        var ret = getObject(arg0).a;
        return ret;
    };
    imports.wbg.__wbg_b_8a18d6e15e1b6ded = function(arg0) {
        var ret = getObject(arg0).b;
        return ret;
    };
    imports.wbg.__wbg_c_a3231260e68f1e48 = function(arg0) {
        var ret = getObject(arg0).c;
        return ret;
    };
    imports.wbg.__wbg_d_cd26897d330ed7d4 = function(arg0) {
        var ret = getObject(arg0).d;
        return ret;
    };
    imports.wbg.__wbg_e_90c89db04258f6c5 = function(arg0) {
        var ret = getObject(arg0).e;
        return ret;
    };
    imports.wbg.__wbg_f_bdc31d1c9bea1cdb = function(arg0) {
        var ret = getObject(arg0).f;
        return ret;
    };
    imports.wbg.__wbg_offsetX_08c9c32119cefae0 = function(arg0) {
        var ret = getObject(arg0).offsetX;
        return ret;
    };
    imports.wbg.__wbg_offsetY_d2d82e37cd77b9e5 = function(arg0) {
        var ret = getObject(arg0).offsetY;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_da0b27f443c75e18 = function(arg0) {
        var ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_5faa6c16a9599f01 = function(arg0) {
        var ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_8f65ec92db7e582c = function(arg0) {
        var ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_0b52f758eccc8995 = function(arg0) {
        var ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_button_69638b9dba7a0f91 = function(arg0) {
        var ret = getObject(arg0).button;
        return ret;
    };
    imports.wbg.__wbg_buttons_624e72c73a6d236d = function(arg0) {
        var ret = getObject(arg0).buttons;
        return ret;
    };
    imports.wbg.__wbg_now_acfa6ea53a7be2c2 = function(arg0) {
        var ret = getObject(arg0).now();
        return ret;
    };
    imports.wbg.__wbg_get_2e96a823c1c5a5bd = handleError(function(arg0, arg1) {
        var ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_call_e9f0ce4da840ab94 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_newnoargs_e2fdfe2af14a2323 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_179e8c2a5a4c73a3 = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_window_492cfe63a6e41dfa = handleError(function() {
        var ret = window.window;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_globalThis_8ebfea75c2dd63ee = handleError(function() {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_global_62ea2619f58bf94d = handleError(function() {
        var ret = global.global;
        return addHeapObject(ret);
    });
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_a9f71893e410d5e5 = function(arg0) {
        var ret = new Float64Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_afe54b1eeb1aa77c = handleError(function(arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    });
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_closure_wrapper1382 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 555, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1380 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 555, __wbg_adapter_33);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1376 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 555, __wbg_adapter_36);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1384 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 555, __wbg_adapter_24);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1378 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 555, __wbg_adapter_27);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

