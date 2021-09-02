var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/.pnpm/@sveltejs+kit@1.0.0-next.162_svelte@3.42.3/node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body2, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body2 === null) {
      body2 = null;
    } else if (isURLSearchParameters(body2)) {
      body2 = Buffer.from(body2.toString());
    } else if (isBlob(body2))
      ;
    else if (Buffer.isBuffer(body2))
      ;
    else if (import_util.types.isAnyArrayBuffer(body2)) {
      body2 = Buffer.from(body2);
    } else if (ArrayBuffer.isView(body2)) {
      body2 = Buffer.from(body2.buffer, body2.byteOffset, body2.byteLength);
    } else if (body2 instanceof import_stream.default)
      ;
    else if (isFormData(body2)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body2 = import_stream.default.Readable.from(formDataIterator(body2, boundary));
    } else {
      body2 = Buffer.from(String(body2));
    }
    this[INTERNALS$2] = {
      body: body2,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body2 instanceof import_stream.default) {
      body2.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body: body2 } = data;
  if (body2 === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body2)) {
    body2 = body2.stream();
  }
  if (Buffer.isBuffer(body2)) {
    return body2;
  }
  if (!(body2 instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body2) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body2.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body2.readableEnded === true || body2._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body: body2 } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body2 instanceof import_stream.default && typeof body2.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body2.pipe(p1);
    body2.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body2 = p2;
  }
  return body2;
};
var extractContentType = (body2, request) => {
  if (body2 === null) {
    return null;
  }
  if (typeof body2 === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body2)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body2)) {
    return body2.type || null;
  }
  if (Buffer.isBuffer(body2) || import_util.types.isAnyArrayBuffer(body2) || ArrayBuffer.isView(body2)) {
    return null;
  }
  if (body2 && typeof body2.getBoundary === "function") {
    return `multipart/form-data;boundary=${body2.getBoundary()}`;
  }
  if (isFormData(body2)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body2 instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body: body2 } = request;
  if (body2 === null) {
    return 0;
  }
  if (isBlob(body2)) {
    return body2.size;
  }
  if (Buffer.isBuffer(body2)) {
    return body2.length;
  }
  if (body2 && typeof body2.getLengthSync === "function") {
    return body2.hasKnownLength && body2.hasKnownLength() ? body2.getLengthSync() : null;
  }
  if (isFormData(body2)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body: body2 }) => {
  if (body2 === null) {
    dest.end();
  } else if (isBlob(body2)) {
    body2.stream().pipe(dest);
  } else if (Buffer.isBuffer(body2)) {
    dest.write(body2);
    dest.end();
  } else {
    body2.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body2 = null, options2 = {}) {
    super(body2, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body2 !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body2);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body2 = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body2, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body2 = (0, import_stream.pipeline)(body2, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body2, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body2 = (0, import_stream.pipeline)(body2, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body2 = (0, import_stream.pipeline)(body2, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body2, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body2 = (0, import_stream.pipeline)(body2, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body2, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body2, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// .svelte-kit/output/server/app.js
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body2) {
  return {
    status: 500,
    body: body2,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body: body2, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body2 instanceof Uint8Array || is_string(body2))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body2 === "object" || typeof body2 === "undefined") && !(body2 instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body2 === "undefined" ? {} : body2);
  } else {
    normalized_body = body2;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body2 = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body3, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body3)
      attributes += ` data-body="${hash(body3)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body: body2 })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body2 = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body2)}}`
                  });
                }
                return body2;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body2 = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body2);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$9 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\texport let props_3 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}>\\n\\t\\t\\t\\t\\t{#if components[3]}\\n\\t\\t\\t\\t\\t\\t<svelte:component this={components[3]} {...(props_3 || {})}/>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</svelte:component>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AA2DC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  let { props_3 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  if ($$props.props_3 === void 0 && $$bindings.props_3 && props_3 !== void 0)
    $$bindings.props_3(props_3);
  $$result.css.add(css$9);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {
        default: () => `${components[3] ? `${validate_component(components[3] || missing_component, "svelte:component").$$render($$result, Object.assign(props_3 || {}), {}, {})}` : ``}`
      })}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body: body2 }) => `<script>
	import selfie from '$lib/assets/self2.png';
<\/script>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="/favicon.png" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;class="DividerSvg-nhcneq-0
		laHIGl WavyLineDivider-sc-1rvcq9q-0 hQCaCy" 700&display=swap" rel="stylesheet" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<!-- Favicon -->

		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
		<link rel="manifest" href="/site.webmanifest" />
		<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
		<meta name="msapplication-TileColor" content="#ffc40d" />
		<meta name="theme-color" content="#ffffff" />

		<!-- Wes Bos SEO tips -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="description" content="Portfolio site for Aaron Hubbard" />
		<!-- Wes Bos Open Graph tips -->
		<meta property="og:image" content="{selfie}" />
		<meta property="og:title" content="Aaron Hubbard Web Dev" />
		<meta property="og:site_name" content="Aaron Hubbard Web Dev" key="ogsitename" />
		<meta property="og:description" content="Portfolio site for Aaron Hubbard" />
		<!-- insert any head items declared in components/pages -->
		` + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body2 + "</div>\n	</body>\n</html>\n\n<style global>\n	/* default color palate */\n	:root {\n		--off-white: #f5f0f0;\n		--off-black: rgb(24, 24, 24);\n		--fuchsia: #ce18f0;\n		--purple: #8b00a3;\n		--yellow: #f0bc30;\n		--mint: #00f0a6;\n		--dark-mint: #08a374;\n	}\n\n	/* Global Styles */\n	html,\n	body,\n	#svelte {\n		width: 100%;\n		height: 100%;\n	}\n	main {\n		display: grid;\n		row-gap: 4rem;\n		column-gap: 2rem;\n		justify-items: center;\n		height: 100%;\n		background-color: var(--nord6);\n	}\n\n	main:first-child {\n		padding-left: 2rem;\n	}\n\n	h1,\n	h2,\n	h3,\n	p,\n	li,\n	a {\n		font-family: 'Rubik', sans-serif;\n		color: var(--off-black);\n	}\n	h1 {\n		font-size: 3rem;\n	}\n	h2 {\n		font-size: 2rem;\n	}\n	p {\n		font-size: 1.25rem;\n		font-weight: 400;\n	}\n\n	/* Normalize CSS */\n	/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n	/* Document\n   ========================================================================== */\n\n	/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n	html {\n		line-height: 1.15; /* 1 */\n		-webkit-text-size-adjust: 100%; /* 2 */\n	}\n\n	html * {\n		box-sizing: border-box;\n	}\n\n	/* Sections\n		========================================================================== */\n\n	/**\n	* Remove the margin in all browsers.\n	*/\n\n	body {\n		margin: 0;\n	}\n\n	/**\n	* Render the `main` element consistently in IE.\n	*/\n\n	main {\n		display: block;\n	}\n\n	/**\n	* Correct the font size and margin on `h1` elements within `section` and\n	* `article` contexts in Chrome, Firefox, and Safari.\n	*/\n\n	h1 {\n		margin: 0.67em 0;\n	}\n\n	/* Grouping content\n		========================================================================== */\n\n	/**\n	* 1. Add the correct box sizing in Firefox.\n	* 2. Show the overflow in Edge and IE.\n	*/\n\n	hr {\n		box-sizing: content-box; /* 1 */\n		height: 0; /* 1 */\n		overflow: visible; /* 2 */\n	}\n\n	/**\n	* 1. Correct the inheritance and scaling of font size in all browsers.\n	* 2. Correct the odd `em` font sizing in all browsers.\n	*/\n\n	pre {\n		font-family: monospace, monospace; /* 1 */\n		font-size: 1em; /* 2 */\n	}\n\n	/* Text-level semantics\n		========================================================================== */\n\n	/**\n	* Remove the gray background on active links in IE 10.\n	*/\n\n	a {\n		background-color: transparent;\n	}\n\n	/**\n	* 1. Remove the bottom border in Chrome 57-\n	* 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n	*/\n\n	abbr[title] {\n		border-bottom: none; /* 1 */\n		text-decoration: underline; /* 2 */\n		text-decoration: underline dotted; /* 2 */\n	}\n\n	/**\n	* Add the correct font weight in Chrome, Edge, and Safari.\n	*/\n\n	b,\n	strong {\n		font-weight: bolder;\n	}\n\n	/**\n	* 1. Correct the inheritance and scaling of font size in all browsers.\n	* 2. Correct the odd `em` font sizing in all browsers.\n	*/\n\n	code,\n	kbd,\n	samp {\n		font-family: monospace, monospace; /* 1 */\n		font-size: 1em; /* 2 */\n	}\n\n	/**\n	* Add the correct font size in all browsers.\n	*/\n\n	small {\n		font-size: 80%;\n	}\n\n	/**\n	* Prevent `sub` and `sup` elements from affecting the line height in\n	* all browsers.\n	*/\n\n	sub,\n	sup {\n		font-size: 75%;\n		line-height: 0;\n		position: relative;\n		vertical-align: baseline;\n	}\n\n	sub {\n		bottom: -0.25em;\n	}\n\n	sup {\n		top: -0.5em;\n	}\n\n	/* Embedded content\n		========================================================================== */\n\n	/**\n	* Remove the border on images inside links in IE 10.\n	*/\n\n	img {\n		border-style: none;\n	}\n\n	/* Forms\n		========================================================================== */\n\n	/**\n	* 1. Change the font styles in all browsers.\n	* 2. Remove the margin in Firefox and Safari.\n	*/\n\n	button,\n	input,\n	optgroup,\n	select,\n	textarea {\n		font-family: inherit; /* 1 */\n		font-size: 100%; /* 1 */\n		line-height: 1.15; /* 1 */\n		margin: 0; /* 2 */\n	}\n\n	/**\n	* Show the overflow in IE.\n	* 1. Show the overflow in Edge.\n	*/\n\n	button,\n	input {\n		/* 1 */\n		overflow: visible;\n	}\n\n	/**\n	* Remove the inheritance of text transform in Edge, Firefox, and IE.\n	* 1. Remove the inheritance of text transform in Firefox.\n	*/\n\n	button,\n	select {\n		/* 1 */\n		text-transform: none;\n	}\n\n	/**\n	* Correct the inability to style clickable types in iOS and Safari.\n	*/\n\n	button,\n	[type='button'],\n	[type='reset'],\n	[type='submit'] {\n		-webkit-appearance: button;\n	}\n\n	/**\n	* Remove the inner border and padding in Firefox.\n	*/\n\n	button::-moz-focus-inner,\n	[type='button']::-moz-focus-inner,\n	[type='reset']::-moz-focus-inner,\n	[type='submit']::-moz-focus-inner {\n		border-style: none;\n		padding: 0;\n	}\n\n	/**\n	* Restore the focus styles unset by the previous rule.\n	*/\n\n	button:-moz-focusring,\n	[type='button']:-moz-focusring,\n	[type='reset']:-moz-focusring,\n	[type='submit']:-moz-focusring {\n		outline: 1px dotted ButtonText;\n	}\n\n	/**\n	* Correct the padding in Firefox.\n	*/\n\n	fieldset {\n		padding: 0.35em 0.75em 0.625em;\n	}\n\n	/**\n	* 1. Correct the text wrapping in Edge and IE.\n	* 2. Correct the color inheritance from `fieldset` elements in IE.\n	* 3. Remove the padding so developers are not caught out when they zero out\n	*    `fieldset` elements in all browsers.\n	*/\n\n	legend {\n		box-sizing: border-box; /* 1 */\n		color: inherit; /* 2 */\n		display: table; /* 1 */\n		max-width: 100%; /* 1 */\n		padding: 0; /* 3 */\n		white-space: normal; /* 1 */\n	}\n\n	/**\n	* Add the correct vertical alignment in Chrome, Firefox, and Opera.\n	*/\n\n	progress {\n		vertical-align: baseline;\n	}\n\n	/**\n	* Remove the default vertical scrollbar in IE 10+.\n	*/\n\n	textarea {\n		overflow: auto;\n	}\n\n	/**\n	* 1. Add the correct box sizing in IE 10.\n	* 2. Remove the padding in IE 10.\n	*/\n\n	[type='checkbox'],\n	[type='radio'] {\n		box-sizing: border-box; /* 1 */\n		padding: 0; /* 2 */\n	}\n\n	/**\n	* Correct the cursor style of increment and decrement buttons in Chrome.\n	*/\n\n	[type='number']::-webkit-inner-spin-button,\n	[type='number']::-webkit-outer-spin-button {\n		height: auto;\n	}\n\n	/**\n	* 1. Correct the odd appearance in Chrome and Safari.\n	* 2. Correct the outline style in Safari.\n	*/\n\n	[type='search'] {\n		-webkit-appearance: textfield; /* 1 */\n		outline-offset: -2px; /* 2 */\n	}\n\n	/**\n	* Remove the inner padding in Chrome and Safari on macOS.\n	*/\n\n	[type='search']::-webkit-search-decoration {\n		-webkit-appearance: none;\n	}\n\n	/**\n	* 1. Correct the inability to style clickable types in iOS and Safari.\n	* 2. Change font properties to `inherit` in Safari.\n	*/\n\n	::-webkit-file-upload-button {\n		-webkit-appearance: button; /* 1 */\n		font: inherit; /* 2 */\n	}\n\n	/* Interactive\n		========================================================================== */\n\n	/*\n	* Add the correct display in Edge, IE 10+, and Firefox.\n	*/\n\n	details {\n		display: block;\n	}\n\n	/*\n	* Add the correct display in all browsers.\n	*/\n\n	summary {\n		display: list-item;\n	}\n\n	/* Misc\n		========================================================================== */\n\n	/**\n	* Add the correct display in IE 10+.\n	*/\n\n	template {\n		display: none;\n	}\n\n	/**\n	* Add the correct display in IE 10.\n	*/\n\n	[hidden] {\n		display: none;\n	}\n</style>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-bb7a59b7.js",
      css: [assets + "/_app/assets/start-61d1577b.css", assets + "/_app/assets/vendor-ef2c9ea5.css"],
      js: [assets + "/_app/start-bb7a59b7.js", assets + "/_app/chunks/vendor-d0d5e953.js", assets + "/_app/chunks/preload-helper-ec9aa979.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "android-chrome-192x192.png", "size": 5892, "type": "image/png" }, { "file": "android-chrome-512x512.png", "size": 19513, "type": "image/png" }, { "file": "apple-touch-icon.png", "size": 5363, "type": "image/png" }, { "file": "browserconfig.xml", "size": 246, "type": "application/xml" }, { "file": "favicon-16x16.png", "size": 648, "type": "image/png" }, { "file": "favicon-32x32.png", "size": 1115, "type": "image/png" }, { "file": "favicon.ico", "size": 15086, "type": "image/vnd.microsoft.icon" }, { "file": "favicon_package_v0.16.zip", "size": 48200, "type": "application/zip" }, { "file": "mstile-150x150.png", "size": 5490, "type": "image/png" }, { "file": "safari-pinned-tab.svg", "size": 12634, "type": "image/svg+xml" }, { "file": "site.webmanifest", "size": 327, "type": "application/manifest+json" }, { "file": "zigZagBorder.svg", "size": 2449, "type": "image/svg+xml" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blogposts\/second-post\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blogposts/__layout.svelte", "src/routes/blogposts/second-post.md"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blogposts\/first-post\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blogposts/__layout.svelte", "src/routes/blogposts/first-post.md"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blogposts\/third-post\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blogposts/__layout.svelte", "src/routes/blogposts/third-post.md"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/projects\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/projects.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/tags\/([^/]+?)\/?$/,
      params: (m) => ({ tag: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/tags/[tag].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout$1;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/blogposts/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/blogposts/second-post.md": () => Promise.resolve().then(function() {
    return secondPost;
  }),
  "src/routes/blogposts/first-post.md": () => Promise.resolve().then(function() {
    return firstPost;
  }),
  "src/routes/blogposts/third-post.md": () => Promise.resolve().then(function() {
    return thirdPost;
  }),
  "src/routes/projects.svelte": () => Promise.resolve().then(function() {
    return projects;
  }),
  "src/routes/tags/[tag].svelte": () => Promise.resolve().then(function() {
    return _tag_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-c7b89add.js", "css": ["assets/pages/__layout.svelte-bfd9183b.css", "assets/vendor-ef2c9ea5.css"], "js": ["pages/__layout.svelte-c7b89add.js", "chunks/vendor-d0d5e953.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-2cde82ee.js", "css": ["assets/vendor-ef2c9ea5.css"], "js": ["error.svelte-2cde82ee.js", "chunks/vendor-d0d5e953.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-836a672e.js", "css": ["assets/pages/index.svelte-8c18fa6a.css", "assets/vendor-ef2c9ea5.css"], "js": ["pages/index.svelte-836a672e.js", "chunks/preload-helper-ec9aa979.js", "chunks/vendor-d0d5e953.js"], "styles": [] }, "src/routes/blogposts/__layout.svelte": { "entry": "pages/blogposts/__layout.svelte-cd9c5034.js", "css": ["assets/pages/blogposts/__layout.svelte-40818056.css", "assets/vendor-ef2c9ea5.css"], "js": ["pages/blogposts/__layout.svelte-cd9c5034.js", "chunks/vendor-d0d5e953.js"], "styles": [] }, "src/routes/blogposts/second-post.md": { "entry": "pages/blogposts/second-post.md-972f0fe3.js", "css": ["assets/pages/blogposts/second-post.md-d25fc845.css", "assets/vendor-ef2c9ea5.css"], "js": ["pages/blogposts/second-post.md-972f0fe3.js", "chunks/vendor-d0d5e953.js"], "styles": [] }, "src/routes/blogposts/first-post.md": { "entry": "pages/blogposts/first-post.md-a7f7f35b.js", "css": ["assets/vendor-ef2c9ea5.css"], "js": ["pages/blogposts/first-post.md-a7f7f35b.js", "chunks/vendor-d0d5e953.js"], "styles": [] }, "src/routes/blogposts/third-post.md": { "entry": "pages/blogposts/third-post.md-345698db.js", "css": ["assets/vendor-ef2c9ea5.css"], "js": ["pages/blogposts/third-post.md-345698db.js", "chunks/vendor-d0d5e953.js"], "styles": [] }, "src/routes/projects.svelte": { "entry": "pages/projects.svelte-08d34177.js", "css": ["assets/pages/projects.svelte-e8171ae3.css", "assets/vendor-ef2c9ea5.css"], "js": ["pages/projects.svelte-08d34177.js", "chunks/vendor-d0d5e953.js"], "styles": [] }, "src/routes/tags/[tag].svelte": { "entry": "pages/tags/[tag].svelte-b8c78de5.js", "css": ["assets/vendor-ef2c9ea5.css"], "js": ["pages/tags/[tag].svelte-b8c78de5.js", "chunks/preload-helper-ec9aa979.js", "chunks/vendor-d0d5e953.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var Path = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = "" } = $$props;
  let { data = {} } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<path${spread([{ key: "path-" + escape(id) }, escape_object(data)])}></path>`;
});
var Polygon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = "" } = $$props;
  let { data = {} } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<polygon${spread([{ key: "polygon-" + escape(id) }, escape_object(data)])}></polygon>`;
});
var Raw = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cursor = 870711;
  function getId() {
    cursor += 1;
    return `fa-${cursor.toString(16)}`;
  }
  let raw;
  let { data } = $$props;
  function getRaw(data2) {
    if (!data2 || !data2.raw) {
      return null;
    }
    let rawData = data2.raw;
    const ids = {};
    rawData = rawData.replace(/\s(?:xml:)?id=["']?([^"')\s]+)/g, (match, id) => {
      const uniqueId = getId();
      ids[id] = uniqueId;
      return ` id="${uniqueId}"`;
    });
    rawData = rawData.replace(/#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g, (match, rawId, _, pointerId) => {
      const id = rawId || pointerId;
      if (!id || !ids[id]) {
        return match;
      }
      return `#${ids[id]}`;
    });
    return rawData;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  raw = getRaw(data);
  return `<g><!-- HTML_TAG_START -->${raw}<!-- HTML_TAG_END --></g>`;
});
var css$8 = {
  code: ".fa-icon.svelte-1dof0an{display:inline-block;fill:currentColor}.fa-flip-horizontal.svelte-1dof0an{transform:scale(-1, 1)}.fa-flip-vertical.svelte-1dof0an{transform:scale(1, -1)}.fa-spin.svelte-1dof0an{animation:svelte-1dof0an-fa-spin 1s 0s infinite linear}.fa-inverse.svelte-1dof0an{color:#fff}.fa-pulse.svelte-1dof0an{animation:svelte-1dof0an-fa-spin 1s infinite steps(8)}@keyframes svelte-1dof0an-fa-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
  map: `{"version":3,"file":"Svg.svelte","sources":["Svg.svelte"],"sourcesContent":["<svg version=\\"1.1\\" class=\\"fa-icon {className}\\"\\n  class:fa-spin={spin} class:fa-pulse={pulse} class:fa-inverse={inverse}\\n  class:fa-flip-horizontal=\\"{flip === 'horizontal'}\\" class:fa-flip-vertical=\\"{flip === 'vertical'}\\"\\n  {x} {y} {width} {height}\\n  aria-label={label}\\n  role=\\"{ label ? 'img' : 'presentation' }\\"\\n  viewBox={box} {style}\\n  >\\n  <slot></slot>\\n</svg>\\n\\n<style>\\n.fa-icon {\\n  display: inline-block;\\n  fill: currentColor;\\n}\\n.fa-flip-horizontal {\\n  transform: scale(-1, 1);\\n}\\n.fa-flip-vertical {\\n  transform: scale(1, -1);\\n}\\n.fa-spin {\\n  animation: fa-spin 1s 0s infinite linear;\\n}\\n.fa-inverse {\\n  color: #fff;\\n}\\n.fa-pulse {\\n  animation: fa-spin 1s infinite steps(8);\\n}\\n@keyframes fa-spin {\\n  0% {\\n    transform: rotate(0deg);\\n  }\\n  100% {\\n    transform: rotate(360deg);\\n  }\\n}\\n</style>\\n\\n<script>\\n  let className;\\n\\n  export { className as class };\\n\\n  export let width;\\n  export let height;\\n  export let box;\\n\\n  export let spin = false;\\n  export let inverse = false;\\n  export let pulse = false;\\n  export let flip = null;\\n\\n  // optionals\\n  export let x = undefined;\\n  export let y = undefined;\\n  export let style = undefined;\\n  export let label = undefined;\\n<\/script>\\n"],"names":[],"mappings":"AAYA,QAAQ,eAAC,CAAC,AACR,OAAO,CAAE,YAAY,CACrB,IAAI,CAAE,YAAY,AACpB,CAAC,AACD,mBAAmB,eAAC,CAAC,AACnB,SAAS,CAAE,MAAM,EAAE,CAAC,CAAC,CAAC,CAAC,AACzB,CAAC,AACD,iBAAiB,eAAC,CAAC,AACjB,SAAS,CAAE,MAAM,CAAC,CAAC,CAAC,EAAE,CAAC,AACzB,CAAC,AACD,QAAQ,eAAC,CAAC,AACR,SAAS,CAAE,sBAAO,CAAC,EAAE,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,AAC1C,CAAC,AACD,WAAW,eAAC,CAAC,AACX,KAAK,CAAE,IAAI,AACb,CAAC,AACD,SAAS,eAAC,CAAC,AACT,SAAS,CAAE,sBAAO,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,CAAC,AACzC,CAAC,AACD,WAAW,sBAAQ,CAAC,AAClB,EAAE,AAAC,CAAC,AACF,SAAS,CAAE,OAAO,IAAI,CAAC,AACzB,CAAC,AACD,IAAI,AAAC,CAAC,AACJ,SAAS,CAAE,OAAO,MAAM,CAAC,AAC3B,CAAC,AACH,CAAC"}`
};
var Svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className } = $$props;
  let { width } = $$props;
  let { height } = $$props;
  let { box } = $$props;
  let { spin = false } = $$props;
  let { inverse = false } = $$props;
  let { pulse = false } = $$props;
  let { flip = null } = $$props;
  let { x = void 0 } = $$props;
  let { y = void 0 } = $$props;
  let { style = void 0 } = $$props;
  let { label = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.box === void 0 && $$bindings.box && box !== void 0)
    $$bindings.box(box);
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0)
    $$bindings.spin(spin);
  if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0)
    $$bindings.inverse(inverse);
  if ($$props.pulse === void 0 && $$bindings.pulse && pulse !== void 0)
    $$bindings.pulse(pulse);
  if ($$props.flip === void 0 && $$bindings.flip && flip !== void 0)
    $$bindings.flip(flip);
  if ($$props.x === void 0 && $$bindings.x && x !== void 0)
    $$bindings.x(x);
  if ($$props.y === void 0 && $$bindings.y && y !== void 0)
    $$bindings.y(y);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  $$result.css.add(css$8);
  return `<svg version="${"1.1"}" class="${[
    "fa-icon " + escape(className) + " svelte-1dof0an",
    (spin ? "fa-spin" : "") + " " + (pulse ? "fa-pulse" : "") + " " + (inverse ? "fa-inverse" : "") + " " + (flip === "horizontal" ? "fa-flip-horizontal" : "") + " " + (flip === "vertical" ? "fa-flip-vertical" : "")
  ].join(" ").trim()}"${add_attribute("x", x, 0)}${add_attribute("y", y, 0)}${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("aria-label", label, 0)}${add_attribute("role", label ? "img" : "presentation", 0)}${add_attribute("viewBox", box, 0)}${add_attribute("style", style, 0)}>${slots.default ? slots.default({}) : ``}</svg>`;
});
var outerScale = 1;
function normaliseData(data) {
  if ("iconName" in data && "icon" in data) {
    let normalisedData = {};
    let faIcon = data.icon;
    let name = data.iconName;
    let width = faIcon[0];
    let height = faIcon[1];
    let paths = faIcon[4];
    let iconData = { width, height, paths: [{ d: paths }] };
    normalisedData[name] = iconData;
    return normalisedData;
  }
  return data;
}
var Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { data } = $$props;
  let { scale = 1 } = $$props;
  let { spin = false } = $$props;
  let { inverse = false } = $$props;
  let { pulse = false } = $$props;
  let { flip = null } = $$props;
  let { label = null } = $$props;
  let { self = null } = $$props;
  let { style = null } = $$props;
  let width;
  let height;
  let combinedStyle;
  let box;
  function init2() {
    if (typeof data === "undefined") {
      return;
    }
    const normalisedData = normaliseData(data);
    const [name] = Object.keys(normalisedData);
    const icon = normalisedData[name];
    if (!icon.paths) {
      icon.paths = [];
    }
    if (icon.d) {
      icon.paths.push({ d: icon.d });
    }
    if (!icon.polygons) {
      icon.polygons = [];
    }
    if (icon.points) {
      icon.polygons.push({ points: icon.points });
    }
    self = icon;
  }
  function normalisedScale() {
    let numScale = 1;
    if (typeof scale !== "undefined") {
      numScale = Number(scale);
    }
    if (isNaN(numScale) || numScale <= 0) {
      console.warn('Invalid prop: prop "scale" should be a number over 0.');
      return outerScale;
    }
    return numScale * outerScale;
  }
  function calculateBox() {
    if (self) {
      return `0 0 ${self.width} ${self.height}`;
    }
    return `0 0 ${width} ${height}`;
  }
  function calculateRatio() {
    if (!self) {
      return 1;
    }
    return Math.max(self.width, self.height) / 16;
  }
  function calculateWidth() {
    if (self) {
      return self.width / calculateRatio() * normalisedScale();
    }
    return 0;
  }
  function calculateHeight() {
    if (self) {
      return self.height / calculateRatio() * normalisedScale();
    }
    return 0;
  }
  function calculateStyle() {
    let combined = "";
    if (style !== null) {
      combined += style;
    }
    let size = normalisedScale();
    if (size === 1) {
      if (combined.length === 0) {
        return void 0;
      }
      return combined;
    }
    if (combined !== "" && !combined.endsWith(";")) {
      combined += "; ";
    }
    return `${combined}font-size: ${size}em`;
  }
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0)
    $$bindings.spin(spin);
  if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0)
    $$bindings.inverse(inverse);
  if ($$props.pulse === void 0 && $$bindings.pulse && pulse !== void 0)
    $$bindings.pulse(pulse);
  if ($$props.flip === void 0 && $$bindings.flip && flip !== void 0)
    $$bindings.flip(flip);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.self === void 0 && $$bindings.self && self !== void 0)
    $$bindings.self(self);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        init2();
        width = calculateWidth();
        height = calculateHeight();
        combinedStyle = calculateStyle();
        box = calculateBox();
      }
    }
    $$rendered = `${validate_component(Svg, "Svg").$$render($$result, {
      label,
      width,
      height,
      box,
      style: combinedStyle,
      spin,
      flip,
      inverse,
      pulse,
      class: className
    }, {}, {
      default: () => `${slots.default ? slots.default({}) : `
    ${self ? `${self.paths ? `${each(self.paths, (path, i) => `${validate_component(Path, "Path").$$render($$result, { id: i, data: path }, {}, {})}`)}` : ``}
      ${self.polygons ? `${each(self.polygons, (polygon, i) => `${validate_component(Polygon, "Polygon").$$render($$result, { id: i, data: polygon }, {}, {})}`)}` : ``}
      ${self.raw ? `${validate_component(Raw, "Raw").$$render($$result, { data: self }, {
        data: ($$value) => {
          self = $$value;
          $$settled = false;
        }
      }, {})}` : ``}` : ``}
  `}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var linkedinSquare = { "linkedin-square": { width: 1536, height: 1792, paths: [{ d: "M237 1414h231v-694h-231v694zM483 506q-1-52-36-86t-93-34-94.5 34-36.5 86q0 51 35.5 85.5t92.5 34.5h1q59 0 95-34.5t36-85.5zM1068 1414h231v-398q0-154-73-233t-193-79q-136 0-209 117h2v-101h-231q3 66 0 694h231v-388q0-38 7-56 15-35 45-59.5t74-24.5q116 0 116 157v371zM1536 416v960q0 119-84.5 203.5t-203.5 84.5h-960q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960q119 0 203.5 84.5t84.5 203.5z" }] } };
var github = { github: { width: 1536, height: 1792, paths: [{ d: "M768 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 0.5-76.5t0.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 0.5 88.5t0.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zM291 1231q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zM322 1265q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zM352 1310q9-7 0-19-8-13-17-6-9 5 0 18t17 7zM394 1352q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zM451 1377q3-11-13-16-15-4-19 7t13 15q15 6 19-6zM514 1382q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zM572 1372q-2-11-18-9-16 3-14 15t18 8 14-14z" }] } };
var css$7 = {
  code: "nav.svelte-1ja48eh{display:grid;border-bottom:4px solid var(--fuchsia);grid-template-columns:2fr 2fr 2fr 1fr 1fr}a.svelte-1ja48eh{display:flex;align-items:center;justify-content:center;text-decoration:none;font-family:'Rubik', sans-serif;font-weight:700;font-size:1.25rem;color:var(--off-white);height:100%;background-color:var(--off-black);padding:1rem}a.svelte-1ja48eh:hover{color:var(--fuchsia)}",
  map: `{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<script>\\n\\timport Icon from 'svelte-awesome';\\n\\timport { github, linkedinSquare } from 'svelte-awesome/icons';\\n<\/script>\\n\\n<nav>\\n\\t<a href=\\"/\\">Home</a>\\n\\t<a href=\\"/projects\\">Projects</a>\\n\\t<a href=\\"mailto:hotel.kilo.alpha@gmail.com\\">Contact</a>\\n\\t<a href=\\"https://www.github.com/aaronkai\\" target=\\"_blank\\" rel=\\"noreferrer\\"\\n\\t\\t><Icon scale=\\"2\\" data={github} /></a\\n\\t>\\n\\t<!-- <Icon data={beer} /> -->\\n\\t<a href=\\"https://www.linkedin.com/in/aaron-hubbard/\\" target=\\"_blank\\" rel=\\"noreferrer\\">\\n\\t\\t<Icon scale=\\"2\\" data={linkedinSquare} />\\n\\t</a>\\n</nav>\\n\\n<style>\\n\\tnav {\\n\\t\\tdisplay: grid;\\n\\t\\tborder-bottom: 4px solid var(--fuchsia);\\n\\t\\tgrid-template-columns: 2fr 2fr 2fr 1fr 1fr;\\n\\t}\\n\\ta {\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tjustify-content: center;\\n\\t\\ttext-decoration: none;\\n\\t\\tfont-family: 'Rubik', sans-serif;\\n\\t\\tfont-weight: 700;\\n\\t\\tfont-size: 1.25rem;\\n\\t\\tcolor: var(--off-white);\\n\\t\\theight: 100%;\\n\\t\\tbackground-color: var(--off-black);\\n\\t\\tpadding: 1rem;\\n\\t}\\n\\ta:hover {\\n\\t\\tcolor: var(--fuchsia);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAmBC,GAAG,eAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,SAAS,CAAC,CACvC,qBAAqB,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,AAC3C,CAAC,AACD,CAAC,eAAC,CAAC,AACF,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,eAAe,CAAE,IAAI,CACrB,WAAW,CAAE,OAAO,CAAC,CAAC,UAAU,CAChC,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,OAAO,CAClB,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,MAAM,CAAE,IAAI,CACZ,gBAAgB,CAAE,IAAI,WAAW,CAAC,CAClC,OAAO,CAAE,IAAI,AACd,CAAC,AACD,gBAAC,MAAM,AAAC,CAAC,AACR,KAAK,CAAE,IAAI,SAAS,CAAC,AACtB,CAAC"}`
};
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$7);
  return `<nav class="${"svelte-1ja48eh"}"><a href="${"/"}" class="${"svelte-1ja48eh"}">Home</a>
	<a href="${"/projects"}" class="${"svelte-1ja48eh"}">Projects</a>
	<a href="${"mailto:hotel.kilo.alpha@gmail.com"}" class="${"svelte-1ja48eh"}">Contact</a>
	<a href="${"https://www.github.com/aaronkai"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"svelte-1ja48eh"}">${validate_component(Icon, "Icon").$$render($$result, { scale: "2", data: github }, {}, {})}</a>
	
	<a href="${"https://www.linkedin.com/in/aaron-hubbard/"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"svelte-1ja48eh"}">${validate_component(Icon, "Icon").$$render($$result, { scale: "2", data: linkedinSquare }, {}, {})}</a>
</nav>`;
});
var css$6 = {
  code: "footer.svelte-rfv950{background-color:var(--off-black);display:grid;align-items:center;border-top:2px solid var(--mint)}a.svelte-rfv950{text-decoration:none;font-family:'Rubik', sans-serif;font-weight:400;font-size:1rem;color:var(--off-white);text-align:center;margin:1rem}",
  map: `{"version":3,"file":"Footer.svelte","sources":["Footer.svelte"],"sourcesContent":["<footer>\\n\\t<a href=\\"http://www.aaronhubbard.dev\\">Aaron Hubbard Web Dev&copy; 2021</a>\\n</footer>\\n\\n<style>\\n\\tfooter {\\n\\t\\tbackground-color: var(--off-black);\\n\\t\\tdisplay: grid;\\n\\t\\talign-items: center;\\n\\t\\tborder-top: 2px solid var(--mint);\\n\\t}\\n\\n\\ta {\\n\\t\\ttext-decoration: none;\\n\\t\\tfont-family: 'Rubik', sans-serif;\\n\\t\\tfont-weight: 400;\\n\\t\\tfont-size: 1rem;\\n\\t\\tcolor: var(--off-white);\\n\\t\\ttext-align: center;\\n\\t\\tmargin: 1rem;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAKC,MAAM,cAAC,CAAC,AACP,gBAAgB,CAAE,IAAI,WAAW,CAAC,CAClC,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,MAAM,CAAC,AAClC,CAAC,AAED,CAAC,cAAC,CAAC,AACF,eAAe,CAAE,IAAI,CACrB,WAAW,CAAE,OAAO,CAAC,CAAC,UAAU,CAChC,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,IAAI,AACb,CAAC"}`
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `<footer class="${"svelte-rfv950"}"><a href="${"http://www.aaronhubbard.dev"}" class="${"svelte-rfv950"}">Aaron Hubbard Web Dev\xA9 2021</a>
</footer>`;
});
var css$5 = {
  code: ".wrapper.svelte-19o3as6{display:grid;min-height:100vh;grid-template-rows:auto 1fr auto}",
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script>\\n\\timport Header from '$lib/components/Header.svelte';\\n\\timport Footer from '$lib/components/Footer.svelte';\\n<\/script>\\n\\n<div class=\\"wrapper\\">\\n\\t<Header />\\n\\t<div class=\\"inner_wrapper\\">\\n\\t\\t<slot />\\n\\t</div>\\n\\t<Footer />\\n</div>\\n\\n<style>\\n\\t.wrapper {\\n\\t\\tdisplay: grid;\\n\\t\\tmin-height: 100vh;\\n\\t\\tgrid-template-rows: auto 1fr auto;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAcC,QAAQ,eAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,KAAK,CACjB,kBAAkB,CAAE,IAAI,CAAC,GAAG,CAAC,IAAI,AAClC,CAAC"}`
};
var _layout$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$5);
  return `<div class="${"wrapper svelte-19o3as6"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
	<div class="${"inner_wrapper"}">${slots.default ? slots.default({}) : ``}</div>
	${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
</div>`;
});
var __layout$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout$1
});
function load$2({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$2
});
var Selfie = "/_app/assets/self2-85fb30ed.png";
var css$4 = {
  code: "main.svelte-32uixy.svelte-32uixy{display:grid;row-gap:4rem;column-gap:2rem;justify-items:center;height:100%;background-color:var(--off-white)}h1.svelte-32uixy.svelte-32uixy,h2.svelte-32uixy.svelte-32uixy,h3.svelte-32uixy.svelte-32uixy,p.svelte-32uixy.svelte-32uixy,li.svelte-32uixy.svelte-32uixy,a.svelte-32uixy.svelte-32uixy{font-family:'Rubik', sans-serif;color:var(--off-black)}h1.svelte-32uixy.svelte-32uixy{font-size:3rem}p.svelte-32uixy.svelte-32uixy{font-size:1.25rem;font-weight:400}figure.svelte-32uixy.svelte-32uixy{display:grid;justify-items:center;align-items:center}figure.svelte-32uixy img.svelte-32uixy{max-height:30vh}.bio.svelte-32uixy.svelte-32uixy{padding-top:3rem;padding-left:2rem}.bio.svelte-32uixy h1.svelte-32uixy{font-size:5rem;color:var(--purple);margin:2rem 0 0.5rem 0}.bio.svelte-32uixy h2.svelte-32uixy{font-size:2.5rem;margin:0.5rem 0;color:var(--dark-mint)}.bio.svelte-32uixy h3.svelte-32uixy{font-size:1.5rem;margin:0.5rem 0;color:var(--dark-mint);font-weight:700;text-transform:capitalize}.bio.svelte-32uixy section.svelte-32uixy{margin-top:2rem}.blog.svelte-32uixy.svelte-32uixy{background-color:var(--off-black);width:100%;padding:2rem;height:100%}.blog.svelte-32uixy .tags.svelte-32uixy{margin-left:1rem;display:flex;flex-wrap:wrap}.blog.svelte-32uixy .tag.svelte-32uixy{background-color:var(--mint);color:var(--off-black);font-size:0.85rem;font-weight:700;padding:0.5rem 0.75rem;border-radius:0.75rem;margin:0 0.5rem 0.5rem 0}.blog.svelte-32uixy .tag.svelte-32uixy:hover{background-color:var(--fuchsia)}.blog.svelte-32uixy h2.svelte-32uixy{margin:0 0 1rem 0;color:var(--off-white)}.blog.svelte-32uixy h3.svelte-32uixy{margin:0 0 1rem 1rem;font-size:1rem;color:var(--off-white)}.blog.svelte-32uixy li.svelte-32uixy{margin-bottom:2rem;color:var(--off-white)}.blog.svelte-32uixy a.svelte-32uixy{color:var(--off-white)}.blog.svelte-32uixy h1.svelte-32uixy{color:var(--off-white)}@media only screen and (min-width: 600px){main.svelte-32uixy.svelte-32uixy{display:grid;grid-template-columns:1fr 1fr}}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script context=\\"module\\">\\n\\tconst allPosts = import.meta.glob('./blogposts/*.md');\\n\\tlet body = [];\\n\\tfor (let path in allPosts) {\\n\\t\\tbody.push(\\n\\t\\t\\tallPosts[path]().then(({ metadata }) => {\\n\\t\\t\\t\\treturn { path, metadata };\\n\\t\\t\\t})\\n\\t\\t);\\n\\t}\\n\\n\\texport const load = async () => {\\n\\t\\tconst posts = await Promise.all(body);\\n\\t\\treturn {\\n\\t\\t\\tprops: {\\n\\t\\t\\t\\tposts\\n\\t\\t\\t}\\n\\t\\t};\\n\\t};\\n<\/script>\\n\\n<script>\\n\\timport Selfie from '$lib/assets/self2.png';\\n\\texport let posts;\\n\\tconst dateSortedPosts = posts.sort((post1, post2) => {\\n\\t\\treturn new Date(post2.metadata.date) - new Date(post1.metadata.date);\\n\\t});\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>Aaron Hubbard Web Dev</title>\\n</svelte:head>\\n\\n<main>\\n\\t<section class=\\"bio\\">\\n\\t\\t<figure>\\n\\t\\t\\t<img src={Selfie} alt=\\"selfie\\" />\\n\\t\\t</figure>\\n\\n\\t\\t<header>\\n\\t\\t\\t<h1>Aaron Hubbard</h1>\\n\\t\\t\\t<h2>Jamstack Developer</h2>\\n\\t\\t\\t<h3>Building fast and functional things for the web</h3>\\n\\t\\t</header>\\n\\t\\t<section>\\n\\t\\t\\t<p>\\n\\t\\t\\t\\tHi! I'm Aaron Hubbard, a family-man and web-developer based in Asheville, NC. By day, I'm an\\n\\t\\t\\t\\tapplication administrator for NOAA's CLASS project. In my free-time, I'm learning more and\\n\\t\\t\\t\\tmore about making modern websites.\\n\\t\\t\\t</p>\\n\\t\\t\\t<p>To see some examples of my work, <a href=\\"/projects\\">check out my projects</a>.</p>\\n\\t\\t\\t<p>Drop me a line using the contact link.</p>\\n\\t\\t</section>\\n\\t</section>\\n\\n\\t<section class=\\"blog\\">\\n\\t\\t<h1>Blogposts</h1>\\n\\t\\t<ul>\\n\\t\\t\\t{#each dateSortedPosts as { path, metadata: { title, tags, date } }}\\n\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t<h2>\\n\\t\\t\\t\\t\\t\\t<a href={\`\${path.replace('.md', '')}\`}>{title} </a>\\n\\t\\t\\t\\t\\t</h2>\\n\\t\\t\\t\\t\\t<h3>\\n\\t\\t\\t\\t\\t\\t{new Date(date).toDateString()}\\n\\t\\t\\t\\t\\t</h3>\\n\\n\\t\\t\\t\\t\\t<div class=\\"tags\\">\\n\\t\\t\\t\\t\\t\\t{#each tags as tag}\\n\\t\\t\\t\\t\\t\\t\\t<a class=\\"tag\\" href={\`/tags/\${tag}\`}>#{tag} </a>\\n\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</li>\\n\\t\\t\\t{/each}\\n\\t\\t</ul>\\n\\t</section>\\n</main>\\n\\n<style>\\n\\tmain {\\n\\t\\tdisplay: grid;\\n\\t\\trow-gap: 4rem;\\n\\t\\tcolumn-gap: 2rem;\\n\\t\\tjustify-items: center;\\n\\t\\theight: 100%;\\n\\t\\tbackground-color: var(--off-white);\\n\\t}\\n\\n\\th1,\\n\\th2,\\n\\th3,\\n\\tp,\\n\\tli,\\n\\ta {\\n\\t\\tfont-family: 'Rubik', sans-serif;\\n\\t\\tcolor: var(--off-black);\\n\\t}\\n\\th1 {\\n\\t\\tfont-size: 3rem;\\n\\t}\\n\\tp {\\n\\t\\tfont-size: 1.25rem;\\n\\t\\tfont-weight: 400;\\n\\t}\\n\\n\\t/* sections */\\n\\n\\t/* bio */\\n\\tfigure {\\n\\t\\tdisplay: grid;\\n\\t\\tjustify-items: center;\\n\\t\\talign-items: center;\\n\\t}\\n\\tfigure img {\\n\\t\\tmax-height: 30vh;\\n\\t}\\n\\n\\t.bio {\\n\\t\\tpadding-top: 3rem;\\n\\t\\tpadding-left: 2rem;\\n\\t}\\n\\t.bio h1 {\\n\\t\\tfont-size: 5rem;\\n\\t\\tcolor: var(--purple);\\n\\t\\tmargin: 2rem 0 0.5rem 0;\\n\\t}\\n\\t.bio h2 {\\n\\t\\tfont-size: 2.5rem;\\n\\t\\tmargin: 0.5rem 0;\\n\\t\\tcolor: var(--dark-mint);\\n\\t}\\n\\t.bio h3 {\\n\\t\\tfont-size: 1.5rem;\\n\\t\\tmargin: 0.5rem 0;\\n\\t\\tcolor: var(--dark-mint);\\n\\t\\tfont-weight: 700;\\n\\t\\ttext-transform: capitalize;\\n\\t}\\n\\t.bio section {\\n\\t\\tmargin-top: 2rem;\\n\\t}\\n\\t/* blog */\\n\\t.blog {\\n\\t\\tbackground-color: var(--off-black);\\n\\t\\t/* grid-column: span 2; */\\n\\t\\twidth: 100%;\\n\\t\\tpadding: 2rem;\\n\\t\\theight: 100%;\\n\\t}\\n\\t.blog .tags {\\n\\t\\tmargin-left: 1rem;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-wrap: wrap;\\n\\t}\\n\\t.blog .tag {\\n\\t\\tbackground-color: var(--mint);\\n\\t\\tcolor: var(--off-black);\\n\\t\\tfont-size: 0.85rem;\\n\\t\\tfont-weight: 700;\\n\\t\\tpadding: 0.5rem 0.75rem;\\n\\t\\tborder-radius: 0.75rem;\\n\\t\\tmargin: 0 0.5rem 0.5rem 0;\\n\\t}\\n\\t.blog .tag:hover {\\n\\t\\tbackground-color: var(--fuchsia);\\n\\t}\\n\\t.blog h2 {\\n\\t\\tmargin: 0 0 1rem 0;\\n\\t\\tcolor: var(--off-white);\\n\\t}\\n\\t.blog h3 {\\n\\t\\tmargin: 0 0 1rem 1rem;\\n\\t\\tfont-size: 1rem;\\n\\t\\tcolor: var(--off-white);\\n\\t}\\n\\t.blog li {\\n\\t\\tmargin-bottom: 2rem;\\n\\t\\tcolor: var(--off-white);\\n\\t}\\n\\t.blog a {\\n\\t\\tcolor: var(--off-white);\\n\\t}\\n\\t.blog h1 {\\n\\t\\tcolor: var(--off-white);\\n\\t}\\n\\n\\t/* breakpoints */\\n\\t@media only screen and (min-width: 600px) {\\n\\t\\tmain {\\n\\t\\t\\tdisplay: grid;\\n\\t\\t\\tgrid-template-columns: 1fr 1fr;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA+EC,IAAI,4BAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,aAAa,CAAE,MAAM,CACrB,MAAM,CAAE,IAAI,CACZ,gBAAgB,CAAE,IAAI,WAAW,CAAC,AACnC,CAAC,AAED,8BAAE,CACF,8BAAE,CACF,8BAAE,CACF,6BAAC,CACD,8BAAE,CACF,CAAC,4BAAC,CAAC,AACF,WAAW,CAAE,OAAO,CAAC,CAAC,UAAU,CAChC,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AACD,EAAE,4BAAC,CAAC,AACH,SAAS,CAAE,IAAI,AAChB,CAAC,AACD,CAAC,4BAAC,CAAC,AACF,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,GAAG,AACjB,CAAC,AAKD,MAAM,4BAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,aAAa,CAAE,MAAM,CACrB,WAAW,CAAE,MAAM,AACpB,CAAC,AACD,oBAAM,CAAC,GAAG,cAAC,CAAC,AACX,UAAU,CAAE,IAAI,AACjB,CAAC,AAED,IAAI,4BAAC,CAAC,AACL,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,AACnB,CAAC,AACD,kBAAI,CAAC,EAAE,cAAC,CAAC,AACR,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,MAAM,CAAE,IAAI,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,AACxB,CAAC,AACD,kBAAI,CAAC,EAAE,cAAC,CAAC,AACR,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,MAAM,CAAC,CAAC,CAChB,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AACD,kBAAI,CAAC,EAAE,cAAC,CAAC,AACR,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,MAAM,CAAC,CAAC,CAChB,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,WAAW,CAAE,GAAG,CAChB,cAAc,CAAE,UAAU,AAC3B,CAAC,AACD,kBAAI,CAAC,OAAO,cAAC,CAAC,AACb,UAAU,CAAE,IAAI,AACjB,CAAC,AAED,KAAK,4BAAC,CAAC,AACN,gBAAgB,CAAE,IAAI,WAAW,CAAC,CAElC,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,AACb,CAAC,AACD,mBAAK,CAAC,KAAK,cAAC,CAAC,AACZ,WAAW,CAAE,IAAI,CACjB,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,IAAI,AAChB,CAAC,AACD,mBAAK,CAAC,IAAI,cAAC,CAAC,AACX,gBAAgB,CAAE,IAAI,MAAM,CAAC,CAC7B,KAAK,CAAE,IAAI,WAAW,CAAC,CACvB,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,MAAM,CAAC,OAAO,CACvB,aAAa,CAAE,OAAO,CACtB,MAAM,CAAE,CAAC,CAAC,MAAM,CAAC,MAAM,CAAC,CAAC,AAC1B,CAAC,AACD,mBAAK,CAAC,kBAAI,MAAM,AAAC,CAAC,AACjB,gBAAgB,CAAE,IAAI,SAAS,CAAC,AACjC,CAAC,AACD,mBAAK,CAAC,EAAE,cAAC,CAAC,AACT,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAClB,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AACD,mBAAK,CAAC,EAAE,cAAC,CAAC,AACT,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,IAAI,CACrB,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AACD,mBAAK,CAAC,EAAE,cAAC,CAAC,AACT,aAAa,CAAE,IAAI,CACnB,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AACD,mBAAK,CAAC,CAAC,cAAC,CAAC,AACR,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AACD,mBAAK,CAAC,EAAE,cAAC,CAAC,AACT,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AAGD,OAAO,IAAI,CAAC,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1C,IAAI,4BAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,GAAG,CAAC,GAAG,AAC/B,CAAC,AACF,CAAC"}`
};
var allPosts$1 = { "./blogposts/first-post.md": () => Promise.resolve().then(function() {
  return firstPost;
}), "./blogposts/second-post.md": () => Promise.resolve().then(function() {
  return secondPost;
}), "./blogposts/third-post.md": () => Promise.resolve().then(function() {
  return thirdPost;
}) };
var body$1 = [];
for (let path in allPosts$1) {
  body$1.push(allPosts$1[path]().then(({ metadata: metadata2 }) => {
    return { path, metadata: metadata2 };
  }));
}
var load$1 = async () => {
  const posts = await Promise.all(body$1);
  return { props: { posts } };
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posts } = $$props;
  const dateSortedPosts = posts.sort((post1, post2) => {
    return new Date(post2.metadata.date) - new Date(post1.metadata.date);
  });
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  $$result.css.add(css$4);
  return `${$$result.head += `${$$result.title = `<title>Aaron Hubbard Web Dev</title>`, ""}`, ""}

<main class="${"svelte-32uixy"}"><section class="${"bio svelte-32uixy"}"><figure class="${"svelte-32uixy"}"><img${add_attribute("src", Selfie, 0)} alt="${"selfie"}" class="${"svelte-32uixy"}"></figure>

		<header><h1 class="${"svelte-32uixy"}">Aaron Hubbard</h1>
			<h2 class="${"svelte-32uixy"}">Jamstack Developer</h2>
			<h3 class="${"svelte-32uixy"}">Building fast and functional things for the web</h3></header>
		<section class="${"svelte-32uixy"}"><p class="${"svelte-32uixy"}">Hi! I&#39;m Aaron Hubbard, a family-man and web-developer based in Asheville, NC. By day, I&#39;m an
				application administrator for NOAA&#39;s CLASS project. In my free-time, I&#39;m learning more and
				more about making modern websites.
			</p>
			<p class="${"svelte-32uixy"}">To see some examples of my work, <a href="${"/projects"}" class="${"svelte-32uixy"}">check out my projects</a>.</p>
			<p class="${"svelte-32uixy"}">Drop me a line using the contact link.</p></section></section>

	<section class="${"blog svelte-32uixy"}"><h1 class="${"svelte-32uixy"}">Blogposts</h1>
		<ul>${each(dateSortedPosts, ({ path, metadata: { title: title2, tags: tags2, date: date2 } }) => `<li class="${"svelte-32uixy"}"><h2 class="${"svelte-32uixy"}"><a${add_attribute("href", `${path.replace(".md", "")}`, 0)} class="${"svelte-32uixy"}">${escape(title2)} </a></h2>
					<h3 class="${"svelte-32uixy"}">${escape(new Date(date2).toDateString())}</h3>

					<div class="${"tags svelte-32uixy"}">${each(tags2, (tag) => `<a class="${"tag svelte-32uixy"}"${add_attribute("href", `/tags/${tag}`, 0)}>#${escape(tag)} </a>`)}</div>
				</li>`)}</ul></section>
</main>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  load: load$1
});
var css$3 = {
  code: "article.svelte-19ilzgr{padding:2rem;max-width:600px;margin:0 auto}",
  map: '{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<div class=\\"grid\\">\\n\\t<article>\\n\\t\\t<slot />\\n\\t</article>\\n</div>\\n\\n<style>\\n\\tarticle {\\n\\t\\tpadding: 2rem;\\n\\t\\tmax-width: 600px;\\n\\t\\tmargin: 0 auto;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAOC,OAAO,eAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,IAAI,AACf,CAAC"}'
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<div class="${"grid"}"><article class="${"svelte-19ilzgr"}">${slots.default ? slots.default({}) : ``}</article>
</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
var css$2 = {
  code: "img.svelte-1p3ce2z{max-width:100px}",
  map: '{"version":3,"file":"second-post.md","sources":["second-post.md"],"sourcesContent":["<script context=\\"module\\">\\n\\texport const metadata = {\\"title\\":\\"The Arc of History Bends Towards Arch\\",\\"tags\\":[\\"arch linux\\",\\"aikido website\\",\\"svelteKit\\",\\"vacation\\"],\\"date\\":\\"2021-08-04T00:00:00.000Z\\"};\\n\\tconst { title, tags, date } = metadata;\\n<\/script>\\n<style>\\n\\n  img {\\n    max-width: 100px;\\n  }\\n</style>\\n\\n<h1>{title}</h1>\\n<h2>Published {new Date(date).toDateString()}</h2>\\n<p>It\u2019s been a weird month.</p>\\n<h2>Vacation</h2>\\n<p>I went to the Beach in late July and stayed in a palatial mansion. The master suite was as big as my house. It rained every day, but we found time to wrestle the toddler to the shore.</p>\\n<p>Coming back to the day-to-day was hard. I should have taken a longer break.</p>\\n<p><img\\n  src=\\"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png\\"\\n  alt=\\"arch logo\\"\\n></p>\\n<h2>Svelte</h2>\\n<p>I\u2019m still working on the dojo website. I realized that with as many stakeholders as are involved, it would need to have some kind of CMS backend. I hooked the page up to Sanity CMS. Prior to this, I had <code>prerender=true</code> set on all of the pages, but I realized this would necessitate a build step for each update by each user. I think I could use build hooks for this eventually (and I may once we get things ironed out), but in the short term it made sense to just take the site SSR.</p>\\n<p>I haven\u2019t shared the CMS portal with the stakeholders yet. I\u2019m curious how it\u2019s going to go. It seems pretty intuitive to me, but I built it. I\u2019m anticipating that it might be a struggle.</p>\\n<p><img\\n  src=\\"https://cdn0.iconfinder.com/data/icons/flat-round-system/512/archlinux-512.png\\"\\n  alt=\\"arch logo\\"\\n></p>\\n<h2>Arch Linux</h2>\\n<p>I needed a little break and found myself getting interested in tricking out a Linux box again. I\u2019ve been using Fedora for a year or more, but sometimes you just want to make your life a little harder. So I carved out a little partition for Arch and I\u2019ve spent a delightful few days ironing out the kinks.</p>\\n<p>It\u2019s crazy how much you take for granted. I had to learn how to manually bring up the network interface and assign an IP and routes. I had to learn more about Linux bootloaders. I installed a keyboard driven tiling window manager. I found my own screen locker. I wrestled with NVIDIA drivers. Good Times.</p>\\n<p><img src=\\"https://syntax.fm/static/logo.png\\" alt=\\"syntax FM logo\\"></p>\\n<h2>Syntax FM</h2>\\n<p>Oh, one other thing. I was listening to the <a\\n  href=\\"https://syntax.fm/\\"\\n  rel=\\"nofollow\\"\\n>Syntax Podcast</a> today and one of my questions got accepted and answered by Wes and Scott! I love these guys, and having them answer my question was an unexpected honor. I was afraid it was too dumb to warant consideration!</p>\\n\\n"],"names":[],"mappings":"AAME,GAAG,eAAC,CAAC,AACH,SAAS,CAAE,KAAK,AAClB,CAAC"}'
};
var metadata$2 = {
  "title": "The Arc of History Bends Towards Arch",
  "tags": ["arch linux", "aikido website", "svelteKit", "vacation"],
  "date": "2021-08-04T00:00:00.000Z"
};
var { title: title$2, tags: tags$2, date: date$2 } = metadata$2;
var Second_post = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<h1>${escape(title$2)}</h1>
<h2>Published ${escape(new Date(date$2).toDateString())}</h2>
<p>It\u2019s been a weird month.</p>
<h2>Vacation</h2>
<p>I went to the Beach in late July and stayed in a palatial mansion. The master suite was as big as my house. It rained every day, but we found time to wrestle the toddler to the shore.</p>
<p>Coming back to the day-to-day was hard. I should have taken a longer break.</p>
<p><img src="${"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png"}" alt="${"arch logo"}" class="${"svelte-1p3ce2z"}"></p>
<h2>Svelte</h2>
<p>I\u2019m still working on the dojo website. I realized that with as many stakeholders as are involved, it would need to have some kind of CMS backend. I hooked the page up to Sanity CMS. Prior to this, I had <code>prerender=true</code> set on all of the pages, but I realized this would necessitate a build step for each update by each user. I think I could use build hooks for this eventually (and I may once we get things ironed out), but in the short term it made sense to just take the site SSR.</p>
<p>I haven\u2019t shared the CMS portal with the stakeholders yet. I\u2019m curious how it\u2019s going to go. It seems pretty intuitive to me, but I built it. I\u2019m anticipating that it might be a struggle.</p>
<p><img src="${"https://cdn0.iconfinder.com/data/icons/flat-round-system/512/archlinux-512.png"}" alt="${"arch logo"}" class="${"svelte-1p3ce2z"}"></p>
<h2>Arch Linux</h2>
<p>I needed a little break and found myself getting interested in tricking out a Linux box again. I\u2019ve been using Fedora for a year or more, but sometimes you just want to make your life a little harder. So I carved out a little partition for Arch and I\u2019ve spent a delightful few days ironing out the kinks.</p>
<p>It\u2019s crazy how much you take for granted. I had to learn how to manually bring up the network interface and assign an IP and routes. I had to learn more about Linux bootloaders. I installed a keyboard driven tiling window manager. I found my own screen locker. I wrestled with NVIDIA drivers. Good Times.</p>
<p><img src="${"https://syntax.fm/static/logo.png"}" alt="${"syntax FM logo"}" class="${"svelte-1p3ce2z"}"></p>
<h2>Syntax FM</h2>
<p>Oh, one other thing. I was listening to the <a href="${"https://syntax.fm/"}" rel="${"nofollow"}">Syntax Podcast</a> today and one of my questions got accepted and answered by Wes and Scott! I love these guys, and having them answer my question was an unexpected honor. I was afraid it was too dumb to warant consideration!</p>`;
});
var secondPost = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Second_post,
  metadata: metadata$2
});
var metadata$1 = {
  "title": "Inaugural Post",
  "tags": ["svelteKit", "blogging"],
  "date": "2021-07-13T15:00:00.000Z"
};
var { title: title$1, tags: tags$1, date: date$1 } = metadata$1;
var First_post = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1>${escape(title$1)}</h1>
<h2>Published ${escape(new Date(date$1).toDateString())}</h2>
<p>Well, here we go, the very first blog post.</p>
<p>I created this blog using a <a href="${"https://www.youtube.com/watch?v=sKKgT0SEioI&list=PLm_Qt4aKpfKgonq1zwaCS6kOD-nbOKx7V"}" rel="${"nofollow"}">tutorial by WebJeda</a>. TBH, it was a bit rough around the edges, but it got me where I needed to go.</p>
<p>I\u2019ve never successfully been able to stick to a blog. This seems to be a common enough problem that I encounter more content about how to stick to your blog than actual content in a blog. Jokes aside, I do use blogs that developers have written on occasion to solve a problem I\u2019m having that they\u2019ve had.</p>
<p>That will be the animating principle of this blog. Write about a problem and it\u2019s solution.</p>`;
});
var firstPost = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": First_post,
  metadata: metadata$1
});
var metadata = {
  "title": "SvelteKit Vs. Gatsby, TailwindCSS Vs. Itself.",
  "tags": [
    "aikido website",
    "graphic design",
    "SvelteKit vs. Gatsby",
    "TailwindCSS",
    "Vite is Good"
  ],
  "date": "2021-09-01T00:00:00.000Z"
};
var { title, tags, date } = metadata;
var Third_post = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1>${escape(title)}</h1>
<h2>Published ${escape(new Date(date).toDateString())}</h2>
<h2>What have I been up to for a month?</h2>
<p>I continued working on the Asheville Aikido website. I spent some time working on the front-end design, including designing the logo. I threw a lot at the wall and the client didn\u2019t particularly like any of it. I think part of the issue is that I\u2019m doing this project on spec, unbidden by anyone.</p>
<p>The project has certainly made me see the advantage of going into a project with a clear idea of what the goals are. I\u2019m also clarifying my own skills, aptitudes, and inclinations. What I\u2019m learning is that I enjoy and am better at the technical side of this work, rather than the graphic design. I\u2019m gaining a real appreciation for how much experience is needed to make a good-looking website.</p>
<p>The question I am asking myself is how much skill it makes sense to develop with design tools. Should I learn Figma? Adobe CS?</p>
<h2>Gatsby vs. SvelteKit</h2>
<p>I wanted to touch up my portfolio site that is currently done in Gatsby, but found myself bristling to be back in React World. Svelte\u2019s virtues were not immediately apparent, but now I am appreciating the more-logical project layout and the clean syntax.</p>
<p>I decided that I\u2019d like to move my portfolio over to SvelteKit and integrate it with this blog, which was already built in SvelteKit. Not hard at all. My biggest quibble with using SvelteKit for these simple projects is the lact of image handling. Gatsby excels here. NextJS is pretty good. SvelteKit\u2026not so much. I ran into these issues with the Aikido Website, but luckily when I added the Sanity backend, Sanity managed some of the image headaches for me.</p>
<p>Also, after experiencing the speed of Vite, it was hard to go back to waiting on Gatsby to compile. It\u2019s only seconds, but it makes for a better DX.</p>
<h2>Is TailwindCSS worth it?</h2>
<p>This is a controversial subject, I know. I\u2019m still on the fence. I decided to stay away from Tailwind for the portfolio redesign. Svelte scopes the CSS by default, so you don\u2019t have to add any tooling like \u2018styled components\u2019. Also, I found myself getting annoyed when I just wanted to style a dozen identical components, or worse, change styling on a dozen identical components that had already been styled. Tailwinds seems to suggest making components when you run into this issue, which I don\u2019t love. When the code gets too component-heavy (e.g. having a component for a specific type of list item) it starts to get confusing for me. I could make custom styles I guess, but at some point you\u2019ve basically found yourself re-creating the cascade.</p>
<p>One thing I read about Tailwind is that \u201Cthe complexity has to live somewhere.\u201D I really liked that. Adopt it or not, the complexity has to live somewhere. Do you want it integrated with the HTML or in a separate CSS section? I\u2019m leaning towards the latter.</p>
<p>Lastly, the Tailwinds post-processor seemed to be breaking Vite\u2019s Hot Module Reloading and I couldn\u2019t find any answers online or in the Discord. Without it, HMR works like a charm, and man, is Vite fast!</p>`;
});
var thirdPost = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Third_post,
  metadata
});
var css$1 = {
  code: ".project.svelte-2caqjj.svelte-2caqjj{display:grid;padding:2rem 2rem 4rem 2rem;max-width:1000px;margin:0 auto}.project.svelte-2caqjj.svelte-2caqjj:nth-child(2){background-color:var(--off-black)}.project.svelte-2caqjj:nth-child(2) a.svelte-2caqjj{color:var(--mint)}.project.svelte-2caqjj:nth-child(2) h2.svelte-2caqjj{color:var(--mint)}.project.svelte-2caqjj:nth-child(2) p.svelte-2caqjj{color:white}img.svelte-2caqjj.svelte-2caqjj{width:100%}.project.svelte-2caqjj h1.svelte-2caqjj{margin:0 0 2rem 0;font-size:4rem}.project.svelte-2caqjj h1 a.svelte-2caqjj{color:var(--dark-mint)}h2.svelte-2caqjj.svelte-2caqjj{margin:0 0 1.5rem 0;font-size:2rem;color:var(--dark-mint)}p.svelte-2caqjj.svelte-2caqjj{margin:0 0 2rem 0}img.svelte-2caqjj.svelte-2caqjj{margin-top:2rem;border:2px solid var(--off-black)}",
  map: '{"version":3,"file":"Project.svelte","sources":["Project.svelte"],"sourcesContent":["<script>\\n\\texport let project;\\n<\/script>\\n\\n<div class=\\"project\\">\\n\\t<h1><a href={project.url}>{project.title}</a></h1>\\n\\t<h2>{project.description}</h2>\\n\\t<p>{project.text}</p>\\n\\t<img src={project.image} alt=\\"screencap of project\\" />\\n</div>\\n\\n<style>\\n\\t.project {\\n\\t\\tdisplay: grid;\\n\\t\\tpadding: 2rem 2rem 4rem 2rem;\\n\\t\\tmax-width: 1000px;\\n\\t\\tmargin: 0 auto;\\n\\t}\\n\\t.project:nth-child(2) {\\n\\t\\tbackground-color: var(--off-black);\\n\\t}\\n\\n\\t.project:nth-child(2) a {\\n\\t\\tcolor: var(--mint);\\n\\t}\\n\\t.project:nth-child(2) h2 {\\n\\t\\tcolor: var(--mint);\\n\\t}\\n\\t.project:nth-child(2) p {\\n\\t\\tcolor: white;\\n\\t}\\n\\n\\timg {\\n\\t\\t/* border: 2px solid var(--nord3); */\\n\\t\\twidth: 100%;\\n\\t}\\n\\n\\t.project h1 {\\n\\t\\tmargin: 0 0 2rem 0;\\n\\t\\tfont-size: 4rem;\\n\\t}\\n\\n\\t.project h1 a {\\n\\t\\tcolor: var(--dark-mint);\\n\\t}\\n\\n\\th2 {\\n\\t\\tmargin: 0 0 1.5rem 0;\\n\\t\\tfont-size: 2rem;\\n\\t\\tcolor: var(--dark-mint);\\n\\t}\\n\\tp {\\n\\t\\tmargin: 0 0 2rem 0;\\n\\t}\\n\\timg {\\n\\t\\tmargin-top: 2rem;\\n\\t\\tborder: 2px solid var(--off-black);\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAYC,QAAQ,4BAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,CAC5B,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,CAAC,CAAC,IAAI,AACf,CAAC,AACD,oCAAQ,WAAW,CAAC,CAAC,AAAC,CAAC,AACtB,gBAAgB,CAAE,IAAI,WAAW,CAAC,AACnC,CAAC,AAED,sBAAQ,WAAW,CAAC,CAAC,CAAC,CAAC,cAAC,CAAC,AACxB,KAAK,CAAE,IAAI,MAAM,CAAC,AACnB,CAAC,AACD,sBAAQ,WAAW,CAAC,CAAC,CAAC,EAAE,cAAC,CAAC,AACzB,KAAK,CAAE,IAAI,MAAM,CAAC,AACnB,CAAC,AACD,sBAAQ,WAAW,CAAC,CAAC,CAAC,CAAC,cAAC,CAAC,AACxB,KAAK,CAAE,KAAK,AACb,CAAC,AAED,GAAG,4BAAC,CAAC,AAEJ,KAAK,CAAE,IAAI,AACZ,CAAC,AAED,sBAAQ,CAAC,EAAE,cAAC,CAAC,AACZ,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAClB,KAAK,IAAI,CAAE,IAAI,AAChB,CAAC,AAED,sBAAQ,CAAC,EAAE,CAAC,CAAC,cAAC,CAAC,AACd,KAAK,CAAE,IAAI,MAAM,KAAK,CAAC,AACxB,CAAC,AAED,EAAE,4BAAC,CAAC,AACH,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CACpB,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,WAAW,CAAC,AACxB,CAAC,AACD,CAAC,4BAAC,CAAC,AACF,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,AACnB,CAAC,AACD,GAAG,4BAAC,CAAC,AACJ,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,WAAW,CAAC,AACnC,CAAC"}'
};
var Project = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { project } = $$props;
  if ($$props.project === void 0 && $$bindings.project && project !== void 0)
    $$bindings.project(project);
  $$result.css.add(css$1);
  return `<div class="${"project svelte-2caqjj"}"><h1 class="${"svelte-2caqjj"}"><a${add_attribute("href", project.url, 0)} class="${"svelte-2caqjj"}">${escape(project.title)}</a></h1>
	<h2 class="${"svelte-2caqjj"}">${escape(project.description)}</h2>
	<p class="${"svelte-2caqjj"}">${escape(project.text)}</p>
	<img${add_attribute("src", project.image, 0)} alt="${"screencap of project"}" class="${"svelte-2caqjj"}">
</div>`;
});
var aikidoScreenshot = "/_app/assets/aikikai-8e0c06c0.png";
var bacchusV1Screenshot = "/_app/assets/bacchus_atlas_v1_screencap-0769a7c5.png";
var bacchusExpandedScreenshot = "/_app/assets/bacchus_atlas_expanded_screencap-78d1f7f9.png";
var css = {
  code: "article.svelte-ompqja{display:grid;row-gap:4rem;padding-bottom:4rem;background-color:var(--off-white);padding-top:2rem}",
  map: `{"version":3,"file":"projects.svelte","sources":["projects.svelte"],"sourcesContent":["<script>\\n\\timport Project from '$lib/components/Project.svelte';\\n\\n\\timport aikidoScreenshot from '$lib/assets/aikikai.png';\\n\\timport bacchusV1Screenshot from '$lib/assets/bacchus_atlas_v1_screencap.png';\\n\\timport bacchusExpandedScreenshot from '$lib/assets/bacchus_atlas_expanded_screencap.png';\\n\\n\\tlet projects = [\\n\\t\\t{\\n\\t\\t\\ttitle: 'Asheville Aikikai',\\n\\t\\t\\timage: aikidoScreenshot,\\n\\t\\t\\turl: 'https://development--asheville-aikikai-refresh.netlify.app/',\\n\\t\\t\\tdescription: 'A landing page for a martial arts dojo',\\n\\t\\t\\ttext:\\n\\t\\t\\t\\t'I built this site on spec for a local dojo in in SvelteKit. Orignally designed to be a static site, I later converted it to server-side rendering to accomodate a backend CMS, which I did in Sanity to allow stakeholders to dynamically edit content.'\\n\\t\\t},\\n\\t\\t{\\n\\t\\t\\ttitle: 'Bacchus Atlas Expanded',\\n\\t\\t\\timage: bacchusExpandedScreenshot,\\n\\t\\t\\turl: 'https://www.bacchusatlas.com',\\n\\t\\t\\tdescription: 'A site for cataloging and geolocating wine',\\n\\t\\t\\ttext:\\n\\t\\t\\t\\t'Bacchus Atlas was a rework of the original page I built in Gatsby, after learning the limitations of the Sanity backend. This site is build in NextJS. It utilizes Apollo and GQL. It runs KeystoneJS on the backend to handle authentication, and runs postgres for its database. It is still a work in progress, but essential functionality is in place. A user can log in, add wines to the database, geolocate them on a map, and rate them.'\\n\\t\\t},\\n\\t\\t{\\n\\t\\t\\ttitle: 'Bacchus Atlas v.1',\\n\\t\\t\\timage: bacchusV1Screenshot,\\n\\t\\t\\turl: 'https://bauccus-atlas.netlify.app/',\\n\\t\\t\\tdescription: 'A site for displaying wine',\\n\\t\\t\\ttext:\\n\\t\\t\\t\\t'Bauccus Atlas is a static page generated with Gatsby with a Sanity backend CMS. Based on, but not identical to, a tutorial given by Wes Bos.'\\n\\t\\t}\\n\\t];\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>Projects</title>\\n</svelte:head>\\n\\n<article>\\n\\t{#each projects as project}\\n\\t\\t<Project {project} />\\n\\t{/each}\\n</article>\\n\\n<style>\\n\\tarticle {\\n\\t\\tdisplay: grid;\\n\\t\\trow-gap: 4rem;\\n\\t\\tpadding-bottom: 4rem;\\n\\t\\tbackground-color: var(--off-white);\\n\\t\\tpadding-top: 2rem;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA8CC,OAAO,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,IAAI,CACpB,gBAAgB,CAAE,IAAI,WAAW,CAAC,CAClC,WAAW,CAAE,IAAI,AAClB,CAAC"}`
};
var Projects = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let projects2 = [
    {
      title: "Asheville Aikikai",
      image: aikidoScreenshot,
      url: "https://development--asheville-aikikai-refresh.netlify.app/",
      description: "A landing page for a martial arts dojo",
      text: "I built this site on spec for a local dojo in in SvelteKit. Orignally designed to be a static site, I later converted it to server-side rendering to accomodate a backend CMS, which I did in Sanity to allow stakeholders to dynamically edit content."
    },
    {
      title: "Bacchus Atlas Expanded",
      image: bacchusExpandedScreenshot,
      url: "https://www.bacchusatlas.com",
      description: "A site for cataloging and geolocating wine",
      text: "Bacchus Atlas was a rework of the original page I built in Gatsby, after learning the limitations of the Sanity backend. This site is build in NextJS. It utilizes Apollo and GQL. It runs KeystoneJS on the backend to handle authentication, and runs postgres for its database. It is still a work in progress, but essential functionality is in place. A user can log in, add wines to the database, geolocate them on a map, and rate them."
    },
    {
      title: "Bacchus Atlas v.1",
      image: bacchusV1Screenshot,
      url: "https://bauccus-atlas.netlify.app/",
      description: "A site for displaying wine",
      text: "Bauccus Atlas is a static page generated with Gatsby with a Sanity backend CMS. Based on, but not identical to, a tutorial given by Wes Bos."
    }
  ];
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Projects</title>`, ""}`, ""}

<article class="${"svelte-ompqja"}">${each(projects2, (project) => `${validate_component(Project, "Project").$$render($$result, { project }, {}, {})}`)}
</article>`;
});
var projects = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Projects
});
var allPosts = { "../blogposts/first-post.md": () => Promise.resolve().then(function() {
  return firstPost;
}), "../blogposts/second-post.md": () => Promise.resolve().then(function() {
  return secondPost;
}), "../blogposts/third-post.md": () => Promise.resolve().then(function() {
  return thirdPost;
}) };
var body = [];
for (let path in allPosts) {
  body.push(allPosts[path]().then(({ metadata: metadata2 }) => {
    return { path, metadata: metadata2 };
  }));
}
var load = async ({ page }) => {
  const posts = await Promise.all(body);
  const tag = page.params.tag;
  const filteredPosts = posts.filter((post) => {
    return post.metadata.tags.includes(tag);
  });
  return { props: { filteredPosts, tag } };
};
var U5Btagu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { filteredPosts } = $$props;
  let { tag } = $$props;
  if ($$props.filteredPosts === void 0 && $$bindings.filteredPosts && filteredPosts !== void 0)
    $$bindings.filteredPosts(filteredPosts);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  return `<h1>${escape(tag)}</h1>
${each(filteredPosts, (post) => `<li><a href="${"post.path"}">${escape(post.metadata.title)}</a></li>`)}`;
});
var _tag_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Btagu5D,
  load
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body: body2, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body2 === "string" ? Buffer.from(body2, encoding) : body2;
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
