import {message} from 'antd'

export function MessageAll(status: string, data: string) {
    const config = {
        content: data,
        duration: 5,
        key: data,
        onClick: () => {
            message.destroy(data)
        }
    }
    // @ts-ignore
    message[status](config)
}

