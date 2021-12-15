import { patterns } from "./variables";
import _ from "lodash";

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/* 只能有中文*/
export function validateChinese(str) {
    const reg = /^[\Α-\￥]+$/i
    return reg.test(str)
}

/* 禁止有中文*/
export function validateNoChinese(str) {
    const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
    return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,10}))$/
    return re.test(email)
}

// 验证身份证号方法
export function validateIdCard(idcard) {
    if (!idcard) {
        return true;
    }
    const area = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: 'xinjiang',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
    };
    let Y, JYM;
    let S, M;
    let ereg;
    let idcard_array = [];
    idcard_array = idcard.split('');
    if (area[parseInt(idcard.substr(0, 2))] == null) {
        return false;
    }
    switch (idcard.length) {
        case 15:
            ereg = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;// 测试出生日期的合法性
            if (ereg.test(idcard)) {
                return true;
            } else {
                return false;
            }
        case 18:
            ereg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/;// 平年出生日期的合法性正则表达式
            if (ereg.test(idcard)) {
                return true;
            } else {
                return false;
            }
        default:
            return false;
    }
}

function createIdCardValidator(msg) {
    return function (rule, value, callback) {
        if (!validateIdCard(value)) {
            callback(new Error(`${ msg }不正确`));
        } else {
            callback();
        }
    }
}

export function createRules({ msg = '', ...paramsRules }, trigger = 'change', type) {
    const defaultRules = {
        required: {
            required: true,
            message: `${ msg }必填`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        max: {
            max: 100,
            message: `${ msg }最大长度为%s个字`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        min: {
            min: 0,
            message: `${ msg }最小长度为%s个字`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        len: {
            len: 100,
            message: `${ msg }为%s个字符`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        idCard: {
            validator: createIdCardValidator(msg),
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        phone: {
            pattern: patterns.phone,
            message: `${ msg }不正确`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        mobile: {
            pattern: patterns.mobile,
            message: `${ msg }不正确`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        email: {
            type: 'email',
            message: `${ msg }不正确`,
            // whitespace: true,
            trigger,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        integer: {
            pattern: patterns.integer,
            message: `${ msg }必需为非负整数`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        float: {
            pattern: patterns.float,
            message: `${ msg }只能为整数或小数`,
            // whitespace: true,
            trigger,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        integer0: {
            pattern: patterns.integer0,
            message: `${ msg }只能为大于0的整数`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        EXP_ENG_NUM_1: {
            pattern: patterns.EXP_ENG_NUM_1,
            message: `${ msg }只允许字母、数字、下划线组成`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        z0: {
            pattern: patterns.z0,
            message: `${ msg }只允许字母、数字组成`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        a0cn: {
            pattern: patterns.a0cn,
            message: `${ msg }只允许字母、数字、中文组成`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        EXP_ENG_NUM_2: {
            pattern: patterns.EXP_ENG_NUM_2,
            message: `${ msg }只允许大小写字母、数字、“_”和“-”`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        EXP_ENG_NUM_3: {
            pattern: patterns.EXP_ENG_NUM_3,
            message: `${ msg }只允许大小写字母、数字、“_”、“-”“,”和“()”`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        EXP_ENG_NUM_4: {
            pattern: patterns.EXP_ENG_NUM_4,
            message: `${ msg }只允许大小写字母、数字、“_”、“-”和“()”`,
            whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        EXP_ENG_NUM_5: {
            pattern: patterns.EXP_ENG_NUM_5,
            message: `${ msg }只允许大小写字母、数字、“_”和“()”`,
            // whitespace: true,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        numberFloatUp: {
            pattern: patterns.numberFloatUp,
            message: `${ msg }必需为正数，且最多有两位小数`,
            trigger,
            type,
            transform(value) {
                  if (_.isArray(value)) {
                    return value
                }
                return _.trim(value);
            }
        },
        pattern: {
            pattern: paramsRules.pattern,
            message: `${ msg }不正确`,
            trigger,
            type
        }
    };
    const rulesArr = [];
    if (paramsRules.number && paramsRules.max) {
        delete defaultRules.max.message;
        defaultRules.max.type = 'number';
        defaultRules.max.validator = function (rule, value, callback) {
            if (!patterns.float.test(value) && value) {
                callback('请输入数字')
            } else if (_.toNumber(value) > paramsRules.max) {
                callback(`${ msg }最大为${ paramsRules.max }`)
            } else {
                callback()
            }
        };
    }
    if (paramsRules.number && paramsRules.min) {
        delete defaultRules.min.message;
        defaultRules.min.type = 'number';
        defaultRules.min.validator = function (rule, value, callback) {
            if (!patterns.float.test(value) && value) {
                callback('请输入数字')
            } else if (_.toNumber(value) < paramsRules.min) {
                callback(`${ msg }最小为${ paramsRules.min }`)
            } else {
                callback()
            }
        };
    }

    Object.keys(paramsRules).map(key => {
        if (defaultRules[key] && defaultRules[key].message && defaultRules[key].message.indexOf('%s') > 0) {
            if (Number.isInteger(paramsRules[key])) {
                defaultRules[key].message = defaultRules[key].message.replace('%s', paramsRules[key])
            } else {
                defaultRules[key].message = defaultRules[key].message.replace('%s', defaultRules[key][key])
            }
        }
        const newRules = {
            ...defaultRules[key],
            [key]: paramsRules[key]
        };
        rulesArr.push(newRules)
    });
    return rulesArr;
}
