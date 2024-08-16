import  {useState,useEffect} from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // 使用相对时间插件
dayjs.extend(duration); // 使用相对时间插件
import Load from '@/components/allLoad/load'
export default function time({create}) {
    const [countdown, setCountdown] = useState<any>(null);
    useEffect(() => {
      let show = setInterval(() => {
        const time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        setCountdown(time);
      }, 1000);
      return () => clearInterval(show);
    }, []);
    const chang = (name: any) => {
        if (countdown) {
          const diff = dayjs(countdown).diff(
            dayjs.unix(name).format('YYYY-MM-DD HH:mm:ss')
          );
          const duration = dayjs.duration(diff);
          const year = duration.years();
          const month = duration.months();
          if (year) {
            return year + ' y ' + month + ' m';
          } else {
            const day = duration.days();
            if (month) {
              return month + ' m ' + day + ' d';
            } else {
              const hour = duration.hours();
              if (day) {
                return day + ' d ' + hour + ' h';
              } else {
                const minute = duration.minutes();
                if (hour) {
                  return hour + ' h ' + minute + ' m';
                } else {
                  const second = duration.seconds();
                  const tt = second.toString().length === 2 ? second : '0' + second;
                  if (minute) {
                    return minute + ' m ' + tt + ' ss';
                  } else {
                    return tt + ' ss';
                  }
                }
              }
            }
          }
        } else {
          return (
            <div style={{ display: 'flex', marginTop: '8px' }}>
              <Load />
            </div>
          );
        }
      };
  return (
    <div style={{ color: 'white', lineHeight: '2.2' }}>
            {chang(create)}
          </div>
  )
}
