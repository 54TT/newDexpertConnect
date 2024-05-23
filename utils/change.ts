
import dayjs from 'dayjs'
export const formatDecimal = (number: any, count: any) => {
    const getSubscript = (number: any) => {
        // 定义下标字符的 Unicode 起始值（0 对应 U+2080）
        const subscriptStart = 0x2080;
        // 将数字转换为字符串
        const numberString = number.toString();
        // 初始化一个空字符串来存储下标字符
        let subscript = '';

        // 遍历数字字符串中的每个数字
        for (let i = 0; i < numberString.length; i++) {
            const digit = numberString.charAt(i);
            if (/[0-9]/.test(digit)) {
                // 如果字符是数字，则计算 Unicode 下标字符并追加到结果中
                const unicodeValue = subscriptStart + parseInt(digit, 10);
                subscript += String.fromCharCode(unicodeValue);
            } else {
                // 如果字符不是数字，则直接追加到结果中
                subscript += digit;
            }
        }
        return subscript;
    }
    let numberStr = (number.toString().split(".")[1]).toString();
    let count0 = 0;
    for (let i = 0; i < numberStr.length; i++) {
        let str = numberStr[i];
        if (str === "0") {
            count0++;
        } else {
            break;
        }
    }
    let newNumber = numberStr.slice(count0, numberStr.length);
    if (count0 >= count) {
        const subscript = getSubscript(count0);
        newNumber = `0.0${subscript}${Number(newNumber) ? newNumber.slice(0, 4) : newNumber}`;
        return newNumber
    } else {
        if (Number(number) > 0) {
            return number.slice(0, 8);
        } else {
            return number;
        }
    }
}

export const autoConvert = (number: any) => {
    if (Number(number) >= 1000000000000) {
        return `${(number / 1000000000000).toFixed(2).replace(/\.?0*$/, '')} T`;
    } else if (Number(number) >= 1000000000) {
        return `${(number / 1000000000).toFixed(2).replace(/\.?0*$/, '')} B`;
    } else if (Number(number) >= 1000000) {
        return `${(Number(number) / 1000000).toFixed(2).replace(/\.?0*$/, '')} M`;
    } else if (Number(number) >= 1000) {
        return `${(Number(number) / 1000).toFixed(2).replace(/\.?0*$/, '')} K`;
    } else {
        if (Number(number) < 1) {
            return Number(number).toFixed(6).replace(/\.?0*$/, '');
        } else {
            return Number(number).toFixed(2).replace(/\.?0*$/, '');
        }
    }
};

export const setMany = (text: any, countdown?: string, languageChange?: string) => {
    // 倒计时
    if (countdown && languageChange) {
        if (text && countdown) {
            // 判断有几个月
            const abc = dayjs(countdown).diff(dayjs(), 'month')
            //  是否过了今天
            const at = dayjs(countdown).isAfter(dayjs())
            if (at) {
                if (abc) {
                    if (languageChange === 'zh_CN') {
                        return text + '——' + countdown
                    } else {
                        return text.slice(8, 10) + '/' + text.slice(5, 7) + '/' + text.slice(0, 4) + '——' + countdown.slice(8, 10) + '/' + countdown.slice(5, 7) + '/' + countdown.slice(0, 4)
                    }
                } else {
                    const date = dayjs(countdown).diff(dayjs())
                    return Date.now() + Number(date)
                }
            } else {
                return '00:00:00 00:00:00'
            }
        } else {
            return '00:00:00 00:00:00'
        }
    } else {
        //  简化数字
        let data: any
        if (text.toString().includes('e-')) {
            const v = Number(text).toFixed(100).replace(/\.?0+$/, "")
            data = formatDecimal(v, 3)
            if (data.length > 10) {
                data = data.slice(0, 8)
            }
        } else if (text.toString().includes('e+')) {
            const nu = Number(text)
            data = autoConvert(Number(nu))
        } else {
            if (text && Number(text)) {
                if (Number(text) < 1 && text.toString().includes('0.000')) {
                    data = formatDecimal(text.toString(), 3)
                } else {
                    data = autoConvert(Number(text))
                }
            } else {
                data = 0
            }
        }
        return data
    }
}

export const simplify = (name: any) => {
    return name ? name.length > 12 ? name.slice(0, 4) + '...' + name.slice(-4) : name : ''
}




