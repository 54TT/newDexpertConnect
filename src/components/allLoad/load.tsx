import { useState, useEffect } from 'react';
import './index.less';

export default function load({ show }: any) {
  const [status, setStatus] = useState<any>(['deep', 'Shallow', 'light']);
  const change = () => {
    let abc: any = [...status];
   const yy  = setInterval(function () {
      const at = [...abc.slice(0, -1)];
      const end = abc.pop();
      const now = [end].concat(at);
      abc = now;
      setStatus(now);
    }, 500);
    return yy
  };
  useEffect(() => {
   const le =  change();
   return ()=>clearInterval(le)
  }, []);
  return (
    <>
      {show ? (
        <div className="Ellipsis">
          {status.map((i: string, index: number) => {
            if (show === 'down') {
              return (
                <img
                  key={index}
                  src={
                    i === 'deep'
                      ? '/loadOne.svg'
                      : i === 'Shallow'
                        ? '/loadTwo.svg'
                        : '/loadThree.svg'
                  }
                  alt=""
                />
              );
            } else {
              return (
                <img
                  key={index}
                  src={
                    i === 'deep'
                      ? '/loadUpOne.svg'
                      : i === 'Shallow'
                        ? '/loadUpTwo.svg'
                        : '/loadUpThree.svg'
                  }
                  alt=""
                />
              );
            }
          })}
        </div>
      ) : (
        <div className="Ellipsis">
          <p className={status[0]}></p>
          <p className={status[1]}></p>
          <p className={status[2]}></p>
        </div>
      )}
    </>
  );
}
