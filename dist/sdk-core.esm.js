import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { getAddress } from '@ethersproject/address'
import warning from 'tiny-warning'
import _Decimal from 'decimal.js-light'
import _Big from 'big.js'
import toFormat from 'toformat'

var ChainId

;(function(ChainId) {
  ChainId[(ChainId['MAINNET'] = 65524)] = 'MAINNET'
  ChainId[(ChainId['TESTNET'] = 65525)] = 'TESTNET'
})(ChainId || (ChainId = {}))

var TradeType

;(function(TradeType) {
  TradeType[(TradeType['EXACT_INPUT'] = 0)] = 'EXACT_INPUT'
  TradeType[(TradeType['EXACT_OUTPUT'] = 1)] = 'EXACT_OUTPUT'
})(TradeType || (TradeType = {}))

var Rounding

;(function(Rounding) {
  Rounding[(Rounding['ROUND_DOWN'] = 0)] = 'ROUND_DOWN'
  Rounding[(Rounding['ROUND_HALF_UP'] = 1)] = 'ROUND_HALF_UP'
  Rounding[(Rounding['ROUND_UP'] = 2)] = 'ROUND_UP'
})(Rounding || (Rounding = {}))

var MaxUint256 = /*#__PURE__*/ JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass
  subClass.__proto__ = superClass
}

function validateAndParseAddress(address) {
  try {
    var checksummedAddress = getAddress(address)
    process.env.NODE_ENV !== 'production'
      ? warning(address === checksummedAddress, address + ' is not checksummed.')
      : void 0
    return checksummedAddress
  } catch (error) {
    process.env.NODE_ENV !== 'production' ? invariant(false, address + ' is not a valid address.') : invariant(false)
  }
}

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */

var Currency =
  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  function Currency(decimals, symbol, name) {
    !(decimals < 255)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'DECIMALS')
        : invariant(false)
      : void 0
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
/**
 * The only instance of the base class `Currency`.
 */

Currency.ETHER = /*#__PURE__*/ new Currency(18, 'ETH', 'Ether')
var ETHER = Currency.ETHER

var _WETH
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */

var Token = /*#__PURE__*/ (function(_Currency) {
  _inheritsLoose(Token, _Currency)

  function Token(chainId, address, decimals, symbol, name) {
    var _this

    _this = _Currency.call(this, decimals, symbol, name) || this
    _this.chainId = chainId
    _this.address = validateAndParseAddress(address)
    return _this
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */

  var _proto = Token.prototype

  _proto.equals = function equals(other) {
    // short circuit on reference equality
    if (this === other) {
      return true
    }

    return this.chainId === other.chainId && this.address === other.address
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */

  _proto.sortsBefore = function sortsBefore(other) {
    !(this.chainId === other.chainId)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'CHAIN_IDS')
        : invariant(false)
      : void 0
    !(this.address !== other.address)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'ADDRESSES')
        : invariant(false)
      : void 0
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  return Token
})(Currency)
/**
 * Compares two currencies for equality
 */

function currencyEquals(currencyA, currencyB) {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}
var WETH9 =
  ((_WETH = {}),
  (_WETH[ChainId.MAINNET] = /*#__PURE__*/ new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH9',
    'Wrapped Ether'
  )),
  (_WETH[ChainId.TESTNET] = /*#__PURE__*/ new Token(
    ChainId.TESTNET,
    '0x73DcdfeBe2b1Db8FAe6f0A5AA0f35C3BaDa6811A',
    18,
    'WETH9',
    'Wrapped Ether'
  )),
  _WETH)

var _toSignificantRoundin, _toFixedRounding
var Decimal = /*#__PURE__*/ toFormat(_Decimal)
var Big = /*#__PURE__*/ toFormat(_Big)
var toSignificantRounding =
  ((_toSignificantRoundin = {}),
  (_toSignificantRoundin[Rounding.ROUND_DOWN] = Decimal.ROUND_DOWN),
  (_toSignificantRoundin[Rounding.ROUND_HALF_UP] = Decimal.ROUND_HALF_UP),
  (_toSignificantRoundin[Rounding.ROUND_UP] = Decimal.ROUND_UP),
  _toSignificantRoundin)
var toFixedRounding =
  ((_toFixedRounding = {}),
  (_toFixedRounding[Rounding.ROUND_DOWN] = 0),
  (_toFixedRounding[Rounding.ROUND_HALF_UP] = 1),
  (_toFixedRounding[Rounding.ROUND_UP] = 3),
  _toFixedRounding)

var Fraction = /*#__PURE__*/ (function() {
  function Fraction(numerator, denominator) {
    if (denominator === void 0) {
      denominator = JSBI.BigInt(1)
    }

    this.numerator = JSBI.BigInt(numerator)
    this.denominator = JSBI.BigInt(denominator)
  } // performs floor division

  var _proto = Fraction.prototype

  _proto.invert = function invert() {
    return new Fraction(this.denominator, this.numerator)
  }

  _proto.add = function add(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(JSBI.BigInt(other))

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator)
    }

    return new Fraction(
      JSBI.add(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  _proto.subtract = function subtract(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(JSBI.BigInt(other))

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator)
    }

    return new Fraction(
      JSBI.subtract(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  _proto.lessThan = function lessThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(JSBI.BigInt(other))
    return JSBI.lessThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  _proto.equalTo = function equalTo(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(JSBI.BigInt(other))
    return JSBI.equal(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(JSBI.BigInt(other))
    return JSBI.greaterThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  _proto.multiply = function multiply(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(JSBI.BigInt(other))
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.numerator),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  _proto.divide = function divide(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(JSBI.BigInt(other))
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(this.denominator, otherParsed.numerator)
    )
  }

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      }
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP
    }

    !Number.isInteger(significantDigits)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, significantDigits + ' is not an integer.')
        : invariant(false)
      : void 0
    !(significantDigits > 0)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, significantDigits + ' is not positive.')
        : invariant(false)
      : void 0
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    })
    var quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits)
    return quotient.toFormat(quotient.decimalPlaces(), format)
  }

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      }
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP
    }

    !Number.isInteger(decimalPlaces)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, decimalPlaces + ' is not an integer.')
        : invariant(false)
      : void 0
    !(decimalPlaces >= 0)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, decimalPlaces + ' is negative.')
        : invariant(false)
      : void 0
    Big.DP = decimalPlaces
    Big.RM = toFixedRounding[rounding]
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format)
  }

  _createClass(Fraction, [
    {
      key: 'quotient',
      get: function get() {
        return JSBI.divide(this.numerator, this.denominator)
      } // remainder after floor division
    },
    {
      key: 'remainder',
      get: function get() {
        return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator)
      }
    }
  ])

  return Fraction
})()

var _100_PERCENT = /*#__PURE__*/ new Fraction(/*#__PURE__*/ JSBI.BigInt(100))

var Percent = /*#__PURE__*/ (function(_Fraction) {
  _inheritsLoose(Percent, _Fraction)

  function Percent() {
    return _Fraction.apply(this, arguments) || this
  }

  var _proto = Percent.prototype

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 5
    }

    return this.multiply(_100_PERCENT).toSignificant(significantDigits, format, rounding)
  }

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 2
    }

    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding)
  }

  return Percent
})(Fraction)

var Big$1 = /*#__PURE__*/ toFormat(_Big)

var CurrencyAmount = /*#__PURE__*/ (function(_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction)

  // amount _must_ be raw, i.e. in the native representation
  function CurrencyAmount(currency, amount) {
    var _this

    var parsedAmount = JSBI.BigInt(amount)
    !JSBI.lessThanOrEqual(parsedAmount, MaxUint256)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'AMOUNT')
        : invariant(false)
      : void 0
    _this =
      _Fraction.call(this, parsedAmount, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))) || this
    _this.currency = currency
    return _this
  }
  /**
   * Helper that calls the constructor with the ETHER currency
   * @param amount ether amount in wei
   */

  CurrencyAmount.ether = function ether(amount) {
    return new CurrencyAmount(ETHER, amount)
  }

  var _proto = CurrencyAmount.prototype

  _proto.add = function add(other) {
    !currencyEquals(this.currency, other.currency)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw))
  }

  _proto.subtract = function subtract(other) {
    !currencyEquals(this.currency, other.currency)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw))
  }

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN
    }

    return _Fraction.prototype.toSignificant.call(this, significantDigits, format, rounding)
  }

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN
    }

    !(decimalPlaces <= this.currency.decimals)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'DECIMALS')
        : invariant(false)
      : void 0
    return _Fraction.prototype.toFixed.call(this, decimalPlaces, format, rounding)
  }

  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      }
    }

    Big$1.DP = this.currency.decimals
    return new Big$1(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }

  _createClass(CurrencyAmount, [
    {
      key: 'raw',
      get: function get() {
        return this.numerator
      }
    }
  ])

  return CurrencyAmount
})(Fraction)

var TokenAmount = /*#__PURE__*/ (function(_CurrencyAmount) {
  _inheritsLoose(TokenAmount, _CurrencyAmount)

  // amount _must_ be raw, i.e. in the native representation
  function TokenAmount(token, amount) {
    var _this

    _this = _CurrencyAmount.call(this, token, amount) || this
    _this.token = token
    return _this
  }

  var _proto = TokenAmount.prototype

  _proto.add = function add(other) {
    !this.token.equals(other.token)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0
    return new TokenAmount(this.token, JSBI.add(this.raw, other.raw))
  }

  _proto.subtract = function subtract(other) {
    !this.token.equals(other.token)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0
    return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw))
  }

  return TokenAmount
})(CurrencyAmount)

var Price = /*#__PURE__*/ (function(_Fraction) {
  _inheritsLoose(Price, _Fraction)

  // denominator and numerator _must_ be raw, i.e. in the native representation
  function Price(baseCurrency, quoteCurrency, denominator, numerator) {
    var _this

    _this = _Fraction.call(this, numerator, denominator) || this
    _this.baseCurrency = baseCurrency
    _this.quoteCurrency = quoteCurrency
    _this.scalar = new Fraction(
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(baseCurrency.decimals)),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(quoteCurrency.decimals))
    )
    return _this
  }

  var _proto = Price.prototype

  _proto.invert = function invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator)
  }

  _proto.multiply = function multiply(other) {
    !currencyEquals(this.quoteCurrency, other.baseCurrency)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0

    var fraction = _Fraction.prototype.multiply.call(this, other)

    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator)
  } // performs floor division on overflow

  _proto.quote = function quote(currencyAmount) {
    !currencyEquals(currencyAmount.currency, this.baseCurrency)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0

    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(this.quoteCurrency, _Fraction.prototype.multiply.call(this, currencyAmount.raw).quotient)
    }

    return CurrencyAmount.ether(_Fraction.prototype.multiply.call(this, currencyAmount.raw).quotient)
  }

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6
    }

    return this.adjusted.toSignificant(significantDigits, format, rounding)
  }

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 4
    }

    return this.adjusted.toFixed(decimalPlaces, format, rounding)
  }

  _createClass(Price, [
    {
      key: 'raw',
      get: function get() {
        return new Fraction(this.numerator, this.denominator)
      }
    },
    {
      key: 'adjusted',
      get: function get() {
        return _Fraction.prototype.multiply.call(this, this.scalar)
      }
    }
  ])

  return Price
})(Fraction)

// `maxSize` by removing the last item

function sortedInsert(items, add, maxSize, comparator) {
  !(maxSize > 0)
    ? process.env.NODE_ENV !== 'production'
      ? invariant(false, 'MAX_SIZE_ZERO')
      : invariant(false)
    : void 0 // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize

  !(items.length <= maxSize)
    ? process.env.NODE_ENV !== 'production'
      ? invariant(false, 'ITEMS_SIZE')
      : invariant(false)
    : void 0 // short circuit first item add

  if (items.length === 0) {
    items.push(add)
    return null
  } else {
    var isFull = items.length === maxSize // short circuit if full and the additional item does not come before the last item

    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add
    }

    var lo = 0,
      hi = items.length

    while (lo < hi) {
      var mid = (lo + hi) >>> 1

      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1
      } else {
        hi = mid
      }
    }

    items.splice(lo, 0, add)
    return isFull ? items.pop() : null
  }
}

export {
  ChainId,
  Currency,
  CurrencyAmount,
  ETHER,
  Fraction,
  MaxUint256,
  Percent,
  Price,
  Rounding,
  Token,
  TokenAmount,
  TradeType,
  WETH9,
  currencyEquals,
  sortedInsert,
  validateAndParseAddress
}
//# sourceMappingURL=sdk-core.esm.js.map
