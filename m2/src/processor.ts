const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function processTask(task: number) {
    await sleep(5000);
    return task * 2;
}