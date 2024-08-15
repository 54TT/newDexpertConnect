import {BigNumber} from 'bignumber.js';
import {setMany} from "../../utils/change"

// bignumber转换number
export const BNtoNumber=(bn?,decimals?)=>{
    let num;

    if(!decimals){
      num = new BigNumber(bn);
    }else{
      num = BigNumber(bn).dividedBy(new BigNumber(10).pow(decimals))
    }
    let absNumber = num.abs();
    let formattedNumber;
    let unit:string;

  if (absNumber.lte(0.1)) { 
    return setMany(absNumber.toString()).replace(/\.?0+$/, '')
  } else if (absNumber.gte(1e9)) { // Billions
    formattedNumber = absNumber.dividedBy(1e9).toFixed(2);
    unit = 'B';
  } else if (absNumber.gte(1e6)) { // Millions
    formattedNumber = absNumber.dividedBy(1e6).toFixed(2);
    unit = 'M';
  } else if (absNumber.gte(1e3)) { // Thousands
    formattedNumber = absNumber.dividedBy(1e3).toFixed(2);
    unit = 'K';
  } else {
    formattedNumber = absNumber.toFixed(2);
    unit = '';
  }
  if (formattedNumber.includes('.')) {
    formattedNumber = formattedNumber.replace(/\.?0+$/, '');
  }
  
  return `${formattedNumber}${unit}`;
    // if(num.modulo(1).isZero()){
    //   return num.toNumber().toString()
    // }else{
    //   return num.toNumber().toFixed(6).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '')
    // }
  }