import React from 'react';

const Timer = () => {
    // let [seconds, setSeconds] = useState(localStorage.getItem('seconds') || 0);
    
    // useEffect(() => {
    //     localStorage.setItem('seconds', seconds);
    // }, [seconds]);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setSeconds(seconds => parseInt(seconds) + 1);
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);
    // const minutes = Math.floor(seconds / 60);
    // const remainingSeconds = seconds % 60;
    // const time = `${minutes} minutes and ${remainingSeconds} seconds`;

    // return <div>Session: {time} (Max: 20 minutes)</div>;
    return <div>You can explore search results on your assigned topic as long as you want to. <br></br>Once you feel that you are done, please close this tab and continue with the study.</div>;
};

export default Timer;