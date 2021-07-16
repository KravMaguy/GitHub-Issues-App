import { useState, useEffect } from "react";

const Loading = () => {
    const [count, setCount] = useState<number>(0)

    useEffect(() => {
    let loadingInterval = setTimeout(() => setCount(prevCount=>prevCount+1), 200);
    return () => { clearTimeout(loadingInterval);};
    },[count]);

    return (<div>Loading{new Array(count % 5).join('.')}</div>);
}
 
export default Loading;