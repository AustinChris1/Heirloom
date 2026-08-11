import{createRequire as __cr}from'node:module';const require=__cr(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod2) => function __require2() {
  try {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  } catch (e) {
    throw mod2 = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/version.js
var version;
var init_version = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/version.js"() {
    version = "1.2.3";
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/errors.js
var BaseError;
var init_errors = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/errors.js"() {
    init_version();
    BaseError = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
        const docsPath = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
          ...details ? [`Details: ${details}`] : [],
          `Version: abitype@${version}`
        ].join("\n");
        super(message);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiTypeError"
        });
        if (args.cause)
          this.cause = args.cause;
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMessage;
      }
    };
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match?.groups;
}
var bytesRegex, integerRegex, isTupleRegex;
var init_regex = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/regex.js"() {
    bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
    isTupleRegex = /^\(.+?\).*?$/;
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
var structSignatureRegex, modifiers, functionModifiers;
var init_signatures = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/runtime/signatures.js"() {
    init_regex();
    structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
    modifiers = /* @__PURE__ */ new Set([
      "memory",
      "indexed",
      "storage",
      "calldata"
    ]);
    functionModifiers = /* @__PURE__ */ new Set([
      "calldata",
      "memory",
      "storage"
    ]);
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var UnknownTypeError, UnknownSolidityTypeError;
var init_abiItem = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/abiItem.js"() {
    init_errors();
    UnknownTypeError = class extends BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [
            `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownTypeError"
        });
      }
    };
    UnknownSolidityTypeError = class extends BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [`Type "${type}" is not a valid ABI type.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSolidityTypeError"
        });
      }
    };
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidAbiParametersError, InvalidParameterError, SolidityProtectedKeywordError, InvalidModifierError, InvalidFunctionModifierError, InvalidAbiTypeParameterError;
var init_abiParameter = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js"() {
    init_errors();
    InvalidAbiParametersError = class extends BaseError {
      constructor({ params }) {
        super("Failed to parse ABI parameters.", {
          details: `parseAbiParameters(${JSON.stringify(params, null, 2)})`,
          docsPath: "/api/human#parseabiparameters-1"
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiParametersError"
        });
      }
    };
    InvalidParameterError = class extends BaseError {
      constructor({ param }) {
        super("Invalid ABI parameter.", {
          details: param
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParameterError"
        });
      }
    };
    SolidityProtectedKeywordError = class extends BaseError {
      constructor({ param, name }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SolidityProtectedKeywordError"
        });
      }
    };
    InvalidModifierError = class extends BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidModifierError"
        });
      }
    };
    InvalidFunctionModifierError = class extends BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
            `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidFunctionModifierError"
        });
      }
    };
    InvalidAbiTypeParameterError = class extends BaseError {
      constructor({ abiParameter }) {
        super("Invalid ABI parameter.", {
          details: JSON.stringify(abiParameter, null, 2),
          metaMessages: ["ABI parameter type is invalid."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiTypeParameterError"
        });
      }
    };
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError, InvalidStructSignatureError;
var init_signature = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/signature.js"() {
    init_errors();
    InvalidSignatureError = class extends BaseError {
      constructor({ signature, type }) {
        super(`Invalid ${type} signature.`, {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSignatureError"
        });
      }
    };
    InvalidStructSignatureError = class extends BaseError {
      constructor({ signature }) {
        super("Invalid struct signature.", {
          details: signature,
          metaMessages: ["No properties exist."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidStructSignatureError"
        });
      }
    };
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError;
var init_struct = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/struct.js"() {
    init_errors();
    CircularReferenceError = class extends BaseError {
      constructor({ type }) {
        super("Circular reference detected.", {
          metaMessages: [`Struct "${type}" is a circular reference.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "CircularReferenceError"
        });
      }
    };
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError;
var init_splitParameters = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js"() {
    init_errors();
    InvalidParenthesisError = class extends BaseError {
      constructor({ current, depth }) {
        super("Unbalanced parentheses.", {
          metaMessages: [
            `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
          ],
          details: `Depth "${depth}"`
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParenthesisError"
        });
      }
    };
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function getParameterCacheKey(param, type, structs) {
  let structKey = "";
  if (structs)
    for (const struct of Object.entries(structs)) {
      if (!struct)
        continue;
      let propertyKey = "";
      for (const property of struct[1]) {
        propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
      }
      structKey += `(${struct[0]}{${propertyKey}})`;
    }
  if (type)
    return `${type}:${param}${structKey}`;
  return `${param}${structKey}`;
}
var parameterCache;
var init_cache = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/runtime/cache.js"() {
    parameterCache = /* @__PURE__ */ new Map([
      // Unnamed
      ["address", { type: "address" }],
      ["bool", { type: "bool" }],
      ["bytes", { type: "bytes" }],
      ["bytes32", { type: "bytes32" }],
      ["int", { type: "int256" }],
      ["int256", { type: "int256" }],
      ["string", { type: "string" }],
      ["uint", { type: "uint256" }],
      ["uint8", { type: "uint8" }],
      ["uint16", { type: "uint16" }],
      ["uint24", { type: "uint24" }],
      ["uint32", { type: "uint32" }],
      ["uint64", { type: "uint64" }],
      ["uint96", { type: "uint96" }],
      ["uint112", { type: "uint112" }],
      ["uint160", { type: "uint160" }],
      ["uint192", { type: "uint192" }],
      ["uint256", { type: "uint256" }],
      // Named
      ["address owner", { type: "address", name: "owner" }],
      ["address to", { type: "address", name: "to" }],
      ["bool approved", { type: "bool", name: "approved" }],
      ["bytes _data", { type: "bytes", name: "_data" }],
      ["bytes data", { type: "bytes", name: "data" }],
      ["bytes signature", { type: "bytes", name: "signature" }],
      ["bytes32 hash", { type: "bytes32", name: "hash" }],
      ["bytes32 r", { type: "bytes32", name: "r" }],
      ["bytes32 root", { type: "bytes32", name: "root" }],
      ["bytes32 s", { type: "bytes32", name: "s" }],
      ["string name", { type: "string", name: "name" }],
      ["string symbol", { type: "string", name: "symbol" }],
      ["string tokenURI", { type: "string", name: "tokenURI" }],
      ["uint tokenId", { type: "uint256", name: "tokenId" }],
      ["uint8 v", { type: "uint8", name: "v" }],
      ["uint256 balance", { type: "uint256", name: "balance" }],
      ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
      ["uint256 value", { type: "uint256", name: "value" }],
      // Indexed
      [
        "event:address indexed from",
        { type: "address", name: "from", indexed: true }
      ],
      ["event:address indexed to", { type: "address", name: "to", indexed: true }],
      [
        "event:uint indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ],
      [
        "event:uint256 indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ]
    ]);
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseAbiParameter(param, options) {
  const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match)
    throw new InvalidParameterError({ param });
  if (match.name && isSolidityKeyword(match.name))
    throw new SolidityProtectedKeywordError({ param, name: match.name });
  const name = match.name ? { name: match.name } : {};
  const indexed = match.modifier === "indexed" ? { indexed: true } : {};
  const structs = options?.structs ?? {};
  let type;
  let components = {};
  if (isTuple) {
    type = "tuple";
    const params = splitParameters(match.type);
    const components_ = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      components_.push(parseAbiParameter(params[i], { structs }));
    }
    components = { components: components_ };
  } else if (match.type in structs) {
    type = "tuple";
    components = { components: structs[match.type] };
  } else if (dynamicIntegerRegex.test(match.type)) {
    type = `${match.type}256`;
  } else if (match.type === "address payable") {
    type = "address";
  } else {
    type = match.type;
    if (!(options?.type === "struct") && !isSolidityType(type))
      throw new UnknownSolidityTypeError({ type });
  }
  if (match.modifier) {
    if (!options?.modifiers?.has?.(match.modifier))
      throw new InvalidModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
    if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
  }
  const abiParameter = {
    type: `${type}${match.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter);
  return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
  const length = params.trim().length;
  for (let i = 0; i < length; i++) {
    const char = params[i];
    const tail = params.slice(i + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters(tail, result, `${current}${char}`, depth);
    }
  }
  if (current === "")
    return result;
  if (depth !== 0)
    throw new InvalidParenthesisError({ current, depth });
  result.push(current.trim());
  return result;
}
function isSolidityType(type) {
  return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
}
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type, isArray) {
  return isArray || type === "bytes" || type === "string" || type === "tuple";
}
var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
var init_utils = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/runtime/utils.js"() {
    init_regex();
    init_abiItem();
    init_abiParameter();
    init_splitParameters();
    init_cache();
    init_signatures();
    abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    dynamicIntegerRegex = /^u?int$/;
    protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
  const shallowStructs = {};
  const signaturesLength = signatures.length;
  for (let i = 0; i < signaturesLength; i++) {
    const signature = signatures[i];
    if (!isStructSignature(signature))
      continue;
    const match = execStructSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "struct" });
    const properties = match.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0; k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature });
    shallowStructs[match.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i = 0; i < entriesLength; i++) {
    const [name, parameters] = entries[i];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
function resolveStructs(abiParameters = [], structs = {}, ancestors = /* @__PURE__ */ new Set()) {
  const components = [];
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    const isTuple = isTupleRegex.test(abiParameter.type);
    if (isTuple)
      components.push(abiParameter);
    else {
      const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
      if (!match?.type)
        throw new InvalidAbiTypeParameterError({ abiParameter });
      const { array, type } = match;
      if (type in structs) {
        if (ancestors.has(type))
          throw new CircularReferenceError({ type });
        components.push({
          ...abiParameter,
          type: `tuple${array ?? ""}`,
          components: resolveStructs(structs[type], structs, /* @__PURE__ */ new Set([...ancestors, type]))
        });
      } else {
        if (isSolidityType(type))
          components.push(abiParameter);
        else
          throw new UnknownTypeError({ type });
      }
    }
  }
  return components;
}
var typeWithoutTupleRegex;
var init_structs = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/runtime/structs.js"() {
    init_regex();
    init_abiItem();
    init_abiParameter();
    init_signature();
    init_struct();
    init_signatures();
    init_utils();
    typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/parseAbiParameters.js
function parseAbiParameters(params) {
  const abiParameters = [];
  if (typeof params === "string") {
    const parameters = splitParameters(params);
    const length = parameters.length;
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(parameters[i], { modifiers }));
    }
  } else {
    const structs = parseStructs(params);
    const length = params.length;
    for (let i = 0; i < length; i++) {
      const signature = params[i];
      if (isStructSignature(signature))
        continue;
      const parameters = splitParameters(signature);
      const length2 = parameters.length;
      for (let k = 0; k < length2; k++) {
        abiParameters.push(parseAbiParameter(parameters[k], { modifiers, structs }));
      }
    }
  }
  if (abiParameters.length === 0)
    throw new InvalidAbiParametersError({ params });
  return abiParameters;
}
var init_parseAbiParameters = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/human-readable/parseAbiParameters.js"() {
    init_abiParameter();
    init_signatures();
    init_structs();
    init_utils();
    init_utils();
  }
});

// ../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/exports/index.js
var init_exports = __esm({
  "../../../node_modules/.pnpm/abitype@1.2.3_typescript@5.9.3_zod@4.4.3/node_modules/abitype/dist/esm/exports/index.js"() {
    init_parseAbiParameters();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
  if (param.type.startsWith("tuple")) {
    return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
var init_formatAbiItem = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/abi/formatAbiItem.js"() {
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/isHex.js"() {
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/size.js
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/size.js"() {
    init_isHex();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/version.js
var version2;
var init_version2 = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/version.js"() {
    version2 = "2.55.13";
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
    return walk(err.cause, fn);
  return fn ? null : err;
}
var errorConfig, BaseError2;
var init_base = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/base.js"() {
    init_version2();
    errorConfig = {
      getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
      version: `viem@${version2}`
    };
    BaseError2 = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.details;
          if (args.cause?.message)
            return args.cause.message;
          return args.details;
        })();
        const docsPath = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.docsPath || args.docsPath;
          return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath });
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsUrl ? [`Docs: ${docsUrl}`] : [],
          ...details ? [`Details: ${details}`] : [],
          ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
        ].join("\n");
        super(message, args.cause ? { cause: args.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version2;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/abi.js
var AbiDecodingDataSizeTooSmallError, AbiDecodingZeroDataError, AbiEncodingArrayLengthMismatchError, AbiEncodingBytesSizeMismatchError, AbiEncodingLengthMismatchError, InvalidAbiEncodingTypeError, InvalidAbiDecodingTypeError, InvalidArrayError;
var init_abi = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/abi.js"() {
    init_formatAbiItem();
    init_size();
    init_base();
    AbiDecodingDataSizeTooSmallError = class extends BaseError2 {
      constructor({ data, params, size: size2 }) {
        super([`Data size of ${size2} bytes is too small for given parameters.`].join("\n"), {
          metaMessages: [
            `Params: (${formatAbiParams(params, { includeName: true })})`,
            `Data:   ${data} (${size2} bytes)`
          ],
          name: "AbiDecodingDataSizeTooSmallError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
        this.params = params;
        this.size = size2;
      }
    };
    AbiDecodingZeroDataError = class extends BaseError2 {
      constructor({ cause } = {}) {
        super('Cannot decode zero data ("0x") with ABI parameters.', {
          name: "AbiDecodingZeroDataError",
          cause
        });
      }
    };
    AbiEncodingArrayLengthMismatchError = class extends BaseError2 {
      constructor({ expectedLength, givenLength, type }) {
        super([
          `ABI encoding array length mismatch for type ${type}.`,
          `Expected length: ${expectedLength}`,
          `Given length: ${givenLength}`
        ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
      }
    };
    AbiEncodingBytesSizeMismatchError = class extends BaseError2 {
      constructor({ expectedSize, value }) {
        super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
      }
    };
    AbiEncodingLengthMismatchError = class extends BaseError2 {
      constructor({ expectedLength, givenLength }) {
        super([
          "ABI encoding params/values length mismatch.",
          `Expected length (params): ${expectedLength}`,
          `Given length (values): ${givenLength}`
        ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
      }
    };
    InvalidAbiEncodingTypeError = class extends BaseError2 {
      constructor(type, { docsPath }) {
        super([
          `Type "${type}" is not a valid encoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath, name: "InvalidAbiEncodingType" });
      }
    };
    InvalidAbiDecodingTypeError = class extends BaseError2 {
      constructor(type, { docsPath }) {
        super([
          `Type "${type}" is not a valid decoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath, name: "InvalidAbiDecodingType" });
      }
    };
    InvalidArrayError = class extends BaseError2 {
      constructor(value) {
        super([`Value "${value}" is not a valid array.`].join("\n"), {
          name: "InvalidArrayError"
        });
      }
    };
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError;
var init_data = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/data.js"() {
    init_base();
    SliceOffsetOutOfBoundsError = class extends BaseError2 {
      constructor({ offset, position, size: size2 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size2}).`, { name: "SliceOffsetOutOfBoundsError" });
      }
    };
    SizeExceedsPaddingSizeError = class extends BaseError2 {
      constructor({ size: size2, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size2}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
      }
    };
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size2 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size2 });
  return padBytes(hexOrBytes, { dir, size: size2 });
}
function padHex(hex_, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return hex_;
  const hex2 = hex_.replace("0x", "");
  if (hex2.length > size2 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex2.length / 2),
      targetSize: size2,
      type: "hex"
    });
  return `0x${hex2[dir === "right" ? "padEnd" : "padStart"](size2 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return bytes;
  if (bytes.length > size2)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size2,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size2);
  for (let i = 0; i < size2; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size2 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
var init_pad = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/pad.js"() {
    init_data();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError, InvalidBytesBooleanError, SizeOverflowError;
var init_encoding = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/encoding.js"() {
    init_base();
    IntegerOutOfRangeError = class extends BaseError2 {
      constructor({ max, min, signed, size: size2, value }) {
        super(`Number "${value}" is not in safe ${size2 ? `${size2 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
      }
    };
    InvalidBytesBooleanError = class extends BaseError2 {
      constructor(bytes) {
        super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
          name: "InvalidBytesBooleanError"
        });
      }
    };
    SizeOverflowError = class extends BaseError2 {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
      }
    };
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
  let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right")
      data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}
var init_trim = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/trim.js"() {
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size2 }) {
  if (size(hexOrBytes) > size2)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size2
    });
}
function hexToBigInt(hex2, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex2, { size: opts.size });
  const value = BigInt(hex2);
  if (!signed)
    return value;
  const size2 = (hex2.length - 2) / 2;
  const max = (1n << BigInt(size2) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size2 * 2, "f")}`) - 1n;
}
function hexToNumber(hex2, opts = {}) {
  const value = hexToBigInt(hex2, opts);
  const number = Number(value);
  if (!Number.isSafeInteger(number))
    throw new IntegerOutOfRangeError({
      max: `${Number.MAX_SAFE_INTEGER}`,
      min: `${Number.MIN_SAFE_INTEGER}`,
      signed: opts.signed,
      size: opts.size,
      value: `${value}n`
    });
  return number;
}
var init_fromHex = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/encoding/fromHex.js"() {
    init_encoding();
    init_size();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/encoding/toHex.js
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex2 = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex2, { size: opts.size });
    return pad(hex2, { size: opts.size });
  }
  return hex2;
}
function bytesToHex(value, opts = {}) {
  let string = "";
  for (let i = 0; i < value.length; i++) {
    string += hexes[value[i]];
  }
  const hex2 = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex2, { size: opts.size });
    return pad(hex2, { dir: "right", size: opts.size });
  }
  return hex2;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size2 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size2) {
    if (signed)
      maxValue = (1n << BigInt(size2) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size2) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size2,
      value: `${value_}${suffix}`
    });
  }
  const hex2 = `0x${(signed && value < 0 ? (1n << BigInt(size2 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size2)
    return pad(hex2, { size: size2 });
  return hex2;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex(value, opts);
}
var hexes, encoder;
var init_toHex = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/encoding/toHex.js"() {
    init_encoding();
    init_pad();
    init_fromHex();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    encoder = /* @__PURE__ */ new TextEncoder();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/encoding/toBytes.js
function toBytes(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes2(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { size: opts.size });
  }
  return bytes;
}
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return void 0;
}
function hexToBytes2(hex_, opts = {}) {
  let hex2 = hex_;
  if (opts.size) {
    assertSize(hex2, { size: opts.size });
    hex2 = pad(hex2, { dir: "right", size: opts.size });
  }
  let hexString = hex2.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index = 0, j = 0; index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function numberToBytes(value, opts) {
  const hex2 = numberToHex(value, opts);
  return hexToBytes2(hex2);
}
function stringToBytes(value, opts = {}) {
  const bytes = encoder2.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
var encoder2, charCodeMap;
var init_toBytes = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/encoding/toBytes.js"() {
    init_base();
    init_isHex();
    init_pad();
    init_fromHex();
    init_toHex();
    encoder2 = /* @__PURE__ */ new TextEncoder();
    charCodeMap = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
  }
});

// ../../../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var U32_MASK64, _32n, rotlSH, rotlSL, rotlBH, rotlBL;
var init_u64 = __esm({
  "../../../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_u64.js"() {
    U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    _32n = /* @__PURE__ */ BigInt(32);
    rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
  }
});

// ../../../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
var isLE, swap32IfBE, Hash;
var init_utils2 = __esm({
  "../../../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/utils.js"() {
    isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    swap32IfBE = isLE ? (u) => u : byteSwap32;
    Hash = class {
    };
  }
});

// ../../../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha3.js
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0; y < 50; y += 10) {
      for (let x = 0; x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0; x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  clean(B);
}
var _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, gen, keccak_256;
var init_sha3 = __esm({
  "../../../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha3.js"() {
    init_u64();
    init_utils2();
    _0n = BigInt(0);
    _1n = BigInt(1);
    _2n = BigInt(2);
    _7n = BigInt(7);
    _256n = BigInt(256);
    _0x71n = BigInt(113);
    SHA3_PI = [];
    SHA3_ROTL = [];
    _SHA3_IOTA = [];
    for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      SHA3_PI.push(2 * (5 * y + x));
      SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n;
      for (let j = 0; j < 7; j++) {
        R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
        if (R & _2n)
          t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
      }
      _SHA3_IOTA.push(t);
    }
    IOTAS = split(_SHA3_IOTA, true);
    SHA3_IOTA_H = IOTAS[0];
    SHA3_IOTA_L = IOTAS[1];
    rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
    rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
    Keccak = class _Keccak extends Hash {
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        anumber(outputLen);
        if (!(0 < blockLen && blockLen < 200))
          throw new Error("only keccak-f1600 function is supported");
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
      }
      clone() {
        return this._cloneInto();
      }
      keccak() {
        swap32IfBE(this.state32);
        keccakP(this.state32, this.rounds);
        swap32IfBE(this.state32);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        aexists(this);
        data = toBytes2(data);
        abytes(data);
        const { blockLen, state } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i = 0; i < take; i++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        aexists(this, false);
        abytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes) {
        anumber(bytes);
        return this.xofInto(new Uint8Array(bytes));
      }
      digestInto(out) {
        aoutput(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        clean(this.state);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
    keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
var init_keccak256 = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/hash/keccak256.js"() {
    init_sha3();
    init_isHex();
    init_toBytes();
    init_toHex();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/address.js
var InvalidAddressError;
var init_address = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/address.js"() {
    init_base();
    InvalidAddressError = class extends BaseError2 {
      constructor({ address }) {
        super(`Address "${address}" is invalid.`, {
          metaMessages: [
            "- Address must be a hex value of 20 bytes (40 hex characters).",
            "- Address must match its checksum counterpart."
          ],
          name: "InvalidAddressError"
        });
      }
    };
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/lru.js
var LruMap;
var init_lru = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/lru.js"() {
    LruMap = class extends Map {
      constructor(size2) {
        super();
        Object.defineProperty(this, "maxSize", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxSize = size2;
      }
      get(key) {
        const value = super.get(key);
        if (super.has(key)) {
          super.delete(key);
          super.set(key, value);
        }
        return value;
      }
      set(key, value) {
        if (super.has(key))
          super.delete(key);
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
          const firstKey = super.keys().next().value;
          if (firstKey !== void 0)
            super.delete(firstKey);
        }
        return this;
      }
    };
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash = keccak256(stringToBytes(hexAddress), "bytes");
  const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
  for (let i = 0; i < 40; i += 2) {
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash[i >> 1] & 15) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }
  const result = `0x${address.join("")}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
var checksumAddressCache;
var init_getAddress = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/address/getAddress.js"() {
    init_toBytes();
    init_keccak256();
    init_lru();
    checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/address/isAddress.js
function isAddress(address, options) {
  const { strict = true } = options ?? {};
  const cacheKey = `${address}.${strict}`;
  if (isAddressCache.has(cacheKey))
    return isAddressCache.get(cacheKey);
  const result = (() => {
    if (!addressRegex.test(address))
      return false;
    if (address.toLowerCase() === address)
      return true;
    if (strict)
      return checksumAddress(address) === address;
    return true;
  })();
  isAddressCache.set(cacheKey, result);
  return result;
}
var addressRegex, isAddressCache;
var init_isAddress = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/address/isAddress.js"() {
    init_lru();
    init_getAddress();
    addressRegex = /^0x[a-fA-F0-9]{40}$/;
    isAddressCache = /* @__PURE__ */ new LruMap(8192);
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/concat.js
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
var init_concat = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/concat.js"() {
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/slice.js
function slice(value, start, end, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end, {
      strict
    });
  return sliceBytes(value, start, end, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: "end",
      size: size(value)
    });
  }
}
function sliceBytes(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
function sliceHex(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
var init_slice = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/data/slice.js"() {
    init_data();
    init_isHex();
    init_size();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/regex.js
var integerRegex2;
var init_regex2 = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/regex.js"() {
    integerRegex2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  return encodeParams(preparedParams);
}
function prepareParams({ params, values }) {
  const preparedParams = [];
  for (let i = 0; i < params.length; i++) {
    preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
  }
  return preparedParams;
}
function prepareParam({ param, value }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value, {
      param
    });
  }
  if (param.type === "address") {
    return encodeAddress(value);
  }
  if (param.type === "bool") {
    return encodeBool(value);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    const [, , size2 = "256"] = integerRegex2.exec(param.type) ?? [];
    return encodeNumber(value, {
      signed,
      size: Number(size2)
    });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value, { param });
  }
  if (param.type === "string") {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function encodeParams(preparedParams) {
  let staticSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size(encoded);
  }
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += size(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  return concatHex([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value))
    throw new InvalidAddressError({ address: value });
  return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param }) {
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new AbiEncodingArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${param.type}[${length}]`
    });
  let dynamicChild = value.length === 0 && isDynamicType(param);
  const preparedParams = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParam({ param, value: value[i] });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length2 = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: concatHex([length2, data])
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concatHex(preparedParams.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { param }) {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = size(value);
  if (!paramSize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32
      });
    return {
      dynamic: true,
      encoded: concatHex([
        padHex(numberToHex(bytesSize, { size: 32 })),
        value_
      ])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize, 10))
    throw new AbiEncodingBytesSizeMismatchError({
      expectedSize: Number.parseInt(paramSize, 10),
      value
    });
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}
function encodeBool(value) {
  if (typeof value !== "boolean")
    throw new BaseError2(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed, size: size2 = 256 }) {
  if (typeof size2 === "number") {
    const max = 2n ** (BigInt(size2) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size2 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
      dir: "right"
    }));
  }
  return {
    dynamic: true,
    encoded: concatHex([
      padHex(numberToHex(size(hexValue), { size: 32 })),
      ...parts
    ])
  };
}
function encodeTuple(value, { param }) {
  let dynamic = false;
  const preparedParams = [];
  for (let i = 0; i < param.components.length; i++) {
    const param_ = param.components[i];
    const index = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concatHex(preparedParams.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
function isDynamicType(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components.some(isDynamicType);
  const arrayComponents = getArrayComponents(type);
  if (arrayComponents)
    return isDynamicType({ ...param, type: arrayComponents[1] });
  return false;
}
var init_encodeAbiParameters = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/abi/encodeAbiParameters.js"() {
    init_abi();
    init_address();
    init_base();
    init_encoding();
    init_isAddress();
    init_concat();
    init_pad();
    init_size();
    init_slice();
    init_toHex();
    init_regex2();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/cursor.js
var NegativeOffsetError, PositionOutOfBoundsError, RecursiveReadLimitExceededError;
var init_cursor = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/errors/cursor.js"() {
    init_base();
    NegativeOffsetError = class extends BaseError2 {
      constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`, {
          name: "NegativeOffsetError"
        });
      }
    };
    PositionOutOfBoundsError = class extends BaseError2 {
      constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
      }
    };
    RecursiveReadLimitExceededError = class extends BaseError2 {
      constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
      }
    };
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/cursor.js
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer ?? bytes, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = /* @__PURE__ */ new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}
var staticCursor;
var init_cursor2 = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/cursor.js"() {
    init_cursor();
    staticCursor = {
      bytes: new Uint8Array(),
      dataView: new DataView(new ArrayBuffer(0)),
      position: 0,
      positionReadCount: /* @__PURE__ */ new Map(),
      recursiveReadCount: 0,
      recursiveReadLimit: Number.POSITIVE_INFINITY,
      assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
          throw new RecursiveReadLimitExceededError({
            count: this.recursiveReadCount + 1,
            limit: this.recursiveReadLimit
          });
      },
      assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
          throw new PositionOutOfBoundsError({
            length: this.bytes.length,
            position
          });
      },
      decrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
      },
      getReadCount(position) {
        return this.positionReadCount.get(position || this.position) || 0;
      },
      incrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
      },
      inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
      },
      inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
      },
      inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
      },
      inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
      },
      pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
      },
      pushBytes(bytes) {
        this.assertPosition(this.position + bytes.length - 1);
        this.bytes.set(bytes, this.position);
        this.position += bytes.length;
      },
      pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
      },
      pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
      },
      pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & ~4294967040);
        this.position += 3;
      },
      pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
      },
      readByte() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectByte();
        this.position++;
        return value;
      },
      readBytes(length, size2) {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectBytes(length);
        this.position += size2 ?? length;
        return value;
      },
      readUint8() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint8();
        this.position += 1;
        return value;
      },
      readUint16() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint16();
        this.position += 2;
        return value;
      },
      readUint24() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint24();
        this.position += 3;
        return value;
      },
      readUint32() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint32();
        this.position += 4;
        return value;
      },
      get remaining() {
        return this.bytes.length - this.position;
      },
      setPosition(position) {
        const oldPosition = this.position;
        this.assertPosition(position);
        this.position = position;
        return () => this.position = oldPosition;
      },
      _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
          return;
        const count = this.getReadCount();
        this.positionReadCount.set(this.position, count + 1);
        if (count > 0)
          this.recursiveReadCount++;
      }
    };
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/encoding/fromBytes.js
function bytesToBigInt(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex2 = bytesToHex(bytes);
  return hexToBigInt(hex2, opts);
}
function bytesToBool(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes);
  }
  if (bytes.length > 1 || bytes[0] > 1)
    throw new InvalidBytesBooleanError(bytes);
  return Boolean(bytes[0]);
}
function bytesToNumber(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex2 = bytesToHex(bytes);
  return hexToNumber(hex2, opts);
}
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes, { dir: "right" });
  }
  return new TextDecoder().decode(bytes);
}
var init_fromBytes = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/encoding/fromBytes.js"() {
    init_encoding();
    init_trim();
    init_fromHex();
    init_toHex();
  }
});

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
  const bytes = typeof data === "string" ? hexToBytes2(data) : data;
  const cursor = createCursor(bytes);
  if (size(bytes) === 0 && params.length > 0)
    throw new AbiDecodingZeroDataError();
  if (size(data) && size(data) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data: typeof data === "string" ? data : bytesToHex(data),
      params,
      size: size(data)
    });
  let consumed = 0;
  const values = [];
  for (let i = 0; i < params.length; ++i) {
    const param = params[i];
    if (consumed < bytes.length)
      cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter(cursor, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data2);
  }
  return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(cursor, { ...param, type }, { length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple(cursor, param, { staticPosition });
  if (param.type === "address")
    return decodeAddress(cursor);
  if (param.type === "bool")
    return decodeBool(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber(cursor, param);
  if (param.type === "string")
    return decodeString(cursor, { staticPosition });
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
function decodeAddress(cursor) {
  const value = cursor.readBytes(32);
  return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
  if (length === null) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    cursor.setPosition(start);
    const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
    const dynamicChild = hasDynamicChild(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0; i < length2; ++i) {
      cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
      if (consumed_ === 0) {
        cursor.assertReadLimit();
        cursor._touch();
      }
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i = 0; i < length; ++i) {
      cursor.setPosition(start + i * 32);
      const [data] = decodeParameter(cursor, param, {
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i = 0; i < length; ++i) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
    if (consumed_ === 0) {
      cursor.assertReadLimit();
      cursor._touch();
    }
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
  const [_, size2] = param.type.split("bytes");
  if (!size2) {
    const offset = bytesToNumber(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [bytesToHex(data), 32];
  }
  const value = bytesToHex(cursor.readBytes(Number.parseInt(size2, 10), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith("int");
  const size2 = Number.parseInt(param.type.split("int")[1] || "256", 10);
  const value = cursor.readBytes(32);
  return [
    size2 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
    32
  ];
}
function decodeTuple(cursor, param, { staticPosition }) {
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i : component?.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i = 0; i < param.components.length; ++i) {
    const component = param.components[i];
    const [data, consumed_] = decodeParameter(cursor, component, {
      staticPosition
    });
    value[hasUnnamedChild ? i : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
  const offset = bytesToNumber(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = bytesToNumber(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = bytesToString(data);
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function hasDynamicChild(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
    return true;
  return false;
}
var sizeOfLength, sizeOfOffset;
var init_decodeAbiParameters = __esm({
  "../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/utils/abi/decodeAbiParameters.js"() {
    init_abi();
    init_getAddress();
    init_cursor2();
    init_size();
    init_slice();
    init_fromBytes();
    init_toBytes();
    init_toHex();
    init_encodeAbiParameters();
    sizeOfLength = 32;
    sizeOfOffset = 32;
  }
});

// ../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/utils.js
var utils_exports = {};
__export(utils_exports, {
  abool: () => abool,
  abytes: () => abytes2,
  aexists: () => aexists2,
  ahash: () => ahash,
  anumber: () => anumber2,
  aoutput: () => aoutput2,
  asyncLoop: () => asyncLoop,
  byteSwap: () => byteSwap2,
  byteSwap32: () => byteSwap322,
  bytesToHex: () => bytesToHex2,
  checkOpts: () => checkOpts,
  clean: () => clean2,
  concatBytes: () => concatBytes,
  copyBytes: () => copyBytes,
  createHasher: () => createHasher2,
  createView: () => createView,
  hexToBytes: () => hexToBytes3,
  isBytes: () => isBytes2,
  isLE: () => isLE2,
  kdfInputToBytes: () => kdfInputToBytes,
  nextTick: () => nextTick,
  oidNist: () => oidNist,
  randomBytes: () => randomBytes,
  rotl: () => rotl,
  rotr: () => rotr,
  swap32IfBE: () => swap32IfBE2,
  swap8IfBE: () => swap8IfBE,
  u32: () => u322,
  u8: () => u8,
  utf8ToBytes: () => utf8ToBytes2,
  validateObject: () => validateObject
});
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function anumber2(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abool(value, title = "") {
  if (typeof value !== "boolean")
    throw new TypeError(atitle(title) + "expected boolean, got type=" + typeof value);
  return value;
}
function abytes2(value, length, title = "") {
  if (isBytes2(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber2(length, "length");
  const bytes = isBytes2(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function copyBytes(bytes) {
  return Uint8Array.from(abytes2(bytes));
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new TypeError("expected hash wrapped by utils.createHasher");
  anumber2(h.outputLen);
  anumber2(h.blockLen);
  if (h.outputLen < 1 || h.blockLen < 1)
    throw new Error("hash blockLen / outputLen must be >= 1");
}
function aexists2(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput2(out, instance) {
  abytes2(out, void 0, "output");
  const min = instance.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function u8(arr) {
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}
function u322(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean2(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
function byteSwap2(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap322(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap2(arr[i]);
  }
  return arr;
}
function bytesToHex2(bytes) {
  abytes2(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex2 = "";
  for (let i = 0; i < bytes.length; i++) {
    hex2 += hexes2[bytes[i]];
  }
  return hex2;
}
function asciiToBase16(ch) {
  return ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - (65 - 10) : ch >= 97 && ch <= 102 ? ch - (97 - 10) : void 0;
}
function hexToBytes3(hex2) {
  if (typeof hex2 !== "string")
    throw new TypeError("hex string expected, got " + typeof hex2);
  if (hasHexBuiltin) {
    try {
      return Uint8Array.fromHex(hex2);
    } catch (error) {
      if (error instanceof SyntaxError)
        throw new RangeError(error.message);
      throw error;
    }
  }
  const hl = hex2.length;
  const al = hl / 2;
  if (hl % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex2.charCodeAt(hi));
    const n2 = asciiToBase16(hex2.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex2[hi] + hex2[hi + 1];
      throw new RangeError('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
async function asyncLoop(iters, tick, cb) {
  anumber2(iters, "iters");
  anumber2(tick, "tick");
  if (typeof cb !== "function")
    throw new TypeError("callback must be a function");
  let ts = Date.now();
  for (let i = 0; i < iters; i++) {
    cb(i);
    const diff = Date.now() - ts;
    if (diff >= 0 && diff < tick)
      continue;
    await nextTick();
    ts += diff;
  }
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new TypeError("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function kdfInputToBytes(data, errorTitle = "") {
  if (typeof data === "string")
    return utf8ToBytes2(data);
  return abytes2(data, void 0, errorTitle);
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes2(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad2 = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
function checkOpts(defaults, opts, title = "opts") {
  aobject(defaults, "defaults");
  if (opts !== void 0)
    aobject(opts, title);
  const merged = Object.assign(defaults, opts);
  return merged;
}
function createHasher2(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes(bytesLength = 32) {
  anumber2(bytesLength, "bytesLength");
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (bytesLength > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
var atitle, aobject, isLE2, swap8IfBE, swap32IfBE2, hasHexBuiltin, hexes2, nextTick, validateObject, oidNist;
var init_utils3 = __esm({
  "../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/utils.js"() {
    atitle = (title) => title ? `"${title}" ` : "";
    aobject = (value, label) => {
      if (value === null || typeof value !== "object" || Array.isArray(value))
        throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
    };
    isLE2 = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    swap8IfBE = isLE2 ? (n) => n : (n) => byteSwap2(n) >>> 0;
    swap32IfBE2 = isLE2 ? (u) => u : byteSwap322;
    hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    nextTick = async () => {
    };
    validateObject = (object, fields = {}, optFields = {}, title = "object") => {
      aobject(object, title);
      aobject(fields, "fields");
      aobject(optFields, "optFields");
      function checkField(fieldName, expectedType, isOpt) {
        const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
        const val = object[fieldName];
        if (!Object.hasOwn(object, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) {
          throw new TypeError(`${label} is invalid: expected own property`);
        }
        if (isOpt && val === void 0)
          return;
        const current = typeof val;
        if (current !== expectedType || val === null)
          throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
      }
      const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
      iter(fields, false);
      iter(optFields, true);
    };
    oidNist = (suffix) => ({
      // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
      // Larger suffix values would need base-128 OID encoding and a different length byte.
      oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
    });
  }
});

// ../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/utils/shared.js
var require_shared = __commonJS({
  "../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/utils/shared.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.equal = exports.concat = exports.HEX_REGEX = void 0;
    var utils_js_1 = (init_utils3(), __toCommonJS(utils_exports));
    exports.HEX_REGEX = /^[A-F0-9]*$/iu;
    function concat(views) {
      return (0, utils_js_1.concatBytes)(...views);
    }
    exports.concat = concat;
    function equal(buf1, buf2) {
      if (buf1.byteLength !== buf2.byteLength) {
        return false;
      }
      const dv1 = new Int8Array(buf1);
      const dv2 = new Int8Array(buf2);
      for (let i = 0; i !== buf1.byteLength; i++) {
        if (dv1[i] !== dv2[i]) {
          return false;
        }
      }
      return true;
    }
    exports.equal = equal;
  }
});

// ../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/utils/index.js
var require_utils = __commonJS({
  "../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/utils/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringToHex = exports.hexToString = exports.randomBytes = exports.hexToBytes = exports.bytesToHex = void 0;
    var crypto_1 = __require("crypto");
    var shared_1 = require_shared();
    var OriginalBuffer = /* @__PURE__ */ Symbol("OriginalBuffer");
    function toUint8Array(buffer) {
      const u8Array = new Uint8Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
      u8Array[OriginalBuffer] = buffer;
      return u8Array;
    }
    var bytesToHex4 = (bytes) => {
      const buf = Buffer.from(bytes);
      return buf.toString("hex").toUpperCase();
    };
    exports.bytesToHex = bytesToHex4;
    var hexToBytes5 = (hex2) => {
      if (!shared_1.HEX_REGEX.test(hex2)) {
        throw new Error("Invalid hex string");
      }
      return toUint8Array(Buffer.from(hex2, "hex"));
    };
    exports.hexToBytes = hexToBytes5;
    var randomBytes3 = (size2) => {
      return toUint8Array((0, crypto_1.randomBytes)(size2));
    };
    exports.randomBytes = randomBytes3;
    var hexToString = (hex2, encoding = "utf8") => {
      if (!shared_1.HEX_REGEX.test(hex2)) {
        throw new Error("Invalid hex string");
      }
      return new TextDecoder(encoding).decode((0, exports.hexToBytes)(hex2));
    };
    exports.hexToString = hexToString;
    var stringToHex2 = (string) => {
      return (0, exports.bytesToHex)(new TextEncoder().encode(string));
    };
    exports.stringToHex = stringToHex2;
    __exportStar(require_shared(), exports);
  }
});

// ../../../node_modules/.pnpm/@scure+base@2.3.0/node_modules/@scure/base/index.js
var base_exports = {};
__export(base_exports, {
  __TESTS: () => __TESTS,
  ascii: () => ascii,
  base16: () => base16,
  base32: () => base32,
  base32crockford: () => base32crockford,
  base32hex: () => base32hex,
  base32hexnopad: () => base32hexnopad,
  base32nopad: () => base32nopad,
  base58: () => base58,
  base58check: () => base58check,
  base58flickr: () => base58flickr,
  base58xmr: () => base58xmr,
  base58xrp: () => base58xrp,
  base64: () => base64,
  base64nopad: () => base64nopad,
  base64url: () => base64url,
  base64urlnopad: () => base64urlnopad,
  bech32: () => bech32,
  bech32m: () => bech32m,
  createBase58check: () => createBase58check,
  hex: () => hex,
  utf8: () => utf8
});
function isBytes3(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function abytes3(b) {
  if (!isBytes3(b))
    throw new TypeError("Uint8Array expected");
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function")
    throw new TypeError("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new TypeError(`${label}: string expected`);
  return true;
}
function anumber3(n, title = "number") {
  if (typeof n !== "number")
    throw new TypeError(`${title}: expected number, got ${typeof n}`);
  if (!Number.isSafeInteger(n))
    throw new RangeError(`${title}: expected safe integer, got ${n}`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new TypeError(`${label}: array of numbers expected`);
}
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  const encode2 = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode = args.map((x) => x.decode).reduce(wrap, id);
  return { encode: encode2, decode };
}
function normalize(fn) {
  afn(fn);
  return { encode: (from) => from, decode: (to) => fn(to) };
}
function u8ToNumArr(u82, len = u82.length) {
  const res = new Array(len);
  for (let i = 0; i < len; i++)
    res[i] = u82[i];
  return res;
}
function charcodesToString(codes) {
  const len = codes.length;
  if (asciiDecoder !== void 0 && len >= 12)
    return asciiDecoder.decode(codes);
  if (len <= B2S_CHUNK)
    return String.fromCharCode.apply(null, codes);
  let res = "";
  for (let i = 0; i < len; i += B2S_CHUNK)
    res += String.fromCharCode.apply(null, codes.subarray(i, i + B2S_CHUNK));
  return res;
}
function radix2(bits) {
  anumber3(bits);
  if (bits <= 0 || bits > 8)
    throw new RangeError("radix2: bits should be in (0..8]");
  const mask = powers[bits] - 1;
  return {
    encode: (bytes) => {
      abytes3(bytes);
      const len = bytes.length;
      const res = new Uint8Array(Math.ceil(len * 8 / bits));
      let carry = 0;
      let pos = 0;
      let j = 0;
      for (let i = 0; i < len; ) {
        if (i + 2 < len) {
          carry = carry << 24 | bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
          pos += 24;
          i += 3;
        } else {
          carry = (carry << 8 | bytes[i]) & 65535;
          pos += 8;
          i++;
        }
        for (; ; ) {
          pos -= bits;
          res[j++] = carry >> pos & mask;
          if (pos < bits)
            break;
        }
      }
      if (pos > 0)
        res[j] = carry << bits - pos & mask;
      return res;
    },
    decode: (digits) => {
      const len = digits.length;
      const res = new Uint8Array(Math.floor(len * bits / 8));
      let carry = 0;
      let pos = 0;
      let j = 0;
      for (let i = 0; i < len; i++) {
        carry = (carry << bits | digits[i]) & 65535;
        pos += bits;
        for (; pos >= 8; pos -= 8)
          res[j++] = carry >> pos - 8 & 255;
      }
      carry = carry << 8 - pos & 255;
      if (pos >= bits)
        throw new Error("Excess padding");
      if (carry > 0)
        throw new Error(`Non-zero padding: ${carry}`);
      return res;
    }
  };
}
function alphabet(letters, aliases) {
  const len = letters.length;
  if (len > 128)
    throw new Error("alphabet: max 128 letters");
  const encTable = new Uint8Array(len);
  const decTable = new Int8Array(128).fill(-1);
  for (let i = 0; i < len; i++) {
    const code = letters.charCodeAt(i);
    if (letters.codePointAt(i) !== code || code > 127)
      throw new Error("alphabet: single-char ASCII letters only");
    encTable[i] = code;
    decTable[code] = i;
  }
  if (aliases !== void 0) {
    for (const alias of Object.keys(aliases)) {
      const code = alias.charCodeAt(0);
      const target = decTable[aliases[alias].charCodeAt(0)];
      if (alias.length !== 1 || code > 127 || target === void 0 || target === -1)
        throw new Error(`alphabet: invalid alias ${alias}`);
      decTable[code] = target;
    }
  }
  return {
    encode: (digits) => {
      const codes = new Uint8Array(digits.length);
      for (let i = 0; i < digits.length; i++) {
        const d = digits[i];
        const code = encTable[d];
        if (code === void 0)
          throw new Error(`alphabet.encode: invalid digit ${d}`);
        codes[i] = code;
      }
      return charcodesToString(codes);
    },
    decode: (input) => {
      astr("decode", input);
      const slen = input.length;
      const digits = new Uint8Array(slen);
      for (let i = 0; i < slen; i++) {
        const code = input.charCodeAt(i);
        const digit = code < 128 ? decTable[code] : -1;
        if (digit === -1)
          throw new Error(`Unknown letter "${input[i]}". Allowed: ${letters}`);
        digits[i] = digit;
      }
      return digits;
    }
  };
}
function padding(bits, chr = "=") {
  anumber3(bits);
  astr("padding", chr);
  return {
    encode(data) {
      while (data.length * bits % 8)
        data += chr;
      return data;
    },
    decode(input) {
      astr("decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid length");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const byte = (end - 1) * bits;
        if (byte % 8 === 0)
          throw new Error("padding: excess padding");
      }
      return input.slice(0, end);
    }
  };
}
function unsafeWrapper(fn) {
  afn(fn);
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
function checksum(len, fn) {
  anumber3(len);
  if (len <= 0)
    throw new RangeError(`checksum length must be positive: ${len}`);
  afn(fn);
  const _fn = fn;
  return {
    encode(data) {
      abytes3(data);
      const sum = _fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      abytes3(data);
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = _fn(payload).slice(0, len);
      for (let i = 0; i < len; i++)
        if (newChecksum[i] !== oldChecksum[i])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
function wordsToU8(words) {
  const len = words.length;
  const res = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const w = words[i];
    if (w < 0 || w >= 32)
      throw new Error(`alphabet.encode: invalid digit ${w}`);
    res[i] = w;
  }
  return res;
}
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1)
      chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++)
    chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
  for (let v of words)
    chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++)
    chk = bech32Polymod(chk);
  chk ^= encodingConst;
  const sum = new Uint8Array(6);
  for (let i = 0; i < 6; i++)
    sum[i] = chk >>> 5 * (5 - i) & 31;
  return BECH_ALPHABET.encode(sum);
}
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = radix2(5);
  const toWords = (from) => {
    abytes3(from);
    const len = from.length;
    const res = new Array(Math.ceil(len * 8 / 5));
    let carry = 0;
    let pos = 0;
    let j = 0;
    for (let i = 0; i < len; i++) {
      carry = carry << 8 | from[i];
      pos += 8;
      for (; pos >= 5; pos -= 5)
        res[j++] = carry >> pos - 5 & 31;
    }
    if (pos > 0)
      res[j] = carry << 5 - pos & 31;
    return res;
  };
  const fromWords = (to) => {
    anumArr("radix2.decode", to);
    const len = to.length;
    const digits = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      const w = to[i];
      if (w < 0 || w >= 32)
        throw new Error(`convertRadix2: invalid word=${w}`);
      digits[i] = w;
    }
    return _words.decode(digits);
  };
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode2(prefix, words, limit = 90) {
    astr("bech32.encode prefix", prefix);
    if (limit !== false)
      anumber3(limit, "limit");
    if (isBytes3(words))
      words = u8ToNumArr(words);
    anumArr("bech32.encode", words);
    const plen = prefix.length;
    if (plen === 0)
      throw new TypeError(`Invalid prefix length ${plen}`);
    const actualLength = plen + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    const lowered = prefix.toLowerCase();
    const sum = bechChecksum(lowered, words, ENCODING_CONST);
    return `${lowered}1${BECH_ALPHABET.encode(wordsToU8(words))}${sum}`;
  }
  function decode(str, limit = 90) {
    astr("bech32.decode input", str);
    if (limit !== false)
      anumber3(limit, "limit");
    const slen = str.length;
    if (slen < 8 || limit !== false && slen > limit)
      throw new TypeError(`invalid string length ${slen}, expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`mixed-case string not allowed`);
    const sepIndex = lowered.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`invalid separator "1"`);
    const prefix = lowered.slice(0, sepIndex);
    const data = lowered.slice(sepIndex + 1);
    if (data.length < 6)
      throw new Error("invalid data length");
    const digits = BECH_ALPHABET.decode(data);
    const words = u8ToNumArr(digits, digits.length - 6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!data.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str) {
    const { prefix, words } = decode(str, false);
    return {
      prefix,
      words,
      bytes: fromWords(words)
    };
  }
  function encodeFromBytes(prefix, bytes) {
    return encode2(prefix, toWords(bytes));
  }
  return {
    encode: encode2,
    decode,
    encodeFromBytes,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
var freeze, powers, asciiDecoder, B2S_CHUNK, base16, base32, base32nopad, base32hex, base32hexnopad, base32crockford, hasBase64Builtin, ASCII_WHITESPACE, decodeBase64Builtin, base64Fallback, base64, base64nopad, base64url, base64urlnopad, B58_GROUP, radix58, genBase58, base58, base58flickr, base58xrp, XMR_BLOCK_LEN, base58xmr, createBase58check, base58check, BECH_ALPHABET, POLYMOD_GENERATORS, bech32, bech32m, ascii, _isWellFormedShim, _isWellFormed, utf8err, utf8Fallback, utf8, __TESTS, hasHexBuiltin2, hexBuiltin, hex;
var init_base2 = __esm({
  "../../../node_modules/.pnpm/@scure+base@2.3.0/node_modules/@scure/base/index.js"() {
    freeze = (fn) => Object.freeze(fn());
    powers = /* @__PURE__ */ (() => {
      let res = [];
      for (let i = 0; i < 40; i++)
        res.push(2 ** i);
      return res;
    })();
    asciiDecoder = /* @__PURE__ */ (() => {
      try {
        const decoder = new TextDecoder();
        return decoder.decode(Uint8Array.of(65, 48, 43, 127)) === "A0+\x7F" ? decoder : void 0;
      } catch (e) {
        return void 0;
      }
    })();
    B2S_CHUNK = 8192;
    base16 = /* @__PURE__ */ freeze(() => chain(radix2(4), alphabet("0123456789ABCDEF")));
    base32 = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding(5)));
    base32nopad = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567")));
    base32hex = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding(5)));
    base32hexnopad = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV")));
    base32crockford = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), normalize((s) => {
      astr("base32crockford.decode", s);
      return s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1");
    })));
    hasBase64Builtin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toBase64 === "function" && typeof Uint8Array.fromBase64 === "function")();
    ASCII_WHITESPACE = /[\t\n\f\r ]/;
    decodeBase64Builtin = (s, isUrl) => {
      astr("base64", s);
      const alphabet2 = isUrl ? "base64url" : "base64";
      if (s.length > 0 && ASCII_WHITESPACE.test(s))
        throw new Error("invalid base64");
      return Uint8Array.fromBase64(s, { alphabet: alphabet2, lastChunkHandling: "strict" });
    };
    base64Fallback = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding(6)));
    base64 = /* @__PURE__ */ freeze(() => hasBase64Builtin ? {
      encode(b) {
        abytes3(b);
        return b.toBase64();
      },
      decode(s) {
        return decodeBase64Builtin(s, false);
      }
    } : base64Fallback);
    base64nopad = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")));
    base64url = /* @__PURE__ */ freeze(() => hasBase64Builtin ? {
      encode(b) {
        abytes3(b);
        return b.toBase64({ alphabet: "base64url" });
      },
      decode(s) {
        return decodeBase64Builtin(s, true);
      }
    } : chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding(6)));
    base64urlnopad = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")));
    B58_GROUP = 656356768;
    radix58 = {
      encode: (bytes) => {
        abytes3(bytes);
        const blen = bytes.length;
        if (blen === 0)
          return new Uint8Array(0);
        let zeros = 0;
        while (zeros < blen - 1 && bytes[zeros] === 0)
          zeros++;
        const nlimbs = Math.ceil(blen / 2);
        const limbs = new Uint16Array(nlimbs);
        const odd = blen & 1;
        if (odd)
          limbs[0] = bytes[0];
        for (let i = odd, j2 = odd; i < blen; i += 2, j2++)
          limbs[j2] = bytes[i] << 8 | bytes[i + 1];
        const groups = [];
        let pos = 0;
        while (pos < nlimbs) {
          let carry = 0;
          for (let i = pos; i < nlimbs; i++) {
            const cur = carry * 65536 + limbs[i];
            const q = Math.floor(cur / B58_GROUP);
            carry = cur - q * B58_GROUP;
            limbs[i] = q;
            if (q === 0 && i === pos)
              pos++;
          }
          groups.push(carry);
        }
        const top = groups.length - 1;
        let sig = top * 5;
        for (let v = groups[top]; ; v = Math.floor(v / 58)) {
          sig++;
          if (v < 58)
            break;
        }
        const res = new Uint8Array(zeros + sig);
        let j = res.length - 1;
        for (let g = 0; g < top; g++) {
          let v = groups[g];
          for (let k = 0; k < 5; k++) {
            res[j--] = v % 58;
            v = Math.floor(v / 58);
          }
        }
        for (let v = groups[top]; j >= zeros; v = Math.floor(v / 58))
          res[j--] = v % 58;
        return res;
      },
      decode: (digits) => {
        abytes3(digits);
        const dlen = digits.length;
        if (dlen === 0)
          return new Uint8Array(0);
        if (dlen >= 65536)
          throw new Error("invalid length");
        let zeros = 0;
        while (zeros < dlen - 1 && digits[zeros] === 0)
          zeros++;
        const limbs = new Uint16Array(Math.ceil(dlen * 6 / 16) + 1);
        let used = 0;
        let i = 0;
        let group = dlen % 5 || 5;
        while (i < dlen) {
          let gval = 0;
          let factor = 1;
          for (const end = i + group; i < end; i++) {
            const d = digits[i];
            if (d >= 58)
              throw new Error(`invalid integer: ${d}`);
            gval = gval * 58 + d;
            factor *= 58;
          }
          group = 5;
          let carry = gval;
          for (let k = 0; k < used; k++) {
            const cur = limbs[k] * factor + carry;
            carry = Math.floor(cur / 65536);
            limbs[k] = cur - carry * 65536;
          }
          for (; carry > 0; carry = Math.floor(carry / 65536))
            limbs[used++] = carry % 65536;
        }
        const valueBytes = used === 0 ? 1 : used * 2 - (limbs[used - 1] < 256 ? 1 : 0);
        const res = new Uint8Array(zeros + valueBytes);
        let j = res.length - 1;
        for (let k = 0; k < used; k++) {
          const limb = limbs[k];
          res[j--] = limb & 255;
          if (j >= zeros)
            res[j--] = limb >> 8;
        }
        return res;
      }
    };
    genBase58 = (abc) => chain(radix58, alphabet(abc));
    base58 = /* @__PURE__ */ freeze(() => genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
    base58flickr = /* @__PURE__ */ freeze(() => genBase58("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"));
    base58xrp = /* @__PURE__ */ freeze(() => genBase58("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"));
    XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
    base58xmr = /* @__PURE__ */ freeze(() => ({
      encode(data) {
        abytes3(data);
        let res = "";
        for (let i = 0; i < data.length; i += 8) {
          const block = data.subarray(i, i + 8);
          res += base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], "1");
        }
        return res;
      },
      decode(str) {
        astr("base58xmr.decode", str);
        const strLen = str.length;
        const tailChars = strLen % 11;
        const tailBytes = tailChars === 0 ? 0 : XMR_BLOCK_LEN.indexOf(tailChars);
        if (tailBytes === -1)
          throw new Error(`base58xmr: invalid block length ${tailChars}`);
        const res = new Uint8Array(Math.floor(strLen / 11) * 8 + tailBytes);
        let w = 0;
        for (let i = 0; i < strLen; i += 11) {
          const slice2 = str.slice(i, i + 11);
          const blockLen = slice2.length === 11 ? 8 : tailBytes;
          const block = base58.decode(slice2);
          for (let j = 0; j < block.length - blockLen; j++) {
            if (block[j] !== 0)
              throw new Error("base58xmr: wrong padding");
          }
          for (let j = block.length - blockLen; j < block.length; j++)
            res[w++] = block[j];
        }
        return res;
      }
    }));
    createBase58check = (sha2562) => {
      afn(sha2562);
      const _sha256 = sha2562;
      return chain(checksum(4, (data) => _sha256(_sha256(data))), base58);
    };
    base58check = createBase58check;
    BECH_ALPHABET = /* @__PURE__ */ alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l");
    POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
    bech32 = /* @__PURE__ */ freeze(() => genBech32("bech32"));
    bech32m = /* @__PURE__ */ freeze(() => genBech32("bech32m"));
    ascii = /* @__PURE__ */ freeze(() => ({
      encode(data) {
        abytes3(data);
        for (let i = 0; i < data.length; i++) {
          const byte = data[i];
          if (byte > 127)
            throw new RangeError(`non-ASCII byte ${byte} at ${i}`);
        }
        return charcodesToString(data);
      },
      decode(str) {
        if (typeof str !== "string")
          throw new TypeError("ascii string expected, got " + typeof str);
        const res = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
          const charCode = str.charCodeAt(i);
          if (charCode > 127)
            throw new RangeError(`non-ASCII char "${str[i]}" (${charCode}) at ${i}`);
          res[i] = charCode;
        }
        return res;
      }
    }));
    _isWellFormedShim = (str) => {
      try {
        return encodeURI(str) !== null;
      } catch {
        return false;
      }
    };
    _isWellFormed = /* @__PURE__ */ (() => (
      // Pick the native check once so utf8.decode doesn't re-probe String.prototype on every call.
      typeof "".isWellFormed === "function" ? (str) => str.isWellFormed() : _isWellFormedShim
    ))();
    utf8err = (i) => new TypeError(`invalid utf8 at byte ${i}`);
    utf8Fallback = /* @__PURE__ */ freeze(() => ({
      encode(data) {
        abytes3(data);
        let res = "";
        for (let i = 0; i < data.length; ) {
          const a = data[i++];
          if (a < 128) {
            res += String.fromCharCode(a);
            continue;
          }
          if (a < 194 || i >= data.length)
            throw utf8err(i - 1);
          const b = data[i++];
          if ((b & 192) !== 128)
            throw utf8err(i - 1);
          let cp = (a & 31) << 6 | b & 63;
          if (a >= 224) {
            if (i >= data.length)
              throw utf8err(i - 1);
            const c = data[i++];
            if ((c & 192) !== 128 || a === 224 && b < 160 || a === 237 && b >= 160)
              throw utf8err(i - 1);
            cp = (a & 15) << 12 | (b & 63) << 6 | c & 63;
            if (a >= 240) {
              if (i >= data.length)
                throw utf8err(i - 1);
              const d = data[i++];
              if (a > 244 || (d & 192) !== 128 || a === 240 && b < 144 || a === 244 && b >= 144)
                throw utf8err(i - 1);
              cp = (a & 7) << 18 | (b & 63) << 12 | (c & 63) << 6 | d & 63;
            }
          }
          if (cp < 65536)
            res += String.fromCharCode(cp);
          else {
            cp -= 65536;
            res += String.fromCharCode((cp >> 10) + 55296, (cp & 1023) + 56320);
          }
        }
        return res;
      },
      decode(str) {
        astr("utf8", str);
        if (!_isWellFormed(str))
          throw new TypeError("utf8 expected well-formed string");
        const res = new Uint8Array(str.length * 3);
        let pos = 0;
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if (c < 128) {
            res[pos++] = c;
            continue;
          }
          if (c >= 55296 && c <= 57343) {
            const d = str.charCodeAt(++i);
            c = 65536 + (c - 55296 << 10) + d - 56320;
          }
          if (c >= 65536) {
            res[pos++] = c >> 18 | 240;
            res[pos++] = c >> 12 & 63 | 128;
          } else if (c >= 2048)
            res[pos++] = c >> 12 | 224;
          else
            res[pos++] = c >> 6 | 192;
          if (c >= 2048)
            res[pos++] = c >> 6 & 63 | 128;
          res[pos++] = c & 63 | 128;
        }
        return res.subarray(0, pos);
      }
    }));
    utf8 = /* @__PURE__ */ freeze(() => {
      let _utf8Encoder;
      let _utf8Decoder;
      const utf8Builtin = {
        // ignoreBOM preserves an explicit leading U+FEFF;
        // fatal rejects invalid UTF-8 bytes instead of replacing them.
        encode(data) {
          abytes3(data);
          return (_utf8Decoder || (_utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }))).decode(data);
        },
        decode(str) {
          astr("utf8", str);
          if (!_isWellFormed(str))
            throw new TypeError("utf8 expected well-formed string");
          return (_utf8Encoder || (_utf8Encoder = new TextEncoder())).encode(str);
        }
      };
      return {
        // Select each direction once at module init, since
        // TextEncoder and TextDecoder can exist independently.
        encode: typeof TextDecoder === "function" ? utf8Builtin.encode : utf8Fallback.encode,
        decode: typeof TextEncoder === "function" ? utf8Builtin.decode : utf8Fallback.decode
      };
    });
    __TESTS = /* @__PURE__ */ freeze(() => ({
      alphabet,
      base64Fallback,
      radix2,
      radix58,
      checksum,
      utf8Fallback,
      _isWellFormedShim
    }));
    hasHexBuiltin2 = /* @__PURE__ */ (() => (
      // Require both directions before enabling the native hex path so encode/decode stay symmetric.
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    hexBuiltin = {
      // Keep local type guards so the native path preserves library-level input errors.
      // Native toHex emits lowercase hex, matching the fallback alphabet and Node's hex strings.
      encode(data) {
        abytes3(data);
        return data.toHex();
      },
      // Native fromHex accepts either hex case and rejects odd-length / non-hex syntax.
      decode(s) {
        astr("hex", s);
        return Uint8Array.fromHex(s);
      }
    };
    hex = /* @__PURE__ */ freeze(() => hasHexBuiltin2 ? hexBuiltin : chain(
      radix2(4),
      // Case-insensitive decode via table aliases instead of a toLowerCase pass.
      alphabet("0123456789abcdef", { A: "a", B: "b", C: "c", D: "d", E: "e", F: "f" }),
      normalize((s) => {
        astr("hex", s);
        if (s.length % 2 !== 0)
          throw new TypeError(`hex.decode: odd-length string (${s.length})`);
        return s;
      })
    ));
  }
});

// ../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/internal/normalizeInput.js
var require_normalizeInput = __commonJS({
  "../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/internal/normalizeInput.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_js_1 = (init_utils3(), __toCommonJS(utils_exports));
    function normalizeInput(input) {
      if (Array.isArray(input)) {
        return new Uint8Array(input);
      }
      if (typeof input === "string") {
        return (0, utils_js_1.utf8ToBytes)(input);
      }
      return input;
    }
    exports.default = normalizeInput;
  }
});

// ../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/internal/wrapCryptoCreateHash.js
var require_wrapCryptoCreateHash = __commonJS({
  "../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/internal/wrapCryptoCreateHash.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var normalizeInput_1 = __importDefault(require_normalizeInput());
    function wrapCryptoCreateHash(type, fn) {
      function hashFn(input) {
        return fn(type).update((0, normalizeInput_1.default)(input)).digest();
      }
      hashFn.create = () => {
        const hash = fn(type);
        return {
          update(input) {
            hash.update((0, normalizeInput_1.default)(input));
            return this;
          },
          digest() {
            return hash.digest();
          }
        };
      };
      return hashFn;
    }
    exports.default = wrapCryptoCreateHash;
  }
});

// ../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/sha256/index.js
var require_sha256 = __commonJS({
  "../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/sha256/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha256 = void 0;
    var crypto_1 = __require("crypto");
    var wrapCryptoCreateHash_1 = __importDefault(require_wrapCryptoCreateHash());
    exports.sha256 = (0, wrapCryptoCreateHash_1.default)("sha256", crypto_1.createHash);
  }
});

// ../../../node_modules/.pnpm/ripple-address-codec@5.0.1/node_modules/ripple-address-codec/dist/utils.js
var require_utils2 = __commonJS({
  "../../../node_modules/.pnpm/ripple-address-codec@5.0.1/node_modules/ripple-address-codec/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.concatArgs = exports.arrayEqual = void 0;
    function arrayEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }
      let result = 0;
      for (let i = 0; i < arr1.length; i++) {
        result |= arr1[i] ^ arr2[i];
      }
      return result === 0;
    }
    exports.arrayEqual = arrayEqual;
    function isScalar(val) {
      return typeof val === "number";
    }
    function concatArgs(...args) {
      return args.flatMap((arg) => {
        return isScalar(arg) ? [arg] : Array.from(arg);
      });
    }
    exports.concatArgs = concatArgs;
  }
});

// ../../../node_modules/.pnpm/ripple-address-codec@5.0.1/node_modules/ripple-address-codec/dist/xrp-codec.js
var require_xrp_codec = __commonJS({
  "../../../node_modules/.pnpm/ripple-address-codec@5.0.1/node_modules/ripple-address-codec/dist/xrp-codec.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isValidClassicAddress = exports.decodeAccountPublic = exports.encodeAccountPublic = exports.encodeNodePublic = exports.decodeNodePublic = exports.decodeAddress = exports.decodeAccountID = exports.encodeAddress = exports.encodeAccountID = exports.decodeSeed = exports.encodeSeed = exports.codec = void 0;
    var base_1 = (init_base2(), __toCommonJS(base_exports));
    var sha256_1 = require_sha256();
    var utils_1 = require_utils2();
    var Codec = class {
      constructor(options) {
        this._sha256 = options.sha256;
        this._codec = base_1.base58xrp;
      }
      /**
       * Encoder.
       *
       * @param bytes - Uint8Array of data to encode.
       * @param opts - Options object including the version bytes and the expected length of the data to encode.
       */
      encode(bytes, opts) {
        const versions = opts.versions;
        return this._encodeVersioned(bytes, versions, opts.expectedLength);
      }
      /**
       * Decoder.
       *
       * @param base58string - Base58Check-encoded string to decode.
       * @param opts - Options object including the version byte(s) and the expected length of the data after decoding.
       */
      /* eslint-disable max-lines-per-function --
       * TODO refactor */
      decode(base58string, opts) {
        var _a;
        const versions = opts.versions;
        const types = opts.versionTypes;
        const withoutSum = this.decodeChecked(base58string);
        if (versions.length > 1 && !opts.expectedLength) {
          throw new Error("expectedLength is required because there are >= 2 possible versions");
        }
        const versionLengthGuess = typeof versions[0] === "number" ? 1 : versions[0].length;
        const payloadLength = (_a = opts.expectedLength) !== null && _a !== void 0 ? _a : withoutSum.length - versionLengthGuess;
        const versionBytes = withoutSum.slice(0, -payloadLength);
        const payload = withoutSum.slice(-payloadLength);
        for (let i = 0; i < versions.length; i++) {
          const version3 = Array.isArray(versions[i]) ? versions[i] : [versions[i]];
          if ((0, utils_1.arrayEqual)(versionBytes, version3)) {
            return {
              version: version3,
              bytes: payload,
              type: types ? types[i] : null
            };
          }
        }
        throw new Error("version_invalid: version bytes do not match any of the provided version(s)");
      }
      encodeChecked(bytes) {
        const check = this._sha256(this._sha256(bytes)).slice(0, 4);
        return this._encodeRaw(Uint8Array.from((0, utils_1.concatArgs)(bytes, check)));
      }
      decodeChecked(base58string) {
        const intArray = this._decodeRaw(base58string);
        if (intArray.byteLength < 5) {
          throw new Error("invalid_input_size: decoded data must have length >= 5");
        }
        if (!this._verifyCheckSum(intArray)) {
          throw new Error("checksum_invalid");
        }
        return intArray.slice(0, -4);
      }
      _encodeVersioned(bytes, versions, expectedLength) {
        if (!checkByteLength(bytes, expectedLength)) {
          throw new Error("unexpected_payload_length: bytes.length does not match expectedLength. Ensure that the bytes are a Uint8Array.");
        }
        return this.encodeChecked((0, utils_1.concatArgs)(versions, bytes));
      }
      _encodeRaw(bytes) {
        return this._codec.encode(Uint8Array.from(bytes));
      }
      /* eslint-enable max-lines-per-function */
      _decodeRaw(base58string) {
        return this._codec.decode(base58string);
      }
      _verifyCheckSum(bytes) {
        const computed = this._sha256(this._sha256(bytes.slice(0, -4))).slice(0, 4);
        const checksum2 = bytes.slice(-4);
        return (0, utils_1.arrayEqual)(computed, checksum2);
      }
    };
    var ACCOUNT_ID = 0;
    var ACCOUNT_PUBLIC_KEY = 35;
    var FAMILY_SEED = 33;
    var NODE_PUBLIC = 28;
    var ED25519_SEED = [1, 225, 75];
    var codecOptions = {
      sha256: sha256_1.sha256
    };
    var codecWithXrpAlphabet = new Codec(codecOptions);
    exports.codec = codecWithXrpAlphabet;
    function encodeSeed(entropy, type) {
      if (!checkByteLength(entropy, 16)) {
        throw new Error("entropy must have length 16");
      }
      const opts = {
        expectedLength: 16,
        // for secp256k1, use `FAMILY_SEED`
        versions: type === "ed25519" ? ED25519_SEED : [FAMILY_SEED]
      };
      return codecWithXrpAlphabet.encode(entropy, opts);
    }
    exports.encodeSeed = encodeSeed;
    function decodeSeed(seed, opts = {
      versionTypes: ["ed25519", "secp256k1"],
      versions: [ED25519_SEED, FAMILY_SEED],
      expectedLength: 16
    }) {
      return codecWithXrpAlphabet.decode(seed, opts);
    }
    exports.decodeSeed = decodeSeed;
    function encodeAccountID(bytes) {
      const opts = { versions: [ACCOUNT_ID], expectedLength: 20 };
      return codecWithXrpAlphabet.encode(bytes, opts);
    }
    exports.encodeAccountID = encodeAccountID;
    exports.encodeAddress = encodeAccountID;
    function decodeAccountID(accountId) {
      const opts = { versions: [ACCOUNT_ID], expectedLength: 20 };
      return codecWithXrpAlphabet.decode(accountId, opts).bytes;
    }
    exports.decodeAccountID = decodeAccountID;
    exports.decodeAddress = decodeAccountID;
    function decodeNodePublic(base58string) {
      const opts = { versions: [NODE_PUBLIC], expectedLength: 33 };
      return codecWithXrpAlphabet.decode(base58string, opts).bytes;
    }
    exports.decodeNodePublic = decodeNodePublic;
    function encodeNodePublic(bytes) {
      const opts = { versions: [NODE_PUBLIC], expectedLength: 33 };
      return codecWithXrpAlphabet.encode(bytes, opts);
    }
    exports.encodeNodePublic = encodeNodePublic;
    function encodeAccountPublic(bytes) {
      const opts = { versions: [ACCOUNT_PUBLIC_KEY], expectedLength: 33 };
      return codecWithXrpAlphabet.encode(bytes, opts);
    }
    exports.encodeAccountPublic = encodeAccountPublic;
    function decodeAccountPublic(base58string) {
      const opts = { versions: [ACCOUNT_PUBLIC_KEY], expectedLength: 33 };
      return codecWithXrpAlphabet.decode(base58string, opts).bytes;
    }
    exports.decodeAccountPublic = decodeAccountPublic;
    function isValidClassicAddress2(address) {
      try {
        decodeAccountID(address);
      } catch (_error) {
        return false;
      }
      return true;
    }
    exports.isValidClassicAddress = isValidClassicAddress2;
    function checkByteLength(bytes, expectedLength) {
      return "byteLength" in bytes ? bytes.byteLength === expectedLength : bytes.length === expectedLength;
    }
  }
});

// ../../../node_modules/.pnpm/ripple-address-codec@5.0.1/node_modules/ripple-address-codec/dist/index.js
var require_dist = __commonJS({
  "../../../node_modules/.pnpm/ripple-address-codec@5.0.1/node_modules/ripple-address-codec/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isValidXAddress = exports.decodeXAddress = exports.xAddressToClassicAddress = exports.encodeXAddress = exports.classicAddressToXAddress = exports.isValidClassicAddress = exports.decodeAccountPublic = exports.encodeAccountPublic = exports.decodeNodePublic = exports.encodeNodePublic = exports.decodeAccountID = exports.encodeAccountID = exports.decodeSeed = exports.encodeSeed = exports.codec = void 0;
    var utils_1 = require_utils();
    var xrp_codec_1 = require_xrp_codec();
    Object.defineProperty(exports, "codec", { enumerable: true, get: function() {
      return xrp_codec_1.codec;
    } });
    Object.defineProperty(exports, "encodeSeed", { enumerable: true, get: function() {
      return xrp_codec_1.encodeSeed;
    } });
    Object.defineProperty(exports, "decodeSeed", { enumerable: true, get: function() {
      return xrp_codec_1.decodeSeed;
    } });
    Object.defineProperty(exports, "encodeAccountID", { enumerable: true, get: function() {
      return xrp_codec_1.encodeAccountID;
    } });
    Object.defineProperty(exports, "decodeAccountID", { enumerable: true, get: function() {
      return xrp_codec_1.decodeAccountID;
    } });
    Object.defineProperty(exports, "encodeNodePublic", { enumerable: true, get: function() {
      return xrp_codec_1.encodeNodePublic;
    } });
    Object.defineProperty(exports, "decodeNodePublic", { enumerable: true, get: function() {
      return xrp_codec_1.decodeNodePublic;
    } });
    Object.defineProperty(exports, "encodeAccountPublic", { enumerable: true, get: function() {
      return xrp_codec_1.encodeAccountPublic;
    } });
    Object.defineProperty(exports, "decodeAccountPublic", { enumerable: true, get: function() {
      return xrp_codec_1.decodeAccountPublic;
    } });
    Object.defineProperty(exports, "isValidClassicAddress", { enumerable: true, get: function() {
      return xrp_codec_1.isValidClassicAddress;
    } });
    var PREFIX_BYTES = {
      // 5, 68
      main: Uint8Array.from([5, 68]),
      // 4, 147
      test: Uint8Array.from([4, 147])
    };
    var MAX_32_BIT_UNSIGNED_INT = 4294967295;
    function classicAddressToXAddress(classicAddress, tag, test) {
      const accountId = (0, xrp_codec_1.decodeAccountID)(classicAddress);
      return encodeXAddress(accountId, tag, test);
    }
    exports.classicAddressToXAddress = classicAddressToXAddress;
    function encodeXAddress(accountId, tag, test) {
      if (accountId.length !== 20) {
        throw new Error("Account ID must be 20 bytes");
      }
      if (tag !== false && tag > MAX_32_BIT_UNSIGNED_INT) {
        throw new Error("Invalid tag");
      }
      const theTag = tag || 0;
      const flag = tag === false || tag == null ? 0 : 1;
      const bytes = (0, utils_1.concat)([
        test ? PREFIX_BYTES.test : PREFIX_BYTES.main,
        accountId,
        Uint8Array.from([
          // 0x00 if no tag, 0x01 if 32-bit tag
          flag,
          // first byte
          theTag & 255,
          // second byte
          theTag >> 8 & 255,
          // third byte
          theTag >> 16 & 255,
          // fourth byte
          theTag >> 24 & 255,
          0,
          0,
          0,
          // four zero bytes (reserved for 64-bit tags)
          0
        ])
      ]);
      return xrp_codec_1.codec.encodeChecked(bytes);
    }
    exports.encodeXAddress = encodeXAddress;
    function xAddressToClassicAddress(xAddress) {
      const { accountId, tag, test } = decodeXAddress(xAddress);
      const classicAddress = (0, xrp_codec_1.encodeAccountID)(accountId);
      return {
        classicAddress,
        tag,
        test
      };
    }
    exports.xAddressToClassicAddress = xAddressToClassicAddress;
    function decodeXAddress(xAddress) {
      const decoded = xrp_codec_1.codec.decodeChecked(xAddress);
      const test = isUint8ArrayForTestAddress(decoded);
      const accountId = decoded.slice(2, 22);
      const tag = tagFromUint8Array(decoded);
      return {
        accountId,
        tag,
        test
      };
    }
    exports.decodeXAddress = decodeXAddress;
    function isUint8ArrayForTestAddress(buf) {
      const decodedPrefix = buf.slice(0, 2);
      if ((0, utils_1.equal)(PREFIX_BYTES.main, decodedPrefix)) {
        return false;
      }
      if ((0, utils_1.equal)(PREFIX_BYTES.test, decodedPrefix)) {
        return true;
      }
      throw new Error("Invalid X-address: bad prefix");
    }
    function tagFromUint8Array(buf) {
      const flag = buf[22];
      if (flag >= 2) {
        throw new Error("Unsupported X-address");
      }
      if (flag === 1) {
        return buf[23] + buf[24] * 256 + buf[25] * 65536 + buf[26] * 16777216;
      }
      if (flag !== 0) {
        throw new Error("flag must be zero to indicate no tag");
      }
      if (!(0, utils_1.equal)((0, utils_1.hexToBytes)("0000000000000000"), buf.slice(23, 23 + 8))) {
        throw new Error("remaining bytes must be zero");
      }
      return false;
    }
    function isValidXAddress(xAddress) {
      try {
        decodeXAddress(xAddress);
      } catch (_error) {
        return false;
      }
      return true;
    }
    exports.isValidXAddress = isValidXAddress;
  }
});

// ../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/ripemd160/index.js
var require_ripemd160 = __commonJS({
  "../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/ripemd160/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ripemd160 = void 0;
    var crypto_1 = __require("crypto");
    var wrapCryptoCreateHash_1 = __importDefault(require_wrapCryptoCreateHash());
    exports.ripemd160 = (0, wrapCryptoCreateHash_1.default)("ripemd160", crypto_1.createHash);
  }
});

// ../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/_u64.js
function fromBig2(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK642), l: Number(n >> _32n2 & U32_MASK642) };
  return { h: Number(n >> _32n2 & U32_MASK642) | 0, l: Number(n & U32_MASK642) | 0 };
}
function split2(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig2(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
function setU64FromNum(view, byteOffset, n, isLE3) {
  const h = fromNumH(n);
  const l = fromNumL(n);
  view.setUint32(byteOffset, isLE3 ? l : h, isLE3);
  view.setUint32(byteOffset + 4, isLE3 ? h : l, isLE3);
}
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var U32_MASK642, _32n2, fromNumH, fromNumL, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, add3L, add3H, add4L, add4H, add5L, add5H;
var init_u642 = __esm({
  "../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/_u64.js"() {
    U32_MASK642 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
    _32n2 = /* @__PURE__ */ BigInt(32);
    fromNumH = (n) => n / 2 ** 32 | 0;
    fromNumL = (n) => n >>> 0;
    shrSH = (h, _l, s) => h >>> s;
    shrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
  }
});

// ../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD, SHA256_IV, SHA512_IV;
var init_md = __esm({
  "../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/_md.js"() {
    init_u642();
    init_utils3();
    HashMD = class {
      blockLen;
      outputLen;
      canXOF = false;
      padOffset;
      isLE;
      // For partial updates less than block size
      buffer;
      view;
      finished = false;
      length = 0;
      pos = 0;
      destroyed = false;
      constructor(blockLen, outputLen, padOffset, isLE3) {
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE3;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
      }
      update(data) {
        aexists2(this);
        abytes2(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        let processed = false;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            processed = true;
            continue;
          }
          buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
            processed = true;
          }
        }
        this.length += data.length;
        if (processed)
          this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists2(this);
        aoutput2(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE: isLE3 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        buffer.fill(0, pos);
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          buffer.fill(0);
        }
        setU64FromNum(view, blockLen - 8, this.length * 8, isLE3);
        this.process(view, 0);
        this.roundClean();
        const oview = out === buffer ? view : createView(out);
        const len = this.outputLen;
        const outLen = len / 4;
        const state = this.get();
        if (len % 4 || outLen > state.length)
          throw new Error("invalid outputLen");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE3);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneIntoMeta(to) {
        const { buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (pos)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    SHA512_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// ../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/sha2.js
var SHA256_K, SHA256_W, SHA2_32B, _SHA256, K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA2_64B, _SHA512, sha256, sha512;
var init_sha2 = __esm({
  "../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/sha2.js"() {
    init_md();
    init_u642();
    init_utils3();
    SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    SHA2_32B = class extends HashMD {
      // We cannot use array here since array allows indexing by variable
      // which means optimizer/compiler cannot use registers.
      // Numeric initializers matter: starting the fields as `undefined` changes
      // V8's field representation and makes sha256 3x slower (measured).
      A = 0;
      B = 0;
      C = 0;
      D = 0;
      E = 0;
      F = 0;
      G = 0;
      H = 0;
      constructor(outputLen, IV) {
        super(64, outputLen, 8, false);
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
          const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
          const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
          const T2 = sigma0 + Maj(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        clean2(SHA256_W);
      }
      destroy() {
        this.destroyed = true;
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean2(this.buffer);
      }
    };
    _SHA256 = class extends SHA2_32B {
      constructor() {
        super(32, SHA256_IV);
      }
    };
    K512 = /* @__PURE__ */ (() => split2([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    SHA2_64B = class extends HashMD {
      // We cannot use array here since array allows indexing by variable
      // which means optimizer/compiler cannot use registers.
      // h -- high 32 bits, l -- low 32 bits
      // Numeric initializers matter: starting the fields as `undefined` changes
      // V8's field representation and slows hashing down (measured on sha256).
      Ah = 0;
      Al = 0;
      Bh = 0;
      Bl = 0;
      Ch = 0;
      Cl = 0;
      Dh = 0;
      Dl = 0;
      Eh = 0;
      El = 0;
      Fh = 0;
      Fl = 0;
      Gh = 0;
      Gl = 0;
      Hh = 0;
      Hl = 0;
      constructor(outputLen, IV) {
        super(128, outputLen, 16, false);
        this.Ah = IV[0] | 0;
        this.Al = IV[1] | 0;
        this.Bh = IV[2] | 0;
        this.Bl = IV[3] | 0;
        this.Ch = IV[4] | 0;
        this.Cl = IV[5] | 0;
        this.Dh = IV[6] | 0;
        this.Dl = IV[7] | 0;
        this.Eh = IV[8] | 0;
        this.El = IV[9] | 0;
        this.Fh = IV[10] | 0;
        this.Fl = IV[11] | 0;
        this.Gh = IV[12] | 0;
        this.Gl = IV[13] | 0;
        this.Hh = IV[14] | 0;
        this.Hl = IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      _cloneInto(to) {
        (to ||= new this.constructor()).set(...this.get());
        return this._cloneIntoMeta(to);
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
          const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
          const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
          const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
          const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
          const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = add3L(T1l, sigma0l, MAJl);
          Ah = add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        clean2(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        this.destroyed = true;
        clean2(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    _SHA512 = class extends SHA2_64B {
      constructor() {
        super(64, SHA512_IV);
      }
    };
    sha256 = /* @__PURE__ */ createHasher2(
      () => new _SHA256(),
      /* @__PURE__ */ oidNist(1)
    );
    sha512 = /* @__PURE__ */ createHasher2(
      () => new _SHA512(),
      /* @__PURE__ */ oidNist(3)
    );
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/utils.js
var utils_exports2 = {};
__export(utils_exports2, {
  aInRange: () => aInRange,
  aarray: () => aarray,
  abignumber: () => abignumber,
  abool: () => abool2,
  abytes: () => abytes4,
  afunction: () => afunction,
  anumber: () => anumber4,
  aobject: () => aobject2,
  asafenumber: () => asafenumber,
  asciiToBytes: () => asciiToBytes,
  astring: () => astring,
  bitGet: () => bitGet,
  bitLen: () => bitLen,
  bitMask: () => bitMask,
  bitSet: () => bitSet,
  bytesToHex: () => bytesToHex3,
  bytesToNumberBE: () => bytesToNumberBE,
  bytesToNumberLE: () => bytesToNumberLE,
  concatBytes: () => concatBytes2,
  copyBytes: () => copyBytes2,
  createHmacDrbg: () => createHmacDrbg,
  equalBytes: () => equalBytes,
  hexToBytes: () => hexToBytes4,
  hexToNumber: () => hexToNumber2,
  inRange: () => inRange,
  isBytes: () => isBytes4,
  isPosBig: () => isPosBig,
  notImplemented: () => notImplemented,
  numberToBytesBE: () => numberToBytesBE,
  numberToBytesLE: () => numberToBytesLE,
  numberToHexUnpadded: () => numberToHexUnpadded,
  numberToVarBytesBE: () => numberToVarBytesBE,
  randomBytes: () => randomBytes2,
  validateObject: () => validateObject2
});
function aarray(item, title, inner = () => {
}) {
  if (!Array.isArray(item))
    throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
  for (let i = 0; i < item.length; i++)
    inner(item[i], `${title}[${i}]`);
  return item;
}
function astring(value, title = "") {
  if (typeof value !== "string") {
    const prefix = title && `"${title}" `;
    throw new TypeError(prefix + "expected string, got type=" + typeof value);
  }
  return value;
}
function aobject2(value, title = "object") {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(title === "object" ? "expected valid options object" : `"${title}" expected object, got type=${typeof value}`);
  return value;
}
function afunction(value, title) {
  if (typeof value !== "function")
    throw new TypeError(`"${title}" is invalid: expected function, got ${typeof value}`);
  return value;
}
function abool2(value, title = "") {
  if (typeof value !== "boolean")
    throw new TypeError(atitle2(title) + "expected boolean, got type=" + typeof value);
  return value;
}
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n))
      throw new RangeError("positive bigint expected, got " + n);
  } else
    anumber4(n);
  return n;
}
function asafenumber(value, title = "") {
  if (typeof value !== "number") {
    const prefix = title && `"${title}" `;
    throw new TypeError(prefix + "expected number, got type=" + typeof value);
  }
  if (!Number.isSafeInteger(value)) {
    const prefix = title && `"${title}" `;
    throw new RangeError(prefix + "expected safe integer, got " + value);
  }
}
function numberToHexUnpadded(num2) {
  const hex2 = abignumber(num2).toString(16);
  return hex2.length & 1 ? "0" + hex2 : hex2;
}
function hexToNumber2(hex2) {
  if (typeof hex2 !== "string")
    throw new TypeError("hex string expected, got " + typeof hex2);
  return hex2 === "" ? _0n2 : BigInt("0x" + hex2);
}
function bytesToNumberBE(bytes) {
  return hexToNumber2(bytesToHex2(bytes));
}
function bytesToNumberLE(bytes) {
  return hexToNumber2(bytesToHex2(copyBytes2(abytes2(bytes)).reverse()));
}
function numberToBytesBE(n, len) {
  anumber2(len);
  if (len === 0)
    throw new Error("zero output length is invalid");
  n = abignumber(n);
  const expectedLen = len * 2;
  const hex2 = n.toString(16);
  if (hex2.length > expectedLen)
    throw new RangeError("number is too large");
  return hexToBytes3(hex2.padStart(expectedLen, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function numberToVarBytesBE(n) {
  return hexToBytes3(numberToHexUnpadded(abignumber(n)));
}
function equalBytes(a, b) {
  a = abytes4(a);
  b = abytes4(b);
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function copyBytes2(bytes) {
  return Uint8Array.from(abytes4(bytes));
}
function asciiToBytes(ascii2) {
  if (typeof ascii2 !== "string")
    throw new TypeError("ascii string expected, got " + typeof ascii2);
  return Uint8Array.from(ascii2, (c, i) => {
    const charCode = c.charCodeAt(0);
    if (c.length !== 1 || charCode > 127) {
      throw new RangeError(`string contains non-ASCII character "${ascii2[i]}" with code ${charCode} at position ${i}`);
    }
    return charCode;
  });
}
function isPosBig(n) {
  return typeof n === "bigint" && _0n2 <= n;
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  if (n < _0n2)
    throw new Error("expected non-negative bigint, got " + n);
  return n === _0n2 ? 0 : n.toString(2).length;
}
function bitGet(n, pos) {
  if (typeof n !== "bigint")
    throw new TypeError('"n" expected bigint, got type=' + typeof n);
  asafenumber(pos, "pos");
  return n >> BigInt(pos) & _1n2;
}
function bitSet(n, pos, value) {
  if (typeof n !== "bigint")
    throw new TypeError('"n" expected bigint, got type=' + typeof n);
  asafenumber(pos, "pos");
  abool2(value, "value");
  const mask = _1n2 << BigInt(pos);
  return value ? n | mask : n & ~mask;
}
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  anumber2(hashLen, "hashLen");
  anumber2(qByteLen, "qByteLen");
  if (typeof hmacFn !== "function")
    throw new TypeError("hmacFn must be a function");
  const u8n = (len) => new Uint8Array(len);
  const NULL = Uint8Array.of();
  const byte0 = Uint8Array.of(0);
  const byte1 = Uint8Array.of(1);
  const _maxDrbgIters = 1e3;
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...msgs) => hmacFn(k, concatBytes2(v, ...msgs));
  const reseed = (seed = NULL) => {
    k = h(byte0, seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(byte1, seed);
    v = h();
  };
  const gen2 = () => {
    if (i++ >= _maxDrbgIters)
      throw new Error("drbg: tried max amount of iterations");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while ((res = pred(gen2())) === void 0)
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject2(object, fields = {}, optFields = {}, title = "object") {
  aobject2(object, title);
  aobject2(fields, "fields");
  aobject2(optFields, "optFields");
  function checkField(fieldName, expectedType, isOpt) {
    const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
    const val = object[fieldName];
    if (!Object.hasOwn(object, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) {
      throw new TypeError(`${label} is invalid: expected own property`);
    }
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
  }
  const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
  iter(fields, false);
  iter(optFields, true);
}
var abytes4, anumber4, bytesToHex3, concatBytes2, hexToBytes4, isBytes4, randomBytes2, _0n2, _1n2, atitle2, bitMask, notImplemented;
var init_utils4 = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/utils.js"() {
    init_utils3();
    abytes4 = (value, length, title) => abytes2(value, length, title);
    anumber4 = anumber2;
    bytesToHex3 = bytesToHex2;
    concatBytes2 = (...arrays) => concatBytes(...arrays);
    hexToBytes4 = (hex2) => hexToBytes3(hex2);
    isBytes4 = isBytes2;
    randomBytes2 = (bytesLength) => randomBytes(bytesLength);
    _0n2 = /* @__PURE__ */ BigInt(0);
    _1n2 = /* @__PURE__ */ BigInt(1);
    atitle2 = (title) => title ? `"${title}" ` : "";
    bitMask = (n) => {
      asafenumber(n, "n");
      return (_1n2 << BigInt(n)) - _1n2;
    };
    notImplemented = () => {
      throw new Error("not implemented");
    };
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/modular.js
function mod(a, b) {
  if (b <= _0n3)
    throw new Error("mod: expected positive modulus, got " + b);
  const result = a % b;
  return result >= _0n3 ? result : b + result;
}
function pow(num2, power, modulo) {
  if (modulo <= _1n3)
    throw new Error("pow: expected modulus > 1, got " + modulo);
  if (typeof power !== "bigint")
    throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
  if (power < _0n3)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n3)
    return _1n3;
  if (power === _1n3)
    return num2;
  let d = num2 % modulo;
  if (d < _0n3)
    d += modulo;
  if (power < POW_WINDOWED_MIN) {
    let p2 = _1n3;
    while (power > _0n3) {
      if (power & _1n3)
        p2 = p2 * d % modulo;
      d = d * d % modulo;
      power >>= _1n3;
    }
    return p2;
  }
  const digits = [];
  while (power > _0n3) {
    digits.push(Number(power & _15n));
    power >>= _4n;
  }
  const table = new Array(16);
  table[0] = _1n3;
  table[1] = d;
  for (let i = 2; i < 16; i++)
    table[i] = table[i - 1] * d % modulo;
  let p = table[digits[digits.length - 1]];
  for (let w = digits.length - 2; w >= 0; w--) {
    p = p * p % modulo;
    p = p * p % modulo;
    p = p * p % modulo;
    p = p * p % modulo;
    const digit = digits[w];
    if (digit !== 0)
      p = p * table[digit] % modulo;
  }
  return p;
}
function pow2(x, power, modulo) {
  if (modulo <= _1n3)
    throw new Error("pow2: expected modulus > 1, got " + modulo);
  if (power < _0n3)
    throw new Error("pow2: expected non-negative exponent, got " + power);
  let res = x;
  while (power-- > _0n3) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n3)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _1n3)
    throw new Error("invert: expected modulus > 1, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n3, u = _1n3;
  while (a !== _0n3) {
    const q = b / a;
    const r = b - a * q;
    const m = x - u * q;
    b = a, a = r, x = u, u = m;
  }
  const gcd = b;
  if (gcd !== _1n3)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function invertCt(a, prime) {
  if (prime <= _1n3)
    throw new Error("invertCt: expected prime modulus > 1, got " + prime);
  const an = mod(a, prime);
  if (an === _0n3)
    throw new Error("invertCt: expected non-zero number");
  const inverse = pow(an, prime - _2n2, prime);
  if (mod(an * inverse, prime) !== _1n3)
    throw new Error("invertCt: does not exist");
  return inverse;
}
function assertIsSquare(Fp2, root, n) {
  const F = Fp2;
  if (!F.eql(F.sqr(root), n))
    throw new Error("Cannot find square root");
}
function aoddModulus(order, fnName) {
  if ((order & _1n3) === _0n3)
    throw new Error(fnName + ": expected odd modulus, got " + order);
}
function sqrt3mod4(Fp2, n) {
  const F = Fp2;
  const p1div4 = (F.ORDER + _1n3) / _4n;
  const root = F.pow(n, p1div4);
  assertIsSquare(F, root, n);
  return root;
}
function sqrt5mod8(Fp2, n) {
  const F = Fp2;
  const p5div8 = (F.ORDER - _5n) / _8n;
  const n2 = F.mul(n, _2n2);
  const v = F.pow(n2, p5div8);
  const nv = F.mul(n, v);
  const i = F.mul(F.mul(nv, _2n2), v);
  const root = F.mul(nv, F.sub(i, F.ONE));
  assertIsSquare(F, root, n);
  return root;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n2) / _16n;
  return ((Fp2, n) => {
    const F = Fp2;
    let tv1 = F.pow(n, c4);
    let tv2 = F.mul(tv1, c1);
    const tv3 = F.mul(tv1, c2);
    const tv4 = F.mul(tv1, c3);
    const e1 = F.eql(F.sqr(tv2), n);
    const e2 = F.eql(F.sqr(tv3), n);
    tv1 = F.cmov(tv1, tv2, e1);
    tv2 = F.cmov(tv4, tv3, e2);
    const e3 = F.eql(F.sqr(tv2), n);
    const root = F.cmov(tv1, tv2, e3);
    assertIsSquare(F, root, n);
    return root;
  });
}
function tonelliShanks(P) {
  if (P < _3n)
    throw new Error("sqrt is not defined for small field");
  aoddModulus(P, "tonelliShanks");
  let Q = P - _1n3;
  let S = 0;
  while (Q % _2n2 === _0n3) {
    Q /= _2n2;
    S++;
  }
  let Z = _2n2;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n3) / _2n2;
  return function tonelliSlow(Fp2, n) {
    const F = Fp2;
    if (F.is0(n))
      return n;
    if (FpLegendre(F, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = F.mul(F.ONE, cc);
    let t = F.pow(n, Q);
    let R = F.pow(n, Q1div2);
    while (!F.eql(t, F.ONE)) {
      if (F.is0(t))
        throw new Error("Cannot find square root: probably non-prime P");
      let i = 1;
      let t_tmp = F.sqr(t);
      while (!F.eql(t_tmp, F.ONE)) {
        i++;
        t_tmp = F.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n3 << BigInt(M - i - 1);
      const b = F.pow(c, exponent);
      M = i;
      c = F.sqr(b);
      t = F.mul(t, c);
      R = F.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  aoddModulus(P, "Fp.sqrt");
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
  return tonelliShanks(P);
}
function validateField(field) {
  aobject2(field, "field");
  if (typeof field.ORDER !== "bigint")
    throw new TypeError('param "ORDER" is invalid: expected bigint, got ' + typeof field.ORDER);
  asafenumber(field.BYTES, "BYTES");
  asafenumber(field.BITS, "BITS");
  for (const name of FIELD_FIELDS)
    afunction(field[name], "field." + name);
  if (field.BYTES < 1 || field.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (field.ORDER <= _1n3)
    throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
  return field;
}
function FpInvertBatch(Fp2, nums, passZero = false) {
  validateField(Fp2);
  aarray(nums, "nums");
  abool2(passZero, "passZero");
  const F = Fp2;
  const inverted = new Array(nums.length).fill(passZero ? F.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num2, i) => {
    if (F.is0(num2))
      return acc;
    inverted[i] = acc;
    return F.mul(acc, num2);
  }, F.ONE);
  const invertedAcc = F.inv(multipliedAcc);
  nums.reduceRight((acc, num2, i) => {
    if (F.is0(num2))
      return acc;
    inverted[i] = F.mul(acc, inverted[i]);
    return F.mul(acc, num2);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp2, n) {
  validateField(Fp2);
  const F = Fp2;
  aoddModulus(F.ORDER, "FpLegendre");
  const p1mod2 = (F.ORDER - _1n3) / _2n2;
  const powered = F.pow(n, p1mod2);
  const yes = F.eql(powered, F.ONE);
  const zero = F.eql(powered, F.ZERO);
  const no = F.eql(powered, F.neg(F.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function FpIsSquare(Fp2, n) {
  const l = FpLegendre(Fp2, n);
  return l !== -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber4(nBitLength);
  if (n <= _0n3)
    throw new Error("invalid n length: expected positive n, got " + n);
  if (nBitLength !== void 0 && nBitLength < 1)
    throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
  const bits = bitLen(n);
  if (nBitLength !== void 0 && nBitLength < bits)
    throw new Error(`invalid n length: expected nBitLength (${nBitLength}) >= bitLen(n) (${bits})`);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, opts = {}) {
  Object.freeze(_Field.prototype);
  return new _Field(ORDER, opts);
}
function FpSqrtEven(Fp2, elm) {
  validateField(Fp2);
  const F = Fp2;
  if (!F.isOdd)
    throw new Error("Field doesn't have isOdd");
  const root = F.sqrt(elm);
  return F.isOdd(root) ? F.neg(root) : root;
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  if (fieldOrder <= _1n3)
    throw new Error("field order must be greater than 1");
  const bitLength = bitLen(fieldOrder - _1n3);
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE3 = false) {
  abytes4(key);
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = Math.max(getMinHashLength(fieldOrder), 16);
  if (len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num2 = isLE3 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num2, fieldOrder - _1n3) + _1n3;
  return isLE3 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
var _0n3, _1n3, _2n2, _3n, _4n, _5n, _7n2, _8n, _9n, _15n, _16n, POW_WINDOWED_MIN, isNegativeLE, FIELD_FIELDS, FIELD_SQRT, _Field;
var init_modular = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/modular.js"() {
    init_utils4();
    _0n3 = /* @__PURE__ */ BigInt(0);
    _1n3 = /* @__PURE__ */ BigInt(1);
    _2n2 = /* @__PURE__ */ BigInt(2);
    _3n = /* @__PURE__ */ BigInt(3);
    _4n = /* @__PURE__ */ BigInt(4);
    _5n = /* @__PURE__ */ BigInt(5);
    _7n2 = /* @__PURE__ */ BigInt(7);
    _8n = /* @__PURE__ */ BigInt(8);
    _9n = /* @__PURE__ */ BigInt(9);
    _15n = /* @__PURE__ */ BigInt(15);
    _16n = /* @__PURE__ */ BigInt(16);
    POW_WINDOWED_MIN = /* @__PURE__ */ BigInt("0x10000000000000000");
    isNegativeLE = (num2, modulo) => (mod(num2, modulo) & _1n3) === _1n3;
    FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
    FIELD_SQRT = /* @__PURE__ */ new WeakMap();
    _Field = class {
      ORDER;
      BITS;
      BYTES;
      isLE;
      ZERO = _0n3;
      ONE = _1n3;
      _lengths;
      _mod;
      constructor(ORDER, opts = {}) {
        if (ORDER <= _1n3)
          throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
        let _nbitLength = void 0;
        this.isLE = false;
        if (opts != null && typeof opts === "object") {
          if (typeof opts.BITS === "number")
            _nbitLength = opts.BITS;
          if (typeof opts.sqrt === "function")
            Object.defineProperty(this, "sqrt", { value: opts.sqrt, enumerable: true });
          if (typeof opts.isLE === "boolean")
            this.isLE = opts.isLE;
          if (opts.allowedLengths)
            this._lengths = Object.freeze(opts.allowedLengths.slice());
          if (typeof opts.modFromBytes === "boolean")
            this._mod = opts.modFromBytes;
        }
        const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
        if (nByteLength > 2048)
          throw new Error("invalid field: expected ORDER of <= 2048 bytes");
        this.ORDER = ORDER;
        this.BITS = nBitLength;
        this.BYTES = nByteLength;
        Object.freeze(this);
      }
      create(num2) {
        return mod(num2, this.ORDER);
      }
      isValid(num2) {
        if (typeof num2 !== "bigint")
          throw new TypeError("invalid field element: expected bigint, got " + typeof num2);
        return _0n3 <= num2 && num2 < this.ORDER;
      }
      is0(num2) {
        return num2 === _0n3;
      }
      // is valid and invertible
      isValidNot0(num2) {
        return !this.is0(num2) && this.isValid(num2);
      }
      isOdd(num2) {
        return (num2 & _1n3) === _1n3;
      }
      neg(num2) {
        return mod(-num2, this.ORDER);
      }
      eql(lhs, rhs) {
        return lhs === rhs;
      }
      sqr(num2) {
        return mod(num2 * num2, this.ORDER);
      }
      add(lhs, rhs) {
        return mod(lhs + rhs, this.ORDER);
      }
      sub(lhs, rhs) {
        return mod(lhs - rhs, this.ORDER);
      }
      mul(lhs, rhs) {
        return mod(lhs * rhs, this.ORDER);
      }
      pow(num2, power) {
        return pow(num2, power, this.ORDER);
      }
      div(lhs, rhs) {
        return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
      }
      // Same as above, but doesn't normalize
      sqrN(num2) {
        return num2 * num2;
      }
      addN(lhs, rhs) {
        return lhs + rhs;
      }
      subN(lhs, rhs) {
        return lhs - rhs;
      }
      mulN(lhs, rhs) {
        return lhs * rhs;
      }
      inv(num2) {
        return invert(num2, this.ORDER);
      }
      sqrt(num2) {
        let sqrt = FIELD_SQRT.get(this);
        if (!sqrt)
          FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
        return sqrt(this, num2);
      }
      toBytes(num2) {
        return this.isLE ? numberToBytesLE(num2, this.BYTES) : numberToBytesBE(num2, this.BYTES);
      }
      fromBytes(bytes, skipValidation = false) {
        abytes4(bytes);
        const { _lengths: allowedLengths, BYTES, isLE: isLE3, ORDER, _mod: modFromBytes } = this;
        if (allowedLengths) {
          if (bytes.length < 1 || !allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
            throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
          }
          const padded = new Uint8Array(BYTES);
          padded.set(bytes, isLE3 ? 0 : padded.length - bytes.length);
          bytes = padded;
        }
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        let scalar = isLE3 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
        if (modFromBytes)
          scalar = mod(scalar, ORDER);
        if (!skipValidation) {
          if (!this.isValid(scalar))
            throw new Error("invalid field element: outside of range 0..ORDER");
        }
        return scalar;
      }
      // TODO: we don't need it here, move out to separate fn
      invertBatch(lst) {
        return FpInvertBatch(this, lst, true);
      }
      // We can't move this out because Fp6, Fp12 implement it
      // and it's unclear what to return in there.
      cmov(a, b, condition) {
        abool2(condition, "condition");
        return condition ? b : a;
      }
    };
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/curve.js
function validatePointCons(Point) {
  const pc = Point;
  if (typeof pc !== "function")
    throw new TypeError('"Point" expected constructor, got type=' + typeof Point);
  afunction(pc.fromAffine, "Point.fromAffine");
  afunction(pc.fromBytes, "Point.fromBytes");
  afunction(pc.fromHex, "Point.fromHex");
  aobject2(pc.BASE, "Point.BASE");
  aobject2(pc.ZERO, "Point.ZERO");
  validateField(pc.Fp);
  validateField(pc.Fn);
}
function normalizeZ(c, points) {
  validatePointCons(c);
  validateMSMPoints(points, c);
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits, min = 1) {
  if (!Number.isSafeInteger(W) || W < min || W > bits)
    throw new Error("invalid window size, expected [" + min + ".." + bits + "], got W=" + W);
}
function validateTableBytes(numPoints, fpBytes) {
  const bytes = numPoints * (4 * fpBytes + 128);
  if (bytes > TABLE_BYTES_MAX)
    throw new Error("invalid window size: table would need ~" + Math.ceil(bytes / 2 ** 20) + " MiB, max " + TABLE_BYTES_MAX / 2 ** 20 + " MiB");
}
function probeRandomBytes(randomBytes3, length) {
  if (randomBytes3 === void 0)
    return void 0;
  afunction(randomBytes3, "randomBytes");
  try {
    const probe = randomBytes3(length);
    if (!isBytes4(probe) || probe.length !== length)
      return void 0;
  } catch {
    return void 0;
  }
  return randomBytes3;
}
function validateMSMPoints(points, c) {
  aarray(points, "points");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field, maxScalar) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    const ok = maxScalar === void 0 ? field.isValid(s) : isPosBig(s) && s < maxScalar;
    if (!ok)
      throw new Error("invalid scalar at index " + i);
  });
}
function getWindowSize(P) {
  return pointWindowSizes.get(P) || 1;
}
function oddMultiples(p, size2) {
  const dbl = p.double();
  const t = [p];
  for (let j = 1; j < size2; j++)
    t.push(t[j - 1].add(dbl));
  return t;
}
function wnafDigits(n, W) {
  const size2 = 2 ** W;
  const half = size2 / 2;
  const mask = BigInt(size2 - 1);
  const d = [];
  while (n > _0n4) {
    let w = 0;
    if (n & _1n4) {
      w = Number(n & mask);
      if (w >= half)
        w -= size2;
      n -= BigInt(w);
    }
    d.push(w);
    n >>= _1n4;
  }
  return d;
}
function signedWindowDigits(n, W, windows) {
  const size2 = 2 ** W;
  const half = size2 / 2;
  const mask = BigInt(size2 - 1);
  const shiftBy = BigInt(W);
  const d = [];
  for (let w = 0; w < windows; w++) {
    let v = Number(n & mask);
    n >>= shiftBy;
    if (v > half) {
      v -= size2;
      n += _1n4;
    }
    d.push(v);
  }
  if (n !== _0n4)
    throw new Error("invalid wnaf");
  return d;
}
function wnafWalk(zero, tables, digits) {
  let max = 0;
  for (const d of digits)
    max = Math.max(max, d.length);
  let acc = zero;
  for (let bit = max - 1; bit >= 0; bit--) {
    if (bit !== max - 1)
      acc = acc.double();
    for (let i = 0; i < digits.length; i++) {
      const w = digits[i][bit];
      if (w) {
        const item = tables[i][Math.abs(w) - 1 >> 1];
        acc = acc.add(w < 0 ? item.negate() : item);
      }
    }
  }
  return acc;
}
function mulAddUnsafe(c, points, scalars, allowOversized = false) {
  validatePointCons(c);
  validateMSMPoints(points, c);
  abool2(allowOversized, "allowOversized");
  validateMSMScalars(scalars, c.Fn, allowOversized ? c.Fn.ORDER ** _4n2 : void 0);
  if (points.length !== scalars.length)
    throw new Error("arrays of points and scalars must have equal length");
  const tables = points.map((p) => oddMultiples(p, 4));
  const digits = scalars.map((n) => wnafDigits(n, 4));
  return wnafWalk(c.ZERO, tables, digits);
}
function createField(order, field, isLE3) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE: isLE3 });
  }
}
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (type !== "weierstrass" && type !== "edwards")
    throw new Error('expected curve type "weierstrass" or "edwards"');
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  validateObject2(curveOpts);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(isPosBig(val) && val !== _0n4))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp2 = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn2 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp2.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp: Fp2, Fn: Fn2 };
}
function createKeygen(randomSecretKey, getPublicKey) {
  return function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey(secretKey) };
  };
}
var _0n4, _1n4, _4n2, BLIND_BYTES, BLIND_BITS, FW_WINDOW, TABLE_BYTES_MAX, pointWindowSizes, ScalarMultiplier;
var init_curve = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/curve.js"() {
    init_utils4();
    init_modular();
    _0n4 = /* @__PURE__ */ BigInt(0);
    _1n4 = /* @__PURE__ */ BigInt(1);
    _4n2 = /* @__PURE__ */ BigInt(4);
    BLIND_BYTES = 16;
    BLIND_BITS = 128;
    FW_WINDOW = 5;
    TABLE_BYTES_MAX = /* @__PURE__ */ (() => 2 ** 31)();
    pointWindowSizes = /* @__PURE__ */ new WeakMap();
    ScalarMultiplier = class {
      Point;
      BASE;
      ZERO;
      randomBytes;
      wnafPrecomputes = /* @__PURE__ */ new WeakMap();
      baseCanBeBlinded;
      bits;
      // Parametrized with a given Point class (not individual point)
      constructor(Point, randomBytes3) {
        validatePointCons(Point);
        this.randomBytes = probeRandomBytes(randomBytes3, BLIND_BYTES);
        this.Point = Point;
        this.BASE = Point.BASE;
        this.ZERO = Point.ZERO;
        this.bits = Point.Fn.BITS;
      }
      /**
       * Creates a signed fixed-window wNAF precomputation table: for every window w, the
       * multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P`, flattened. All doublings are baked into the table,
       * so cached multiplication is additions-only. `windows = ceil(bits/W) + 1`: the extra
       * window absorbs the final carry of signed-digit recoding.
       * For a 256-bit curve and W=6, the table is 44⋅32 = 1408 points.
       * @param point - Point instance
       * @param W - window size
       * @param bits - scalar bitlength the table must cover
       */
      buildWnafTable(point, W, bits) {
        const windows = Math.ceil(bits / W) + 1;
        const half = 2 ** (W - 1);
        const comp = [];
        let base = point;
        for (let w = 0; w < windows; w++) {
          let acc = base;
          for (let i = 0; i < half; i++) {
            comp.push(acc);
            acc = acc.add(base);
          }
          base = comp[comp.length - 1].double();
        }
        return { W, bits, windows, comp };
      }
      /**
       * Implements ec multiplication using precomputed signed fixed-window wNAF tables.
       * Constant-time: fixed window count with one table addition per window — zero digits feed
       * the fake accumulator — and no doublings; the lookup scans the whole window slice.
       * Scalar bounds are validated by the public entry points ({@link ScalarMultiplier.mulCT},
       * {@link ScalarMultiplier.mulCTBlinded}, {@link ScalarMultiplier.mulUnsafe});
       * signedWindowDigits throws if `n` exceeds the table.
       * @returns real and fake (for const-time) points
       */
      wnafCachedCT(precomputes, n) {
        const { W, windows, comp } = precomputes;
        const half = 2 ** (W - 1);
        const digits = signedWindowDigits(n, W, windows);
        let p = this.ZERO;
        let f = this.BASE;
        for (let w = 0; w < windows; w++) {
          const digit = digits[w];
          const start = w * half;
          const idx = Math.abs(digit) - 1;
          let sel = comp[start];
          for (let i = 1; i < half; i++)
            sel = i === idx ? comp[start + i] : sel;
          const neg = sel.negate();
          if (digit === 0)
            f = f.add(comp[start]);
          else
            p = p.add(digit < 0 ? neg : sel);
        }
        return { p, f };
      }
      // Cache key is point identity plus (W, bits); at most two entries exist per point (public-width
      // `Fn.BITS` and blinded `Fn.BITS + BLIND_BITS`). Callers must not reuse the same point with
      // incompatible `transform(...)` layouts and expect a separate cache entry.
      getWnafPrecomputes(W, point, bits, transform) {
        let entries = this.wnafPrecomputes.get(point);
        let comp = entries?.find((entry) => entry.W === W && entry.bits === bits);
        if (!comp) {
          comp = this.buildWnafTable(point, W, bits);
          if (typeof transform === "function")
            comp = { ...comp, comp: transform(comp.comp) };
          if (!entries) {
            entries = [];
            this.wnafPrecomputes.set(point, entries);
          }
          entries.push(comp);
        }
        return comp;
      }
      assertPoint(point) {
        if (!(point instanceof this.Point))
          throw new TypeError('"point" expected Point instance, got type=' + typeof point);
      }
      // Shared prologue of the constant-time entry points. Rejects scalar 0: in key/signature-style
      // callers a zero scalar means broken upstream plumbing, and concrete Points already reject it.
      // Uses inRange instead of Fn.isValidNot0: validateField() only certifies the arithmetic subset.
      validateMulInput(point, scalar) {
        this.assertPoint(point);
        if (!inRange(scalar, _1n4, this.Point.Fn.ORDER))
          throw new Error("invalid scalar");
      }
      // Constant-time dispatch shared by mulCT / mulCTBlinded. Un-precomputed points (W===1, e.g.
      // ECDH peer keys) skip building a throwaway cached table in favor of a small fixed-window
      // multiply. `n` must be < 2^bits.
      runCT(point, n, bits, transform) {
        const W = getWindowSize(point);
        if (W === 1)
          return this.fixedWindowCT(point, n, bits);
        return this.wnafCachedCT(this.getWnafPrecomputes(W, point, bits, transform), n);
      }
      mulCT(point, scalar, transform) {
        this.validateMulInput(point, scalar);
        return this.runCT(point, scalar, this.bits, transform);
      }
      mulCTBlinded(point, scalar, transform) {
        this.validateMulInput(point, scalar);
        if (this.randomBytes === void 0)
          throw new Error("randomBytes is required for scalar blinding");
        const bits = this.Point.Fn.BITS + BLIND_BITS;
        const blind = this.randomBytes(BLIND_BYTES);
        if (!isBytes4(blind) || blind.length !== BLIND_BYTES)
          throw new Error("randomBytes returned invalid byte array");
        blind[0] = blind[0] & 63 | 128;
        const n = scalar + bytesToNumberBE(blind) * this.Point.Fn.ORDER;
        return this.runCT(point, n, bits, transform);
      }
      /**
       * Constant-time multiplication `n*point` for an un-precomputed point, via a small fixed window.
       * A cached wNAF table only pays off when reused; a flat 2^FW_WINDOW table (`size-1` adds) is
       * far cheaper to build for a single use. The point-operation sequence is independent of `n`:
       * build the table, then per window exactly FW_WINDOW doublings, a data-oblivious scan over
       * every table entry, and one addition (adds the identity when the window digit is 0 — never
       * skipped).
       *
       * `n` must be `< 2^bits`. Assumes complete addition (adding the identity costs the same as any
       * add), which holds for the Weierstrass/Edwards point types used here. The table is left in
       * projective form (no normalizeZ): normalizing this small a table costs more than the
       * mixed-add savings it would buy for a single multiply.
       * @returns real point `p`; `f` duplicates it only to match {@link wnafCachedCT}'s return shape
       * (this path needs no fake accumulator — its op-count is already scalar-independent).
       */
      fixedWindowCT(point, n, bits) {
        const W = FW_WINDOW;
        const size2 = 1 << W;
        const mask = bitMask(W);
        const table = new Array(size2);
        table[0] = this.ZERO;
        for (let i = 1; i < size2; i++)
          table[i] = table[i - 1].add(point);
        const windows = Math.ceil(bits / W);
        let acc = this.ZERO;
        for (let window = windows - 1; window >= 0; window--) {
          if (window !== windows - 1)
            for (let d = 0; d < W; d++)
              acc = acc.double();
          const digit = Number(n >> BigInt(window * W) & mask);
          let sel = table[0];
          for (let i = 1; i < size2; i++)
            sel = i === digit ? table[i] : sel;
          acc = acc.add(sel);
        }
        return { p: acc, f: acc };
      }
      shouldBlind(point, cofactor) {
        if (this.randomBytes === void 0)
          return false;
        if (cofactor === _1n4)
          return true;
        if (point !== this.BASE)
          return false;
        if (this.baseCanBeBlinded === void 0)
          this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0();
        return this.baseCanBeBlinded;
      }
      mulSecret(point, scalar, cofactor, transform) {
        return this.shouldBlind(point, cofactor) ? this.mulCTBlinded(point, scalar, transform) : this.mulCT(point, scalar, transform);
      }
      mulUnsafe(point, scalar, transform) {
        this.assertPoint(point);
        if (!isPosBig(scalar))
          throw new Error("invalid scalar");
        const W = getWindowSize(point);
        if (W === 1 || scalar >= this.Point.Fn.ORDER)
          return mulAddUnsafe(this.Point, [point], [scalar], true);
        const precomputes = this.getWnafPrecomputes(W, point, this.bits, transform);
        return this.wnafCachedCT(precomputes, scalar).p;
      }
      // Remembers the window size used for precomputed wNAF multiplication of the given point
      // and drops any previously built tables. Usually only the base point is precomputed.
      // W=1 resets the point to the un-precomputed (table-less) paths.
      // W is additionally capped so tables stay under ~2 GiB ({@link TABLE_BYTES_MAX}).
      setWindowSize(point, W) {
        this.assertPoint(point);
        validateW(W, this.bits);
        const windows = Math.ceil((this.bits + BLIND_BITS) / W) + 1;
        validateTableBytes(windows * 2 ** (W - 1), this.Point.Fp.BYTES);
        pointWindowSizes.set(point, W);
        this.wnafPrecomputes.delete(point);
      }
      // True when a window size is set: tables themselves are built lazily on first multiply.
      hasWindowSize(point) {
        return getWindowSize(point) !== 1;
      }
    };
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/fft.js
function checkU32(n, title = "n") {
  if (typeof n !== "number")
    throw new TypeError(`wrong u32 integer "${title}": expected number, got type=${typeof n}`);
  if (!Number.isSafeInteger(n) || n < 0 || n > 4294967295)
    throw new RangeError(`wrong u32 integer "${title}": expected 0..4294967295, got ${n}`);
  return n;
}
function isPowerOfTwo(x) {
  checkU32(x, "x");
  return (x & x - 1) === 0 && x !== 0;
}
function nextPowerOfTwo(n) {
  checkU32(n);
  if (n <= 1)
    return 1;
  if (n > 2147483648)
    throw new Error("nextPowerOfTwo overflow: result does not fit u32");
  return 1 << log2(n - 1) + 1 >>> 0;
}
function log2(n) {
  checkU32(n);
  return 31 - Math.clz32(n);
}
function poly(field, roots, create, fft, length) {
  validateField(field);
  const F = field;
  const _create = create || ((len, elm) => new Array(len).fill(elm ?? F.ZERO));
  const isPoly = (x) => {
    if (Array.isArray(x))
      return true;
    if (!ArrayBuffer.isView(x))
      return false;
    const v = x;
    return typeof v.length === "number" && typeof v.slice === "function" && typeof v[Symbol.iterator] === "function";
  };
  const checkPoly = (title, value) => {
    if (!isPoly(value))
      throw new TypeError(`"${title}" expected polynomial, got type=${typeof value}`);
  };
  const checkLength = (a, b) => {
    checkPoly("a", a);
    const L = a.length;
    if (b !== void 0) {
      checkPoly("b", b);
      if (b.length !== L)
        throw new Error(`poly: mismatched lengths ${L} vs ${b.length}`);
    }
    if (length !== void 0 && L !== length)
      throw new Error(`poly: expected fixed length ${length}, got ${L}`);
    return L;
  };
  function findOmegaIndex(x, n, brp = false, weights) {
    if (!isPowerOfTwo(n))
      throw new Error("poly.lagrange: expected power of two length, got " + n);
    const omega = weights || (brp ? roots.brp(log2(n)) : roots.roots(log2(n)));
    for (let i = 0; i < n; i++)
      if (F.eql(x, omega[i]))
        return i;
    return -1;
  }
  return {
    roots,
    create: _create,
    length,
    extend: (a, len) => {
      checkLength(a);
      const out = _create(len, F.ZERO);
      for (let i = 0; i < Math.min(a.length, len); i++)
        out[i] = a[i];
      return out;
    },
    degree: (a) => {
      checkLength(a);
      for (let i = a.length - 1; i >= 0; i--)
        if (!F.is0(a[i]))
          return i;
      return -1;
    },
    add: (a, b) => {
      const len = checkLength(a, b);
      const out = _create(len);
      for (let i = 0; i < len; i++)
        out[i] = F.add(a[i], b[i]);
      return out;
    },
    sub: (a, b) => {
      const len = checkLength(a, b);
      const out = _create(len);
      for (let i = 0; i < len; i++)
        out[i] = F.sub(a[i], b[i]);
      return out;
    },
    dot: (a, b) => {
      const len = checkLength(a, b);
      const out = _create(len);
      for (let i = 0; i < len; i++)
        out[i] = F.mul(a[i], b[i]);
      return out;
    },
    mul: (a, b) => {
      if (isPoly(b)) {
        const len = checkLength(a, b);
        if (fft) {
          const A = fft.direct(a, false, true);
          const B = fft.direct(b, false, true);
          for (let i = 0; i < A.length; i++)
            A[i] = F.mul(A[i], B[i]);
          return fft.inverse(A, true, false);
        } else {
          const res = _create(len);
          for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
              const k = (i + j) % len;
              res[k] = F.add(res[k], F.mul(a[i], b[j]));
            }
          }
          return res;
        }
      } else {
        const out = _create(checkLength(a));
        for (let i = 0; i < out.length; i++)
          out[i] = F.mul(a[i], b);
        return out;
      }
    },
    convolve(a, b) {
      checkPoly("a", a);
      checkPoly("b", b);
      const len = nextPowerOfTwo(a.length + b.length - 1);
      return this.mul(this.extend(a, len), this.extend(b, len));
    },
    shift(p, factor) {
      checkPoly("p", p);
      const out = _create(p.length);
      if (length !== void 0 && p.length !== length)
        throw new Error(`poly: expected fixed length ${length}, got ${p.length}`);
      if (!p.length)
        return out;
      out[0] = p[0];
      for (let i = 1, power = F.ONE; i < p.length; i++) {
        power = F.mul(power, factor);
        out[i] = F.mul(p[i], power);
      }
      return out;
    },
    clone: (a) => {
      checkLength(a);
      const out = _create(a.length);
      for (let i = 0; i < a.length; i++)
        out[i] = a[i];
      return out;
    },
    eval: (a, basis) => {
      checkLength(a, basis);
      let acc = F.ZERO;
      for (let i = 0; i < a.length; i++)
        acc = F.add(acc, F.mul(a[i], basis[i]));
      return acc;
    },
    monomial: {
      basis: (x, n) => {
        const out = _create(n);
        let pow3 = F.ONE;
        for (let i = 0; i < n; i++) {
          out[i] = pow3;
          pow3 = F.mul(pow3, x);
        }
        return out;
      },
      eval: (a, x) => {
        checkLength(a);
        let acc = F.ZERO;
        for (let i = a.length - 1; i >= 0; i--)
          acc = F.add(F.mul(acc, x), a[i]);
        return acc;
      }
    },
    lagrange: {
      basis: (x, n, brp = false, weights) => {
        if (!isPowerOfTwo(n))
          throw new Error("poly.lagrange: expected power of two length, got " + n);
        const bits = log2(n);
        const cache = weights || (brp ? roots.brp(bits) : roots.roots(bits));
        const out = _create(n);
        const idx = findOmegaIndex(x, n, brp, weights);
        if (idx !== -1) {
          out[idx] = F.ONE;
          return out;
        }
        const tm = F.pow(x, BigInt(n));
        const c = F.mul(F.sub(tm, F.ONE), F.inv(BigInt(n)));
        const denom = _create(n);
        for (let i = 0; i < n; i++)
          denom[i] = F.sub(x, cache[i]);
        const inv = F.invertBatch(denom);
        for (let i = 0; i < n; i++)
          out[i] = F.mul(c, F.mul(cache[i], inv[i]));
        return out;
      },
      eval(a, x, brp = false) {
        checkLength(a);
        const idx = findOmegaIndex(x, a.length, brp);
        if (idx !== -1)
          return a[idx];
        const L = this.basis(x, a.length, brp);
        let acc = F.ZERO;
        for (let i = 0; i < a.length; i++)
          if (!F.is0(a[i]))
            acc = F.add(acc, F.mul(a[i], L[i]));
        return acc;
      }
    },
    vanishing(roots2) {
      checkPoly("roots", roots2);
      if (length !== void 0 && roots2.length !== length)
        throw new Error(`poly: expected fixed length ${length}, got ${roots2.length}`);
      const out = _create(roots2.length + 1, F.ZERO);
      out[0] = F.ONE;
      for (const r of roots2) {
        const neg = F.neg(r);
        for (let j = out.length - 1; j > 0; j--)
          out[j] = F.add(F.mul(out[j], neg), out[j - 1]);
        out[0] = F.mul(out[0], neg);
      }
      return out;
    }
  };
}
var init_fft = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/fft.js"() {
    init_modular();
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/hash-to-curve.js
function i2osp(value, length) {
  asafenumber(value);
  asafenumber(length);
  if (length < 0 || length > 4)
    throw new Error("invalid I2OSP length: " + length);
  if (value < 0 || value > 2 ** (8 * length) - 1)
    throw new Error("invalid I2OSP input: " + value);
  const res = Array.from({ length }).fill(0);
  for (let i = length - 1; i >= 0; i--) {
    res[i] = value & 255;
    value >>>= 8;
  }
  return new Uint8Array(res);
}
function strxor(a, b) {
  const arr = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    arr[i] = a[i] ^ b[i];
  }
  return arr;
}
function normDST(DST) {
  if (!isBytes4(DST) && typeof DST !== "string")
    throw new Error("DST must be Uint8Array or ascii string");
  const dst = typeof DST === "string" ? asciiToBytes(DST) : DST;
  if (dst.length === 0)
    throw new Error("DST must be non-empty");
  return dst;
}
function expand_message_xmd(msg, DST, lenInBytes, H) {
  abytes4(msg);
  asafenumber(lenInBytes);
  if (typeof H !== "function")
    throw new Error("expand_message_xmd: expected hash function");
  asafenumber(H.outputLen, "hash.outputLen");
  asafenumber(H.blockLen, "hash.blockLen");
  DST = normDST(DST);
  if (DST.length > 255)
    DST = H(concatBytes2(asciiToBytes("H2C-OVERSIZE-DST-"), DST));
  const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
  const ell = Math.ceil(lenInBytes / b_in_bytes);
  if (lenInBytes > 65535 || ell > 255)
    throw new Error("expand_message_xmd: invalid lenInBytes");
  const DST_prime = concatBytes2(DST, i2osp(DST.length, 1));
  const Z_pad = new Uint8Array(r_in_bytes);
  const l_i_b_str = i2osp(lenInBytes, 2);
  const b = new Array(ell);
  const b_0 = H(concatBytes2(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
  b[0] = H(concatBytes2(b_0, i2osp(1, 1), DST_prime));
  for (let i = 1; i < ell; i++) {
    const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
    b[i] = H(concatBytes2(...args));
  }
  const pseudo_random_bytes = concatBytes2(...b);
  return pseudo_random_bytes.slice(0, lenInBytes);
}
function expand_message_xof(msg, DST, lenInBytes, k, H) {
  abytes4(msg);
  asafenumber(lenInBytes);
  asafenumber(k, "k");
  if (k < 0)
    throw new Error("expand_message_xof: invalid k");
  if (typeof H !== "function")
    throw new Error("expand_message_xof: expected XOF function");
  if (typeof H.create !== "function")
    throw new Error("expand_message_xof: expected XOF create");
  DST = normDST(DST);
  if (lenInBytes < 0 || lenInBytes > 65535)
    throw new Error("expand_message_xof: invalid lenInBytes");
  if (DST.length > 255) {
    const dkLen = Math.ceil(2 * k / 8);
    DST = H.create({ dkLen }).update(asciiToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
  }
  if (DST.length > 255)
    throw new Error("expand_message_xof: invalid DST");
  return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
function hash_to_field(msg, count, options) {
  validateObject2(options, {
    p: "bigint",
    m: "number",
    k: "number",
    hash: "function"
  });
  const { p, k, m, hash, expand, DST } = options;
  asafenumber(hash.outputLen, "valid hash");
  abytes4(msg);
  asafenumber(count);
  asafenumber(m, "m");
  asafenumber(k, "k");
  if (p <= BigInt(1))
    throw new Error("hash_to_field: expected valid field characteristic");
  if (count < 1)
    throw new Error("hash_to_field: expected count >= 1");
  if (m < 1)
    throw new Error("hash_to_field: expected m >= 1");
  if (k < 0)
    throw new Error("hash_to_field: invalid k");
  const log2p = p.toString(2).length;
  const L = Math.ceil((log2p + k) / 8);
  const len_in_bytes = count * m * L;
  let prb;
  if (expand === "xmd") {
    prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
  } else if (expand === "xof") {
    prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
  } else if (expand === "_internal_pass") {
    prb = msg;
  } else {
    throw new Error('expand must be "xmd" or "xof"');
  }
  const u = new Array(count);
  for (let i = 0; i < count; i++) {
    const e = new Array(m);
    for (let j = 0; j < m; j++) {
      const elm_offset = L * (j + i * m);
      const tv = prb.subarray(elm_offset, elm_offset + L);
      e[j] = mod(os2ip(tv), p);
    }
    u[i] = e;
  }
  return u;
}
function isogenyMap(field, map) {
  validateField(field);
  aarray(map, "map");
  const coeff = map.map((i, row) => {
    aarray(i, "map[" + row + "]");
    if (i.length < 1)
      throw new Error("isogenyMap: expected non-empty coefficients");
    return Array.from(i).reverse();
  });
  return (x, y) => {
    const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
    const isZero = field.is0(xd) || field.is0(yd);
    const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
    x = field.mul(xn, xd_inv);
    y = field.mul(y, field.mul(yn, yd_inv));
    return isZero ? { x: field.ZERO, y: field.ZERO } : { x, y };
  };
}
function createHasher3(Point, mapToCurve, defaults) {
  if (typeof mapToCurve !== "function")
    throw new Error("mapToCurve() must be defined");
  validateObject2(defaults);
  const snapshot = (src) => Object.freeze({
    ...src,
    DST: isBytes4(src.DST) ? copyBytes2(src.DST) : src.DST,
    ...src.encodeDST === void 0 ? {} : { encodeDST: isBytes4(src.encodeDST) ? copyBytes2(src.encodeDST) : src.encodeDST }
  });
  const safeDefaults = snapshot(defaults);
  const dstOverride = (options) => options && options.DST !== void 0 ? { DST: options.DST } : void 0;
  function map(num2) {
    return Point.fromAffine(mapToCurve(num2));
  }
  function clear(initial) {
    const P = initial.clearCofactor();
    if (P.equals(Point.ZERO))
      return Point.ZERO;
    P.assertValidity();
    return P;
  }
  return Object.freeze({
    get defaults() {
      return snapshot(safeDefaults);
    },
    Point,
    hashToCurve(msg, options) {
      const opts = Object.assign({}, safeDefaults, dstOverride(options));
      const u = hash_to_field(msg, 2, opts);
      const u0 = map(u[0]);
      const u1 = map(u[1]);
      return clear(u0.add(u1));
    },
    encodeToCurve(msg, options) {
      const optsDst = safeDefaults.encodeDST === void 0 ? {} : { DST: safeDefaults.encodeDST };
      const opts = Object.assign({}, safeDefaults, optsDst, dstOverride(options));
      const u = hash_to_field(msg, 1, opts);
      const u0 = map(u[0]);
      return clear(u0);
    },
    /** See {@link H2CHasher} */
    mapToCurve(scalars) {
      if (safeDefaults.m === 1) {
        if (typeof scalars !== "bigint")
          throw new Error("expected bigint (m=1)");
        return clear(map([scalars]));
      }
      if (!Array.isArray(scalars))
        throw new Error("expected array of bigints");
      if (scalars.length !== safeDefaults.m)
        throw new Error(`expected array of ${safeDefaults.m} bigints`);
      for (const i of scalars)
        if (typeof i !== "bigint")
          throw new Error("expected array of bigints");
      return clear(map(scalars));
    },
    // hash_to_scalar can produce 0: https://www.rfc-editor.org/errata/eid8393
    // RFC 9380, draft-irtf-cfrg-bbs-signatures-08. Default scalar DST is the shared generic
    // `HashToScalar-` prefix above unless the caller overrides it per invocation.
    hashToScalar(msg, options) {
      const N = Point.Fn.ORDER;
      const opts = Object.assign({}, safeDefaults, { DST: _DST_scalar }, dstOverride(options), {
        p: N,
        m: 1
      });
      return hash_to_field(msg, 1, opts)[0][0];
    }
  });
}
function SWUFpSqrtRatio(Fp2, Z) {
  const F = validateField(Fp2);
  const q = F.ORDER;
  let l = _0n5;
  for (let o = q - _1n5; o % _2n3 === _0n5; o /= _2n3)
    l += _1n5;
  const c1 = l;
  const _2n_pow_c1_1 = _2n3 << c1 - _1n5 - _1n5;
  const _2n_pow_c1 = _2n_pow_c1_1 * _2n3;
  const c2 = (q - _1n5) / _2n_pow_c1;
  const c3 = (c2 - _1n5) / _2n3;
  const c4 = _2n_pow_c1 - _1n5;
  const c5 = _2n_pow_c1_1;
  const c6 = F.pow(Z, c2);
  const c7 = F.pow(Z, (c2 + _1n5) / _2n3);
  let sqrtRatio = (u, v) => {
    let tv1 = c6;
    let tv2 = F.pow(v, c4);
    let tv3 = F.sqr(tv2);
    tv3 = F.mul(tv3, v);
    let tv5 = F.mul(u, tv3);
    tv5 = F.pow(tv5, c3);
    tv5 = F.mul(tv5, tv2);
    tv2 = F.mul(tv5, v);
    tv3 = F.mul(tv5, u);
    let tv4 = F.mul(tv3, tv2);
    tv5 = F.pow(tv4, c5);
    let isQR = F.eql(tv5, F.ONE);
    tv2 = F.mul(tv3, c7);
    tv5 = F.mul(tv4, tv1);
    tv3 = F.cmov(tv2, tv3, isQR);
    tv4 = F.cmov(tv5, tv4, isQR);
    for (let i = c1; i > _1n5; i--) {
      let tv52 = i - _2n3;
      tv52 = _2n3 << tv52 - _1n5;
      let tvv5 = F.pow(tv4, tv52);
      const e1 = F.eql(tvv5, F.ONE);
      tv2 = F.mul(tv3, tv1);
      tv1 = F.mul(tv1, tv1);
      tvv5 = F.mul(tv4, tv1);
      tv3 = F.cmov(tv2, tv3, e1);
      tv4 = F.cmov(tvv5, tv4, e1);
    }
    return { isValid: !F.is0(v) && (isQR || F.is0(u)), value: tv3 };
  };
  if (F.ORDER % _4n3 === _3n2) {
    const c12 = (F.ORDER - _3n2) / _4n3;
    const c22 = F.sqrt(F.neg(Z));
    sqrtRatio = (u, v) => {
      let tv1 = F.sqr(v);
      const tv2 = F.mul(u, v);
      tv1 = F.mul(tv1, tv2);
      let y1 = F.pow(tv1, c12);
      y1 = F.mul(y1, tv2);
      const y2 = F.mul(y1, c22);
      const tv3 = F.mul(F.sqr(y1), v);
      const isQR = F.eql(tv3, u);
      let y = F.cmov(y2, y1, isQR);
      return { isValid: !F.is0(v) && isQR, value: y };
    };
  }
  return sqrtRatio;
}
function mapToCurveSimpleSWU(Fp2, opts) {
  const F = validateField(Fp2);
  validateObject2(opts, {}, {}, "opts");
  const { A, B, Z } = opts;
  if (!F.isValidNot0(A) || !F.isValidNot0(B) || !F.isValid(Z))
    throw new Error("mapToCurveSimpleSWU: invalid opts");
  if (F.eql(Z, F.neg(F.ONE)) || FpIsSquare(F, Z))
    throw new Error("mapToCurveSimpleSWU: invalid opts");
  const x = F.mul(B, F.inv(F.mul(Z, A)));
  const gx = F.add(F.add(F.mul(F.sqr(x), x), F.mul(A, x)), B);
  if (!FpIsSquare(F, gx))
    throw new Error("mapToCurveSimpleSWU: invalid opts");
  const sqrtRatio = SWUFpSqrtRatio(F, Z);
  if (!F.isOdd)
    throw new Error("Field does not have .isOdd()");
  return (u) => {
    let tv1, tv2, tv3, tv4, tv5, tv6, x2, y;
    tv1 = F.sqr(u);
    tv1 = F.mul(tv1, Z);
    tv2 = F.sqr(tv1);
    tv2 = F.add(tv2, tv1);
    tv3 = F.add(tv2, F.ONE);
    tv3 = F.mul(tv3, B);
    tv4 = F.cmov(Z, F.neg(tv2), !F.eql(tv2, F.ZERO));
    tv4 = F.mul(tv4, A);
    tv2 = F.sqr(tv3);
    tv6 = F.sqr(tv4);
    tv5 = F.mul(tv6, A);
    tv2 = F.add(tv2, tv5);
    tv2 = F.mul(tv2, tv3);
    tv6 = F.mul(tv6, tv4);
    tv5 = F.mul(tv6, B);
    tv2 = F.add(tv2, tv5);
    x2 = F.mul(tv1, tv3);
    const { isValid, value } = sqrtRatio(tv2, tv6);
    y = F.mul(tv1, u);
    y = F.mul(y, value);
    x2 = F.cmov(x2, tv3, isValid);
    y = F.cmov(y, value, isValid);
    const e1 = F.isOdd(u) === F.isOdd(y);
    y = F.cmov(F.neg(y), y, e1);
    const tv4_inv = FpInvertBatch(F, [tv4], true)[0];
    x2 = F.mul(x2, tv4_inv);
    return { x: x2, y };
  };
}
var _0n5, _1n5, _2n3, _3n2, _4n3, os2ip, _DST_scalar;
var init_hash_to_curve = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/hash-to-curve.js"() {
    init_utils4();
    init_modular();
    _0n5 = /* @__PURE__ */ BigInt(0);
    _1n5 = /* @__PURE__ */ BigInt(1);
    _2n3 = /* @__PURE__ */ BigInt(2);
    _3n2 = /* @__PURE__ */ BigInt(3);
    _4n3 = /* @__PURE__ */ BigInt(4);
    os2ip = bytesToNumberBE;
    _DST_scalar = "HashToScalar-";
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/frost.js
function createFROST(opts) {
  validateObject2(opts, {
    name: "string",
    hash: "function"
  }, {
    hashToScalar: "function",
    validatePoint: "function",
    parsePublicKey: "function",
    adjustScalar: "function",
    adjustPoint: "function",
    challenge: "function",
    adjustNonces: "function",
    adjustSecret: "function",
    adjustPublic: "function",
    adjustGroupCommitmentShare: "function",
    adjustDKG: "function"
  });
  validatePointCons(opts.Point);
  const { Point } = opts;
  const Fn2 = opts.Fn === void 0 ? Point.Fn : opts.Fn;
  const hashBytes = opts.hash;
  const hashToScalar = opts.hashToScalar === void 0 ? (msg, opts2 = { DST: new Uint8Array() }) => {
    const t = hashBytes(concatBytes2(opts2.DST, msg));
    return Fn2.create(Fn2.isLE ? bytesToNumberLE(t) : bytesToNumberBE(t));
  } : opts.hashToScalar;
  const H1Prefix = utf8ToBytes2(opts.H1 !== void 0 ? opts.H1 : opts.name + "rho");
  const H2Prefix = utf8ToBytes2(opts.H2 !== void 0 ? opts.H2 : opts.name + "chal");
  const H3Prefix = utf8ToBytes2(opts.H3 !== void 0 ? opts.H3 : opts.name + "nonce");
  const H4Prefix = utf8ToBytes2(opts.H4 !== void 0 ? opts.H4 : opts.name + "msg");
  const H5Prefix = utf8ToBytes2(opts.H5 !== void 0 ? opts.H5 : opts.name + "com");
  const HDKGPrefix = utf8ToBytes2(opts.HDKG !== void 0 ? opts.HDKG : opts.name + "dkg");
  const HIDPrefix = utf8ToBytes2(opts.HID !== void 0 ? opts.HID : opts.name + "id");
  const H1 = (msg) => hashToScalar(msg, { DST: H1Prefix });
  const H2 = (msg) => hashToScalar(msg, { DST: H2Prefix });
  const H3 = (msg) => hashToScalar(msg, { DST: H3Prefix });
  const H4 = (msg) => hashBytes(concatBytes2(H4Prefix, msg));
  const H5 = (msg) => hashBytes(concatBytes2(H5Prefix, msg));
  const HDKG = (msg) => hashToScalar(msg, { DST: HDKGPrefix });
  const HID = (msg) => hashToScalar(msg, { DST: HIDPrefix });
  const randomScalar = (rng = randomBytes2) => {
    if (typeof rng !== "function")
      throw new TypeError('"rng" expected function, got type=' + typeof rng);
    const t = mapHashToField(rng(getMinHashLength(Fn2.ORDER)), Fn2.ORDER, Fn2.isLE);
    return Fn2.isLE ? bytesToNumberLE(t) : bytesToNumberBE(t);
  };
  const serializePoint = (p) => p.toBytes();
  const parsePoint = (bytes) => {
    const p = Point.fromBytes(bytes);
    if (opts.validatePoint)
      opts.validatePoint(p);
    return p;
  };
  const nonceCommitments = (identifier, nonces) => ({
    identifier,
    hiding: serializePoint(Point.BASE.multiply(Fn2.fromBytes(nonces.hiding))),
    binding: serializePoint(Point.BASE.multiply(Fn2.fromBytes(nonces.binding)))
  });
  const adjustPoint = opts.adjustPoint === void 0 ? (n) => n : opts.adjustPoint;
  const validateIdentifier = (n) => {
    if (!Fn2.isValid(n) || Fn2.is0(n))
      throw new Error("Invalid identifier " + n);
    return n;
  };
  const serializeIdentifier = (id) => bytesToHex3(Fn2.toBytes(validateIdentifier(id)));
  const parseIdentifier = (id, title = "identifier") => {
    astring(id, title);
    const n = validateIdentifier(Fn2.fromBytes(hexToBytes4(id)));
    if (serializeIdentifier(n) !== id)
      throw new Error("expected canonical identifier hex");
    return n;
  };
  const Signature = {
    // RFC 9591 Appendix A encodes signatures canonically as
    // SerializeElement(R) || SerializeScalar(z).
    encode: (R, z) => {
      let res = concatBytes2(serializePoint(R), Fn2.toBytes(z));
      if (opts.adjustTx)
        res = opts.adjustTx.encode(res);
      return res;
    },
    decode: (sig) => {
      if (opts.adjustTx)
        sig = opts.adjustTx.decode(sig);
      const Rbytes = sig.subarray(0, -Fn2.BYTES);
      const R = parsePoint(Rbytes);
      if (serializePoint(R).length !== Rbytes.length)
        throw new Error("invalid signature encoding");
      const z = Fn2.fromBytes(sig.subarray(-Fn2.BYTES));
      return { R, z };
    }
  };
  const genPointScalarPair = (rng = randomBytes2) => {
    let n = randomScalar(rng);
    if (opts.adjustScalar)
      n = opts.adjustScalar(n);
    let p = Point.BASE.multiply(n);
    return { scalar: n, point: p };
  };
  const nrErr = "roots are unavailable in FROST polynomial mode";
  const noRoots = {
    info: { G: Fn2.ZERO, oddFactor: Fn2.ZERO, powerOfTwo: 0 },
    roots() {
      throw new Error(nrErr);
    },
    brp() {
      throw new Error(nrErr);
    },
    inverse() {
      throw new Error(nrErr);
    },
    omega() {
      throw new Error(nrErr);
    },
    clear() {
    }
  };
  const Poly = poly(Fn2, noRoots);
  const msm = (points, scalars) => mulAddUnsafe(Point, points, scalars);
  const polynomialEvaluate = (x, coeffs) => {
    if (!coeffs.length)
      throw new Error("empty coefficients");
    return Poly.monomial.eval(coeffs, x);
  };
  const deriveInterpolatingValue = (L, xi) => {
    const err = "invalid parameters";
    if (!L.some((x) => Fn2.eql(x, xi)))
      throw new Error(err);
    const Lset = new Set(L);
    if (Lset.size !== L.length)
      throw new Error(err);
    if (!Lset.has(xi))
      throw new Error(err);
    let num2 = Fn2.ONE;
    let den = Fn2.ONE;
    for (const x of L) {
      if (Fn2.eql(x, xi))
        continue;
      num2 = Fn2.mul(num2, x);
      den = Fn2.mul(den, Fn2.sub(x, xi));
    }
    return Fn2.div(num2, den);
  };
  const evalutateVSS = (identifier, commitment) => {
    const monomial = Poly.monomial.basis(identifier, commitment.length);
    return msm(commitment, monomial);
  };
  const generateSecretPolynomial = (signers, secret, coeffs, rng = randomBytes2) => {
    validateSigners(signers);
    if (secret !== void 0)
      abytes4(secret, Fn2.BYTES, "secret");
    if (coeffs !== void 0)
      aarray(coeffs, "coeffs");
    if (typeof rng !== "function")
      throw new TypeError('"rng" expected function, got type=' + typeof rng);
    const secretScalar = secret === void 0 ? randomScalar(rng) : Fn2.fromBytes(secret);
    if (!coeffs) {
      coeffs = [];
      for (let i = 0; i < signers.min - 1; i++)
        coeffs.push(randomScalar(rng));
    }
    if (coeffs.length !== signers.min - 1)
      throw new Error("wrong coefficients length");
    const coefficients = [secretScalar, ...coeffs];
    const commitment = coefficients.map((i) => Point.BASE.multiply(i));
    return { coefficients, commitment, secret: secretScalar };
  };
  const ProofOfKnowledge = {
    challenge: (id, verKey, R) => HDKG(concatBytes2(Fn2.toBytes(id), serializePoint(verKey), serializePoint(R))),
    compute(id, coefficents, commitments, rng = randomBytes2) {
      if (coefficents.length < 1)
        throw new Error("coefficients should have at least one element");
      const { point: R, scalar: k } = genPointScalarPair(rng);
      const verKey = commitments[0];
      const c = this.challenge(id, verKey, R);
      const mu = Fn2.add(k, Fn2.mul(coefficents[0], c));
      return Signature.encode(R, mu);
    },
    validate(id, commitment, proof) {
      if (commitment.length < 1)
        throw new Error("commitment should have at least one element");
      const { R, z } = Signature.decode(proof);
      const phi = parsePoint(commitment[0]);
      const c = this.challenge(id, phi, R);
      if (!R.equals(Point.BASE.multiplyUnsafe(z).subtract(phi.multiplyUnsafe(c))))
        throw new Error("invalid proof of knowledge");
    }
  };
  const Basic = {
    challenge: (R, PK, msg) => {
      if (opts.challenge)
        return opts.challenge(R, PK, msg);
      return H2(concatBytes2(serializePoint(R), serializePoint(PK), msg));
    },
    sign(msg, sk, rng = randomBytes2) {
      const { point: R, scalar: r } = genPointScalarPair(rng);
      const PK = Point.BASE.multiply(sk);
      const c = this.challenge(R, PK, msg);
      const z = Fn2.add(r, Fn2.mul(c, sk));
      return [R, z];
    },
    verify(msg, R, z, PK) {
      if (opts.adjustPoint)
        PK = opts.adjustPoint(PK);
      if (opts.adjustPoint)
        R = opts.adjustPoint(R);
      const c = this.challenge(R, PK, msg);
      const zB = Point.BASE.multiplyUnsafe(z);
      const cA = PK.multiplyUnsafe(c);
      let check = zB.subtract(cA).subtract(R);
      if (check.clearCofactor)
        check = check.clearCofactor();
      return Point.ZERO.equals(check);
    }
  };
  const validateSecretShare = (identifier, commitment, signingShare) => {
    if (!Point.BASE.multiply(signingShare).equals(evalutateVSS(identifier, commitment)))
      throw new Error("invalid secret share");
  };
  const Identifier = {
    fromNumber(n) {
      if (!Number.isSafeInteger(n))
        throw new Error("expected safe interger");
      return serializeIdentifier(BigInt(n));
    },
    // Not in spec, but in FROST implementation,
    // seems useful and nice, no need to sync identifiers (would require more interactions)
    derive(s) {
      astring(s, "s");
      return serializeIdentifier(HID(utf8ToBytes2(s)));
    }
  };
  const generateNonce = (secret, rng = randomBytes2) => H3(concatBytes2(rng(32), Fn2.toBytes(secret)));
  const getGroupCommitment = (GPK, commitmentList, msg) => {
    const CL = commitmentList.map((i) => [
      i.identifier,
      parseIdentifier(i.identifier),
      parsePoint(i.hiding),
      parsePoint(i.binding)
    ]);
    CL.sort((a, b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0);
    const Cbytes = [];
    for (const [_, id, hC, bC] of CL)
      Cbytes.push(Fn2.toBytes(id), serializePoint(hC), serializePoint(bC));
    const encodedCommitmentHash = H5(concatBytes2(...Cbytes));
    const rhoPrefix = concatBytes2(serializePoint(GPK), H4(msg), encodedCommitmentHash);
    const bindingFactors = {};
    for (const [i, id] of CL) {
      bindingFactors[i] = H1(concatBytes2(rhoPrefix, Fn2.toBytes(id)));
    }
    let hidingSum = Point.ZERO;
    const points = [];
    const scalars = [];
    for (const [i, _, hC, bC] of CL) {
      if (Point.ZERO.equals(hC) || Point.ZERO.equals(bC))
        throw new Error("infinity commitment");
      hidingSum = hidingSum.add(hC);
      points.push(bC);
      scalars.push(bindingFactors[i]);
    }
    const groupCommitment = hidingSum.add(msm(points, scalars));
    const identifiers = CL.map((i) => i[1]);
    return { identifiers, groupCommitment, bindingFactors };
  };
  const prepareShare = (PK, commitmentList, msg, identifier) => {
    const GPK = adjustPoint(parsePoint(PK));
    const id = parseIdentifier(identifier);
    const { identifiers, groupCommitment, bindingFactors } = getGroupCommitment(GPK, commitmentList, msg);
    const bindingFactor = bindingFactors[identifier];
    const lambda = deriveInterpolatingValue(identifiers, id);
    const challenge2 = Basic.challenge(groupCommitment, GPK, msg);
    return { lambda, challenge: challenge2, bindingFactor, groupCommitment };
  };
  Object.freeze(Identifier);
  const frost = {
    Identifier,
    // DKG is Distributed Key Generation, not Trusted Dealer Key Generation.
    DKG: Object.freeze({
      // NOTE: we allow to pass secret scalar from user side,
      // this way it can be derived, instead of random generation
      round1: (id, signers, secret, rng = randomBytes2) => {
        const idNum = parseIdentifier(id, "id");
        validateSigners(signers);
        const { coefficients, commitment } = generateSecretPolynomial(signers, secret, void 0, rng);
        const proofOfKnowledge = ProofOfKnowledge.compute(idNum, coefficients, commitment, rng);
        const commitmentBytes = commitment.map(serializePoint);
        const round1Public = {
          identifier: serializeIdentifier(idNum),
          commitment: commitmentBytes,
          proofOfKnowledge
        };
        const round1Secret = {
          identifier: idNum,
          coefficients,
          commitment: commitment.map(serializePoint),
          // Copy threshold metadata instead of retaining the caller-owned object by reference.
          signers: { min: signers.min, max: signers.max },
          step: 1
        };
        return { public: round1Public, secret: round1Secret };
      },
      round2: (secret, others) => {
        validateObject2(secret, { identifier: "bigint", commitment: "object", signers: "object" }, { coefficients: "object", round2Cache: "object", step: "number" }, "secret");
        validateSigners(secret.signers, "secret.signers");
        aarray(others, "others");
        if (others.length !== secret.signers.max - 1)
          throw new Error("wrong number of round1 packages");
        if (!secret.coefficients || secret.step === 3)
          throw new Error("round3 package used in round2");
        if (secret.round2Cache !== void 0)
          return secret.round2Cache;
        const res = {};
        for (const p of others) {
          if (p.commitment.length !== secret.signers.min)
            throw new Error("wrong number of commitments");
          const id = parseIdentifier(p.identifier);
          if (id === secret.identifier)
            throw new Error("duplicate id=" + serializeIdentifier(id));
          ProofOfKnowledge.validate(id, p.commitment, p.proofOfKnowledge);
          for (const c of p.commitment)
            parsePoint(c);
          if (res[p.identifier])
            throw new Error("Duplicate id=" + id);
          const signingShare = Fn2.toBytes(polynomialEvaluate(id, secret.coefficients));
          res[p.identifier] = {
            identifier: serializeIdentifier(secret.identifier),
            signingShare
          };
        }
        secret.round2Cache = res;
        secret.step = 2;
        return res;
      },
      round3: (secret, round1, round2) => {
        validateObject2(secret, { identifier: "bigint", commitment: "object", signers: "object" }, { coefficients: "object", round2Cache: "object", step: "number" }, "secret");
        validateSigners(secret.signers, "secret.signers");
        aarray(round1, "round1");
        aarray(round2, "round2");
        if (round1.length !== secret.signers.max - 1)
          throw new Error("wrong length of round1 packages");
        if (!secret.coefficients || secret.step !== 2)
          throw new Error("round2 package used in round3");
        if (round2.length !== round1.length)
          throw new Error("wrong length of round2 packages");
        const merged = {};
        for (const r1 of round1) {
          if (!r1.identifier || !r1.commitment)
            throw new Error("wrong round1 share");
          merged[r1.identifier] = { ...r1 };
        }
        for (const r2 of round2) {
          if (!r2.identifier || !r2.signingShare)
            throw new Error("wrong round2 share");
          if (!merged[r2.identifier])
            throw new Error("round1 share for " + r2.identifier + " is missing");
          merged[r2.identifier].signingShare = r2.signingShare;
        }
        if (Object.keys(merged).length !== round1.length)
          throw new Error("mismatch identifiers between rounds");
        let signingShare = Fn2.ZERO;
        if (secret.commitment.length !== secret.signers.min)
          throw new Error("wrong commitments length");
        const localCommitment = secret.commitment.map(parsePoint);
        const localShare = polynomialEvaluate(secret.identifier, secret.coefficients);
        validateSecretShare(secret.identifier, localCommitment, localShare);
        const localCommitmentBytes = localCommitment.map(serializePoint);
        const commitments = {
          [serializeIdentifier(secret.identifier)]: localCommitmentBytes
        };
        for (const k in merged) {
          const v = merged[k];
          if (!v.signingShare || !v.commitment)
            throw new Error("mismatch identifiers");
          const id = parseIdentifier(k);
          const signingSharePart = Fn2.fromBytes(v.signingShare);
          const commitment = v.commitment.map(parsePoint);
          validateSecretShare(secret.identifier, commitment, signingSharePart);
          signingShare = Fn2.add(signingShare, signingSharePart);
          const idSer = serializeIdentifier(id);
          if (commitments[idSer])
            throw new Error("duplicated id=" + idSer);
          commitments[idSer] = v.commitment;
        }
        signingShare = Fn2.add(signingShare, localShare);
        const mergedCommitment = new Array(secret.signers.min).fill(Point.ZERO);
        for (const k in commitments) {
          const v = commitments[k];
          if (v.length !== secret.signers.min)
            throw new Error("wrong commitments length");
          for (let i = 0; i < v.length; i++)
            mergedCommitment[i] = mergedCommitment[i].add(parsePoint(v[i]));
        }
        const mergedCommitmentBytes = mergedCommitment.map(serializePoint);
        const verifyingShares = {};
        for (const k in commitments)
          verifyingShares[k] = serializePoint(evalutateVSS(parseIdentifier(k), mergedCommitment));
        let res = {
          public: {
            signers: { min: secret.signers.min, max: secret.signers.max },
            commitments: mergedCommitmentBytes,
            verifyingShares: Object.fromEntries(Object.entries(verifyingShares).map(([k, v]) => [k, v.slice()]))
          },
          secret: {
            identifier: serializeIdentifier(secret.identifier),
            signingShare: Fn2.toBytes(signingShare)
          }
        };
        if (opts.adjustDKG)
          res = opts.adjustDKG(res);
        for (let i = 0; i < secret.coefficients.length; i++)
          secret.coefficients[i] -= secret.coefficients[i];
        delete secret.coefficients;
        delete secret.round2Cache;
        secret.step = 3;
        return res;
      },
      clean(secret) {
        validateObject2(secret, { identifier: "bigint", commitment: "object", signers: "object" }, { coefficients: "object", round2Cache: "object", step: "number" }, "secret");
        secret.identifier -= secret.identifier;
        if (secret.coefficients) {
          for (let i = 0; i < secret.coefficients.length; i++)
            secret.coefficients[i] -= secret.coefficients[i];
        }
        delete secret.round2Cache;
        secret.step = 3;
      }
    }),
    // Trusted dealer setup
    // Generates keys for all participants
    trustedDealer(signers, identifiers, secret, rng = randomBytes2) {
      validateSigners(signers);
      if (identifiers === void 0) {
        identifiers = [];
        for (let i = 1; i <= signers.max; i++)
          identifiers.push(Identifier.fromNumber(i));
      } else {
        aarray(identifiers, "identifiers");
        if (identifiers.length !== signers.max)
          throw new Error("identifiers should be array of " + signers.max);
      }
      const identifierNums = {};
      for (const id of identifiers) {
        const idNum = parseIdentifier(id);
        if (id in identifierNums)
          throw new Error("duplicated id=" + id);
        identifierNums[id] = idNum;
      }
      const sp = generateSecretPolynomial(signers, secret, void 0, rng);
      const commitmentBytes = sp.commitment.map(serializePoint);
      const secretShares = {};
      const verifyingShares = {};
      for (const id of identifiers) {
        const signingShare = polynomialEvaluate(identifierNums[id], sp.coefficients);
        verifyingShares[id] = serializePoint(Point.BASE.multiply(signingShare));
        secretShares[id] = {
          identifier: id,
          signingShare: Fn2.toBytes(signingShare)
        };
      }
      return {
        public: {
          signers: { min: signers.min, max: signers.max },
          commitments: commitmentBytes,
          verifyingShares
        },
        secretShares
      };
    },
    // Validate secret (from trusted dealer or DKG)
    validateSecret(secret, pub) {
      validateObject2(secret, { identifier: "string", signingShare: "object" }, {}, "secret");
      abytes4(secret.signingShare, Fn2.BYTES, "secret.signingShare");
      validateObject2(pub, {
        signers: "object",
        commitments: "object",
        verifyingShares: "object"
      }, {}, "pub");
      validateSigners(pub.signers, "pub.signers");
      aarray(pub.commitments, "pub.commitments");
      const id = parseIdentifier(secret.identifier);
      const commitment = pub.commitments.map(parsePoint);
      const signingShare = Fn2.fromBytes(secret.signingShare);
      validateSecretShare(id, commitment, signingShare);
    },
    // Actual signing
    // Round 1: each participant commit to nonces
    // Nonces kept private, commitments sent to coordinator (or every other participant)
    // NOTE: we don't need the message at this point, which lets a coordinator
    // keep multiple nonce commitments per participant in advance and skip
    // round1 for signing.
    // But then each participant needs to remember generated shares
    commit(secret, rng = randomBytes2) {
      validateObject2(secret, { identifier: "string", signingShare: "object" }, {}, "secret");
      abytes4(secret.signingShare, Fn2.BYTES, "secret.signingShare");
      if (typeof rng !== "function")
        throw new TypeError('"rng" expected function, got type=' + typeof rng);
      const secretScalar = Fn2.fromBytes(secret.signingShare);
      const hiding = generateNonce(secretScalar, rng);
      const binding = generateNonce(secretScalar, rng);
      const nonces = { hiding: Fn2.toBytes(hiding), binding: Fn2.toBytes(binding) };
      return { nonces, commitments: nonceCommitments(secret.identifier, nonces) };
    },
    // Round2: sign. Each participant creates a signature share from the secret
    // and the selected nonce commitments.
    signShare(secret, pub, nonces, commitmentList, msg) {
      validateObject2(secret, { identifier: "string", signingShare: "object" }, {}, "secret");
      abytes4(secret.signingShare, Fn2.BYTES, "secret.signingShare");
      validateObject2(pub, {
        signers: "object",
        commitments: "object",
        verifyingShares: "object"
      }, {}, "pub");
      validateSigners(pub.signers, "pub.signers");
      aarray(pub.commitments, "pub.commitments");
      validateObject2(nonces, { hiding: "object", binding: "object" }, {}, "nonces");
      abytes4(nonces.hiding, Fn2.BYTES, "nonces.hiding");
      abytes4(nonces.binding, Fn2.BYTES, "nonces.binding");
      aarray(commitmentList, "commitmentList");
      abytes4(msg, void 0, "msg");
      validateCommitmentsNum(pub.signers, commitmentList.length);
      const hidingNonce0 = Fn2.fromBytes(nonces.hiding);
      const bindingNonce0 = Fn2.fromBytes(nonces.binding);
      if (Fn2.is0(hidingNonce0) || Fn2.is0(bindingNonce0))
        throw new Error("signing nonces already used");
      const expectedCommitment = {
        identifier: secret.identifier,
        hiding: serializePoint(Point.BASE.multiply(hidingNonce0)),
        binding: serializePoint(Point.BASE.multiply(bindingNonce0))
      };
      const commitment = commitmentList.find((i) => i.identifier === secret.identifier);
      if (!commitment)
        throw new Error("missing signer commitment");
      if (bytesToHex3(commitment.hiding) !== bytesToHex3(expectedCommitment.hiding) || bytesToHex3(commitment.binding) !== bytesToHex3(expectedCommitment.binding))
        throw new Error("incorrect signer commitment");
      if (opts.adjustSecret)
        secret = opts.adjustSecret(secret, pub);
      if (opts.adjustPublic)
        pub = opts.adjustPublic(pub);
      const SK = Fn2.fromBytes(secret.signingShare);
      const { lambda, challenge: challenge2, bindingFactor, groupCommitment } = prepareShare(pub.commitments[0], commitmentList, msg, secret.identifier);
      const N = opts.adjustNonces ? opts.adjustNonces(groupCommitment, nonces) : nonces;
      const hidingNonce = opts.adjustNonces ? Fn2.fromBytes(N.hiding) : hidingNonce0;
      const bindingNonce = opts.adjustNonces ? Fn2.fromBytes(N.binding) : bindingNonce0;
      const t = Fn2.mul(Fn2.mul(lambda, SK), challenge2);
      const t2 = Fn2.mul(bindingNonce, bindingFactor);
      const r = Fn2.toBytes(Fn2.add(Fn2.add(hidingNonce, t2), t));
      nonces.hiding.fill(0);
      nonces.binding.fill(0);
      return r;
    },
    // Each participant (or coordinator) can verify signatures from other participants
    verifyShare(pub, commitmentList, msg, identifier, sigShare) {
      validateObject2(pub, {
        signers: "object",
        commitments: "object",
        verifyingShares: "object"
      }, {}, "pub");
      validateSigners(pub.signers, "pub.signers");
      aarray(pub.commitments, "pub.commitments");
      aarray(commitmentList, "commitmentList");
      abytes4(msg, void 0, "msg");
      parseIdentifier(identifier);
      abytes4(sigShare, Fn2.BYTES, "sigShare");
      if (opts.adjustPublic)
        pub = opts.adjustPublic(pub);
      const comm = commitmentList.find((i) => i.identifier === identifier);
      if (!comm)
        throw new Error("cannot find identifier commitment");
      const PK = parsePoint(pub.verifyingShares[identifier]);
      const hidingNonceCommitment = parsePoint(comm.hiding);
      const bindingNonceCommitment = parsePoint(comm.binding);
      const { lambda, challenge: challenge2, bindingFactor, groupCommitment } = prepareShare(pub.commitments[0], commitmentList, msg, identifier);
      let commShare = hidingNonceCommitment.add(bindingNonceCommitment.multiplyUnsafe(bindingFactor));
      if (opts.adjustGroupCommitmentShare)
        commShare = opts.adjustGroupCommitmentShare(groupCommitment, commShare);
      const l = Point.BASE.multiplyUnsafe(Fn2.fromBytes(sigShare));
      const r = commShare.add(PK.multiplyUnsafe(Fn2.mul(challenge2, lambda)));
      return l.equals(r);
    },
    // Aggregate multiple signature shares into groupSignature
    aggregate(pub, commitmentList, msg, sigShares) {
      validateObject2(pub, {
        signers: "object",
        commitments: "object",
        verifyingShares: "object"
      }, {}, "pub");
      validateSigners(pub.signers, "pub.signers");
      aarray(pub.commitments, "pub.commitments");
      aarray(commitmentList, "commitmentList");
      abytes4(msg, void 0, "msg");
      validateObject2(sigShares, {}, {}, "sigShares");
      const rawPub = pub;
      if (opts.adjustPublic)
        pub = opts.adjustPublic(pub);
      try {
        validateCommitmentsNum(pub.signers, commitmentList.length);
      } catch {
        throw new AggErr("aggregation failed", []);
      }
      const ids = commitmentList.map((i) => i.identifier);
      const seen = /* @__PURE__ */ new Set();
      for (const id of ids) {
        if (seen.has(id))
          throw new AggErr("aggregation failed", []);
        seen.add(id);
      }
      if (ids.length !== Object.keys(sigShares).length)
        throw new AggErr("aggregation failed", []);
      for (const id of ids) {
        if (!(id in sigShares) || !(id in pub.verifyingShares))
          throw new AggErr("aggregation failed", []);
      }
      const GPK = parsePoint(pub.commitments[0]);
      const { groupCommitment } = getGroupCommitment(GPK, commitmentList, msg);
      let z = Fn2.ZERO;
      for (const id of ids)
        z = Fn2.add(z, Fn2.fromBytes(sigShares[id]));
      if (!Basic.verify(msg, groupCommitment, z, GPK)) {
        const cheaters = [];
        for (const id of ids) {
          if (!this.verifyShare(rawPub, commitmentList, msg, id, sigShares[id]))
            cheaters.push(id);
        }
        throw new AggErr("aggregation failed", cheaters);
      }
      return Signature.encode(groupCommitment, z);
    },
    // Basic sign/verify using single key
    sign(msg, secretKey) {
      let sk = Fn2.fromBytes(secretKey);
      if (opts.adjustScalar)
        sk = opts.adjustScalar(sk);
      const [R, z] = Basic.sign(msg, sk);
      return Signature.encode(R, z);
    },
    verify(sig, msg, publicKey) {
      const PK = opts.parsePublicKey ? opts.parsePublicKey(publicKey) : parsePoint(publicKey);
      const { R, z } = Signature.decode(sig);
      return Basic.verify(msg, R, z, PK);
    },
    // Combine multiple secret shares to restore secret
    combineSecret(shares, signers) {
      aarray(shares, "shares");
      validateSigners(signers);
      if (shares.length < signers.min || shares.length > signers.max)
        throw new Error("wrong secret shares array");
      const points = [];
      const seen = {};
      for (const s of shares) {
        const idNum = parseIdentifier(s.identifier);
        const id = serializeIdentifier(idNum);
        if (seen[id])
          throw new Error("duplicated id=" + id);
        seen[id] = true;
        points.push([idNum, Fn2.fromBytes(s.signingShare)]);
      }
      const xCoords = points.map(([x]) => x);
      let res = Fn2.ZERO;
      for (const [x, y] of points)
        res = Fn2.add(res, Fn2.mul(y, deriveInterpolatingValue(xCoords, x)));
      return Fn2.toBytes(res);
    },
    // Utils
    utils: Object.freeze({
      Fn: Fn2,
      // NOTE: we re-export it here because it may be different from Point.Fn (ed448 is fun!)
      // Test RNG overrides still go through noble's non-zero scalar derivation; this is not a raw
      // "bytes become scalar" escape hatch.
      randomScalar: (rng = randomBytes2) => Fn2.toBytes(genPointScalarPair(rng).scalar),
      generateSecretPolynomial: (signers, secret, coeffs, rng) => {
        const res = generateSecretPolynomial(signers, secret, coeffs, rng);
        return { ...res, commitment: res.commitment.map(serializePoint) };
      }
    })
  };
  return Object.freeze(frost);
}
var validateSigners, validateCommitmentsNum, AggErr;
var init_frost = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/frost.js"() {
    init_utils3();
    init_utils4();
    init_curve();
    init_fft();
    init_modular();
    validateSigners = (signers, title = "signers") => {
      validateObject2(signers, { min: "number", max: "number" }, {}, title);
      asafenumber(signers.min, title + ".min");
      asafenumber(signers.max, title + ".max");
      if (signers.min < 2 || signers.max < 2 || signers.min > signers.max)
        throw new Error("Wrong signers info: min=" + signers.min + " max=" + signers.max);
    };
    validateCommitmentsNum = (signers, len) => {
      if (len < signers.min || len > signers.max)
        throw new Error("Wrong number of commitments=" + len);
    };
    AggErr = class extends Error {
      // Empty means aggregation failed before per-share verification could attribute a signer.
      cheaters;
      constructor(msg, cheaters) {
        super(msg);
        this.cheaters = cheaters;
      }
    };
  }
});

// ../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/hmac.js
var _HMAC, hmac;
var init_hmac = __esm({
  "../../../node_modules/.pnpm/@noble+hashes@2.3.0/node_modules/@noble/hashes/hmac.js"() {
    init_utils3();
    _HMAC = class {
      oHash;
      iHash;
      blockLen;
      outputLen;
      canXOF = false;
      finished = false;
      destroyed = false;
      constructor(hash, key) {
        ahash(hash);
        abytes2(key, void 0, "key");
        this.iHash = hash.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("expected Hash instance");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad2 = new Uint8Array(blockLen);
        pad2.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad2.length; i++)
          pad2[i] ^= 54;
        this.iHash.update(pad2);
        this.oHash = hash.create();
        for (let i = 0; i < pad2.length; i++)
          pad2[i] ^= 54 ^ 92;
        this.oHash.update(pad2);
        clean2(pad2);
      }
      update(buf) {
        aexists2(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        aexists2(this);
        aoutput2(out, this);
        this.finished = true;
        const buf = out.subarray(0, this.outputLen);
        this.iHash.digestInto(buf);
        this.oHash.update(buf);
        this.oHash.digestInto(buf);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to ||= Object.create(Object.getPrototypeOf(this), {});
        const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.canXOF = canXOF;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    hmac = /* @__PURE__ */ (() => {
      const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
      hmac_.create = (hash, key) => new _HMAC(hash, key);
      return hmac_;
    })();
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/der.js
var _0n6, DERErr, _DER, DER;
var init_der = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/der.js"() {
    init_utils4();
    _0n6 = /* @__PURE__ */ BigInt(0);
    DERErr = class extends Error {
      constructor(m = "") {
        super(m);
      }
    };
    _DER = {
      // asn.1 DER encoding utils
      Err: DERErr,
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: (tag, data) => {
          const { Err: E } = _DER;
          asafenumber(tag, "tag");
          if (tag < 0 || tag > 255)
            throw new E("tlv.encode: wrong tag");
          astring(data, "data");
          if (data.length & 1)
            throw new E("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = numberToHexUnpadded(dataLen);
          if (len.length / 2 & 128)
            throw new E("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
          const t = numberToHexUnpadded(tag);
          return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E } = _DER;
          data = abytes4(data, void 0, "DER data");
          let pos = 0;
          if (tag < 0 || tag > 255)
            throw new E("tlv.decode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length = 0;
          if (!isLong)
            length = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E("tlv.decode(long): zero leftmost byte");
            for (const b of lengthBytes)
              length = length << 8 | b;
            pos += lenLen;
            if (length < 128)
              throw new E("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length);
          if (v.length !== length)
            throw new E("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num2) {
          const { Err: E } = _DER;
          abignumber(num2);
          if (num2 < _0n6)
            throw new E("integer: negative integers are not allowed");
          let hex2 = numberToHexUnpadded(num2);
          if (Number.parseInt(hex2[0], 16) & 8)
            hex2 = "00" + hex2;
          if (hex2.length & 1)
            throw new E("unexpected DER parsing assertion: unpadded hex");
          return hex2;
        },
        decode(data) {
          const { Err: E } = _DER;
          if (data.length < 1)
            throw new E("invalid signature integer: empty");
          if (data[0] & 128)
            throw new E("invalid signature integer: negative");
          if (data.length > 1 && data[0] === 0 && !(data[1] & 128))
            throw new E("invalid signature integer: unnecessary leading zero");
          return bytesToNumberBE(data);
        }
      },
      toSig(bytes) {
        const { Err: E, _int: int, _tlv: tlv } = _DER;
        const data = abytes4(bytes, void 0, "signature");
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = _DER;
        validateObject2(sig, { r: "bigint", s: "bigint" }, {}, "sig");
        const rs = tlv.encode(2, int.encode(sig.r));
        const ss = tlv.encode(2, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(48, seq);
      }
    };
    DER = /* @__PURE__ */ (() => {
      Object.freeze(_DER._tlv);
      Object.freeze(_DER._int);
      return Object.freeze(_DER);
    })();
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/weierstrass.js
function _splitEndoScalar(k, basis, n) {
  aInRange("scalar", k, _0n7, n);
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n7;
  const k2neg = k2 < _0n7;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n6;
  if (k1 < _0n7 || k1 >= MAX_NUM || k2 < _0n7 || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed for k");
  }
  return { k1neg, k1, k2neg, k2 };
}
function validateSigFormat(format) {
  if (!["compact", "recovered", "der"].includes(format))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts(opts, def) {
  validateObject2(opts);
  const optsn = {};
  for (let optName of Object.keys(def)) {
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  }
  abool2(optsn.lowS, "lowS");
  abool2(optsn.prehash, "prehash");
  if (optsn.format !== void 0)
    validateSigFormat(optsn.format);
  return optsn;
}
function weierstrass(params, extraOpts = {}) {
  const validated = createCurveFields("weierstrass", params, extraOpts);
  const Fp2 = validated.Fp;
  const Fn2 = validated.Fn;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  validateObject2(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object",
    randomBytes: "function"
  });
  const { endo, allowInfinityPoint } = extraOpts;
  const randomBytes3 = extraOpts.randomBytes === void 0 ? randomBytes2 : extraOpts.randomBytes;
  if (endo) {
    if (!Fp2.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const lengths = getWLengths(Fp2, Fn2);
  function assertCompressionIsSupported() {
    if (!Fp2.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes2(_c, point, isCompressed) {
    if (allowInfinityPoint && point.is0())
      return Uint8Array.of(0);
    const { x, y } = point.toAffine();
    const bx = Fp2.toBytes(x);
    abool2(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp2.isOdd(y);
      return concatBytes2(pprefix(hasEvenY), bx);
    } else {
      return concatBytes2(Uint8Array.of(4), bx, Fp2.toBytes(y));
    }
  }
  function pointFromBytes(bytes) {
    abytes4(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (allowInfinityPoint && length === 1 && head === 0)
      return { x: Fp2.ZERO, y: Fp2.ZERO };
    if (length === comp && (head === 2 || head === 3)) {
      const x = Fp2.fromBytes(tail);
      if (!Fp2.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp2.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const evenY = Fp2.isOdd(y);
      const evenH = (head & 1) === 1;
      if (evenH !== evenY)
        y = Fp2.neg(y);
      return { x, y };
    } else if (length === uncomp && head === 4) {
      const L = Fp2.BYTES;
      const x = Fp2.fromBytes(tail.subarray(0, L));
      const y = Fp2.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = extraOpts.toBytes === void 0 ? pointToBytes2 : extraOpts.toBytes;
  const decodePoint = extraOpts.fromBytes === void 0 ? pointFromBytes : extraOpts.fromBytes;
  const b3 = Fp2.mul(CURVE.b, _3n3);
  const mulA = Fp2.is0(CURVE.a) ? (_) => Fp2.ZERO : (x) => Fp2.mul(CURVE.a, x);
  function weierstrassEquation(x) {
    const x2 = Fp2.sqr(x);
    const x3 = Fp2.mul(x2, x);
    return Fp2.add(Fp2.add(x3, Fp2.mul(x, CURVE.a)), CURVE.b);
  }
  function isValidXY(x, y) {
    const left = Fp2.sqr(y);
    const right = weierstrassEquation(x);
    return Fp2.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp2.mul(Fp2.pow(CURVE.a, _3n3), _4n4);
  const _27b2 = Fp2.mul(Fp2.sqr(CURVE.b), BigInt(27));
  if (Fp2.is0(Fp2.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp2.isValid(n) || banZero && Fp2.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point))
      throw new Error("Weierstrass Point expected");
  }
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises)
      throw new Error("no endo");
    return _splitEndoScalar(k, endo.basises, Fn2.ORDER);
  }
  function pushWnafPair(points, scalars, p, k) {
    if (!Fn2.isValid(k))
      throw new RangeError("invalid scalar: out of range");
    if (endo) {
      const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(k);
      const psi = new Point(Fp2.mul(p.X, endo.beta), p.Y, p.Z);
      points.push(k1neg ? p.negate() : p, k2neg ? psi.negate() : psi);
      scalars.push(k1, k2);
    } else {
      points.push(p);
      scalars.push(k);
    }
  }
  const validityCache = /* @__PURE__ */ new WeakSet();
  class Point {
    static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp2.ONE);
    static ZERO = new Point(Fp2.ZERO, Fp2.ONE, Fp2.ZERO);
    static Fp = Fp2;
    static Fn = Fn2;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp2.isValid(x) || !Fp2.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point)
        throw new Error("projective point not allowed");
      if (Fp2.is0(x) && Fp2.is0(y))
        return Point.ZERO;
      return new Point(x, y, Fp2.ONE);
    }
    static fromBytes(bytes) {
      const P = Point.fromAffine(decodePoint(abytes4(bytes, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex2) {
      return Point.fromBytes(hexToBytes4(hex2));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * @param isLazy - true will defer table computation until the first multiplication
     */
    precompute(windowSize = 6, isLazy = true) {
      wnaf.setWindowSize(this, windowSize);
      if (!isLazy)
        this.multiply(_3n3);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      const p = this;
      if (p.is0()) {
        if (extraOpts.allowInfinityPoint && Fp2.is0(p.X) && Fp2.eql(p.Y, Fp2.ONE) && Fp2.is0(p.Z))
          return;
        throw new Error("bad point: ZERO");
      }
      if (validityCache.has(p))
        return;
      const { x, y } = p.toAffine();
      if (!Fp2.isValid(x) || !Fp2.isValid(y))
        throw new Error("bad point: x or y not field elements");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      validityCache.add(p);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp2.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp2.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp2.eql(Fp2.mul(X1, Z2), Fp2.mul(X2, Z1));
      const U2 = Fp2.eql(Fp2.mul(Y1, Z2), Fp2.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point(this.X, Fp2.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp2.ZERO, Y3 = Fp2.ZERO, Z3 = Fp2.ZERO;
      let t0 = Fp2.mul(X1, X1);
      let t1 = Fp2.mul(Y1, Y1);
      let t2 = Fp2.mul(Z1, Z1);
      let t3 = Fp2.mul(X1, Y1);
      t3 = Fp2.add(t3, t3);
      Z3 = Fp2.mul(X1, Z1);
      Z3 = Fp2.add(Z3, Z3);
      X3 = mulA(Z3);
      Y3 = Fp2.mul(b3, t2);
      Y3 = Fp2.add(X3, Y3);
      X3 = Fp2.sub(t1, Y3);
      Y3 = Fp2.add(t1, Y3);
      Y3 = Fp2.mul(X3, Y3);
      X3 = Fp2.mul(t3, X3);
      Z3 = Fp2.mul(b3, Z3);
      t2 = mulA(t2);
      t3 = Fp2.sub(t0, t2);
      t3 = mulA(t3);
      t3 = Fp2.add(t3, Z3);
      Z3 = Fp2.add(t0, t0);
      t0 = Fp2.add(Z3, t0);
      t0 = Fp2.add(t0, t2);
      t0 = Fp2.mul(t0, t3);
      Y3 = Fp2.add(Y3, t0);
      t2 = Fp2.mul(Y1, Z1);
      t2 = Fp2.add(t2, t2);
      t0 = Fp2.mul(t2, t3);
      X3 = Fp2.sub(X3, t0);
      Z3 = Fp2.mul(t2, t1);
      Z3 = Fp2.add(Z3, Z3);
      Z3 = Fp2.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp2.ZERO, Y3 = Fp2.ZERO, Z3 = Fp2.ZERO;
      let t0 = Fp2.mul(X1, X2);
      let t1 = Fp2.mul(Y1, Y2);
      let t2 = Fp2.mul(Z1, Z2);
      let t3 = Fp2.add(X1, Y1);
      let t4 = Fp2.add(X2, Y2);
      t3 = Fp2.mul(t3, t4);
      t4 = Fp2.add(t0, t1);
      t3 = Fp2.sub(t3, t4);
      t4 = Fp2.add(X1, Z1);
      let t5 = Fp2.add(X2, Z2);
      t4 = Fp2.mul(t4, t5);
      t5 = Fp2.add(t0, t2);
      t4 = Fp2.sub(t4, t5);
      t5 = Fp2.add(Y1, Z1);
      X3 = Fp2.add(Y2, Z2);
      t5 = Fp2.mul(t5, X3);
      X3 = Fp2.add(t1, t2);
      t5 = Fp2.sub(t5, X3);
      Z3 = mulA(t4);
      X3 = Fp2.mul(b3, t2);
      Z3 = Fp2.add(X3, Z3);
      X3 = Fp2.sub(t1, Z3);
      Z3 = Fp2.add(t1, Z3);
      Y3 = Fp2.mul(X3, Z3);
      t1 = Fp2.add(t0, t0);
      t1 = Fp2.add(t1, t0);
      t2 = mulA(t2);
      t4 = Fp2.mul(b3, t4);
      t1 = Fp2.add(t1, t2);
      t2 = Fp2.sub(t0, t2);
      t2 = mulA(t2);
      t4 = Fp2.add(t4, t2);
      t0 = Fp2.mul(t1, t4);
      Y3 = Fp2.add(Y3, t0);
      t0 = Fp2.mul(t5, t4);
      X3 = Fp2.mul(t3, X3);
      X3 = Fp2.sub(X3, t0);
      t0 = Fp2.mul(t3, t1);
      Z3 = Fp2.mul(t5, Z3);
      Z3 = Fp2.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      aprjpoint(other);
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses precomputed tables (signed fixed-window wNAF) when available.
     * Uses scalar blinding and avoids endomorphism splitting in the secret-scalar path.
     * @param scalar - by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      if (!Fn2.isValidNot0(scalar))
        throw new RangeError("invalid scalar: out of range");
      const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize2);
      return normalize2([p, f])[0];
    }
    /**
     * Non-constant-time multiplication. Uses width-4 wNAF with GLV endomorphism splitting
     * when available (two half-width scalars sharing one halved doubling chain).
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(scalar) {
      const p = this;
      const sc = scalar;
      if (!Fn2.isValid(sc))
        throw new RangeError("invalid scalar: out of range");
      if (sc === _0n7 || p.is0())
        return Point.ZERO;
      if (sc === _1n6)
        return p;
      if (wnaf.hasWindowSize(this))
        return wnaf.mulUnsafe(p, sc, normalize2);
      const points = [];
      const scalars = [];
      pushWnafPair(points, scalars, p, sc);
      return mulAddUnsafe(Point, points, scalars);
    }
    /**
     * Non-constant-time double-scalar multiplication `a⋅this + b⋅other` (Strauss–Shamir).
     * Both walks share one doubling chain via {@link mulAddUnsafe}, and GLV endomorphism
     * (when available) halves the chain again by splitting each scalar into two half-width
     * parts. Used by ECDSA verification and public-key recovery for `R = u1⋅G + u2⋅P`.
     * Only for public scalars.
     */
    mulAddUnsafe(a, other, b) {
      aprjpoint(other);
      const points = [];
      const scalars = [];
      pushWnafPair(points, scalars, this, a);
      pushWnafPair(points, scalars, other, b);
      return mulAddUnsafe(Point, points, scalars);
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * (X, Y, Z) ∋ (x=X/Z, y=Y/Z).
     * @param invertedZ - Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      const p = this;
      let iz = invertedZ;
      if (iz != null && !Fp2.isValid(iz))
        throw new RangeError('"invertedZ" expected valid field element');
      const { X, Y, Z } = p;
      if (Fp2.eql(Z, Fp2.ONE))
        return { x: X, y: Y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp2.ONE : Fp2.inv(Z);
      const x = Fp2.mul(X, iz);
      const y = Fp2.mul(Y, iz);
      const zz = Fp2.mul(Z, iz);
      if (is0)
        return { x: Fp2.ZERO, y: Fp2.ZERO };
      if (!Fp2.eql(zz, Fp2.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n6)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      return wnaf.mulUnsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n6)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      if (cofactor === _1n6)
        return this.is0();
      return this.clearCofactor().is0();
    }
    toBytes(isCompressed = true) {
      abool2(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex3(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const normalize2 = (points) => normalizeZ(Point, points);
  const wnaf = new ScalarMultiplier(Point, randomBytes3);
  if (wnaf.bits >= 6)
    Point.BASE.precompute(6);
  Object.freeze(Point.prototype);
  Object.freeze(Point);
  return Point;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths(Fp2, Fn2) {
  return {
    secretKey: Fn2.BYTES,
    publicKey: 1 + Fp2.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp2.BYTES,
    publicKeyHasPrefix: true,
    // Raw compact `(r || s)` signature width; DER and recovered signatures use
    // different lengths outside this helper.
    signature: 2 * Fn2.BYTES
  };
}
function ecdh(Point, ecdhOpts = {}) {
  validatePointCons(Point);
  const { Fn: Fn2 } = Point;
  const randomBytes_ = ecdhOpts.randomBytes === void 0 ? randomBytes2 : ecdhOpts.randomBytes;
  const lengths = Object.assign(getWLengths(Point.Fp, Fn2), {
    seed: Math.max(getMinHashLength(Fn2.ORDER), 16)
  });
  function isValidSecretKey(secretKey) {
    try {
      const num2 = Fn2.fromBytes(secretKey);
      return Fn2.isValidNot0(num2);
    } catch (error) {
      return false;
    }
  }
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !!Point.fromBytes(publicKey);
    } catch (error) {
      return false;
    }
  }
  function randomSecretKey(seed) {
    seed = seed === void 0 ? randomBytes_(lengths.seed) : seed;
    return mapHashToField(abytes4(seed, lengths.seed, "seed"), Fn2.ORDER);
  }
  function getPublicKey(secretKey, isCompressed = true) {
    return Point.BASE.multiply(Fn2.fromBytes(secretKey)).toBytes(isCompressed);
  }
  function isProbPub(item) {
    const { secretKey, publicKey, publicKeyUncompressed } = lengths;
    const allowedLengths = Fn2._lengths;
    if (!isBytes4(item))
      return void 0;
    const l = abytes4(item, void 0, "key").length;
    const isPub = l === publicKey || l === publicKeyUncompressed;
    const isSec = l === secretKey || !!allowedLengths?.includes(l);
    if (isPub && isSec)
      return void 0;
    return isPub;
  }
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false)
      throw new Error("second arg must be public key");
    const s = Fn2.fromBytes(secretKeyA);
    const b = Point.fromBytes(publicKeyB);
    return b.multiply(s).toBytes(isCompressed);
  }
  const utils = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey
  };
  const keygen = createKeygen(randomSecretKey, getPublicKey);
  Object.freeze(utils);
  Object.freeze(lengths);
  return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point, utils, lengths });
}
function ecdsa(Point, hash, ecdsaOpts = {}) {
  validatePointCons(Point);
  const hash_ = hash;
  ahash(hash_);
  validateObject2(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  const opts = Object.assign({}, ecdsaOpts);
  const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
  const hmac2 = opts.hmac === void 0 ? (key, msg) => hmac(hash_, key, msg) : opts.hmac;
  const { Fp: Fp2, Fn: Fn2 } = Point;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn2;
  const blindLength = getMinHashLength(CURVE_ORDER);
  const csprng = probeRandomBytes(randomBytes3, blindLength);
  const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, opts);
  const defaultSigOpts = {
    prehash: true,
    lowS: typeof opts.lowS === "boolean" ? opts.lowS : true,
    format: "compact",
    extraEntropy: false
  };
  const hasLargeRecoveryLifts = CURVE_ORDER * _2n4 + _1n6 < Fp2.ORDER;
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n6;
    return number > HALF;
  }
  function validateRS(title, num2) {
    if (!Fn2.isValidNot0(num2))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num2;
  }
  function assertFieldSignIsSupported() {
    if (!Fp2.isOdd)
      throw new Error("Field doesn't support isOdd");
  }
  function getRecoveryBit(x, y, r) {
    assertFieldSignIsSupported();
    return (x === r ? 0 : 2) | Number(Fp2.isOdd(y));
  }
  function assertRecoverableCurve() {
    if (hasLargeRecoveryLifts)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function validateSigLength(bytes, format) {
    validateSigFormat(format);
    const size2 = lengths.signature;
    const sizer = format === "compact" ? size2 : format === "recovered" ? size2 + 1 : void 0;
    return abytes4(bytes, sizer);
  }
  class Signature {
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null) {
        assertRecoverableCurve();
        if (![0, 1, 2, 3].includes(recovery))
          throw new Error("invalid recovery id");
        this.recovery = recovery;
      }
      Object.freeze(this);
    }
    static fromBytes(bytes, format = defaultSigOpts.format) {
      validateSigLength(bytes, format);
      let recid;
      if (format === "der") {
        const { r: r2, s: s2 } = DER.toSig(abytes4(bytes));
        return new Signature(r2, s2);
      }
      if (format === "recovered") {
        recid = bytes[0];
        format = "compact";
        bytes = bytes.subarray(1);
      }
      const L = lengths.signature / 2;
      const r = bytes.subarray(0, L);
      const s = bytes.subarray(L, L * 2);
      return new Signature(Fn2.fromBytes(r), Fn2.fromBytes(s), recid);
    }
    static fromHex(hex2, format) {
      return this.fromBytes(hexToBytes4(hex2), format);
    }
    assertRecovery() {
      const { recovery } = this;
      if (recovery == null)
        throw new Error("invalid recovery id: must be present");
      return recovery;
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    // Unlike the top-level helper below, this method expects a digest that has
    // already been hashed to the curve's message representative.
    recoverPublicKey(messageHash) {
      const { r, s } = this;
      const recovery = this.assertRecovery();
      const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
      if (!Fp2.isValid(radj))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const x = Fp2.toBytes(radj);
      const R = Point.fromBytes(concatBytes2(pprefix((recovery & 1) === 0), x));
      const ir = Fn2.inv(radj);
      const h = bits2int_modN(abytes4(messageHash, void 0, "msgHash"));
      const u1 = Fn2.create(-h * ir);
      const u2 = Fn2.create(s * ir);
      const Q = Point.BASE.mulAddUnsafe(u1, R, u2);
      if (Q.is0())
        throw new Error("invalid recovery: point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts.format) {
      validateSigFormat(format);
      if (format === "der")
        return hexToBytes4(DER.hexFromSig(this));
      const { r, s } = this;
      const rb = Fn2.toBytes(r);
      const sb = Fn2.toBytes(s);
      if (format === "recovered") {
        assertRecoverableCurve();
        return concatBytes2(Uint8Array.of(this.assertRecovery()), rb, sb);
      }
      return concatBytes2(rb, sb);
    }
    toHex(format) {
      return bytesToHex3(this.toBytes(format));
    }
  }
  Object.freeze(Signature.prototype);
  Object.freeze(Signature);
  const bits2int = opts.bits2int === void 0 ? function bits2int_def(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num2 = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num2 >> BigInt(delta) : num2;
  } : opts.bits2int;
  const bits2int_modN = opts.bits2int_modN === void 0 ? function bits2int_modN_def(bytes) {
    return Fn2.create(bits2int(bytes));
  } : opts.bits2int_modN;
  const ORDER_MASK = bitMask(fnBits);
  function int2octets(num2) {
    aInRange("num < 2^" + fnBits, num2, _0n7, ORDER_MASK);
    return Fn2.toBytes(num2);
  }
  function validateMsgAndHash(message, prehash) {
    abytes4(message, void 0, "message");
    return prehash ? abytes4(hash_(message), void 0, "prehashed message") : message;
  }
  function prepSig(message, secretKey, opts2) {
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts2, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN(message);
    const d = Fn2.fromBytes(secretKey);
    if (!Fn2.isValidNot0(d))
      throw new Error("invalid private key");
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes3(lengths.secretKey) : extraEntropy;
      seedArgs.push(abytes4(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn2.isValidNot0(k))
        return;
      const q = Point.BASE.multiply(k).toAffine();
      const r = Fn2.create(q.x);
      if (r === _0n7)
        return;
      let s;
      if (csprng !== void 0) {
        const b = bytesToNumberBE(mapHashToField(csprng(blindLength), CURVE_ORDER));
        const ibk = Fn2.inv(Fn2.mul(b, k));
        const bm = Fn2.mul(b, m);
        const bd = Fn2.mul(b, d);
        s = Fn2.create(ibk * Fn2.create(bm + bd * r));
      } else {
        const ik = invertCt(k, CURVE_ORDER);
        s = Fn2.create(ik * Fn2.create(m + r * d));
      }
      if (s === _0n7)
        return;
      let recovery = getRecoveryBit(q.x, q.y, r);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn2.neg(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, hasLargeRecoveryLifts ? void 0 : recovery);
    }
    return { seed, k2sig };
  }
  function sign(message, secretKey, opts2 = {}) {
    const { seed, k2sig } = prepSig(message, secretKey, opts2);
    const drbg = createHmacDrbg(hash_.outputLen, Fn2.BYTES, hmac2);
    const sig = drbg(seed, k2sig);
    return sig.toBytes(opts2.format);
  }
  function verify(signature, message, publicKey, opts2 = {}) {
    const { lowS, prehash, format } = validateSigOpts(opts2, defaultSigOpts);
    publicKey = abytes4(publicKey, void 0, "publicKey");
    message = validateMsgAndHash(message, prehash);
    if (!isBytes4(signature)) {
      const end = signature instanceof Signature ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + end);
    }
    validateSigLength(signature, format);
    try {
      const sig = Signature.fromBytes(signature, format);
      const P = Point.fromBytes(publicKey);
      if (lowS && sig.hasHighS())
        return false;
      const { r, s } = sig;
      const h = bits2int_modN(message);
      const is = Fn2.inv(s);
      const u1 = Fn2.create(h * is);
      const u2 = Fn2.create(r * is);
      const R = Point.BASE.mulAddUnsafe(u1, P, u2);
      if (R.is0())
        return false;
      const q = R.toAffine();
      const v = Fn2.create(q.x);
      if (v !== r)
        return false;
      if (format === "recovered" && sig.recovery !== getRecoveryBit(q.x, q.y, r))
        return false;
      return true;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature, message, opts2 = {}) {
    const { prehash } = validateSigOpts(opts2, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen,
    getPublicKey,
    getSharedSecret,
    utils,
    lengths,
    Point,
    sign,
    verify,
    recoverPublicKey,
    Signature,
    hash: hash_
  });
}
var divNearest, _0n7, _1n6, _2n4, _3n3, _4n4;
var init_weierstrass = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/weierstrass.js"() {
    init_hmac();
    init_utils3();
    init_utils4();
    init_curve();
    init_der();
    init_modular();
    divNearest = (num2, den) => (num2 + (num2 >= 0 ? den : -den) / _2n4) / den;
    _0n7 = /* @__PURE__ */ BigInt(0);
    _1n6 = /* @__PURE__ */ BigInt(1);
    _2n4 = /* @__PURE__ */ BigInt(2);
    _3n3 = /* @__PURE__ */ BigInt(3);
    _4n4 = /* @__PURE__ */ BigInt(4);
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/secp256k1.js
var secp256k1_exports = {};
__export(secp256k1_exports, {
  __TEST: () => __TEST,
  schnorr: () => schnorr,
  schnorr_FROST: () => schnorr_FROST,
  secp256k1: () => secp256k1,
  secp256k1_FROST: () => secp256k1_FROST,
  secp256k1_hasher: () => secp256k1_hasher
});
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n5 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n5, P) * b3 % P;
  const b9 = pow2(b6, _3n5, P) * b3 % P;
  const b11 = pow2(b9, _2n5, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n5, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n5, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
function taggedHash(tag, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES[tag];
  if (tagP === void 0) {
    const tagH = sha256(asciiToBytes(tag));
    tagP = concatBytes2(tagH, tagH);
    TAGGED_HASH_PREFIXES[tag] = tagP;
  }
  return sha256(concatBytes2(tagP, ...messages));
}
function schnorrGetExtPubKey(priv) {
  const { Fn: Fn2, BASE } = Pointk1;
  const d_ = Fn2.fromBytes(abytes4(priv, 32, "secretKey"));
  const p = BASE.multiply(d_);
  const affine = p.toAffine();
  const scalar = hasEven(affine.y) ? d_ : Fn2.neg(d_);
  return { scalar, bytes: affineXToBytes(affine) };
}
function lift_x(x) {
  const Fp2 = Fpk1;
  if (!Fp2.isValidNot0(x))
    throw new Error("invalid x: Fail if x \u2265 p");
  const xx = Fp2.sqr(x);
  const c = Fp2.add(Fp2.mulN(xx, x), BigInt(7));
  let y = Fp2.sqrt(c);
  if (!hasEven(y))
    y = Fp2.neg(y);
  const p = Pointk1.fromAffine({ x, y });
  p.assertValidity();
  return p;
}
function challenge(...args) {
  return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey(secretKey) {
  return schnorrGetExtPubKey(secretKey).bytes;
}
function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
  const { Fn: Fn2, BASE } = Pointk1;
  const m = abytes4(message, void 0, "message");
  const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
  const a = abytes4(auxRand, 32, "auxRand");
  const t = Fn2.toBytes(d ^ num(taggedHash("BIP0340/aux", a)));
  const rand = taggedHash("BIP0340/nonce", t, px, m);
  const k_ = Fn2.create(num(rand));
  if (k_ === _0n8)
    throw new Error("sign failed: k is zero");
  const p = BASE.multiply(k_);
  const affine = p.toAffine();
  const k = hasEven(affine.y) ? k_ : Fn2.neg(k_);
  const rx = affineXToBytes(affine);
  const e = challenge(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(Fn2.toBytes(Fn2.create(k + e * d)), 32);
  if (!schnorrVerify(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify(signature, message, publicKey) {
  const { Fp: Fp2, Fn: Fn2, BASE } = Pointk1;
  const sig = abytes4(signature, 64, "signature");
  const m = abytes4(message, void 0, "message");
  const pub = abytes4(publicKey, 32, "publicKey");
  try {
    const P = lift_x(num(pub));
    const rBytes = sig.subarray(0, 32);
    const r = num(rBytes);
    if (!Fp2.isValidNot0(r))
      return false;
    const s = num(sig.subarray(32, 64));
    if (!Fn2.isValidNot0(s))
      return false;
    const e = challenge(rBytes, pointToBytes(P), m);
    const R = BASE.mulAddUnsafe(s, P, Fn2.neg(e));
    const { x, y } = R.toAffine();
    if (R.is0() || !hasEven(y) || !Fp2.eql(x, r))
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
function tweak(point, merkleRoot) {
  if (merkleRoot === void 0)
    return _0n8;
  const x = pointToBytes(point);
  const t = bytesToNumberBE(taggedHash("TapTweak", x, merkleRoot));
  if (!Pointk1.Fn.isValid(t))
    throw new Error("invalid TapTweak hash");
  return t;
}
function frostPubToEvenY(pub) {
  const VK = Pointk1.fromBytes(pub.commitments[0]);
  if (hasEven(VK.y))
    return pub;
  return {
    signers: { min: pub.signers.min, max: pub.signers.max },
    commitments: pub.commitments.map((i) => Pointk1.fromBytes(i).negate().toBytes()),
    verifyingShares: Object.fromEntries(Object.entries(pub.verifyingShares).map(([k, v]) => [
      k,
      Pointk1.fromBytes(v).negate().toBytes()
    ]))
  };
}
function frostSecretToEvenY(s, pub) {
  const VK = Pointk1.fromBytes(pub.commitments[0]);
  if (hasEven(VK.y))
    return s;
  const Fn2 = Pointk1.Fn;
  return {
    ...s,
    signingShare: Fn2.toBytes(Fn2.neg(Fn2.fromBytes(s.signingShare)))
  };
}
function frostNoncesToEvenY(groupCommitment, nonces) {
  if (hasEven(groupCommitment.y))
    return nonces;
  const Fn2 = Pointk1.Fn;
  return {
    binding: Fn2.toBytes(Fn2.neg(Fn2.fromBytes(nonces.binding))),
    hiding: Fn2.toBytes(Fn2.neg(Fn2.fromBytes(nonces.hiding)))
  };
}
function frostTweakSecret(s, pub, merkleRoot) {
  const Fn2 = Pointk1.Fn;
  const keyPackage = frostSecretToEvenY(s, pub);
  const evenPub = frostPubToEvenY(pub);
  const t = tweak(Pointk1.fromBytes(evenPub.commitments[0]), merkleRoot);
  const signingShare = Fn2.toBytes(Fn2.add(Fn2.fromBytes(keyPackage.signingShare), t));
  return {
    identifier: keyPackage.identifier,
    signingShare
  };
}
function frostTweakPublic(pub, merkleRoot) {
  const PKPackage = frostPubToEvenY(pub);
  const t = tweak(Pointk1.fromBytes(PKPackage.commitments[0]), merkleRoot);
  if (t === _0n8)
    return PKPackage;
  const tp = Pointk1.BASE.multiply(t);
  const commitments = PKPackage.commitments.map((c, i) => (i === 0 ? Pointk1.fromBytes(c).add(tp) : Pointk1.fromBytes(c)).toBytes());
  const verifyingShares = {};
  for (const k in PKPackage.verifyingShares) {
    verifyingShares[k] = Pointk1.fromBytes(PKPackage.verifyingShares[k]).add(tp).toBytes();
  }
  return {
    signers: { min: PKPackage.signers.min, max: PKPackage.signers.max },
    commitments,
    verifyingShares
  };
}
var secp256k1_CURVE, secp256k1_ENDO, _0n8, _2n5, Fpk1, Pointk1, secp256k1, TAGGED_HASH_PREFIXES, pointToBytes, affineXToBytes, hasEven, num, __TEST, schnorr, isoMap, mapSWU, getMapSWU, secp256k1_hasher, secp256k1_FROST, schnorr_FROST;
var init_secp256k1 = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/secp256k1.js"() {
    init_sha2();
    init_utils3();
    init_curve();
    init_frost();
    init_hash_to_curve();
    init_modular();
    init_weierstrass();
    init_utils4();
    secp256k1_CURVE = {
      p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
      n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
      h: BigInt(1),
      a: BigInt(0),
      b: BigInt(7),
      Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
      Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
    };
    secp256k1_ENDO = {
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
      basises: [
        [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
        [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
      ]
    };
    _0n8 = /* @__PURE__ */ BigInt(0);
    _2n5 = /* @__PURE__ */ BigInt(2);
    Fpk1 = /* @__PURE__ */ Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
    Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
      Fp: Fpk1,
      endo: secp256k1_ENDO
    });
    secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha256);
    TAGGED_HASH_PREFIXES = /* @__PURE__ */ Object.create(null);
    pointToBytes = (point) => point.toBytes(true).slice(1);
    affineXToBytes = ({ x }) => Fpk1.toBytes(x);
    hasEven = (y) => !Fpk1.isOdd(y);
    num = bytesToNumberBE;
    __TEST = /* @__PURE__ */ Object.freeze({ lift_x, frostTweakPublic, frostTweakSecret });
    schnorr = /* @__PURE__ */ (() => {
      const size2 = 32;
      const seedLength = 48;
      const randomSecretKey = (seed) => {
        seed = seed === void 0 ? randomBytes(seedLength) : seed;
        return mapHashToField(abytes4(seed, seedLength, "seed"), secp256k1_CURVE.n);
      };
      return Object.freeze({
        keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
        getPublicKey: schnorrGetPublicKey,
        sign: schnorrSign,
        verify: schnorrVerify,
        Point: Pointk1,
        utils: Object.freeze({
          randomSecretKey,
          taggedHash,
          lift_x,
          pointToBytes
        }),
        lengths: Object.freeze({
          secretKey: size2,
          publicKey: size2,
          publicKeyHasPrefix: false,
          signature: size2 * 2,
          seed: seedLength
        })
      });
    })();
    isoMap = /* @__PURE__ */ (() => isogenyMap(Fpk1, [
      // xNum
      [
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
        "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
        "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
      ],
      // xDen
      [
        "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
        "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ],
      // yNum
      [
        "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
        "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
        "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
        "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
      ],
      // yDen
      [
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
        "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
        "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ]
    ].map((i) => i.map((j) => BigInt(j)))))();
    getMapSWU = () => mapSWU || (mapSWU = mapToCurveSimpleSWU(Fpk1, {
      // Building the SWU sqrt-ratio helper eagerly adds noticeable `secp256k1.js` import cost, so
      // defer it to first use; after that the cached mapper is reused directly.
      A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
      B: BigInt("1771"),
      Z: Fpk1.create(BigInt("-11"))
    }));
    secp256k1_hasher = /* @__PURE__ */ (() => createHasher3(Pointk1, (scalars) => {
      const { x, y } = getMapSWU()(Fpk1.create(scalars[0]));
      return isoMap(x, y);
    }, {
      DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
      encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
      p: Fpk1.ORDER,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha256
    }))();
    secp256k1_FROST = /* @__PURE__ */ (() => createFROST({
      name: "FROST-secp256k1-SHA256-v1",
      Point: Pointk1,
      hashToScalar: secp256k1_hasher.hashToScalar,
      hash: sha256
    }))();
    schnorr_FROST = /* @__PURE__ */ (() => createFROST({
      name: "FROST-secp256k1-SHA256-TR-v1",
      Point: Pointk1,
      hashToScalar: secp256k1_hasher.hashToScalar,
      hash: sha256,
      // Taproot related hacks
      parsePublicKey(publicKey) {
        if (publicKey.length === 32)
          return lift_x(bytesToNumberBE(publicKey));
        if (publicKey.length === 33)
          return Pointk1.fromBytes(publicKey);
        throw new Error(`expected x-only or compressed public key, got length=${publicKey.length}`);
      },
      adjustScalar(n) {
        const PK = Pointk1.BASE.multiply(n);
        return hasEven(PK.y) ? n : Pointk1.Fn.neg(n);
      },
      adjustPoint: (p) => hasEven(p.y) ? p : p.negate(),
      challenge(R, PK, msg) {
        return challenge(pointToBytes(R), pointToBytes(PK), msg);
      },
      adjustNonces: frostNoncesToEvenY,
      adjustGroupCommitmentShare: (GC, GCShare) => !hasEven(GC.y) ? GCShare.negate() : GCShare,
      adjustPublic: frostPubToEvenY,
      adjustSecret: frostSecretToEvenY,
      adjustTx: {
        // Compat with official implementation
        encode: (tx) => tx.subarray(1),
        decode: (tx) => concatBytes2(Uint8Array.of(2), tx)
      },
      adjustDKG: (k) => {
        const merkleRoot = new Uint8Array(0);
        return {
          public: frostTweakPublic(k.public, merkleRoot),
          secret: frostTweakSecret(k.secret, k.public, merkleRoot)
        };
      }
    }))();
  }
});

// ../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/sha512/index.js
var require_sha512 = __commonJS({
  "../../../node_modules/.pnpm/@xrplf+isomorphic@1.0.2/node_modules/@xrplf/isomorphic/dist/sha512/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha512 = void 0;
    var crypto_1 = __require("crypto");
    var wrapCryptoCreateHash_1 = __importDefault(require_wrapCryptoCreateHash());
    exports.sha512 = (0, wrapCryptoCreateHash_1.default)("sha512", crypto_1.createHash);
  }
});

// ../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/utils/Sha512.js
var require_Sha512 = __commonJS({
  "../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/utils/Sha512.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var sha512_1 = require_sha512();
    var utils_js_1 = (init_utils4(), __toCommonJS(utils_exports2));
    var Sha512 = class _Sha512 {
      constructor() {
        this.hash = sha512_1.sha512.create();
      }
      static half(input) {
        return new _Sha512().add(input).first256();
      }
      add(bytes) {
        this.hash.update(bytes);
        return this;
      }
      addU32(i) {
        const buffer = new Uint8Array(4);
        new DataView(buffer.buffer).setUint32(0, i);
        return this.add(buffer);
      }
      finish() {
        return this.hash.digest();
      }
      first256() {
        return this.finish().slice(0, 32);
      }
      first256BigInt() {
        return (0, utils_js_1.bytesToNumberBE)(this.first256());
      }
    };
    exports.default = Sha512;
  }
});

// ../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/signing-schemes/secp256k1/utils.js
var require_utils3 = __commonJS({
  "../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/signing-schemes/secp256k1/utils.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.accountPublicFromPublicGenerator = exports.derivePrivateKey = void 0;
    var secp256k1_js_1 = (init_secp256k1(), __toCommonJS(secp256k1_exports));
    var Sha512_1 = __importDefault(require_Sha512());
    var ZERO = BigInt(0);
    function deriveScalar(bytes, discrim) {
      const order = secp256k1_js_1.secp256k1.Point.CURVE().n;
      for (let i = 0; i <= 4294967295; i++) {
        const hasher = new Sha512_1.default().add(bytes);
        if (discrim !== void 0) {
          hasher.addU32(discrim);
        }
        hasher.addU32(i);
        const key = hasher.first256BigInt();
        if (key > ZERO && key < order) {
          return key;
        }
      }
      throw new Error("impossible unicorn ;)");
    }
    function derivePrivateKey(seed, opts = {}) {
      const root = opts.validator;
      const order = secp256k1_js_1.secp256k1.Point.CURVE().n;
      const privateGen = deriveScalar(seed);
      if (root) {
        return privateGen;
      }
      const publicGen = secp256k1_js_1.secp256k1.Point.BASE.multiply(privateGen).toBytes(true);
      const accountIndex = opts.accountIndex || 0;
      return (deriveScalar(publicGen, accountIndex) + privateGen) % order;
    }
    exports.derivePrivateKey = derivePrivateKey;
    function accountPublicFromPublicGenerator(publicGenBytes) {
      const rootPubPoint = secp256k1_js_1.secp256k1.Point.fromBytes(publicGenBytes);
      const scalar = deriveScalar(publicGenBytes, 0);
      const point = secp256k1_js_1.secp256k1.Point.BASE.multiply(scalar);
      const offset = rootPubPoint.add(point);
      return offset.toBytes(true);
    }
    exports.accountPublicFromPublicGenerator = accountPublicFromPublicGenerator;
  }
});

// ../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/utils/assert.js
var require_assert = __commonJS({
  "../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/utils/assert.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var assertHelper = {
      ok(cond, message) {
        if (!cond) {
          throw new Error(message);
        }
      }
    };
    exports.default = assertHelper;
  }
});

// ../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/utils/getAlgorithmFromKey.js
var require_getAlgorithmFromKey = __commonJS({
  "../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/utils/getAlgorithmFromKey.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAlgorithmFromPrivateKey = exports.getAlgorithmFromPublicKey = exports.getAlgorithmFromKey = void 0;
    var Prefix;
    (function(Prefix2) {
      Prefix2[Prefix2["NONE"] = -1] = "NONE";
      Prefix2[Prefix2["ED25519"] = 237] = "ED25519";
      Prefix2[Prefix2["SECP256K1_PUB_X"] = 2] = "SECP256K1_PUB_X";
      Prefix2[Prefix2["SECP256K1_PUB_X_ODD_Y"] = 3] = "SECP256K1_PUB_X_ODD_Y";
      Prefix2[Prefix2["SECP256K1_PUB_XY"] = 4] = "SECP256K1_PUB_XY";
      Prefix2[Prefix2["SECP256K1_PRIVATE"] = 0] = "SECP256K1_PRIVATE";
    })(Prefix || (Prefix = {}));
    var KEY_TYPES = {
      [`private_${Prefix.NONE}_32`]: "ecdsa-secp256k1",
      [`private_${Prefix.SECP256K1_PRIVATE}_33`]: "ecdsa-secp256k1",
      [`private_${Prefix.ED25519}_33`]: "ed25519",
      [`public_${Prefix.ED25519}_33`]: "ed25519",
      [`public_${Prefix.SECP256K1_PUB_X}_33`]: "ecdsa-secp256k1",
      [`public_${Prefix.SECP256K1_PUB_X_ODD_Y}_33`]: "ecdsa-secp256k1",
      [`public_${Prefix.SECP256K1_PUB_XY}_65`]: "ecdsa-secp256k1"
    };
    function getKeyInfo(key) {
      return {
        prefix: key.length < 2 ? Prefix.NONE : parseInt(key.slice(0, 2), 16),
        len: key.length / 2
      };
    }
    function prefixRepr(prefix) {
      return prefix === Prefix.NONE ? "None" : `0x${prefix.toString(16).padStart(2, "0")}`;
    }
    function getValidFormatsTable(type) {
      const padding2 = 2;
      const colWidth = {
        algorithm: "ecdsa-secp256k1".length + padding2,
        prefix: "0x00".length + padding2
      };
      return Object.entries(KEY_TYPES).filter(([key]) => key.startsWith(type)).map(([key, algorithm]) => {
        const [, prefix, length] = key.split("_");
        const paddedAlgo = algorithm.padEnd(colWidth.algorithm);
        const paddedPrefix = prefixRepr(Number(prefix)).padEnd(colWidth.prefix);
        return `${paddedAlgo} - Prefix: ${paddedPrefix} Length: ${length} bytes`;
      }).join("\n");
    }
    function keyError({ key, type, prefix, len }) {
      const validFormats = getValidFormatsTable(type);
      const keyRepr = type === "private" ? "[redacted]" : key;
      const prefixRprMsg = type === "private" ? "[redacted]" : prefixRepr(prefix);
      return `invalid_key:

Type: ${type}
Key: ${keyRepr}
Prefix: ${prefixRprMsg}
Length: ${len} bytes

Acceptable ${type} formats are:
${validFormats}
`;
    }
    function getAlgorithmFromKey(key, type) {
      const { prefix, len } = getKeyInfo(key);
      const usedPrefix = type === "private" && len === 32 ? Prefix.NONE : prefix;
      const algorithm = KEY_TYPES[`${type}_${usedPrefix}_${len}`];
      if (!algorithm) {
        throw new Error(keyError({ key, type, len, prefix: usedPrefix }));
      }
      return algorithm;
    }
    exports.getAlgorithmFromKey = getAlgorithmFromKey;
    function getAlgorithmFromPublicKey(key) {
      return getAlgorithmFromKey(key, "public");
    }
    exports.getAlgorithmFromPublicKey = getAlgorithmFromPublicKey;
    function getAlgorithmFromPrivateKey(key) {
      return getAlgorithmFromKey(key, "private");
    }
    exports.getAlgorithmFromPrivateKey = getAlgorithmFromPrivateKey;
  }
});

// ../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/signing-schemes/secp256k1/index.js
var require_secp256k1 = __commonJS({
  "../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/signing-schemes/secp256k1/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_js_1 = (init_utils4(), __toCommonJS(utils_exports2));
    var secp256k1_js_1 = (init_secp256k1(), __toCommonJS(secp256k1_exports));
    var utils_1 = require_utils();
    var utils_2 = require_utils3();
    var assert_1 = __importDefault(require_assert());
    var Sha512_1 = __importDefault(require_Sha512());
    var SECP256K1_PREFIX = "00";
    var secp256k12 = {
      deriveKeypair(entropy, options) {
        const derived = (0, utils_2.derivePrivateKey)(entropy, options);
        const privateKey = SECP256K1_PREFIX + (0, utils_1.bytesToHex)((0, utils_js_1.numberToBytesBE)(derived, 32));
        const publicKey = (0, utils_1.bytesToHex)(secp256k1_js_1.secp256k1.getPublicKey((0, utils_js_1.numberToBytesBE)(derived, 32), true));
        return { privateKey, publicKey };
      },
      sign(message, privateKey) {
        assert_1.default.ok(privateKey.length === 66 && privateKey.startsWith(SECP256K1_PREFIX) || privateKey.length === 64);
        const normedPrivateKey = privateKey.length === 66 ? privateKey.slice(2) : privateKey;
        return (0, utils_1.bytesToHex)(secp256k1_js_1.secp256k1.sign(Sha512_1.default.half(message), (0, utils_1.hexToBytes)(normedPrivateKey), {
          // "Canonical" signatures
          lowS: true,
          // Would fail tests if signatures aren't deterministic
          extraEntropy: void 0,
          format: "der",
          // We pass a pre-hashed message (Sha512Half), so disable secp256k1's
          // default SHA-256 prehashing (added as default in @noble/curves 2.0.0)
          prehash: false
        })).toUpperCase();
      },
      verify(message, signature, publicKey) {
        const decoded = secp256k1_js_1.secp256k1.Signature.fromHex(signature, "der");
        return secp256k1_js_1.secp256k1.verify(decoded.toBytes("compact"), Sha512_1.default.half(message), (0, utils_1.hexToBytes)(publicKey), { prehash: false });
      }
    };
    exports.default = secp256k12;
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/edwards.js
function isEdValidXY(Fp2, CURVE, x, y) {
  const x2 = Fp2.sqr(x);
  const y2 = Fp2.sqr(y);
  const left = Fp2.add(Fp2.mul(CURVE.a, x2), y2);
  const right = Fp2.add(Fp2.ONE, Fp2.mul(CURVE.d, Fp2.mul(x2, y2)));
  return Fp2.eql(left, right);
}
function edwards(params, extraOpts = {}) {
  validateObject2(extraOpts, {}, {}, "extraOpts");
  const opts = extraOpts;
  const validated = createCurveFields("edwards", params, opts, opts.FpFnLE);
  const { Fp: Fp2, Fn: Fn2 } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor } = CURVE;
  if (FpLegendre(Fp2, CURVE.a) !== 1)
    throw new Error("edwards: CURVE.a must be a square in Fp for complete addition formulas");
  if (FpLegendre(Fp2, CURVE.d) !== -1)
    throw new Error("edwards: CURVE.d must be a non-square in Fp for complete addition formulas");
  validateObject2(opts, {}, { uvRatio: "function", randomBytes: "function" });
  const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
  const MASK = _2n6 << BigInt(Fp2.BYTES * 8) - _1n7;
  function isOdd(n) {
    if (!Fp2.isOdd)
      throw new Error("Field does not have .isOdd()");
    return Fp2.isOdd(n);
  }
  const uvRatio2 = opts.uvRatio === void 0 ? (u, v) => {
    try {
      return { isValid: true, value: Fp2.sqrt(Fp2.div(u, v)) };
    } catch (e) {
      return { isValid: false, value: _0n9 };
    }
  } : opts.uvRatio;
  if (!isEdValidXY(Fp2, CURVE, CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const mulA = Fp2.eql(CURVE.a, Fp2.neg(Fp2.ONE)) ? (x) => Fp2.neg(x) : Fp2.eql(CURVE.a, Fp2.ONE) ? (x) => x : (x) => Fp2.mul(CURVE.a, x);
  function acoord(title, n, banZero = false) {
    const min = banZero ? _1n7 : _0n9;
    aInRange("coordinate " + title, n, min, MASK);
    return n;
  }
  function aedpoint(other) {
    if (!(other instanceof Point))
      throw new Error("EdwardsPoint expected");
  }
  class Point {
    static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp2.ONE, Fp2.mul(CURVE.Gx, CURVE.Gy));
    static ZERO = new Point(Fp2.ZERO, Fp2.ONE, Fp2.ONE, Fp2.ZERO);
    static Fp = Fp2;
    static Fn = Fn2;
    X;
    Y;
    Z;
    T;
    constructor(X, Y, Z, T) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y);
      this.Z = acoord("z", Z, true);
      this.T = acoord("t", T);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /**
     * Create one extended Edwards point from affine coordinates.
     * Does NOT validate that the point is on-curve or torsion-free.
     * Use `.assertValidity()` on adversarial inputs.
     */
    static fromAffine(p) {
      if (p instanceof Point)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      acoord("x", x);
      acoord("y", y);
      return new Point(x, y, Fp2.ONE, Fp2.mul(x, y));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(bytes, zip215 = false) {
      const len = Fp2.BYTES;
      const { a, d } = CURVE;
      bytes = copyBytes2(abytes4(bytes, len, "point"));
      abool2(zip215, "zip215");
      const normed = copyBytes2(bytes);
      const lastByte = bytes[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp2.ORDER;
      aInRange("point.y", y, _0n9, max);
      const y2 = Fp2.sqr(y);
      const u = Fp2.sub(y2, Fp2.ONE);
      const v = Fp2.sub(Fp2.mulN(d, y2), a);
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
        throw new Error("bad point: invalid y coordinate");
      const isXOdd = isOdd(x);
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && Fp2.is0(x) && isLastByteOdd)
        throw new Error("bad point: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = Fp2.neg(x);
      return Point.fromAffine({ x, y });
    }
    static fromHex(hex2, zip215 = false) {
      return Point.fromBytes(hexToBytes4(hex2), zip215);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(windowSize = 6, isLazy = true) {
      wnaf.setWindowSize(this, windowSize);
      if (!isLazy)
        this.multiply(_2n6);
      return this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      const p = this;
      const { a, d } = CURVE;
      if (p.is0())
        throw new Error("bad point: ZERO");
      const { X, Y, Z, T } = p;
      const X2 = Fp2.sqr(X);
      const Y2 = Fp2.sqr(Y);
      const Z2 = Fp2.sqr(Z);
      const Z4 = Fp2.sqr(Z2);
      const aX2 = Fp2.mul(X2, a);
      const left = Fp2.mul(Fp2.add(aX2, Y2), Z2);
      const right = Fp2.add(Z4, Fp2.mul(d, Fp2.mul(X2, Y2)));
      if (!Fp2.eql(left, right))
        throw new Error("bad point: equation left != right (1)");
      const XY = Fp2.mul(X, Y);
      const ZT = Fp2.mul(Z, T);
      if (!Fp2.eql(XY, ZT))
        throw new Error("bad point: equation left != right (2)");
    }
    // Compare one point to another.
    equals(other) {
      aedpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const X1Z2 = Fp2.mul(X1, Z2);
      const X2Z1 = Fp2.mul(X2, Z1);
      const Y1Z2 = Fp2.mul(Y1, Z2);
      const Y2Z1 = Fp2.mul(Y2, Z1);
      return Fp2.eql(X1Z2, X2Z1) && Fp2.eql(Y1Z2, Y2Z1);
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(Fp2.neg(this.X), this.Y, this.Z, Fp2.neg(this.T));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const A = Fp2.sqr(X1);
      const B = Fp2.sqr(Y1);
      const C = Fp2.mul(Fp2.sqr(Z1), _2n6);
      const D = mulA(A);
      const x1y1 = Fp2.addN(X1, Y1);
      const E = Fp2.sub(Fp2.subN(Fp2.sqr(x1y1), A), B);
      const G = Fp2.addN(D, B);
      const F = Fp2.subN(G, C);
      const H = Fp2.subN(D, B);
      const X3 = Fp2.mul(E, F);
      const Y3 = Fp2.mul(G, H);
      const T3 = Fp2.mul(E, H);
      const Z3 = Fp2.mul(F, G);
      return new Point(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      aedpoint(other);
      const { d } = CURVE;
      const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
      const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
      const A = Fp2.mul(X1, X2);
      const B = Fp2.mul(Y1, Y2);
      const C = Fp2.mul(Fp2.mulN(T1, d), T2);
      const D = Fp2.mul(Z1, Z2);
      const E = Fp2.sub(Fp2.subN(Fp2.mulN(Fp2.addN(X1, Y1), Fp2.addN(X2, Y2)), A), B);
      const F = Fp2.subN(D, C);
      const G = Fp2.addN(D, C);
      const H = Fp2.sub(B, mulA(A));
      const X3 = Fp2.mul(E, F);
      const Y3 = Fp2.mul(G, H);
      const T3 = Fp2.mul(E, H);
      const Z3 = Fp2.mul(F, G);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      aedpoint(other);
      return this.add(other.negate());
    }
    // Constant-time multiplication.
    multiply(scalar) {
      if (!Fn2.isValidNot0(scalar))
        throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
      const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize2);
      return normalize2([p, f])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Keeps the same subgroup-scalar contract: 0 is allowed for public-scalar callers, but
    // n and larger values are rejected instead of being reduced mod n to the identity point.
    multiplyUnsafe(scalar) {
      if (!Fn2.isValid(scalar))
        throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
      if (scalar === _0n9)
        return Point.ZERO;
      if (this.is0() || scalar === _1n7)
        return this;
      return wnaf.mulUnsafe(this, scalar, normalize2);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Clears cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.clearCofactor().is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return wnaf.mulUnsafe(this, CURVE.n).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(invertedZ) {
      const p = this;
      let iz = invertedZ;
      if (iz != null && typeof iz !== "bigint")
        throw new TypeError('"invertedZ" expected bigint, got type=' + typeof iz);
      const { X, Y, Z } = p;
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp2.create(_8n2) : Fp2.inv(Z);
      const x = Fp2.mul(X, iz);
      const y = Fp2.mul(Y, iz);
      const zz = Fp2.mul(Z, iz);
      if (is0)
        return { x: Fp2.ZERO, y: Fp2.ONE };
      if (!Fp2.eql(zz, Fp2.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    }
    clearCofactor() {
      if (cofactor === _1n7)
        return this;
      if (cofactor === _2n6)
        return this.double();
      if (cofactor === _4n5)
        return this.double().double();
      if (cofactor === _8n2)
        return this.double().double().double();
      return this.multiplyUnsafe(cofactor);
    }
    toBytes() {
      const { x, y } = this.toAffine();
      const bytes = Fp2.toBytes(y);
      bytes[bytes.length - 1] |= isOdd(x) ? 128 : 0;
      return bytes;
    }
    toHex() {
      return bytesToHex3(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const normalize2 = (points) => normalizeZ(Point, points);
  const wnaf = new ScalarMultiplier(Point, randomBytes3);
  if (wnaf.bits >= 6)
    Point.BASE.precompute(6);
  Object.freeze(Point.prototype);
  Object.freeze(Point);
  return Point;
}
function eddsa(Point, cHash, eddsaOpts = {}) {
  validatePointCons(Point);
  if (typeof cHash !== "function")
    throw new Error('"hash" function param is required');
  const hash = cHash;
  const opts = eddsaOpts;
  validateObject2(opts, {}, {
    adjustScalarBytes: "function",
    randomBytes: "function",
    domain: "function",
    prehash: "function",
    zip215: "boolean",
    mapToCurve: "function",
    toMontgomery: "function",
    toMontgomerySecret: "function"
  });
  const { prehash } = opts;
  const { BASE, Fp: Fp2, Fn: Fn2 } = Point;
  const outputLen = hash.outputLen;
  const expectedLen = 2 * Fp2.BYTES;
  if (outputLen !== void 0) {
    asafenumber(outputLen, "hash.outputLen");
    if (outputLen !== expectedLen)
      throw new Error(`hash.outputLen must be ${expectedLen}, got ${outputLen}`);
  }
  const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
  const toMontgomery2 = opts.toMontgomery;
  const toMontgomerySecret2 = opts.toMontgomerySecret;
  const adjustScalarBytes2 = opts.adjustScalarBytes === void 0 ? (bytes) => bytes : opts.adjustScalarBytes;
  const domain = opts.domain === void 0 ? (data, ctx, phflag) => {
    abool2(phflag, "phflag");
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  } : opts.domain;
  function modN_LE(hash2) {
    return Fn2.create(bytesToNumberLE(hash2));
  }
  function getPrivateScalar(key) {
    const len = lengths.secretKey;
    abytes4(key, lengths.secretKey, "secretKey");
    const hashed = abytes4(hash(key), 2 * len, "hashedSecretKey");
    const head = adjustScalarBytes2(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    return { head, prefix, scalar };
  }
  function getExtendedPublicKey(secretKey) {
    const { head, prefix, scalar } = getPrivateScalar(secretKey);
    const point = BASE.multiply(scalar);
    const pointBytes = point.toBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  function getPublicKey(secretKey) {
    return getExtendedPublicKey(secretKey).pointBytes;
  }
  function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
    const msg = concatBytes2(...msgs);
    return modN_LE(hash(domain(msg, abytes4(context, void 0, "context"), !!prehash)));
  }
  function sign(msg, secretKey, options = {}) {
    validateObject2(options, {}, {}, "options");
    msg = abytes4(msg, void 0, "message");
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
    const r = hashDomainToScalar(options.context, prefix, msg);
    const R = BASE.multiply(r).toBytes();
    const k = hashDomainToScalar(options.context, R, pointBytes, msg);
    const s = Fn2.create(r + k * scalar);
    if (!Fn2.isValid(s))
      throw new Error("sign failed: invalid s");
    const rs = concatBytes2(R, Fn2.toBytes(s));
    return abytes4(rs, lengths.signature, "result");
  }
  const verifyOpts = {
    zip215: opts.zip215
  };
  function verify(sig, msg, publicKey, options = verifyOpts) {
    validateObject2(options);
    const { context } = options;
    const zip215 = options.zip215 === void 0 ? !!verifyOpts.zip215 : options.zip215;
    const len = lengths.signature;
    sig = abytes4(sig, len, "signature");
    msg = abytes4(msg, void 0, "message");
    publicKey = abytes4(publicKey, lengths.publicKey, "publicKey");
    if (zip215 !== void 0)
      abool2(zip215, "zip215");
    if (prehash)
      msg = prehash(msg);
    const mid = len / 2;
    const r = sig.subarray(0, mid);
    const s = bytesToNumberLE(sig.subarray(mid, len));
    let A, R, SB;
    try {
      A = Point.fromBytes(publicKey, zip215);
      R = Point.fromBytes(r, zip215);
      SB = BASE.multiplyUnsafe(s);
    } catch (error) {
      return false;
    }
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = hashDomainToScalar(context, r, publicKey, msg);
    const RkA = R.add(A.multiplyUnsafe(k));
    return RkA.subtract(SB).clearCofactor().is0();
  }
  const _size = Fp2.BYTES;
  const lengths = {
    secretKey: _size,
    publicKey: _size,
    signature: 2 * _size,
    seed: _size
  };
  function randomSecretKey(seed) {
    seed = seed === void 0 ? randomBytes3(lengths.seed) : seed;
    return abytes4(seed, lengths.seed, "seed");
  }
  function isValidSecretKey(key) {
    return isBytes4(key) && key.length === lengths.secretKey;
  }
  function isValidPublicKey(key, zip215) {
    try {
      return !!Point.fromBytes(key, zip215 === void 0 ? verifyOpts.zip215 : zip215);
    } catch (error) {
      return false;
    }
  }
  const utils = {
    getExtendedPublicKey,
    randomSecretKey,
    isValidSecretKey,
    isValidPublicKey,
    /** Converts an Edwards public key to a companion Montgomery public key. */
    toMontgomery(publicKey) {
      if (toMontgomery2 === void 0)
        throw new Error("Montgomery conversion is not supported for this curve");
      return toMontgomery2(Point.fromBytes(publicKey));
    },
    toMontgomerySecret(secretKey) {
      if (toMontgomerySecret2 === void 0)
        throw new Error("Montgomery conversion is not supported for this curve");
      return toMontgomerySecret2(secretKey);
    }
  };
  Object.freeze(lengths);
  Object.freeze(utils);
  return Object.freeze({
    keygen: createKeygen(randomSecretKey, getPublicKey),
    getPublicKey,
    sign,
    verify,
    utils,
    Point,
    lengths
  });
}
var _0n9, _1n7, _2n6, _4n5, _8n2, PrimeEdwardsPoint;
var init_edwards = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/edwards.js"() {
    init_utils4();
    init_curve();
    init_modular();
    _0n9 = /* @__PURE__ */ BigInt(0);
    _1n7 = /* @__PURE__ */ BigInt(1);
    _2n6 = /* @__PURE__ */ BigInt(2);
    _4n5 = /* @__PURE__ */ BigInt(4);
    _8n2 = /* @__PURE__ */ BigInt(8);
    PrimeEdwardsPoint = class {
      static BASE;
      static ZERO;
      static Fp;
      static Fn;
      ep;
      /**
       * Wrap one internal Edwards representative directly.
       * This is not a canonical encoding boundary: alternate Edwards
       * representatives may still describe the same abstract wrapper element.
       */
      constructor(ep) {
        this.ep = ep;
      }
      // Static methods that must be implemented by subclasses
      static fromBytes(_bytes) {
        notImplemented();
      }
      static fromHex(_hex) {
        notImplemented();
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      // Common implementations
      clearCofactor() {
        return this;
      }
      assertValidity() {
        this.ep.assertValidity();
      }
      /**
       * Return affine coordinates of the current internal Edwards representative.
       * This is a convenience helper, not a canonical Ristretto/Decaf encoding.
       * Equal abstract elements may expose different `x` / `y`; use
       * `toBytes()` / `fromBytes()` for canonical roundtrips.
       */
      toAffine(invertedZ) {
        return this.ep.toAffine(invertedZ);
      }
      toHex() {
        return bytesToHex3(this.toBytes());
      }
      toString() {
        return this.toHex();
      }
      isTorsionFree() {
        return true;
      }
      isSmallOrder() {
        return false;
      }
      add(other) {
        this.assertSame(other);
        return this.init(this.ep.add(other.ep));
      }
      subtract(other) {
        this.assertSame(other);
        return this.init(this.ep.subtract(other.ep));
      }
      multiply(scalar) {
        return this.init(this.ep.multiply(scalar));
      }
      multiplyUnsafe(scalar) {
        return this.init(this.ep.multiplyUnsafe(scalar));
      }
      double() {
        return this.init(this.ep.double());
      }
      negate() {
        return this.init(this.ep.negate());
      }
      precompute(windowSize, isLazy) {
        this.ep.precompute(windowSize, isLazy);
        return this;
      }
    };
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/montgomery.js
function cmask(P, swap) {
  return P + swap - (swap >> _1n8 << _1n8);
}
function cswap(P) {
  const offset = BigInt(6) * P;
  return (mask, x_2, x_3) => {
    const sum = x_2 + x_3;
    const d = offset + x_3 - x_2;
    const a = (d * mask + x_2) % P;
    return { x_2: a, x_3: sum - a };
  };
}
function validateOpts(curve) {
  validateObject2(curve, {
    P: "bigint",
    type: "string",
    adjustScalarBytes: "function",
    powPminus2: "function"
  }, {
    randomBytes: "function",
    scalarMultBase: "function"
  });
  return Object.freeze({ ...curve });
}
function montgomery(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { P, type, adjustScalarBytes: adjustScalarBytes2, powPminus2, randomBytes: rand } = CURVE;
  const mulBaseHook = CURVE.scalarMultBase;
  const is25519 = type === "x25519";
  if (!is25519 && type !== "x448")
    throw new Error("invalid type");
  const randomBytes_ = rand === void 0 ? randomBytes2 : rand;
  const montgomeryBits = is25519 ? 255 : 448;
  const swap = cswap(P);
  const fieldLen = is25519 ? 32 : 56;
  const Gu = is25519 ? BigInt(9) : BigInt(5);
  const a24 = is25519 ? BigInt(121665) : BigInt(39081);
  const minScalar = is25519 ? _2n7 ** BigInt(254) : _2n7 ** BigInt(447);
  const maxAdded = is25519 ? BigInt(8) * (_2n7 ** BigInt(251) - _1n8) : BigInt(4) * (_2n7 ** BigInt(445) - _1n8);
  const maxScalar = minScalar + maxAdded + _1n8;
  const modP = (n) => mod(n, P);
  const GuBytes = encodeU(Gu);
  function encodeU(u) {
    return numberToBytesLE(modP(u), fieldLen);
  }
  function decodeU(u) {
    const _u = copyBytes2(abytes4(u, fieldLen, "uCoordinate"));
    if (is25519)
      _u[31] &= 127;
    return modP(bytesToNumberLE(_u));
  }
  function decodeScalar(scalar) {
    return bytesToNumberLE(adjustScalarBytes2(copyBytes2(abytes4(scalar, fieldLen, "scalar"))));
  }
  const lowOrderU = new Set(is25519 ? [
    _0n10,
    _1n8,
    P - _1n8,
    BigInt("325606250916557431795983626356110631294008115727848805560023387167927233504"),
    BigInt("39382357235489614581723060781553021112529911719440698176882885853963445705823")
  ] : [_0n10, _1n8, P - _1n8]);
  function scalarMult(scalar, u) {
    const pointU = decodeU(u);
    if (lowOrderU.has(pointU))
      throw new Error("invalid private or public key received");
    const pu = montgomeryLadder(pointU, decodeScalar(scalar));
    if (pu === _0n10)
      throw new Error("invalid private or public key received");
    return encodeU(pu);
  }
  function scalarMultBase(scalar) {
    if (mulBaseHook === void 0)
      return scalarMult(scalar, GuBytes);
    const k = decodeScalar(scalar);
    aInRange("scalar", k, minScalar, maxScalar);
    const pu = modP(mulBaseHook(k));
    if (pu === _0n10)
      throw new Error("invalid private or public key received");
    return encodeU(pu);
  }
  const getPublicKey = scalarMultBase;
  const getSharedSecret = scalarMult;
  function montgomeryLadder(u, scalar) {
    aInRange("u", u, _0n10, P);
    aInRange("scalar", scalar, minScalar, maxScalar);
    const k = scalar;
    const x_1 = u;
    let x_2 = _1n8;
    let z_2 = _0n10;
    let x_3 = u;
    let z_3 = _1n8;
    const kx = k ^ k >> _1n8;
    for (let t = BigInt(montgomeryBits - 1); t >= _0n10; t--) {
      const mask2 = cmask(P, kx >> t);
      ({ x_2, x_3 } = swap(mask2, x_2, x_3));
      ({ x_2: z_2, x_3: z_3 } = swap(mask2, z_2, z_3));
      const A = x_2 + z_2;
      const AA = modP(A * A);
      const B = x_2 - z_2;
      const BB = modP(B * B);
      const E = AA - BB;
      const C = x_3 + z_3;
      const D = x_3 - z_3;
      const DA = modP(D * A);
      const CB = modP(C * B);
      const dacb = DA + CB;
      const da_cb = DA - CB;
      x_3 = modP(dacb * dacb);
      z_3 = modP(x_1 * modP(da_cb * da_cb));
      x_2 = modP(AA * BB);
      z_2 = modP(E * (AA + modP(a24 * E)));
    }
    const mask = cmask(P, k);
    ({ x_2, x_3 } = swap(mask, x_2, x_3));
    ({ x_2: z_2, x_3: z_3 } = swap(mask, z_2, z_3));
    const z2 = powPminus2(z_2);
    return modP(x_2 * z2);
  }
  const lengths = {
    secretKey: fieldLen,
    publicKey: fieldLen,
    seed: fieldLen
  };
  const randomSecretKey = (seed) => {
    seed = seed === void 0 ? randomBytes_(fieldLen) : seed;
    abytes4(seed, lengths.seed, "seed");
    return seed;
  };
  const utils = { randomSecretKey };
  Object.freeze(lengths);
  Object.freeze(utils);
  return Object.freeze({
    keygen: createKeygen(randomSecretKey, getPublicKey),
    getSharedSecret,
    getPublicKey,
    scalarMult,
    scalarMultBase,
    utils,
    GuBytes: GuBytes.slice(),
    lengths
  });
}
var _0n10, _1n8, _2n7;
var init_montgomery = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/montgomery.js"() {
    init_utils4();
    init_curve();
    init_modular();
    _0n10 = /* @__PURE__ */ BigInt(0);
    _1n8 = /* @__PURE__ */ BigInt(1);
    _2n7 = /* @__PURE__ */ BigInt(2);
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/oprf.js
function createOPRF(opts) {
  validateObject2(opts, {
    name: "string",
    hash: "function",
    hashToScalar: "function",
    hashToGroup: "function"
  });
  validatePointCons(opts.Point);
  const { name, Point, hash } = opts;
  const { Fn: Fn2 } = Point;
  const hashToGroup = (msg, ctx) => opts.hashToGroup(msg, {
    DST: concatBytes2(asciiToBytes("HashToGroup-"), ctx)
  });
  const hashToScalarPrefixed = (msg, ctx) => opts.hashToScalar(msg, { DST: concatBytes2(_DST_scalarBytes, ctx) });
  const randomScalar = (rng = randomBytes2) => {
    if (typeof rng !== "function")
      throw new TypeError('"rng" expected function, got type=' + typeof rng);
    const t = mapHashToField(rng(getMinHashLength(Fn2.ORDER)), Fn2.ORDER, Fn2.isLE);
    return Fn2.isLE ? bytesToNumberLE(t) : bytesToNumberBE(t);
  };
  const msm = (points, scalars) => mulAddUnsafe(Point, points, scalars);
  const getCtx = (mode) => concatBytes2(asciiToBytes("OPRFV1-"), new Uint8Array([mode]), asciiToBytes("-" + name));
  const ctxOPRF = getCtx(0);
  const ctxVOPRF = getCtx(1);
  const ctxPOPRF = getCtx(2);
  function encode2(...args) {
    const res2 = [];
    for (const a of args) {
      if (typeof a === "number")
        res2.push(numberToBytesBE(a, 2));
      else if (typeof a === "string")
        res2.push(asciiToBytes(a));
      else {
        abytes4(a);
        res2.push(numberToBytesBE(a.length, 2), a);
      }
    }
    return concatBytes2(...res2);
  }
  const inputBytes = (title, bytes) => {
    abytes4(bytes, void 0, title);
    if (bytes.length > 65535)
      throw new Error(`"${title}" expected Uint8Array of length <= 65535, got length=${bytes.length}`);
    return bytes;
  };
  const hashInput = (...bytes) => hash(encode2(...bytes, "Finalize"));
  function getTranscripts(B, C, D, ctx) {
    const Bm = B.toBytes();
    const seed = hash(encode2(Bm, concatBytes2(asciiToBytes("Seed-"), ctx)));
    const res2 = [];
    for (let i = 0; i < C.length; i++) {
      const Ci = C[i].toBytes();
      const Di = D[i].toBytes();
      const di = hashToScalarPrefixed(encode2(seed, i, Ci, Di, "Composite"), ctx);
      res2.push(di);
    }
    return res2;
  }
  function computeComposites(B, C, D, ctx) {
    const T = getTranscripts(B, C, D, ctx);
    const M = msm(C, T);
    const Z = msm(D, T);
    return { M, Z };
  }
  function computeCompositesFast(k, B, C, D, ctx) {
    const T = getTranscripts(B, C, D, ctx);
    const M = msm(C, T);
    const Z = M.multiply(k);
    return { M, Z };
  }
  function challengeTranscript(B, M, Z, t2, t3, ctx) {
    const [Bm, a0, a1, a2, a3] = [B, M, Z, t2, t3].map((i) => i.toBytes());
    return hashToScalarPrefixed(encode2(Bm, a0, a1, a2, a3, "Challenge"), ctx);
  }
  function generateProof(ctx, k, B, C, D, rng) {
    const { M, Z } = computeCompositesFast(k, B, C, D, ctx);
    const r = randomScalar(rng);
    const t2 = Point.BASE.multiply(r);
    const t3 = M.multiply(r);
    const c = challengeTranscript(B, M, Z, t2, t3, ctx);
    const s = Fn2.sub(r, Fn2.mul(c, k));
    return concatBytes2(...[c, s].map((i) => Fn2.toBytes(i)));
  }
  function verifyProof(ctx, B, C, D, proof) {
    abytes4(proof, 2 * Fn2.BYTES);
    const { M, Z } = computeComposites(B, C, D, ctx);
    const [c, s] = [proof.subarray(0, Fn2.BYTES), proof.subarray(Fn2.BYTES)].map((f) => Fn2.fromBytes(f));
    const t2 = msm([Point.BASE, B], [s, c]);
    const t3 = msm([M, Z], [s, c]);
    const expectedC = challengeTranscript(B, M, Z, t2, t3, ctx);
    if (!Fn2.eql(c, expectedC))
      throw new Error("proof verification failed");
  }
  function generateKeyPair() {
    const skS = randomScalar();
    const pkS = Point.BASE.multiply(skS);
    return { secretKey: Fn2.toBytes(skS), publicKey: pkS.toBytes() };
  }
  function deriveKeyPair(ctx, seed, info) {
    abytes4(seed, 32, "seed");
    info = inputBytes("keyInfo", info);
    const dst = concatBytes2(asciiToBytes("DeriveKeyPair"), ctx);
    const msg = concatBytes2(seed, encode2(info), Uint8Array.of(0));
    for (let counter = 0; counter <= 255; counter++) {
      msg[msg.length - 1] = counter;
      const skS = opts.hashToScalar(msg, { DST: dst });
      if (Fn2.is0(skS))
        continue;
      return {
        secretKey: Fn2.toBytes(skS),
        publicKey: Point.BASE.multiply(skS).toBytes()
      };
    }
    throw new Error("Cannot derive key");
  }
  const wirePoint = (label, bytes) => {
    const point = Point.fromBytes(bytes);
    if (point.equals(Point.ZERO))
      throw new Error(label + " point at infinity");
    return point;
  };
  function blind(ctx, input, rng = randomBytes2) {
    input = inputBytes("input", input);
    const blind2 = randomScalar(rng);
    const inputPoint = hashToGroup(input, ctx);
    if (inputPoint.equals(Point.ZERO))
      throw new Error("Input point at infinity");
    const blinded = inputPoint.multiply(blind2);
    return { blind: Fn2.toBytes(blind2), blinded: blinded.toBytes() };
  }
  function evaluate(ctx, secretKey, input) {
    input = inputBytes("input", input);
    const skS = Fn2.fromBytes(secretKey);
    const inputPoint = hashToGroup(input, ctx);
    if (inputPoint.equals(Point.ZERO))
      throw new Error("Input point at infinity");
    const unblinded = inputPoint.multiply(skS).toBytes();
    return hashInput(input, unblinded);
  }
  const oprf = Object.freeze({
    generateKeyPair,
    deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxOPRF, seed, keyInfo),
    blind: (input, rng = randomBytes2) => blind(ctxOPRF, input, rng),
    blindEvaluate(secretKey, blindedPoint) {
      const skS = Fn2.fromBytes(secretKey);
      const elm = wirePoint("blinded", blindedPoint);
      return elm.multiply(skS).toBytes();
    },
    finalize(input, blindBytes, evaluatedBytes) {
      input = inputBytes("input", input);
      const blind2 = Fn2.fromBytes(blindBytes);
      const evalPoint = wirePoint("evaluated", evaluatedBytes);
      const unblinded = evalPoint.multiply(Fn2.inv(blind2)).toBytes();
      return hashInput(input, unblinded);
    },
    evaluate: (secretKey, input) => evaluate(ctxOPRF, secretKey, input)
  });
  const voprf = Object.freeze({
    generateKeyPair,
    deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxVOPRF, seed, keyInfo),
    blind: (input, rng = randomBytes2) => blind(ctxVOPRF, input, rng),
    blindEvaluateBatch(secretKey, publicKey, blinded, rng = randomBytes2) {
      if (!Array.isArray(blinded))
        throw new Error("expected array");
      const skS = Fn2.fromBytes(secretKey);
      const pkS = wirePoint("public key", publicKey);
      const blindedPoints = blinded.map((i) => wirePoint("blinded", i));
      const evaluated = blindedPoints.map((i) => i.multiply(skS));
      const proof = generateProof(ctxVOPRF, skS, pkS, blindedPoints, evaluated, rng);
      return { evaluated: evaluated.map((i) => i.toBytes()), proof };
    },
    blindEvaluate(secretKey, publicKey, blinded, rng = randomBytes2) {
      const res2 = this.blindEvaluateBatch(secretKey, publicKey, [blinded], rng);
      return { evaluated: res2.evaluated[0], proof: res2.proof };
    },
    finalizeBatch(items, publicKey, proof) {
      if (!Array.isArray(items))
        throw new Error("expected array");
      const pkS = wirePoint("public key", publicKey);
      const blindedPoints = items.map((i) => wirePoint("blinded", i.blinded));
      const evalPoints = items.map((i) => wirePoint("evaluated", i.evaluated));
      verifyProof(ctxVOPRF, pkS, blindedPoints, evalPoints, proof);
      return items.map((i, j) => {
        const input = inputBytes("input", i.input);
        const blind2 = Fn2.fromBytes(i.blind);
        const unblinded = evalPoints[j].multiply(Fn2.inv(blind2)).toBytes();
        return hashInput(input, unblinded);
      });
    },
    finalize(input, blind2, evaluated, blinded, publicKey, proof) {
      return this.finalizeBatch([{ input, blind: blind2, evaluated, blinded }], publicKey, proof)[0];
    },
    evaluate: (secretKey, input) => evaluate(ctxVOPRF, secretKey, input)
  });
  const poprf = (info) => {
    info = copyBytes2(inputBytes("info", info));
    const m = hashToScalarPrefixed(encode2("Info", info), ctxPOPRF);
    const T = Point.BASE.multiply(m);
    return Object.freeze({
      generateKeyPair,
      deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxPOPRF, seed, keyInfo),
      blind(input, publicKey, rng = randomBytes2) {
        input = inputBytes("input", input);
        const pkS = wirePoint("public key", publicKey);
        const tweakedKey = T.add(pkS);
        if (tweakedKey.equals(Point.ZERO))
          throw new Error("tweakedKey point at infinity");
        const blind2 = randomScalar(rng);
        const inputPoint = hashToGroup(input, ctxPOPRF);
        if (inputPoint.equals(Point.ZERO))
          throw new Error("Input point at infinity");
        const blindedPoint = inputPoint.multiply(blind2);
        return {
          blind: Fn2.toBytes(blind2),
          blinded: blindedPoint.toBytes(),
          tweakedKey: tweakedKey.toBytes()
        };
      },
      blindEvaluateBatch(secretKey, blinded, rng = randomBytes2) {
        if (!Array.isArray(blinded))
          throw new Error("expected array");
        const skS = Fn2.fromBytes(secretKey);
        const t = Fn2.add(skS, m);
        const invT = Fn2.inv(t);
        const blindedPoints = blinded.map((i) => wirePoint("blinded", i));
        const evalPoints = blindedPoints.map((i) => i.multiply(invT));
        const tweakedKey = Point.BASE.multiply(t);
        const proof = generateProof(ctxPOPRF, t, tweakedKey, evalPoints, blindedPoints, rng);
        return { evaluated: evalPoints.map((i) => i.toBytes()), proof };
      },
      blindEvaluate(secretKey, blinded, rng = randomBytes2) {
        const res2 = this.blindEvaluateBatch(secretKey, [blinded], rng);
        return { evaluated: res2.evaluated[0], proof: res2.proof };
      },
      finalizeBatch(items, proof, tweakedKey) {
        if (!Array.isArray(items))
          throw new Error("expected array");
        const inputs = items.map((i) => inputBytes("input", i.input));
        const evalPoints = items.map((i) => wirePoint("evaluated", i.evaluated));
        verifyProof(ctxPOPRF, wirePoint("tweakedKey", tweakedKey), evalPoints, items.map((i) => wirePoint("blinded", i.blinded)), proof);
        return items.map((i, j) => {
          const blind2 = Fn2.fromBytes(i.blind);
          const point = evalPoints[j].multiply(Fn2.inv(blind2)).toBytes();
          return hashInput(inputs[j], info, point);
        });
      },
      finalize(input, blind2, evaluated, blinded, proof, tweakedKey) {
        return this.finalizeBatch([{ input, blind: blind2, evaluated, blinded }], proof, tweakedKey)[0];
      },
      evaluate(secretKey, input) {
        input = inputBytes("input", input);
        const skS = Fn2.fromBytes(secretKey);
        const inputPoint = hashToGroup(input, ctxPOPRF);
        if (inputPoint.equals(Point.ZERO))
          throw new Error("Input point at infinity");
        const t = Fn2.add(skS, m);
        const invT = Fn2.inv(t);
        const unblinded = inputPoint.multiply(invT).toBytes();
        return hashInput(input, info, unblinded);
      }
    });
  };
  const res = { name, oprf, voprf, poprf, __tests: Object.freeze({ Fn: Fn2 }) };
  return Object.freeze(res);
}
var _DST_scalarBytes;
var init_oprf = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/abstract/oprf.js"() {
    init_utils4();
    init_curve();
    init_hash_to_curve();
    init_modular();
    _DST_scalarBytes = /* @__PURE__ */ asciiToBytes(_DST_scalar);
  }
});

// ../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/ed25519.js
var ed25519_exports = {};
__export(ed25519_exports, {
  ED25519_TORSION_SUBGROUP: () => ED25519_TORSION_SUBGROUP,
  _map_to_curve_elligator2_curve25519: () => _map_to_curve_elligator2_curve25519,
  ed25519: () => ed25519,
  ed25519_FROST: () => ed25519_FROST,
  ed25519_hasher: () => ed25519_hasher,
  ed25519ctx: () => ed25519ctx,
  ed25519ph: () => ed25519ph,
  ristretto255: () => ristretto255,
  ristretto255_FROST: () => ristretto255_FROST,
  ristretto255_hasher: () => ristretto255_hasher,
  ristretto255_oprf: () => ristretto255_oprf,
  x25519: () => x25519
});
function ed25519_pow_2_252_3(x) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P = ed25519_CURVE_p;
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n8, P) * b2 % P;
  const b5 = pow2(b4, _1n9, P) * x % P;
  const b10 = pow2(b5, _5n2, P) * b5 % P;
  const b20 = pow2(b10, _10n, P) * b10 % P;
  const b40 = pow2(b20, _20n, P) * b20 % P;
  const b80 = pow2(b40, _40n, P) * b40 % P;
  const b160 = pow2(b80, _80n, P) * b80 % P;
  const b240 = pow2(b160, _80n, P) * b80 % P;
  const b250 = pow2(b240, _10n, P) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n8, P) * x % P;
  return { pow_p_5_8, b2 };
}
function adjustScalarBytes(bytes) {
  bytes[0] &= 248;
  bytes[31] &= 127;
  bytes[31] |= 64;
  return bytes;
}
function uvRatio(u, v) {
  const P = ed25519_CURVE_p;
  const v3 = mod(v * v * v, P);
  const v7 = mod(v3 * v3 * v, P);
  const pow3 = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow3, P);
  const vx2 = mod(v * x * x, P);
  const root1 = x;
  const root2 = mod(x * ED25519_SQRT_M1, P);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (isNegativeLE(x, P))
    x = mod(-x, P);
  return { isValid: useRoot1 || useRoot2, value: x };
}
function toMontgomery(point) {
  const { y } = point;
  return Fp.toBytes(Fp.div(_1n9 + y, _1n9 - y));
}
function toMontgomerySecret(secretKey) {
  const size2 = ed25519_Point.Fp.BYTES;
  abytes2(secretKey, size2);
  return adjustScalarBytes(sha512(secretKey.subarray(0, size2))).subarray(0, size2);
}
function ed25519_domain(data, ctx, phflag) {
  if (ctx.length > 255)
    throw new Error("Context is too big");
  return concatBytes(asciiToBytes("SigEd25519 no Ed25519 collisions"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
}
function ed(opts) {
  return eddsa(ed25519_Point, sha512, Object.assign({ adjustScalarBytes, toMontgomery, toMontgomerySecret, zip215: true }, opts));
}
function _map_to_curve_elligator2_curve25519(u) {
  let tv1 = Fp.sqr(u);
  tv1 = Fp.mul(tv1, _2n8);
  let xd = Fp.add(tv1, Fp.ONE);
  let x1n = Fp.neg(ELL2_J);
  let tv2 = Fp.sqr(xd);
  let gxd = Fp.mul(tv2, xd);
  let gx1 = Fp.mul(tv1, ELL2_J);
  gx1 = Fp.mul(gx1, x1n);
  gx1 = Fp.add(gx1, tv2);
  gx1 = Fp.mul(gx1, x1n);
  let tv3 = Fp.sqr(gxd);
  tv2 = Fp.sqr(tv3);
  tv3 = Fp.mul(tv3, gxd);
  tv3 = Fp.mul(tv3, gx1);
  tv2 = Fp.mul(tv2, tv3);
  let y11 = ed25519_pow_2_252_3(tv2).pow_p_5_8;
  y11 = Fp.mul(y11, tv3);
  let y12 = Fp.mul(y11, ELL2_C3);
  tv2 = Fp.sqr(y11);
  tv2 = Fp.mul(tv2, gxd);
  let e1 = Fp.eql(tv2, gx1);
  let y1 = Fp.cmov(y12, y11, e1);
  let x2n = Fp.mul(x1n, tv1);
  let y21 = Fp.mul(y11, u);
  y21 = Fp.mul(y21, ELL2_C2);
  let y22 = Fp.mul(y21, ELL2_C3);
  let gx2 = Fp.mul(gx1, tv1);
  tv2 = Fp.sqr(y21);
  tv2 = Fp.mul(tv2, gxd);
  let e2 = Fp.eql(tv2, gx2);
  let y2 = Fp.cmov(y22, y21, e2);
  tv2 = Fp.sqr(y1);
  tv2 = Fp.mul(tv2, gxd);
  let e3 = Fp.eql(tv2, gx1);
  let xn = Fp.cmov(x2n, x1n, e3);
  let y = Fp.cmov(y2, y1, e3);
  let e4 = Fp.isOdd(y);
  y = Fp.cmov(y, Fp.neg(y), e3 !== e4);
  return { xMn: xn, xMd: xd, yMn: y, yMd: _1n9 };
}
function map_to_curve_elligator2_edwards25519(u) {
  const { xMn, xMd, yMn, yMd } = _map_to_curve_elligator2_curve25519(u);
  let xn = Fp.mul(xMn, yMd);
  xn = Fp.mul(xn, ELL2_C1_EDWARDS);
  let xd = Fp.mul(xMd, yMn);
  let yn = Fp.sub(xMn, xMd);
  let yd = Fp.add(xMn, xMd);
  let tv1 = Fp.mul(xd, yd);
  let e = Fp.eql(tv1, Fp.ZERO);
  xn = Fp.cmov(xn, Fp.ZERO, e);
  xd = Fp.cmov(xd, Fp.ONE, e);
  yn = Fp.cmov(yn, Fp.ONE, e);
  yd = Fp.cmov(yd, Fp.ONE, e);
  const [xd_inv, yd_inv] = FpInvertBatch(Fp, [xd, yd], true);
  return { x: Fp.mul(xn, xd_inv), y: Fp.mul(yn, yd_inv) };
}
function calcElligatorRistrettoMap(r0) {
  const { d } = ed25519_CURVE;
  const r = Fp.mul(Fp.mulN(SQRT_M1, r0), r0);
  const Ns = Fp.mul(Fp.addN(r, _1n9), ONE_MINUS_D_SQ);
  let c = BigInt(-1);
  const D = Fp.mul(Fp.subN(c, Fp.mulN(d, r)), Fp.add(r, d));
  let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
  let s_ = Fp.mul(s, r0);
  if (!Fp.isOdd(s_))
    s_ = Fp.neg(s_);
  if (!Ns_D_is_sq)
    s = s_;
  if (!Ns_D_is_sq)
    c = r;
  const Nt = Fp.sub(Fp.mulN(Fp.mulN(c, Fp.subN(r, _1n9)), D_MINUS_ONE_SQ), D);
  const s2 = Fp.sqrN(s);
  const W0 = Fp.mul(Fp.addN(s, s), D);
  const W1 = Fp.mul(Nt, SQRT_AD_MINUS_ONE);
  const W2 = Fp.sub(_1n9, s2);
  const W3 = Fp.add(_1n9, s2);
  return new ed25519_Point(Fp.mul(W0, W3), Fp.mul(W2, W1), Fp.mul(W1, W3), Fp.mul(W0, W2));
}
var _0n11, _1n9, _2n8, _3n4, _5n2, _8n3, ed25519_CURVE_p, ed25519_CURVE, ED25519_SQRT_M1, ed25519_Point, Fp, Fn, ed25519, ed25519ctx, ed25519ph, ed25519_FROST, x25519, ELL2_C1, ELL2_C2, ELL2_C3, ELL2_J, ELL2_C1_EDWARDS, ed25519_hasher, SQRT_M1, SQRT_AD_MINUS_ONE, INVSQRT_A_MINUS_D, ONE_MINUS_D_SQ, D_MINUS_ONE_SQ, invertSqrt, MAX_255B, bytes255ToNumberLE, _RistrettoPoint, ristretto255, ristretto255_hasher, ristretto255_oprf, ristretto255_FROST, ED25519_TORSION_SUBGROUP;
var init_ed25519 = __esm({
  "../../../node_modules/.pnpm/@noble+curves@2.3.0/node_modules/@noble/curves/ed25519.js"() {
    init_sha2();
    init_utils3();
    init_edwards();
    init_frost();
    init_hash_to_curve();
    init_modular();
    init_montgomery();
    init_oprf();
    init_utils4();
    _0n11 = /* @__PURE__ */ BigInt(0);
    _1n9 = /* @__PURE__ */ BigInt(1);
    _2n8 = /* @__PURE__ */ BigInt(2);
    _3n4 = /* @__PURE__ */ BigInt(3);
    _5n2 = /* @__PURE__ */ BigInt(5);
    _8n3 = /* @__PURE__ */ BigInt(8);
    ed25519_CURVE_p = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
    ed25519_CURVE = /* @__PURE__ */ (() => ({
      p: ed25519_CURVE_p,
      n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
      h: _8n3,
      a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
      d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
      Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
      Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
    }))();
    ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
    ed25519_Point = /* @__PURE__ */ edwards(ed25519_CURVE, { uvRatio });
    Fp = /* @__PURE__ */ (() => ed25519_Point.Fp)();
    Fn = /* @__PURE__ */ (() => ed25519_Point.Fn)();
    ed25519 = /* @__PURE__ */ ed({});
    ed25519ctx = /* @__PURE__ */ ed({ domain: ed25519_domain });
    ed25519ph = /* @__PURE__ */ ed({ domain: ed25519_domain, prehash: sha512 });
    ed25519_FROST = /* @__PURE__ */ (() => createFROST({
      name: "FROST-ED25519-SHA512-v1",
      Point: ed25519_Point,
      validatePoint: (p) => {
        p.assertValidity();
        if (!p.isTorsionFree())
          throw new Error("bad point: not torsion-free");
      },
      hash: sha512,
      // RFC 9591 keeps H2 undecorated here for RFC 8032 compatibility. In createFROST(),
      // `H2: ''` becomes an empty DST prefix; the built-in hashToScalar fallback treats
      // that the same as omitted DST, even though custom hooks can still observe the empty bag.
      H2: ""
    }))();
    x25519 = /* @__PURE__ */ (() => {
      const P = ed25519_CURVE_p;
      const powPminus2 = (x) => {
        const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
        return mod(pow2(pow_p_5_8, _3n4, P) * b2, P);
      };
      return montgomery({
        P,
        type: "x25519",
        powPminus2,
        adjustScalarBytes,
        // ~3x faster fixed-base: [k]B on the birationally-equivalent Edwards curve using cached
        // base tables, mapped back via u = (1+y)/(1-y) = (Z+Y)/(Z-Y) with one Fermat inversion.
        // Same construction as libsodium's crypto_scalarmult_curve25519_base.
        scalarMultBase: (k) => {
          const kn = mod(k, ed25519_Point.Fn.ORDER);
          if (kn === _0n11)
            return _0n11;
          const p = ed25519_Point.BASE.multiply(kn);
          return mod((p.Z + p.Y) * powPminus2(mod(p.Z - p.Y, P)), P);
        }
      });
    })();
    ELL2_C1 = /* @__PURE__ */ (() => (ed25519_CURVE_p + _3n4) / _8n3)();
    ELL2_C2 = /* @__PURE__ */ (() => Fp.pow(_2n8, ELL2_C1))();
    ELL2_C3 = /* @__PURE__ */ (() => Fp.sqrt(Fp.neg(Fp.ONE)))();
    ELL2_J = /* @__PURE__ */ BigInt(486662);
    ELL2_C1_EDWARDS = /* @__PURE__ */ (() => FpSqrtEven(Fp, Fp.neg(BigInt(486664))))();
    ed25519_hasher = /* @__PURE__ */ (() => createHasher3(ed25519_Point, (scalars) => map_to_curve_elligator2_edwards25519(scalars[0]), {
      DST: "edwards25519_XMD:SHA-512_ELL2_RO_",
      encodeDST: "edwards25519_XMD:SHA-512_ELL2_NU_",
      p: ed25519_CURVE_p,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha512
    }))();
    SQRT_M1 = ED25519_SQRT_M1;
    SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
    INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
    ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
    D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
    invertSqrt = (number) => uvRatio(_1n9, number);
    MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    bytes255ToNumberLE = (bytes) => Fp.create(bytesToNumberLE(bytes) & MAX_255B);
    _RistrettoPoint = class __RistrettoPoint extends PrimeEdwardsPoint {
      // Do NOT change syntax: the following gymnastics is done,
      // because typescript strips comments, which makes bundlers disable tree-shaking.
      // prettier-ignore
      static BASE = /* @__PURE__ */ (() => new __RistrettoPoint(ed25519_Point.BASE))();
      // prettier-ignore
      static ZERO = /* @__PURE__ */ (() => new __RistrettoPoint(ed25519_Point.ZERO))();
      // prettier-ignore
      static Fp = /* @__PURE__ */ (() => Fp)();
      // prettier-ignore
      static Fn = /* @__PURE__ */ (() => Fn)();
      constructor(ep) {
        super(ep);
      }
      /**
       * Create one Ristretto255 point from affine Edwards coordinates.
       * This wraps the internal Edwards representative directly and is not a
       * canonical ristretto255 decoding path.
       * Use `toBytes()` / `fromBytes()` if canonical ristretto255 bytes matter.
       */
      static fromAffine(ap) {
        return new __RistrettoPoint(ed25519_Point.fromAffine(ap));
      }
      assertSame(other) {
        if (!(other instanceof __RistrettoPoint))
          throw new Error("RistrettoPoint expected");
      }
      init(ep) {
        return new __RistrettoPoint(ep);
      }
      static fromBytes(bytes) {
        abytes2(bytes, 32);
        const { a, d } = ed25519_CURVE;
        const s = bytes255ToNumberLE(bytes);
        if (!equalBytes(Fp.toBytes(s), bytes) || Fp.isOdd(s))
          throw new Error("invalid ristretto255 encoding 1");
        const s2 = Fp.sqr(s);
        const u1 = Fp.add(_1n9, Fp.mulN(a, s2));
        const u2 = Fp.sub(_1n9, Fp.mulN(a, s2));
        const u1_2 = Fp.sqr(u1);
        const u2_2 = Fp.sqr(u2);
        const v = Fp.sub(Fp.mulN(Fp.mulN(a, d), u1_2), u2_2);
        const { isValid, value: I } = invertSqrt(Fp.mul(v, u2_2));
        const Dx = Fp.mul(I, u2);
        const Dy = Fp.mul(Fp.mulN(I, Dx), v);
        let x = Fp.mul(Fp.addN(s, s), Dx);
        if (Fp.isOdd(x))
          x = Fp.neg(x);
        const y = Fp.mul(u1, Dy);
        const t = Fp.mul(x, y);
        if (!isValid || Fp.isOdd(t) || Fp.is0(y))
          throw new Error("invalid ristretto255 encoding 2");
        return new __RistrettoPoint(new ed25519_Point(x, y, Fp.ONE, t));
      }
      /**
       * Converts ristretto-encoded string to ristretto point.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
       * @param hex - Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
       */
      static fromHex(hex2) {
        return __RistrettoPoint.fromBytes(hexToBytes3(hex2));
      }
      /**
       * Encodes ristretto point to Uint8Array.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
       */
      toBytes() {
        let { X, Y, Z, T } = this.ep;
        const u1 = Fp.mul(Fp.add(Z, Y), Fp.sub(Z, Y));
        const u2 = Fp.mul(X, Y);
        const u2sq = Fp.sqr(u2);
        const { value: invsqrt } = invertSqrt(Fp.mul(u1, u2sq));
        const D1 = Fp.mul(invsqrt, u1);
        const D2 = Fp.mul(invsqrt, u2);
        const zInv = Fp.mul(Fp.mulN(D1, D2), T);
        let D;
        if (Fp.isOdd(Fp.mul(T, zInv))) {
          let _x = Fp.mul(Y, SQRT_M1);
          let _y = Fp.mul(X, SQRT_M1);
          X = _x;
          Y = _y;
          D = Fp.mul(D1, INVSQRT_A_MINUS_D);
        } else {
          D = D2;
        }
        if (Fp.isOdd(Fp.mul(X, zInv)))
          Y = Fp.neg(Y);
        let s = Fp.mul(Fp.subN(Z, Y), D);
        if (Fp.isOdd(s))
          s = Fp.neg(s);
        return Fp.toBytes(s);
      }
      /**
       * Compares two Ristretto points.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
       */
      equals(other) {
        this.assertSame(other);
        const { X: X1, Y: Y1 } = this.ep;
        const { X: X2, Y: Y2 } = other.ep;
        const one = Fp.eql(Fp.mul(X1, Y2), Fp.mul(Y1, X2));
        const two = Fp.eql(Fp.mul(Y1, Y2), Fp.mul(X1, X2));
        return one || two;
      }
      is0() {
        return this.equals(__RistrettoPoint.ZERO);
      }
    };
    ristretto255 = /* @__PURE__ */ (() => {
      Object.freeze(_RistrettoPoint.BASE);
      Object.freeze(_RistrettoPoint.ZERO);
      Object.freeze(_RistrettoPoint.prototype);
      Object.freeze(_RistrettoPoint);
      return Object.freeze({ Point: _RistrettoPoint });
    })();
    ristretto255_hasher = /* @__PURE__ */ Object.freeze({
      Point: _RistrettoPoint,
      /**
      * Spec: https://www.rfc-editor.org/rfc/rfc9380.html#name-hashing-to-ristretto255. Caveats:
      * * There are no test vectors
      * * encodeToCurve / mapToCurve is undefined
      * * mapToCurve would be `calcElligatorRistrettoMap(scalars[0])`, not ristretto255_map!
      * * hashToScalar is undefined too, so we just use OPRF implementation
      * * We cannot re-use 'createHasher', because ristretto255_map is different algorithm/RFC
        (os2ip -> bytes255ToNumberLE)
      * * mapToCurve == calcElligatorRistrettoMap, hashToCurve == ristretto255_map
      * * hashToScalar is undefined in RFC9380 for ristretto, so we use the OPRF
        version here. Using `bytes255ToNumblerLE` will create a different result
        if we use `bytes255ToNumberLE` as os2ip
      * * current version is closest to spec.
      */
      hashToCurve(msg, options) {
        const DST = options?.DST === void 0 ? "ristretto255_XMD:SHA-512_R255MAP_RO_" : options.DST;
        const xmd = expand_message_xmd(msg, DST, 64, sha512);
        return ristretto255_hasher.deriveToCurve(xmd);
      },
      hashToScalar(msg, options) {
        const DST = options?.DST === void 0 ? _DST_scalar : options.DST;
        const xmd = expand_message_xmd(msg, DST, 64, sha512);
        return Fn.create(bytesToNumberLE(xmd));
      },
      /**
       * HashToCurve-like construction based on RFC 9496 (Element Derivation).
       * Converts 64 uniform random bytes into a curve point.
       *
       * WARNING: This represents an older hash-to-curve construction from before
       * RFC 9380 was finalized.
       * It was later reused as a component in the newer
       * `hash_to_ristretto255` function defined in RFC 9380.
       */
      deriveToCurve(bytes) {
        abytes2(bytes, 64);
        const r1 = bytes255ToNumberLE(bytes.subarray(0, 32));
        const R1 = calcElligatorRistrettoMap(r1);
        const r2 = bytes255ToNumberLE(bytes.subarray(32, 64));
        const R2 = calcElligatorRistrettoMap(r2);
        return new _RistrettoPoint(R1.add(R2));
      }
    });
    ristretto255_oprf = /* @__PURE__ */ (() => createOPRF({
      name: "ristretto255-SHA512",
      Point: _RistrettoPoint,
      hash: sha512,
      hashToGroup: ristretto255_hasher.hashToCurve,
      hashToScalar: ristretto255_hasher.hashToScalar
    }))();
    ristretto255_FROST = /* @__PURE__ */ (() => createFROST({
      name: "FROST-RISTRETTO255-SHA512-v1",
      Point: _RistrettoPoint,
      validatePoint: (p) => {
        p.assertValidity();
      },
      hash: sha512
    }))();
    ED25519_TORSION_SUBGROUP = /* @__PURE__ */ Object.freeze([
      "0100000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
      "0000000000000000000000000000000000000000000000000000000000000080",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
      "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
      "0000000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
    ]);
  }
});

// ../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/signing-schemes/ed25519/index.js
var require_ed25519 = __commonJS({
  "../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/signing-schemes/ed25519/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var ed25519_js_1 = (init_ed25519(), __toCommonJS(ed25519_exports));
    var utils_1 = require_utils();
    var assert_1 = __importDefault(require_assert());
    var Sha512_1 = __importDefault(require_Sha512());
    var ED_PREFIX = "ED";
    var ed255192 = {
      deriveKeypair(entropy) {
        const rawPrivateKey = Sha512_1.default.half(entropy);
        const privateKey = ED_PREFIX + (0, utils_1.bytesToHex)(rawPrivateKey);
        const publicKey = ED_PREFIX + (0, utils_1.bytesToHex)(ed25519_js_1.ed25519.getPublicKey(rawPrivateKey));
        return { privateKey, publicKey };
      },
      sign(message, privateKey) {
        assert_1.default.ok(message instanceof Uint8Array, "message must be array of octets");
        assert_1.default.ok(privateKey.length === 66, "private key must be 33 bytes including prefix");
        return (0, utils_1.bytesToHex)(ed25519_js_1.ed25519.sign(message, (0, utils_1.hexToBytes)(privateKey.slice(2))));
      },
      verify(message, signature, publicKey) {
        assert_1.default.ok(publicKey.length === 66, "public key must be 33 bytes including prefix");
        return ed25519_js_1.ed25519.verify(
          (0, utils_1.hexToBytes)(signature),
          message,
          // Remove the 0xED prefix
          (0, utils_1.hexToBytes)(publicKey.slice(2)),
          // By default, set zip215 to false for compatibility reasons.
          // ZIP 215 is a stricter Ed25519 signature verification scheme.
          // However, setting it to false adheres to the more commonly used
          // RFC8032 / NIST186-5 standards, making it compatible with systems
          // like the XRP Ledger.
          { zip215: false }
        );
      }
    };
    exports.default = ed255192;
  }
});

// ../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/index.js
var require_dist2 = __commonJS({
  "../../../node_modules/.pnpm/ripple-keypairs@3.0.0/node_modules/ripple-keypairs/dist/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeSeed = exports.deriveNodeAddress = exports.deriveAddress = exports.verify = exports.sign = exports.deriveKeypair = exports.generateSeed = void 0;
    var ripple_address_codec_1 = require_dist();
    Object.defineProperty(exports, "decodeSeed", { enumerable: true, get: function() {
      return ripple_address_codec_1.decodeSeed;
    } });
    var ripemd160_1 = require_ripemd160();
    var sha256_1 = require_sha256();
    var utils_1 = require_utils();
    var utils_2 = require_utils3();
    var Sha512_1 = __importDefault(require_Sha512());
    var assert_1 = __importDefault(require_assert());
    var getAlgorithmFromKey_1 = require_getAlgorithmFromKey();
    var secp256k1_1 = __importDefault(require_secp256k1());
    var ed25519_1 = __importDefault(require_ed25519());
    function getSigningScheme(algorithm) {
      const schemes = { "ecdsa-secp256k1": secp256k1_1.default, ed25519: ed25519_1.default };
      return schemes[algorithm];
    }
    function generateSeed2(options = {}) {
      const VALID_ALGORITHMS = ["ecdsa-secp256k1", "ed25519"];
      assert_1.default.ok(!options.algorithm || VALID_ALGORITHMS.includes(options.algorithm), `Unsupported algorithm: ${options.algorithm}. Use one of: ${VALID_ALGORITHMS.join(", ")}`);
      assert_1.default.ok(!options.entropy || options.entropy.length >= 16, "entropy too short");
      const entropy = options.entropy ? options.entropy.slice(0, 16) : (0, utils_1.randomBytes)(16);
      const type = options.algorithm === "ecdsa-secp256k1" ? "secp256k1" : "ed25519";
      return (0, ripple_address_codec_1.encodeSeed)(entropy, type);
    }
    exports.generateSeed = generateSeed2;
    function deriveKeypair2(seed, options) {
      var _a;
      const decoded = (0, ripple_address_codec_1.decodeSeed)(seed);
      const proposedAlgorithm = (_a = options === null || options === void 0 ? void 0 : options.algorithm) !== null && _a !== void 0 ? _a : decoded.type;
      const algorithm = proposedAlgorithm === "ed25519" ? "ed25519" : "ecdsa-secp256k1";
      const scheme = getSigningScheme(algorithm);
      const keypair = scheme.deriveKeypair(decoded.bytes, options);
      const messageToVerify = Sha512_1.default.half("This test message should verify.");
      const signature = scheme.sign(messageToVerify, keypair.privateKey);
      if (!scheme.verify(messageToVerify, signature, keypair.publicKey)) {
        throw new Error("derived keypair did not generate verifiable signature");
      }
      return keypair;
    }
    exports.deriveKeypair = deriveKeypair2;
    function sign(messageHex, privateKey) {
      const algorithm = (0, getAlgorithmFromKey_1.getAlgorithmFromPrivateKey)(privateKey);
      return getSigningScheme(algorithm).sign((0, utils_1.hexToBytes)(messageHex), privateKey);
    }
    exports.sign = sign;
    function verify(messageHex, signature, publicKey) {
      const algorithm = (0, getAlgorithmFromKey_1.getAlgorithmFromPublicKey)(publicKey);
      return getSigningScheme(algorithm).verify((0, utils_1.hexToBytes)(messageHex), signature, publicKey);
    }
    exports.verify = verify;
    function computePublicKeyHash(publicKeyBytes) {
      return (0, ripemd160_1.ripemd160)((0, sha256_1.sha256)(publicKeyBytes));
    }
    function deriveAddressFromBytes(publicKeyBytes) {
      return (0, ripple_address_codec_1.encodeAccountID)(computePublicKeyHash(publicKeyBytes));
    }
    function deriveAddress2(publicKey) {
      return deriveAddressFromBytes((0, utils_1.hexToBytes)(publicKey));
    }
    exports.deriveAddress = deriveAddress2;
    function deriveNodeAddress(publicKey) {
      const generatorBytes = (0, ripple_address_codec_1.decodeNodePublic)(publicKey);
      const accountPublicBytes = (0, utils_2.accountPublicFromPublicGenerator)(generatorBytes);
      return deriveAddressFromBytes(accountPublicBytes);
    }
    exports.deriveNodeAddress = deriveNodeAddress;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/definitions.json
var require_definitions = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/definitions.json"(exports, module) {
    module.exports = {
      ACCOUNT_SET_FLAGS: {
        asfAccountTxnID: 5,
        asfAllowTrustLineClawback: 16,
        asfAllowTrustLineLocking: 17,
        asfAuthorizedNFTokenMinter: 10,
        asfDefaultRipple: 8,
        asfDepositAuth: 9,
        asfDisableMaster: 4,
        asfDisallowIncomingCheck: 13,
        asfDisallowIncomingNFTokenOffer: 12,
        asfDisallowIncomingPayChan: 14,
        asfDisallowIncomingTrustline: 15,
        asfDisallowXRP: 3,
        asfGlobalFreeze: 7,
        asfNoFreeze: 6,
        asfRequireAuth: 2,
        asfRequireDest: 1
      },
      FIELDS: [
        [
          "Invalid",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: -1,
            type: "Unknown"
          }
        ],
        [
          "ObjectEndMarker",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "STObject"
          }
        ],
        [
          "ArrayEndMarker",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "STArray"
          }
        ],
        [
          "taker_gets_funded",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: 258,
            type: "Amount"
          }
        ],
        [
          "taker_pays_funded",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: 259,
            type: "Amount"
          }
        ],
        [
          "Generic",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 0,
            type: "Unknown"
          }
        ],
        [
          "LedgerEntryType",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "UInt16"
          }
        ],
        [
          "TransactionType",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "UInt16"
          }
        ],
        [
          "SignerWeight",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "UInt16"
          }
        ],
        [
          "TransferFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "UInt16"
          }
        ],
        [
          "TradingFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "UInt16"
          }
        ],
        [
          "DiscountedFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 6,
            type: "UInt16"
          }
        ],
        [
          "Version",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "UInt16"
          }
        ],
        [
          "HookStateChangeCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 17,
            type: "UInt16"
          }
        ],
        [
          "HookEmitCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 18,
            type: "UInt16"
          }
        ],
        [
          "HookExecutionIndex",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 19,
            type: "UInt16"
          }
        ],
        [
          "HookApiVersion",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 20,
            type: "UInt16"
          }
        ],
        [
          "LedgerFixType",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 21,
            type: "UInt16"
          }
        ],
        [
          "ManagementFeeRate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 22,
            type: "UInt16"
          }
        ],
        [
          "NetworkID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "UInt32"
          }
        ],
        [
          "Flags",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "UInt32"
          }
        ],
        [
          "SourceTag",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "UInt32"
          }
        ],
        [
          "Sequence",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "UInt32"
          }
        ],
        [
          "PreviousTxnLgrSeq",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "UInt32"
          }
        ],
        [
          "LedgerSequence",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 6,
            type: "UInt32"
          }
        ],
        [
          "CloseTime",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 7,
            type: "UInt32"
          }
        ],
        [
          "ParentCloseTime",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 8,
            type: "UInt32"
          }
        ],
        [
          "SigningTime",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 9,
            type: "UInt32"
          }
        ],
        [
          "Expiration",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 10,
            type: "UInt32"
          }
        ],
        [
          "TransferRate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 11,
            type: "UInt32"
          }
        ],
        [
          "WalletSize",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 12,
            type: "UInt32"
          }
        ],
        [
          "OwnerCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 13,
            type: "UInt32"
          }
        ],
        [
          "DestinationTag",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 14,
            type: "UInt32"
          }
        ],
        [
          "LastUpdateTime",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 15,
            type: "UInt32"
          }
        ],
        [
          "HighQualityIn",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "UInt32"
          }
        ],
        [
          "HighQualityOut",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 17,
            type: "UInt32"
          }
        ],
        [
          "LowQualityIn",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 18,
            type: "UInt32"
          }
        ],
        [
          "LowQualityOut",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 19,
            type: "UInt32"
          }
        ],
        [
          "QualityIn",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 20,
            type: "UInt32"
          }
        ],
        [
          "QualityOut",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 21,
            type: "UInt32"
          }
        ],
        [
          "StampEscrow",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 22,
            type: "UInt32"
          }
        ],
        [
          "BondAmount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 23,
            type: "UInt32"
          }
        ],
        [
          "LoadFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 24,
            type: "UInt32"
          }
        ],
        [
          "OfferSequence",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 25,
            type: "UInt32"
          }
        ],
        [
          "FirstLedgerSequence",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 26,
            type: "UInt32"
          }
        ],
        [
          "LastLedgerSequence",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 27,
            type: "UInt32"
          }
        ],
        [
          "TransactionIndex",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 28,
            type: "UInt32"
          }
        ],
        [
          "OperationLimit",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 29,
            type: "UInt32"
          }
        ],
        [
          "ReferenceFeeUnits",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 30,
            type: "UInt32"
          }
        ],
        [
          "ReserveBase",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 31,
            type: "UInt32"
          }
        ],
        [
          "ReserveIncrement",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 32,
            type: "UInt32"
          }
        ],
        [
          "SetFlag",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 33,
            type: "UInt32"
          }
        ],
        [
          "ClearFlag",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 34,
            type: "UInt32"
          }
        ],
        [
          "SignerQuorum",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 35,
            type: "UInt32"
          }
        ],
        [
          "CancelAfter",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 36,
            type: "UInt32"
          }
        ],
        [
          "FinishAfter",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 37,
            type: "UInt32"
          }
        ],
        [
          "SignerListID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 38,
            type: "UInt32"
          }
        ],
        [
          "SettleDelay",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 39,
            type: "UInt32"
          }
        ],
        [
          "TicketCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 40,
            type: "UInt32"
          }
        ],
        [
          "TicketSequence",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 41,
            type: "UInt32"
          }
        ],
        [
          "NFTokenTaxon",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 42,
            type: "UInt32"
          }
        ],
        [
          "MintedNFTokens",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 43,
            type: "UInt32"
          }
        ],
        [
          "BurnedNFTokens",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 44,
            type: "UInt32"
          }
        ],
        [
          "HookStateCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 45,
            type: "UInt32"
          }
        ],
        [
          "EmitGeneration",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 46,
            type: "UInt32"
          }
        ],
        [
          "VoteWeight",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 48,
            type: "UInt32"
          }
        ],
        [
          "FirstNFTokenSequence",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 50,
            type: "UInt32"
          }
        ],
        [
          "OracleDocumentID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 51,
            type: "UInt32"
          }
        ],
        [
          "PermissionValue",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 52,
            type: "UInt32"
          }
        ],
        [
          "MutableFlags",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 53,
            type: "UInt32"
          }
        ],
        [
          "StartDate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 54,
            type: "UInt32"
          }
        ],
        [
          "PaymentInterval",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 55,
            type: "UInt32"
          }
        ],
        [
          "GracePeriod",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 56,
            type: "UInt32"
          }
        ],
        [
          "PreviousPaymentDueDate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 57,
            type: "UInt32"
          }
        ],
        [
          "NextPaymentDueDate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 58,
            type: "UInt32"
          }
        ],
        [
          "PaymentRemaining",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 59,
            type: "UInt32"
          }
        ],
        [
          "PaymentTotal",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 60,
            type: "UInt32"
          }
        ],
        [
          "LoanSequence",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 61,
            type: "UInt32"
          }
        ],
        [
          "CoverRateMinimum",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 62,
            type: "UInt32"
          }
        ],
        [
          "CoverRateLiquidation",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 63,
            type: "UInt32"
          }
        ],
        [
          "OverpaymentFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 64,
            type: "UInt32"
          }
        ],
        [
          "InterestRate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 65,
            type: "UInt32"
          }
        ],
        [
          "LateInterestRate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 66,
            type: "UInt32"
          }
        ],
        [
          "CloseInterestRate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 67,
            type: "UInt32"
          }
        ],
        [
          "OverpaymentInterestRate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 68,
            type: "UInt32"
          }
        ],
        [
          "IndexNext",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "UInt64"
          }
        ],
        [
          "IndexPrevious",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "UInt64"
          }
        ],
        [
          "BookNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "UInt64"
          }
        ],
        [
          "OwnerNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "UInt64"
          }
        ],
        [
          "BaseFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "UInt64"
          }
        ],
        [
          "ExchangeRate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 6,
            type: "UInt64"
          }
        ],
        [
          "LowNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 7,
            type: "UInt64"
          }
        ],
        [
          "HighNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 8,
            type: "UInt64"
          }
        ],
        [
          "DestinationNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 9,
            type: "UInt64"
          }
        ],
        [
          "Cookie",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 10,
            type: "UInt64"
          }
        ],
        [
          "ServerVersion",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 11,
            type: "UInt64"
          }
        ],
        [
          "NFTokenOfferNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 12,
            type: "UInt64"
          }
        ],
        [
          "EmitBurden",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 13,
            type: "UInt64"
          }
        ],
        [
          "HookOn",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "UInt64"
          }
        ],
        [
          "HookInstructionCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 17,
            type: "UInt64"
          }
        ],
        [
          "HookReturnCode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 18,
            type: "UInt64"
          }
        ],
        [
          "ReferenceCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 19,
            type: "UInt64"
          }
        ],
        [
          "XChainClaimID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 20,
            type: "UInt64"
          }
        ],
        [
          "XChainAccountCreateCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 21,
            type: "UInt64"
          }
        ],
        [
          "XChainAccountClaimCount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 22,
            type: "UInt64"
          }
        ],
        [
          "AssetPrice",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 23,
            type: "UInt64"
          }
        ],
        [
          "MaximumAmount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 24,
            type: "UInt64"
          }
        ],
        [
          "OutstandingAmount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 25,
            type: "UInt64"
          }
        ],
        [
          "MPTAmount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 26,
            type: "UInt64"
          }
        ],
        [
          "IssuerNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 27,
            type: "UInt64"
          }
        ],
        [
          "SubjectNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 28,
            type: "UInt64"
          }
        ],
        [
          "LockedAmount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 29,
            type: "UInt64"
          }
        ],
        [
          "VaultNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 30,
            type: "UInt64"
          }
        ],
        [
          "LoanBrokerNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 31,
            type: "UInt64"
          }
        ],
        [
          "EmailHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Hash128"
          }
        ],
        [
          "LedgerHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Hash256"
          }
        ],
        [
          "ParentHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "Hash256"
          }
        ],
        [
          "TransactionHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "Hash256"
          }
        ],
        [
          "AccountHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "Hash256"
          }
        ],
        [
          "PreviousTxnID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "Hash256"
          }
        ],
        [
          "LedgerIndex",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 6,
            type: "Hash256"
          }
        ],
        [
          "WalletLocator",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 7,
            type: "Hash256"
          }
        ],
        [
          "RootIndex",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 8,
            type: "Hash256"
          }
        ],
        [
          "AccountTxnID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 9,
            type: "Hash256"
          }
        ],
        [
          "NFTokenID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 10,
            type: "Hash256"
          }
        ],
        [
          "EmitParentTxnID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 11,
            type: "Hash256"
          }
        ],
        [
          "EmitNonce",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 12,
            type: "Hash256"
          }
        ],
        [
          "EmitHookHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 13,
            type: "Hash256"
          }
        ],
        [
          "AMMID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 14,
            type: "Hash256"
          }
        ],
        [
          "BookDirectory",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "Hash256"
          }
        ],
        [
          "InvoiceID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 17,
            type: "Hash256"
          }
        ],
        [
          "Nickname",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 18,
            type: "Hash256"
          }
        ],
        [
          "Amendment",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 19,
            type: "Hash256"
          }
        ],
        [
          "Digest",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 21,
            type: "Hash256"
          }
        ],
        [
          "Channel",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 22,
            type: "Hash256"
          }
        ],
        [
          "ConsensusHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 23,
            type: "Hash256"
          }
        ],
        [
          "CheckID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 24,
            type: "Hash256"
          }
        ],
        [
          "ValidatedHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 25,
            type: "Hash256"
          }
        ],
        [
          "PreviousPageMin",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 26,
            type: "Hash256"
          }
        ],
        [
          "NextPageMin",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 27,
            type: "Hash256"
          }
        ],
        [
          "NFTokenBuyOffer",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 28,
            type: "Hash256"
          }
        ],
        [
          "NFTokenSellOffer",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 29,
            type: "Hash256"
          }
        ],
        [
          "HookStateKey",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 30,
            type: "Hash256"
          }
        ],
        [
          "HookHash",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 31,
            type: "Hash256"
          }
        ],
        [
          "HookNamespace",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 32,
            type: "Hash256"
          }
        ],
        [
          "HookSetTxnID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 33,
            type: "Hash256"
          }
        ],
        [
          "DomainID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 34,
            type: "Hash256"
          }
        ],
        [
          "VaultID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 35,
            type: "Hash256"
          }
        ],
        [
          "ParentBatchID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 36,
            type: "Hash256"
          }
        ],
        [
          "LoanBrokerID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 37,
            type: "Hash256"
          }
        ],
        [
          "LoanID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 38,
            type: "Hash256"
          }
        ],
        [
          "ReferenceHolding",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 39,
            type: "Hash256"
          }
        ],
        [
          "hash",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: 257,
            type: "Hash256"
          }
        ],
        [
          "index",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: 258,
            type: "Hash256"
          }
        ],
        [
          "Amount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Amount"
          }
        ],
        [
          "Balance",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "Amount"
          }
        ],
        [
          "LimitAmount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "Amount"
          }
        ],
        [
          "TakerPays",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "Amount"
          }
        ],
        [
          "TakerGets",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "Amount"
          }
        ],
        [
          "LowLimit",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 6,
            type: "Amount"
          }
        ],
        [
          "HighLimit",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 7,
            type: "Amount"
          }
        ],
        [
          "Fee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 8,
            type: "Amount"
          }
        ],
        [
          "SendMax",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 9,
            type: "Amount"
          }
        ],
        [
          "DeliverMin",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 10,
            type: "Amount"
          }
        ],
        [
          "Amount2",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 11,
            type: "Amount"
          }
        ],
        [
          "BidMin",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 12,
            type: "Amount"
          }
        ],
        [
          "BidMax",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 13,
            type: "Amount"
          }
        ],
        [
          "MinimumOffer",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "Amount"
          }
        ],
        [
          "RippleEscrow",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 17,
            type: "Amount"
          }
        ],
        [
          "DeliveredAmount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 18,
            type: "Amount"
          }
        ],
        [
          "NFTokenBrokerFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 19,
            type: "Amount"
          }
        ],
        [
          "BaseFeeDrops",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 22,
            type: "Amount"
          }
        ],
        [
          "ReserveBaseDrops",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 23,
            type: "Amount"
          }
        ],
        [
          "ReserveIncrementDrops",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 24,
            type: "Amount"
          }
        ],
        [
          "LPTokenOut",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 25,
            type: "Amount"
          }
        ],
        [
          "LPTokenIn",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 26,
            type: "Amount"
          }
        ],
        [
          "EPrice",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 27,
            type: "Amount"
          }
        ],
        [
          "Price",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 28,
            type: "Amount"
          }
        ],
        [
          "SignatureReward",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 29,
            type: "Amount"
          }
        ],
        [
          "MinAccountCreateAmount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 30,
            type: "Amount"
          }
        ],
        [
          "LPTokenBalance",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 31,
            type: "Amount"
          }
        ],
        [
          "PublicKey",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 1,
            type: "Blob"
          }
        ],
        [
          "MessageKey",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 2,
            type: "Blob"
          }
        ],
        [
          "SigningPubKey",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 3,
            type: "Blob"
          }
        ],
        [
          "TxnSignature",
          {
            isSerialized: true,
            isSigningField: false,
            isVLEncoded: true,
            nth: 4,
            type: "Blob"
          }
        ],
        [
          "URI",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 5,
            type: "Blob"
          }
        ],
        [
          "Signature",
          {
            isSerialized: true,
            isSigningField: false,
            isVLEncoded: true,
            nth: 6,
            type: "Blob"
          }
        ],
        [
          "Domain",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 7,
            type: "Blob"
          }
        ],
        [
          "FundCode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 8,
            type: "Blob"
          }
        ],
        [
          "RemoveCode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 9,
            type: "Blob"
          }
        ],
        [
          "ExpireCode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 10,
            type: "Blob"
          }
        ],
        [
          "CreateCode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 11,
            type: "Blob"
          }
        ],
        [
          "MemoType",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 12,
            type: "Blob"
          }
        ],
        [
          "MemoData",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 13,
            type: "Blob"
          }
        ],
        [
          "MemoFormat",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 14,
            type: "Blob"
          }
        ],
        [
          "Fulfillment",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 16,
            type: "Blob"
          }
        ],
        [
          "Condition",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 17,
            type: "Blob"
          }
        ],
        [
          "MasterSignature",
          {
            isSerialized: true,
            isSigningField: false,
            isVLEncoded: true,
            nth: 18,
            type: "Blob"
          }
        ],
        [
          "UNLModifyValidator",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 19,
            type: "Blob"
          }
        ],
        [
          "ValidatorToDisable",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 20,
            type: "Blob"
          }
        ],
        [
          "ValidatorToReEnable",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 21,
            type: "Blob"
          }
        ],
        [
          "HookStateData",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 22,
            type: "Blob"
          }
        ],
        [
          "HookReturnString",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 23,
            type: "Blob"
          }
        ],
        [
          "HookParameterName",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 24,
            type: "Blob"
          }
        ],
        [
          "HookParameterValue",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 25,
            type: "Blob"
          }
        ],
        [
          "DIDDocument",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 26,
            type: "Blob"
          }
        ],
        [
          "Data",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 27,
            type: "Blob"
          }
        ],
        [
          "AssetClass",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 28,
            type: "Blob"
          }
        ],
        [
          "Provider",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 29,
            type: "Blob"
          }
        ],
        [
          "MPTokenMetadata",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 30,
            type: "Blob"
          }
        ],
        [
          "CredentialType",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 31,
            type: "Blob"
          }
        ],
        [
          "Account",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 1,
            type: "AccountID"
          }
        ],
        [
          "Owner",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 2,
            type: "AccountID"
          }
        ],
        [
          "Destination",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 3,
            type: "AccountID"
          }
        ],
        [
          "Issuer",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 4,
            type: "AccountID"
          }
        ],
        [
          "Authorize",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 5,
            type: "AccountID"
          }
        ],
        [
          "Unauthorize",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 6,
            type: "AccountID"
          }
        ],
        [
          "RegularKey",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 8,
            type: "AccountID"
          }
        ],
        [
          "NFTokenMinter",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 9,
            type: "AccountID"
          }
        ],
        [
          "EmitCallback",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 10,
            type: "AccountID"
          }
        ],
        [
          "Holder",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 11,
            type: "AccountID"
          }
        ],
        [
          "Delegate",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 12,
            type: "AccountID"
          }
        ],
        [
          "HookAccount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 16,
            type: "AccountID"
          }
        ],
        [
          "OtherChainSource",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 18,
            type: "AccountID"
          }
        ],
        [
          "OtherChainDestination",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 19,
            type: "AccountID"
          }
        ],
        [
          "AttestationSignerAccount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 20,
            type: "AccountID"
          }
        ],
        [
          "AttestationRewardAccount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 21,
            type: "AccountID"
          }
        ],
        [
          "LockingChainDoor",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 22,
            type: "AccountID"
          }
        ],
        [
          "IssuingChainDoor",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 23,
            type: "AccountID"
          }
        ],
        [
          "Subject",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 24,
            type: "AccountID"
          }
        ],
        [
          "Borrower",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 25,
            type: "AccountID"
          }
        ],
        [
          "Counterparty",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 26,
            type: "AccountID"
          }
        ],
        [
          "Number",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Number"
          }
        ],
        [
          "AssetsAvailable",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "Number"
          }
        ],
        [
          "AssetsMaximum",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "Number"
          }
        ],
        [
          "AssetsTotal",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "Number"
          }
        ],
        [
          "LossUnrealized",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "Number"
          }
        ],
        [
          "DebtTotal",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 6,
            type: "Number"
          }
        ],
        [
          "DebtMaximum",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 7,
            type: "Number"
          }
        ],
        [
          "CoverAvailable",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 8,
            type: "Number"
          }
        ],
        [
          "LoanOriginationFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 9,
            type: "Number"
          }
        ],
        [
          "LoanServiceFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 10,
            type: "Number"
          }
        ],
        [
          "LatePaymentFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 11,
            type: "Number"
          }
        ],
        [
          "ClosePaymentFee",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 12,
            type: "Number"
          }
        ],
        [
          "PrincipalOutstanding",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 13,
            type: "Number"
          }
        ],
        [
          "PrincipalRequested",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 14,
            type: "Number"
          }
        ],
        [
          "TotalValueOutstanding",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 15,
            type: "Number"
          }
        ],
        [
          "PeriodicPayment",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "Number"
          }
        ],
        [
          "ManagementFeeOutstanding",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 17,
            type: "Number"
          }
        ],
        [
          "LoanScale",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Int32"
          }
        ],
        [
          "TransactionMetaData",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "STObject"
          }
        ],
        [
          "CreatedNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "STObject"
          }
        ],
        [
          "DeletedNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "STObject"
          }
        ],
        [
          "ModifiedNode",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "STObject"
          }
        ],
        [
          "PreviousFields",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 6,
            type: "STObject"
          }
        ],
        [
          "FinalFields",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 7,
            type: "STObject"
          }
        ],
        [
          "NewFields",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 8,
            type: "STObject"
          }
        ],
        [
          "TemplateEntry",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 9,
            type: "STObject"
          }
        ],
        [
          "Memo",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 10,
            type: "STObject"
          }
        ],
        [
          "SignerEntry",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 11,
            type: "STObject"
          }
        ],
        [
          "NFToken",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 12,
            type: "STObject"
          }
        ],
        [
          "EmitDetails",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 13,
            type: "STObject"
          }
        ],
        [
          "Hook",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 14,
            type: "STObject"
          }
        ],
        [
          "Permission",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 15,
            type: "STObject"
          }
        ],
        [
          "Signer",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "STObject"
          }
        ],
        [
          "Majority",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 18,
            type: "STObject"
          }
        ],
        [
          "DisabledValidator",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 19,
            type: "STObject"
          }
        ],
        [
          "EmittedTxn",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 20,
            type: "STObject"
          }
        ],
        [
          "HookExecution",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 21,
            type: "STObject"
          }
        ],
        [
          "HookDefinition",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 22,
            type: "STObject"
          }
        ],
        [
          "HookParameter",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 23,
            type: "STObject"
          }
        ],
        [
          "HookGrant",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 24,
            type: "STObject"
          }
        ],
        [
          "VoteEntry",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 25,
            type: "STObject"
          }
        ],
        [
          "AuctionSlot",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 26,
            type: "STObject"
          }
        ],
        [
          "AuthAccount",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 27,
            type: "STObject"
          }
        ],
        [
          "XChainClaimProofSig",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 28,
            type: "STObject"
          }
        ],
        [
          "XChainCreateAccountProofSig",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 29,
            type: "STObject"
          }
        ],
        [
          "XChainClaimAttestationCollectionElement",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 30,
            type: "STObject"
          }
        ],
        [
          "XChainCreateAccountAttestationCollectionElement",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 31,
            type: "STObject"
          }
        ],
        [
          "PriceData",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 32,
            type: "STObject"
          }
        ],
        [
          "Credential",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 33,
            type: "STObject"
          }
        ],
        [
          "RawTransaction",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 34,
            type: "STObject"
          }
        ],
        [
          "BatchSigner",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 35,
            type: "STObject"
          }
        ],
        [
          "Book",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 36,
            type: "STObject"
          }
        ],
        [
          "CounterpartySignature",
          {
            isSerialized: true,
            isSigningField: false,
            isVLEncoded: false,
            nth: 37,
            type: "STObject"
          }
        ],
        [
          "Signers",
          {
            isSerialized: true,
            isSigningField: false,
            isVLEncoded: false,
            nth: 3,
            type: "STArray"
          }
        ],
        [
          "SignerEntries",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "STArray"
          }
        ],
        [
          "Template",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "STArray"
          }
        ],
        [
          "Necessary",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 6,
            type: "STArray"
          }
        ],
        [
          "Sufficient",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 7,
            type: "STArray"
          }
        ],
        [
          "AffectedNodes",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 8,
            type: "STArray"
          }
        ],
        [
          "Memos",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 9,
            type: "STArray"
          }
        ],
        [
          "NFTokens",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 10,
            type: "STArray"
          }
        ],
        [
          "Hooks",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 11,
            type: "STArray"
          }
        ],
        [
          "VoteSlots",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 12,
            type: "STArray"
          }
        ],
        [
          "AdditionalBooks",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 13,
            type: "STArray"
          }
        ],
        [
          "Majorities",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "STArray"
          }
        ],
        [
          "DisabledValidators",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 17,
            type: "STArray"
          }
        ],
        [
          "HookExecutions",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 18,
            type: "STArray"
          }
        ],
        [
          "HookParameters",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 19,
            type: "STArray"
          }
        ],
        [
          "HookGrants",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 20,
            type: "STArray"
          }
        ],
        [
          "XChainClaimAttestations",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 21,
            type: "STArray"
          }
        ],
        [
          "XChainCreateAccountAttestations",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 22,
            type: "STArray"
          }
        ],
        [
          "PriceDataSeries",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 24,
            type: "STArray"
          }
        ],
        [
          "AuthAccounts",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 25,
            type: "STArray"
          }
        ],
        [
          "AuthorizeCredentials",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 26,
            type: "STArray"
          }
        ],
        [
          "UnauthorizeCredentials",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 27,
            type: "STArray"
          }
        ],
        [
          "AcceptedCredentials",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 28,
            type: "STArray"
          }
        ],
        [
          "Permissions",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 29,
            type: "STArray"
          }
        ],
        [
          "RawTransactions",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 30,
            type: "STArray"
          }
        ],
        [
          "BatchSigners",
          {
            isSerialized: true,
            isSigningField: false,
            isVLEncoded: false,
            nth: 31,
            type: "STArray"
          }
        ],
        [
          "CloseResolution",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "UInt8"
          }
        ],
        [
          "Method",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "UInt8"
          }
        ],
        [
          "TransactionResult",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "UInt8"
          }
        ],
        [
          "Scale",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "UInt8"
          }
        ],
        [
          "AssetScale",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 5,
            type: "UInt8"
          }
        ],
        [
          "TickSize",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 16,
            type: "UInt8"
          }
        ],
        [
          "UNLModifyDisabling",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 17,
            type: "UInt8"
          }
        ],
        [
          "HookResult",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 18,
            type: "UInt8"
          }
        ],
        [
          "WasLockingChainSend",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 19,
            type: "UInt8"
          }
        ],
        [
          "WithdrawalPolicy",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 20,
            type: "UInt8"
          }
        ],
        [
          "TakerPaysCurrency",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Hash160"
          }
        ],
        [
          "TakerPaysIssuer",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "Hash160"
          }
        ],
        [
          "TakerGetsCurrency",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "Hash160"
          }
        ],
        [
          "TakerGetsIssuer",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "Hash160"
          }
        ],
        [
          "Paths",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "PathSet"
          }
        ],
        [
          "Indexes",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 1,
            type: "Vector256"
          }
        ],
        [
          "Hashes",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 2,
            type: "Vector256"
          }
        ],
        [
          "Amendments",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 3,
            type: "Vector256"
          }
        ],
        [
          "NFTokenOffers",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 4,
            type: "Vector256"
          }
        ],
        [
          "CredentialIDs",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: true,
            nth: 5,
            type: "Vector256"
          }
        ],
        [
          "MPTokenIssuanceID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Hash192"
          }
        ],
        [
          "ShareMPTID",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "Hash192"
          }
        ],
        [
          "TakerPaysMPT",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "Hash192"
          }
        ],
        [
          "TakerGetsMPT",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "Hash192"
          }
        ],
        [
          "LockingChainIssue",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Issue"
          }
        ],
        [
          "IssuingChainIssue",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "Issue"
          }
        ],
        [
          "Asset",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 3,
            type: "Issue"
          }
        ],
        [
          "Asset2",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 4,
            type: "Issue"
          }
        ],
        [
          "XChainBridge",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "XChainBridge"
          }
        ],
        [
          "BaseAsset",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 1,
            type: "Currency"
          }
        ],
        [
          "QuoteAsset",
          {
            isSerialized: true,
            isSigningField: true,
            isVLEncoded: false,
            nth: 2,
            type: "Currency"
          }
        ],
        [
          "Transaction",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: 257,
            type: "Transaction"
          }
        ],
        [
          "LedgerEntry",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: 257,
            type: "LedgerEntry"
          }
        ],
        [
          "Validation",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: 257,
            type: "Validation"
          }
        ],
        [
          "Metadata",
          {
            isSerialized: false,
            isSigningField: false,
            isVLEncoded: false,
            nth: 257,
            type: "Metadata"
          }
        ]
      ],
      LEDGER_ENTRY_FLAGS: {
        AccountRoot: {
          lsfAllowTrustLineClawback: 2147483648,
          lsfAllowTrustLineLocking: 1073741824,
          lsfDefaultRipple: 8388608,
          lsfDepositAuth: 16777216,
          lsfDisableMaster: 1048576,
          lsfDisallowIncomingCheck: 134217728,
          lsfDisallowIncomingNFTokenOffer: 67108864,
          lsfDisallowIncomingPayChan: 268435456,
          lsfDisallowIncomingTrustline: 536870912,
          lsfDisallowXRP: 524288,
          lsfGlobalFreeze: 4194304,
          lsfNoFreeze: 2097152,
          lsfPasswordSpent: 65536,
          lsfRequireAuth: 262144,
          lsfRequireDestTag: 131072
        },
        Credential: {
          lsfAccepted: 65536
        },
        DirNode: {
          lsfNFTokenBuyOffers: 1,
          lsfNFTokenSellOffers: 2
        },
        Loan: {
          lsfLoanDefault: 65536,
          lsfLoanImpaired: 131072,
          lsfLoanOverpayment: 262144
        },
        MPToken: {
          lsfMPTAMM: 4,
          lsfMPTAuthorized: 2,
          lsfMPTLocked: 1
        },
        MPTokenIssuance: {
          lsfMPTCanClawback: 64,
          lsfMPTCanEscrow: 8,
          lsfMPTCanLock: 2,
          lsfMPTCanTrade: 16,
          lsfMPTCanTransfer: 32,
          lsfMPTLocked: 1,
          lsfMPTRequireAuth: 4
        },
        MPTokenIssuanceMutable: {
          lsmfMPTCanMutateCanClawback: 64,
          lsmfMPTCanMutateCanEscrow: 8,
          lsmfMPTCanMutateCanLock: 2,
          lsmfMPTCanMutateCanTrade: 16,
          lsmfMPTCanMutateCanTransfer: 32,
          lsmfMPTCanMutateMetadata: 65536,
          lsmfMPTCanMutateRequireAuth: 4,
          lsmfMPTCanMutateTransferFee: 131072
        },
        NFTokenOffer: {
          lsfSellNFToken: 1
        },
        Offer: {
          lsfHybrid: 262144,
          lsfPassive: 65536,
          lsfSell: 131072
        },
        RippleState: {
          lsfAMMNode: 16777216,
          lsfHighAuth: 524288,
          lsfHighDeepFreeze: 67108864,
          lsfHighFreeze: 8388608,
          lsfHighNoRipple: 2097152,
          lsfHighReserve: 131072,
          lsfLowAuth: 262144,
          lsfLowDeepFreeze: 33554432,
          lsfLowFreeze: 4194304,
          lsfLowNoRipple: 1048576,
          lsfLowReserve: 65536
        },
        SignerList: {
          lsfOneOwnerCount: 65536
        },
        Vault: {
          lsfVaultPrivate: 65536
        }
      },
      LEDGER_ENTRY_FORMATS: {
        AMM: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "TradingFee",
            optionality: 2
          },
          {
            name: "VoteSlots",
            optionality: 1
          },
          {
            name: "AuctionSlot",
            optionality: 1
          },
          {
            name: "LPTokenBalance",
            optionality: 0
          },
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "Asset2",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 1
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 1
          }
        ],
        AccountRoot: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 0
          },
          {
            name: "Balance",
            optionality: 0
          },
          {
            name: "OwnerCount",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "AccountTxnID",
            optionality: 1
          },
          {
            name: "RegularKey",
            optionality: 1
          },
          {
            name: "EmailHash",
            optionality: 1
          },
          {
            name: "WalletLocator",
            optionality: 1
          },
          {
            name: "WalletSize",
            optionality: 1
          },
          {
            name: "MessageKey",
            optionality: 1
          },
          {
            name: "TransferRate",
            optionality: 1
          },
          {
            name: "Domain",
            optionality: 1
          },
          {
            name: "TickSize",
            optionality: 1
          },
          {
            name: "TicketCount",
            optionality: 1
          },
          {
            name: "NFTokenMinter",
            optionality: 1
          },
          {
            name: "MintedNFTokens",
            optionality: 2
          },
          {
            name: "BurnedNFTokens",
            optionality: 2
          },
          {
            name: "FirstNFTokenSequence",
            optionality: 1
          },
          {
            name: "AMMID",
            optionality: 1
          },
          {
            name: "VaultID",
            optionality: 1
          },
          {
            name: "LoanBrokerID",
            optionality: 1
          }
        ],
        Amendments: [
          {
            name: "Amendments",
            optionality: 1
          },
          {
            name: "Majorities",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 1
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 1
          }
        ],
        Bridge: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "SignatureReward",
            optionality: 0
          },
          {
            name: "MinAccountCreateAmount",
            optionality: 1
          },
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "XChainClaimID",
            optionality: 0
          },
          {
            name: "XChainAccountCreateCount",
            optionality: 0
          },
          {
            name: "XChainAccountClaimCount",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        Check: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "SendMax",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "DestinationNode",
            optionality: 0
          },
          {
            name: "Expiration",
            optionality: 1
          },
          {
            name: "InvoiceID",
            optionality: 1
          },
          {
            name: "SourceTag",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        Credential: [
          {
            name: "Subject",
            optionality: 0
          },
          {
            name: "Issuer",
            optionality: 0
          },
          {
            name: "CredentialType",
            optionality: 0
          },
          {
            name: "Expiration",
            optionality: 1
          },
          {
            name: "URI",
            optionality: 1
          },
          {
            name: "IssuerNode",
            optionality: 0
          },
          {
            name: "SubjectNode",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        DID: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "DIDDocument",
            optionality: 1
          },
          {
            name: "URI",
            optionality: 1
          },
          {
            name: "Data",
            optionality: 1
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        Delegate: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Authorize",
            optionality: 0
          },
          {
            name: "Permissions",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "DestinationNode",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        DepositPreauth: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Authorize",
            optionality: 1
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "AuthorizeCredentials",
            optionality: 1
          }
        ],
        DirectoryNode: [
          {
            name: "Owner",
            optionality: 1
          },
          {
            name: "TakerPaysCurrency",
            optionality: 1
          },
          {
            name: "TakerPaysIssuer",
            optionality: 1
          },
          {
            name: "TakerPaysMPT",
            optionality: 1
          },
          {
            name: "TakerGetsCurrency",
            optionality: 1
          },
          {
            name: "TakerGetsIssuer",
            optionality: 1
          },
          {
            name: "TakerGetsMPT",
            optionality: 1
          },
          {
            name: "ExchangeRate",
            optionality: 1
          },
          {
            name: "Indexes",
            optionality: 0
          },
          {
            name: "RootIndex",
            optionality: 0
          },
          {
            name: "IndexNext",
            optionality: 1
          },
          {
            name: "IndexPrevious",
            optionality: 1
          },
          {
            name: "NFTokenID",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 1
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 1
          },
          {
            name: "DomainID",
            optionality: 1
          }
        ],
        Escrow: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 1
          },
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Condition",
            optionality: 1
          },
          {
            name: "CancelAfter",
            optionality: 1
          },
          {
            name: "FinishAfter",
            optionality: 1
          },
          {
            name: "SourceTag",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "DestinationNode",
            optionality: 1
          },
          {
            name: "TransferRate",
            optionality: 1
          },
          {
            name: "IssuerNode",
            optionality: 1
          }
        ],
        FeeSettings: [
          {
            name: "BaseFee",
            optionality: 1
          },
          {
            name: "ReferenceFeeUnits",
            optionality: 1
          },
          {
            name: "ReserveBase",
            optionality: 1
          },
          {
            name: "ReserveIncrement",
            optionality: 1
          },
          {
            name: "BaseFeeDrops",
            optionality: 1
          },
          {
            name: "ReserveBaseDrops",
            optionality: 1
          },
          {
            name: "ReserveIncrementDrops",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 1
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 1
          }
        ],
        LedgerHashes: [
          {
            name: "FirstLedgerSequence",
            optionality: 1
          },
          {
            name: "LastLedgerSequence",
            optionality: 1
          },
          {
            name: "Hashes",
            optionality: 0
          }
        ],
        Loan: [
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "LoanBrokerNode",
            optionality: 0
          },
          {
            name: "LoanBrokerID",
            optionality: 0
          },
          {
            name: "LoanSequence",
            optionality: 0
          },
          {
            name: "Borrower",
            optionality: 0
          },
          {
            name: "LoanOriginationFee",
            optionality: 2
          },
          {
            name: "LoanServiceFee",
            optionality: 2
          },
          {
            name: "LatePaymentFee",
            optionality: 2
          },
          {
            name: "ClosePaymentFee",
            optionality: 2
          },
          {
            name: "OverpaymentFee",
            optionality: 2
          },
          {
            name: "InterestRate",
            optionality: 2
          },
          {
            name: "LateInterestRate",
            optionality: 2
          },
          {
            name: "CloseInterestRate",
            optionality: 2
          },
          {
            name: "OverpaymentInterestRate",
            optionality: 2
          },
          {
            name: "StartDate",
            optionality: 0
          },
          {
            name: "PaymentInterval",
            optionality: 0
          },
          {
            name: "GracePeriod",
            optionality: 2
          },
          {
            name: "PreviousPaymentDueDate",
            optionality: 2
          },
          {
            name: "NextPaymentDueDate",
            optionality: 2
          },
          {
            name: "PaymentRemaining",
            optionality: 2
          },
          {
            name: "PeriodicPayment",
            optionality: 0
          },
          {
            name: "PrincipalOutstanding",
            optionality: 2
          },
          {
            name: "TotalValueOutstanding",
            optionality: 2
          },
          {
            name: "ManagementFeeOutstanding",
            optionality: 2
          },
          {
            name: "LoanScale",
            optionality: 2
          }
        ],
        LoanBroker: [
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "VaultNode",
            optionality: 0
          },
          {
            name: "VaultID",
            optionality: 0
          },
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Owner",
            optionality: 0
          },
          {
            name: "LoanSequence",
            optionality: 0
          },
          {
            name: "Data",
            optionality: 2
          },
          {
            name: "ManagementFeeRate",
            optionality: 2
          },
          {
            name: "OwnerCount",
            optionality: 2
          },
          {
            name: "DebtTotal",
            optionality: 2
          },
          {
            name: "DebtMaximum",
            optionality: 2
          },
          {
            name: "CoverAvailable",
            optionality: 2
          },
          {
            name: "CoverRateMinimum",
            optionality: 2
          },
          {
            name: "CoverRateLiquidation",
            optionality: 2
          }
        ],
        MPToken: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "MPTokenIssuanceID",
            optionality: 0
          },
          {
            name: "MPTAmount",
            optionality: 2
          },
          {
            name: "LockedAmount",
            optionality: 1
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        MPTokenIssuance: [
          {
            name: "Issuer",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 0
          },
          {
            name: "TransferFee",
            optionality: 2
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "AssetScale",
            optionality: 2
          },
          {
            name: "MaximumAmount",
            optionality: 1
          },
          {
            name: "OutstandingAmount",
            optionality: 0
          },
          {
            name: "LockedAmount",
            optionality: 1
          },
          {
            name: "MPTokenMetadata",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "DomainID",
            optionality: 1
          },
          {
            name: "MutableFlags",
            optionality: 2
          },
          {
            name: "ReferenceHolding",
            optionality: 1
          }
        ],
        NFTokenOffer: [
          {
            name: "Owner",
            optionality: 0
          },
          {
            name: "NFTokenID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "NFTokenOfferNode",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 1
          },
          {
            name: "Expiration",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        NFTokenPage: [
          {
            name: "PreviousPageMin",
            optionality: 1
          },
          {
            name: "NextPageMin",
            optionality: 1
          },
          {
            name: "NFTokens",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        NegativeUNL: [
          {
            name: "DisabledValidators",
            optionality: 1
          },
          {
            name: "ValidatorToDisable",
            optionality: 1
          },
          {
            name: "ValidatorToReEnable",
            optionality: 1
          },
          {
            name: "PreviousTxnID",
            optionality: 1
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 1
          }
        ],
        Offer: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 0
          },
          {
            name: "TakerPays",
            optionality: 0
          },
          {
            name: "TakerGets",
            optionality: 0
          },
          {
            name: "BookDirectory",
            optionality: 0
          },
          {
            name: "BookNode",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "Expiration",
            optionality: 1
          },
          {
            name: "DomainID",
            optionality: 1
          },
          {
            name: "AdditionalBooks",
            optionality: 1
          }
        ],
        Oracle: [
          {
            name: "Owner",
            optionality: 0
          },
          {
            name: "OracleDocumentID",
            optionality: 1
          },
          {
            name: "Provider",
            optionality: 0
          },
          {
            name: "PriceDataSeries",
            optionality: 0
          },
          {
            name: "AssetClass",
            optionality: 0
          },
          {
            name: "LastUpdateTime",
            optionality: 0
          },
          {
            name: "URI",
            optionality: 1
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        PayChannel: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 1
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Balance",
            optionality: 0
          },
          {
            name: "PublicKey",
            optionality: 0
          },
          {
            name: "SettleDelay",
            optionality: 0
          },
          {
            name: "Expiration",
            optionality: 1
          },
          {
            name: "CancelAfter",
            optionality: 1
          },
          {
            name: "SourceTag",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "DestinationNode",
            optionality: 1
          }
        ],
        PermissionedDomain: [
          {
            name: "Owner",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 0
          },
          {
            name: "AcceptedCredentials",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        RippleState: [
          {
            name: "Balance",
            optionality: 0
          },
          {
            name: "LowLimit",
            optionality: 0
          },
          {
            name: "HighLimit",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "LowNode",
            optionality: 1
          },
          {
            name: "LowQualityIn",
            optionality: 1
          },
          {
            name: "LowQualityOut",
            optionality: 1
          },
          {
            name: "HighNode",
            optionality: 1
          },
          {
            name: "HighQualityIn",
            optionality: 1
          },
          {
            name: "HighQualityOut",
            optionality: 1
          }
        ],
        SignerList: [
          {
            name: "Owner",
            optionality: 1
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "SignerQuorum",
            optionality: 0
          },
          {
            name: "SignerEntries",
            optionality: 0
          },
          {
            name: "SignerListID",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        Ticket: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "TicketSequence",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        Vault: [
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "Owner",
            optionality: 0
          },
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Data",
            optionality: 1
          },
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "AssetsTotal",
            optionality: 2
          },
          {
            name: "AssetsAvailable",
            optionality: 2
          },
          {
            name: "AssetsMaximum",
            optionality: 2
          },
          {
            name: "LossUnrealized",
            optionality: 2
          },
          {
            name: "ShareMPTID",
            optionality: 0
          },
          {
            name: "WithdrawalPolicy",
            optionality: 0
          },
          {
            name: "Scale",
            optionality: 2
          }
        ],
        XChainOwnedClaimID: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "XChainClaimID",
            optionality: 0
          },
          {
            name: "OtherChainSource",
            optionality: 0
          },
          {
            name: "XChainClaimAttestations",
            optionality: 0
          },
          {
            name: "SignatureReward",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        XChainOwnedCreateAccountClaimID: [
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "XChainAccountCreateCount",
            optionality: 0
          },
          {
            name: "XChainCreateAccountAttestations",
            optionality: 0
          },
          {
            name: "OwnerNode",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 0
          },
          {
            name: "PreviousTxnLgrSeq",
            optionality: 0
          }
        ],
        common: [
          {
            name: "LedgerIndex",
            optionality: 1
          },
          {
            name: "LedgerEntryType",
            optionality: 0
          },
          {
            name: "Flags",
            optionality: 0
          }
        ]
      },
      LEDGER_ENTRY_TYPES: {
        AMM: 121,
        AccountRoot: 97,
        Amendments: 102,
        Bridge: 105,
        Check: 67,
        Credential: 129,
        DID: 73,
        Delegate: 131,
        DepositPreauth: 112,
        DirectoryNode: 100,
        Escrow: 117,
        FeeSettings: 115,
        Invalid: -1,
        LedgerHashes: 104,
        Loan: 137,
        LoanBroker: 136,
        MPToken: 127,
        MPTokenIssuance: 126,
        NFTokenOffer: 55,
        NFTokenPage: 80,
        NegativeUNL: 78,
        Offer: 111,
        Oracle: 128,
        PayChannel: 120,
        PermissionedDomain: 130,
        RippleState: 114,
        SignerList: 83,
        Ticket: 84,
        Vault: 132,
        XChainOwnedClaimID: 113,
        XChainOwnedCreateAccountClaimID: 116
      },
      TRANSACTION_FLAGS: {
        AMMClawback: {
          tfClawTwoAssets: 1
        },
        AMMDeposit: {
          tfLPToken: 65536,
          tfLimitLPToken: 4194304,
          tfOneAssetLPToken: 2097152,
          tfSingleAsset: 524288,
          tfTwoAsset: 1048576,
          tfTwoAssetIfEmpty: 8388608
        },
        AMMWithdraw: {
          tfLPToken: 65536,
          tfLimitLPToken: 4194304,
          tfOneAssetLPToken: 2097152,
          tfOneAssetWithdrawAll: 262144,
          tfSingleAsset: 524288,
          tfTwoAsset: 1048576,
          tfWithdrawAll: 131072
        },
        AccountSet: {
          tfAllowXRP: 2097152,
          tfDisallowXRP: 1048576,
          tfOptionalAuth: 524288,
          tfOptionalDestTag: 131072,
          tfRequireAuth: 262144,
          tfRequireDestTag: 65536
        },
        Batch: {
          tfAllOrNothing: 65536,
          tfIndependent: 524288,
          tfOnlyOne: 131072,
          tfUntilFailure: 262144
        },
        EnableAmendment: {
          tfGotMajority: 65536,
          tfLostMajority: 131072
        },
        LoanManage: {
          tfLoanDefault: 65536,
          tfLoanImpair: 131072,
          tfLoanUnimpair: 262144
        },
        LoanPay: {
          tfLoanFullPayment: 131072,
          tfLoanLatePayment: 262144,
          tfLoanOverpayment: 65536
        },
        LoanSet: {
          tfLoanOverpayment: 65536
        },
        MPTokenAuthorize: {
          tfMPTUnauthorize: 1
        },
        MPTokenIssuanceCreate: {
          tfMPTCanClawback: 64,
          tfMPTCanEscrow: 8,
          tfMPTCanLock: 2,
          tfMPTCanTrade: 16,
          tfMPTCanTransfer: 32,
          tfMPTRequireAuth: 4
        },
        MPTokenIssuanceSet: {
          tfMPTLock: 1,
          tfMPTUnlock: 2
        },
        NFTokenCreateOffer: {
          tfSellNFToken: 1
        },
        NFTokenMint: {
          tfBurnable: 1,
          tfMutable: 16,
          tfOnlyXRP: 2,
          tfTransferable: 8
        },
        OfferCreate: {
          tfFillOrKill: 262144,
          tfHybrid: 1048576,
          tfImmediateOrCancel: 131072,
          tfPassive: 65536,
          tfSell: 524288
        },
        Payment: {
          tfLimitQuality: 262144,
          tfNoRippleDirect: 65536,
          tfPartialPayment: 131072
        },
        PaymentChannelClaim: {
          tfClose: 131072,
          tfRenew: 65536
        },
        TrustSet: {
          tfClearDeepFreeze: 8388608,
          tfClearFreeze: 2097152,
          tfClearNoRipple: 262144,
          tfSetDeepFreeze: 4194304,
          tfSetFreeze: 1048576,
          tfSetNoRipple: 131072,
          tfSetfAuth: 65536
        },
        VaultCreate: {
          tfVaultPrivate: 65536,
          tfVaultShareNonTransferable: 131072
        },
        XChainModifyBridge: {
          tfClearAccountCreateAmount: 65536
        },
        universal: {
          tfFullyCanonicalSig: 2147483648,
          tfInnerBatchTxn: 1073741824
        }
      },
      TRANSACTION_FORMATS: {
        AMMBid: [
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "Asset2",
            optionality: 0
          },
          {
            name: "BidMin",
            optionality: 1
          },
          {
            name: "BidMax",
            optionality: 1
          },
          {
            name: "AuthAccounts",
            optionality: 1
          }
        ],
        AMMClawback: [
          {
            name: "Holder",
            optionality: 0
          },
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "Asset2",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 1
          }
        ],
        AMMCreate: [
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Amount2",
            optionality: 0
          },
          {
            name: "TradingFee",
            optionality: 0
          }
        ],
        AMMDelete: [
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "Asset2",
            optionality: 0
          }
        ],
        AMMDeposit: [
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "Asset2",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 1
          },
          {
            name: "Amount2",
            optionality: 1
          },
          {
            name: "EPrice",
            optionality: 1
          },
          {
            name: "LPTokenOut",
            optionality: 1
          },
          {
            name: "TradingFee",
            optionality: 1
          }
        ],
        AMMVote: [
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "Asset2",
            optionality: 0
          },
          {
            name: "TradingFee",
            optionality: 0
          }
        ],
        AMMWithdraw: [
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "Asset2",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 1
          },
          {
            name: "Amount2",
            optionality: 1
          },
          {
            name: "EPrice",
            optionality: 1
          },
          {
            name: "LPTokenIn",
            optionality: 1
          }
        ],
        AccountDelete: [
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "DestinationTag",
            optionality: 1
          },
          {
            name: "CredentialIDs",
            optionality: 1
          }
        ],
        AccountSet: [
          {
            name: "EmailHash",
            optionality: 1
          },
          {
            name: "WalletLocator",
            optionality: 1
          },
          {
            name: "WalletSize",
            optionality: 1
          },
          {
            name: "MessageKey",
            optionality: 1
          },
          {
            name: "Domain",
            optionality: 1
          },
          {
            name: "TransferRate",
            optionality: 1
          },
          {
            name: "SetFlag",
            optionality: 1
          },
          {
            name: "ClearFlag",
            optionality: 1
          },
          {
            name: "TickSize",
            optionality: 1
          },
          {
            name: "NFTokenMinter",
            optionality: 1
          }
        ],
        Batch: [
          {
            name: "RawTransactions",
            optionality: 0
          },
          {
            name: "BatchSigners",
            optionality: 1
          }
        ],
        CheckCancel: [
          {
            name: "CheckID",
            optionality: 0
          }
        ],
        CheckCash: [
          {
            name: "CheckID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 1
          },
          {
            name: "DeliverMin",
            optionality: 1
          }
        ],
        CheckCreate: [
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "SendMax",
            optionality: 0
          },
          {
            name: "Expiration",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          },
          {
            name: "InvoiceID",
            optionality: 1
          }
        ],
        Clawback: [
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Holder",
            optionality: 1
          }
        ],
        CredentialAccept: [
          {
            name: "Issuer",
            optionality: 0
          },
          {
            name: "CredentialType",
            optionality: 0
          }
        ],
        CredentialCreate: [
          {
            name: "Subject",
            optionality: 0
          },
          {
            name: "CredentialType",
            optionality: 0
          },
          {
            name: "Expiration",
            optionality: 1
          },
          {
            name: "URI",
            optionality: 1
          }
        ],
        CredentialDelete: [
          {
            name: "Subject",
            optionality: 1
          },
          {
            name: "Issuer",
            optionality: 1
          },
          {
            name: "CredentialType",
            optionality: 0
          }
        ],
        DIDDelete: [],
        DIDSet: [
          {
            name: "DIDDocument",
            optionality: 1
          },
          {
            name: "URI",
            optionality: 1
          },
          {
            name: "Data",
            optionality: 1
          }
        ],
        DelegateSet: [
          {
            name: "Authorize",
            optionality: 0
          },
          {
            name: "Permissions",
            optionality: 0
          }
        ],
        DepositPreauth: [
          {
            name: "Authorize",
            optionality: 1
          },
          {
            name: "Unauthorize",
            optionality: 1
          },
          {
            name: "AuthorizeCredentials",
            optionality: 1
          },
          {
            name: "UnauthorizeCredentials",
            optionality: 1
          }
        ],
        EnableAmendment: [
          {
            name: "LedgerSequence",
            optionality: 0
          },
          {
            name: "Amendment",
            optionality: 0
          }
        ],
        EscrowCancel: [
          {
            name: "Owner",
            optionality: 0
          },
          {
            name: "OfferSequence",
            optionality: 0
          }
        ],
        EscrowCreate: [
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Condition",
            optionality: 1
          },
          {
            name: "CancelAfter",
            optionality: 1
          },
          {
            name: "FinishAfter",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          }
        ],
        EscrowFinish: [
          {
            name: "Owner",
            optionality: 0
          },
          {
            name: "OfferSequence",
            optionality: 0
          },
          {
            name: "Fulfillment",
            optionality: 1
          },
          {
            name: "Condition",
            optionality: 1
          },
          {
            name: "CredentialIDs",
            optionality: 1
          }
        ],
        LedgerStateFix: [
          {
            name: "LedgerFixType",
            optionality: 0
          },
          {
            name: "Owner",
            optionality: 1
          },
          {
            name: "BookDirectory",
            optionality: 1
          }
        ],
        LoanBrokerCoverClawback: [
          {
            name: "LoanBrokerID",
            optionality: 1
          },
          {
            name: "Amount",
            optionality: 1
          }
        ],
        LoanBrokerCoverDeposit: [
          {
            name: "LoanBrokerID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          }
        ],
        LoanBrokerCoverWithdraw: [
          {
            name: "LoanBrokerID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          }
        ],
        LoanBrokerDelete: [
          {
            name: "LoanBrokerID",
            optionality: 0
          }
        ],
        LoanBrokerSet: [
          {
            name: "VaultID",
            optionality: 0
          },
          {
            name: "LoanBrokerID",
            optionality: 1
          },
          {
            name: "Data",
            optionality: 1
          },
          {
            name: "ManagementFeeRate",
            optionality: 1
          },
          {
            name: "DebtMaximum",
            optionality: 1
          },
          {
            name: "CoverRateMinimum",
            optionality: 1
          },
          {
            name: "CoverRateLiquidation",
            optionality: 1
          }
        ],
        LoanDelete: [
          {
            name: "LoanID",
            optionality: 0
          }
        ],
        LoanManage: [
          {
            name: "LoanID",
            optionality: 0
          }
        ],
        LoanPay: [
          {
            name: "LoanID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          }
        ],
        LoanSet: [
          {
            name: "LoanBrokerID",
            optionality: 0
          },
          {
            name: "Data",
            optionality: 1
          },
          {
            name: "Counterparty",
            optionality: 1
          },
          {
            name: "CounterpartySignature",
            optionality: 1
          },
          {
            name: "LoanOriginationFee",
            optionality: 1
          },
          {
            name: "LoanServiceFee",
            optionality: 1
          },
          {
            name: "LatePaymentFee",
            optionality: 1
          },
          {
            name: "ClosePaymentFee",
            optionality: 1
          },
          {
            name: "OverpaymentFee",
            optionality: 1
          },
          {
            name: "InterestRate",
            optionality: 1
          },
          {
            name: "LateInterestRate",
            optionality: 1
          },
          {
            name: "CloseInterestRate",
            optionality: 1
          },
          {
            name: "OverpaymentInterestRate",
            optionality: 1
          },
          {
            name: "PrincipalRequested",
            optionality: 0
          },
          {
            name: "PaymentTotal",
            optionality: 1
          },
          {
            name: "PaymentInterval",
            optionality: 1
          },
          {
            name: "GracePeriod",
            optionality: 1
          }
        ],
        MPTokenAuthorize: [
          {
            name: "MPTokenIssuanceID",
            optionality: 0
          },
          {
            name: "Holder",
            optionality: 1
          }
        ],
        MPTokenIssuanceCreate: [
          {
            name: "AssetScale",
            optionality: 1
          },
          {
            name: "TransferFee",
            optionality: 1
          },
          {
            name: "MaximumAmount",
            optionality: 1
          },
          {
            name: "MPTokenMetadata",
            optionality: 1
          },
          {
            name: "DomainID",
            optionality: 1
          },
          {
            name: "MutableFlags",
            optionality: 1
          }
        ],
        MPTokenIssuanceDestroy: [
          {
            name: "MPTokenIssuanceID",
            optionality: 0
          }
        ],
        MPTokenIssuanceSet: [
          {
            name: "MPTokenIssuanceID",
            optionality: 0
          },
          {
            name: "Holder",
            optionality: 1
          },
          {
            name: "DomainID",
            optionality: 1
          },
          {
            name: "MPTokenMetadata",
            optionality: 1
          },
          {
            name: "TransferFee",
            optionality: 1
          },
          {
            name: "MutableFlags",
            optionality: 1
          }
        ],
        NFTokenAcceptOffer: [
          {
            name: "NFTokenBuyOffer",
            optionality: 1
          },
          {
            name: "NFTokenSellOffer",
            optionality: 1
          },
          {
            name: "NFTokenBrokerFee",
            optionality: 1
          }
        ],
        NFTokenBurn: [
          {
            name: "NFTokenID",
            optionality: 0
          },
          {
            name: "Owner",
            optionality: 1
          }
        ],
        NFTokenCancelOffer: [
          {
            name: "NFTokenOffers",
            optionality: 0
          }
        ],
        NFTokenCreateOffer: [
          {
            name: "NFTokenID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 1
          },
          {
            name: "Owner",
            optionality: 1
          },
          {
            name: "Expiration",
            optionality: 1
          }
        ],
        NFTokenMint: [
          {
            name: "NFTokenTaxon",
            optionality: 0
          },
          {
            name: "TransferFee",
            optionality: 1
          },
          {
            name: "Issuer",
            optionality: 1
          },
          {
            name: "URI",
            optionality: 1
          },
          {
            name: "Amount",
            optionality: 1
          },
          {
            name: "Destination",
            optionality: 1
          },
          {
            name: "Expiration",
            optionality: 1
          }
        ],
        NFTokenModify: [
          {
            name: "NFTokenID",
            optionality: 0
          },
          {
            name: "Owner",
            optionality: 1
          },
          {
            name: "URI",
            optionality: 1
          }
        ],
        OfferCancel: [
          {
            name: "OfferSequence",
            optionality: 0
          }
        ],
        OfferCreate: [
          {
            name: "TakerPays",
            optionality: 0
          },
          {
            name: "TakerGets",
            optionality: 0
          },
          {
            name: "Expiration",
            optionality: 1
          },
          {
            name: "OfferSequence",
            optionality: 1
          },
          {
            name: "DomainID",
            optionality: 1
          }
        ],
        OracleDelete: [
          {
            name: "OracleDocumentID",
            optionality: 0
          }
        ],
        OracleSet: [
          {
            name: "OracleDocumentID",
            optionality: 0
          },
          {
            name: "Provider",
            optionality: 1
          },
          {
            name: "URI",
            optionality: 1
          },
          {
            name: "AssetClass",
            optionality: 1
          },
          {
            name: "LastUpdateTime",
            optionality: 0
          },
          {
            name: "PriceDataSeries",
            optionality: 0
          }
        ],
        Payment: [
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "SendMax",
            optionality: 1
          },
          {
            name: "Paths",
            optionality: 2
          },
          {
            name: "InvoiceID",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          },
          {
            name: "DeliverMin",
            optionality: 1
          },
          {
            name: "CredentialIDs",
            optionality: 1
          },
          {
            name: "DomainID",
            optionality: 1
          }
        ],
        PaymentChannelClaim: [
          {
            name: "Channel",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 1
          },
          {
            name: "Balance",
            optionality: 1
          },
          {
            name: "Signature",
            optionality: 1
          },
          {
            name: "PublicKey",
            optionality: 1
          },
          {
            name: "CredentialIDs",
            optionality: 1
          }
        ],
        PaymentChannelCreate: [
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "SettleDelay",
            optionality: 0
          },
          {
            name: "PublicKey",
            optionality: 0
          },
          {
            name: "CancelAfter",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          }
        ],
        PaymentChannelFund: [
          {
            name: "Channel",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Expiration",
            optionality: 1
          }
        ],
        PermissionedDomainDelete: [
          {
            name: "DomainID",
            optionality: 0
          }
        ],
        PermissionedDomainSet: [
          {
            name: "DomainID",
            optionality: 1
          },
          {
            name: "AcceptedCredentials",
            optionality: 0
          }
        ],
        SetFee: [
          {
            name: "LedgerSequence",
            optionality: 1
          },
          {
            name: "BaseFee",
            optionality: 1
          },
          {
            name: "ReferenceFeeUnits",
            optionality: 1
          },
          {
            name: "ReserveBase",
            optionality: 1
          },
          {
            name: "ReserveIncrement",
            optionality: 1
          },
          {
            name: "BaseFeeDrops",
            optionality: 1
          },
          {
            name: "ReserveBaseDrops",
            optionality: 1
          },
          {
            name: "ReserveIncrementDrops",
            optionality: 1
          }
        ],
        SetRegularKey: [
          {
            name: "RegularKey",
            optionality: 1
          }
        ],
        SignerListSet: [
          {
            name: "SignerQuorum",
            optionality: 0
          },
          {
            name: "SignerEntries",
            optionality: 1
          }
        ],
        TicketCreate: [
          {
            name: "TicketCount",
            optionality: 0
          }
        ],
        TrustSet: [
          {
            name: "LimitAmount",
            optionality: 1
          },
          {
            name: "QualityIn",
            optionality: 1
          },
          {
            name: "QualityOut",
            optionality: 1
          }
        ],
        UNLModify: [
          {
            name: "UNLModifyDisabling",
            optionality: 0
          },
          {
            name: "LedgerSequence",
            optionality: 0
          },
          {
            name: "UNLModifyValidator",
            optionality: 0
          }
        ],
        VaultClawback: [
          {
            name: "VaultID",
            optionality: 0
          },
          {
            name: "Holder",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 1
          }
        ],
        VaultCreate: [
          {
            name: "Asset",
            optionality: 0
          },
          {
            name: "AssetsMaximum",
            optionality: 1
          },
          {
            name: "MPTokenMetadata",
            optionality: 1
          },
          {
            name: "DomainID",
            optionality: 1
          },
          {
            name: "WithdrawalPolicy",
            optionality: 1
          },
          {
            name: "Data",
            optionality: 1
          },
          {
            name: "Scale",
            optionality: 1
          }
        ],
        VaultDelete: [
          {
            name: "VaultID",
            optionality: 0
          }
        ],
        VaultDeposit: [
          {
            name: "VaultID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          }
        ],
        VaultSet: [
          {
            name: "VaultID",
            optionality: 0
          },
          {
            name: "AssetsMaximum",
            optionality: 1
          },
          {
            name: "DomainID",
            optionality: 1
          },
          {
            name: "Data",
            optionality: 1
          }
        ],
        VaultWithdraw: [
          {
            name: "VaultID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 1
          },
          {
            name: "DestinationTag",
            optionality: 1
          }
        ],
        XChainAccountCreateCommit: [
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "SignatureReward",
            optionality: 0
          }
        ],
        XChainAddAccountCreateAttestation: [
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "AttestationSignerAccount",
            optionality: 0
          },
          {
            name: "PublicKey",
            optionality: 0
          },
          {
            name: "Signature",
            optionality: 0
          },
          {
            name: "OtherChainSource",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "AttestationRewardAccount",
            optionality: 0
          },
          {
            name: "WasLockingChainSend",
            optionality: 0
          },
          {
            name: "XChainAccountCreateCount",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "SignatureReward",
            optionality: 0
          }
        ],
        XChainAddClaimAttestation: [
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "AttestationSignerAccount",
            optionality: 0
          },
          {
            name: "PublicKey",
            optionality: 0
          },
          {
            name: "Signature",
            optionality: 0
          },
          {
            name: "OtherChainSource",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "AttestationRewardAccount",
            optionality: 0
          },
          {
            name: "WasLockingChainSend",
            optionality: 0
          },
          {
            name: "XChainClaimID",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 1
          }
        ],
        XChainClaim: [
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "XChainClaimID",
            optionality: 0
          },
          {
            name: "Destination",
            optionality: 0
          },
          {
            name: "DestinationTag",
            optionality: 1
          },
          {
            name: "Amount",
            optionality: 0
          }
        ],
        XChainCommit: [
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "XChainClaimID",
            optionality: 0
          },
          {
            name: "Amount",
            optionality: 0
          },
          {
            name: "OtherChainDestination",
            optionality: 1
          }
        ],
        XChainCreateBridge: [
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "SignatureReward",
            optionality: 0
          },
          {
            name: "MinAccountCreateAmount",
            optionality: 1
          }
        ],
        XChainCreateClaimID: [
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "SignatureReward",
            optionality: 0
          },
          {
            name: "OtherChainSource",
            optionality: 0
          }
        ],
        XChainModifyBridge: [
          {
            name: "XChainBridge",
            optionality: 0
          },
          {
            name: "SignatureReward",
            optionality: 1
          },
          {
            name: "MinAccountCreateAmount",
            optionality: 1
          }
        ],
        common: [
          {
            name: "TransactionType",
            optionality: 0
          },
          {
            name: "Flags",
            optionality: 1
          },
          {
            name: "SourceTag",
            optionality: 1
          },
          {
            name: "Account",
            optionality: 0
          },
          {
            name: "Sequence",
            optionality: 0
          },
          {
            name: "PreviousTxnID",
            optionality: 1
          },
          {
            name: "LastLedgerSequence",
            optionality: 1
          },
          {
            name: "AccountTxnID",
            optionality: 1
          },
          {
            name: "Fee",
            optionality: 0
          },
          {
            name: "OperationLimit",
            optionality: 1
          },
          {
            name: "Memos",
            optionality: 1
          },
          {
            name: "SigningPubKey",
            optionality: 0
          },
          {
            name: "TicketSequence",
            optionality: 1
          },
          {
            name: "TxnSignature",
            optionality: 1
          },
          {
            name: "Signers",
            optionality: 1
          },
          {
            name: "NetworkID",
            optionality: 1
          },
          {
            name: "Delegate",
            optionality: 1
          }
        ]
      },
      TRANSACTION_RESULTS: {
        tecAMM_ACCOUNT: 168,
        tecAMM_BALANCE: 163,
        tecAMM_EMPTY: 166,
        tecAMM_FAILED: 164,
        tecAMM_INVALID_TOKENS: 165,
        tecAMM_NOT_EMPTY: 167,
        tecARRAY_EMPTY: 190,
        tecARRAY_TOO_LARGE: 191,
        tecBAD_CREDENTIALS: 193,
        tecCANT_ACCEPT_OWN_NFTOKEN_OFFER: 158,
        tecCLAIM: 100,
        tecCRYPTOCONDITION_ERROR: 146,
        tecDIR_FULL: 121,
        tecDST_TAG_NEEDED: 143,
        tecDUPLICATE: 149,
        tecEMPTY_DID: 187,
        tecEXPIRED: 148,
        tecFAILED_PROCESSING: 105,
        tecFROZEN: 137,
        tecHAS_OBLIGATIONS: 151,
        tecINCOMPLETE: 169,
        tecINSUFFICIENT_FUNDS: 159,
        tecINSUFFICIENT_PAYMENT: 161,
        tecINSUFFICIENT_RESERVE: 141,
        tecINSUFF_FEE: 136,
        tecINSUF_RESERVE_LINE: 122,
        tecINSUF_RESERVE_OFFER: 123,
        tecINTERNAL: 144,
        tecINVALID_UPDATE_TIME: 188,
        tecINVARIANT_FAILED: 147,
        tecKILLED: 150,
        tecLIMIT_EXCEEDED: 195,
        tecLOCKED: 192,
        tecMAX_SEQUENCE_REACHED: 154,
        tecNEED_MASTER_KEY: 142,
        tecNFTOKEN_BUY_SELL_MISMATCH: 156,
        tecNFTOKEN_OFFER_TYPE_MISMATCH: 157,
        tecNO_ALTERNATIVE_KEY: 130,
        tecNO_AUTH: 134,
        tecNO_DST: 124,
        tecNO_DST_INSUF_XRP: 125,
        tecNO_ENTRY: 140,
        tecNO_ISSUER: 133,
        tecNO_LINE: 135,
        tecNO_LINE_INSUF_RESERVE: 126,
        tecNO_LINE_REDUNDANT: 127,
        tecNO_PERMISSION: 139,
        tecNO_REGULAR_KEY: 131,
        tecNO_SUITABLE_NFTOKEN_PAGE: 155,
        tecNO_TARGET: 138,
        tecOBJECT_NOT_FOUND: 160,
        tecOVERSIZE: 145,
        tecOWNERS: 132,
        tecPATH_DRY: 128,
        tecPATH_PARTIAL: 101,
        tecPRECISION_LOSS: 197,
        tecPSEUDO_ACCOUNT: 196,
        tecTOKEN_PAIR_NOT_FOUND: 189,
        tecTOO_SOON: 152,
        tecUNFUNDED: 129,
        tecUNFUNDED_ADD: 102,
        tecUNFUNDED_AMM: 162,
        tecUNFUNDED_OFFER: 103,
        tecUNFUNDED_PAYMENT: 104,
        tecWRONG_ASSET: 194,
        tecXCHAIN_ACCOUNT_CREATE_PAST: 181,
        tecXCHAIN_ACCOUNT_CREATE_TOO_MANY: 182,
        tecXCHAIN_BAD_CLAIM_ID: 172,
        tecXCHAIN_BAD_PUBLIC_KEY_ACCOUNT_PAIR: 185,
        tecXCHAIN_BAD_TRANSFER_ISSUE: 170,
        tecXCHAIN_CLAIM_NO_QUORUM: 173,
        tecXCHAIN_CREATE_ACCOUNT_DISABLED: 186,
        tecXCHAIN_CREATE_ACCOUNT_NONXRP_ISSUE: 175,
        tecXCHAIN_INSUFF_CREATE_AMOUNT: 180,
        tecXCHAIN_NO_CLAIM_ID: 171,
        tecXCHAIN_NO_SIGNERS_LIST: 178,
        tecXCHAIN_PAYMENT_FAILED: 183,
        tecXCHAIN_PROOF_UNKNOWN_KEY: 174,
        tecXCHAIN_REWARD_MISMATCH: 177,
        tecXCHAIN_SELF_COMMIT: 184,
        tecXCHAIN_SENDING_ACCOUNT_MISMATCH: 179,
        tecXCHAIN_WRONG_CHAIN: 176,
        tefALREADY: -198,
        tefBAD_ADD_AUTH: -197,
        tefBAD_AUTH: -196,
        tefBAD_AUTH_MASTER: -183,
        tefBAD_LEDGER: -195,
        tefBAD_QUORUM: -185,
        tefBAD_SIGNATURE: -186,
        tefCREATED: -194,
        tefEXCEPTION: -193,
        tefFAILURE: -199,
        tefINTERNAL: -192,
        tefINVALID_LEDGER_FIX_TYPE: -178,
        tefINVARIANT_FAILED: -182,
        tefMASTER_DISABLED: -188,
        tefMAX_LEDGER: -187,
        tefNFTOKEN_IS_NOT_TRANSFERABLE: -179,
        tefNOT_MULTI_SIGNING: -184,
        tefNO_AUTH_REQUIRED: -191,
        tefNO_TICKET: -180,
        tefPAST_SEQ: -190,
        tefTOO_BIG: -181,
        tefWRONG_PRIOR: -189,
        telBAD_DOMAIN: -398,
        telBAD_PATH_COUNT: -397,
        telBAD_PUBLIC_KEY: -396,
        telCAN_NOT_QUEUE: -392,
        telCAN_NOT_QUEUE_BALANCE: -391,
        telCAN_NOT_QUEUE_BLOCKED: -389,
        telCAN_NOT_QUEUE_BLOCKS: -390,
        telCAN_NOT_QUEUE_FEE: -388,
        telCAN_NOT_QUEUE_FULL: -387,
        telENV_RPC_FAILED: -383,
        telFAILED_PROCESSING: -395,
        telINSUF_FEE_P: -394,
        telLOCAL_ERROR: -399,
        telNETWORK_ID_MAKES_TX_NON_CANONICAL: -384,
        telNO_DST_PARTIAL: -393,
        telREQUIRES_NETWORK_ID: -385,
        telWRONG_NETWORK: -386,
        temARRAY_EMPTY: -253,
        temARRAY_TOO_LARGE: -252,
        temBAD_AMM_TOKENS: -261,
        temBAD_AMOUNT: -298,
        temBAD_CURRENCY: -297,
        temBAD_EXPIRATION: -296,
        temBAD_FEE: -295,
        temBAD_ISSUER: -294,
        temBAD_LIMIT: -293,
        temBAD_MPT: -249,
        temBAD_NFTOKEN_TRANSFER_FEE: -262,
        temBAD_OFFER: -292,
        temBAD_PATH: -291,
        temBAD_PATH_LOOP: -290,
        temBAD_QUORUM: -271,
        temBAD_REGKEY: -289,
        temBAD_SEND_XRP_LIMIT: -288,
        temBAD_SEND_XRP_MAX: -287,
        temBAD_SEND_XRP_NO_DIRECT: -286,
        temBAD_SEND_XRP_PARTIAL: -285,
        temBAD_SEND_XRP_PATHS: -284,
        temBAD_SEQUENCE: -283,
        temBAD_SIGNATURE: -282,
        temBAD_SIGNER: -272,
        temBAD_SRC_ACCOUNT: -281,
        temBAD_TICK_SIZE: -269,
        temBAD_TRANSFER_FEE: -251,
        temBAD_TRANSFER_RATE: -280,
        temBAD_WEIGHT: -270,
        temCANNOT_PREAUTH_SELF: -267,
        temDISABLED: -273,
        temDST_IS_SRC: -279,
        temDST_NEEDED: -278,
        temEMPTY_DID: -254,
        temINVALID: -277,
        temINVALID_ACCOUNT_ID: -268,
        temINVALID_COUNT: -266,
        temINVALID_FLAG: -276,
        temINVALID_INNER_BATCH: -250,
        temMALFORMED: -299,
        temREDUNDANT: -275,
        temRIPPLE_EMPTY: -274,
        temSEQ_AND_TICKET: -263,
        temUNCERTAIN: -265,
        temUNKNOWN: -264,
        temXCHAIN_BAD_PROOF: -259,
        temXCHAIN_BRIDGE_BAD_ISSUES: -258,
        temXCHAIN_BRIDGE_BAD_MIN_ACCOUNT_CREATE_AMOUNT: -256,
        temXCHAIN_BRIDGE_BAD_REWARD_AMOUNT: -255,
        temXCHAIN_BRIDGE_NONDOOR_OWNER: -257,
        temXCHAIN_EQUAL_DOOR_ACCOUNTS: -260,
        terADDRESS_COLLISION: -86,
        terFUNDS_SPENT: -98,
        terINSUF_FEE_B: -97,
        terLAST: -91,
        terLOCKED: -84,
        terNO_ACCOUNT: -96,
        terNO_AMM: -87,
        terNO_AUTH: -95,
        terNO_DELEGATE_PERMISSION: -85,
        terNO_LINE: -94,
        terNO_RIPPLE: -90,
        terOWNERS: -93,
        terPRE_SEQ: -92,
        terPRE_TICKET: -88,
        terQUEUED: -89,
        terRETRY: -99,
        tesSUCCESS: 0
      },
      TRANSACTION_TYPES: {
        AMMBid: 39,
        AMMClawback: 31,
        AMMCreate: 35,
        AMMDelete: 40,
        AMMDeposit: 36,
        AMMVote: 38,
        AMMWithdraw: 37,
        AccountDelete: 21,
        AccountSet: 3,
        Batch: 71,
        CheckCancel: 18,
        CheckCash: 17,
        CheckCreate: 16,
        Clawback: 30,
        CredentialAccept: 59,
        CredentialCreate: 58,
        CredentialDelete: 60,
        DIDDelete: 50,
        DIDSet: 49,
        DelegateSet: 64,
        DepositPreauth: 19,
        EnableAmendment: 100,
        EscrowCancel: 4,
        EscrowCreate: 1,
        EscrowFinish: 2,
        Invalid: -1,
        LedgerStateFix: 53,
        LoanBrokerCoverClawback: 78,
        LoanBrokerCoverDeposit: 76,
        LoanBrokerCoverWithdraw: 77,
        LoanBrokerDelete: 75,
        LoanBrokerSet: 74,
        LoanDelete: 81,
        LoanManage: 82,
        LoanPay: 84,
        LoanSet: 80,
        MPTokenAuthorize: 57,
        MPTokenIssuanceCreate: 54,
        MPTokenIssuanceDestroy: 55,
        MPTokenIssuanceSet: 56,
        NFTokenAcceptOffer: 29,
        NFTokenBurn: 26,
        NFTokenCancelOffer: 28,
        NFTokenCreateOffer: 27,
        NFTokenMint: 25,
        NFTokenModify: 61,
        OfferCancel: 8,
        OfferCreate: 7,
        OracleDelete: 52,
        OracleSet: 51,
        Payment: 0,
        PaymentChannelClaim: 15,
        PaymentChannelCreate: 13,
        PaymentChannelFund: 14,
        PermissionedDomainDelete: 63,
        PermissionedDomainSet: 62,
        SetFee: 101,
        SetRegularKey: 5,
        SignerListSet: 12,
        TicketCreate: 10,
        TrustSet: 20,
        UNLModify: 102,
        VaultClawback: 70,
        VaultCreate: 65,
        VaultDelete: 67,
        VaultDeposit: 68,
        VaultSet: 66,
        VaultWithdraw: 69,
        XChainAccountCreateCommit: 44,
        XChainAddAccountCreateAttestation: 46,
        XChainAddClaimAttestation: 45,
        XChainClaim: 43,
        XChainCommit: 42,
        XChainCreateBridge: 48,
        XChainCreateClaimID: 41,
        XChainModifyBridge: 47
      },
      TYPES: {
        AccountID: 8,
        Amount: 6,
        Blob: 7,
        Currency: 26,
        Done: -1,
        Hash128: 4,
        Hash160: 17,
        Hash192: 21,
        Hash256: 5,
        Hash384: 22,
        Hash512: 23,
        Int32: 10,
        Int64: 11,
        Issue: 24,
        LedgerEntry: 10002,
        Metadata: 10004,
        NotPresent: 0,
        Number: 9,
        PathSet: 18,
        STArray: 15,
        STObject: 14,
        Transaction: 10001,
        UInt16: 1,
        UInt32: 2,
        UInt64: 3,
        UInt8: 16,
        UInt96: 20,
        Unknown: -2,
        Validation: 10003,
        Vector256: 19,
        XChainBridge: 25
      },
      hash: "C685734F5FEB756693B4BB978BBB3A158A65652E71EEB2977068B0D680689213"
    };
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/bytes.js
var require_bytes = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/bytes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BytesLookup = exports.Bytes = void 0;
    var Bytes = class {
      constructor(name, ordinal, ordinalWidth) {
        this.name = name;
        this.ordinal = ordinal;
        this.ordinalWidth = ordinalWidth;
        this.bytes = new Uint8Array(ordinalWidth);
        for (let i = 0; i < ordinalWidth; i++) {
          this.bytes[ordinalWidth - i - 1] = ordinal >>> i * 8 & 255;
        }
      }
      toJSON() {
        return this.name;
      }
      toBytesSink(sink) {
        sink.put(this.bytes);
      }
      toBytes() {
        return this.bytes;
      }
    };
    exports.Bytes = Bytes;
    var BytesLookup = class {
      constructor(types, ordinalWidth) {
        this.ordinalWidth = ordinalWidth;
        Object.entries(types).forEach(([k, v]) => {
          this.add(k, v);
        });
      }
      /**
       * Add a new name value pair to the BytesLookup.
       *
       * @param name - A human readable name for the field.
       * @param value - The numeric value for the field.
       * @throws if the name or value already exist in the lookup because it's unclear how to decode.
       */
      add(name, value) {
        if (this[name]) {
          throw new SyntaxError(`Attempted to add a value with a duplicate name "${name}". This is not allowed because it is unclear how to decode.`);
        }
        if (this[value.toString()]) {
          throw new SyntaxError(`Attempted to add a duplicate value under a different name (Given name: "${name}" and previous name: "${this[value.toString()]}. This is not allowed because it is unclear how to decode.
Given value: ${value.toString()}`);
        }
        this[name] = new Bytes(name, value, this.ordinalWidth);
        this[value.toString()] = this[name];
      }
      from(value) {
        return value instanceof Bytes ? value : this[value];
      }
      fromParser(parser) {
        return this.from(parser.readUIntN(this.ordinalWidth).toString());
      }
    };
    exports.BytesLookup = BytesLookup;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/serdes/binary-serializer.js
var require_binary_serializer = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/serdes/binary-serializer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinarySerializer = exports.BytesList = void 0;
    var utils_1 = require_utils();
    var BytesList = class {
      constructor() {
        this.bytesArray = [];
      }
      /**
       * Get the total number of bytes in the BytesList
       *
       * @return the number of bytes
       */
      getLength() {
        return (0, utils_1.concat)(this.bytesArray).byteLength;
      }
      /**
       * Put bytes in the BytesList
       *
       * @param bytesArg A Uint8Array
       * @return this BytesList
       */
      put(bytesArg) {
        const bytes = Uint8Array.from(bytesArg);
        this.bytesArray.push(bytes);
        return this;
      }
      /**
       * Write this BytesList to the back of another bytes list
       *
       *  @param list The BytesList to write to
       */
      toBytesSink(list) {
        list.put(this.toBytes());
      }
      toBytes() {
        return (0, utils_1.concat)(this.bytesArray);
      }
      toHex() {
        return (0, utils_1.bytesToHex)(this.toBytes());
      }
    };
    exports.BytesList = BytesList;
    var BinarySerializer = class {
      constructor(sink) {
        this.sink = new BytesList();
        this.sink = sink;
      }
      /**
       * Write a value to this BinarySerializer
       *
       * @param value a SerializedType value
       */
      write(value) {
        value.toBytesSink(this.sink);
      }
      /**
       * Write bytes to this BinarySerializer
       *
       * @param bytes the bytes to write
       */
      put(bytes) {
        this.sink.put(bytes);
      }
      /**
       * Write a value of a given type to this BinarySerializer
       *
       * @param type the type to write
       * @param value a value of that type
       */
      writeType(type, value) {
        this.write(type.from(value));
      }
      /**
       * Write BytesList to this BinarySerializer
       *
       * @param bl BytesList to write to BinarySerializer
       */
      writeBytesList(bl) {
        bl.toBytesSink(this.sink);
      }
      /**
       * Calculate the header of Variable Length encoded bytes
       *
       * @param length the length of the bytes
       */
      encodeVariableLength(length) {
        const lenBytes = new Uint8Array(3);
        if (length <= 192) {
          lenBytes[0] = length;
          return lenBytes.slice(0, 1);
        } else if (length <= 12480) {
          length -= 193;
          lenBytes[0] = 193 + (length >>> 8);
          lenBytes[1] = length & 255;
          return lenBytes.slice(0, 2);
        } else if (length <= 918744) {
          length -= 12481;
          lenBytes[0] = 241 + (length >>> 16);
          lenBytes[1] = length >> 8 & 255;
          lenBytes[2] = length & 255;
          return lenBytes.slice(0, 3);
        }
        throw new Error("Overflow error");
      }
      /**
       * Write field and value to BinarySerializer
       *
       * @param field field to write to BinarySerializer
       * @param value value to write to BinarySerializer
       */
      writeFieldAndValue(field, value, isUnlModifyWorkaround = false) {
        const associatedValue = field.associatedType.from(value);
        if (associatedValue.toBytesSink === void 0 || field.name === void 0) {
          throw new Error();
        }
        this.sink.put(field.header);
        if (field.isVariableLengthEncoded) {
          this.writeLengthEncoded(associatedValue, isUnlModifyWorkaround);
        } else {
          associatedValue.toBytesSink(this.sink);
        }
      }
      /**
       * Write a variable length encoded value to the BinarySerializer
       *
       * @param value length encoded value to write to BytesList
       */
      writeLengthEncoded(value, isUnlModifyWorkaround = false) {
        const bytes = new BytesList();
        if (!isUnlModifyWorkaround) {
          value.toBytesSink(bytes);
        }
        this.put(this.encodeVariableLength(bytes.getLength()));
        this.writeBytesList(bytes);
      }
    };
    exports.BinarySerializer = BinarySerializer;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/serialized-type.js
var require_serialized_type = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/serialized-type.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Comparable = exports.SerializedType = void 0;
    var binary_serializer_1 = require_binary_serializer();
    var utils_1 = require_utils();
    var SerializedType = class {
      constructor(bytes) {
        this.bytes = new Uint8Array(0);
        this.bytes = bytes !== null && bytes !== void 0 ? bytes : new Uint8Array(0);
      }
      static fromParser(parser, hint) {
        throw new Error("fromParser not implemented");
        return this.fromParser(parser, hint);
      }
      static from(value) {
        throw new Error("from not implemented");
        return this.from(value);
      }
      /**
       * Write the bytes representation of a SerializedType to a BytesList
       *
       * @param list The BytesList to write SerializedType bytes to
       */
      toBytesSink(list) {
        list.put(this.bytes);
      }
      /**
       * Get the hex representation of a SerializedType's bytes
       *
       * @returns hex String of this.bytes
       */
      toHex() {
        return (0, utils_1.bytesToHex)(this.toBytes());
      }
      /**
       * Get the bytes representation of a SerializedType
       *
       * @returns A Uint8Array of the bytes
       */
      toBytes() {
        if (this.bytes) {
          return this.bytes;
        }
        const bytes = new binary_serializer_1.BytesList();
        this.toBytesSink(bytes);
        return bytes.toBytes();
      }
      /**
       * Return the JSON representation of a SerializedType
       *
       * @param _definitions rippled definitions used to parse the values of transaction types and such.
       *                          Unused in default, but used in STObject, STArray
       *                          Can be customized for sidechains and amendments.
       * @returns any type, if not overloaded returns hexString representation of bytes
       */
      toJSON(_definitions, _fieldName) {
        return this.toHex();
      }
      /**
       * @returns hexString representation of this.bytes
       */
      toString() {
        return this.toHex();
      }
    };
    exports.SerializedType = SerializedType;
    var Comparable = class extends SerializedType {
      lt(other) {
        return this.compareTo(other) < 0;
      }
      eq(other) {
        return this.compareTo(other) === 0;
      }
      gt(other) {
        return this.compareTo(other) > 0;
      }
      gte(other) {
        return this.compareTo(other) > -1;
      }
      lte(other) {
        return this.compareTo(other) < 1;
      }
      /**
       * Overload this method to define how two Comparable SerializedTypes are compared
       *
       * @param other The comparable object to compare this to
       * @returns A number denoting the relationship of this and other
       */
      compareTo(other) {
        throw new Error(`cannot compare ${this.toString()} and ${other.toString()}`);
      }
    };
    exports.Comparable = Comparable;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/constants.js
var require_constants = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELEGATABLE_PERMISSIONS_WIDTH = exports.TRANSACTION_RESULT_WIDTH = exports.TRANSACTION_TYPE_WIDTH = exports.LEDGER_ENTRY_WIDTH = exports.TYPE_WIDTH = void 0;
    exports.TYPE_WIDTH = 2;
    exports.LEDGER_ENTRY_WIDTH = 2;
    exports.TRANSACTION_TYPE_WIDTH = 2;
    exports.TRANSACTION_RESULT_WIDTH = 1;
    exports.DELEGATABLE_PERMISSIONS_WIDTH = 4;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/field.js
var require_field = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/field.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FieldLookup = void 0;
    var bytes_1 = require_bytes();
    var serialized_type_1 = require_serialized_type();
    var constants_1 = require_constants();
    function fieldHeader(type, nth) {
      const header = [];
      if (type < 16) {
        if (nth < 16) {
          header.push(type << 4 | nth);
        } else {
          header.push(type << 4, nth);
        }
      } else if (nth < 16) {
        header.push(nth, type);
      } else {
        header.push(0, type, nth);
      }
      return Uint8Array.from(header);
    }
    function buildField([name, info], typeOrdinal) {
      const field = fieldHeader(typeOrdinal, info.nth);
      return {
        name,
        nth: info.nth,
        isVariableLengthEncoded: info.isVLEncoded,
        isSerialized: info.isSerialized,
        isSigningField: info.isSigningField,
        ordinal: typeOrdinal << 16 | info.nth,
        type: new bytes_1.Bytes(info.type, typeOrdinal, constants_1.TYPE_WIDTH),
        header: field,
        associatedType: serialized_type_1.SerializedType
        // For later assignment in ./types/index.js or Definitions.updateAll(...)
      };
    }
    var FieldLookup = class {
      constructor(fields, types) {
        fields.forEach(([name, field_info]) => {
          const typeOrdinal = types[field_info.type];
          this[name] = buildField([name, field_info], typeOrdinal);
          this[this[name].ordinal.toString()] = this[name];
        });
      }
      fromString(value) {
        return this[value];
      }
    };
    exports.FieldLookup = FieldLookup;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/xrpl-definitions-base.js
var require_xrpl_definitions_base = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/xrpl-definitions-base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BytesLookup = exports.Bytes = exports.FieldLookup = exports.XrplDefinitionsBase = void 0;
    var bytes_1 = require_bytes();
    Object.defineProperty(exports, "Bytes", { enumerable: true, get: function() {
      return bytes_1.Bytes;
    } });
    Object.defineProperty(exports, "BytesLookup", { enumerable: true, get: function() {
      return bytes_1.BytesLookup;
    } });
    var field_1 = require_field();
    Object.defineProperty(exports, "FieldLookup", { enumerable: true, get: function() {
      return field_1.FieldLookup;
    } });
    var constants_1 = require_constants();
    var XrplDefinitionsBase = class {
      /**
       * Present rippled types in a typed and updatable format.
       * For an example of the input format see `definitions.json`.
       * To generate a new definitions file from rippled source code, use the tool at
       * `packages/ripple-binary-codec/tools/generateDefinitions.js`.
       *
       * See the definitions.test.js file for examples of how to create your own updated definitions.json.
       *
       * @param enums - A json encoding of the core types, transaction types, transaction results, transaction names, and fields.
       * @param types - A list of type objects with the same name as the fields defined.
       *              You can use the coreTypes object if you are not adding new types.
       */
      constructor(enums, types) {
        this.type = new bytes_1.BytesLookup(enums.TYPES, constants_1.TYPE_WIDTH);
        this.ledgerEntryType = new bytes_1.BytesLookup(enums.LEDGER_ENTRY_TYPES, constants_1.LEDGER_ENTRY_WIDTH);
        this.transactionType = new bytes_1.BytesLookup(enums.TRANSACTION_TYPES, constants_1.TRANSACTION_TYPE_WIDTH);
        this.transactionResult = new bytes_1.BytesLookup(enums.TRANSACTION_RESULTS, constants_1.TRANSACTION_RESULT_WIDTH);
        this.field = new field_1.FieldLookup(enums.FIELDS, enums.TYPES);
        this.transactionNames = Object.entries(enums.TRANSACTION_TYPES).filter(([_key, value]) => value >= 0).map(([key, _value]) => key);
        this.dataTypes = {};
        this.associateTypes(types);
        this.granularPermissions = {
          TrustlineAuthorize: 65537,
          TrustlineFreeze: 65538,
          TrustlineUnfreeze: 65539,
          AccountDomainSet: 65540,
          AccountEmailHashSet: 65541,
          AccountMessageKeySet: 65542,
          AccountTransferRateSet: 65543,
          AccountTickSizeSet: 65544,
          PaymentMint: 65545,
          PaymentBurn: 65546,
          MPTokenIssuanceLock: 65547,
          MPTokenIssuanceUnlock: 65548
        };
        const incrementedTransactionTypes = Object.fromEntries(Object.entries(enums.TRANSACTION_TYPES).map(([key, value]) => [
          key,
          value + 1
        ]));
        const combinedPermissions = Object.assign(Object.assign({}, this.granularPermissions), incrementedTransactionTypes);
        this.delegatablePermissions = new bytes_1.BytesLookup(combinedPermissions, constants_1.DELEGATABLE_PERMISSIONS_WIDTH);
      }
      /**
       * Associates each Field to a corresponding class that TypeScript can recognize.
       *
       * @param types a list of type objects with the same name as the fields defined.
       *              Defaults to xrpl.js's core type definitions.
       */
      associateTypes(types) {
        this.dataTypes = Object.assign({}, this.dataTypes, types);
        Object.values(this.field).forEach((field) => {
          field.associatedType = this.dataTypes[field.type.name];
        });
        this.field["TransactionType"].associatedType = this.transactionType;
        this.field["TransactionResult"].associatedType = this.transactionResult;
        this.field["LedgerEntryType"].associatedType = this.ledgerEntryType;
        if (this.field["PermissionValue"]) {
          this.field["PermissionValue"].associatedType = this.delegatablePermissions;
        }
      }
      getAssociatedTypes() {
        return this.dataTypes;
      }
    };
    exports.XrplDefinitionsBase = XrplDefinitionsBase;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/index.js
var require_enums = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TRANSACTION_TYPES = exports.TransactionType = exports.TransactionResult = exports.LedgerEntryType = exports.Type = exports.Field = exports.DEFAULT_DEFINITIONS = exports.XrplDefinitionsBase = exports.Bytes = void 0;
    var definitions_json_1 = __importDefault(require_definitions());
    var xrpl_definitions_base_1 = require_xrpl_definitions_base();
    Object.defineProperty(exports, "XrplDefinitionsBase", { enumerable: true, get: function() {
      return xrpl_definitions_base_1.XrplDefinitionsBase;
    } });
    Object.defineProperty(exports, "Bytes", { enumerable: true, get: function() {
      return xrpl_definitions_base_1.Bytes;
    } });
    var DEFAULT_DEFINITIONS = new xrpl_definitions_base_1.XrplDefinitionsBase(definitions_json_1.default, {});
    exports.DEFAULT_DEFINITIONS = DEFAULT_DEFINITIONS;
    var Type = DEFAULT_DEFINITIONS.type;
    exports.Type = Type;
    var LedgerEntryType = DEFAULT_DEFINITIONS.ledgerEntryType;
    exports.LedgerEntryType = LedgerEntryType;
    var TransactionType = DEFAULT_DEFINITIONS.transactionType;
    exports.TransactionType = TransactionType;
    var TransactionResult = DEFAULT_DEFINITIONS.transactionResult;
    exports.TransactionResult = TransactionResult;
    var Field2 = DEFAULT_DEFINITIONS.field;
    exports.Field = Field2;
    var TRANSACTION_TYPES = DEFAULT_DEFINITIONS.transactionNames;
    exports.TRANSACTION_TYPES = TRANSACTION_TYPES;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/utils.js
var require_utils4 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compare = exports.equal = exports.readInt64BE = exports.readInt32BE = exports.readUInt32BE = exports.readUInt16BE = exports.writeInt64BE = exports.writeInt32BE = exports.writeUInt32BE = exports.writeUInt16BE = exports.writeUInt8 = void 0;
    function writeUInt8(array, value, offset) {
      value = Number(value);
      array[offset] = value;
    }
    exports.writeUInt8 = writeUInt8;
    function writeUInt16BE(array, value, offset) {
      value = Number(value);
      array[offset] = value >>> 8;
      array[offset + 1] = value;
    }
    exports.writeUInt16BE = writeUInt16BE;
    function writeUInt32BE(array, value, offset) {
      array[offset] = value >>> 24 & 255;
      array[offset + 1] = value >>> 16 & 255;
      array[offset + 2] = value >>> 8 & 255;
      array[offset + 3] = value & 255;
    }
    exports.writeUInt32BE = writeUInt32BE;
    function writeInt32BE(array, value, offset) {
      new DataView(array.buffer, array.byteOffset, array.byteLength).setInt32(offset, value, false);
    }
    exports.writeInt32BE = writeInt32BE;
    function writeInt64BE(array, value, offset) {
      new DataView(array.buffer, array.byteOffset, array.byteLength).setBigInt64(offset, value, false);
    }
    exports.writeInt64BE = writeInt64BE;
    function readUInt16BE(array, offset) {
      return new DataView(array.buffer).getUint16(offset, false).toString(10);
    }
    exports.readUInt16BE = readUInt16BE;
    function readUInt32BE(array, offset) {
      return new DataView(array.buffer).getUint32(offset, false).toString(10);
    }
    exports.readUInt32BE = readUInt32BE;
    function readInt32BE(array, offset) {
      return new DataView(array.buffer, array.byteOffset, array.byteLength).getInt32(offset, false);
    }
    exports.readInt32BE = readInt32BE;
    function readInt64BE(array, offset) {
      return new DataView(array.buffer, array.byteOffset, array.byteLength).getBigInt64(offset, false);
    }
    exports.readInt64BE = readInt64BE;
    function equal(a, b) {
      const aUInt = a instanceof ArrayBuffer ? new Uint8Array(a, 0) : a;
      const bUInt = b instanceof ArrayBuffer ? new Uint8Array(b, 0) : b;
      if (aUInt.byteLength != bUInt.byteLength)
        return false;
      if (aligned32(aUInt) && aligned32(bUInt))
        return compare32(aUInt, bUInt) === 0;
      if (aligned16(aUInt) && aligned16(bUInt))
        return compare16(aUInt, bUInt) === 0;
      return compare8(aUInt, bUInt) === 0;
    }
    exports.equal = equal;
    function compare8(a, b) {
      const ua = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
      const ub = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
      return compare(ua, ub);
    }
    function compare16(a, b) {
      const ua = new Uint16Array(a.buffer, a.byteOffset, a.byteLength / 2);
      const ub = new Uint16Array(b.buffer, b.byteOffset, b.byteLength / 2);
      return compare(ua, ub);
    }
    function compare32(a, b) {
      const ua = new Uint32Array(a.buffer, a.byteOffset, a.byteLength / 4);
      const ub = new Uint32Array(b.buffer, b.byteOffset, b.byteLength / 4);
      return compare(ua, ub);
    }
    function compare(a, b) {
      if (a.byteLength !== b.byteLength) {
        throw new Error("Cannot compare arrays of different length");
      }
      for (let i = 0; i < a.length; i += 1) {
        if (a[i] > b[i])
          return 1;
        if (a[i] < b[i])
          return -1;
      }
      return 0;
    }
    exports.compare = compare;
    function aligned16(array) {
      return array.byteOffset % 2 === 0 && array.byteLength % 2 === 0;
    }
    function aligned32(array) {
      return array.byteOffset % 4 === 0 && array.byteLength % 4 === 0;
    }
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash.js
var require_hash = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash = void 0;
    var serialized_type_1 = require_serialized_type();
    var utils_1 = require_utils();
    var utils_2 = require_utils4();
    var Hash2 = class extends serialized_type_1.Comparable {
      constructor(bytes) {
        super(bytes);
        if (this.bytes.length !== this.constructor.width) {
          throw new Error(`Invalid Hash length ${this.bytes.byteLength}`);
        }
      }
      /**
       * Construct a Hash object from an existing Hash object or a hex-string
       *
       * @param value A hash object or hex-string of a hash
       */
      static from(value) {
        if (value instanceof this) {
          return value;
        }
        if (typeof value === "string") {
          if (!utils_1.HEX_REGEX.test(value)) {
            throw new Error(`Invalid hash string ${value}`);
          }
          return new this((0, utils_1.hexToBytes)(value));
        }
        throw new Error("Cannot construct Hash from given value");
      }
      /**
       * Read a Hash object from a BinaryParser
       *
       * @param parser BinaryParser to read the hash from
       * @param hint length of the bytes to read, optional
       */
      static fromParser(parser, hint) {
        return new this(parser.read(hint !== null && hint !== void 0 ? hint : this.width));
      }
      /**
       * Overloaded operator for comparing two hash objects
       *
       * @param other The Hash to compare this to
       */
      compareTo(other) {
        return (0, utils_2.compare)(this.bytes, this.constructor.from(other).bytes);
      }
      /**
       * @returns the hex-string representation of this Hash
       */
      toString() {
        return this.toHex();
      }
      /**
       * Returns four bits at the specified depth within a hash
       *
       * @param depth The depth of the four bits
       * @returns The number represented by the four bits
       */
      nibblet(depth) {
        const byteIx = depth > 0 ? depth / 2 | 0 : 0;
        let b = this.bytes[byteIx];
        if (depth % 2 === 0) {
          b = (b & 240) >>> 4;
        } else {
          b = b & 15;
        }
        return b;
      }
    };
    exports.Hash = Hash2;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash-160.js
var require_hash_160 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash-160.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash160 = void 0;
    var hash_1 = require_hash();
    var Hash160 = class _Hash160 extends hash_1.Hash {
      constructor(bytes) {
        if ((bytes === null || bytes === void 0 ? void 0 : bytes.byteLength) === 0) {
          bytes = _Hash160.ZERO_160.bytes;
        }
        super(bytes !== null && bytes !== void 0 ? bytes : _Hash160.ZERO_160.bytes);
      }
    };
    exports.Hash160 = Hash160;
    Hash160.width = 20;
    Hash160.ZERO_160 = new Hash160(new Uint8Array(Hash160.width));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/account-id.js
var require_account_id = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/account-id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AccountID = void 0;
    var ripple_address_codec_1 = require_dist();
    var hash_160_1 = require_hash_160();
    var utils_1 = require_utils();
    var HEX_REGEX = /^[A-F0-9]{40}$/;
    var AccountID = class _AccountID extends hash_160_1.Hash160 {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _AccountID.defaultAccountID.bytes);
      }
      /**
       * Defines how to construct an AccountID
       *
       * @param value either an existing AccountID, a hex-string, or a base58 r-Address
       * @returns an AccountID object
       */
      static from(value) {
        if (value instanceof _AccountID) {
          return value;
        }
        if (typeof value === "string") {
          if (value === "") {
            return new _AccountID();
          }
          return HEX_REGEX.test(value) ? new _AccountID((0, utils_1.hexToBytes)(value)) : this.fromBase58(value);
        }
        throw new Error("Cannot construct AccountID from value given");
      }
      /**
       * Defines how to build an AccountID from a base58 r-Address
       *
       * @param value a base58 r-Address
       * @returns an AccountID object
       */
      static fromBase58(value) {
        if ((0, ripple_address_codec_1.isValidXAddress)(value)) {
          const classic = (0, ripple_address_codec_1.xAddressToClassicAddress)(value);
          if (classic.tag !== false)
            throw new Error("Only allowed to have tag on Account or Destination");
          value = classic.classicAddress;
        }
        return new _AccountID(Uint8Array.from((0, ripple_address_codec_1.decodeAccountID)(value)));
      }
      /**
       * Overload of toJSON
       *
       * @returns the base58 string for this AccountID
       */
      toJSON() {
        return this.toBase58();
      }
      /**
       * Defines how to encode AccountID into a base58 address
       *
       * @returns the base58 string defined by this.bytes
       */
      toBase58() {
        return (0, ripple_address_codec_1.encodeAccountID)(this.bytes);
      }
    };
    exports.AccountID = AccountID;
    AccountID.defaultAccountID = new AccountID(new Uint8Array(20));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/serdes/binary-parser.js
var require_binary_parser = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/serdes/binary-parser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryParser = void 0;
    var enums_1 = require_enums();
    var utils_1 = require_utils();
    var BinaryParser = class {
      /**
       * Initialize bytes to a hex string
       *
       * @param hexBytes a hex string
       * @param definitions Rippled definitions used to parse the values of transaction types and such.
       *                          Can be customized for sidechains and amendments.
       */
      constructor(hexBytes, definitions = enums_1.DEFAULT_DEFINITIONS) {
        this.bytes = (0, utils_1.hexToBytes)(hexBytes);
        this.definitions = definitions;
      }
      /**
       * Peek the first byte of the BinaryParser
       *
       * @returns The first byte of the BinaryParser
       */
      peek() {
        if (this.bytes.byteLength === 0) {
          throw new Error();
        }
        return this.bytes[0];
      }
      /**
       * Consume the first n bytes of the BinaryParser
       *
       * @param n the number of bytes to skip
       */
      skip(n) {
        if (n < 0) {
          throw new Error(`skip: negative length ${n}`);
        }
        if (n > this.bytes.byteLength) {
          throw new Error(`skip: requested ${n} bytes but only ${this.bytes.byteLength} available`);
        }
        this.bytes = this.bytes.slice(n);
      }
      /**
       * read the first n bytes from the BinaryParser
       *
       * @param n The number of bytes to read
       * @return The bytes
       */
      read(n) {
        if (n < 0) {
          throw new Error(`read: negative length ${n}`);
        }
        if (n > this.bytes.byteLength) {
          throw new Error(`read: requested ${n} bytes but only ${this.bytes.byteLength} available`);
        }
        const slice2 = this.bytes.slice(0, n);
        this.skip(n);
        return slice2;
      }
      /**
       * Read an integer of given size
       *
       * @param n The number of bytes to read
       * @return The number represented by those bytes
       */
      readUIntN(n) {
        if (0 >= n || n > 4) {
          throw new Error("invalid n");
        }
        return this.read(n).reduce((a, b) => a << 8 | b) >>> 0;
      }
      readUInt8() {
        return this.readUIntN(1);
      }
      readUInt16() {
        return this.readUIntN(2);
      }
      readUInt32() {
        return this.readUIntN(4);
      }
      size() {
        return this.bytes.byteLength;
      }
      end(customEnd) {
        const length = this.bytes.byteLength;
        return length === 0 || customEnd !== void 0 && length <= customEnd;
      }
      /**
       * Reads variable length encoded bytes
       *
       * @return The variable length bytes
       */
      readVariableLength() {
        return this.read(this.readVariableLengthLength());
      }
      /**
       * Reads the length of the variable length encoded bytes
       *
       * @return The length of the variable length encoded bytes
       */
      readVariableLengthLength() {
        const b1 = this.readUInt8();
        if (b1 <= 192) {
          return b1;
        } else if (b1 <= 240) {
          const b2 = this.readUInt8();
          return 193 + (b1 - 193) * 256 + b2;
        } else if (b1 <= 254) {
          const b2 = this.readUInt8();
          const b3 = this.readUInt8();
          return 12481 + (b1 - 241) * 65536 + b2 * 256 + b3;
        }
        throw new Error("Invalid variable length indicator");
      }
      /**
       * Reads the field ordinal from the BinaryParser
       *
       * @return Field ordinal
       */
      readFieldOrdinal() {
        let type = this.readUInt8();
        let nth = type & 15;
        type >>= 4;
        if (type === 0) {
          type = this.readUInt8();
          if (type === 0 || type < 16) {
            throw new Error(`Cannot read FieldOrdinal, type_code ${type} out of range`);
          }
        }
        if (nth === 0) {
          nth = this.readUInt8();
          if (nth === 0 || nth < 16) {
            throw new Error(`Cannot read FieldOrdinal, field_code ${nth} out of range`);
          }
        }
        return type << 16 | nth;
      }
      /**
       * Read the field from the BinaryParser
       *
       * @return The field represented by the bytes at the head of the BinaryParser
       */
      readField() {
        return this.definitions.field.fromString(this.readFieldOrdinal().toString());
      }
      /**
       * Read a given type from the BinaryParser
       *
       * @param type The type that you want to read from the BinaryParser
       * @return The instance of that type read from the BinaryParser
       */
      readType(type) {
        return type.fromParser(this);
      }
      /**
       * Get the type associated with a given field
       *
       * @param field The field that you wan to get the type of
       * @return The type associated with the given field
       */
      typeForField(field) {
        return field.associatedType;
      }
      /**
       * Read value of the type specified by field from the BinaryParser
       *
       * @param field The field that you want to get the associated value for
       * @return The value associated with the given field
       */
      readFieldValue(field) {
        const type = this.typeForField(field);
        if (!type) {
          throw new Error(`unsupported: (${field.name}, ${field.type.name})`);
        }
        const sizeHint = field.isVariableLengthEncoded ? this.readVariableLengthLength() : void 0;
        const value = type.fromParser(this, sizeHint);
        if (value === void 0) {
          throw new Error(`fromParser for (${field.name}, ${field.type.name}) -> undefined `);
        }
        return value;
      }
      /**
       * Get the next field and value from the BinaryParser
       *
       * @return The field and value
       */
      readFieldAndValue() {
        const field = this.readField();
        return [field, this.readFieldValue(field)];
      }
    };
    exports.BinaryParser = BinaryParser;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/currency.js
var require_currency = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/currency.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Currency = void 0;
    var hash_160_1 = require_hash_160();
    var utils_1 = require_utils();
    var XRP_HEX_REGEX = /^0{40}$/;
    var ISO_REGEX = /^[A-Z0-9a-z?!@#$%^&*(){}[\]|]{3}$/;
    var HEX_REGEX = /^[A-F0-9]{40}$/;
    var STANDARD_FORMAT_HEX_REGEX = /^0{24}[\x00-\x7F]{6}0{10}$/;
    function isoToBytes(iso) {
      const bytes = new Uint8Array(20);
      if (iso !== "XRP") {
        const isoBytes = iso.split("").map((c) => c.charCodeAt(0));
        bytes.set(isoBytes, 12);
      }
      return bytes;
    }
    function isIsoCode(iso) {
      return ISO_REGEX.test(iso);
    }
    function isoCodeFromHex(code) {
      const iso = (0, utils_1.hexToString)((0, utils_1.bytesToHex)(code));
      if (iso === "XRP") {
        return null;
      }
      if (isIsoCode(iso)) {
        return iso;
      }
      return null;
    }
    function isHex2(hex2) {
      return HEX_REGEX.test(hex2);
    }
    function isStringRepresentation(input) {
      return input.length === 3 || isHex2(input);
    }
    function isBytesArray(bytes) {
      return bytes.byteLength === 20;
    }
    function isValidRepresentation(input) {
      return input instanceof Uint8Array ? isBytesArray(input) : isStringRepresentation(input);
    }
    function bytesFromRepresentation(input) {
      if (!isValidRepresentation(input)) {
        throw new Error(`Unsupported Currency representation: ${input}`);
      }
      return input.length === 3 ? isoToBytes(input) : (0, utils_1.hexToBytes)(input);
    }
    var Currency = class _Currency extends hash_160_1.Hash160 {
      constructor(byteBuf) {
        super(byteBuf !== null && byteBuf !== void 0 ? byteBuf : _Currency.XRP.bytes);
        const hex2 = (0, utils_1.bytesToHex)(this.bytes);
        if (XRP_HEX_REGEX.test(hex2)) {
          this._iso = "XRP";
        } else if (STANDARD_FORMAT_HEX_REGEX.test(hex2)) {
          this._iso = isoCodeFromHex(this.bytes.slice(12, 15));
        } else {
          this._iso = null;
        }
      }
      /**
       * Return the ISO code of this currency
       *
       * @returns ISO code if it exists, else null
       */
      iso() {
        return this._iso;
      }
      /**
       * Constructs a Currency object
       *
       * @param val Currency object or a string representation of a currency
       */
      static from(value) {
        if (value instanceof _Currency) {
          return value;
        }
        if (typeof value === "string") {
          return new _Currency(bytesFromRepresentation(value));
        }
        throw new Error("Cannot construct Currency from value given");
      }
      /**
       * Gets the JSON representation of a currency
       *
       * @returns JSON representation
       */
      toJSON() {
        const iso = this.iso();
        if (iso !== null) {
          return iso;
        }
        return (0, utils_1.bytesToHex)(this.bytes);
      }
    };
    exports.Currency = Currency;
    Currency.XRP = new Currency(new Uint8Array(20));
  }
});

// ../../../node_modules/.pnpm/bignumber.js@10.0.2/node_modules/bignumber.js/dist/bignumber.cjs
var require_bignumber = __commonJS({
  "../../../node_modules/.pnpm/bignumber.js@10.0.2/node_modules/bignumber.js/dist/bignumber.cjs"(exports, module) {
    var BigNumber = clone();
    var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
    var mathceil = Math.ceil;
    var mathfloor = Math.floor;
    var bignumberError = "[BigNumber Error] ";
    var BASE = 1e14;
    var LOG_BASE = 14;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];
    var SQRT_BASE = 1e7;
    var MAX = 1e9;
    function clone(configObject) {
      var div, convertBase, parseUnusualNumeric, P = BigNumber2.prototype = { constructor: BigNumber2, toString: null, valueOf: null }, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
        prefix: "",
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ",",
        decimalSeparator: ".",
        fractionGroupSize: 0,
        fractionGroupSeparator: "\xA0",
        // non-breaking space
        suffix: ""
      }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
      function BigNumber2(v, b) {
        var alphabet2, c, caseChanged, e, i, len, str, t, x = this;
        if (!(x instanceof BigNumber2)) return new BigNumber2(v, b);
        t = typeof v;
        if (b == null) {
          if (isBigNumber(v)) {
            x.s = v.s;
            if (!v.c || v.e > MAX_EXP) {
              x.c = x.e = null;
            } else if (v.e < MIN_EXP) {
              x.c = [x.e = 0];
            } else {
              x.e = v.e;
              x.c = v.c.slice();
            }
            return;
          }
          if (t == "number") {
            if (v * 0 != 0) {
              x.s = isNaN(v) ? null : v < 0 ? -1 : 1;
              x.c = x.e = null;
              return;
            }
            x.s = 1 / v < 0 ? (v = -v, -1) : 1;
            if (v === ~~v) {
              for (e = 0, i = v; i >= 10; i /= 10, e++) ;
              if (e > MAX_EXP) {
                x.c = x.e = null;
              } else {
                x.e = e;
                x.c = [v];
              }
              return;
            }
            str = String(v);
          } else {
            if (t == "string") {
              str = v;
              if (!isNumeric.test(str)) {
                return parseUnusualNumeric(x, str);
              }
            } else if (t == "bigint") {
              str = String(v);
            } else {
              throw Error(bignumberError + "Invalid argument: " + v);
            }
            x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
          }
          if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
          if ((i = str.search(/e/i)) > 0) {
            if (e < 0) e = i;
            e += +str.slice(i + 1);
            str = str.substring(0, i);
          } else if (e < 0) {
            e = str.length;
          }
        } else {
          if (t != "string") {
            throw Error(bignumberError + "String expected: " + v);
          }
          intCheck(b, 2, ALPHABET.length, "Base");
          str = v;
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
          alphabet2 = ALPHABET.slice(0, b);
          e = i = 0;
          for (len = str.length; i < len; i++) {
            if (alphabet2.indexOf(c = str.charAt(i)) < 0) {
              if (c == ".") {
                if (i > e) {
                  e = len;
                  continue;
                }
              } else if (!caseChanged) {
                if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
                  caseChanged = true;
                  i = -1;
                  e = 0;
                  continue;
                }
              }
              return parseUnusualNumeric(x, v, b);
            }
          }
          str = convertBase(str, b, 10, x.s);
          if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
          else e = str.length;
        }
        for (i = 0; str.charCodeAt(i) === 48; i++) ;
        for (len = str.length; str.charCodeAt(--len) === 48; ) ;
        if (str = str.slice(i, ++len)) {
          len -= i;
          e = e - i - 1;
          if (e > MAX_EXP) {
            x.c = x.e = null;
          } else if (e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = e;
            x.c = [];
            i = (e + 1) % LOG_BASE;
            if (e < 0) i += LOG_BASE;
            if (i < len) {
              if (i) x.c.push(+str.slice(0, i));
              for (len -= LOG_BASE; i < len; ) {
                x.c.push(+str.slice(i, i += LOG_BASE));
              }
              i = LOG_BASE - (str = str.slice(i)).length;
            } else {
              i -= len;
            }
            for (; i--; str += "0") ;
            x.c.push(+str);
          }
        } else {
          x.c = [x.e = 0];
        }
      }
      BigNumber2.clone = clone;
      BigNumber2.ROUND_UP = 0;
      BigNumber2.ROUND_DOWN = 1;
      BigNumber2.ROUND_CEIL = 2;
      BigNumber2.ROUND_FLOOR = 3;
      BigNumber2.ROUND_HALF_UP = 4;
      BigNumber2.ROUND_HALF_DOWN = 5;
      BigNumber2.ROUND_HALF_EVEN = 6;
      BigNumber2.ROUND_HALF_CEIL = 7;
      BigNumber2.ROUND_HALF_FLOOR = 8;
      BigNumber2.EUCLID = 9;
      BigNumber2.config = BigNumber2.set = function(obj) {
        var p, v;
        if (obj != null) {
          if (typeof obj == "object") {
            if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
              v = obj[p];
              intCheck(v, 0, MAX, p);
              DECIMAL_PLACES = v;
            }
            if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
              v = obj[p];
              intCheck(v, 0, 8, p);
              ROUNDING_MODE = v;
            }
            if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
              v = obj[p];
              if (v && v.pop) {
                intCheck(v[0], -MAX, 0, p);
                intCheck(v[1], 0, MAX, p);
                TO_EXP_NEG = v[0];
                TO_EXP_POS = v[1];
              } else {
                intCheck(v, -MAX, MAX, p);
                TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
              }
            }
            if (obj.hasOwnProperty(p = "RANGE")) {
              v = obj[p];
              if (v && v.pop) {
                intCheck(v[0], -MAX, -1, p);
                intCheck(v[1], 1, MAX, p);
                MIN_EXP = v[0];
                MAX_EXP = v[1];
              } else {
                intCheck(v, -MAX, MAX, p);
                if (v) {
                  MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                } else {
                  throw Error(bignumberError + p + " cannot be zero: " + v);
                }
              }
            }
            if (obj.hasOwnProperty(p = "CRYPTO")) {
              v = obj[p];
              if (v === !!v) {
                if (v) {
                  if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                    CRYPTO = v;
                  } else {
                    CRYPTO = !v;
                    throw Error(bignumberError + "crypto unavailable");
                  }
                } else {
                  CRYPTO = v;
                }
              } else {
                throw Error(bignumberError + p + " not true or false: " + v);
              }
            }
            if (obj.hasOwnProperty(p = "MODULO_MODE")) {
              v = obj[p];
              intCheck(v, 0, 9, p);
              MODULO_MODE = v;
            }
            if (obj.hasOwnProperty(p = "POW_PRECISION")) {
              v = obj[p];
              intCheck(v, 0, MAX, p);
              POW_PRECISION = v;
            }
            if (obj.hasOwnProperty(p = "FORMAT")) {
              v = obj[p];
              if (typeof v == "object") FORMAT = v;
              else throw Error(bignumberError + p + " not an object: " + v);
            }
            if (obj.hasOwnProperty(p = "ALPHABET")) {
              v = obj[p];
              if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                ALPHABET = v;
              } else {
                throw Error(bignumberError + p + " invalid: " + v);
              }
            }
          } else {
            throw Error(bignumberError + "Object expected: " + obj);
          }
        }
        return {
          DECIMAL_PLACES,
          ROUNDING_MODE,
          EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
          RANGE: [MIN_EXP, MAX_EXP],
          CRYPTO,
          MODULO_MODE,
          POW_PRECISION,
          FORMAT,
          ALPHABET
        };
      };
      BigNumber2.isBigNumber = function(v) {
        if (!isBigNumber(v)) return false;
        var i, n, c = v.c, e = v.e, s = v.s;
        if ({}.toString.call(c) != "[object Array]") {
          return c === null && e === null && (s === null || s === 1 || s === -1);
        }
        if (s !== 1 && s !== -1 || e < -MAX || e > MAX || e !== mathfloor(e)) {
          return false;
        }
        if (c[0] === 0) {
          return e === 0 && c.length === 1;
        }
        i = (e + 1) % LOG_BASE;
        if (i < 1) i += LOG_BASE;
        if (String(c[0]).length !== i) {
          return false;
        }
        for (i = 0; i < c.length; i++) {
          n = c[i];
          if (n < 0 || n >= BASE || n !== mathfloor(n)) return false;
        }
        return n !== 0;
      };
      BigNumber2.maximum = BigNumber2.max = function() {
        return maxOrMin(arguments, -1);
      };
      BigNumber2.minimum = BigNumber2.min = function() {
        return maxOrMin(arguments, 1);
      };
      BigNumber2.random = (function() {
        var pow2_53 = 9007199254740992;
        var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
          return mathfloor(Math.random() * pow2_53);
        } : function() {
          return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
        };
        return function(dp) {
          var a, b, e, k, v, i = 0, c = [], rand = new BigNumber2(ONE);
          if (dp == null) dp = DECIMAL_PLACES;
          else intCheck(dp, 0, MAX);
          k = mathceil(dp / LOG_BASE);
          if (CRYPTO) {
            if (crypto.getRandomValues) {
              a = crypto.getRandomValues(new Uint32Array(k *= 2));
              for (; i < k; ) {
                v = a[i] * 131072 + (a[i + 1] >>> 11);
                if (v >= 9e15) {
                  b = crypto.getRandomValues(new Uint32Array(2));
                  a[i] = b[0];
                  a[i + 1] = b[1];
                } else {
                  c.push(v % 1e14);
                  i += 2;
                }
              }
              i = k / 2;
            } else if (crypto.randomBytes) {
              a = crypto.randomBytes(k *= 7);
              for (; i < k; ) {
                v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
                if (v >= 9e15) {
                  crypto.randomBytes(7).copy(a, i);
                } else {
                  c.push(v % 1e14);
                  i += 7;
                }
              }
              i = k / 7;
            } else {
              CRYPTO = false;
              throw Error(bignumberError + "crypto unavailable");
            }
          }
          if (!CRYPTO) {
            for (; i < k; ) {
              v = random53bitInt();
              if (v < 9e15) c[i++] = v % 1e14;
            }
          }
          k = c[--i];
          dp %= LOG_BASE;
          if (k && dp) {
            v = POWS_TEN[LOG_BASE - dp];
            c[i] = mathfloor(k / v) * v;
          }
          for (; c[i] === 0; c.pop(), i--) ;
          if (i < 0) {
            c = [e = 0];
          } else {
            for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE) ;
            for (i = 1, v = c[0]; v >= 10; v /= 10, i++) ;
            if (i < LOG_BASE) e -= LOG_BASE - i;
          }
          rand.e = e;
          rand.c = c;
          return rand;
        };
      })();
      BigNumber2.sum = function() {
        var i = 1, args = arguments, sum = new BigNumber2(args[0]);
        for (; i < args.length; ) sum = sum.plus(args[i++]);
        return sum;
      };
      convertBase = /* @__PURE__ */ (function() {
        var decimal = "0123456789";
        function toBaseOut(str, baseIn, baseOut, alphabet2) {
          var j, arr = [0], arrL, i = 0, len = str.length;
          for (; i < len; ) {
            for (arrL = arr.length; arrL--; arr[arrL] *= baseIn) ;
            arr[0] += alphabet2.indexOf(str.charAt(i++));
            for (j = 0; j < arr.length; j++) {
              if (arr[j] > baseOut - 1) {
                if (arr[j + 1] == null) arr[j + 1] = 0;
                arr[j + 1] += arr[j] / baseOut | 0;
                arr[j] %= baseOut;
              }
            }
          }
          return arr.reverse();
        }
        return function(str, baseIn, baseOut, sign, callerIsToString) {
          var alphabet2, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
          if (i >= 0) {
            k = POW_PRECISION;
            POW_PRECISION = 0;
            str = str.replace(".", "");
            y = new BigNumber2(baseIn);
            x = y.pow(str.length - i);
            POW_PRECISION = k;
            y.c = toBaseOut(
              toFixedPoint(coeffToString(x.c), x.e, "0"),
              10,
              baseOut,
              decimal
            );
            y.e = y.c.length;
          }
          xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet2 = ALPHABET, decimal) : (alphabet2 = decimal, ALPHABET));
          e = k = xc.length;
          for (; xc[--k] == 0; xc.pop()) ;
          if (!xc[0]) return alphabet2.charAt(0);
          if (i < 0) {
            --e;
          } else {
            x.c = xc;
            x.e = e;
            x.s = sign;
            x = div(x, y, dp, rm, baseOut);
            xc = x.c;
            r = x.r;
            e = x.e;
          }
          d = e + dp + 1;
          i = xc[d];
          k = baseOut / 2;
          r = r || d < 0 || xc[d + 1] != null;
          r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
          if (d < 1 || !xc[0]) {
            str = r ? toFixedPoint(alphabet2.charAt(1), -dp, alphabet2.charAt(0)) : alphabet2.charAt(0);
          } else {
            xc.length = d;
            if (r) {
              for (--baseOut; ++xc[--d] > baseOut; ) {
                xc[d] = 0;
                if (!d) {
                  ++e;
                  xc = [1].concat(xc);
                }
              }
            }
            for (k = xc.length; !xc[--k]; ) ;
            for (i = 0, str = ""; i <= k; str += alphabet2.charAt(xc[i++])) ;
            str = toFixedPoint(str, e, alphabet2.charAt(0));
          }
          return str;
        };
      })();
      div = /* @__PURE__ */ (function() {
        function multiply(x, k, base) {
          var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
          for (x = x.slice(); i--; ) {
            xlo = x[i] % SQRT_BASE;
            xhi = x[i] / SQRT_BASE | 0;
            m = khi * xlo + xhi * klo;
            temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
            carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
            x[i] = temp % base;
          }
          if (carry) x = [carry].concat(x);
          return x;
        }
        function compare2(a, b, aL, bL) {
          var i, cmp;
          if (aL != bL) {
            cmp = aL > bL ? 1 : -1;
          } else {
            for (i = cmp = 0; i < aL; i++) {
              if (a[i] != b[i]) {
                cmp = a[i] > b[i] ? 1 : -1;
                break;
              }
            }
          }
          return cmp;
        }
        function subtract(a, b, aL, base) {
          var i = 0;
          for (; aL--; ) {
            a[aL] -= i;
            i = a[aL] < b[aL] ? 1 : 0;
            a[aL] = i * base + a[aL] - b[aL];
          }
          for (; !a[0] && a.length > 1; a.splice(0, 1)) ;
        }
        return function(x, y, dp, rm, base) {
          var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
          if (!xc || !xc[0] || !yc || !yc[0]) {
            return new BigNumber2(
              // Return NaN if either NaN, or both Infinity or 0.
              !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : (
                // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                xc && xc[0] == 0 || !yc ? s * 0 : s / 0
              )
            );
          }
          q = new BigNumber2(s);
          qc = q.c = [];
          e = x.e - y.e;
          s = dp + e + 1;
          if (!base) {
            base = BASE;
            e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
            s = s / LOG_BASE | 0;
          }
          for (i = 0; yc[i] == (xc[i] || 0); i++) ;
          if (yc[i] > (xc[i] || 0)) e--;
          if (s < 0) {
            qc.push(1);
            more = true;
          } else {
            xL = xc.length;
            yL = yc.length;
            i = 0;
            s += 2;
            n = mathfloor(base / (yc[0] + 1));
            if (n > 1) {
              yc = multiply(yc, n, base);
              xc = multiply(xc, n, base);
              yL = yc.length;
              xL = xc.length;
            }
            xi = yL;
            rem = xc.slice(0, yL);
            remL = rem.length;
            for (; remL < yL; rem[remL++] = 0) ;
            yz = yc.slice();
            yz = [0].concat(yz);
            yc0 = yc[0];
            if (yc[1] >= base / 2) yc0++;
            do {
              n = 0;
              cmp = compare2(yc, rem, yL, remL);
              if (cmp < 0) {
                rem0 = rem[0];
                if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
                n = mathfloor(rem0 / yc0);
                if (n > 1) {
                  if (n >= base) n = base - 1;
                  prod = multiply(yc, n, base);
                  prodL = prod.length;
                  remL = rem.length;
                  while (compare2(prod, rem, prodL, remL) == 1) {
                    n--;
                    subtract(prod, yL < prodL ? yz : yc, prodL, base);
                    prodL = prod.length;
                    cmp = 1;
                  }
                } else {
                  if (n == 0) {
                    cmp = n = 1;
                  }
                  prod = yc.slice();
                  prodL = prod.length;
                }
                if (prodL < remL) prod = [0].concat(prod);
                subtract(rem, prod, remL, base);
                remL = rem.length;
                if (cmp == -1) {
                  while (compare2(yc, rem, yL, remL) < 1) {
                    n++;
                    subtract(rem, yL < remL ? yz : yc, remL, base);
                    remL = rem.length;
                  }
                }
              } else if (cmp === 0) {
                n++;
                rem = [0];
              }
              qc[i++] = n;
              if (rem[0]) {
                rem[remL++] = xc[xi] || 0;
              } else {
                rem = [xc[xi]];
                remL = 1;
              }
            } while ((xi++ < xL || rem[0] != null) && s--);
            more = rem[0] != null;
            if (!qc[0]) qc.splice(0, 1);
          }
          if (base == BASE) {
            for (i = 1, s = qc[0]; s >= 10; s /= 10, i++) ;
            round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
          } else {
            q.e = e;
            q.r = +more;
          }
          return q;
        };
      })();
      function format(n, i, rm, id) {
        var c0, e, ne, len, str;
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);
        if (!n.c) return n.toString();
        c0 = n.c[0];
        ne = n.e;
        if (i == null) {
          str = coeffToString(n.c);
          str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
        } else {
          n = round(new BigNumber2(n), i, rm);
          e = n.e;
          str = coeffToString(n.c);
          len = str.length;
          if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
            for (; len < i; str += "0", len++) ;
            str = toExponential(str, e);
          } else {
            i -= ne + (id === 2 && e > ne);
            str = toFixedPoint(str, e, "0");
            if (e + 1 > len) {
              if (--i > 0) for (str += "."; i--; str += "0") ;
            } else {
              i += e - len;
              if (i > 0) {
                if (e + 1 == len) str += ".";
                for (; i--; str += "0") ;
              }
            }
          }
        }
        return n.s < 0 && c0 ? "-" + str : str;
      }
      function isBigNumber(v) {
        return v instanceof BigNumber2 || !!v && v._isBigNumber === true;
      }
      function maxOrMin(args, n) {
        var k, y, i = 1, x = new BigNumber2(args[0]);
        for (; i < args.length; i++) {
          y = new BigNumber2(args[i]);
          if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
            x = y;
          }
        }
        return x;
      }
      function normalise(n, c, e) {
        var i = 1, j = c.length;
        for (; !c[--j]; c.pop()) ;
        for (j = c[0]; j >= 10; j /= 10, i++) ;
        if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
          n.c = n.e = null;
        } else if (e < MIN_EXP) {
          n.c = [n.e = 0];
        } else {
          n.e = e;
          n.c = c;
        }
        return n;
      }
      parseUnusualNumeric = /* @__PURE__ */ (function() {
        var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
        return function(x, str, b) {
          var base, s = str.replace(whitespaceOrPlus, "");
          if (isInfinityOrNaN.test(s)) {
            x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
            x.c = x.e = null;
            return;
          }
          s = s.replace(basePrefix, function(m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
            return !b || b == base ? p1 : m;
          });
          if (b) {
            base = b;
            s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
          }
          if (str != s) return new BigNumber2(s, base);
          throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
        };
      })();
      function round(x, sd, rm, r) {
        var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
        if (xc) {
          out: {
            for (d = 1, k = xc[0]; k >= 10; k /= 10, d++) ;
            i = sd - d;
            if (i < 0) {
              i += LOG_BASE;
              j = sd;
              n = xc[ni = 0];
              rd = mathfloor(n / pows10[d - j - 1] % 10);
            } else {
              ni = mathceil((i + 1) / LOG_BASE);
              if (ni >= xc.length) {
                if (r) {
                  for (; xc.length <= ni; xc.push(0)) ;
                  n = rd = 0;
                  d = 1;
                  i %= LOG_BASE;
                  j = i - LOG_BASE + 1;
                } else {
                  break out;
                }
              } else {
                n = k = xc[ni];
                for (d = 1; k >= 10; k /= 10, d++) ;
                i %= LOG_BASE;
                j = i - LOG_BASE + d;
                rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
              }
            }
            r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
            // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
            // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
            xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
            r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
            (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
            if (sd < 1 || !xc[0]) {
              xc.length = 0;
              if (r) {
                sd -= x.e + 1;
                xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                x.e = -sd || 0;
              } else {
                xc[0] = x.e = 0;
              }
              return x;
            }
            if (i == 0) {
              xc.length = ni;
              k = 1;
              ni--;
            } else {
              xc.length = ni + 1;
              k = pows10[LOG_BASE - i];
              xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
            }
            if (r) {
              for (; ; ) {
                if (ni == 0) {
                  for (i = 1, j = xc[0]; j >= 10; j /= 10, i++) ;
                  j = xc[0] += k;
                  for (k = 1; j >= 10; j /= 10, k++) ;
                  if (i != k) {
                    x.e++;
                    if (xc[0] == BASE) xc[0] = 1;
                  }
                  break;
                } else {
                  xc[ni] += k;
                  if (xc[ni] != BASE) break;
                  xc[ni--] = 0;
                  k = 1;
                }
              }
            }
            for (i = xc.length; xc[--i] === 0; xc.pop()) ;
          }
          if (x.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (x.e < MIN_EXP) {
            x.c = [x.e = 0];
          }
        }
        return x;
      }
      function valueOf(n) {
        var str, e = n.e;
        if (e === null) return n.toString();
        str = coeffToString(n.c);
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
        return n.s < 0 ? "-" + str : str;
      }
      P.absoluteValue = P.abs = function() {
        var x = new BigNumber2(this);
        if (x.s < 0) x.s = 1;
        return x;
      };
      P.comparedTo = function(y, b) {
        return compare(this, new BigNumber2(y, b));
      };
      P.decimalPlaces = P.dp = function(dp, rm) {
        var c, n, v, x = this;
        if (dp != null) {
          intCheck(dp, 0, MAX);
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);
          return round(new BigNumber2(x), dp + x.e + 1, rm);
        }
        if (!(c = x.c)) return null;
        n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
        if (v = c[v]) for (; v % 10 == 0; v /= 10, n--) ;
        if (n < 0) n = 0;
        return n;
      };
      P.dividedBy = P.div = function(y, b) {
        return div(this, new BigNumber2(y, b), DECIMAL_PLACES, ROUNDING_MODE);
      };
      P.dividedToIntegerBy = P.idiv = function(y, b) {
        return div(this, new BigNumber2(y, b), 0, 1);
      };
      P.exponentiatedBy = P.pow = function(n, m) {
        var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
        n = new BigNumber2(n);
        if (n.c && !n.isInteger()) {
          throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
        }
        if (m != null) m = new BigNumber2(m);
        nIsBig = n.e > 14;
        if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
          y = new BigNumber2(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
          return m ? y.mod(m) : y;
        }
        nIsNeg = n.s < 0;
        if (m) {
          if (m.c ? !m.c[0] : !m.s) return new BigNumber2(NaN);
          isModExp = !nIsNeg && x.isInteger() && m.isInteger();
          if (isModExp) x = x.mod(m);
        } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
          k = x.s < 0 && isOdd(n) ? -0 : 0;
          if (x.e > -1) k = 1 / k;
          return new BigNumber2(nIsNeg ? 1 / k : k);
        } else if (POW_PRECISION) {
          k = mathceil(POW_PRECISION / LOG_BASE + 2);
        }
        if (nIsBig) {
          half = new BigNumber2(0.5);
          if (nIsNeg) n.s = 1;
          nIsOdd = isOdd(n);
        } else {
          i = Math.abs(+valueOf(n));
          nIsOdd = i % 2;
        }
        y = new BigNumber2(ONE);
        for (; ; ) {
          if (nIsOdd) {
            y = y.times(x);
            if (!y.c) break;
            if (k) {
              if (y.c.length > k) y.c.length = k;
            } else if (isModExp) {
              y = y.mod(m);
            }
          }
          if (i) {
            i = mathfloor(i / 2);
            if (i === 0) break;
            nIsOdd = i % 2;
          } else {
            n = n.times(half);
            round(n, n.e + 1, 1);
            if (n.e > 14) {
              nIsOdd = isOdd(n);
            } else {
              i = +valueOf(n);
              if (i === 0) break;
              nIsOdd = i % 2;
            }
          }
          x = x.times(x);
          if (k) {
            if (x.c && x.c.length > k) x.c.length = k;
          } else if (isModExp) {
            x = x.mod(m);
          }
        }
        if (isModExp) return y;
        if (nIsNeg) y = ONE.div(y);
        return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
      };
      P.integerValue = function(rm) {
        var n = new BigNumber2(this);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);
        return round(n, n.e + 1, rm);
      };
      P.isEqualTo = P.eq = function(y, b) {
        return compare(this, new BigNumber2(y, b)) === 0;
      };
      P.isFinite = function() {
        return !!this.c;
      };
      P.isGreaterThan = P.gt = function(y, b) {
        return compare(this, new BigNumber2(y, b)) > 0;
      };
      P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
        return (b = compare(this, new BigNumber2(y, b))) === 1 || b === 0;
      };
      P.isInteger = function() {
        return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
      };
      P.isLessThan = P.lt = function(y, b) {
        return compare(this, new BigNumber2(y, b)) < 0;
      };
      P.isLessThanOrEqualTo = P.lte = function(y, b) {
        return (b = compare(this, new BigNumber2(y, b))) === -1 || b === 0;
      };
      P.isNaN = function() {
        return !this.s;
      };
      P.isNegative = function() {
        return this.s < 0;
      };
      P.isPositive = function() {
        return this.s > 0;
      };
      P.isZero = function() {
        return !!this.c && this.c[0] == 0;
      };
      P.minus = function(y, b) {
        var i, j, t, xLTy, x = this, a = x.s;
        y = new BigNumber2(y, b);
        b = y.s;
        if (!a || !b) return new BigNumber2(NaN);
        if (a != b) {
          y.s = -b;
          return x.plus(y);
        }
        var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
        if (!xe || !ye) {
          if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber2(yc ? x : NaN);
          if (!xc[0] || !yc[0]) {
            return yc[0] ? (y.s = -b, y) : new BigNumber2(xc[0] ? x : (
              // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
              ROUNDING_MODE == 3 ? -0 : 0
            ));
          }
        }
        xe = bitFloor(xe);
        ye = bitFloor(ye);
        xc = xc.slice();
        if (a = xe - ye) {
          if (xLTy = a < 0) {
            a = -a;
            t = xc;
          } else {
            ye = xe;
            t = yc;
          }
          t.reverse();
          for (b = a; b--; t.push(0)) ;
          t.reverse();
        } else {
          j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
          for (a = b = 0; b < j; b++) {
            if (xc[b] != yc[b]) {
              xLTy = xc[b] < yc[b];
              break;
            }
          }
        }
        if (xLTy) {
          t = xc;
          xc = yc;
          yc = t;
          y.s = -y.s;
        }
        b = (j = yc.length) - (i = xc.length);
        if (b > 0) for (; b--; xc[i++] = 0) ;
        b = BASE - 1;
        for (; j > a; ) {
          if (xc[--j] < yc[j]) {
            for (i = j; i && !xc[--i]; xc[i] = b) ;
            --xc[i];
            xc[j] += BASE;
          }
          xc[j] -= yc[j];
        }
        for (; xc[0] == 0; xc.splice(0, 1), --ye) ;
        if (!xc[0]) {
          y.s = ROUNDING_MODE == 3 ? -1 : 1;
          y.c = [y.e = 0];
          return y;
        }
        return normalise(y, xc, ye);
      };
      P.modulo = P.mod = function(y, b) {
        var q, s, x = this;
        y = new BigNumber2(y, b);
        if (!x.c || !y.s || y.c && !y.c[0]) {
          return new BigNumber2(NaN);
        } else if (!y.c || x.c && !x.c[0]) {
          return new BigNumber2(x);
        }
        if (MODULO_MODE == 9) {
          s = y.s;
          y.s = 1;
          q = div(x, y, 0, 3);
          y.s = s;
          q.s *= s;
        } else {
          q = div(x, y, 0, MODULO_MODE);
        }
        y = x.minus(q.times(y));
        if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
        return y;
      };
      P.multipliedBy = P.times = function(y, b) {
        var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber2(y, b)).c;
        if (!xc || !yc || !xc[0] || !yc[0]) {
          if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
            y.c = y.e = y.s = null;
          } else {
            y.s *= x.s;
            if (!xc || !yc) {
              y.c = y.e = null;
            } else {
              y.c = [0];
              y.e = 0;
            }
          }
          return y;
        }
        e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
        y.s *= x.s;
        xcL = xc.length;
        ycL = yc.length;
        if (xcL < ycL) {
          zc = xc;
          xc = yc;
          yc = zc;
          i = xcL;
          xcL = ycL;
          ycL = i;
        }
        for (i = xcL + ycL, zc = []; i--; zc.push(0)) ;
        base = BASE;
        sqrtBase = SQRT_BASE;
        for (i = ycL; --i >= 0; ) {
          c = 0;
          ylo = yc[i] % sqrtBase;
          yhi = yc[i] / sqrtBase | 0;
          for (k = xcL, j = i + k; j > i; ) {
            xlo = xc[--k] % sqrtBase;
            xhi = xc[k] / sqrtBase | 0;
            m = yhi * xlo + xhi * ylo;
            xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
            c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
            zc[j--] = xlo % base;
          }
          zc[j] = c;
        }
        if (c) {
          ++e;
        } else {
          zc.splice(0, 1);
        }
        return normalise(y, zc, e);
      };
      P.negated = function() {
        var x = new BigNumber2(this);
        x.s = -x.s || null;
        return x;
      };
      P.plus = function(y, b) {
        var t, x = this, a = x.s;
        y = new BigNumber2(y, b);
        b = y.s;
        if (!a || !b) return new BigNumber2(NaN);
        if (a != b) {
          y.s = -b;
          return x.minus(y);
        }
        var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
        if (!xe || !ye) {
          if (!xc || !yc) return new BigNumber2(a / 0);
          if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber2(xc[0] ? x : a * 0);
        }
        xe = bitFloor(xe);
        ye = bitFloor(ye);
        xc = xc.slice();
        if (a = xe - ye) {
          if (a > 0) {
            ye = xe;
            t = yc;
          } else {
            a = -a;
            t = xc;
          }
          t.reverse();
          for (; a--; t.push(0)) ;
          t.reverse();
        }
        a = xc.length;
        b = yc.length;
        if (a - b < 0) {
          t = yc;
          yc = xc;
          xc = t;
          b = a;
        }
        for (a = 0; b; ) {
          a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
          xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
        }
        if (a) {
          xc = [a].concat(xc);
          ++ye;
        }
        return normalise(y, xc, ye);
      };
      P.precision = P.sd = function(sd, rm) {
        var c, n, v, x = this;
        if (sd != null && sd !== !!sd) {
          intCheck(sd, 1, MAX);
          if (rm == null) rm = ROUNDING_MODE;
          else intCheck(rm, 0, 8);
          return round(new BigNumber2(x), sd, rm);
        }
        if (!(c = x.c)) return null;
        v = c.length - 1;
        n = v * LOG_BASE + 1;
        if (v = c[v]) {
          for (; v % 10 == 0; v /= 10, n--) ;
          for (v = c[0]; v >= 10; v /= 10, n++) ;
        }
        if (sd && x.e + 1 > n) n = x.e + 1;
        return n;
      };
      P.shiftedBy = function(k) {
        intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
        return this.times("1e" + k);
      };
      P.squareRoot = P.sqrt = function() {
        var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
        if (s !== 1 || !c || !c[0]) {
          return new BigNumber2(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
        }
        s = Math.sqrt(+valueOf(x));
        if (s == 0 || s == 1 / 0) {
          n = coeffToString(c);
          if ((n.length + e) % 2 == 0) n += "0";
          s = Math.sqrt(+n);
          e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
          if (s == 1 / 0) {
            n = "5e" + e;
          } else {
            n = s.toExponential();
            n = n.slice(0, n.indexOf("e") + 1) + e;
          }
          r = new BigNumber2(n);
        } else {
          r = new BigNumber2(s + "");
        }
        if (r.c[0]) {
          e = r.e;
          s = e + dp;
          if (s < 3) s = 0;
          for (; ; ) {
            t = r;
            r = half.times(t.plus(div(x, t, dp, 1)));
            if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
              if (r.e < e) --s;
              n = n.slice(s - 3, s + 1);
              if (n == "9999" || !rep && n == "4999") {
                if (!rep) {
                  round(t, t.e + DECIMAL_PLACES + 2, 0);
                  if (t.times(t).eq(x)) {
                    r = t;
                    break;
                  }
                }
                dp += 4;
                s += 4;
                rep = 1;
              } else {
                if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
                  round(r, r.e + DECIMAL_PLACES + 2, 1);
                  m = !r.times(r).eq(x);
                }
                break;
              }
            }
          }
        }
        return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
      };
      P.toExponential = function(dp, rm) {
        if (dp != null) {
          intCheck(dp, 0, MAX);
          dp++;
        }
        return format(this, dp, rm, 1);
      };
      P.toFixed = function(dp, rm) {
        if (dp != null) {
          intCheck(dp, 0, MAX);
          dp = dp + this.e + 1;
        }
        return format(this, dp, rm);
      };
      P.toFormat = function(dp, rm, format2) {
        var str, x = this;
        if (format2 == null) {
          if (dp != null && rm && typeof rm == "object") {
            format2 = rm;
            rm = null;
          } else if (dp && typeof dp == "object") {
            format2 = dp;
            dp = rm = null;
          } else {
            format2 = FORMAT;
          }
        } else if (typeof format2 != "object") {
          throw Error(bignumberError + "Argument not an object: " + format2);
        }
        str = x.toFixed(dp, rm);
        if (x.c) {
          var i, arr = str.split("."), g1 = +format2.groupSize, g2 = +format2.secondaryGroupSize, groupSeparator = format2.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
          if (g2) {
            i = g1;
            g1 = g2;
            g2 = i;
            len -= i;
          }
          if (g1 > 0 && len > 0) {
            i = len % g1 || g1;
            intPart = intDigits.substr(0, i);
            for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
            if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
            if (isNeg) intPart = "-" + intPart;
          }
          str = fractionPart ? intPart + (format2.decimalSeparator || "") + ((g2 = +format2.fractionGroupSize) ? fractionPart.replace(
            new RegExp("\\d{" + g2 + "}\\B", "g"),
            "$&" + (format2.fractionGroupSeparator || "")
          ) : fractionPart) : intPart;
        }
        return (format2.prefix || "") + str + (format2.suffix || "");
      };
      P.toFraction = function(md) {
        var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
        if (md != null) {
          n = new BigNumber2(md);
          if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
            throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
          }
        }
        if (!xc) return new BigNumber2(x);
        d = new BigNumber2(ONE);
        n1 = d0 = new BigNumber2(ONE);
        d1 = n0 = new BigNumber2(ONE);
        s = coeffToString(xc);
        e = d.e = s.length - x.e - 1;
        d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
        md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
        exp = MAX_EXP;
        MAX_EXP = 1 / 0;
        n = new BigNumber2(s);
        n0.c[0] = 0;
        for (; ; ) {
          q = div(n, d, 0, 1);
          d2 = d0.plus(q.times(d1));
          if (d2.comparedTo(md) == 1) break;
          d0 = d1;
          d1 = d2;
          n1 = n0.plus(q.times(d2 = n1));
          n0 = d2;
          d = n.minus(q.times(d2 = d));
          n = d2;
        }
        d2 = div(md.minus(d0), d1, 0, 1);
        n0 = n0.plus(d2.times(n1));
        d0 = d0.plus(d2.times(d1));
        n0.s = n1.s = x.s;
        e = e * 2;
        r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()
        ) < 1 ? [n1, d1] : [n0, d0];
        MAX_EXP = exp;
        return r;
      };
      P.toNumber = function() {
        return +valueOf(this);
      };
      P.toObject = function() {
        var x = this;
        return {
          c: x.c ? x.c.slice() : null,
          e: x.e,
          s: x.s
        };
      };
      P.toPrecision = function(sd, rm) {
        if (sd != null) intCheck(sd, 1, MAX);
        return format(this, sd, rm, 2);
      };
      P.toString = function(b) {
        var str, n = this, s = n.s, e = n.e;
        if (e === null) {
          if (s) {
            str = "Infinity";
            if (s < 0) str = "-" + str;
          } else {
            str = "NaN";
          }
        } else {
          if (b == null) {
            str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
          } else {
            intCheck(b, 2, ALPHABET.length, "Base");
            str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
          }
          if (s < 0 && n.c[0]) str = "-" + str;
        }
        return str;
      };
      P.valueOf = P.toJSON = function() {
        return valueOf(this);
      };
      P._isBigNumber = true;
      if (configObject != null) BigNumber2.set(configObject);
      return BigNumber2;
    }
    function bitFloor(n) {
      var i = n | 0;
      return n > 0 || n === i ? i : i - 1;
    }
    function coeffToString(a) {
      var s, z, i = 1, j = a.length, r = a[0] + "";
      for (; i < j; ) {
        s = a[i++] + "";
        z = LOG_BASE - s.length;
        for (; z--; s = "0" + s) ;
        r += s;
      }
      for (j = r.length; r.charCodeAt(--j) === 48; ) ;
      return r.slice(0, j + 1 || 1);
    }
    function compare(x, y) {
      var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
      if (!i || !j) return null;
      a = xc && !xc[0];
      b = yc && !yc[0];
      if (a || b) return a ? b ? 0 : -j : i;
      if (i != j) return i;
      a = i < 0;
      b = k == l;
      if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;
      if (!b) return k > l ^ a ? 1 : -1;
      j = (k = xc.length) < (l = yc.length) ? k : l;
      for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;
      return k == l ? 0 : k > l ^ a ? 1 : -1;
    }
    function intCheck(n, min, max, name) {
      if (n < min || n > max || n !== mathfloor(n)) {
        throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
      }
    }
    function isOdd(n) {
      var k = n.c.length - 1;
      return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
    }
    function toExponential(str, e) {
      return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
    }
    function toFixedPoint(str, e, z) {
      var len, zs;
      if (e < 0) {
        for (zs = z + "."; ++e; zs += z) ;
        str = zs + str;
      } else {
        len = str.length;
        if (++e > len) {
          for (zs = z, e -= len; --e; zs += z) ;
          str += zs;
        } else if (e < len) {
          str = str.slice(0, e) + "." + str.slice(e);
        }
      }
      return str;
    }
    BigNumber["default"] = BigNumber.BigNumber = BigNumber;
    module.exports = BigNumber;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash-192.js
var require_hash_192 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash-192.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash192 = void 0;
    var hash_1 = require_hash();
    var Hash192 = class _Hash192 extends hash_1.Hash {
      constructor(bytes) {
        if ((bytes === null || bytes === void 0 ? void 0 : bytes.byteLength) === 0) {
          bytes = _Hash192.ZERO_192.bytes;
        }
        super(bytes !== null && bytes !== void 0 ? bytes : _Hash192.ZERO_192.bytes);
      }
    };
    exports.Hash192 = Hash192;
    Hash192.width = 24;
    Hash192.ZERO_192 = new Hash192(new Uint8Array(Hash192.width));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/amount.js
var require_amount = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/amount.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Amount = void 0;
    var binary_parser_1 = require_binary_parser();
    var account_id_1 = require_account_id();
    var currency_1 = require_currency();
    var serialized_type_1 = require_serialized_type();
    var bignumber_js_1 = __importDefault(require_bignumber());
    var utils_1 = require_utils();
    var utils_2 = require_utils4();
    var hash_192_1 = require_hash_192();
    var MIN_IOU_EXPONENT = -96;
    var MAX_IOU_EXPONENT = 80;
    var MAX_IOU_PRECISION = 16;
    var MAX_DROPS = new bignumber_js_1.default("1e17");
    var MIN_XRP = new bignumber_js_1.default("1e-6");
    var mask = BigInt(4294967295);
    var mptMask = BigInt(9223372036854776e3);
    bignumber_js_1.default.config({
      EXPONENTIAL_AT: [
        MIN_IOU_EXPONENT - MAX_IOU_PRECISION,
        MAX_IOU_EXPONENT + MAX_IOU_PRECISION
      ]
    });
    function isAmountObjectIOU(arg) {
      const keys = Object.keys(arg).sort();
      return keys.length === 3 && keys[0] === "currency" && keys[1] === "issuer" && keys[2] === "value";
    }
    function isAmountObjectMPT(arg) {
      const keys = Object.keys(arg).sort();
      return keys.length === 2 && keys[0] === "mpt_issuance_id" && keys[1] === "value";
    }
    var Amount = class _Amount extends serialized_type_1.SerializedType {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _Amount.defaultAmount.bytes);
      }
      /**
       * Construct an amount from an IOU, MPT or string amount
       *
       * @param value An Amount, object representing an IOU, or a string
       *     representing an integer amount
       * @returns An Amount object
       */
      static from(value) {
        if (value instanceof _Amount) {
          return value;
        }
        let amount = new Uint8Array(8);
        if (typeof value === "string") {
          _Amount.assertXrpIsValid(value);
          const number = BigInt(value);
          const intBuf = [new Uint8Array(4), new Uint8Array(4)];
          (0, utils_2.writeUInt32BE)(intBuf[0], Number(number >> BigInt(32)), 0);
          (0, utils_2.writeUInt32BE)(intBuf[1], Number(number & BigInt(mask)), 0);
          amount = (0, utils_1.concat)(intBuf);
          amount[0] |= 64;
          return new _Amount(amount);
        }
        if (isAmountObjectIOU(value)) {
          let number;
          try {
            number = new bignumber_js_1.default(value.value);
          } catch (_err) {
            throw new Error(`${value.value} is an illegal amount`);
          }
          _Amount.assertIouIsValid(number);
          if (number.isZero()) {
            amount[0] |= 128;
          } else {
            const integerNumberString = number.times(`1e${-((number.e || 0) - 15)}`).abs().toString();
            const num2 = BigInt(integerNumberString);
            const intBuf = [new Uint8Array(4), new Uint8Array(4)];
            (0, utils_2.writeUInt32BE)(intBuf[0], Number(num2 >> BigInt(32)), 0);
            (0, utils_2.writeUInt32BE)(intBuf[1], Number(num2 & BigInt(mask)), 0);
            amount = (0, utils_1.concat)(intBuf);
            amount[0] |= 128;
            if (number.gt(new bignumber_js_1.default(0))) {
              amount[0] |= 64;
            }
            const exponent = (number.e || 0) - 15;
            const exponentByte = 97 + exponent;
            amount[0] |= exponentByte >>> 2;
            amount[1] |= (exponentByte & 3) << 6;
          }
          const currency = currency_1.Currency.from(value.currency).toBytes();
          const issuer = account_id_1.AccountID.from(value.issuer).toBytes();
          return new _Amount((0, utils_1.concat)([amount, currency, issuer]));
        }
        if (isAmountObjectMPT(value)) {
          _Amount.assertMptIsValid(value.value);
          let leadingByte = new Uint8Array(1);
          leadingByte[0] |= 96;
          const num2 = BigInt(value.value);
          const intBuf = [new Uint8Array(4), new Uint8Array(4)];
          (0, utils_2.writeUInt32BE)(intBuf[0], Number(num2 >> BigInt(32)), 0);
          (0, utils_2.writeUInt32BE)(intBuf[1], Number(num2 & BigInt(mask)), 0);
          amount = (0, utils_1.concat)(intBuf);
          const mptIssuanceID = hash_192_1.Hash192.from(value.mpt_issuance_id).toBytes();
          return new _Amount((0, utils_1.concat)([leadingByte, amount, mptIssuanceID]));
        }
        throw new Error("Invalid type to construct an Amount");
      }
      /**
       * Read an amount from a BinaryParser
       *
       * @param parser BinaryParser to read the Amount from
       * @returns An Amount object
       */
      static fromParser(parser) {
        const isIOU = parser.peek() & 128;
        if (isIOU)
          return new _Amount(parser.read(48));
        const isMPT = parser.peek() & 32;
        const numBytes = isMPT ? 33 : 8;
        return new _Amount(parser.read(numBytes));
      }
      /**
       * Get the JSON representation of this Amount
       *
       * @returns the JSON interpretation of this.bytes
       */
      toJSON() {
        if (this.isNative()) {
          const bytes = this.bytes.slice();
          const isPositive = bytes[0] & 64;
          const sign = isPositive ? "" : "-";
          bytes[0] &= 63;
          const msb = BigInt((0, utils_2.readUInt32BE)(bytes.slice(0, 4), 0));
          const lsb = BigInt((0, utils_2.readUInt32BE)(bytes.slice(4), 0));
          const num2 = msb << BigInt(32) | lsb;
          return `${sign}${num2.toString()}`;
        }
        if (this.isIOU()) {
          const parser = new binary_parser_1.BinaryParser(this.toString());
          const mantissa = parser.read(8);
          const currency = currency_1.Currency.fromParser(parser);
          const issuer = account_id_1.AccountID.fromParser(parser);
          const b1 = mantissa[0];
          const b2 = mantissa[1];
          const isPositive = b1 & 64;
          const sign = isPositive ? "" : "-";
          const exponent = ((b1 & 63) << 2) + ((b2 & 255) >> 6) - 97;
          mantissa[0] = 0;
          mantissa[1] &= 63;
          const value = new bignumber_js_1.default(`${sign}0x${(0, utils_1.bytesToHex)(mantissa)}`).times(`1e${exponent}`);
          _Amount.assertIouIsValid(value);
          return {
            value: value.toString(),
            currency: currency.toJSON(),
            issuer: issuer.toJSON()
          };
        }
        if (this.isMPT()) {
          const parser = new binary_parser_1.BinaryParser(this.toString());
          const leadingByte = parser.read(1);
          const amount = parser.read(8);
          const mptID = hash_192_1.Hash192.fromParser(parser);
          const isPositive = leadingByte[0] & 64;
          const sign = isPositive ? "" : "-";
          const msb = BigInt((0, utils_2.readUInt32BE)(amount.slice(0, 4), 0));
          const lsb = BigInt((0, utils_2.readUInt32BE)(amount.slice(4), 0));
          const num2 = msb << BigInt(32) | lsb;
          return {
            value: `${sign}${num2.toString()}`,
            mpt_issuance_id: mptID.toString()
          };
        }
        throw new Error("Invalid amount to construct JSON");
      }
      /**
       * Validate XRP amount
       *
       * @param amount String representing XRP amount
       * @returns void, but will throw if invalid amount
       */
      static assertXrpIsValid(amount) {
        if (amount.indexOf(".") !== -1) {
          throw new Error(`${amount.toString()} is an illegal amount`);
        }
        let decimal;
        try {
          decimal = new bignumber_js_1.default(amount);
        } catch (_err) {
          throw new Error(`${amount.toString()} is an illegal amount`);
        }
        if (!decimal.isZero()) {
          if (decimal.lt(MIN_XRP) || decimal.gt(MAX_DROPS)) {
            throw new Error(`${amount.toString()} is an illegal amount`);
          }
        }
      }
      /**
       * Validate IOU.value amount
       *
       * @param decimal BigNumber object representing IOU.value
       * @returns void, but will throw if invalid amount
       */
      static assertIouIsValid(decimal) {
        if (!decimal.isZero()) {
          const p = decimal.precision();
          const e = (decimal.e || 0) - 15;
          if (p > MAX_IOU_PRECISION || e > MAX_IOU_EXPONENT || e < MIN_IOU_EXPONENT) {
            throw new Error("Decimal precision out of range");
          }
          this.verifyNoDecimal(decimal);
        }
      }
      /**
       * Validate MPT.value amount
       *
       * @param decimal BigNumber object representing MPT.value
       * @returns void, but will throw if invalid amount
       */
      static assertMptIsValid(amount) {
        if (amount.indexOf(".") !== -1) {
          throw new Error(`${amount.toString()} is an illegal amount`);
        }
        let decimal;
        try {
          decimal = new bignumber_js_1.default(amount);
        } catch (_err) {
          throw new Error(`${amount.toString()} is an illegal amount`);
        }
        if (!decimal.isZero()) {
          if (decimal < (0, bignumber_js_1.default)(0)) {
            throw new Error(`${amount.toString()} is an illegal amount`);
          }
          if (Number(BigInt(amount) & BigInt(mptMask)) != 0) {
            throw new Error(`${amount.toString()} is an illegal amount`);
          }
        }
      }
      /**
       * Ensure that the value after being multiplied by the exponent does not
       * contain a decimal.
       *
       * @param decimal a Decimal object
       * @returns a string of the object without a decimal
       */
      static verifyNoDecimal(decimal) {
        const integerNumberString = decimal.times(`1e${-((decimal.e || 0) - 15)}`).abs().toString();
        if (integerNumberString.indexOf(".") !== -1) {
          throw new Error("Decimal place found in integerNumberString");
        }
      }
      /**
       * Test if this amount is in units of Native Currency(XRP)
       *
       * @returns true if Native (XRP)
       */
      isNative() {
        return (this.bytes[0] & 128) === 0 && (this.bytes[0] & 32) === 0;
      }
      /**
       * Test if this amount is in units of MPT
       *
       * @returns true if MPT
       */
      isMPT() {
        return (this.bytes[0] & 128) === 0 && (this.bytes[0] & 32) !== 0;
      }
      /**
       * Test if this amount is in units of IOU
       *
       * @returns true if IOU
       */
      isIOU() {
        return (this.bytes[0] & 128) !== 0;
      }
    };
    exports.Amount = Amount;
    Amount.defaultAmount = new Amount((0, utils_1.hexToBytes)("4000000000000000"));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/blob.js
var require_blob = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/blob.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Blob = void 0;
    var serialized_type_1 = require_serialized_type();
    var utils_1 = require_utils();
    var Blob = class _Blob extends serialized_type_1.SerializedType {
      constructor(bytes) {
        super(bytes);
      }
      /**
       * Defines how to read a Blob from a BinaryParser
       *
       * @param parser The binary parser to read the Blob from
       * @param hint The length of the blob, computed by readVariableLengthLength() and passed in
       * @returns A Blob object
       */
      static fromParser(parser, hint) {
        return new _Blob(parser.read(hint));
      }
      /**
       * Create a Blob object from a hex-string
       *
       * @param value existing Blob object or a hex-string
       * @returns A Blob object
       */
      static from(value) {
        if (value instanceof _Blob) {
          return value;
        }
        if (typeof value === "string") {
          if (!/^[A-F0-9]*$/iu.test(value)) {
            throw new Error("Cannot construct Blob from a non-hex string");
          }
          return new _Blob((0, utils_1.hexToBytes)(value));
        }
        throw new Error("Cannot construct Blob from value given");
      }
    };
    exports.Blob = Blob;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash-128.js
var require_hash_128 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash-128.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash128 = void 0;
    var hash_1 = require_hash();
    var utils_1 = require_utils();
    var Hash128 = class _Hash128 extends hash_1.Hash {
      constructor(bytes) {
        if ((bytes === null || bytes === void 0 ? void 0 : bytes.byteLength) === 0) {
          bytes = _Hash128.ZERO_128.bytes;
        }
        super(bytes !== null && bytes !== void 0 ? bytes : _Hash128.ZERO_128.bytes);
      }
      /**
       * Get the hex representation of a hash-128 bytes, allowing unset
       *
       * @returns hex String of this.bytes
       */
      toHex() {
        const hex2 = (0, utils_1.bytesToHex)(this.toBytes());
        if (/^0+$/.exec(hex2)) {
          return "";
        }
        return hex2;
      }
    };
    exports.Hash128 = Hash128;
    Hash128.width = 16;
    Hash128.ZERO_128 = new Hash128(new Uint8Array(Hash128.width));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash-256.js
var require_hash_256 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/hash-256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash256 = void 0;
    var hash_1 = require_hash();
    var Hash256 = class _Hash256 extends hash_1.Hash {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _Hash256.ZERO_256.bytes);
      }
    };
    exports.Hash256 = Hash256;
    Hash256.width = 32;
    Hash256.ZERO_256 = new Hash256(new Uint8Array(Hash256.width));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/int.js
var require_int = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/int.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Int = void 0;
    var serialized_type_1 = require_serialized_type();
    function compare(n1, n2) {
      return n1 < n2 ? -1 : n1 == n2 ? 0 : 1;
    }
    var Int = class extends serialized_type_1.Comparable {
      constructor(bytes) {
        super(bytes);
      }
      /**
       * Overload of compareTo for Comparable
       *
       * @param other other Int to compare this to
       * @returns -1, 0, or 1 depending on how the objects relate to each other
       */
      compareTo(other) {
        return compare(this.valueOf(), other.valueOf());
      }
      /**
       * Convert an Int object to JSON
       *
       * @returns number or string represented by this.bytes
       */
      toJSON() {
        const val = this.valueOf();
        return typeof val === "number" ? val : val.toString();
      }
      /**
       * Validate that a number is within the specified signed integer range
       *
       * @param typeName The name of the type (for error messages)
       * @param val The number to validate
       * @param min The minimum allowed value
       * @param max The maximum allowed value
       * @throws Error if the value is out of range
       */
      // eslint-disable-next-line max-params -- for error clarity in browsers
      static checkIntRange(typeName, val, min, max) {
        if (val < min || val > max) {
          throw new Error(`Invalid ${typeName}: ${val} must be >= ${min} and <= ${max}`);
        }
      }
    };
    exports.Int = Int;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/int-32.js
var require_int_32 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/int-32.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Int32 = void 0;
    var int_1 = require_int();
    var utils_1 = require_utils4();
    var Int32 = class _Int32 extends int_1.Int {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _Int32.defaultInt32.bytes);
      }
      /**
       * Construct an Int32 from a BinaryParser
       *
       * @param parser BinaryParser to read Int32 from
       * @returns An Int32 object
       */
      static fromParser(parser) {
        return new _Int32(parser.read(_Int32.width));
      }
      /**
       * Construct an Int32 object from a number or string
       *
       * @param val Int32 object, number, or string
       * @returns An Int32 object
       */
      static from(val) {
        if (val instanceof _Int32) {
          return val;
        }
        const buf = new Uint8Array(_Int32.width);
        if (typeof val === "string") {
          const num2 = Number(val);
          if (!Number.isFinite(num2) || !Number.isInteger(num2)) {
            throw new Error(`Cannot construct Int32 from string: ${val}`);
          }
          _Int32.checkIntRange("Int32", num2, _Int32.MIN_VALUE, _Int32.MAX_VALUE);
          (0, utils_1.writeInt32BE)(buf, num2, 0);
          return new _Int32(buf);
        }
        if (typeof val === "number" && Number.isInteger(val)) {
          _Int32.checkIntRange("Int32", val, _Int32.MIN_VALUE, _Int32.MAX_VALUE);
          (0, utils_1.writeInt32BE)(buf, val, 0);
          return new _Int32(buf);
        }
        throw new Error("Cannot construct Int32 from given value");
      }
      /**
       * Get the value of the Int32 object
       *
       * @returns the signed 32-bit integer represented by this.bytes
       */
      valueOf() {
        return (0, utils_1.readInt32BE)(this.bytes, 0);
      }
    };
    exports.Int32 = Int32;
    Int32.width = 32 / 8;
    Int32.defaultInt32 = new Int32(new Uint8Array(Int32.width));
    Int32.MIN_VALUE = -2147483648;
    Int32.MAX_VALUE = 2147483647;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/issue.js
var require_issue = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/issue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Issue = void 0;
    var utils_1 = require_utils();
    var binary_parser_1 = require_binary_parser();
    var account_id_1 = require_account_id();
    var currency_1 = require_currency();
    var serialized_type_1 = require_serialized_type();
    var hash_192_1 = require_hash_192();
    var utils_2 = require_utils4();
    function isIssueObject(arg) {
      const keys = Object.keys(arg).sort();
      const isXRP = keys.length === 1 && keys[0] === "currency";
      const isIOU = keys.length === 2 && keys[0] === "currency" && keys[1] === "issuer";
      const isMPT = keys.length === 1 && keys[0] === "mpt_issuance_id";
      return isXRP || isIOU || isMPT;
    }
    var MPT_WIDTH = 44;
    var NO_ACCOUNT = account_id_1.AccountID.from("0000000000000000000000000000000000000001");
    var Issue = class _Issue extends serialized_type_1.SerializedType {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _Issue.XRP_ISSUE.bytes);
      }
      /**
       * Construct Issue from XRPIssue, IOUIssue or MPTIssue
       *
       * @param value An object representing an XRPIssue, IOUIssue or MPTIssue
       * @returns An Issue object
       */
      static from(value) {
        if (value instanceof _Issue) {
          return value;
        }
        if (isIssueObject(value)) {
          if (value.currency) {
            const currency = currency_1.Currency.from(value.currency.toString()).toBytes();
            if (value.issuer) {
              const issuer = account_id_1.AccountID.from(value.issuer.toString()).toBytes();
              return new _Issue((0, utils_1.concat)([currency, issuer]));
            }
            return new _Issue(currency);
          }
          if (value.mpt_issuance_id) {
            const mptIssuanceIdBytes = hash_192_1.Hash192.from(value.mpt_issuance_id.toString()).toBytes();
            const issuerAccount = mptIssuanceIdBytes.slice(4);
            const sequence = Number((0, utils_2.readUInt32BE)(mptIssuanceIdBytes.slice(0, 4), 0));
            const sequenceBuffer = new Uint8Array(4);
            new DataView(sequenceBuffer.buffer).setUint32(0, sequence, true);
            return new _Issue((0, utils_1.concat)([issuerAccount, NO_ACCOUNT.toBytes(), sequenceBuffer]));
          }
        }
        throw new Error("Invalid type to construct an Issue");
      }
      /**
       * Read Issue from a BinaryParser
       *
       * @param parser BinaryParser to read the Issue from
       *
       * @returns An Issue object
       */
      static fromParser(parser) {
        const currencyOrAccount = parser.read(20);
        if (new currency_1.Currency(currencyOrAccount).toJSON() === "XRP") {
          return new _Issue(currencyOrAccount);
        }
        const issuerAccountId = new account_id_1.AccountID(parser.read(20));
        if (NO_ACCOUNT.toHex() === issuerAccountId.toHex()) {
          const sequence = parser.read(4);
          return new _Issue((0, utils_1.concat)([currencyOrAccount, NO_ACCOUNT.toBytes(), sequence]));
        }
        return new _Issue((0, utils_1.concat)([currencyOrAccount, issuerAccountId.toBytes()]));
      }
      /**
       * Get the JSON representation of this IssueObject
       *
       * @returns the JSON interpretation of this.bytes
       */
      toJSON() {
        if (this.toBytes().length === MPT_WIDTH) {
          const issuerAccount = this.toBytes().slice(0, 20);
          const sequence = new DataView(this.toBytes().slice(40).buffer).getUint32(0, true);
          const sequenceBuffer = new Uint8Array(4);
          (0, utils_2.writeUInt32BE)(sequenceBuffer, sequence, 0);
          return {
            mpt_issuance_id: (0, utils_1.bytesToHex)((0, utils_1.concat)([sequenceBuffer, issuerAccount]))
          };
        }
        const parser = new binary_parser_1.BinaryParser(this.toString());
        const currency = currency_1.Currency.fromParser(parser);
        if (currency.toJSON() === "XRP") {
          return { currency: currency.toJSON() };
        }
        const issuer = account_id_1.AccountID.fromParser(parser);
        return {
          currency: currency.toJSON(),
          issuer: issuer.toJSON()
        };
      }
    };
    exports.Issue = Issue;
    Issue.XRP_ISSUE = new Issue(new Uint8Array(20));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/st-number.js
var require_st_number = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/st-number.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STNumber = void 0;
    var serialized_type_1 = require_serialized_type();
    var utils_1 = require_utils4();
    var MIN_MANTISSA = BigInt("1000000000000000000");
    var MAX_MANTISSA = BigInt("9999999999999999999");
    var MAX_INT64 = BigInt("9223372036854775807");
    var MIN_EXPONENT = -32768;
    var MAX_EXPONENT = 32768;
    var DEFAULT_VALUE_EXPONENT = -2147483648;
    function extractNumberPartsFromString(val) {
      const regex = /^([-+]?)([0-9]+)(?:\.([0-9]+))?(?:[eE]([+-]?[0-9]+))?$/;
      const match = regex.exec(val);
      if (!match)
        throw new Error(`Unable to parse number from string: ${val}`);
      const [, sign, intPart, fracPart, expPart] = match;
      const cleanIntPart = intPart.replace(/^0+(?=\d)/, "") || "0";
      let mantissaStr = cleanIntPart;
      let exponent = 0;
      if (fracPart) {
        mantissaStr += fracPart;
        exponent -= fracPart.length;
      }
      if (expPart)
        exponent += parseInt(expPart, 10);
      while (mantissaStr.length > 1 && mantissaStr.endsWith("0")) {
        mantissaStr = mantissaStr.slice(0, -1);
        exponent += 1;
      }
      let mantissa = BigInt(mantissaStr);
      if (sign === "-")
        mantissa = -mantissa;
      const isNegative = mantissa < BigInt(0);
      return { mantissa, exponent, isNegative };
    }
    function normalize2(mantissa, exponent) {
      let m = mantissa < BigInt(0) ? -mantissa : mantissa;
      const isNegative = mantissa < BigInt(0);
      if (m === BigInt(0)) {
        return { mantissa: BigInt(0), exponent: DEFAULT_VALUE_EXPONENT };
      }
      while (m < MIN_MANTISSA && exponent > MIN_EXPONENT) {
        exponent -= 1;
        m *= BigInt(10);
      }
      let lastDigit = null;
      while (m > MAX_MANTISSA) {
        if (exponent >= MAX_EXPONENT) {
          throw new Error("Mantissa and exponent are too large");
        }
        exponent += 1;
        lastDigit = m % BigInt(10);
        m /= BigInt(10);
      }
      if (exponent < MIN_EXPONENT || m < MIN_MANTISSA) {
        throw new Error("Underflow: value too small to represent");
      }
      if (exponent > MAX_EXPONENT) {
        throw new Error("Exponent overflow: value too large to represent");
      }
      if (m > MAX_INT64) {
        if (exponent >= MAX_EXPONENT) {
          throw new Error("Exponent overflow: value too large to represent");
        }
        exponent += 1;
        lastDigit = m % BigInt(10);
        m /= BigInt(10);
      }
      if (lastDigit != null && lastDigit >= BigInt(5)) {
        m += BigInt(1);
        if (m > MAX_INT64) {
          if (exponent >= MAX_EXPONENT) {
            throw new Error("Exponent overflow: value too large to represent");
          }
          lastDigit = m % BigInt(10);
          exponent += 1;
          m /= BigInt(10);
          if (lastDigit >= BigInt(5)) {
            m += BigInt(1);
          }
        }
      }
      if (isNegative)
        m = -m;
      return { mantissa: m, exponent };
    }
    var STNumber = class _STNumber extends serialized_type_1.SerializedType {
      /**
       * Construct a STNumber from 12 bytes (8 for mantissa, 4 for exponent).
       * @param bytes - 12-byte Uint8Array
       * @throws Error if input is not a Uint8Array of length 12.
       */
      constructor(bytes) {
        const used = bytes !== null && bytes !== void 0 ? bytes : _STNumber.defaultBytes;
        if (!(used instanceof Uint8Array) || used.length !== 12) {
          throw new Error(`STNumber must be constructed from a 12-byte Uint8Array, got ${used === null || used === void 0 ? void 0 : used.length}`);
        }
        super(used);
      }
      /**
       * Construct from a number string (or another STNumber).
       *
       * @param value - A string, or STNumber instance.
       * @returns STNumber instance.
       * @throws Error if not a string or STNumber.
       */
      static from(value) {
        if (value instanceof _STNumber) {
          return value;
        }
        if (typeof value === "string") {
          return _STNumber.fromValue(value);
        }
        throw new Error("STNumber.from: Only string or STNumber instance is supported");
      }
      /**
       * Construct from a number string (integer, decimal, or scientific notation).
       * Handles normalization to XRPL Number constraints.
       *
       * @param val - The number as a string (e.g. '1.23', '-123e5').
       * @returns STNumber instance
       * @throws Error if val is not a valid number string.
       */
      static fromValue(val) {
        const { mantissa, exponent } = extractNumberPartsFromString(val);
        const { mantissa: normalizedMantissa, exponent: normalizedExponent } = normalize2(mantissa, exponent);
        const bytes = new Uint8Array(12);
        (0, utils_1.writeInt64BE)(bytes, normalizedMantissa, 0);
        (0, utils_1.writeInt32BE)(bytes, normalizedExponent, 8);
        return new _STNumber(bytes);
      }
      /**
       * Read a STNumber from a BinaryParser stream (12 bytes).
       * @param parser - BinaryParser positioned at the start of a number
       * @returns STNumber instance
       */
      static fromParser(parser) {
        return new _STNumber(parser.read(12));
      }
      /**
       * Convert this STNumber to a normalized string representation.
       * The output is decimal or scientific notation, depending on exponent range.
       * Follows XRPL convention: zero is "0", other values are normalized to a canonical string.
       *
       * @returns String representation of the value
       */
      toJSON() {
        const b = this.bytes;
        if (!b || (b === null || b === void 0 ? void 0 : b.length) !== 12)
          throw new Error("STNumber internal bytes not set or wrong length");
        const mantissa = (0, utils_1.readInt64BE)(b, 0);
        let exponent = (0, utils_1.readInt32BE)(b, 8);
        if (mantissa === BigInt(0) && exponent === DEFAULT_VALUE_EXPONENT) {
          return "0";
        }
        const isNegative = mantissa < BigInt(0);
        let mantissaAbs = isNegative ? -mantissa : mantissa;
        if (mantissaAbs !== BigInt(0) && mantissaAbs < MIN_MANTISSA) {
          mantissaAbs *= BigInt(10);
          exponent -= 1;
        }
        const rangeLog = 18;
        if (exponent !== 0 && (exponent < -(rangeLog + 10) || exponent > -(rangeLog - 10))) {
          let exp = exponent;
          while (mantissaAbs !== BigInt(0) && mantissaAbs % BigInt(10) === BigInt(0) && exp < MAX_EXPONENT) {
            mantissaAbs /= BigInt(10);
            exp += 1;
          }
          const sign = isNegative ? "-" : "";
          return `${sign}${mantissaAbs}e${exp}`;
        }
        const padPrefix = rangeLog + 12;
        const padSuffix = rangeLog + 8;
        const mantissaStr = mantissaAbs.toString();
        const rawValue = "0".repeat(padPrefix) + mantissaStr + "0".repeat(padSuffix);
        const offset = exponent + padPrefix + rangeLog + 1;
        const integerPart = rawValue.slice(0, offset).replace(/^0+/, "") || "0";
        const fractionPart = rawValue.slice(offset).replace(/0+$/, "");
        return `${isNegative ? "-" : ""}${integerPart}${fractionPart ? "." + fractionPart : ""}`;
      }
    };
    exports.STNumber = STNumber;
    STNumber.defaultBytes = new Uint8Array(12);
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/path-set.js
var require_path_set = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/path-set.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PathSet = void 0;
    var account_id_1 = require_account_id();
    var currency_1 = require_currency();
    var binary_parser_1 = require_binary_parser();
    var serialized_type_1 = require_serialized_type();
    var utils_1 = require_utils();
    var PATHSET_END_BYTE = 0;
    var PATH_SEPARATOR_BYTE = 255;
    var TYPE_ACCOUNT = 1;
    var TYPE_CURRENCY = 16;
    var TYPE_ISSUER = 32;
    function isHopObject(arg) {
      return arg.issuer !== void 0 || arg.account !== void 0 || arg.currency !== void 0;
    }
    function isPathSet(arg) {
      return Array.isArray(arg) && arg.length === 0 || Array.isArray(arg) && Array.isArray(arg[0]) && arg[0].length === 0 || Array.isArray(arg) && Array.isArray(arg[0]) && isHopObject(arg[0][0]);
    }
    var Hop = class _Hop extends serialized_type_1.SerializedType {
      /**
       * Create a Hop from a HopObject
       *
       * @param value Either a hop or HopObject to create a hop with
       * @returns a Hop
       */
      static from(value) {
        if (value instanceof _Hop) {
          return value;
        }
        const bytes = [Uint8Array.from([0])];
        if (value.account) {
          bytes.push(account_id_1.AccountID.from(value.account).toBytes());
          bytes[0][0] |= TYPE_ACCOUNT;
        }
        if (value.currency) {
          bytes.push(currency_1.Currency.from(value.currency).toBytes());
          bytes[0][0] |= TYPE_CURRENCY;
        }
        if (value.issuer) {
          bytes.push(account_id_1.AccountID.from(value.issuer).toBytes());
          bytes[0][0] |= TYPE_ISSUER;
        }
        return new _Hop((0, utils_1.concat)(bytes));
      }
      /**
       * Construct a Hop from a BinaryParser
       *
       * @param parser BinaryParser to read the Hop from
       * @returns a Hop
       */
      static fromParser(parser) {
        const type = parser.readUInt8();
        const bytes = [Uint8Array.from([type])];
        if (type & TYPE_ACCOUNT) {
          bytes.push(parser.read(account_id_1.AccountID.width));
        }
        if (type & TYPE_CURRENCY) {
          bytes.push(parser.read(currency_1.Currency.width));
        }
        if (type & TYPE_ISSUER) {
          bytes.push(parser.read(account_id_1.AccountID.width));
        }
        return new _Hop((0, utils_1.concat)(bytes));
      }
      /**
       * Get the JSON interpretation of this hop
       *
       * @returns a HopObject, an JS object with optional account, issuer, and currency
       */
      toJSON() {
        const hopParser = new binary_parser_1.BinaryParser((0, utils_1.bytesToHex)(this.bytes));
        const type = hopParser.readUInt8();
        let account, currency, issuer;
        if (type & TYPE_ACCOUNT) {
          account = account_id_1.AccountID.fromParser(hopParser).toJSON();
        }
        if (type & TYPE_CURRENCY) {
          currency = currency_1.Currency.fromParser(hopParser).toJSON();
        }
        if (type & TYPE_ISSUER) {
          issuer = account_id_1.AccountID.fromParser(hopParser).toJSON();
        }
        const result = {};
        if (account) {
          result.account = account;
        }
        if (issuer) {
          result.issuer = issuer;
        }
        if (currency) {
          result.currency = currency;
        }
        return result;
      }
      /**
       * get a number representing the type of this hop
       *
       * @returns a number to be bitwise and-ed with TYPE_ constants to describe the types in the hop
       */
      type() {
        return this.bytes[0];
      }
    };
    var Path = class _Path extends serialized_type_1.SerializedType {
      /**
       * construct a Path from an array of Hops
       *
       * @param value Path or array of HopObjects to construct a Path
       * @returns the Path
       */
      static from(value) {
        if (value instanceof _Path) {
          return value;
        }
        const bytes = [];
        value.forEach((hop) => {
          bytes.push(Hop.from(hop).toBytes());
        });
        return new _Path((0, utils_1.concat)(bytes));
      }
      /**
       * Read a Path from a BinaryParser
       *
       * @param parser BinaryParser to read Path from
       * @returns the Path represented by the bytes read from the BinaryParser
       */
      static fromParser(parser) {
        const bytes = [];
        while (!parser.end()) {
          bytes.push(Hop.fromParser(parser).toBytes());
          if (parser.peek() === PATHSET_END_BYTE || parser.peek() === PATH_SEPARATOR_BYTE) {
            break;
          }
        }
        return new _Path((0, utils_1.concat)(bytes));
      }
      /**
       * Get the JSON representation of this Path
       *
       * @returns an Array of HopObject constructed from this.bytes
       */
      toJSON() {
        const json = [];
        const pathParser = new binary_parser_1.BinaryParser(this.toString());
        while (!pathParser.end()) {
          json.push(Hop.fromParser(pathParser).toJSON());
        }
        return json;
      }
    };
    var PathSet = class _PathSet extends serialized_type_1.SerializedType {
      /**
       * Construct a PathSet from an Array of Arrays representing paths
       *
       * @param value A PathSet or Array of Array of HopObjects
       * @returns the PathSet constructed from value
       */
      static from(value) {
        if (value instanceof _PathSet) {
          return value;
        }
        if (isPathSet(value)) {
          const bytes = [];
          value.forEach((path) => {
            bytes.push(Path.from(path).toBytes());
            bytes.push(Uint8Array.from([PATH_SEPARATOR_BYTE]));
          });
          bytes[bytes.length - 1] = Uint8Array.from([PATHSET_END_BYTE]);
          return new _PathSet((0, utils_1.concat)(bytes));
        }
        throw new Error("Cannot construct PathSet from given value");
      }
      /**
       * Construct a PathSet from a BinaryParser
       *
       * @param parser A BinaryParser to read PathSet from
       * @returns the PathSet read from parser
       */
      static fromParser(parser) {
        const bytes = [];
        while (!parser.end()) {
          bytes.push(Path.fromParser(parser).toBytes());
          bytes.push(parser.read(1));
          if (bytes[bytes.length - 1][0] == PATHSET_END_BYTE) {
            break;
          }
        }
        return new _PathSet((0, utils_1.concat)(bytes));
      }
      /**
       * Get the JSON representation of this PathSet
       *
       * @returns an Array of Array of HopObjects, representing this PathSet
       */
      toJSON() {
        const json = [];
        const pathParser = new binary_parser_1.BinaryParser(this.toString());
        while (!pathParser.end()) {
          json.push(Path.fromParser(pathParser).toJSON());
          pathParser.skip(1);
        }
        return json;
      }
    };
    exports.PathSet = PathSet;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint.js
var require_uint = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UInt = void 0;
    var serialized_type_1 = require_serialized_type();
    function compare(n1, n2) {
      return n1 < n2 ? -1 : n1 == n2 ? 0 : 1;
    }
    var UInt = class extends serialized_type_1.Comparable {
      constructor(bytes) {
        super(bytes);
      }
      /**
       * Overload of compareTo for Comparable
       *
       * @param other other UInt to compare this to
       * @returns -1, 0, or 1 depending on how the objects relate to each other
       */
      compareTo(other) {
        return compare(this.valueOf(), other.valueOf());
      }
      /**
       * Convert a UInt object to JSON
       *
       * @returns number or string represented by this.bytes
       */
      toJSON() {
        const val = this.valueOf();
        return typeof val === "number" ? val : val.toString();
      }
      static checkUintRange(val, min, max) {
        if (val < min || val > max) {
          throw new Error(`Invalid ${this.constructor.name}: ${val} must be >= ${min} and <= ${max}`);
        }
      }
    };
    exports.UInt = UInt;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint-64.js
var require_uint_64 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint-64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UInt64 = void 0;
    var uint_1 = require_uint();
    var utils_1 = require_utils();
    var utils_2 = require_utils4();
    var enums_1 = require_enums();
    var HEX_REGEX = /^[a-fA-F0-9]{1,16}$/;
    var BASE10_REGEX = /^[0-9]{1,20}$/;
    var mask = BigInt(4294967295);
    var BASE10_AMOUNT_FIELDS = /* @__PURE__ */ new Set([
      "MaximumAmount",
      "OutstandingAmount",
      "MPTAmount",
      "LockedAmount"
    ]);
    function isBase10(fieldName) {
      return BASE10_AMOUNT_FIELDS.has(fieldName);
    }
    var UInt64 = class _UInt64 extends uint_1.UInt {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _UInt64.defaultUInt64.bytes);
      }
      static fromParser(parser) {
        return new _UInt64(parser.read(_UInt64.width));
      }
      /**
       * Construct a UInt64 object
       *
       * @param val A UInt64, hex-string, bigInt, or number
       * @returns A UInt64 object
       */
      // eslint-disable-next-line complexity
      static from(val, fieldName = "") {
        if (val instanceof _UInt64) {
          return val;
        }
        let buf = new Uint8Array(_UInt64.width);
        if (typeof val === "number" && Number.isInteger(val)) {
          if (val < 0) {
            throw new Error("value must be an unsigned integer");
          }
          const number = BigInt(val);
          const intBuf = [new Uint8Array(4), new Uint8Array(4)];
          (0, utils_2.writeUInt32BE)(intBuf[0], Number(number >> BigInt(32)), 0);
          (0, utils_2.writeUInt32BE)(intBuf[1], Number(number & BigInt(mask)), 0);
          return new _UInt64((0, utils_1.concat)(intBuf));
        }
        if (typeof val === "string") {
          if (isBase10(fieldName)) {
            if (!BASE10_REGEX.test(val)) {
              throw new Error(`${fieldName} ${val} is not a valid base 10 string`);
            }
            val = BigInt(val).toString(16);
          }
          if (typeof val === "string" && !HEX_REGEX.test(val)) {
            throw new Error(`${val} is not a valid hex-string`);
          }
          const strBuf = val.padStart(16, "0");
          buf = (0, utils_1.hexToBytes)(strBuf);
          return new _UInt64(buf);
        }
        if (typeof val === "bigint") {
          const intBuf = [new Uint8Array(4), new Uint8Array(4)];
          (0, utils_2.writeUInt32BE)(intBuf[0], Number(Number(val >> BigInt(32))), 0);
          (0, utils_2.writeUInt32BE)(intBuf[1], Number(val & BigInt(mask)), 0);
          return new _UInt64((0, utils_1.concat)(intBuf));
        }
        throw new Error("Cannot construct UInt64 from given value");
      }
      /**
       * The JSON representation of a UInt64 object
       *
       * @returns a hex-string
       */
      toJSON(_definitions = enums_1.DEFAULT_DEFINITIONS, fieldName = "") {
        const hexString = (0, utils_1.bytesToHex)(this.bytes);
        if (isBase10(fieldName)) {
          return BigInt("0x" + hexString).toString(10);
        }
        return hexString;
      }
      /**
       * Get the value of the UInt64
       *
       * @returns the number represented buy this.bytes
       */
      valueOf() {
        const msb = BigInt((0, utils_2.readUInt32BE)(this.bytes.slice(0, 4), 0));
        const lsb = BigInt((0, utils_2.readUInt32BE)(this.bytes.slice(4), 0));
        return msb << BigInt(32) | lsb;
      }
      /**
       * Get the bytes representation of the UInt64 object
       *
       * @returns 8 bytes representing the UInt64
       */
      toBytes() {
        return this.bytes;
      }
    };
    exports.UInt64 = UInt64;
    UInt64.width = 64 / 8;
    UInt64.defaultUInt64 = new UInt64(new Uint8Array(UInt64.width));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/st-object.js
var require_st_object = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/st-object.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STObject = void 0;
    var enums_1 = require_enums();
    var serialized_type_1 = require_serialized_type();
    var ripple_address_codec_1 = require_dist();
    var binary_parser_1 = require_binary_parser();
    var binary_serializer_1 = require_binary_serializer();
    var st_array_1 = require_st_array();
    var uint_64_1 = require_uint_64();
    var OBJECT_END_MARKER_BYTE = Uint8Array.from([225]);
    var OBJECT_END_MARKER = "ObjectEndMarker";
    var ST_OBJECT = "STObject";
    var DESTINATION = "Destination";
    var ACCOUNT = "Account";
    var SOURCE_TAG = "SourceTag";
    var DEST_TAG = "DestinationTag";
    function handleXAddress(field, xAddress) {
      const decoded = (0, ripple_address_codec_1.xAddressToClassicAddress)(xAddress);
      let tagName;
      if (field === DESTINATION)
        tagName = DEST_TAG;
      else if (field === ACCOUNT)
        tagName = SOURCE_TAG;
      else if (decoded.tag !== false)
        throw new Error(`${field} cannot have an associated tag`);
      return decoded.tag !== false ? { [field]: decoded.classicAddress, [tagName]: decoded.tag } : { [field]: decoded.classicAddress };
    }
    function checkForDuplicateTags(obj1, obj2) {
      if (!(obj1[SOURCE_TAG] === void 0 || obj2[SOURCE_TAG] === void 0))
        throw new Error("Cannot have Account X-Address and SourceTag");
      if (!(obj1[DEST_TAG] === void 0 || obj2[DEST_TAG] === void 0))
        throw new Error("Cannot have Destination X-Address and DestinationTag");
    }
    var STObject = class _STObject extends serialized_type_1.SerializedType {
      /**
       * Construct a STObject from a BinaryParser
       *
       * @param parser BinaryParser to read STObject from
       * @returns A STObject object
       */
      static fromParser(parser) {
        const list = new binary_serializer_1.BytesList();
        const bytes = new binary_serializer_1.BinarySerializer(list);
        while (!parser.end()) {
          const field = parser.readField();
          if (field.name === OBJECT_END_MARKER) {
            break;
          }
          const associatedValue = parser.readFieldValue(field);
          bytes.writeFieldAndValue(field, associatedValue);
          if (field.type.name === ST_OBJECT) {
            bytes.put(OBJECT_END_MARKER_BYTE);
          }
        }
        return new _STObject(list.toBytes());
      }
      /**
       * Construct a STObject from a JSON object
       *
       * @param value An object to include
       * @param filter optional, denote which field to include in serialized object
       * @param definitions optional, types and values to use to encode/decode a transaction
       * @returns a STObject object
       */
      static from(value, filter, definitions = enums_1.DEFAULT_DEFINITIONS) {
        if (value instanceof _STObject) {
          return value;
        }
        const list = new binary_serializer_1.BytesList();
        const bytes = new binary_serializer_1.BinarySerializer(list);
        let isUnlModify = false;
        const xAddressDecoded = Object.entries(value).reduce((acc, [key, val]) => {
          let handled = void 0;
          if (val && (0, ripple_address_codec_1.isValidXAddress)(val.toString())) {
            handled = handleXAddress(key, val.toString());
            checkForDuplicateTags(handled, value);
          }
          return Object.assign(acc, handled !== null && handled !== void 0 ? handled : { [key]: val });
        }, {});
        function isValidFieldInstance(f) {
          return f !== void 0 && xAddressDecoded[f.name] !== void 0 && f.isSerialized;
        }
        let sorted = Object.keys(xAddressDecoded).map((f) => {
          if (!(f in definitions.field)) {
            if (f[0] === f[0].toLowerCase())
              return void 0;
            throw new Error(`Field ${f} is not defined in the definitions`);
          }
          return definitions.field[f];
        }).filter(isValidFieldInstance).sort((a, b) => {
          return a.ordinal - b.ordinal;
        });
        if (filter !== void 0) {
          sorted = sorted.filter(filter);
        }
        sorted.forEach((field) => {
          const associatedValue = field.type.name === ST_OBJECT ? this.from(xAddressDecoded[field.name], void 0, definitions) : field.type.name === "STArray" ? st_array_1.STArray.from(xAddressDecoded[field.name], definitions) : field.type.name === "UInt64" ? uint_64_1.UInt64.from(xAddressDecoded[field.name], field.name) : field.associatedType.from(xAddressDecoded[field.name]);
          if (associatedValue == void 0) {
            throw new TypeError(`Unable to interpret "${field.name}: ${xAddressDecoded[field.name]}".`);
          }
          if (associatedValue.name === "UNLModify") {
            isUnlModify = true;
          }
          const isUnlModifyWorkaround = field.name == "Account" && isUnlModify;
          bytes.writeFieldAndValue(field, associatedValue, isUnlModifyWorkaround);
          if (field.type.name === ST_OBJECT) {
            bytes.put(OBJECT_END_MARKER_BYTE);
          }
        });
        return new _STObject(list.toBytes());
      }
      /**
       * Get the JSON interpretation of this.bytes
       * @param definitions rippled definitions used to parse the values of transaction types and such.
       *                          Can be customized for sidechains and amendments.
       * @returns a JSON object
       */
      toJSON(definitions) {
        const objectParser = new binary_parser_1.BinaryParser(this.toString(), definitions);
        const accumulator = {};
        while (!objectParser.end()) {
          const field = objectParser.readField();
          if (field.name === OBJECT_END_MARKER) {
            break;
          }
          accumulator[field.name] = objectParser.readFieldValue(field).toJSON(definitions, field.name);
        }
        return accumulator;
      }
    };
    exports.STObject = STObject;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/st-array.js
var require_st_array = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/st-array.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STArray = void 0;
    var enums_1 = require_enums();
    var serialized_type_1 = require_serialized_type();
    var st_object_1 = require_st_object();
    var binary_parser_1 = require_binary_parser();
    var utils_1 = require_utils();
    var ARRAY_END_MARKER = Uint8Array.from([241]);
    var ARRAY_END_MARKER_NAME = "ArrayEndMarker";
    var OBJECT_END_MARKER = Uint8Array.from([225]);
    function isObjects(args) {
      return Array.isArray(args) && args.every((arg) => typeof arg === "object" && Object.keys(arg).length === 1 && typeof Object.values(arg)[0] === "object");
    }
    var STArray = class _STArray extends serialized_type_1.SerializedType {
      /**
       * Construct an STArray from a BinaryParser
       *
       * @param parser BinaryParser to parse an STArray from
       * @returns An STArray Object
       */
      static fromParser(parser) {
        const bytes = [];
        while (!parser.end()) {
          const field = parser.readField();
          if (field.name === ARRAY_END_MARKER_NAME) {
            break;
          }
          bytes.push(field.header, parser.readFieldValue(field).toBytes(), OBJECT_END_MARKER);
        }
        bytes.push(ARRAY_END_MARKER);
        return new _STArray((0, utils_1.concat)(bytes));
      }
      /**
       * Construct an STArray from an Array of JSON Objects
       *
       * @param value STArray or Array of Objects to parse into an STArray
       * @param definitions optional, types and values to use to encode/decode a transaction
       * @returns An STArray object
       */
      static from(value, definitions = enums_1.DEFAULT_DEFINITIONS) {
        if (value instanceof _STArray) {
          return value;
        }
        if (isObjects(value)) {
          const bytes = [];
          value.forEach((obj) => {
            bytes.push(st_object_1.STObject.from(obj, void 0, definitions).toBytes());
          });
          bytes.push(ARRAY_END_MARKER);
          return new _STArray((0, utils_1.concat)(bytes));
        }
        throw new Error("Cannot construct STArray from value given");
      }
      /**
       * Return the JSON representation of this.bytes
       *
       * @param definitions optional, types and values to use to encode/decode a transaction
       * @returns An Array of JSON objects
       */
      toJSON(definitions = enums_1.DEFAULT_DEFINITIONS) {
        const result = [];
        const arrayParser = new binary_parser_1.BinaryParser(this.toString(), definitions);
        while (!arrayParser.end()) {
          const field = arrayParser.readField();
          if (field.name === ARRAY_END_MARKER_NAME) {
            break;
          }
          const outer = {};
          outer[field.name] = st_object_1.STObject.fromParser(arrayParser).toJSON(definitions);
          result.push(outer);
        }
        return result;
      }
    };
    exports.STArray = STArray;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint-16.js
var require_uint_16 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint-16.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UInt16 = void 0;
    var uint_1 = require_uint();
    var utils_1 = require_utils4();
    var UInt16 = class _UInt16 extends uint_1.UInt {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _UInt16.defaultUInt16.bytes);
      }
      static fromParser(parser) {
        return new _UInt16(parser.read(_UInt16.width));
      }
      /**
       * Construct a UInt16 object from a number
       *
       * @param val UInt16 object or number
       */
      static from(val) {
        if (val instanceof _UInt16) {
          return val;
        }
        if (typeof val === "number" && Number.isInteger(val)) {
          _UInt16.checkUintRange(val, 0, 65535);
          const buf = new Uint8Array(_UInt16.width);
          (0, utils_1.writeUInt16BE)(buf, val, 0);
          return new _UInt16(buf);
        }
        throw new Error("Cannot construct UInt16 from given value");
      }
      /**
       * get the value of a UInt16 object
       *
       * @returns the number represented by this.bytes
       */
      valueOf() {
        return parseInt((0, utils_1.readUInt16BE)(this.bytes, 0));
      }
    };
    exports.UInt16 = UInt16;
    UInt16.width = 16 / 8;
    UInt16.defaultUInt16 = new UInt16(new Uint8Array(UInt16.width));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint-32.js
var require_uint_32 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint-32.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UInt32 = void 0;
    var uint_1 = require_uint();
    var utils_1 = require_utils4();
    var UInt32 = class _UInt32 extends uint_1.UInt {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _UInt32.defaultUInt32.bytes);
      }
      static fromParser(parser) {
        return new _UInt32(parser.read(_UInt32.width));
      }
      /**
       * Construct a UInt32 object from a number
       *
       * @param val UInt32 object or number
       */
      static from(val) {
        if (val instanceof _UInt32) {
          return val;
        }
        const buf = new Uint8Array(_UInt32.width);
        if (typeof val === "string") {
          const num2 = Number.parseInt(val);
          (0, utils_1.writeUInt32BE)(buf, num2, 0);
          return new _UInt32(buf);
        }
        if (typeof val === "number" && Number.isInteger(val)) {
          _UInt32.checkUintRange(val, 0, 4294967295);
          (0, utils_1.writeUInt32BE)(buf, val, 0);
          return new _UInt32(buf);
        }
        throw new Error("Cannot construct UInt32 from given value");
      }
      /**
       * get the value of a UInt32 object
       *
       * @returns the number represented by this.bytes
       */
      valueOf() {
        return parseInt((0, utils_1.readUInt32BE)(this.bytes, 0), 10);
      }
    };
    exports.UInt32 = UInt32;
    UInt32.width = 32 / 8;
    UInt32.defaultUInt32 = new UInt32(new Uint8Array(UInt32.width));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint-8.js
var require_uint_8 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/uint-8.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UInt8 = void 0;
    var uint_1 = require_uint();
    var utils_1 = require_utils();
    var utils_2 = require_utils4();
    var UInt8 = class _UInt8 extends uint_1.UInt {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _UInt8.defaultUInt8.bytes);
      }
      static fromParser(parser) {
        return new _UInt8(parser.read(_UInt8.width));
      }
      /**
       * Construct a UInt8 object from a number
       *
       * @param val UInt8 object or number
       */
      static from(val) {
        if (val instanceof _UInt8) {
          return val;
        }
        if (typeof val === "number" && Number.isInteger(val)) {
          _UInt8.checkUintRange(val, 0, 255);
          const buf = new Uint8Array(_UInt8.width);
          (0, utils_2.writeUInt8)(buf, val, 0);
          return new _UInt8(buf);
        }
        throw new Error("Cannot construct UInt8 from given value");
      }
      /**
       * get the value of a UInt8 object
       *
       * @returns the number represented by this.bytes
       */
      valueOf() {
        return parseInt((0, utils_1.bytesToHex)(this.bytes), 16);
      }
    };
    exports.UInt8 = UInt8;
    UInt8.width = 8 / 8;
    UInt8.defaultUInt8 = new UInt8(new Uint8Array(UInt8.width));
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/vector-256.js
var require_vector_256 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/vector-256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector256 = void 0;
    var serialized_type_1 = require_serialized_type();
    var hash_256_1 = require_hash_256();
    var binary_serializer_1 = require_binary_serializer();
    var utils_1 = require_utils();
    function isStrings(arg) {
      return Array.isArray(arg) && (arg.length === 0 || typeof arg[0] === "string");
    }
    var Vector256 = class _Vector256 extends serialized_type_1.SerializedType {
      constructor(bytes) {
        super(bytes);
      }
      /**
       * Construct a Vector256 from a BinaryParser
       *
       * @param parser BinaryParser to
       * @param hint length of the vector, in bytes, optional
       * @returns a Vector256 object
       */
      static fromParser(parser, hint) {
        const bytesList = new binary_serializer_1.BytesList();
        const bytes = hint !== null && hint !== void 0 ? hint : parser.size();
        const hashes = bytes / 32;
        for (let i = 0; i < hashes; i++) {
          hash_256_1.Hash256.fromParser(parser).toBytesSink(bytesList);
        }
        return new _Vector256(bytesList.toBytes());
      }
      /**
       * Construct a Vector256 object from an array of hashes
       *
       * @param value A Vector256 object or array of hex-strings representing Hash256's
       * @returns a Vector256 object
       */
      static from(value) {
        if (value instanceof _Vector256) {
          return value;
        }
        if (isStrings(value)) {
          const bytesList = new binary_serializer_1.BytesList();
          value.forEach((hash) => {
            hash_256_1.Hash256.from(hash).toBytesSink(bytesList);
          });
          return new _Vector256(bytesList.toBytes());
        }
        throw new Error("Cannot construct Vector256 from given value");
      }
      /**
       * Return an Array of hex-strings represented by this.bytes
       *
       * @returns An Array of strings representing the Hash256 objects
       */
      toJSON() {
        if (this.bytes.byteLength % 32 !== 0) {
          throw new Error("Invalid bytes for Vector256");
        }
        const result = [];
        for (let i = 0; i < this.bytes.byteLength; i += 32) {
          result.push((0, utils_1.bytesToHex)(this.bytes.slice(i, i + 32)));
        }
        return result;
      }
    };
    exports.Vector256 = Vector256;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/xchain-bridge.js
var require_xchain_bridge = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/xchain-bridge.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XChainBridge = void 0;
    var binary_parser_1 = require_binary_parser();
    var account_id_1 = require_account_id();
    var serialized_type_1 = require_serialized_type();
    var issue_1 = require_issue();
    var utils_1 = require_utils();
    function isXChainBridgeObject(arg) {
      const keys = Object.keys(arg).sort();
      return keys.length === 4 && keys[0] === "IssuingChainDoor" && keys[1] === "IssuingChainIssue" && keys[2] === "LockingChainDoor" && keys[3] === "LockingChainIssue";
    }
    var XChainBridge = class _XChainBridge extends serialized_type_1.SerializedType {
      constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : _XChainBridge.ZERO_XCHAIN_BRIDGE.bytes);
      }
      /**
       * Construct a cross-chain bridge from a JSON
       *
       * @param value XChainBridge or JSON to parse into an XChainBridge
       * @returns An XChainBridge object
       */
      static from(value) {
        if (value instanceof _XChainBridge) {
          return value;
        }
        if (!isXChainBridgeObject(value)) {
          throw new Error("Invalid type to construct an XChainBridge");
        }
        const bytes = [];
        this.TYPE_ORDER.forEach((item) => {
          const { name, type } = item;
          if (type === account_id_1.AccountID) {
            bytes.push(Uint8Array.from([20]));
          }
          const object = type.from(value[name]);
          bytes.push(object.toBytes());
        });
        return new _XChainBridge((0, utils_1.concat)(bytes));
      }
      /**
       * Read an XChainBridge from a BinaryParser
       *
       * @param parser BinaryParser to read the XChainBridge from
       * @returns An XChainBridge object
       */
      static fromParser(parser) {
        const bytes = [];
        this.TYPE_ORDER.forEach((item) => {
          const { type } = item;
          if (type === account_id_1.AccountID) {
            parser.skip(1);
            bytes.push(Uint8Array.from([20]));
          }
          const object = type.fromParser(parser);
          bytes.push(object.toBytes());
        });
        return new _XChainBridge((0, utils_1.concat)(bytes));
      }
      /**
       * Get the JSON representation of this XChainBridge
       *
       * @returns the JSON interpretation of this.bytes
       */
      toJSON() {
        const parser = new binary_parser_1.BinaryParser(this.toString());
        const json = {};
        _XChainBridge.TYPE_ORDER.forEach((item) => {
          const { name, type } = item;
          if (type === account_id_1.AccountID) {
            parser.skip(1);
          }
          const object = type.fromParser(parser).toJSON();
          json[name] = object;
        });
        return json;
      }
    };
    exports.XChainBridge = XChainBridge;
    XChainBridge.ZERO_XCHAIN_BRIDGE = new XChainBridge((0, utils_1.concat)([
      Uint8Array.from([20]),
      new Uint8Array(40),
      Uint8Array.from([20]),
      new Uint8Array(40)
    ]));
    XChainBridge.TYPE_ORDER = [
      { name: "LockingChainDoor", type: account_id_1.AccountID },
      { name: "LockingChainIssue", type: issue_1.Issue },
      { name: "IssuingChainDoor", type: account_id_1.AccountID },
      { name: "IssuingChainIssue", type: issue_1.Issue }
    ];
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/index.js
var require_types = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/types/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector256 = exports.UInt64 = exports.UInt32 = exports.UInt16 = exports.UInt8 = exports.STObject = exports.STArray = exports.PathSet = exports.Int32 = exports.Hash256 = exports.Hash192 = exports.Hash160 = exports.Hash128 = exports.Currency = exports.Blob = exports.Amount = exports.AccountID = exports.coreTypes = void 0;
    var account_id_1 = require_account_id();
    Object.defineProperty(exports, "AccountID", { enumerable: true, get: function() {
      return account_id_1.AccountID;
    } });
    var amount_1 = require_amount();
    Object.defineProperty(exports, "Amount", { enumerable: true, get: function() {
      return amount_1.Amount;
    } });
    var blob_1 = require_blob();
    Object.defineProperty(exports, "Blob", { enumerable: true, get: function() {
      return blob_1.Blob;
    } });
    var currency_1 = require_currency();
    Object.defineProperty(exports, "Currency", { enumerable: true, get: function() {
      return currency_1.Currency;
    } });
    var hash_128_1 = require_hash_128();
    Object.defineProperty(exports, "Hash128", { enumerable: true, get: function() {
      return hash_128_1.Hash128;
    } });
    var hash_160_1 = require_hash_160();
    Object.defineProperty(exports, "Hash160", { enumerable: true, get: function() {
      return hash_160_1.Hash160;
    } });
    var hash_192_1 = require_hash_192();
    Object.defineProperty(exports, "Hash192", { enumerable: true, get: function() {
      return hash_192_1.Hash192;
    } });
    var hash_256_1 = require_hash_256();
    Object.defineProperty(exports, "Hash256", { enumerable: true, get: function() {
      return hash_256_1.Hash256;
    } });
    var int_32_1 = require_int_32();
    Object.defineProperty(exports, "Int32", { enumerable: true, get: function() {
      return int_32_1.Int32;
    } });
    var issue_1 = require_issue();
    var st_number_1 = require_st_number();
    var path_set_1 = require_path_set();
    Object.defineProperty(exports, "PathSet", { enumerable: true, get: function() {
      return path_set_1.PathSet;
    } });
    var st_array_1 = require_st_array();
    Object.defineProperty(exports, "STArray", { enumerable: true, get: function() {
      return st_array_1.STArray;
    } });
    var st_object_1 = require_st_object();
    Object.defineProperty(exports, "STObject", { enumerable: true, get: function() {
      return st_object_1.STObject;
    } });
    var uint_16_1 = require_uint_16();
    Object.defineProperty(exports, "UInt16", { enumerable: true, get: function() {
      return uint_16_1.UInt16;
    } });
    var uint_32_1 = require_uint_32();
    Object.defineProperty(exports, "UInt32", { enumerable: true, get: function() {
      return uint_32_1.UInt32;
    } });
    var uint_64_1 = require_uint_64();
    Object.defineProperty(exports, "UInt64", { enumerable: true, get: function() {
      return uint_64_1.UInt64;
    } });
    var uint_8_1 = require_uint_8();
    Object.defineProperty(exports, "UInt8", { enumerable: true, get: function() {
      return uint_8_1.UInt8;
    } });
    var vector_256_1 = require_vector_256();
    Object.defineProperty(exports, "Vector256", { enumerable: true, get: function() {
      return vector_256_1.Vector256;
    } });
    var xchain_bridge_1 = require_xchain_bridge();
    var enums_1 = require_enums();
    var coreTypes = {
      AccountID: account_id_1.AccountID,
      Amount: amount_1.Amount,
      Blob: blob_1.Blob,
      Currency: currency_1.Currency,
      Hash128: hash_128_1.Hash128,
      Hash160: hash_160_1.Hash160,
      Hash192: hash_192_1.Hash192,
      Hash256: hash_256_1.Hash256,
      Int32: int_32_1.Int32,
      Issue: issue_1.Issue,
      Number: st_number_1.STNumber,
      PathSet: path_set_1.PathSet,
      STArray: st_array_1.STArray,
      STObject: st_object_1.STObject,
      UInt8: uint_8_1.UInt8,
      UInt16: uint_16_1.UInt16,
      UInt32: uint_32_1.UInt32,
      UInt64: uint_64_1.UInt64,
      Vector256: vector_256_1.Vector256,
      XChainBridge: xchain_bridge_1.XChainBridge
    };
    exports.coreTypes = coreTypes;
    enums_1.DEFAULT_DEFINITIONS.associateTypes(coreTypes);
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/hash-prefixes.js
var require_hash_prefixes = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/hash-prefixes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HashPrefix = void 0;
    var utils_1 = require_utils4();
    function bytes(uint32) {
      const result = new Uint8Array(4);
      (0, utils_1.writeUInt32BE)(result, uint32, 0);
      return result;
    }
    var HashPrefix = {
      transactionID: bytes(1415073280),
      // transaction plus metadata
      transaction: bytes(1397638144),
      // account state
      accountStateEntry: bytes(1296846336),
      // inner node in tree
      innerNode: bytes(1296649728),
      // ledger master data for signing
      ledgerHeader: bytes(1280791040),
      // inner transaction to sign
      transactionSig: bytes(1398036480),
      // inner transaction to sign
      transactionMultiSig: bytes(1397576704),
      // validation for signing
      validation: bytes(1447119872),
      // proposal for signing
      proposal: bytes(1347571712),
      // payment channel claim
      paymentChannelClaim: bytes(1129073920),
      // batch
      batch: bytes(1111705600)
    };
    exports.HashPrefix = HashPrefix;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/hashes.js
var require_hashes = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/hashes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transactionID = exports.sha512Half = exports.Sha512Half = void 0;
    var hash_prefixes_1 = require_hash_prefixes();
    var types_1 = require_types();
    var binary_serializer_1 = require_binary_serializer();
    var sha512_1 = require_sha512();
    var Sha512Half = class _Sha512Half extends binary_serializer_1.BytesList {
      constructor() {
        super(...arguments);
        this.hash = sha512_1.sha512.create();
      }
      /**
       * Construct a new Sha512Hash and write bytes this.hash
       *
       * @param bytes bytes to write to this.hash
       * @returns the new Sha512Hash object
       */
      static put(bytes) {
        return new _Sha512Half().put(bytes);
      }
      /**
       * Write bytes to an existing Sha512Hash
       *
       * @param bytes bytes to write to object
       * @returns the Sha512 object
       */
      put(bytes) {
        this.hash.update(bytes);
        return this;
      }
      /**
       * Compute SHA512 hash and slice in half
       *
       * @returns half of a SHA512 hash
       */
      finish256() {
        return Uint8Array.from(this.hash.digest().slice(0, 32));
      }
      /**
       * Constructs a Hash256 from the Sha512Half object
       *
       * @returns a Hash256 object
       */
      finish() {
        return new types_1.Hash256(this.finish256());
      }
    };
    exports.Sha512Half = Sha512Half;
    function sha512Half(...args) {
      const hash = new Sha512Half();
      args.forEach((a) => hash.put(a));
      return hash.finish256();
    }
    exports.sha512Half = sha512Half;
    function transactionID(serialized) {
      return new types_1.Hash256(sha512Half(hash_prefixes_1.HashPrefix.transactionID, serialized));
    }
    exports.transactionID = transactionID;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/binary.js
var require_binary = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/binary.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signingBatchData = exports.transactionID = exports.sha512Half = exports.binaryToJSON = exports.signingClaimData = exports.signingData = exports.multiSigningData = exports.readJSON = exports.serializeObject = exports.makeParser = exports.BytesList = exports.BinarySerializer = exports.BinaryParser = void 0;
    var utils_1 = require_utils();
    var types_1 = require_types();
    var binary_parser_1 = require_binary_parser();
    Object.defineProperty(exports, "BinaryParser", { enumerable: true, get: function() {
      return binary_parser_1.BinaryParser;
    } });
    var hash_prefixes_1 = require_hash_prefixes();
    var binary_serializer_1 = require_binary_serializer();
    Object.defineProperty(exports, "BinarySerializer", { enumerable: true, get: function() {
      return binary_serializer_1.BinarySerializer;
    } });
    Object.defineProperty(exports, "BytesList", { enumerable: true, get: function() {
      return binary_serializer_1.BytesList;
    } });
    var hashes_1 = require_hashes();
    Object.defineProperty(exports, "sha512Half", { enumerable: true, get: function() {
      return hashes_1.sha512Half;
    } });
    Object.defineProperty(exports, "transactionID", { enumerable: true, get: function() {
      return hashes_1.transactionID;
    } });
    var enums_1 = require_enums();
    var makeParser = (bytes, definitions) => new binary_parser_1.BinaryParser(bytes instanceof Uint8Array ? (0, utils_1.bytesToHex)(bytes) : bytes, definitions);
    exports.makeParser = makeParser;
    var readJSON = (parser, definitions = enums_1.DEFAULT_DEFINITIONS) => parser.readType(types_1.coreTypes.STObject).toJSON(definitions);
    exports.readJSON = readJSON;
    var binaryToJSON = (bytes, definitions) => readJSON(makeParser(bytes, definitions), definitions);
    exports.binaryToJSON = binaryToJSON;
    function serializeObject(object, opts = {}) {
      const { prefix, suffix, signingFieldsOnly = false, definitions } = opts;
      const bytesList = new binary_serializer_1.BytesList();
      if (prefix) {
        bytesList.put(prefix);
      }
      const filter = signingFieldsOnly ? (f) => f.isSigningField : void 0;
      types_1.coreTypes.STObject.from(object, filter, definitions).toBytesSink(bytesList);
      if (suffix) {
        bytesList.put(suffix);
      }
      return bytesList.toBytes();
    }
    exports.serializeObject = serializeObject;
    function signingData(transaction, prefix = hash_prefixes_1.HashPrefix.transactionSig, opts = {}) {
      return serializeObject(transaction, {
        prefix,
        signingFieldsOnly: true,
        definitions: opts.definitions
      });
    }
    exports.signingData = signingData;
    function signingClaimData(claim) {
      const num2 = BigInt(String(claim.amount));
      const prefix = hash_prefixes_1.HashPrefix.paymentChannelClaim;
      const channel = types_1.coreTypes.Hash256.from(claim.channel).toBytes();
      const amount = types_1.coreTypes.UInt64.from(num2).toBytes();
      const bytesList = new binary_serializer_1.BytesList();
      bytesList.put(prefix);
      bytesList.put(channel);
      bytesList.put(amount);
      return bytesList.toBytes();
    }
    exports.signingClaimData = signingClaimData;
    function multiSigningData(transaction, signingAccount, opts = {
      definitions: enums_1.DEFAULT_DEFINITIONS
    }) {
      const prefix = hash_prefixes_1.HashPrefix.transactionMultiSig;
      const suffix = types_1.coreTypes.AccountID.from(signingAccount).toBytes();
      return serializeObject(transaction, {
        prefix,
        suffix,
        signingFieldsOnly: true,
        definitions: opts.definitions
      });
    }
    exports.multiSigningData = multiSigningData;
    function signingBatchData(batch) {
      if (batch.flags == null) {
        throw Error("No field `flags'");
      }
      if (batch.txIDs == null) {
        throw Error("No field `txIDs`");
      }
      const prefix = hash_prefixes_1.HashPrefix.batch;
      const flags = types_1.coreTypes.UInt32.from(batch.flags).toBytes();
      const txIDsLength = types_1.coreTypes.UInt32.from(batch.txIDs.length).toBytes();
      const bytesList = new binary_serializer_1.BytesList();
      bytesList.put(prefix);
      bytesList.put(flags);
      bytesList.put(txIDsLength);
      batch.txIDs.forEach((txID) => {
        bytesList.put(types_1.coreTypes.Hash256.from(txID).toBytes());
      });
      return bytesList.toBytes();
    }
    exports.signingBatchData = signingBatchData;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/shamap.js
var require_shamap = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/shamap.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShaMapLeaf = exports.ShaMapNode = exports.ShaMap = void 0;
    var types_1 = require_types();
    var hash_prefixes_1 = require_hash_prefixes();
    var hashes_1 = require_hashes();
    var ShaMapNode = class {
    };
    exports.ShaMapNode = ShaMapNode;
    var ShaMapLeaf = class extends ShaMapNode {
      constructor(index, item) {
        super();
        this.index = index;
        this.item = item;
      }
      /**
       * @returns true as ShaMapLeaf is a leaf node
       */
      isLeaf() {
        return true;
      }
      /**
       * @returns false as ShaMapLeaf is not an inner node
       */
      isInner() {
        return false;
      }
      /**
       * Get the prefix of the this.item
       *
       * @returns The hash prefix, unless this.item is undefined, then it returns an empty Uint8Array
       */
      hashPrefix() {
        return this.item === void 0 ? new Uint8Array(0) : this.item.hashPrefix();
      }
      /**
       * Hash the bytes representation of this
       *
       * @returns hash of this.item concatenated with this.index
       */
      hash() {
        const hash = hashes_1.Sha512Half.put(this.hashPrefix());
        this.toBytesSink(hash);
        return hash.finish();
      }
      /**
       * Write the bytes representation of this to a BytesList
       * @param list BytesList to write bytes to
       */
      toBytesSink(list) {
        if (this.item !== void 0) {
          this.item.toBytesSink(list);
        }
        this.index.toBytesSink(list);
      }
    };
    exports.ShaMapLeaf = ShaMapLeaf;
    var ShaMapInner = class _ShaMapInner extends ShaMapNode {
      constructor(depth = 0) {
        super();
        this.depth = depth;
        this.slotBits = 0;
        this.branches = Array(16);
      }
      /**
       * @returns true as ShaMapInner is an inner node
       */
      isInner() {
        return true;
      }
      /**
       * @returns false as ShaMapInner is not a leaf node
       */
      isLeaf() {
        return false;
      }
      /**
       * Get the hash prefix for this node
       *
       * @returns hash prefix describing an inner node
       */
      hashPrefix() {
        return hash_prefixes_1.HashPrefix.innerNode;
      }
      /**
       * Set a branch of this node to be another node
       *
       * @param slot Slot to add branch to this.branches
       * @param branch Branch to add
       */
      setBranch(slot, branch) {
        this.slotBits = this.slotBits | 1 << slot;
        this.branches[slot] = branch;
      }
      /**
       * @returns true if node is empty
       */
      empty() {
        return this.slotBits === 0;
      }
      /**
       * Compute the hash of this node
       *
       * @returns The hash of this node
       */
      hash() {
        if (this.empty()) {
          return types_1.coreTypes.Hash256.ZERO_256;
        }
        const hash = hashes_1.Sha512Half.put(this.hashPrefix());
        this.toBytesSink(hash);
        return hash.finish();
      }
      /**
       * Writes the bytes representation of this node to a BytesList
       *
       * @param list BytesList to write bytes to
       */
      toBytesSink(list) {
        for (let i = 0; i < this.branches.length; i++) {
          const branch = this.branches[i];
          const hash = branch ? branch.hash() : types_1.coreTypes.Hash256.ZERO_256;
          hash.toBytesSink(list);
        }
      }
      /**
       * Add item to the SHAMap
       *
       * @param index Hash of the index of the item being inserted
       * @param item Item to insert in the map
       * @param leaf Leaf node to insert when branch doesn't exist
       */
      addItem(index, item, leaf) {
        if (index === void 0) {
          throw new Error();
        }
        if (index !== void 0) {
          const nibble = index.nibblet(this.depth);
          const existing = this.branches[nibble];
          if (existing === void 0) {
            this.setBranch(nibble, leaf || new ShaMapLeaf(index, item));
          } else if (existing instanceof ShaMapLeaf) {
            const newInner = new _ShaMapInner(this.depth + 1);
            newInner.addItem(existing.index, void 0, existing);
            newInner.addItem(index, item, leaf);
            this.setBranch(nibble, newInner);
          } else if (existing instanceof _ShaMapInner) {
            existing.addItem(index, item, leaf);
          } else {
            throw new Error("invalid ShaMap.addItem call");
          }
        }
      }
    };
    var ShaMap = class extends ShaMapInner {
    };
    exports.ShaMap = ShaMap;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/ledger-hashes.js
var require_ledger_hashes = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/ledger-hashes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeLedgerData = exports.ledgerHash = exports.transactionTreeHash = exports.accountStateHash = void 0;
    var shamap_1 = require_shamap();
    var hash_prefixes_1 = require_hash_prefixes();
    var hashes_1 = require_hashes();
    var binary_1 = require_binary();
    var hash_256_1 = require_hash_256();
    var st_object_1 = require_st_object();
    var uint_64_1 = require_uint_64();
    var uint_32_1 = require_uint_32();
    var uint_8_1 = require_uint_8();
    var binary_parser_1 = require_binary_parser();
    function computeHash(itemizer, itemsJson) {
      const map = new shamap_1.ShaMap();
      itemsJson.forEach((item) => map.addItem(...itemizer(item)));
      return map.hash();
    }
    function transactionItemizer(json) {
      if (!json.hash) {
        throw new Error();
      }
      const index = hash_256_1.Hash256.from(json.hash);
      const item = {
        hashPrefix() {
          return hash_prefixes_1.HashPrefix.transaction;
        },
        toBytesSink(sink) {
          const serializer = new binary_1.BinarySerializer(sink);
          serializer.writeLengthEncoded(st_object_1.STObject.from(json));
          serializer.writeLengthEncoded(st_object_1.STObject.from(json.metaData));
        }
      };
      return [index, item, void 0];
    }
    function entryItemizer(json) {
      const index = hash_256_1.Hash256.from(json.index);
      const bytes = (0, binary_1.serializeObject)(json);
      const item = {
        hashPrefix() {
          return hash_prefixes_1.HashPrefix.accountStateEntry;
        },
        toBytesSink(sink) {
          sink.put(bytes);
        }
      };
      return [index, item, void 0];
    }
    function transactionTreeHash(param) {
      const itemizer = transactionItemizer;
      return computeHash(itemizer, param);
    }
    exports.transactionTreeHash = transactionTreeHash;
    function accountStateHash(param) {
      const itemizer = entryItemizer;
      return computeHash(itemizer, param);
    }
    exports.accountStateHash = accountStateHash;
    function ledgerHash(header) {
      const hash = new hashes_1.Sha512Half();
      hash.put(hash_prefixes_1.HashPrefix.ledgerHeader);
      if (header.parent_close_time === void 0 || header.close_flags === void 0) {
        throw new Error();
      }
      uint_32_1.UInt32.from(header.ledger_index).toBytesSink(hash);
      uint_64_1.UInt64.from(BigInt(String(header.total_coins))).toBytesSink(hash);
      hash_256_1.Hash256.from(header.parent_hash).toBytesSink(hash);
      hash_256_1.Hash256.from(header.transaction_hash).toBytesSink(hash);
      hash_256_1.Hash256.from(header.account_hash).toBytesSink(hash);
      uint_32_1.UInt32.from(header.parent_close_time).toBytesSink(hash);
      uint_32_1.UInt32.from(header.close_time).toBytesSink(hash);
      uint_8_1.UInt8.from(header.close_time_resolution).toBytesSink(hash);
      uint_8_1.UInt8.from(header.close_flags).toBytesSink(hash);
      return hash.finish();
    }
    exports.ledgerHash = ledgerHash;
    function decodeLedgerData(binary, definitions) {
      if (typeof binary !== "string") {
        throw new Error("binary must be a hex string");
      }
      const parser = new binary_parser_1.BinaryParser(binary, definitions);
      return {
        ledger_index: parser.readUInt32(),
        total_coins: parser.readType(uint_64_1.UInt64).valueOf().toString(),
        parent_hash: parser.readType(hash_256_1.Hash256).toHex(),
        transaction_hash: parser.readType(hash_256_1.Hash256).toHex(),
        account_hash: parser.readType(hash_256_1.Hash256).toHex(),
        parent_close_time: parser.readUInt32(),
        close_time: parser.readUInt32(),
        close_time_resolution: parser.readUInt8(),
        close_flags: parser.readUInt8()
      };
    }
    exports.decodeLedgerData = decodeLedgerData;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/quality.js
var require_quality = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/quality.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.quality = void 0;
    var types_1 = require_types();
    var bignumber_js_1 = __importDefault(require_bignumber());
    var utils_1 = require_utils();
    var quality = class {
      /**
       * Encode quality amount
       *
       * @param arg string representation of an amount
       * @returns Serialized quality
       */
      static encode(quality2) {
        let decimal;
        try {
          decimal = new bignumber_js_1.default(quality2);
        } catch (_err) {
          throw new Error(`${quality2} is not a valid quality`);
        }
        const exponent = (decimal.e || 0) - 15;
        const qualityString = decimal.times(`1e${-exponent}`).abs().toString();
        const bytes = types_1.coreTypes.UInt64.from(BigInt(qualityString)).toBytes();
        bytes[0] = exponent + 100;
        return bytes;
      }
      /**
       * Decode quality amount
       *
       * @param arg hex-string denoting serialized quality
       * @returns deserialized quality
       */
      static decode(quality2) {
        const bytes = (0, utils_1.hexToBytes)(quality2).slice(-8);
        const exponent = bytes[0] - 100;
        let mantissa;
        try {
          mantissa = new bignumber_js_1.default(`0x${(0, utils_1.bytesToHex)(bytes.slice(1))}`);
        } catch (_err) {
          throw new Error(`${quality2} is not a valid quality`);
        }
        return mantissa.times(`1e${exponent}`);
      }
    };
    exports.quality = quality;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/coretypes.js
var require_coretypes = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/coretypes.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod2) {
      if (mod2 && mod2.__esModule) return mod2;
      var result = {};
      if (mod2 != null) {
        for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding(result, mod2, k);
      }
      __setModuleDefault(result, mod2);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.types = exports.ShaMap = exports.HashPrefix = exports.quality = exports.TransactionResult = exports.Type = exports.LedgerEntryType = exports.TransactionType = exports.Field = exports.DEFAULT_DEFINITIONS = exports.ledgerHashes = exports.binary = exports.hashes = void 0;
    var enums_1 = require_enums();
    Object.defineProperty(exports, "DEFAULT_DEFINITIONS", { enumerable: true, get: function() {
      return enums_1.DEFAULT_DEFINITIONS;
    } });
    Object.defineProperty(exports, "Field", { enumerable: true, get: function() {
      return enums_1.Field;
    } });
    Object.defineProperty(exports, "TransactionType", { enumerable: true, get: function() {
      return enums_1.TransactionType;
    } });
    Object.defineProperty(exports, "LedgerEntryType", { enumerable: true, get: function() {
      return enums_1.LedgerEntryType;
    } });
    Object.defineProperty(exports, "Type", { enumerable: true, get: function() {
      return enums_1.Type;
    } });
    Object.defineProperty(exports, "TransactionResult", { enumerable: true, get: function() {
      return enums_1.TransactionResult;
    } });
    var types = __importStar(require_types());
    exports.types = types;
    var binary = __importStar(require_binary());
    exports.binary = binary;
    var shamap_1 = require_shamap();
    Object.defineProperty(exports, "ShaMap", { enumerable: true, get: function() {
      return shamap_1.ShaMap;
    } });
    var ledgerHashes = __importStar(require_ledger_hashes());
    exports.ledgerHashes = ledgerHashes;
    var hashes = __importStar(require_hashes());
    exports.hashes = hashes;
    var quality_1 = require_quality();
    Object.defineProperty(exports, "quality", { enumerable: true, get: function() {
      return quality_1.quality;
    } });
    var hash_prefixes_1 = require_hash_prefixes();
    Object.defineProperty(exports, "HashPrefix", { enumerable: true, get: function() {
      return hash_prefixes_1.HashPrefix;
    } });
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/xrpl-definitions.js
var require_xrpl_definitions = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/enums/xrpl-definitions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XrplDefinitions = void 0;
    var xrpl_definitions_base_1 = require_xrpl_definitions_base();
    var types_1 = require_types();
    var XrplDefinitions = class extends xrpl_definitions_base_1.XrplDefinitionsBase {
      /**
       * Present rippled types in a typed and updatable format.
       * For an example of the input format see `definitions.json`
       * To generate a new definitions file from rippled source code, use the tool at
       * `packages/ripple-binary-codec/tools/generateDefinitions.js`.
       *
       * See the definitions.test.js file for examples of how to create your own updated definitions.json.
       *
       * @param enums - A json encoding of the core types, transaction types, transaction results, transaction names, and fields.
       * @param additionalTypes - A list of SerializedType objects with the same name as the fields defined.
       *              These types will be included in addition to the coreTypes used on mainnet.
       */
      constructor(enums, additionalTypes) {
        const types = Object.assign({}, types_1.coreTypes, additionalTypes);
        super(enums, types);
      }
    };
    exports.XrplDefinitions = XrplDefinitions;
  }
});

// ../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/index.js
var require_dist3 = __commonJS({
  "../../../node_modules/.pnpm/ripple-binary-codec@2.8.0/node_modules/ripple-binary-codec/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.coreTypes = exports.DEFAULT_DEFINITIONS = exports.XrplDefinitionsBase = exports.XrplDefinitions = exports.TRANSACTION_TYPES = exports.decodeLedgerData = exports.decodeQuality = exports.encodeQuality = exports.encodeForSigningBatch = exports.encodeForMultisigning = exports.encodeForSigningClaim = exports.encodeForSigning = exports.encode = exports.decode = void 0;
    var coretypes_1 = require_coretypes();
    var ledger_hashes_1 = require_ledger_hashes();
    Object.defineProperty(exports, "decodeLedgerData", { enumerable: true, get: function() {
      return ledger_hashes_1.decodeLedgerData;
    } });
    var enums_1 = require_enums();
    Object.defineProperty(exports, "XrplDefinitionsBase", { enumerable: true, get: function() {
      return enums_1.XrplDefinitionsBase;
    } });
    Object.defineProperty(exports, "TRANSACTION_TYPES", { enumerable: true, get: function() {
      return enums_1.TRANSACTION_TYPES;
    } });
    Object.defineProperty(exports, "DEFAULT_DEFINITIONS", { enumerable: true, get: function() {
      return enums_1.DEFAULT_DEFINITIONS;
    } });
    var xrpl_definitions_1 = require_xrpl_definitions();
    Object.defineProperty(exports, "XrplDefinitions", { enumerable: true, get: function() {
      return xrpl_definitions_1.XrplDefinitions;
    } });
    var types_1 = require_types();
    Object.defineProperty(exports, "coreTypes", { enumerable: true, get: function() {
      return types_1.coreTypes;
    } });
    var utils_1 = require_utils();
    var { signingData, signingClaimData, multiSigningData, signingBatchData, binaryToJSON, serializeObject } = coretypes_1.binary;
    function decode(binary, definitions) {
      if (typeof binary !== "string") {
        throw new Error("binary must be a hex string");
      }
      return binaryToJSON(binary, definitions);
    }
    exports.decode = decode;
    function encode2(json, definitions) {
      if (typeof json !== "object") {
        throw new Error();
      }
      return (0, utils_1.bytesToHex)(serializeObject(json, { definitions }));
    }
    exports.encode = encode2;
    function encodeForSigning2(json, definitions) {
      if (typeof json !== "object") {
        throw new Error();
      }
      return (0, utils_1.bytesToHex)(signingData(json, coretypes_1.HashPrefix.transactionSig, {
        definitions
      }));
    }
    exports.encodeForSigning = encodeForSigning2;
    function encodeForSigningClaim(json) {
      if (typeof json !== "object") {
        throw new Error();
      }
      return (0, utils_1.bytesToHex)(signingClaimData(json));
    }
    exports.encodeForSigningClaim = encodeForSigningClaim;
    function encodeForMultisigning(json, signer, definitions) {
      if (typeof json !== "object") {
        throw new Error();
      }
      const definitionsOpt = definitions ? { definitions } : void 0;
      return (0, utils_1.bytesToHex)(multiSigningData(json, signer, definitionsOpt));
    }
    exports.encodeForMultisigning = encodeForMultisigning;
    function encodeForSigningBatch(json) {
      if (typeof json !== "object") {
        throw new Error("Need an object to encode a Batch transaction");
      }
      return (0, utils_1.bytesToHex)(signingBatchData(json));
    }
    exports.encodeForSigningBatch = encodeForSigningBatch;
    function encodeQuality(value) {
      if (typeof value !== "string") {
        throw new Error();
      }
      return (0, utils_1.bytesToHex)(coretypes_1.quality.encode(value));
    }
    exports.encodeQuality = encodeQuality;
    function decodeQuality(value) {
      if (typeof value !== "string") {
        throw new Error();
      }
      return coretypes_1.quality.decode(value).toString();
    }
    exports.decodeQuality = decodeQuality;
  }
});

// src/base/server.ts
import http from "node:http";

// src/base/types.ts
function stringToBytes32Hex(s) {
  const buf = Buffer.alloc(32);
  buf.write(s, "utf-8");
  return "0x" + buf.toString("hex");
}
function bytes32HexToString(h) {
  h = h.startsWith("0x") ? h.slice(2) : h;
  const buf = Buffer.from(h, "hex");
  let end = buf.length;
  while (end > 0 && buf[end - 1] === 0) end--;
  return buf.subarray(0, end).toString("utf-8");
}
function versionToHex(version3) {
  return stringToBytes32Hex(version3);
}
var Framework = class {
  handlers = [];
  /**
   * Register a handler for an OPType/OPCommand pair.
   * Pass "" for opCommand to match any command.
   */
  handle(opType, opCommand, handler) {
    this.handlers.push({
      opType: stringToBytes32Hex(opType),
      opCommand: stringToBytes32Hex(opCommand),
      handler
    });
  }
  /** Find a handler matching the given opType and opCommand. */
  lookup(opType, opCommand) {
    const emptyCmd = stringToBytes32Hex("");
    for (const entry of this.handlers) {
      if (entry.opType !== opType) continue;
      if (entry.opCommand === emptyCmd || entry.opCommand === opCommand) {
        return entry.handler;
      }
    }
    return null;
  }
};

// src/base/encoding.ts
function hexToBytes(h) {
  h = h.startsWith("0x") ? h.slice(2) : h;
  if (h.length === 0) return new Uint8Array(0);
  const buf = Buffer.from(h, "hex");
  return new Uint8Array(buf);
}

// src/base/server.ts
var Server = class {
  extPort;
  signPort;
  version;
  versionHex;
  framework;
  reportState;
  server = null;
  // Serialize handler calls via a promise chain.
  handlerQueue = Promise.resolve();
  constructor(extPort2, signPort3, version3, register2, reportState2) {
    this.extPort = extPort2;
    this.signPort = signPort3;
    this.version = version3;
    this.versionHex = versionToHex(version3);
    this.framework = new Framework();
    this.reportState = reportState2;
    register2(this.framework);
  }
  /** Start the HTTP server (returns a promise that resolves when listening). */
  listenAndServe() {
    return new Promise((resolve) => {
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });
      this.server.listen(parseInt(this.extPort), () => {
        console.log(`extension listening on port ${this.extPort}`);
        resolve();
      });
    });
  }
  /** Close the HTTP server. */
  close() {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }
      this.server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  /**
   * Process a request directly (for testing).
   * Returns [statusCode, responseBody].
   */
  async handleRequestDirect(method, path, body) {
    if (method === "POST" && path === "/action") {
      return this.processAction(body);
    } else if (method === "GET" && path === "/state") {
      return this.processState();
    } else if (method === "GET" && path === "/action") {
      return [405, { error: "method not allowed" }];
    } else if (method === "POST" && path === "/state") {
      return [405, { error: "method not allowed" }];
    }
    return [404, { error: "not found" }];
  }
  handleRequest(req, res) {
    if (req.method === "POST" && req.url === "/action") {
      this.readBody(req).then(
        (body) => this.processAction(body).then(
          ([status, data]) => this.sendJson(res, status, data)
        ),
        () => this.sendJson(res, 400, { error: "failed to read body" })
      );
    } else if (req.method === "GET" && req.url === "/state") {
      this.processState().then(
        ([status, data]) => this.sendJson(res, status, data)
      );
    } else if (req.method === "GET" && req.url === "/action" || req.method === "POST" && req.url === "/state") {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("method not allowed");
    } else {
      res.writeHead(501, { "Content-Type": "text/plain" });
      res.end("unsupported op type");
    }
  }
  async processAction(body) {
    let action;
    try {
      action = JSON.parse(body);
    } catch {
      return [400, { error: "invalid action JSON" }];
    }
    let msgBytes;
    try {
      msgBytes = hexToBytes(action.data.message);
    } catch {
      return [400, { error: "invalid hex in message" }];
    }
    let df;
    try {
      df = JSON.parse(Buffer.from(msgBytes).toString("utf-8"));
    } catch {
      return [400, { error: "invalid DataFixed JSON in message" }];
    }
    const handler = this.framework.lookup(df.opType, df.opCommand);
    if (!handler) {
      return [501, "unsupported op type"];
    }
    let data;
    let status;
    let err;
    const resultPromise = new Promise(
      (resolve) => {
        this.handlerQueue = this.handlerQueue.then(async () => {
          const result2 = await handler(df.originalMessage ?? df.message ?? "");
          resolve(result2);
        });
      }
    );
    [data, status, err] = await resultPromise;
    const result = {
      id: action.data.id,
      submissionTag: action.data.submissionTag,
      opType: df.opType,
      opCommand: df.opCommand,
      version: this.versionHex,
      status,
      data: data ?? void 0
    };
    if (status === 0) {
      result.log = err ? `error: ${err}` : "error: unknown";
    } else if (status === 1) {
      result.log = "ok";
    } else {
      result.log = "pending";
    }
    console.log(
      `action ${action.data.id}: opType=${bytes32HexToString(df.opType)} opCommand=${bytes32HexToString(df.opCommand)} status=${status}`
    );
    return [200, result];
  }
  async processState() {
    let stateData;
    const resultPromise = new Promise((resolve) => {
      this.handlerQueue = this.handlerQueue.then(() => {
        resolve(this.reportState());
      });
    });
    stateData = await resultPromise;
    const resp = {
      stateVersion: this.versionHex,
      state: stateData
    };
    return [200, resp];
  }
  readBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      req.on("error", reject);
    });
  }
  sendJson(res, status, data) {
    if (typeof data === "string") {
      res.writeHead(status, { "Content-Type": "text/plain" });
      res.end(data);
    } else {
      const body = JSON.stringify(data);
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(body);
    }
  }
};

// src/app/config.ts
var VERSION = "0.1.0";
var OP_TYPE_HEIRLOOM = "HEIRLOOM";
var OP_COMMAND_SEAL = "SEAL";
var OP_COMMAND_EXECUTE = "EXECUTE";
var OP_COMMAND_ADDRESS = "ADDRESS";
var OP_COMMAND_PAYOUT = "PAYOUT";

// src/app/handlers.ts
import http2 from "node:http";

// ../../../node_modules/.pnpm/viem@2.55.13_typescript@5.9.3_zod@4.4.3/node_modules/viem/_esm/index.js
init_exports();
init_decodeAbiParameters();
init_encodeAbiParameters();
init_toBytes();
init_keccak256();

// src/app/heirloom/allocate.ts
var DEFAULT_BASE_RESERVE_DROPS = 1000000n;
var DEFAULT_FEE_PER_TX_DROPS = 12n;
var AllocationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AllocationError";
  }
};
function centsToDrops(cents, xrpUsdPriceE18) {
  if (xrpUsdPriceE18 <= 0n) throw new AllocationError("XRP/USD price must be positive");
  return cents * 10n ** 22n / xrpUsdPriceE18;
}
function allocate(input) {
  const { will, estateDrops, xrpUsdPriceE18 } = input;
  const baseReserve = input.baseReserveDrops ?? DEFAULT_BASE_RESERVE_DROPS;
  const feePerTx = input.feePerTxDrops ?? DEFAULT_FEE_PER_TX_DROPS;
  if (estateDrops < 0n) throw new AllocationError("estateDrops must not be negative");
  if (xrpUsdPriceE18 <= 0n) throw new AllocationError("XRP/USD price must be positive");
  const fixed = will.bequests.filter((b) => b.kind === "FIXED_USD" || b.kind === "FIXED_XRP");
  const shares = will.bequests.filter((b) => b.kind === "SHARE_BPS");
  const paymentCount = BigInt(fixed.length + shares.length + 1);
  const reserved = baseReserve + paymentCount * feePerTx;
  if (estateDrops <= reserved) {
    throw new AllocationError(
      `estate of ${estateDrops} drops cannot cover the account reserve and fees (${reserved} drops)`
    );
  }
  const distributable = estateDrops - reserved;
  const fixedRequests = fixed.map((b) => ({ bequest: b, want: fixedAmountInDrops(b, xrpUsdPriceE18) }));
  const totalFixedWanted = fixedRequests.reduce((sum, f) => sum + f.want, 0n);
  const abatementApplied = totalFixedWanted > distributable;
  const allocations = [];
  let paid = 0n;
  for (const { bequest, want } of fixedRequests) {
    const give = abatementApplied ? want * distributable / totalFixedWanted : want;
    paid += give;
    allocations.push({
      beneficiary: bequest.beneficiary,
      flareRecipient: bequest.flareRecipient,
      drops: give,
      source: bequest.kind,
      abated: abatementApplied
    });
  }
  const remainder = distributable - paid;
  for (const bequest of shares) {
    const give = remainder * BigInt(bequest.amount) / 10000n;
    paid += give;
    allocations.push({
      beneficiary: bequest.beneficiary,
      flareRecipient: bequest.flareRecipient,
      drops: give,
      source: "SHARE_BPS",
      abated: false
    });
  }
  const residue = distributable - paid;
  if (residue > 0n) {
    allocations.push({
      beneficiary: will.residuaryBeneficiary,
      drops: residue,
      source: "RESIDUE",
      abated: false
    });
    paid += residue;
  }
  const nonZero = allocations.filter((a) => a.drops > 0n);
  const distributed = nonZero.reduce((sum, a) => sum + a.drops, 0n);
  if (distributed + reserved !== estateDrops) {
    throw new AllocationError(
      `allocation does not conserve the estate: ${distributed} + ${reserved} != ${estateDrops}`
    );
  }
  return {
    allocations: nonZero,
    retainedDrops: reserved,
    distributedDrops: distributed,
    abatementApplied
  };
}
function fixedAmountInDrops(bequest, xrpUsdPriceE18) {
  const amount = BigInt(bequest.amount);
  return bequest.kind === "FIXED_USD" ? centsToDrops(amount, xrpUsdPriceE18) : amount;
}

// src/app/heirloom/xrpl.ts
var MEMO_TYPE = utf8ToHex("heirloom/v1");
function buildPayments(input) {
  const { estateAccount, allocations, startSequence, feePerTxDrops, lastLedgerSequence, vaultId } = input;
  return allocations.filter((a) => a.drops > 0n).map((allocation, i) => {
    const payment = {
      TransactionType: "Payment",
      Account: estateAccount,
      Destination: allocation.beneficiary,
      Amount: allocation.drops.toString(),
      Fee: feePerTxDrops.toString(),
      Sequence: startSequence + i,
      Memos: [
        {
          Memo: {
            MemoType: MEMO_TYPE,
            MemoData: utf8ToHex(`vault:${vaultId};clause:${allocation.source}`)
          }
        }
      ]
    };
    if (lastLedgerSequence !== void 0) {
      payment.LastLedgerSequence = lastLedgerSequence;
    }
    return payment;
  });
}
function utf8ToHex(value) {
  return Buffer.from(value, "utf8").toString("hex").toUpperCase();
}

// src/app/heirloom/enclaveSigner.ts
var import_ripple_keypairs = __toESM(require_dist2(), 1);
var import_ripple_binary_codec = __toESM(require_dist3(), 1);
import { createHash } from "node:crypto";
var DERIVATION_MESSAGE = "HEIRLOOM/XRPL-PAYOUT-KEY/v1";
var cached = null;
async function enclaveXrplIdentity(signViaNode2) {
  if (cached) return cached;
  const signature = await signViaNode2(new TextEncoder().encode(DERIVATION_MESSAGE));
  const entropy = new Uint8Array(createHash("sha256").update(signature).digest().subarray(0, 16));
  const seed = (0, import_ripple_keypairs.generateSeed)({ entropy, algorithm: "ecdsa-secp256k1" });
  const keypair = (0, import_ripple_keypairs.deriveKeypair)(seed);
  cached = { ...keypair, address: (0, import_ripple_keypairs.deriveAddress)(keypair.publicKey) };
  return cached;
}
function cachedXrplAddress() {
  return cached?.address ?? null;
}
function signXrplTx(tx, identity) {
  const signable = { ...tx, SigningPubKey: identity.publicKey };
  const signature = (0, import_ripple_keypairs.sign)((0, import_ripple_binary_codec.encodeForSigning)(signable), identity.privateKey);
  const blob = (0, import_ripple_binary_codec.encode)({ ...signable, TxnSignature: signature });
  const hash = createHash("sha512").update(Buffer.concat([Buffer.from([84, 88, 78, 0]), Buffer.from(blob, "hex")])).digest().subarray(0, 32).toString("hex").toUpperCase();
  return { blob, hash };
}

// src/app/heirloom/will.ts
var import_ripple_address_codec = __toESM(require_dist(), 1);
var WillValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "WillValidationError";
  }
};
var ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
var MAX_BEQUESTS = 64;
function assert(condition, message) {
  if (!condition) throw new WillValidationError(message);
}
function parseAmount(raw, field) {
  assert(typeof raw === "string" && /^\d+$/.test(raw), `${field} must be a non-negative integer string`);
  const value = BigInt(raw);
  assert(value > 0n, `${field} must be greater than zero`);
  return value;
}
function parseWill(raw) {
  assert(typeof raw === "object" && raw !== null, "will must be an object");
  const obj = raw;
  assert(
    typeof obj.vaultId === "number" && Number.isInteger(obj.vaultId) && obj.vaultId >= 0,
    "vaultId must be a non-negative integer"
  );
  assert(
    typeof obj.estateAccount === "string" && (0, import_ripple_address_codec.isValidClassicAddress)(obj.estateAccount),
    "estateAccount must be a valid XRPL classic address"
  );
  assert(
    typeof obj.residuaryBeneficiary === "string" && (0, import_ripple_address_codec.isValidClassicAddress)(obj.residuaryBeneficiary),
    "residuaryBeneficiary must be a valid XRPL classic address"
  );
  assert(Array.isArray(obj.bequests) && obj.bequests.length > 0, "will must contain at least one bequest");
  assert(obj.bequests.length <= MAX_BEQUESTS, `will may contain at most ${MAX_BEQUESTS} bequests`);
  let totalShareBps = 0n;
  const bequests = obj.bequests.map((entry, i) => {
    assert(typeof entry === "object" && entry !== null, `bequest ${i} must be an object`);
    const b = entry;
    assert(
      typeof b.beneficiary === "string" && (0, import_ripple_address_codec.isValidClassicAddress)(b.beneficiary),
      `bequest ${i}: beneficiary must be a valid XRPL classic address`
    );
    assert(
      b.kind === "FIXED_USD" || b.kind === "FIXED_XRP" || b.kind === "SHARE_BPS",
      `bequest ${i}: kind must be FIXED_USD, FIXED_XRP or SHARE_BPS`
    );
    const amount = parseAmount(b.amount, `bequest ${i}: amount`);
    if (b.kind === "SHARE_BPS") {
      totalShareBps += amount;
    }
    let flareRecipient;
    if (b.flareRecipient !== void 0 && b.flareRecipient !== null && b.flareRecipient !== "") {
      assert(
        typeof b.flareRecipient === "string" && /^0x[0-9a-fA-F]{40}$/.test(b.flareRecipient),
        `bequest ${i}: flareRecipient must be a 20-byte hex address`
      );
      flareRecipient = b.flareRecipient;
    }
    return {
      beneficiary: b.beneficiary,
      flareRecipient,
      kind: b.kind,
      amount: amount.toString()
    };
  });
  assert(totalShareBps <= 10000n, "share bequests may not exceed 100% (10000 bps) in total");
  return {
    vaultId: obj.vaultId,
    estateAccount: obj.estateAccount,
    bequests,
    residuaryBeneficiary: obj.residuaryBeneficiary
  };
}
function willCommitment(will) {
  const encoded = encodeAbiParameters(
    parseAbiParameters("uint256, string, string, (string, address, uint8, uint256)[]"),
    [
      BigInt(will.vaultId),
      will.estateAccount,
      will.residuaryBeneficiary,
      will.bequests.map((b) => [
        b.beneficiary,
        b.flareRecipient ?? ZERO_ADDRESS,
        kindToEnum(b.kind),
        BigInt(b.amount)
      ])
    ]
  );
  return keccak256(encoded);
}
function kindToEnum(kind) {
  switch (kind) {
    case "FIXED_USD":
      return 0;
    case "FIXED_XRP":
      return 1;
    case "SHARE_BPS":
      return 2;
  }
}
function standardAddressHash(address) {
  return keccak256(stringToBytes(address));
}

// src/app/handlers.ts
var signPort = "9090";
var sealsAttested = 0;
var estatesExecuted = 0;
var payoutsSigned = 0;
var executedCache = /* @__PURE__ */ new Map();
var paidOut = /* @__PURE__ */ new Set();
function setSignPort(port) {
  signPort = port;
}
function register(framework) {
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_SEAL, handleSeal);
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_EXECUTE, handleExecute);
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_ADDRESS, handleAddress);
  framework.handle(OP_TYPE_HEIRLOOM, OP_COMMAND_PAYOUT, handlePayout);
}
function reportState() {
  return { sealsAttested, estatesExecuted, payoutsSigned, xrplSigner: cachedXrplAddress(), version: VERSION };
}
var EXECUTE_MESSAGE = parseAbiParameters("(uint256, address, bytes32, bytes, uint256, uint256)");
function decodeExecuteMessage(msgHex) {
  const hex2 = msgHex.startsWith("0x") ? msgHex : `0x${msgHex}`;
  const [tuple] = decodeAbiParameters(EXECUTE_MESSAGE, hex2);
  return {
    vaultId: tuple[0],
    contractAddr: tuple[1],
    willCommitment: tuple[2],
    encryptedWill: tuple[3],
    xrpUsdPriceE18: tuple[4],
    estateDrops: tuple[5]
  };
}
async function openWill(message) {
  const ciphertext = Buffer.from(message.encryptedWill.slice(2), "hex");
  const plaintext = await decryptViaNode(new Uint8Array(ciphertext));
  const will = parseWill(JSON.parse(Buffer.from(plaintext).toString("utf-8")));
  if (Number(message.vaultId) !== will.vaultId) {
    throw new Error(`will is for vault ${will.vaultId}, instruction is for vault ${message.vaultId}`);
  }
  const commitment = willCommitment(will);
  if (commitment.toLowerCase() !== message.willCommitment.toLowerCase()) {
    throw new Error("sealed will does not match the commitment recorded on-chain");
  }
  return { will, commitment };
}
async function handleSeal(msg) {
  if (!msg) return [null, 0, "originalMessage is empty"];
  try {
    const message = decodeExecuteMessage(msg);
    const { will, commitment } = await openWill(message);
    const data = encodeAbiParameters(parseAbiParameters("address, uint256, bytes32, uint32"), [
      message.contractAddr,
      message.vaultId,
      commitment,
      will.bequests.length
    ]);
    sealsAttested += 1;
    console.log(`sealed will attested for vault ${message.vaultId} (${will.bequests.length} bequests)`);
    return [data, 1, null];
  } catch (e) {
    return [null, 0, errorMessage(e)];
  }
}
async function handleExecute(msg) {
  if (!msg) return [null, 0, "originalMessage is empty"];
  try {
    const message = decodeExecuteMessage(msg);
    const { will, commitment } = await openWill(message);
    const result = allocate({
      will,
      estateDrops: message.estateDrops,
      xrpUsdPriceE18: message.xrpUsdPriceE18
    });
    executedCache.set(Number(message.vaultId), {
      estateAccount: will.estateAccount,
      allocations: result.allocations.filter((a) => a.drops > 0n).map((a) => ({ beneficiary: a.beneficiary, drops: a.drops.toString(), source: a.source }))
    });
    const bequests = result.allocations.map((a) => [
      standardAddressHash(a.beneficiary),
      a.drops,
      a.flareRecipient ?? "0x0000000000000000000000000000000000000000"
    ]);
    const data = encodeAbiParameters(
      parseAbiParameters("address, uint256, bytes32, uint256, (bytes32, uint256, address)[]"),
      [message.contractAddr, message.vaultId, commitment, message.xrpUsdPriceE18, bequests]
    );
    estatesExecuted += 1;
    console.log(
      `executed vault ${message.vaultId}: ${result.allocations.length} payments, ${result.distributedDrops} drops distributed${result.abatementApplied ? " (abated)" : ""}`
    );
    return [data, 1, null];
  } catch (e) {
    return [null, 0, errorMessage(e)];
  }
}
async function handleAddress(_msg) {
  try {
    const identity = await enclaveXrplIdentity(signViaNode);
    return [utf8ToHexPayload(JSON.stringify({ address: identity.address })), 1, null];
  } catch (e) {
    return [null, 0, errorMessage(e)];
  }
}
async function handlePayout(msg) {
  if (!msg || msg === "0x") return [null, 0, "message is empty"];
  try {
    const req = JSON.parse(Buffer.from(msg.replace(/^0x/, ""), "hex").toString("utf-8"));
    const vaultId = Number(req.vaultId);
    const sequence = Number(req.sequence);
    const lastLedgerSequence = Number(req.lastLedgerSequence);
    if (!Number.isInteger(vaultId) || vaultId < 0) return [null, 0, "vaultId must be a non-negative integer"];
    if (!Number.isInteger(sequence) || sequence <= 0) return [null, 0, "sequence must be a positive integer"];
    if (!Number.isInteger(lastLedgerSequence) || lastLedgerSequence <= 0) {
      return [null, 0, "lastLedgerSequence must be a positive integer"];
    }
    const entry = executedCache.get(vaultId);
    if (!entry) {
      return [null, 0, `no executed distribution in enclave memory for vault ${vaultId} \u2014 EXECUTE must precede PAYOUT (a restart clears the cache)`];
    }
    if (paidOut.has(vaultId)) {
      return [null, 0, `payouts for vault ${vaultId} were already signed once \u2014 refusing a second signing, which could double-pay at a different sequence`];
    }
    const identity = await enclaveXrplIdentity(signViaNode);
    const payments = buildPayments({
      estateAccount: entry.estateAccount,
      allocations: entry.allocations.map((a) => ({
        beneficiary: a.beneficiary,
        drops: BigInt(a.drops),
        source: a.source
      })),
      startSequence: sequence,
      feePerTxDrops: DEFAULT_FEE_PER_TX_DROPS,
      lastLedgerSequence,
      vaultId
    });
    const signed = payments.map((p) => {
      const { blob, hash } = signXrplTx(p, identity);
      return { to: p.Destination, drops: p.Amount, blob, hash };
    });
    paidOut.add(vaultId);
    payoutsSigned += 1;
    console.log(`signed ${signed.length} payout(s) for vault ${vaultId} with enclave key ${identity.address}`);
    return [
      utf8ToHexPayload(JSON.stringify({ signer: identity.address, account: entry.estateAccount, payments: signed })),
      1,
      null
    ];
  } catch (e) {
    return [null, 0, errorMessage(e)];
  }
}
function signViaNode(message) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${signPort}/sign`;
    const body = JSON.stringify({ message: Buffer.from(message).toString("base64") });
    const req = http2.request(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const data = Buffer.concat(chunks).toString("utf-8");
          if (res.statusCode !== 200) {
            reject(new Error(`sign: node returned ${res.statusCode}: ${data}`));
            return;
          }
          try {
            resolve(new Uint8Array(Buffer.from(JSON.parse(data).signature, "base64")));
          } catch (e) {
            reject(new Error(`sign: decode response: ${e}`));
          }
        });
      }
    );
    req.on("error", (e) => reject(new Error(`sign: request error: ${e.message}`)));
    req.write(body);
    req.end();
  });
}
function utf8ToHexPayload(value) {
  return "0x" + Buffer.from(value, "utf-8").toString("hex");
}
function errorMessage(e) {
  return e instanceof Error ? e.message : String(e);
}
function decryptViaNode(ciphertext) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${signPort}/decrypt`;
    const body = JSON.stringify({
      encryptedMessage: Buffer.from(ciphertext).toString("base64")
    });
    const req = http2.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        }
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const data = Buffer.concat(chunks).toString("utf-8");
          if (res.statusCode !== 200) {
            reject(new Error(`node returned ${res.statusCode}: ${data}`));
            return;
          }
          try {
            const parsed = JSON.parse(data);
            resolve(new Uint8Array(Buffer.from(parsed.decryptedMessage, "base64")));
          } catch (e) {
            reject(new Error(`decode response: ${e}`));
          }
        });
      }
    );
    req.on("error", (e) => reject(new Error(`request error: ${e.message}`)));
    req.write(body);
    req.end();
  });
}

// src/main.ts
var extPort = process.env.EXTENSION_PORT ?? "8080";
var signPort2 = process.env.SIGN_PORT ?? "9090";
setSignPort(signPort2);
var srv = new Server(extPort, signPort2, VERSION, register, reportState);
srv.listenAndServe();
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/der.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/secp256k1.js:
@noble/curves/abstract/edwards.js:
@noble/curves/abstract/montgomery.js:
@noble/curves/abstract/oprf.js:
@noble/curves/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
