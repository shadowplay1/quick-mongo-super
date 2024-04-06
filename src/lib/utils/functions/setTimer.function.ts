export const setAsyncFunctionTimer = (fn: () => Promise<any>, timer: number): Promise<boolean> => {
    let timeout: NodeJS.Timeout

    const sleep = (timer: number): Promise<void> => new Promise(resolve => {
        timeout = setTimeout(resolve, timer)
    })

    const functionResult = new Promise<boolean>(resolve => {
        try {
            fn().then(() => {
                resolve(true)
                clearTimeout(timeout)
            }).catch(() => {
                resolve(false)
                clearTimeout(timeout)
            })
        } catch {
            resolve(false)
        }
    })

    const functionTimeout = new Promise<false>(resolve => {
        sleep(timer).then(() => {
            resolve(false)
            clearTimeout(timeout)
        })
    })

    return Promise.race([functionResult, functionTimeout])
}
