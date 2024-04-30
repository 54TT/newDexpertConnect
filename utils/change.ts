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
        newNumber = `0.0${subscript}${newNumber}`;
        return newNumber
    } else {
        return number;
    }
}

export const autoConvert = (number: any) => {
    if (Number(number) >= 1000000000000) {
        return `${(number / 1000000000000).toFixed(2).replace(/\.?0*$/, '')}T`;
    } else if (Number(number) >= 1000000000) {
        return `${(number / 1000000000).toFixed(2).replace(/\.?0*$/, '')}B`;
    } else if (Number(number) >= 1000000) {
        return `${(Number(number) / 1000000).toFixed(2).replace(/\.?0*$/, '')}M`;
    } else if (Number(number) >= 1000) {
        return `${(Number(number) / 1000).toFixed(2).replace(/\.?0*$/, '')}K`;
    } else {
        return Number(number).toFixed(2).replace(/\.?0*$/, '');
    }
};

export const setMany = (text: any) => {
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
            if (Number(text) < 1 && text.toString().includes('0000')) {
                data = formatDecimal(text.toString(), 3)
                if (data.length > 10) {
                    data = data.slice(0, 6)
                }
            } else {
                data = autoConvert(Number(text))
            }
        } else {
            data = 0
        }
    }
    return data
}

export const simplify = (name: any) => {
    return name ? name.length > 13 ? name.slice(0, 4) + '...' + name.slice(-4) : name : ''
}




